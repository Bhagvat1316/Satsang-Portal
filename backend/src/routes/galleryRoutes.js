const express = require('express');
const galleryController = require('../controllers/galleryController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// --- Public Routes ---
// GET /api/gallery (Public: fetch all paginated images)
router.get('/', galleryController.getAllGalleryImages);

// GET /api/gallery/:id (Public: fetch single image)
router.get('/:id', galleryController.getGalleryItemById);

// --- Admin Only Routes ---
router.use(authMiddleware);
router.use(requireAdmin);

// POST /api/gallery/upload (Admin: Upload new image)
router.post('/upload', uploadMiddleware, galleryController.uploadGalleryImage);

// DELETE /api/gallery/:id (Admin: Delete image from Cloudinary + DB)
router.delete('/:id', galleryController.deleteGalleryImage);

module.exports = router;
