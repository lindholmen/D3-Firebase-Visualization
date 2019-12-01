const data = [
  { width: 200, height: 400, fill: "purple", x: 50 },
  { width: 200, height: 300, fill: "blue", x: 300 },
  { width: 200, height: 300, fill: "red", x: 550 }
];

const svg = d3.select("svg");

var rect = svg
  .selectAll("rect")
  .data(data) // automatically assign each element in the data to each of the element in svg, i.e. rect
  //but only set the attr for the rect that already in the dom
  .attr("width", d => d.width)
  .attr("height", d => d.height)
  .attr("fill", d => d.fill)
  .attr("x", d => d.x);

console.log("before accessing to enter selection:", rect);

// for each of the virtual element in the enter selection, create a rect and append to the dom. And set the attr.
rect
  .enter()
  .append("rect")
  .attr("width", d => d.width)
  .attr("height", d => d.height)
  .attr("fill", d => d.fill)
  .attr("x", d => d.x);
