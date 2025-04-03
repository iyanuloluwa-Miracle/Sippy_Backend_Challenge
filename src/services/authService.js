const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registered user object
 */
exports.registerUser = async (userData) => {
    const { name, email, password, role = 'user' } = userData;

    // Validate role
    if (role !== 'user' && role !== 'admin') {
        throw new Error('Invalid role specified');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Create new user
    const user = new User({
        name,
        email,
        password,  // Will be hashed by the User model pre-save middleware
        role
    });

    await user.save();

    return user;
};

/**
 * Login user and generate token
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} User object and JWT token
 */
exports.loginUser = async (credentials) => {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid login credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid login credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { user, token };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
exports.updateUser = async (userId, updateData) => {
    // Don't allow role updates through this method
    delete updateData.role;
    
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if successful
 */
exports.deleteUser = async (userId) => {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
        throw new Error('User not found');
    }
    return true;
};
