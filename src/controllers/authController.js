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
            message: "🎉 Welcome aboard! Your account has been created successfully!",
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
        const { email, password } = req.body;
        const userData = await authService.login(email, password);
        res.json({
            success: true,
            message: `👋 Welcome back, ${userData.name}! Ready to be productive?`,
            data: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                token: generateToken(userData._id)
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "🤔 Hmm... " + error.message
        });
    }
};
