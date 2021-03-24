/* global Chart */ // Defined by Chart.js

import { curSource, getData, setSource } from "./data";
import { populateList } from "./list";

// Chart will be updated later
let chart;

// Prediction data can be switched between after load
const predictions = [];

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

export async function populateGraph() {
  // Ignore the independent entry (not a true party)
  const parties = getData().parties.filter(p => p.party_ec_id.startsWith('PP'));

  // Get the most popular 6 parties
  parties.sort((a, b) => b.seats - a.seats);
  const top6 = parties.slice(0,6);

  // Sort by name for graph display
  top6.sort((a, b) => a.party_name.localeCompare(b.party_name));

  // All the rest will be grouped under "Other"
  const rest = parties.slice(6);

  chart.data.labels = top6.map(p => p.party_name);
  chart.data.labels.push('Other');

  // Cumulate remaining party votes under "Other" entry
  const data = top6.map(p => p.seats);
  data.push(rest.reduce((acc, cur) => acc + cur.seats, 0));

  const partyColours = top6.map(p => p.colour ? p.colour : '#3C4750');
  partyColours.push('#3C4750'); // "Other" gets neutral styling

  // Updates prediction data for easy access when dropdown changes
  populatePredictions(top6, rest);

  // Clear existing data
  chart.data.datasets = [];

  // Show real data as a solid bar (always first element)
  chart.data.datasets[0] = {
    label: 'Seats',
    borderWidth: 1,
    backgroundColor: partyColours,
    borderColor: "#3C4750",
    data
  };

  // Update displayed predictions, preserving current index
  updatePredictions(curSource);
}

export async function updateGraph(gss) {
  // Filter candidates and make sure they are from the same constituency
  const candidates = getData().candidates.filter(c => c.gss_code === gss);

  // Sort candidates by vote count
  candidates.sort((a,b) => b.votes - a.votes);
  
  // return top few candidates, but not more than top 6
  const top6 = candidates.slice(0,6);
  // the rest will be grouped "other"
  const rest = candidates.slice(6);

  // Map parties to an object. Parties have same ec_id with candidate
  const parties = top6.map(c => getData().parties.find(p => c.party_ec_id === p.party_ec_id));

  // Map party name to label
  chart.data.labels = parties.map(p => p.party_name);

  // Cumulate remaining party votes under "Other" entry
  const data = top6.map(p => p.votes);
  data.push(rest.reduce((acc, cur) => acc + cur.votes, 0));

  // map party colour to 
  const partyColours = parties.map(p => p.colour ? p.colour : '#3C4750');
  partyColours.push('#3C4750'); // "Other" gets neutral styling

  populatePredictions(top6, rest);

  // Clear existing data
  chart.data.datasets = [];

  // Show real data as a solid bar (always first element)
  chart.data.datasets[0] = {
    label: 'votes',
    borderWidth: 1,
    backgroundColor: partyColours,
    borderColor: "#3C4750",
    data
  };

  // Update displayed predictions, preserving current index
  updatePredictions(curSource);
}

export async function updatePredictions(index) {
  setSource(index);

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
