const anomalyDetector = require('../ml/anomalyDetector');
const goalForecaster = require('../ml/goalForecaster');

class MLService {
    async detectAnomalies(transactions) {
        return anomalyDetector.detect(transactions);
    }

    async forecastGoal(params) {
        return goalForecaster.forecast(params);
    }
}

module.exports = new MLService();