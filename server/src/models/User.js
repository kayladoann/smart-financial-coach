const db = require('../config/database');

class User {
    static async create(data) {
        const [user] = await db('users')
        .insert({
            email: data.email,
            password_hash: data.password_hash,
            first_name: data.first_name,
            last_name: data.last_name,
        })
        .returning('*');
        return user;
    }

    static async findById(id) {
        return await db('users').where({ id }).first();
    }

    static async findByEmail(email) {
        return await db('users').where({ email }).first();
    }

    static async update(id, data) {
        const [user] = await db('users')
        .where({ id })
        .update(data)
        .returning('*');
        return user;
    }
}

module.exports = User;