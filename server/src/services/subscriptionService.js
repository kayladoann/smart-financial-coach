const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const subscriptionDetector = require('../ml/subscriptionDetector');

class SubscriptionService {
    async getSubscriptions(userId) {
        return await Subscription.findByUserId(userId);
    }

    async scanSubscriptions(userId) {
        // Get last 6 months of transactions
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

        const transactions = await Transaction.findByUserId(userId, {
        startDate,
        endDate,
        });

        // Detect subscriptions
        const detectedSubs = subscriptionDetector.detect(transactions);

        // Save new subscriptions
        const subscriptions = [];
        for (const sub of detectedSubs) {
        const existing = await Subscription.findByMerchant(userId, sub.merchant);
        
        if (!existing) {
            const saved = await Subscription.create({
            user_id: userId,
            merchant_name: sub.merchant,
            amount: sub.amount,
            frequency: sub.frequency,
            last_charge_date: sub.lastCharge,
            status: 'active',
            });
            subscriptions.push(saved);
        } else {
            subscriptions.push(existing);
        }
        }

        return subscriptions;
    }
}

module.exports = new SubscriptionService();