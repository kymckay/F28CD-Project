/* global Chart */ // Defined by Chart.js

// Chart will be updated later
let chart;

// Reference: https://www.chartjs.org/docs/latest/
export async function initGraph() {
  const ctx = document.getElementById('canvas').getContext('2d');
  chart = new Chart(ctx, {
    type: "bar",
    data: {}, // Empty until data arrives with
    options: {
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
  });
}

export async function populateGraph(data) {
  // Get the most popular 6 parties
  data.sort((a, b) => b.votes - a.votes);
  const top6 = data.slice(0,6);
  top6.sort((a, b) => a.party_name.localeCompare(b.party_name));

  chart.data.labels = top6.map(p => p.party_name);
  chart.data.labels.push('Other');

  // Cumulate remaining party votes under "Other" entry
  const dataReal = top6.map(p => p.votes);
  dataReal.push(data.slice(6).reduce((acc, cur) => acc + cur.votes, 0));

  const dataPred = top6.map(p => p.predictions[0]);
  dataPred.push(data.slice(6).reduce((acc, cur) => acc + cur.predictions[0], 0));

  // Clear existing data
  chart.data.datasets = [];

  // Show real data as a solid bar
  chart.data.datasets.push({
    label: 'Votes',
    borderWidth: 1,
    borderColor: "#3C4750",
    data: dataReal
  });

  // Show prediction data as an outline only bar to differentiate
  chart.data.datasets.push({
    label: 'Prediction',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: "#3C4750",
    data: dataPred
  });

  chart.update();
}
