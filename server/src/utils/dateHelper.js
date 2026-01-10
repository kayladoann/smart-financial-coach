class DateHelper {
    formatDate(date) {
        return new Date(date).toISOString().split('T')[0];
    }

    getDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.formatDate(date);
    }

    getMonthsAgo(months) {
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        return this.formatDate(date);
    }

    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

module.exports = new DateHelper();