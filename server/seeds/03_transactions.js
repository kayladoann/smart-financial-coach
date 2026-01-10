exports.seed = async function(knex) {
    await knex('transactions').del();
    
    const today = new Date();
    const transactions = [];
    
    // Generate sample transactions
    const merchants = [
        { name: 'Starbucks', amount: 5.50, category: 'Food and Drink' },
        { name: 'Whole Foods', amount: 87.32, category: 'Groceries' },
        { name: 'Shell Gas', amount: 45.00, category: 'Transportation' },
        { name: 'Netflix', amount: 15.99, category: 'Entertainment' },
        { name: 'Spotify', amount: 9.99, category: 'Entertainment' },
        { name: 'Amazon', amount: 124.50, category: 'Shopping' },
        { name: 'Uber', amount: 18.75, category: 'Transportation' },
    ];
    
    for (let i = 0; i < 30; i++) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        transactions.push({
        account_id: 1,
        plaid_transaction_id: `demo_txn_${i}`,
        amount: merchant.amount,
        date: date.toISOString().split('T')[0],
        merchant_name: merchant.name,
        category: merchant.category,
        pending: false
        });
    }
    
    await knex('transactions').insert(transactions);
};