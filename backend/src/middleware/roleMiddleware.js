const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. User information is missing.'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin access required.'
    });
  }

  next();
};

const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. User information is missing.'
    });
  }

  if (req.user.role !== 'USER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Valid user role required.'
    });
  }

  next();
};

module.exports = {
  requireAdmin,
  requireUser
};
