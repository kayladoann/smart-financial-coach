async function loadInsights() {
  try {
    showLoading('insights-list');
    const data = await api.getInsights({ limit: 20 });

    const listElement = document.getElementById('insights-list');

    if (data.insights.length === 0) {
      listElement.innerHTML = `
        <div class="alert alert-info">
          <p>No insights yet. Click "Generate New Insights" to get started!</p>
        </div>
      `;
      return;
    }

    listElement.innerHTML = data.insights.map(insight => `
      <div class="insight-card ${insight.is_read ? 'read' : 'unread'}">
        <div class="insight-type">${getInsightIcon(insight.insight_type)}</div>
        <div class="insight-content">
          <p class="insight-message">${insight.message}</p>
          <p class="insight-date">${formatDate(insight.created_at)}</p>
        </div>
        ${!insight.is_read ? `
          <button class="btn-mark-read" onclick="markAsRead(${insight.id})">
            Mark as Read
          </button>
        ` : ''}
      </div>
    `).join('');

  } catch (error) {
    showError('insights-list', 'Failed to load insights');
  }
}

async function generateInsights() {
  try {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Generating...';

    // Show loading in the list
    const listElement = document.getElementById('insights-list');
    listElement.innerHTML = '<div class="loading">⏳ Analyzing your spending patterns...</div>';

    await api.generateInsights();
    
    button.textContent = 'Generated!';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Generate New Insights';
    }, 2000);

    // Reload insights
    loadInsights();

  } catch (error) {
    console.error('Error generating insights:', error);
    alert('Failed to generate insights');
    event.target.disabled = false;
    event.target.textContent = 'Generate New Insights';
  }
}

async function markAsRead(insightId) {
  try {
    await api.markInsightAsRead(insightId);
    loadInsights();
  } catch (error) {
    console.error('Error marking insight as read:', error);
  }
}

function getInsightIcon(type) {
  const icons = {
    'spending_alert': '⚠️',
    'savings_tip': '💡',
    'anomaly': '🔔',
    'goal_update': '🎯'
  };
  return icons[type] || '📊';
}

// Load insights on page load
if (window.location.pathname.includes('insights.html')) {
  document.addEventListener('DOMContentLoaded', loadInsights);
}


