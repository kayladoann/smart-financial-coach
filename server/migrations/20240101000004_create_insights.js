exports.up = function(knex) {
    return knex.schema.createTable('insights', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('insight_type');
        table.text('message');
        table.json('data');
        table.boolean('is_read').defaultTo(false);
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('insights');
};