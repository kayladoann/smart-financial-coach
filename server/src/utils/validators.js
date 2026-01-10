class Validators {
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    isPositiveNumber(value) {
        return typeof value === 'number' && value > 0;
    }
}

module.exports = new Validators();