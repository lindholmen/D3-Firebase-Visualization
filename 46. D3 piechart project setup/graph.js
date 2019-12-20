const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 250)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x},${cent.y})`);

// create the pie generator function to calculate the angle based on data
const pie = d3
  .pie()
  .sort(null)
  .value(d => d.case_number);

// const angles = pie([
//   {
//     cause_name: "A",
//     case_number: 500
//   },
//   {
//     cause_name: "A",
//     case_number: 300
//   },
//   {
//     cause_name: "A",
//     case_number: 200
//   }
// ]);

// arc path generator
const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

//console.log(arcPath(angles[0])); // this is the quote str inside path d = "..."

// Set ordinal scale as output range
// d3["schemeSet3"] return an array of different colours
const colour = d3.scaleOrdinal(d3["schemeSet3"]);

// legend set up
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40},10)`);

const legend = d3
  .legendColor()
  .shape("circle")
  .shapePadding(10)
  .scale(colour);

// tooltip set up
const tip = d3
  .tip()
  .attr("class", "tip card")
  .html(d => {
    let content = `<div class="cause_name"> ${d.data.cause_name} </div>`;
    content += `<div class="case_number"> ${d.data.case_number} </div>`;
    content += `<div class="delete"> Click slice to delete </div>`;
    console.log(content);
    return content;
  });

graph.call(tip);

// update
const update = data => {
  //1.update the domain
  colour.domain(data.map(item => item.cause_name));

  //1.x update and call legend:
  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("fill", "white");

  //2. join pie data *(enhanced ddata) to path element
  const paths = graph.selectAll("path").data(pie(data));
  //console.log(paths.enter());
  console.log(pie(data));

  //3. remove the unwanted shapes
  paths
    .exit()
    .transition()
    .duration(750)
    .attrTween("d", arcTweenExit)
    .remove();

  //4. updated the current attr in the dom
  paths
    .attr("d", d =>
      // this d is each __data__ in the array
      {
        //console.log(d);
        return arcPath(d); // 也可以忽略d, 直接写arcPath
      }
    )
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  //5. append the enter selection
  paths
    .enter()
    .append("path")
    .attr("class", "arc") // insert an arc class, maybe used later
    .attr("d", d =>
      // this d is each __data__ in the array
      {
        //console.log(d);
        return arcPath(d); // 也可以忽略d, 直接写arcPath
      }
    )
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", d => colour(d.data.cause_name))
    .each(function(d) {
      this._current = d;
    }) // apply function on each of element
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter); // Using this can skip setting d attr using arcPath above

  // add event listener
  graph
    .selectAll("path")
    .on("mouseover", (d, i, n) => {
      tip.show(d, n[i]); // n[i] equals to this.
      handlemouseover(d, i, n);
    })
    .on("mouseout", (d, i, n) => {
      tip.hide(d, n[i]);
      handlemouseout(d, i, n);
    })
    .on("click", d => {
      //console.log(d);
      const id = d.data.id;
      db.collection("accidents")
        .doc(id)
        .delete();
    });
};

// data array and firestore
var data = [];

db.collection("accidents").onSnapshot(res => {
  res.docChanges().forEach(change_item => {
    const doc = { ...change_item.doc.data(), id: change_item.doc.id };

    switch (change_item.type) {
      case "added":
        data.push(doc);
        break;
      case "removed":
        data = data.filter(item => item.id != doc.id);
        break;
      case "modified":
        var index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      default:
        break;
      // default
    }
  });
  update(data);
});

const arcTweenEnter = d => {
  // 扇形区域：starting position d.endAngle, ending postion is startAngel
  // ending postion is changing all the time, after t(ticket) it will become i(t),
  // then use arcPath to sett d attr
  var i = d3.interpolate(d.endAngle, d.startAngle);
  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = d => {
  var i = d3.interpolate(d.startAngle, d.endAngle);
  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// use this
function arcTweenUpdate(d) {
  // d is updated data, _current is the old data
  //console.log(this._current, d);
  //interpolate between the two objects
  var i = d3.interpolate(this._current, d); // because we dont know if it going to shrink or increase
  this._current = i(1);

  return function(t) {
    return arcPath(i(t));
  };
}

// event handlers
// d is the enhanced data, i is index, n is all "path" elements.
const handlemouseover = (d, i, n) => {
  //console.log(d);
  //console.log(n[i]);
  d3.select(n[i])
    .transition("new_transition_name_not_to_interfere_with_other_transition")
    .duration(500)
    .attr("fill", "#fff");
};

const handlemouseout = (d, i, n) => {
  d3.select(n[i])
    .transition("new_transition_name_not_to_interfere_with_other_transition")
    .duration(500)
    .attr("fill", d => colour(d.data.cause_name));
};
