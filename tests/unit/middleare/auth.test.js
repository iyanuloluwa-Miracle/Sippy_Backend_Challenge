const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../../../middleware/auth');
const User = require('../../../models/User');
const { createTestUser } = require('../../utils/testHelpers');

describe('Auth Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('protect', () => {
    it('should call next() with valid token', async () => {
      const testUser = await createTestUser();
      const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      mockRequest.headers.authorization = `Bearer ${token}`;
      await protect(mockRequest, mockResponse, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user._id.toString()).toBe(testUser._id.toString());
    });

    it('should return 401 if no token provided', async () => {
      await protect(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route',
        code: 'NO_TOKEN',
      });
    });

    it('should return 401 for invalid token', async () => {
      mockRequest.headers.authorization = 'Bearer invalidtoken';
      await protect(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token. Please log in again',
        code: 'INVALID_TOKEN',
      });
    });
  });

  describe('authorize', () => {
    it('should call next() if user has required role', async () => {
      const testUser = await createTestUser('admin');
      mockRequest.user = testUser;

      const middleware = authorize('admin');
      middleware(mockRequest, mockResponse, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if user does not have required role', async () => {
      const testUser = await createTestUser('user');
      mockRequest.user = testUser;

      const middleware = authorize('admin');
      middleware(mockRequest, mockResponse, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User role is not authorized to access this route',
      });
    });
  });
});