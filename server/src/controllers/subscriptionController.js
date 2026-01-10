const subscriptionService = require('../services/subscriptionService');

class SubscriptionController {
    async getSubscriptions(req, res, next) {
        try {
        const subscriptions = await subscriptionService.getSubscriptions(req.user.id);
        res.json({ subscriptions });
        } catch (error) {
        next(error);
        }
    }

    async scanSubscriptions(req, res, next) {
        try {
        const subscriptions = await subscriptionService.scanSubscriptions(req.user.id);
        res.json({ subscriptions });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new SubscriptionController();