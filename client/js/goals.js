async function loadGoals() {
  try {
    showLoading('goals-list');
    const data = await api.getGoals();

    const listElement = document.getElementById('goals-list');

    if (data.goals.length === 0) {
      listElement.innerHTML = '<p>No goals yet. Create your first goal!</p>';
      return;
    }

    // Load forecasts for each goal
    const goalsWithForecasts = await Promise.all(
      data.goals.map(async (goal) => {
        try {
          const forecastData = await api.getGoalForecast(goal.id);
          return { ...goal, forecast: forecastData.forecast };
        } catch (error) {
          console.error('Error loading forecast for goal:', goal.id, error);
          return { ...goal, forecast: null };
        }
      })
    );

    listElement.innerHTML = goalsWithForecasts.map(goal => {
      const forecast = goal.forecast;
      
      if (!forecast) {
        return `
          <div class="goal-card">
            <h3>${goal.goal_name}</h3>
            <p>Unable to load forecast</p>
            <button class="btn-delete" onclick="deleteGoal(${goal.id})">Delete</button>
          </div>
        `;
      }

      return `
        <div class="goal-card ${forecast.onTrack ? 'on-track' : 'off-track'}">
            <!-- Header -->
            <div class="goal-header">
            <h3>${goal.goal_name}</h3>
            <span class="goal-status ${forecast.onTrack ? 'status-good' : 'status-warning'}">
                ${forecast.onTrack ? '✅ On Track' : '⚠️ Off Track'}
            </span>
            </div>

          <!-- Progress Bar -->
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${forecast.percentComplete}%"></div>
            </div>
            <div class="progress-info">
              <span class="progress-amount">${formatCurrency(forecast.currentAmount)} of ${formatCurrency(forecast.targetAmount)}</span>
              <span class="progress-percent">${forecast.percentComplete}%</span>
            </div>
          </div>

          <!-- Key Info - Simplified -->
          <div class="goal-summary">
            <div class="summary-item">
              <span class="summary-icon">💰</span>
              <div>
                <div class="summary-label">Save per month</div>
                <div class="summary-value">${formatCurrency(forecast.requiredMonthlySavings)}</div>
              </div>
            </div>
            <div class="summary-item">
              <span class="summary-icon">📅</span>
              <div>
                <div class="summary-label">Time left</div>
                <div class="summary-value">${forecast.monthsRemaining} months</div>
              </div>
            </div>
          </div>

          <!-- Main Message -->
          <div class="goal-message ${forecast.onTrack ? 'message-good' : 'message-warning'}">
            ${forecast.onTrack 
              ? `<p>🎉 Great! Keep saving ${formatCurrency(forecast.requiredMonthlySavings)}/month and you'll reach your goal on time.</p>`
              : `<p>💡 Save ${formatCurrency(forecast.shortfall)} more per month to stay on track.</p>`
            }
          </div>

          <!-- Quick Tips (only if off track and has recommendations) -->
          ${!forecast.onTrack && forecast.recommendations && forecast.recommendations.length > 0 ? `
            <div class="goal-tips">
              <div class="tips-header">Quick ways to save ${formatCurrency(forecast.shortfall)}/month:</div>
              ${forecast.recommendations.slice(0, 2).map(rec => `
                <div class="tip-item">
                  <span class="tip-icon">💡</span>
                  <span>Cut ${rec.category} by ${formatCurrency(rec.suggestedReduction)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Footer Actions -->
          <div class="goal-footer">
            <button class="btn-delete btn-sm" onclick="deleteGoal(${goal.id})">Delete Goal</button>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    showError('goals-list', 'Failed to load goals');
    console.error('Error loading goals:', error);
  }
}

function showCreateGoal() {
  document.getElementById('create-goal-form').style.display = 'block';
}

function hideCreateGoal() {
  document.getElementById('create-goal-form').style.display = 'none';
  document.getElementById('goal-name').value = '';
  document.getElementById('goal-amount').value = '';
  document.getElementById('goal-deadline').value = '';
}


async function createGoal(event) {
  event.preventDefault();

  try {
    const goalData = {
      goalName: document.getElementById('goal-name').value,
      targetAmount: parseFloat(document.getElementById('goal-amount').value),
      currentAmount: parseFloat(document.getElementById('goal-current-amount').value) || 0,
      deadline: document.getElementById('goal-deadline').value
    };

    // Validate that current amount is not greater than target
    if (goalData.currentAmount > goalData.targetAmount) {
      alert('Current amount cannot be greater than target amount');
      return;
    }

    await api.createGoal(goalData);
    hideCreateGoal();
    loadGoals();

  } catch (error) {
    console.error('Error creating goal:', error);
    alert('Failed to create goal');
  }
}

function hideCreateGoal() {
  document.getElementById('create-goal-form').style.display = 'none';
  document.getElementById('goal-name').value = '';
  document.getElementById('goal-amount').value = '';
  document.getElementById('goal-current-amount').value = '0';
  document.getElementById('goal-deadline').value = '';
}

function hideCreateGoal() {
  document.getElementById('create-goal-form').style.display = 'none';
  document.getElementById('goal-name').value = '';
  document.getElementById('goal-amount').value = '';
  document.getElementById('goal-current-amount').value = '0';
  document.getElementById('goal-deadline').value = '';
}

async function deleteGoal(goalId) {
  if (!confirm('Are you sure you want to delete this goal?')) {
    return;
  }

  try {
    await api.deleteGoal(goalId);
    loadGoals();
  } catch (error) {
    console.error('Error deleting goal:', error);
    alert('Failed to delete goal');
  }
}

// Load goals on page load
if (window.location.pathname.includes('goals.html')) {
  document.addEventListener('DOMContentLoaded', loadGoals);
}