const Insight = require('../models/Insight');
const Transaction = require('../models/Transaction');
const claudeClient = require('../ml/claudeClient');
const mlService = require('./mlService');

class InsightService {
    async getInsights(options) {
        const { userId, limit, unreadOnly } = options;
        return await Insight.findByUserId(userId, { limit, unreadOnly });
    }

    async generateInsights(userId) {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

        const transactions = await Transaction.findByUserId(userId, {
        startDate,
        endDate,
        });

        // Categorize spending
        const categoryTotals = {};
        transactions.forEach((txn) => {
        if (txn.amount > 0) {
            categoryTotals[txn.category] =
            (categoryTotals[txn.category] || 0) + txn.amount;
        }
        });

        // Detect anomalies
        const anomalies = await mlService.detectAnomalies(transactions);

        // Generate AI insights using Claude
        const aiInsights = await claudeClient.generateInsights({
        spending: categoryTotals,
        anomalies,
        transactionCount: transactions.length,
        });

        // Save insights
        const insights = [];
        for (const insight of aiInsights) {
        const saved = await Insight.create({
            user_id: userId,
            insight_type: insight.type,
            message: insight.message,
            data: JSON.stringify(insight.data),
            is_read: false,
        });
        insights.push(saved);
        }

        return insights;
    }

    async markAsRead(insightId, userId) {
        const insight = await Insight.findById(insightId);
        
        if (!insight || insight.user_id !== userId) {
        const error = new Error('Insight not found');
        error.statusCode = 404;
        throw error;
        }

        return await Insight.update(insightId, { is_read: true });
    }
}

module.exports = new InsightService();