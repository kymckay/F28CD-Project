/* global Chart */ // Defined by Chart.js

// Chart will be updated later
let chart;

// Data will be stored for future updates
let cached;

export function initCandidate() {
  const ctx = document.getElementById('candGraph').getContext('2d');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {},
    options: {
        responsive: true,
        aspectRatio: 3,
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: value => `${value}%`
              }
            }]
        }
    }
  });
}

export function populateCandidate(data) {
  cached = data;

  // For now default to first in the list
  updateCandidate(0);
}

export function updateCandidate(index) {
  const chosen = cached.candidates[index];

  updateChart(chosen);

  document.getElementById('candName').innerHTML = chosen.name;
  document.getElementById('candParty').innerHTML = cached.parties.find(p => p.party_ec_id === chosen.party_ec_id).party_name;
  document.getElementById('candConst').innerHTML = cached.constituencies.find(c => c.gss_code === chosen.gss_code).name;
  document.getElementById('candCamps').innerHTML = 1; // TODO get number of runs
  document.getElementById('candElect').innerHTML = 1; // TODO get this
}

function updateChart(chosen) {
  // Compare to candidates in same constituency
  const competitors = cached.candidates.filter(c => (c.gss_code === chosen.gss_code) && (c.party_ec_id !== chosen.party_ec_id));

  // Sort competitors by votes
  competitors.sort((a, b) => b.votes - a.votes);

  // Need total votes cast in constituency for MOV (or MOL)
  const total = competitors.reduce((acc, cur) => acc + cur.votes, chosen.votes);

  // MOV will compare up to top 3 below (may not be 3 in region)
  // MOL will compare up to top 3 above (may not be 3 above)
  const compare = competitors.filter(c => chosen.elected ? true : c.votes > chosen.votes).slice(0, 3);

  chart.data.labels = compare.map(c => c.name);
  chart.data.datasets = [{
    label: chosen.elected ? 'Margin of Victory' : 'Margin of Loss',
    data: compare.map(c => Math.floor(100 * (chosen.votes - c.votes) / total)),
    backgroundColor: '#3C4750',
    borderColor: '#3C4750',
    borderWidth: 1
  }];

  chart.update();
}