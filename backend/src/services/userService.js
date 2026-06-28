const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/passwordUtil');
const { sanitizeUser, sanitizeUsers } = require('../utils/userDto');

const prisma = new PrismaClient();

// Utility to generate a random 6-character alphanumeric password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Utility to generate next SAT ID
const generateNextUserId = async () => {
  // Find the user with the highest userId that starts with SAT
  const lastUser = await prisma.user.findFirst({
    where: {
      userId: {
        startsWith: 'SAT'
      }
    },
    orderBy: {
      userId: 'desc'
    }
  });

  if (!lastUser) {
    return 'SAT1001';
  }

  // Extract the numeric part and increment
  const lastIdNumber = parseInt(lastUser.userId.replace('SAT', ''), 10);
  const nextIdNumber = lastIdNumber + 1;
  return `SAT${nextIdNumber}`;
};

const createUser = async (data) => {
  const { fullName, username, email } = data;

  // Validate username uniqueness (case-insensitive check by fetching)
  const existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      }
    }
  });

  if (existingUser) {
    const error = new Error('Username already exists. Please choose a different username.');
    error.statusCode = 400;
    throw error;
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      const error = new Error('Email already exists.');
      error.statusCode = 400;
      throw error;
    }
  }

  const userId = await generateNextUserId();
  const rawPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(rawPassword);

  const newUser = await prisma.user.create({
    data: {
      userId,
      fullName,
      username,
      email,
      password: hashedPassword,
      role: 'USER',
      status: 'ACTIVE'
    }
  });

  return {
    user: sanitizeUser(newUser),
    credentials: {
      userId: newUser.userId,
      password: rawPassword
    }
  };
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return sanitizeUsers(users);
};

const getUserById = async (id) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id }
    });
  } catch (err) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

const updateUser = async (id, data) => {
  const { fullName, username, email } = data;

  // Check if username is being changed and if it already exists
  if (username) {
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' },
        id: { not: id }
      }
    });

    if (existingUsername) {
      const error = new Error('Username already exists. Please choose a different username.');
      error.statusCode = 400;
      throw error;
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id }
      }
    });

    if (existingEmail) {
      const error = new Error('Email already exists.');
      error.statusCode = 400;
      throw error;
    }
  }

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        username,
        email
      }
    });
  } catch (err) {
    const error = new Error('User not found or invalid ID');
    error.statusCode = 404;
    throw error;
  }
  
  return sanitizeUser(updatedUser);
};

const toggleUserStatus = async (id) => {
  let user;
  try {
    user = await prisma.user.findUnique({ where: { id } });
  } catch (err) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status: newStatus }
  });
  
  return sanitizeUser(updatedUser);
};

const deleteUser = async (id) => {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch (err) {
    const error = new Error('User not found or could not be deleted');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser
};
