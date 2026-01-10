exports.up = function(knex) {
    return knex.schema.createTable('subscriptions', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('merchant_name');
        table.decimal('amount', 10, 2);
        table.string('frequency');
        table.date('last_charge_date');
        table.string('status').defaultTo('active');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('subscriptions');
};