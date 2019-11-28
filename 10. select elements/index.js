const a = document.querySelector('div');
const b = d3.select("div");


console.log("first select:");
console.log(a);

console.log("second select:");
console.log(b);


const selectAll = document.querySelectorAll("div");
const selectAllD3 = d3.select("div");

console.log(selectAll,selectAllD3);

const canvas = d3.select(".canvas");