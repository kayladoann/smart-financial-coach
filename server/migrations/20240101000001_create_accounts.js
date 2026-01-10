exports.up = function(knex) {
    return knex.schema.createTable('accounts', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('plaid_account_id').unique();
        table.string('plaid_item_id');
        table.text('plaid_access_token');
        table.string('account_name');
        table.string('account_type');
        table.decimal('balance', 12, 2);
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('accounts');
};