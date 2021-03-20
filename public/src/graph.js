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