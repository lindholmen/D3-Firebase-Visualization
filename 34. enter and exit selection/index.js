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

graph.append("rect");
graph.append("rect");
graph.append("rect");
graph.append("rect");
graph.append("rect");
graph.append("rect");
graph.append("rect");

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0,${graphHeight})`);
const yAxisGroup = graph.append("g");

var data = [];
db.collection("dishes")
  .get()
  .then(res => {
    res.docs.forEach(doc => {
      data.push(doc.data());
    });

    //console.log(data);
    // // join the data to rects

    const rects = graph.selectAll("rect").data(data); // create rect in the group "graph"
    console.log(rects);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.orders)])
      .range([graphHeight, 0]); // need to flip the scale so numbers go from high to low top down!!!
    //console.log(y(400));

    // min, max, extent which is [min, max]
    const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);
    const extent = d3.extent(data, d => d.orders);
    //console.log(min, max, extent);

    // cycle through every object in the array and generate an array with the each object's "name"
    const x = d3
      .scaleBand()
      .domain(data.map(item => item.name))
      .range([0, 500])
      .paddingInner(0.2)
      .paddingOuter(0.2);
    //console.log(x("veg curry")); // print out this bar's x coordiante
    //console.log("width of the bar:", x.bandwidth());

    // rects
    //   .attr("width", x.bandwidth())
    //   .attr("height", d => graphHeight - y(d.orders)) // since we flip the y scale so the true height is graphHeight - existing height
    //   .attr("fill", "orange")
    //   .attr("x", d => x(d.name))
    //   .attr("y", d => y(d.orders)); // move all the bars to bottom, and shift distance is exactly y(d.orders)

    // // append the enter selection to the DOM
    // rects
    //   .enter()
    //   .append("rect")
    //   .attr("width", x.bandwidth())
    //   .attr("height", d => graphHeight - y(d.orders))
    //   .attr("fill", "orange")
    //   .attr("x", d => x(d.name))
    //   .attr("y", d => y(d.orders));

    // // create the axes
    // const xAxis = d3.axisBottom(x);
    // const yAxis = d3
    //   .axisLeft(y)
    //   .ticks(10)
    //   .tickFormat(d => d + " orders");

    // xAxisGroup.call(xAxis);
    // yAxisGroup.call(yAxis);

    // xAxisGroup
    //   .selectAll("text")
    //   .attr("transform", `rotate(-40)`)
    //   .attr("text-anchor", "end")
    //   .attr("fill", "orange");
  });
