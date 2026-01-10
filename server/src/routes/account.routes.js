const express = require('express');
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/link-token', accountController.createLinkToken);
router.post('/exchange-token', accountController.exchangePublicToken);
router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccountById);

module.exports = router;