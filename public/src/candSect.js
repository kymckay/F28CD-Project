var year = [2001, 2005, 2010, 2015, 2017, 2019];
function data() 
var trace1 = {
    x: [20, 14, 23],
    y: year,
    name: 'BBC',
    orientation: 'h',
    marker: {
      color: 'rgba(55,128,191,0.6)',
      width: 1
    },
    type: 'bar'
};
  
var trace2 = {
    x: [12, 18, 29],
    y: year,
    name: 'Politico',
    orientation: 'h',
    type: 'bar',
    marker: {
      color: 'rgba(255,153,51,0.6)',
      width: 1
    }
};
  
var data = [trace1, trace2];
  
var layout = {
    barmode: 'group'
};
  
Plotly.newPlot('candGraph', data, layout,);
