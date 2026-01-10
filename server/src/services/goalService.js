const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const mlService = require('./mlService');

class GoalService {
    async getGoals(userId) {
        return await Goal.findByUserId(userId);
    }

    async createGoal(data) {
        return await Goal.create({
        user_id: data.userId,
        goal_name: data.goalName,
        target_amount: data.targetAmount,
        current_amount: data.currentAmount || 0,
        deadline: data.deadline,
        status: 'active',
        });
    }

    async getGoalById(goalId, userId) {
        const goal = await Goal.findById(goalId);
        
        if (!goal || goal.user_id !== userId) {
        const error = new Error('Goal not found');
        error.statusCode = 404;
        throw error;
        }

        return goal;
    }

    async getForecast(goalId, userId) {
        const goal = await this.getGoalById(goalId, userId);

        // Get recent transactions to calculate average savings
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

        const transactions = await Transaction.findByUserId(userId, {
        startDate,
        endDate,
        });

        // Calculate monthly income and spending
        const income = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) / 3;

        const spending = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0) / 3;

        const monthlySavings = income - spending;

        // Use ML to forecast
        const forecast = await mlService.forecastGoal({
        currentAmount: goal.current_amount,
        targetAmount: goal.target_amount,
        deadline: goal.deadline,
        monthlySavings,
        });

        return forecast;
    }

    async updateGoal(goalId, userId, updates) {
        const goal = await this.getGoalById(goalId, userId);
        return await Goal.update(goalId, updates);
    }

    async deleteGoal(goalId, userId) {
        const goal = await this.getGoalById(goalId, userId);
        return await Goal.delete(goalId);
    }
}

module.exports = new GoalService();