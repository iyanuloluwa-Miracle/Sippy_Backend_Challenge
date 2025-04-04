const authService = require('../../services/authService');
const User = require('../../models/User');
const { createTestUser } = require('../utils/testHelpers');

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const user = await authService.registerUser(userData);
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('user');
    });

    it('should register an admin user with admin role', async () => {
      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      };

      const user = await authService.registerUser(userData);
      expect(user.role).toBe('admin');
    });

    it('should throw error for duplicate email', async () => {
      const existingUser = await createTestUser();
      const userData = {
        name: 'Duplicate User',
        email: existingUser.email,
        password: 'password123',
      };

      await expect(authService.registerUser(userData)).rejects.toThrow(
        'User already exists with this email'
      );
    });
  });

  describe('loginUser', () => {
    it('should login with correct credentials', async () => {
      const testUser = await createTestUser();
      const credentials = {
        email: testUser.email,
        password: 'password123',
      };

      const result = await authService.loginUser(credentials);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
    });

    it('should throw error for invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(authService.loginUser(credentials)).rejects.toThrow(
        'Invalid login credentials'
      );
    });

    it('should throw error for invalid password', async () => {
      const testUser = await createTestUser();
      const credentials = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      await expect(authService.loginUser(credentials)).rejects.toThrow(
        'Invalid login credentials'
      );
    });
  });
});