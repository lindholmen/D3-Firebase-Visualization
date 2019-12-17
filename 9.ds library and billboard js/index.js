mycolumns = [
  ["data1", 400, 200, 100, 400, 150, 250],
  ["data2", 130, 100, 140, 200, 150, 50],
  ["data3", 234, 374, 445, 200, 150, 50]
];

var chart = bb.generate({
  bindto: "#chart",
  data: {
    type: "line",
    columns: mycolumns
  }
});

var piechart = bb.generate({
  data: {
    columns: mycolumns,
    type: "pie"
  },
  bar: {
    width: {
      ratio: 0.5
    }
  },
  bindto: "#piechart"
});
