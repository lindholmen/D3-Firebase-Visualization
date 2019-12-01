const svg = d3.select("svg");

d3.json("planets.json").then(data => {
  const circs = svg.selectAll("circle").data(data);

  // add attr to the circles that are already in the DOM (but does nothing in this case)
  circs
    .attr("cy", 200)
    .attr("cx", d => d.distance)
    .attr("r", d => d.radius)
    .attr("fill", d => d.fill);

  // go the enter selection and append each of the virtual elements to the DOM
  circs
    .enter()
    .append("circle")
    .attr("cy", 200)
    .attr("cx", d => d.distance)
    .attr("r", d => d.radius)
    .attr("fill", d => d.fill);
});
