const db = require('../config/database');

class Transaction {
  static async create(data) {
    const [transaction] = await db('transactions')
      .insert(data)
      .returning('*');
    return transaction;
  }

  static async findById(id) {
    return await db('transactions').where({ id }).first();
  }

  static async findByPlaidId(plaidId) {
    return await db('transactions')
      .where({ plaid_transaction_id: plaidId })
      .first();
  }

  static async findByUserId(userId, options = {}) {
    let query = db('transactions')
      .join('accounts', 'transactions.account_id', 'accounts.id')
      .where('accounts.user_id', userId)
      .select('transactions.*')
      .orderBy('transactions.date', 'desc');

    if (options.startDate) {
      query = query.where('transactions.date', '>=', options.startDate);
    }

    if (options.endDate) {
      query = query.where('transactions.date', '<=', options.endDate);
    }

    if (options.category) {
      query = query.where('transactions.category', options.category);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query;
  }
}

module.exports = Transaction;