const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
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

// Set ordinal scale

// update
const update = data => {
  //console.log(data);

  //join pie data to path element
  const paths = graph.selectAll("path").data(pie(data));

  //console.log(paths.enter());
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
    .attr("stroke-width", 3);
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
