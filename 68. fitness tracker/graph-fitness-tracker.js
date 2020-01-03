const margin = { top: 20, right: 20, bottom: 60, left: 100 };
const lineGraphWidth = 560 - margin.right - margin.left;
const lineGraphHeight = 400 - margin.top - margin.bottom;

const fitnessSVG = d3
  .select(".canvas")
  .append("svg")
  .attr("width", lineGraphWidth + margin.right + margin.left)
  .attr("height", lineGraphHeight + margin.top + margin.bottom);

const lineGraph = fitnessSVG
  .append("g")
  .attr("width", lineGraphWidth)
  .attr("height", lineGraphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

// create scale using scaleTime() for x and scaleLinear() for y
const xFitness = d3.scaleTime().range([0, lineGraphWidth]);
const yFitness = d3.scaleLinear().range([lineGraphHeight, 0]);

// create the axes
const xAxisFitness = d3
  .axisBottom(xFitness)
  .ticks(5)
  .tickFormat(d3.timeFormat("%b %d"));
const yAxisFitness = d3
  .axisLeft(yFitness)
  .ticks(5)
  .tickFormat(d => d + " m");

// create axis group
const xAxisGroupFitness = lineGraph
  .append("g")
  .attr("class", "x-axis-fitness")
  .attr("transform", `translate(0,${lineGraphHeight})`);
const yAxisGroupFitness = lineGraph.append("g").attr("class", "y-axis-fitness");

// d3 line generator
const line = d3
  .line()
  .x(function(d) {
    return xFitness(new Date(d.date));
  })
  .y(function(d) {
    return yFitness(d.distance);
  });

// append path elmenet for line
const path = lineGraph.append("path");

// create dotted line group
const dottedLineGroup = lineGraph
  .append("g")
  .attr("class", "lines")
  .style("opacity", 0);

const xdottedLine = dottedLineGroup
  .append("line")
  .attr("stroke", "#aaa")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4);

const ydottedLine = dottedLineGroup
  .append("line")
  .attr("stroke", "#aaa")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4);

// tooltip
const tip = d3
  .tip()
  .attr("class", "tip card")
  .html(d => {
    let content = `<div class="cause_name"> ${d.distance} </div>`;
    content += `<div class="delete"> Click slice to delete </div>`;
    console.log(content);
    return content;
  });

lineGraph.call(tip);

// update
const update = data => {
  data = data.filter(item => item.activity == activity);
  // 0. sort data based on date (otherwith drawline will have problem)
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 1. update domain in scales(properties that do rely on data)
  xFitness.domain(d3.extent(data, d => new Date(d.date)));
  yFitness.domain([0, d3.max(data, d => d.distance)]);

  //2  update path data but must pass in array data
  path
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", 2)
    .attr("d", line);

  // 3. create circles for objects
  const circles = lineGraph.selectAll("circle").data(data);

  // 4.remove unwanted circles
  circles.exit().remove();

  // 5. update existing points
  circles
    .attr("cx", d => xFitness(new Date(d.date)))
    .attr("cy", d => yFitness(d.distance));

  // 6. add new points
  circles
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("cx", d => xFitness(new Date(d.date)))
    .attr("cy", d => yFitness(d.distance))
    .attr("fill", "#ccc");

  lineGraph
    .selectAll("circle")
    .on("mouseover", (d, i, n) => {
      tip.show(d, n[i]);
      d3.select(n[i])
        .transition()
        .duration(300)
        .attr("r", 16)
        .attr("fill", "#fff");

      dottedLineGroup.style("opacity", 1);
      xdottedLine
        .attr("x1", 0)
        .attr("x2", xFitness(new Date(d.date)))
        .attr("y1", yFitness(d.distance))
        .attr("y2", yFitness(d.distance));

      ydottedLine
        .attr("x1", xFitness(new Date(d.date)))
        .attr("x2", xFitness(new Date(d.date)))
        .attr("y1", yFitness(d.distance))
        .attr("y2", lineGraphHeight);
    })
    .on("mouseout", (d, i, n) => {
      tip.hide(d, n[i]);
      d3.select(n[i])
        .transition()
        .duration(300)
        .attr("r", 8)
        .attr("fill", "#ccc");
      dottedLineGroup.style("opacity", 0);
    })
    .on("click", (d, i, n) => {
      //console.log(d);
      const id = d.id;
      tip.hide(d, n[i]);
      dottedLineGroup.style("opacity", 0);

      db.collection("activities")
        .doc(id)
        .delete();
    });

  // 7. call axes and update axis group
  xAxisGroupFitness.call(xAxisFitness);
  yAxisGroupFitness.call(yAxisFitness);

  xAxisGroupFitness
    .selectAll("text")
    .attr("transform", `rotate(-40)`)
    .attr("text-anchor", "end");
};

// data array and firestore
let fitnessData = [];

db.collection("activities").onSnapshot(res => {
  res.docChanges().forEach(change_item => {
    const doc = { ...change_item.doc.data(), id: change_item.doc.id };
    //console.log(doc);
    switch (change_item.type) {
      case "added":
        fitnessData.push(doc);
        break;
      case "removed":
        fitnessData = fitnessData.filter(item => item.id != doc.id);
        break;
      case "modified":
        var index = fitnessData.findIndex(item => item.id == doc.id);
        fitnessData[index] = doc;
        break;
      default:
        break;
      // default
    }
  });
  update(fitnessData);
});
