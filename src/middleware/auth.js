const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // 1. Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // 2. Verify token exists
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized to access this route',
                code: 'NO_TOKEN'
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ 
                success: false,
                message: 'The user belonging to this token no longer exists',
                code: 'USER_NOT_FOUND'
            });
        }

        // 5. Check if user changed password after token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'User recently changed password. Please log in again',
                code: 'PASSWORD_CHANGED'
            });
        }

        // 6. Grant access
        req.user = currentUser;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again',
                code: 'INVALID_TOKEN'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Your session has expired. Please log in again',
                code: 'TOKEN_EXPIRED'
            });
        }

        // Default error
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
            code: 'AUTH_ERROR'
        });
    }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "User role is not authorized to access this route",
      });
    }
    next();
  };
};
