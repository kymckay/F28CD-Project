/* global Chart */ // Defined by Chart.js

// Reference: https://www.chartjs.org/docs/latest/
const xlabels = [];
const predicted1 = [300, 240, 150, 69, 13, 87, 12];
const predicted2 = [200, 340, 59, 21, 70, 34, 64];
let predicted;
//results for 2019 appear by default
let actual = [];
const results2019 = [];
const results2017 = [];


export async function initGraph() {
  await setOption("CNN"); //won't be called from within this function
  await getData();

  // chart formatting and data addition
  const barChartData = {
   labels: xlabels,
    datasets: [
     {
        label: "Actual",
        backgroundColor: [
              '#0087DC',
              '#E4003B',
              '#FAA61A',
              '#326760',
              '#008142',
              '#FDF38E',
              '#f1f1f0'],


        borderColor: "#3c4750",
        borderWidth: 1,
        data: actual
      },
      {
        label: "Predicted",
        backgroundColor: "#3c4750",
        borderColor: "#3c4750",
        borderWidth: 1,
        data: predicted
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    aspectRatio: 1.15,
    legend: {
      display: true,
      position: 'bottom'
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
  const chart = new Chart(ctx, {
      type: "bar",
      data: barChartData,
      options: chartOptions
    });
  return chart;
}

// load data from .csv file
// the following code probably won't be in the final application
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
  years.forEach(year => year.split(',').slice(1));

  const party = [];

  rows.forEach(row => {
    const columns = row.split(',');
    party.push(columns[0]);

    results2019.push(columns[1]);
    results2017.push(columns[2]);

  });

  //results for 2019 appear by default
  for (const i of results2019) {
    actual.push(i);
  }
  //add parties as labels for x axis
  for(const i of party) {
    xlabels.push(i);
  }
}

 //updates arrays with new data
function updateData(oldArray, dataArray) {
  for (const i of dataArray) {
    oldArray.push(i);
  }
}

 //a lot of hard-coding going on atm, to be improved (if this approach will even be used)
 //more just exploring the potential ways of the functionality between the dropdowns and the graph could be tied together
export async function setSelectedYear(selectedYear, graph) {
  actual = [];
  switch(selectedYear) {
    case "2019":
      await updateData(actual, results2019)
      console.log(actual);
      break;

    case "2017":
      await updateData(actual, results2017);
      console.log(actual);
      break;
  }
  //haven't figured out why this one isn't working yet
  //throws unhandled promise exception
  graph.update();
}

// to be changed
async function setOption(option) {
  if (option === "BBC") {
    predicted = predicted1;
  } else if (option === "CNN") {
    predicted = predicted2;
  }
}


