const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public route
router.get('/', bannerController.getPublicBanners);

// Admin routes
router.get('/admin', authMiddleware, requireAdmin, bannerController.getAllBannersAdmin);
router.post('/', authMiddleware, requireAdmin, uploadMiddleware, bannerController.createBanner);
router.patch('/reorder', authMiddleware, requireAdmin, bannerController.reorderBanners);
router.put('/:id', authMiddleware, requireAdmin, uploadMiddleware, bannerController.updateBanner);
router.delete('/:id', authMiddleware, requireAdmin, bannerController.deleteBanner);

module.exports = router;
