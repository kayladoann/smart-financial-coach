const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
    await knex('users').del();
    
    const passwordHash = await bcrypt.hash('password123', 10);
    
    await knex('users').insert([
        {
        id: 1,
        email: 'demo@example.com',
        password_hash: passwordHash,
        first_name: 'Demo',
        last_name: 'User'
        }
    ]);
};