const plaidService = require('../services/plaidService');
const Account = require('../models/Account');

class AccountController {
    async createLinkToken(req, res, next) {
        try {
        const linkToken = await plaidService.createLinkToken(req.user.id);
        res.json({ linkToken });
        } catch (error) {
        next(error);
        }
    }

    async exchangePublicToken(req, res, next) {
        try {
        const { publicToken } = req.body;
        
        const accounts = await plaidService.exchangePublicToken(
            publicToken,
            req.user.id
        );

        res.json({ accounts });
        } catch (error) {
        next(error);
        }
    }

    async getAccounts(req, res, next) {
        try {
        const accounts = await Account.findByUserId(req.user.id);
        res.json({ accounts });
        } catch (error) {
        next(error);
        }
    }

    async getAccountById(req, res, next) {
        try {
        const account = await Account.findById(req.params.id);
        
        if (!account || account.user_id !== req.user.id) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ account });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new AccountController();