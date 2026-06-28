const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    userId: user.userId,
    role: user.role
  };

  // Ensure JWT_SECRET is loaded
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  // Generate token valid for 24 hours
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

module.exports = {
  generateToken
};
