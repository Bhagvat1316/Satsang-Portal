const galleryService = require('../services/galleryService');

const uploadGalleryImage = async (req, res) => {
  try {
    const { eventName, title, description } = req.body;
    // req.file is populated by multer uploadMiddleware
    const filePath = req.file ? req.file.path : null;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const galleryItem = await galleryService.uploadGalleryImage(filePath, eventName, title, description);
    
    res.status(201).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getAllGalleryImages = async (req, res) => {
  try {
    const { page, limit, eventName } = req.query;
    const result = await galleryService.getAllGalleryImages(page, limit, eventName);
    
    res.status(200).json({
      success: true,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getGalleryItemById = async (req, res) => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id);
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    await galleryService.deleteGalleryImage(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Image deleted successfully'
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
  uploadGalleryImage,
  getAllGalleryImages,
  getGalleryItemById,
  deleteGalleryImage
};
