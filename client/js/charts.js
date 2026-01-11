let categoryChart = null;
let merchantChart = null;

function createCategoryChart(data, counts) {
  console.log('=== createCategoryChart CALLED ===');
  console.log('data:', data);
  console.log('counts:', counts);
  console.log('Object.keys(data):', Object.keys(data));
  console.log('Object.values(data):', Object.values(data));
  
  const ctx = document.getElementById('category-chart');
  if (!ctx) {
    console.error('Canvas element not found');
    return;
  }

  // Destroy existing chart
  if (categoryChart) {
    categoryChart.destroy();
  }

  const labels = Object.keys(data);
  const values = Object.values(data);

  console.log('labels:', labels);
  console.log('values:', values);

  // Define colors
  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
    '#4DC9F6'
  ];

  // Create chart
  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });

  console.log('Chart created successfully');

  // Create category cards
  const cardsContainer = document.getElementById('category-cards');
  
  console.log('cardsContainer:', cardsContainer);
  
  if (!cardsContainer) {
    console.error('Category cards container not found!');
    return;
  }

  if (labels.length === 0) {
    console.warn('No labels - showing message');
    cardsContainer.innerHTML = '<p>No spending data available</p>';
    return;
  }

  console.log('Creating cards for', labels.length, 'categories');

  // Generate cards HTML
  const cardsHTML = labels.map((label, index) => {
    const amount = values[index];
    const count = counts ? (counts[label] || 0) : 0;
    const color = colors[index % colors.length];
    
    console.log(`Card ${index}: ${label} - $${amount} - ${count} txns - color: ${color}`);
    
    return `
      <div class="category-card" style="border-left: 4px solid ${color}">
        <div class="category-card-header">${label.toUpperCase()}</div>
        <div class="category-card-amount">${formatCurrency(amount)}</div>
        <div class="category-card-count">${count} transaction${count !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');

  console.log('Cards HTML length:', cardsHTML.length);
  console.log('Setting innerHTML...');
  
  cardsContainer.innerHTML = cardsHTML;
  
  console.log('Category cards created successfully!');
  console.log('cardsContainer.children.length:', cardsContainer.children.length);
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