exports.up = function(knex) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary();
        table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE');
        table.string('plaid_transaction_id').unique();
        table.decimal('amount', 10, 2);
        table.date('date');
        table.string('merchant_name');
        table.string('category');
        table.boolean('pending').defaultTo(false);
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
};