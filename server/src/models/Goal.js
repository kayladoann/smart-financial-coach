const db = require('../config/database');

class Goal {
    static async create(data) {
        const [goal] = await db('goals')
        .insert(data)
        .returning('*');
        return goal;
    }

    static async findById(id) {
        return await db('goals').where({ id }).first();
    }

    static async findByUserId(userId) {
        return await db('goals').where({ user_id: userId });
    }

    static async update(id, data) {
        const [goal] = await db('goals')
        .where({ id })
        .update({ ...data, updated_at: db.fn.now() })
        .returning('*');
        return goal;
    }

    static async delete(id) {
        return await db('goals').where({ id }).del();
    }
}

module.exports = Goal;