const plaidClient = require('../config/plaid');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const encryption = require('../utils/encryption');
const config = require('../config/env');

class PlaidService {
  async createLinkToken(userId) {
    const request = {
      user: {
        client_user_id: userId.toString(),
      },
      client_name: 'Smart Financial Coach',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      redirect_uri: config.client.url,
    };

    const response = await plaidClient.linkTokenCreate(request);
    return response.data.link_token;
  }

  async exchangePublicToken(publicToken, userId) {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Encrypt access token before storing
    const encryptedToken = encryption.encrypt(accessToken);

    // Get accounts
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts = [];
    for (const account of accountsResponse.data.accounts) {
      const savedAccount = await Account.create({
        user_id: userId,
        plaid_account_id: account.account_id,
        plaid_item_id: itemId,
        plaid_access_token: encryptedToken,
        account_name: account.name,
        account_type: account.type,
        balance: account.balances.current,
      });
      accounts.push(savedAccount);
    }

    return accounts;
  }

  async getTransactions(accountId, startDate, endDate) {
    const account = await Account.findById(accountId);
    
    // FIXED: Skip decryption for demo accounts
    if (!account.plaid_access_token || 
        account.plaid_access_token === 'demo_token' ||
        account.plaid_access_token === 'null') {
      return []; // Return empty array for demo accounts
    }
    
    const accessToken = encryption.decrypt(account.plaid_access_token);

    const request = {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 500,
      },
    };

    const response = await plaidClient.transactionsGet(request);
    return response.data.transactions;
  }
}

module.exports = new PlaidService();