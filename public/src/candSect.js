/* global Chart */ // Defined by Chart.js

export function candidateGraph() {
  const ctx = document.getElementById('candGraph').getContext('2d');
  const names = ['First Place', 'Second Place'];
  const data = [100000, 90000]

  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: names,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: [
                  '#0d324d',
                  '#7f5a83'
              ],
              borderColor: [
                  '#0d324',
                  '#7f5a83'
              ],
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