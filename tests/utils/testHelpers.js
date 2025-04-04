const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

exports.createTestUser = async (role = 'user') => {
  return await User.create({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role,
  });
};

exports.getAuthToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};