const transactionService = require('../services/transactionService');

class TransactionController {
    async getTransactions(req, res, next) {
        try {
        const { startDate, endDate, category, limit = 50 } = req.query;
        
        const transactions = await transactionService.getTransactions({
            userId: req.user.id,
            startDate,
            endDate,
            category,
            limit: parseInt(limit)
        });

        res.json({ transactions });
        } catch (error) {
        next(error);
        }
    }

    async syncTransactions(req, res, next) {
        try {
        const result = await transactionService.syncTransactions(req.user.id);
        res.json(result);
        } catch (error) {
        next(error);
        }
    }

    async getAnalytics(req, res, next) {
        try {
        const { startDate, endDate } = req.query;
        
        const analytics = await transactionService.getAnalytics({
            userId: req.user.id,
            startDate,
            endDate
        });

        res.json({ analytics });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new TransactionController();