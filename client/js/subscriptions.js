async function loadSubscriptions() {
    try {
        showLoading('subscriptions-list');
        const data = await api.getSubscriptions();

        const listElement = document.getElementById('subscriptions-list');

        if (data.subscriptions.length === 0) {
        listElement.innerHTML = '<p>No subscriptions detected. Click "Scan for Subscriptions" to find them!</p>';
        return;
        }

        // Calculate totals
        const monthlyTotal = data.subscriptions
        .filter(sub => sub.frequency === 'monthly')
        .reduce((sum, sub) => sum + parseFloat(sub.amount), 0);

        document.getElementById('monthly-total').textContent = formatCurrency(monthlyTotal);
        document.getElementById('active-count').textContent = data.subscriptions.length;

        listElement.innerHTML = data.subscriptions.map(sub => `
        <div class="subscription-card">
            <div class="subscription-info">
            <h3>${sub.merchant_name}</h3>
            <p class="subscription-frequency">${sub.frequency}</p>
            <p class="subscription-last-charge">Last charge: ${formatDate(sub.last_charge_date)}</p>
            </div>
            <div class="subscription-amount">
            ${formatCurrency(sub.amount)}
            <span class="frequency-label">/${sub.frequency === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
        </div>
        `).join('');

    } catch (error) {
        showError('subscriptions-list', 'Failed to load subscriptions');
    }
}

async function scanSubscriptions() {
    try {
        const button = event.target;
        button.disabled = true;
        button.textContent = 'Scanning...';

        await api.scanSubscriptions();
        
        button.textContent = 'Scan Complete!';
        setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Scan for Subscriptions';
        }, 2000);

        loadSubscriptions();

    } catch (error) {
        console.error('Error scanning subscriptions:', error);
        alert('Failed to scan subscriptions');
    }
}

// Load subscriptions on page load
if (window.location.pathname.includes('subscriptions.html')) {
    document.addEventListener('DOMContentLoaded', loadSubscriptions);
}