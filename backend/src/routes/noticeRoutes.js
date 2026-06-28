const express = require('express');
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// --- Public Routes ---
// GET /api/notices (Public: view all notices, paginated)
router.get('/', noticeController.getAllNotices);

// GET /api/notices/:id (Public: view single notice)
router.get('/:id', noticeController.getNoticeById);

// --- Admin Only Routes ---
// Apply auth & admin protection to mutating routes
router.use(authMiddleware);
router.use(requireAdmin);

// POST /api/notices (Admin: Create notice)
router.post('/', noticeController.createNotice);

// PUT /api/notices/:id (Admin: Update notice)
router.put('/:id', noticeController.updateNotice);

// DELETE /api/notices/:id (Admin: Delete notice)
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
