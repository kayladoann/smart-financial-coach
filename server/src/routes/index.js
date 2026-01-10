
const express = require('express');
const authRoutes = require('./auth.routes');
const accountRoutes = require('./account.routes');
const transactionRoutes = require('./transaction.routes');
const insightRoutes = require('./insight.routes');
const goalRoutes = require('./goal.routes');
const subscriptionRoutes = require('./subscription.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/insights', insightRoutes);
router.use('/goals', goalRoutes);
router.use('/subscriptions', subscriptionRoutes);

module.exports = router;