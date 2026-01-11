exports.seed = async function(knex) {
  await knex('transactions').del();
  
  const today = new Date();
  const transactions = [];
  
  // Subscription merchants with consistent monthly charges
  const subscriptions = [
    { name: 'Netflix', amount: 15.99, day: 5 },
    { name: 'Spotify', amount: 9.99, day: 12 },
    { name: 'Amazon Prime', amount: 14.99, day: 15 },
    { name: 'Apple iCloud', amount: 2.99, day: 20 },
    { name: 'Adobe Creative Cloud', amount: 54.99, day: 3 },
  ];

  // Regular spending merchants
  const regularMerchants = [
    { name: 'Starbucks', amount: [3.50, 5.50, 4.75], category: 'Food and Drink' },
    { name: 'Whole Foods', amount: [45.00, 87.32, 67.50], category: 'Groceries' },
    { name: 'Shell Gas', amount: [35.00, 45.00, 40.00], category: 'Transportation' },
    { name: 'Target', amount: [25.00, 45.00, 67.89], category: 'Shopping' },
    { name: 'Uber', amount: [12.50, 18.75, 15.00], category: 'Transportation' },
    { name: 'Chipotle', amount: [12.50, 15.00, 13.25], category: 'Food and Drink' },
  ];

  let transactionId = 1;

  // Generate 3 months of subscription transactions (consistent amounts)
  for (let monthsAgo = 0; monthsAgo < 3; monthsAgo++) {
    subscriptions.forEach(sub => {
      const date = new Date(today);
      date.setMonth(date.getMonth() - monthsAgo);
      date.setDate(sub.day);
      
      transactions.push({
        account_id: 1,
        plaid_transaction_id: `sub_txn_${transactionId++}`,
        amount: sub.amount,
        date: date.toISOString().split('T')[0],
        merchant_name: sub.name,
        category: 'Entertainment',
        pending: false
      });
    });
  }

  // Generate random regular transactions over 3 months
  for (let i = 0; i < 30; i++) {
    const merchant = regularMerchants[Math.floor(Math.random() * regularMerchants.length)];
    const amount = Array.isArray(merchant.amount) 
      ? merchant.amount[Math.floor(Math.random() * merchant.amount.length)]
      : merchant.amount;
    
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    transactions.push({
      account_id: 1,
      plaid_transaction_id: `reg_txn_${transactionId++}`,
      amount: amount,
      date: date.toISOString().split('T')[0],
      merchant_name: merchant.name,
      category: merchant.category,
      pending: false
    });
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  await knex('transactions').insert(transactions);
};