const ctx = document.getElementById('candGraph').getContext('2d');
const names = ['First Place', 'Second Place'];
const data = [100000, 90000]
const myChart = new Chart(ctx, {
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
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});