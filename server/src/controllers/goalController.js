const goalService = require('../services/goalService');

class GoalController {
    async getGoals(req, res, next) {
        try {
        const goals = await goalService.getGoals(req.user.id);
        res.json({ goals });
        } catch (error) {
        next(error);
        }
    }

    async createGoal(req, res, next) {
        try {
        const { goalName, targetAmount, deadline, currentAmount = 0 } = req.body;
        
        const goal = await goalService.createGoal({
            userId: req.user.id,
            goalName,
            targetAmount,
            currentAmount,
            deadline
        });

        res.status(201).json({ goal });
        } catch (error) {
        next(error);
        }
    }

    async getGoalById(req, res, next) {
        try {
        const goal = await goalService.getGoalById(req.params.id, req.user.id);
        res.json({ goal });
        } catch (error) {
        next(error);
        }
    }

    async getForecast(req, res, next) {
        try {
        const forecast = await goalService.getForecast(req.params.id, req.user.id);
        res.json({ forecast });
        } catch (error) {
        next(error);
        }
    }

    async updateGoal(req, res, next) {
        try {
        const goal = await goalService.updateGoal(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json({ goal });
        } catch (error) {
        next(error);
        }
    }

    async deleteGoal(req, res, next) {
        try {
        await goalService.deleteGoal(req.params.id, req.user.id);
        res.json({ success: true });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new GoalController();