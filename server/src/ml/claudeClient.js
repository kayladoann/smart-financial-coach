// const Anthropic = require('@anthropic-ai/sdk');
// const config = require('../config/env');

// const anthropic = new Anthropic({
//     apiKey: config.anthropic.apiKey,
//     });

//     class ClaudeClient {
//     async generateInsights(data) {
//         const prompt = `You are a friendly financial coach. Analyze this spending data and provide 3-5 personalized, actionable insights.

//     Spending by category (last 30 days):
//     ${JSON.stringify(data.spending, null, 2)}

//     Transaction count: ${data.transactionCount}

//     Provide insights as a JSON array with format:
//     [
//     {
//         "type": "spending_alert|savings_tip|anomaly",
//         "message": "Friendly, specific message",
//         "data": { relevant data }
//     }
//     ]

//     Focus on:
//     - Specific amounts and categories
//     - Actionable suggestions
//     - Positive, non-judgmental tone
//     - Concrete savings opportunities`;

//         try {
//         const message = await anthropic.messages.create({
//             model: 'claude-sonnet-4-20250514',
//             max_tokens: 1000,
//             messages: [{
//             role: 'user',
//             content: prompt
//             }]
//         });

//         const responseText = message.content[0].text;
//         const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        
//         if (jsonMatch) {
//             return JSON.parse(jsonMatch[0]);
//         }

//         // Fallback insights if parsing fails
//         return this.getDefaultInsights(data);
//         } catch (error) {
//         console.error('Claude API error:', error);
//         return this.getDefaultInsights(data);
//         }
//     }

//     getDefaultInsights(data) {
//         const insights = [];
//         const sortedCategories = Object.entries(data.spending)
//             .sort((a, b) => b[1] - a[1]);

//         if (sortedCategories.length > 0) {
//             const [topCategory, topAmount] = sortedCategories[0];
//             const amount = parseFloat(topAmount) || 0;
//             insights.push({
//             type: 'spending_alert',
//             message: `You spent $${amount.toFixed(2)} on ${topCategory} this month. This is your highest spending category.`,
//             data: { category: topCategory, amount: amount }
//             });
//         }

//         // Add a second insight if there are multiple categories
//         if (sortedCategories.length > 1) {
//             const [secondCategory, secondAmount] = sortedCategories[1];
//             const amount = parseFloat(secondAmount) || 0;
//             insights.push({
//             type: 'savings_tip',
//             message: `Your ${secondCategory} spending is $${amount.toFixed(2)} this month. Consider reviewing if you can reduce this category.`,
//             data: { category: secondCategory, amount: amount }
//             });
//         }

//         // Add general insight
//         const totalSpending = sortedCategories.reduce((sum, [_, amt]) => {
//             return sum + (parseFloat(amt) || 0);
//         }, 0);
        
//         insights.push({
//             type: 'goal_update',
//             message: `You've tracked ${data.transactionCount} transactions totaling $${totalSpending.toFixed(2)} this month. Great job staying on top of your finances!`,
//             data: { totalSpending, transactionCount: data.transactionCount }
//         });

//         return insights;
//     }
// }

// module.exports = new ClaudeClient();

const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/env');

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

class ClaudeClient {
  async generateInsights(data) {
    const prompt = `You are a friendly financial coach. Analyze this spending data and provide 3-5 personalized, actionable insights.

Spending by category (last 30 days):
${JSON.stringify(data.spending, null, 2)}

Transaction count: ${data.transactionCount}

Provide insights as a JSON array with format:
[
  {
    "type": "spending_alert|savings_tip|anomaly",
    "message": "Friendly, specific message",
    "data": { relevant data }
  }
]

Focus on:
- Specific amounts and categories
- Actionable suggestions
- Positive, non-judgmental tone
- Concrete savings opportunities`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback insights if parsing fails
      return this.getDefaultInsights(data);
    } catch (error) {
      console.error('Claude API error:', error);
      return this.getDefaultInsights(data);
    }
  }

  getDefaultInsights(data) {
    const insights = [];
    const sortedCategories = Object.entries(data.spending)
      .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const amount = parseFloat(topAmount) || 0;
      insights.push({
        type: 'spending_alert',
        message: `You spent $${amount.toFixed(2)} on ${topCategory} this month. This is your highest spending category.`,
        data: { category: topCategory, amount: amount }
      });
    }

    // Add a second insight if there are multiple categories
    if (sortedCategories.length > 1) {
      const [secondCategory, secondAmount] = sortedCategories[1];
      const amount = parseFloat(secondAmount) || 0;
      insights.push({
        type: 'savings_tip',
        message: `Your ${secondCategory} spending is $${amount.toFixed(2)} this month. Consider reviewing if you can reduce this category.`,
        data: { category: secondCategory, amount: amount }
      });
    }

    // Add general insight
    const totalSpending = sortedCategories.reduce((sum, [_, amt]) => {
      return sum + (parseFloat(amt) || 0);
    }, 0);
    
    insights.push({
      type: 'goal_update',
      message: `You've tracked ${data.transactionCount} transactions totaling $${totalSpending.toFixed(2)} this month. Great job staying on top of your finances!`,
      data: { totalSpending, transactionCount: data.transactionCount }
    });

    return insights;
  }
}

module.exports = new ClaudeClient();