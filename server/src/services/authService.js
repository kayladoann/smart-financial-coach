const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

class AuthService {
    async register(userData) {
        // Check if user already exists
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, 10);

        // Create user
        const user = await User.create({
            email: userData.email,
            password_hash: passwordHash,
            first_name: userData.firstName,
            last_name: userData.lastName
        });

        // Generate token
        const token = this.generateToken(user);

        return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        },
        token
    };
}

async login(email, password) {
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    // Generate token
    const token = this.generateToken(user);

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        },
        token
        };
    }

    generateToken(user) {
        return jwt.sign(
        { userId: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
        );
    }
}

module.exports = new AuthService();