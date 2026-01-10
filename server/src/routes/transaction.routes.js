const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.post('/sync', transactionController.syncTransactions);
router.get('/analytics', transactionController.getAnalytics);

module.exports = router;