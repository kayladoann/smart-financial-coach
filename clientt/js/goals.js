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
            const forecast = await api.getGoalForecast(goal.id);
            return { ...goal, forecast: forecast.forecast };
            } catch (error) {
            return { ...goal, forecast: null };
            }
        })
        );

        listElement.innerHTML = goalsWithForecasts.map(goal => `
        <div class="goal-card">
            <h3>${goal.goal_name}</h3>
            <div class="goal-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${calculatePercentage(goal.current_amount, goal.target_amount)}%"></div>
            </div>
            <p class="progress-text">
                ${formatCurrency(goal.current_amount)} / ${formatCurrency(goal.target_amount)}
                (${calculatePercentage(goal.current_amount, goal.target_amount)}%)
            </p>
            </div>
            <p class="goal-deadline">Deadline: ${formatDate(goal.deadline)}</p>
            ${goal.forecast ? `
            <div class="goal-forecast">
                <p class="forecast-status ${goal.forecast.onTrack ? 'on-track' : 'off-track'}">
                ${goal.forecast.onTrack ? '✅ On Track' : '⚠️ Off Track'}
                </p>
                <p class="forecast-recommendation">${goal.forecast.recommendation}</p>
            </div>
            ` : ''}
            <button class="btn-delete" onclick="deleteGoal(${goal.id})">Delete</button>
        </div>
        `).join('');

    } catch (error) {
        showError('goals-list', 'Failed to load goals');
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
        deadline: document.getElementById('goal-deadline').value
        };

        await api.createGoal(goalData);
        hideCreateGoal();
        loadGoals();

    } catch (error) {
        console.error('Error creating goal:', error);
        alert('Failed to create goal');
    }
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