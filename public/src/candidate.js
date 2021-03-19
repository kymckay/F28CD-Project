/* global Chart */ // Defined by Chart.js

export function initCandidate() {
  const ctx = document.getElementById('candGraph').getContext('2d');
  const names = ['First Place', 'Second Place', 'Third Place', 'Fourth Place'];
  const data = [10000, 9000, 6000, 400]

  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: names,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: "#3c4750",
              borderColor: "#3c4750",
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          aspectRatio: 2.6,
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