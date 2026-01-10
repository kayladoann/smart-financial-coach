class AnomalyDetector {
    detect(transactions) {
        const anomalies = [];

        // Calculate mean and standard deviation for amounts
        const amounts = transactions
        .filter(t => t.amount > 0)
        .map(t => t.amount);

        if (amounts.length === 0) return anomalies;

        const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
        const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
        const stdDev = Math.sqrt(variance);

        // Find outliers (more than 2 standard deviations from mean)
        transactions.forEach(txn => {
        if (txn.amount > mean + (2 * stdDev)) {
            anomalies.push({
            transaction: txn,
            reason: 'unusually_high',
            deviation: ((txn.amount - mean) / stdDev).toFixed(2)
            });
        }
        });

        return anomalies;
    }
}

module.exports = new AnomalyDetector();