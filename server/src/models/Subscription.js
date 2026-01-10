const db = require('../config/database');

class Subscription {
    static async create(data) {
        const [subscription] = await db('subscriptions')
        .insert(data)
        .returning('*');
        return subscription;
    }

    static async findById(id) {
        return await db('subscriptions').where({ id }).first();
    }

    static async findByUserId(userId) {
        return await db('subscriptions').where({ user_id: userId });
    }

    static async findByMerchant(userId, merchantName) {
        return await db('subscriptions')
        .where({ user_id: userId, merchant_name: merchantName })
        .first();
    }

    static async update(id, data) {
        const [subscription] = await db('subscriptions')
        .where({ id })
        .update(data)
        .returning('*');
        return subscription;
    }
}

module.exports = Subscription;