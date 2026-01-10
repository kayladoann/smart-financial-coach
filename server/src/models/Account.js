const db = require('../config/database');

class Account {
    static async create(data) {
        const [account] = await db('accounts')
        .insert(data)
        .returning('*');
        return account;
    }

    static async findById(id) {
        return await db('accounts').where({ id }).first();
    }

    static async findByUserId(userId) {
        return await db('accounts').where({ user_id: userId });
    }

    static async update(id, data) {
        const [account] = await db('accounts')
        .where({ id })
        .update(data)
        .returning('*');
        return account;
    }
}

module.exports = Account;