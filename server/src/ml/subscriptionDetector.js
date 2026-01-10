class SubscriptionDetector {
    detect(transactions) {
        const merchantGroups = {};

        // Group transactions by merchant
        transactions.forEach(txn => {
        const merchant = txn.merchant_name;
        if (!merchantGroups[merchant]) {
            merchantGroups[merchant] = [];
        }
        merchantGroups[merchant].push(txn);
        });

        const subscriptions = [];

        // Analyze each merchant group
        Object.entries(merchantGroups).forEach(([merchant, txns]) => {
        if (txns.length < 2) return;

        // Sort by date
        txns.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Check for recurring pattern
        const intervals = [];
        for (let i = 1; i < txns.length; i++) {
            const days = Math.round(
            (new Date(txns[i].date) - new Date(txns[i - 1].date)) / (1000 * 60 * 60 * 24)
            );
            intervals.push(days);
        }

        // Check if intervals are consistent (within 7 days)
        const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const isConsistent = intervals.every(interval => Math.abs(interval - avgInterval) < 7);

        if (isConsistent && avgInterval >= 25 && avgInterval <= 35) {
            // Monthly subscription
            subscriptions.push({
            merchant,
            amount: txns[txns.length - 1].amount,
            frequency: 'monthly',
            lastCharge: txns[txns.length - 1].date,
            confidence: 0.9
            });
        } else if (isConsistent && avgInterval >= 360 && avgInterval <= 370) {
            // Annual subscription
            subscriptions.push({
            merchant,
            amount: txns[txns.length - 1].amount,
            frequency: 'annual',
            lastCharge: txns[txns.length - 1].date,
            confidence: 0.85
            });
        }
        });

        return subscriptions;
    }
}

module.exports = new SubscriptionDetector();