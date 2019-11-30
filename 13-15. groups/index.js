const canvas = d3.select(".canvas");
const svg = canvas.append("svg")
    .attr("height", 600)
    .attr("width", 600);

const group = svg.append("g")
    .attr("transform","translate(50,50)");

// append elements in the svg container
group.append("rect")
    .attr("x",300)
    .attr("y",100)
    .attr("fill", "blue")
    .attr("width",100)
    .attr("height",200);

group.append("circle")
    .attr("cx",200)
    .attr("cy",200)
    .attr("r",50)
    .attr("fill","pink");
group.append("line")
    .attr("x1",100)
    .attr("y1", 100)
    .attr("x2",120)
    .attr("y2",300)
    .attr("stroke","grey");

svg.append("text")
    .attr("x",20)
    .attr("y",200)
    .attr("fill","blue")
    .text("Hello SVG")
    .style("font-family","Helvetica");