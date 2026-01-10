const insightService = require('../services/insightService');

class InsightController {
    async getInsights(req, res, next) {
        try {
        const { limit = 20, unreadOnly = false } = req.query;
        
        const insights = await insightService.getInsights({
            userId: req.user.id,
            limit: parseInt(limit),
            unreadOnly: unreadOnly === 'true'
        });

        res.json({ insights });
        } catch (error) {
        next(error);
        }
    }

    async generateInsights(req, res, next) {
        try {
        const insights = await insightService.generateInsights(req.user.id);
        res.json({ insights });
        } catch (error) {
        next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
        await insightService.markAsRead(req.params.id, req.user.id);
        res.json({ success: true });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new InsightController();