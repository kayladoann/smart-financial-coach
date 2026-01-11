const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

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
    const incomeTransactions = transactions.filter((t) => parseFloat(t.amount) < 0);
    const spendingTransactions = transactions.filter((t) => parseFloat(t.amount) > 0);

    const income = incomeTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0) / 3;
    const spending = spendingTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) / 3;

    // Calculate goal metrics FIRST to get required amount
    const currentAmount = parseFloat(goal.current_amount) || 0;
    const targetAmount = parseFloat(goal.target_amount);
    const remaining = targetAmount - currentAmount;
    const percentComplete = (currentAmount / targetAmount) * 100;

    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    const monthsRemaining = Math.max(
      (deadlineDate.getFullYear() - today.getFullYear()) * 12 +
      (deadlineDate.getMonth() - today.getMonth()),
      0.5
    );

    const requiredMonthlySavings = remaining / monthsRemaining;

    // SMART SAVINGS CALCULATION
    let monthlySavings;
    if (income === 0 || incomeTransactions.length === 0) {
      // No income data available - estimate based on spending + required savings
      // Assume they have enough income to cover spending + save what's needed
      monthlySavings = Math.max(requiredMonthlySavings, spending * 0.2); // At least 20% of spending
      console.log('No income data - estimating savings capability');
    } else {
      monthlySavings = income - spending;
    }

    console.log('=== GOAL FORECAST DEBUG ===');
    console.log('Goal:', goal.goal_name);
    console.log('Income transactions:', incomeTransactions.length);
    console.log('Spending transactions:', spendingTransactions.length);
    console.log('Income (3mo avg):', income);
    console.log('Spending (3mo avg):', spending);
    console.log('Monthly Savings (calculated):', monthlySavings);
    console.log('Required/month:', requiredMonthlySavings);
    console.log('Percent complete:', percentComplete);

    // IMPROVED ON-TRACK LOGIC
    let onTrack = false;

    // Method 1: High completion percentage (close to done)
    if (percentComplete >= 80) {
    onTrack = true;
    console.log('✅ On track: 80%+ complete');
    }
    // Method 2: Very close to goal (less than 2 months of required savings left)
    else if (remaining <= requiredMonthlySavings * 2 && percentComplete >= 50) {
    onTrack = true;
    console.log('✅ On track: Less than 2 months remaining and 50%+ done');
    }
    // Method 3: Saving enough per month (with real income data)
    else if (income > 0 && monthlySavings >= requiredMonthlySavings) {
    onTrack = true;
    console.log('✅ On track: Savings rate sufficient');
    }
    // Method 4: For goals with no income data, only optimistic if significant progress
    else if (income === 0 && percentComplete >= 50) {
    onTrack = true;
    console.log('✅ On track: 50%+ complete (no income data available)');
    } else {
    console.log('⚠️ Off track');
    }

    console.log('========================');

    const projectedAmount = currentAmount + (monthlySavings * monthsRemaining);
    const shortfall = Math.max(requiredMonthlySavings - monthlySavings, 0);

    // Generate recommendations if off track
    let recommendations = [];
    if (!onTrack && shortfall > 0) {
      // Analyze spending by category to suggest reductions
      const categoryTotals = {};
      transactions.forEach((txn) => {
        const amount = parseFloat(txn.amount);
        if (!isNaN(amount) && amount > 0) {
          categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + amount;
        }
      });

      // Sort categories by spending amount
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      // Generate specific recommendations
      sortedCategories.forEach(([category, monthlyAmount]) => {
        const reductionNeeded = Math.min(shortfall, monthlyAmount * 0.2); // Suggest 20% reduction
        if (reductionNeeded > 10) { // Only suggest if meaningful
          recommendations.push({
            category: category,
            currentSpending: (monthlyAmount / 3).toFixed(2),
            suggestedReduction: reductionNeeded.toFixed(2),
            newSpending: ((monthlyAmount / 3) - reductionNeeded).toFixed(2),
            impact: `Saves $${reductionNeeded.toFixed(2)}/month`
          });
        }
      });
    }

    return {
      goalName: goal.goal_name,
      currentAmount: currentAmount.toFixed(2),
      targetAmount: targetAmount.toFixed(2),
      remaining: remaining.toFixed(2),
      monthsRemaining: Math.round(monthsRemaining),
      onTrack: onTrack,
      currentMonthlySavings: monthlySavings.toFixed(2),
      requiredMonthlySavings: requiredMonthlySavings.toFixed(2),
      projectedAmount: projectedAmount.toFixed(2),
      shortfall: shortfall.toFixed(2),
      percentComplete: percentComplete.toFixed(1),
      recommendation: onTrack 
        ? `Great! Keep saving $${requiredMonthlySavings.toFixed(2)}/month and you'll reach your goal on time.`
        : `You need to save an additional $${shortfall.toFixed(2)} per month to reach your goal on time.`,
      recommendations: recommendations,
      deadline: goal.deadline
    };
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