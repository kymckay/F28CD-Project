/* global Chart */ // Defined by Chart.js

// Chart will be updated later
let chart;

// Prediction data can be switched between after load
const predictions = [];
let predictIndex = 0; // Index should persist when year changes

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

function populatePredictions(top6, rest) {
  const numSources = top6[0].predictions.length;

  // For each source we store the top 6 parties' predictions
  // The rest are grouped under "Other" at index 6
  for (let i = 0; i < numSources; i++) {
    predictions[i] = top6.map(p => p.predictions[i]);
    predictions[i].push(rest.reduce((acc, cur) => acc + cur.predictions[i], 0));
  }
}

export async function populateGraph(data) {
  // Get the most popular 6 parties
  data.sort((a, b) => b.votes - a.votes);

  const top6 = data.slice(0,6);
  top6.sort((a, b) => a.party_name.localeCompare(b.party_name));

  const rest = data.slice(6);

  chart.data.labels = top6.map(p => p.party_name);
  chart.data.labels.push('Other');

  // Cumulate remaining party votes under "Other" entry
  const dataReal = top6.map(p => p.votes);
  dataReal.push(rest.reduce((acc, cur) => acc + cur.votes, 0));

  populatePredictions(top6, rest);

  // Clear existing data
  chart.data.datasets = [];

  // Show real data as a solid bar (always first element)
  chart.data.datasets[0] = {
    label: 'Votes',
    borderWidth: 1,
    borderColor: "#3C4750",
    data: dataReal
  };

  // Update the prediction data with the current index
  updatePredictions(predictIndex);
}

export async function updatePredictions(index) {
  predictIndex = index;

  // Show prediction data as an outline only bar to differentiate
  chart.data.datasets[1] = {
    label: 'Prediction',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: "#3C4750",
    data: predictions[index]
  };

  chart.update();
}
