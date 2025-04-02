const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    }

    async register(userData) {
        const { name, email, password, role } = userData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: this.generateToken(user._id)
        };
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            throw new Error('Invalid email or password');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: this.generateToken(user._id)
        };
    }
}

module.exports = new AuthService();
