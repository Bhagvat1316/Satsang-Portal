const { PrismaClient } = require('@prisma/client');
const { comparePassword } = require('../utils/passwordUtil');
const { generateToken } = require('../utils/jwtUtil');
const { sanitizeUser } = require('../utils/userDto');

const prisma = new PrismaClient();

const loginUser = async (userId, password) => {
  // 1. Find user by userId
  const user = await prisma.user.findUnique({
    where: { userId }
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 2. Reject inactive users
  if (user.status === 'INACTIVE') {
    const error = new Error('Your account is currently inactive. Please contact the administrator.');
    error.statusCode = 403;
    throw error;
  }

  // 3. Validate password
  const isMatch = await comparePassword(password, user.password);
  
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 4. Generate JWT
  const token = generateToken(user);

  // 5. Return sanitized user info and token
  return {
    token,
    user: sanitizeUser(user)
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  
  if (!isMatch) {
    const error = new Error('Current password is incorrect.');
    error.statusCode = 400;
    throw error;
  }

  const { hashPassword } = require('../utils/passwordUtil');
  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  return true;
};

module.exports = {
  loginUser,
  changePassword
};
