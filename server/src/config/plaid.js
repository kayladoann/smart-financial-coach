const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const config = require('./env');

const configuration = new Configuration({
    basePath: PlaidEnvironments[config.plaid.env],
    baseOptions: {
        headers: {
        'PLAID-CLIENT-ID': config.plaid.clientId,
        'PLAID-SECRET': config.plaid.secret,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

module.exports = plaidClient;