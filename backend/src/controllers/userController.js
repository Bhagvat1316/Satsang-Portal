const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const { fullName, username, email } = req.body;

    if (!fullName || !username) {
      return res.status(400).json({
        success: false,
        message: 'fullName and username are required fields'
      });
    }

    const result = await userService.createUser({ fullName, username, email });

    res.status(201).json({
      success: true,
      credentials: result.credentials,
      user: result.user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}`,
      data: user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'User deleted successfully'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const { username, fullName, email } = req.body;
    
    if (!username || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'username and fullName are required fields'
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    // Pass only allowed fields
    const updateData = { username, fullName, email };

    const updatedUser = await userService.updateUser(req.user.id, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getMe,
  updateMe
};
