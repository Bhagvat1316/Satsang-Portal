const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Attach user payload to the request object
    req.user = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is not valid or has expired.'
    });
  }
};

module.exports = authMiddleware;
