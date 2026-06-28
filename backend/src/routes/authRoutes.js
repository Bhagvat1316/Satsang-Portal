const express = require('express');
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', authController.login);

// @route   PUT /api/auth/change-password
// @desc    Change user's password
// @access  Private (Any authenticated user)
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
