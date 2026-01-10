const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const plaidService = require('./plaidService');
const mlService = require('./mlService');

class TransactionService {
  async getTransactions(options) {
    const { userId, startDate, endDate, category, limit } = options;
    return await Transaction.findByUserId(userId, {
      startDate,
      endDate,
      category,
      limit,
    });
  }

  async syncTransactions(userId) {
    const accounts = await Account.findByUserId(userId);
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    let totalSynced = 0;

    for (const account of accounts) {
      const plaidTransactions = await plaidService.getTransactions(
        account.id,
        startDate,
        endDate
      );

      for (const txn of plaidTransactions) {
        const existing = await Transaction.findByPlaidId(txn.transaction_id);
        
        if (!existing) {
          await Transaction.create({
            account_id: account.id,
            plaid_transaction_id: txn.transaction_id,
            amount: txn.amount,
            date: txn.date,
            merchant_name: txn.merchant_name || txn.name,
            category: txn.category?.[0] || 'Uncategorized',
            pending: txn.pending,
          });
          totalSynced++;
        }
      }
    }

    return {
      synced: totalSynced,
      message: `Synced ${totalSynced} new transactions`,
    };
  }

  async getAnalytics(options) {
    const { userId, startDate, endDate } = options;
    const transactions = await Transaction.findByUserId(userId, {
      startDate,
      endDate,
    });

    // Calculate totals by category - FIXED with parseFloat
    const byCategory = {};
    let totalSpent = 0;

    transactions.forEach((txn) => {
      const amount = parseFloat(txn.amount);
      if (!isNaN(amount) && amount > 0) {
        totalSpent += amount;
        byCategory[txn.category] = (byCategory[txn.category] || 0) + amount;
      }
    });

    // Get top merchants - FIXED with parseFloat
    const merchantTotals = {};
    transactions.forEach((txn) => {
      const amount = parseFloat(txn.amount);
      if (!isNaN(amount) && amount > 0) {
        merchantTotals[txn.merchant_name] =
          (merchantTotals[txn.merchant_name] || 0) + amount;
      }
    });

    const topMerchants = Object.entries(merchantTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));

    return {
      totalSpent,
      byCategory,
      topMerchants,
      transactionCount: transactions.length,
    };
  }
}

module.exports = new TransactionService();