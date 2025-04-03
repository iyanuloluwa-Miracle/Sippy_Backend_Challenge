const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: user.role === 'admin' 
                ? "🎉 Welcome aboard, Admin! Your super-powered account is ready!"
                : "🎉 Welcome aboard! Your account has been created successfully!",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "😅 Oops! " + error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { user, token } = await authService.loginUser(req.body);
        res.json({
            success: true,
            message: user.role === 'admin'
                ? `👋 Welcome back, ${user.name}! Ready to manage the system?`
                : `👋 Welcome back, ${user.name}! Ready to be productive?`,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "🤔 Hmm... " + error.message
        });
    }
};
