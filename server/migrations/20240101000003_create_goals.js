exports.up = function(knex) {
    return knex.schema.createTable('goals', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('goal_name');
        table.decimal('target_amount', 12, 2);
        table.decimal('current_amount', 12, 2).defaultTo(0);
        table.date('deadline');
        table.string('status').defaultTo('active');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('goals');
};