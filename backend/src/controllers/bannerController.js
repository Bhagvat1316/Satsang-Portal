const bannerService = require('../services/bannerService');

const getPublicBanners = async (req, res) => {
  try {
    const banners = await bannerService.getPublicBanners();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await bannerService.getAllBannersAdmin();
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, startDate, endDate, isActive, mediaType, youtubeUrl } = req.body;
    const filePath = req.file ? req.file.path : null;

    const bannerData = {
      title,
      subtitle,
      buttonText,
      buttonLink,
      startDate,
      endDate,
      mediaType,
      youtubeUrl,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true
    };

    const newBanner = await bannerService.createBanner(filePath, bannerData);
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, buttonText, buttonLink, startDate, endDate, isActive, mediaType, youtubeUrl } = req.body;
    const filePath = req.file ? req.file.path : null;

    const bannerData = {};
    if (title !== undefined) bannerData.title = title;
    if (subtitle !== undefined) bannerData.subtitle = subtitle;
    if (buttonText !== undefined) bannerData.buttonText = buttonText;
    if (buttonLink !== undefined) bannerData.buttonLink = buttonLink;
    if (mediaType !== undefined) bannerData.mediaType = mediaType;
    if (youtubeUrl !== undefined) bannerData.youtubeUrl = youtubeUrl;
    if (startDate !== undefined) bannerData.startDate = startDate === 'null' ? null : startDate;
    if (endDate !== undefined) bannerData.endDate = endDate === 'null' ? null : endDate;
    if (isActive !== undefined) bannerData.isActive = isActive === 'true' || isActive === true;

    const updatedBanner = await bannerService.updateBanner(id, bannerData, filePath);
    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

const reorderBanners = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array of IDs' });
    }
    
    await bannerService.reorderBanners(orderedIds);
    res.status(200).json({ success: true, message: 'Banners reordered successfully' });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  getPublicBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners
};
