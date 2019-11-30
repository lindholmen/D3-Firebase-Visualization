const data = [{ width: 200, height: 400, fill: "purple", x: 50 }];

const svg = d3.select("svg");

const rect = svg
  .select("rect")
  .data(data)
  .attr("width", (d, i, n) => {
    // arrow function. n[i] refers to the rect
    console.log(n[i]);
    return d.width;
  })
  .attr("height", function(d) {
    // this refers to the same rect
    console.log(this);
    return d.height;
  })
  // this is a shorten version of arrow function if written in the same line, get rid of bracket and 'return'
  .attr("fill", d => d.fill)
  .attr("x", d => d.x)
  .attr("y", d => d.y);
