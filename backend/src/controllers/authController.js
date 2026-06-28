const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate request body
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both userId and password'
      });
    }

    const result = await authService.loginUser(userId, password);

    res.status(200).json({
      success: true,
      token: result.token,
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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword and newPassword are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    // req.user is set by authMiddleware
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
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
  login,
  changePassword
};
