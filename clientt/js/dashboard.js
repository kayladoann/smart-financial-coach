async function loadDashboard() {
    try {
        // Get user info from token
        const token = localStorage.getItem('token');
        if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userName = payload.email.split('@')[0];
        document.getElementById('user-name').textContent = userName;
        }

        // Load analytics
        await loadAnalytics();

        // Load recent transactions
        await loadRecentTransactions();

        // Load goals count
        await loadGoalsCount();

        // Load subscriptions count
        await loadSubscriptionsCount();

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadAnalytics() {
    try {
        const startDate = getMonthStart();
        const endDate = getToday();

        const data = await api.getAnalytics({ startDate, endDate });

        document.getElementById('total-spent').textContent = 
        formatCurrency(data.analytics.totalSpent);
        document.getElementById('transaction-count').textContent = 
        data.analytics.transactionCount;

        createCategoryChart(data.analytics.byCategory);
        createMerchantChart(data.analytics.topMerchants);

    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

async function loadRecentTransactions() {
    try {
        const data = await api.getTransactions({ limit: 10 });
        const listElement = document.getElementById('transactions-list');

        if (data.transactions.length === 0) {
        listElement.innerHTML = '<p>No transactions found</p>';
        return;
        }

        listElement.innerHTML = data.transactions.map(txn => `
        <div class="transaction-item">
            <div class="transaction-info">
            <div class="transaction-merchant">${txn.merchant_name}</div>
            <div class="transaction-date">${formatDate(txn.date)}</div>
            </div>
            <div class="transaction-amount">${formatCurrency(txn.amount)}</div>
        </div>
        `).join('');

    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

async function loadGoalsCount() {
    try {
        const data = await api.getGoals();
        document.getElementById('goal-count').textContent = data.goals.length;
    } catch (error) {
        console.error('Error loading goals count:', error);
    }
}

async function loadSubscriptionsCount() {
    try {
        const data = await api.getSubscriptions();
        document.getElementById('subscription-count').textContent = data.subscriptions.length;
    } catch (error) {
        console.error('Error loading subscriptions count:', error);
    }
}

async function syncTransactions() {
    try {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Syncing...';

        await api.syncTransactions();
        
        button.textContent = 'Synced!';
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Sync Transactions';
        }, 2000);

        // Reload dashboard
        loadDashboard();

    } catch (error) {
        console.error('Error syncing transactions:', error);
        alert('Failed to sync transactions');
    }
}

// Load dashboard on page load
if (window.location.pathname.includes('index.html') || 
    window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', loadDashboard);
}
