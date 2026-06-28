const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection to all routes in this module
router.use(authMiddleware);

// --- Profile Endpoints (Any authenticated user) ---
// @route   GET /api/users/me
router.get('/me', userController.getMe);

// @route   PUT /api/users/me
router.put('/me', userController.updateMe);

// --- Admin Endpoints ---
// Apply admin protection to subsequent routes
router.use(requireAdmin);

// @route   POST /api/users
router.post('/', userController.createUser);

// @route   GET /api/users
router.get('/', userController.getAllUsers);

// @route   GET /api/users/:id
router.get('/:id', userController.getUserById);

// @route   PUT /api/users/:id
router.put('/:id', userController.updateUser);

// @route   PATCH /api/users/:id/status
router.patch('/:id/status', userController.toggleUserStatus);

// @route   DELETE /api/users/:id
router.delete('/:id', userController.deleteUser);

module.exports = router;
