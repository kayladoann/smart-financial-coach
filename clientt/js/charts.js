let categoryChart = null;
let merchantChart = null;

function createCategoryChart(data) {
    const ctx = document.getElementById('category-chart');
    if (!ctx) return;

  // Destroy existing chart
    if (categoryChart) {
        categoryChart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
            ]
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
            position: 'bottom'
            }
        }
        }
    });
}

function createMerchantChart(merchants) {
    const ctx = document.getElementById('merchant-chart');
    if (!ctx) return;

  // Destroy existing chart
    if (merchantChart) {
        merchantChart.destroy();
    }

    const labels = merchants.map(m => m.name);
    const values = merchants.map(m => m.amount);

    merchantChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
            label: 'Amount Spent',
            data: values,
            backgroundColor: '#36A2EB'
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                return '$' + value.toFixed(2);
                }
            }
            }
        },
        plugins: {
            legend: {
            display: false
            }
        }
        }
    });
}