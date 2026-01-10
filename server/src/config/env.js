require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'financial_coach',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRE || '7d'
    },

    plaid: {
        clientId: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        env: process.env.PLAID_ENV || 'sandbox'
    },

    anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY
    },

    client: {
        url: process.env.CLIENT_URL || 'http://localhost:8080'
    },

    api: {
        url: process.env.API_URL || 'http://localhost:3000'
    }
};