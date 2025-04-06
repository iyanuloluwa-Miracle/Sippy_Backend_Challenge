const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    ...userData
  };

  const user = await User.create(defaultUser);
  return user;
};

const getAuthToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  createTestUser,
  getAuthToken
};