const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'No token provided' 
        });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // Add user info to request
        req.user = {
        id: decoded.userId,
        email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            error: 'Token expired' 
        });
        }
        
        return res.status(401).json({ 
        error: 'Invalid token' 
        });
    }
};

module.exports = authMiddleware;