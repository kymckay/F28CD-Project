// import dropdown file method to getYear and getSource !!

// Reference: https://www.chartjs.org/docs/latest/
const xlabels = [];
var predicted1 = [300, 240, 150, 69, 13];
var predicted2 = [200, 340, 59, 21, 70];
var predicted;
//results for 2019 appear by default
var actual = [];
var myChart;
const results2019 = [];
const results2017 = [];


export async function graph() {
  //won't be called from within this function
  await setOption("CNN");
  await getData();

  // chart formatting and data addition
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
  const chartOptions = {
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
  const ctx = document.getElementById('canvas').getContext('2d');
    myChart = new Chart(ctx, {
      type: "bar",
      data: barChartData,
      options: chartOptions
    });
}

//load data from .csv file,
async function getData() {
  //fetch data from file
  const response = await fetch('src/test.csv');
  //save data as text
  const data = await response.text();

  //parse in the parties and seats won for each
  const rows = data.split('\n').slice(1);
  //parse in the years
  const years = data.split('\n').slice(0, 1);

  //create a local array an parse in each year as a separate element
  years.forEach(years => {
    const year = years.split(',').slice(1);
  })

  const party = [];
  //const actualResults = [];

  rows.forEach(rows => {
    const columns = rows.split(',');
    party.push(columns[0]);
//    var i;
//    for (i = 1; i < columns.length; i++) {
//      const results = columns[i];
//      actualResults.push(results);
//      results = [];
//    }
    results2019.push(columns[1]);
    results2017.push(columns[2]);

  });

  //results for 2019 appear by default
  for (var i of results2019) {
    actual.push(i);
  }
  //add parties as labels for x axis
  for(var i of party) {
    xlabels.push(i);
  }
}


function updateData(oldArray, dataArray) {
  for (var i of dataArray) {
    oldArray.push(i);
  }
  myChart.update();
}

// a lot of hard-coding going on atm, to be improved
// more just exploring the potential ways of the functionality between the dropdowns and the graph could be tied together
export async function setSelectedYear(selectedYear) {
  actual = [];
  switch(selectedYear) {
    case "2019":
      await updateData(actual, results2019)
      console.log(actual);
      break;

    case "2017":
      await updateData(actual, results2017);
      console.log(actual);
      myChart.update();
      break;
  }

  //haven't figured out why this one isn't working yet
  myChart.update();
}

// to be changed, export function setPredictionData(source)
async function setOption(option) {
  if (option == "BBC") {
    predicted = predicted1;
  } else if (option == "CNN") {
    predicted = predicted2;
  }
}


