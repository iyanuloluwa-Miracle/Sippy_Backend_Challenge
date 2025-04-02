const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const userData = await authService.register(req.body);
        res.status(201).json(userData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await authService.login(email, password);
        res.json(userData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
