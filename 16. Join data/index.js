const data = [
  { width: 200, height: 400, fill: "purple", x: 50 },
  { width: 200, height: 300, fill: "blue", x: 300 }
];

const svg = d3.select("svg");

const rect = svg
  .selectAll("rect")
  .data(data)
  .attr("width", function(d, i, n) {
    console.log(d);
    console.log(i);
    console.log(n);
    return d.width;
  }) // i is index 0 or 1 and n is current selection [rect, rect]
  .attr("height", function(d) {
    return d.height;
  })
  .attr("fill", function(d) {
    return d.fill;
  })
  .attr("x", function(d) {
    return d.x;
  })
  .attr("y", function(d) {
    return d.y;
  });
