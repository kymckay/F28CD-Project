var year = ['Year 2001', 'Year 2005', 'Year 2010', 'Year 2015', 'Year 2017', 'Year 2019'];
function dataSet() {
    var data = [];
    for (let i = 0; i < year.length; i++) {
        data[i] = Math.floor(Math.random() * 101);
    }
    return data.sort(function(a, b){return a - b});
}

var bbc = {
    x: dataSet(),
    y: year,
    name: 'BBC',
    orientation: 'h',
    marker: {
      color: 'rgba(55,128,191,0.6)',
      width: 0.5
    },
    type: 'bar'
};
  
var politico = {
    x: dataSet(),
    y: year,
    name: 'Politico',
    orientation: 'h',
    type: 'bar',
    marker: {
      color: 'rgba(255,153,51,0.6)',
      width: 0.5
    }
};

var actual = {
    x: dataSet(),
    y: year,
    name: 'actual',
    orientation: 'h',
    type: 'bar',
    marker: {
      color: 'rgba(200,153,51,0.6)',
      width: 0.5
    }
};
  
var data = [bbc, politico, actual];
  
var layout = {
    barmode: 'group'
};
  
Plotly.newPlot('candGraph', data, layout,);
