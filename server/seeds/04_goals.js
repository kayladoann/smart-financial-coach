exports.seed = async function(knex) {
    await knex('goals').del();
    
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + 10);
    
    await knex('goals').insert([
        {
        id: 1,
        user_id: 1,
        goal_name: 'Emergency Fund',
        target_amount: 3000.00,
        current_amount: 800.00,
        deadline: deadline.toISOString().split('T')[0],
        status: 'active'
        }
    ]);
};