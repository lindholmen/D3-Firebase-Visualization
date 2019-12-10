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
    .attr("height", d => graphHeight - y(d.orders)) // since we flip the y scale so the true height is graphHeight - existing height
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.orders)); // move all the bars to bottom, and shift distance is exactly y(d.orders)

  //5. append the enter selection to the dom
  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth())
    .attr("height", d => graphHeight - y(d.orders))
    .attr("fill", "orange")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.orders));

  //6. call axes based on the new data
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

var data = [];
db.collection("dishes")
  .get()
  .then(res => {
    res.docs.forEach(doc => {
      data.push(doc.data());
    });

    update(data);

    d3.interval(() => {
      //data[0].orders += 50;
      data.pop();
      update(data);
    }, 1000);

    // // min, max, extent which is [min, max]
    // const min = d3.min(data, d => d.orders);
    // const max = d3.max(data, d => d.orders);
    // const extent = d3.extent(data, d => d.orders);
    // //console.log(min, max, extent);
  });
