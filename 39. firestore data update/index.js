const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// create the group with specified width and height
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0,${graphHeight})`);
const yAxisGroup = graph.append("g");

// scales (fixed properties that do not rely on data)
const y = d3.scaleLinear().range([graphHeight, 0]); // need to flip the scale so numbers go from high to low top down!!!
const x = d3
  .scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(10)
  .tickFormat(d => d + " orders");

// update x axis text
xAxisGroup
  .selectAll("text")
  .attr("transform", `rotate(-40)`)
  .attr("text-anchor", "end")
  .attr("fill", "orange");

const t = d3.transition().duration(1000); // make it simple to update

// update function
const update = data => {
  // 1. update domain in scales(properties that do rely on data)
  y.domain([0, d3.max(data, d => d.orders)]);
  x.domain(data.map(item => item.name));

  // 2. join data to elements
  const rects = graph.selectAll("rect").data(data); // create rect in the group "graph"
  console.log(rects);

  //3. remove the unwanted shapes
  rects.exit().remove();

  //4. updated current attr of elements that already in the dom
  rects
    .attr("width", x.bandwidth())
    .attr("fill", "orange")
    .attr("x", d => x(d.name));
  // comment because use merge method
  // .transition(t)
  // .attr("y", d => y(d.orders)) // move all the bars to bottom, and shift distance is exactly y(d.orders)
  // .attr("height", d => graphHeight - y(d.orders));

  //5. append the enter selection to the dom
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    // .attr("y", graphHeight)
    .merge(rects) // anything below will apply both elements already in dom and enter selection
    .transition(t)
    .attrTween("width", widthTween)
    .attr("y", d => y(d.orders))
    .attr("height", d => graphHeight - y(d.orders));

  //6. call axes based on the new data
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

var data = [];
// fires everytime there is a change in firestore
db.collection("dishes").onSnapshot(res => {
  //console.log(res.docChanges()); // collections of the change items
  res.docChanges().forEach(change_item => {
    const doc = { ...change_item.doc.data(), id: change_item.doc.id }; // this is actual data item
    console.log("doc is:", doc);
    console.log(data);
    switch (change_item.type) {
      case "added":
        data.push(doc);
        break;
      case "removed":
        //if true then remain in the array
        data = data.filter(item => item.id != doc.id);
        // if (index > -1) {
        //   data.splice(index, 1);
        // }
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

const widthTween = d => {
  // 0 表示starting position, d.bandwidth()为ending position, create interpolation function
  let i = d3.interpolate(0, x.bandwidth());
  // return a function that receives time ticket:
  return function(t) {
    return i(t); // t is from 0 to 1
  };
};
