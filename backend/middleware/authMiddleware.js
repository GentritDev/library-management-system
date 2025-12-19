const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
   
    // Get token from header
    const authHeader = req.headers.authorization;
   

    if (!authHeader || !authHeader. startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token found, redirecting to login',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }

    
    const decoded = jwt. verify(token, process.env. JWT_SECRET);
    
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };

   
    next();
  } catch (error) {
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: error.message,
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        error: error.message,
      });
    }

    res.status(401).json({
      success: false,
      message: 'Token is not valid',
      error: error. message,
    });
    
  }
};

module.exports = authMiddleware;