const transactionService = require('../services/transactionService');
const Insight = require('../models/Insight');

class TransactionController {
  async getTransactions(req, res, next) {
    try {
      const { startDate, endDate, category, limit } = req.query;
      
      const transactions = await transactionService.getTransactions({
        userId: req.user.id,
        startDate,
        endDate,
        category,
        limit: limit ? parseInt(limit) : undefined
      });

      res.json({
        success: true,
        transactions
      });
    } catch (error) {
      next(error);
    }
  }

  async syncTransactions(req, res, next) {
    try {
      // CLEAR OLD INSIGHTS BEFORE SYNCING
      await Insight.deleteByUserId(req.user.id);
      
      const result = await transactionService.syncTransactions(req.user.id);
      
      res.json({
        success: true,
        message: result.message,
        synced: result.synced
      });
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

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadStatement(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const uploadService = require('../services/uploadService');
      const result = await uploadService.processStatement(req.file, req.user.id);

      res.json({
        success: true,
        message: `Processed ${result.transactions.length} transactions`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();