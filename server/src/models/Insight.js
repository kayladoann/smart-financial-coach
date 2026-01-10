const db = require('../config/database');

class Insight {
    static async create(data) {
        const [insight] = await db('insights')
        .insert(data)
        .returning('*');
        return insight;
    }

    static async findById(id) {
        return await db('insights').where({ id }).first();
    }

    static async findByUserId(userId, options = {}) {
        let query = db('insights')
        .where({ user_id: userId })
        .orderBy('created_at', 'desc');

        if (options.unreadOnly) {
        query = query.where({ is_read: false });
        }

        if (options.limit) {
        query = query.limit(options.limit);
        }

        return await query;
    }

    static async update(id, data) {
        const [insight] = await db('insights')
        .where({ id })
        .update(data)
        .returning('*');
        return insight;
    }
}

module.exports = Insight;