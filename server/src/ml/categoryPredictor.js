class CategoryPredictor {
    predict(merchantName) {
        const categories = {
        'coffee': ['starbucks', 'coffee', 'cafe'],
        'groceries': ['walmart', 'target', 'whole foods', 'trader joe'],
        'restaurants': ['restaurant', 'mcdonald', 'burger', 'pizza'],
        'transportation': ['uber', 'lyft', 'gas', 'shell', 'chevron'],
        'entertainment': ['netflix', 'spotify', 'hulu', 'movie'],
        };

        const lowerMerchant = merchantName.toLowerCase();

        for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerMerchant.includes(keyword))) {
            return category;
        }
        }

        return 'other';
    }
}

module.exports = new CategoryPredictor();