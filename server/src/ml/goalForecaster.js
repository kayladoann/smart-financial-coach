class GoalForecaster {
    forecast(params) {
        const { currentAmount, targetAmount, deadline, monthlySavings } = params;

        const remaining = targetAmount - currentAmount;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const monthsRemaining = Math.max(
        (deadlineDate.getFullYear() - today.getFullYear()) * 12 +
        (deadlineDate.getMonth() - today.getMonth()),
        0
        );

        const requiredMonthlySavings = remaining / monthsRemaining;
        const projectedAmount = currentAmount + (monthlySavings * monthsRemaining);
        const onTrack = projectedAmount >= targetAmount;

        let recommendation = '';
        if (!onTrack) {
        const shortfall = requiredMonthlySavings - monthlySavings;
        recommendation = `You need to save an additional $${shortfall.toFixed(2)} per month to reach your goal.`;
        } else {
        recommendation = `Great! You're on track to reach your goal ${monthsRemaining} months early!`;
        }

        return {
        onTrack,
        currentAmount,
        targetAmount,
        projectedAmount: projectedAmount.toFixed(2),
        monthsRemaining,
        requiredMonthlySavings: requiredMonthlySavings.toFixed(2),
        currentMonthlySavings: monthlySavings.toFixed(2),
        recommendation
        };
    }
}

module.exports = new GoalForecaster();