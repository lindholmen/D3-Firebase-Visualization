const svg2 = d3
  .select("#canvas2")
  .append("svg")
  .attr("width", 550)
  .attr("height", 450);

margin2 = { right: 20, bottom: 150, left: 100, top: 20 };
bargraphHeight = 450 - margin2.top - margin2.bottom;
bargraphWidth = 550 - margin2.right - margin2.left;

// add barchart to dom
bargraph = svg2
  .append("g")
  .attr("width", bargraphWidth)
  .attr("height", bargraphHeight)
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

// axis initialisation
xAxisGroup2 = bargraph
  .append("g")
  .attr("transform", `translate(0,${bargraphHeight})`);
yAxisGroup2 = bargraph.append("g");

// scale initialisation
const barY = d3.scaleLinear().range([bargraphHeight, 0]);
const barX = d3
  .scaleBand()
  .range([0, 400])
  .paddingInner(0.2)
  .paddingOuter(0.2);

xAxis2 = d3.axisBottom(barX);
yAxis2 = d3
  .axisLeft(barY)
  .ticks(5)
  .tickFormat(d => d + " pcs");

t2 = d3.transition().duration(1000);

// update function
const update2 = data => {
  //1. update domain
  barY.domain([0, d3.max(data, d => d.publicationnumber)]);
  barX.domain(data.map(item => item.publicationtype));

  //2. join data
  const rects2 = bargraph.selectAll("rect").data(data);
  console.log(rects2);

  //3. remove unwanted
  rects2.exit().remove();

  //4. updated current attr of elements that already in the dom
  rects2
    .attr("width", barX.bandwidth())
    .attr("fill", "green")
    .attr("x", d => barX(d.publicationtype))
    .transition(t2)
    .attr("y", d => barY(d.publicationnumber))
    .attr("height", d => bargraphHeight - barY(d.publicationnumber));

  //5. enter selection
  rects2
    .enter()
    .append("rect")
    .attr("width", barX.bandwidth())
    //.attr("height",0)
    .attr("fill", "green")
    .attr("x", d => barX(d.publicationtype))
    .transition(t2)
    .attrTween("width", widthTween)
    .attr("y", d => barY(d.publicationnumber))
    .attr("height", d => bargraphHeight - barY(d.publicationnumber));

  //6. call axes
  xAxisGroup2.call(xAxis2);
  yAxisGroup2.call(yAxis2);
};

// fakeData = [
//   {
//     publicationtype: "veg soup",
//     publicationnumber: 200
//   },
//   {
//     publicationtype: "veg curry",
//     publicationnumber: 600
//   },
//   {
//     publicationtype: "veg pasta",
//     publicationnumber: 300
//   },
//   {
//     publicationtype: "veg surprise",
//     publicationnumber: 900
//   }
// ];

// update2(fakeData);

var data2 = [];
// fires everytime there is a change in firestore
db.collection("publications").onSnapshot(res => {
  //console.log(res.docChanges()); // collections of the change items
  res.docChanges().forEach(change_item => {
    const doc = { ...change_item.doc.data(), id: change_item.doc.id }; // this is actual data item
    console.log("doc is:", doc);
    switch (change_item.type) {
      case "added":
        data2.push(doc);
        break;
      case "removed":
        data2 = data2.filter(item => item.id != doc.id);
        break;
      case "modified":
        var index = data2.findIndex(item => item.id == doc.id);
        data2[index] = doc;
        break;
      default:
        break;
    }
  });
  console.log("data is:", data2);
  update2(data2);
});

const widthTween = d => {
  // 0 表示starting position, d.bandwidth()为ending position, create interpolation function
  let i = d3.interpolate(0, barX.bandwidth());
  // return a function that receives time ticket:
  return function(t) {
    return i(t); // t is from 0 to 1
  };
};
