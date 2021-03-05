// Reference: https://www.chartjs.org/docs/latest/

// x axis labels
// dummy data
// will push input data into arrays instead
var xlabels = ["Conservatives", "Labour", "SNP", "Lib Dem", "DUP", "Sinn Fein", "Plaid Cymru", "SDLP", "Green", "Alliance"];
var predicted = [30, 24, 15, 16, 13, 8, 10, 8, 4, 5];
var actual = [33, 24, 16, 10, 11, 8, 10, 3, 4, 2];
var barChartData = {
  labels: xlabels,
  datasets: [
    {
      label: "Actual",
      backgroundColor: "#0d324d",
      borderColor: "#0d324d",
      borderWidth: 1,
      data: actual
    },
    {
      label: "Predicted",
      backgroundColor: "#7f5a83",
      borderColor: "#7f5a83",
      borderWidth: 1,
      data: predicted
    }
  ]
};
// resizes weirdly, has to do with the aspect ratio
// but without the ratio it doesn't look good either, this way at least it looks alright in full screen
var chartOptions = {
  responsive: true,
  aspectRatio: 1.15,
  legend: {
    display: true
  },

  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
}

window.onload = function() {
var ctx = document.getElementById('canvas').getContext('2d');
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: chartOptions
  });
};