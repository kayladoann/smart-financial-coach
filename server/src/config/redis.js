const redis = require('redis');
const config = require('./env');
const logger = require('../utils/logger');

const client = redis.createClient({
    url: config.redis.url
});

client.on('error', (err) => {
    logger.error('Redis Client Error', err);
});

client.on('connect', () => {
    logger.info('✅ Redis connected successfully');
});

(async () => {
    await client.connect();
})();

module.exports = client;