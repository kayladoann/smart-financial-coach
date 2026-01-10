exports.seed = async function(knex) {
    await knex('accounts').del();
    
    await knex('accounts').insert([
        {
        id: 1,
        user_id: 1,
        plaid_account_id: 'demo_checking',
        plaid_item_id: 'demo_item',
        plaid_access_token: null,
        account_name: 'Demo Checking',
        account_type: 'depository',
        balance: 5420.50
        }
    ]);
};