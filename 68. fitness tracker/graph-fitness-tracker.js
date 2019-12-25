const margin = { top: 40, right: 20, bottom: 50, left: 100 };
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

// scale using scaleTime() for x
const xFitness = d3.scaleTime().range([0, graphWidth]);
const yFitness = d3.scaleLinear().range([graphHeight, 0]);

const xAxisGroupFitness = lineGraphHeight
  .append("g")
  .attr("class", "x-axis-fitness")
  .attr("transform", `translate(0,${graphHeight})`);

const yAxisGroupFitness = lineGraph.append("g").attr("class", "y-axis-fitness");

const xAxisFitness = d3.axisBottom(xFitness);
const yAxisFitness = d3
  .axisLeft(yFitness)
  .ticks(10)
  .tickFormat(d => d + " km");

// update
const update = data => {};

// data array and firestore
var fitnessData = [];

db.collection("activities").onSnapshot(res => {
  res.docChanges().forEach(change_item => {
    const doc = { ...change_item.doc.data(), id: change_item.doc.id };
    console.log(doc);
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
