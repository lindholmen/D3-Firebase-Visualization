const svg = d3.select("svg");

d3.json("menu.json").then(data => {
  // join the data to rects

  const rects = svg.selectAll("rect").data(data);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.orders)])
    .range([0, 500]);
  console.log(y(400));

  // min, max, extent which is [min, max]
  const min = d3.min(data, d => d.orders);
  const max = d3.max(data, d => d.orders);
  const extent = d3.extent(data, d => d.orders);
  console.log(min, max, extent);

  // cycle through every object in the array and generate an array with the each object's "name"
  const x = d3
    .scaleBand()
    .domain(data.map(item => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);
  console.log(x("veg curry")); // print out this bar's x coordiante
  console.log("width of the bar:", x.bandwidth());

  rects
    .attr("width", x.bandwidth())
    .attr("height", d => y(d.orders))
    .attr("fill", "orange")
    .attr("x", d => x(d.name));

  // append the enter selection to the DOM
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth())
    .attr("height", d => y(d.orders))
    .attr("fill", "orange")
    .attr("x", d => x(d.name));
});
