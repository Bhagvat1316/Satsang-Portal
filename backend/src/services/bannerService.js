const { PrismaClient } = require('@prisma/client');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');
const https = require('https');

const prisma = new PrismaClient();

// Helper: Extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper: Check URL exists
const checkUrlExists = (url) => {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false)).end();
  });
};

// Helper: Fetch best thumbnail
const getBestThumbnail = async (videoId) => {
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault'];
  for (const quality of qualities) {
    const url = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    if (await checkUrlExists(url)) {
      return url;
    }
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // ultimate fallback
};

// DTO for Admin responses (includes all fields)
const sanitizeAdminBanner = (banner) => {
  if (!banner) return null;
  return banner;
};

// DTO for Public responses (excludes internal fields, returns only required fields)
const sanitizePublicBanner = (banner) => {
  if (!banner) return null;
  return {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.imageUrl,
    buttonText: banner.buttonText,
    buttonLink: banner.buttonLink,
    mediaType: banner.mediaType,
    youtubeUrl: banner.youtubeUrl,
    youtubeVideoId: banner.youtubeVideoId,
    thumbnailUrl: banner.thumbnailUrl
  };
};

const getPublicBanners = async () => {
  const currentDate = new Date();
  const banners = await prisma.heroBanner.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: currentDate }, endDate: null },
        { startDate: null, endDate: { gte: currentDate } },
        { startDate: { lte: currentDate }, endDate: { gte: currentDate } }
      ]
    },
    orderBy: { displayOrder: 'asc' },
    take: 10
  });

  return banners.map(sanitizePublicBanner);
};

const getAllBannersAdmin = async () => {
  const banners = await prisma.heroBanner.findMany({
    orderBy: { displayOrder: 'asc' }
  });
  return banners.map(sanitizeAdminBanner);
};

const createBanner = async (filePath, bannerData) => {
  // Check limit
  const count = await prisma.heroBanner.count();
  if (count >= 10) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('Maximum of 10 banners allowed.');
    error.statusCode = 400;
    throw error;
  }

  try {
    let imageUrl = null;
    let imagePublicId = null;
    let youtubeVideoId = null;
    let thumbnailUrl = null;
    let finalYoutubeUrl = null;

    if (bannerData.mediaType === 'YOUTUBE') {
      youtubeVideoId = extractYouTubeId(bannerData.youtubeUrl);
      if (!youtubeVideoId) {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        const err = new Error('Invalid YouTube URL provided.');
        err.statusCode = 400;
        throw err;
      }
      finalYoutubeUrl = bannerData.youtubeUrl.trim();
      thumbnailUrl = await getBestThumbnail(youtubeVideoId);
    } else {
      // IMAGE type
      if (!filePath) {
        const err = new Error('Image file is required for IMAGE banner type.');
        err.statusCode = 400;
        throw err;
      }
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'SatsangPortal/HeroBanners',
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Determine display order (append to end)
    const lastBanner = await prisma.heroBanner.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const nextOrder = lastBanner ? lastBanner.displayOrder + 1 : 1;

    // Save to DB
    const newBanner = await prisma.heroBanner.create({
      data: {
        title: bannerData.title ? bannerData.title.trim() : null,
        subtitle: bannerData.subtitle ? bannerData.subtitle.trim() : null,
        imageUrl,
        imagePublicId,
        mediaType: bannerData.mediaType || 'IMAGE',
        youtubeUrl: finalYoutubeUrl,
        youtubeVideoId,
        thumbnailUrl,
        buttonText: bannerData.buttonText ? bannerData.buttonText.trim() : null,
        buttonLink: bannerData.buttonLink ? bannerData.buttonLink.trim() : null,
        startDate: bannerData.startDate ? new Date(bannerData.startDate) : null,
        endDate: bannerData.endDate ? new Date(bannerData.endDate) : null,
        displayOrder: nextOrder,
        isActive: bannerData.isActive !== undefined ? bannerData.isActive : true
      }
    });

    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return sanitizeAdminBanner(newBanner);
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'Failed to create banner.';
    }
    throw err;
  }
};

const updateBanner = async (id, bannerData, filePath = null) => {
  const existing = await prisma.heroBanner.findUnique({ where: { id } });
  if (!existing) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('Banner not found.');
    error.statusCode = 404;
    throw error;
  }

  let imageUrl = existing.imageUrl;
  let imagePublicId = existing.imagePublicId;
  let youtubeUrl = existing.youtubeUrl;
  let youtubeVideoId = existing.youtubeVideoId;
  let thumbnailUrl = existing.thumbnailUrl;
  let mediaType = bannerData.mediaType || existing.mediaType;

  try {
    if (mediaType === 'YOUTUBE') {
      if (bannerData.youtubeUrl && bannerData.youtubeUrl !== existing.youtubeUrl) {
        youtubeVideoId = extractYouTubeId(bannerData.youtubeUrl);
        if (!youtubeVideoId) {
          const err = new Error('Invalid YouTube URL provided.');
          err.statusCode = 400;
          throw err;
        }
        youtubeUrl = bannerData.youtubeUrl.trim();
        thumbnailUrl = await getBestThumbnail(youtubeVideoId);
      }
      
      // Cleanup Cloudinary if it was previously an image
      if (existing.mediaType === 'IMAGE' && existing.imagePublicId) {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      }
      
      // Enforce nulls for Image properties on Youtube banner
      imageUrl = null;
      imagePublicId = null;

    } else {
      // mediaType === 'IMAGE'
      if (filePath) {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'SatsangPortal/HeroBanners',
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        if (existing.imagePublicId) {
          await cloudinary.uploader.destroy(existing.imagePublicId);
        }
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } else if (existing.mediaType === 'YOUTUBE') {
        const err = new Error('Image file is required when switching to IMAGE banner type.');
        err.statusCode = 400;
        throw err;
      }
      
      // Enforce nulls for Youtube properties on Image banner
      youtubeUrl = null;
      youtubeVideoId = null;
      thumbnailUrl = null;
    }

    const updatedBanner = await prisma.heroBanner.update({
      where: { id },
      data: {
        title: bannerData.title !== undefined ? (bannerData.title ? bannerData.title.trim() : null) : existing.title,
        subtitle: bannerData.subtitle !== undefined ? (bannerData.subtitle ? bannerData.subtitle.trim() : null) : existing.subtitle,
        buttonText: bannerData.buttonText !== undefined ? bannerData.buttonText : existing.buttonText,
        buttonLink: bannerData.buttonLink !== undefined ? bannerData.buttonLink : existing.buttonLink,
        startDate: bannerData.startDate !== undefined ? (bannerData.startDate ? new Date(bannerData.startDate) : null) : existing.startDate,
        endDate: bannerData.endDate !== undefined ? (bannerData.endDate ? new Date(bannerData.endDate) : null) : existing.endDate,
        isActive: bannerData.isActive !== undefined ? bannerData.isActive : existing.isActive,
        mediaType,
        imageUrl,
        imagePublicId,
        youtubeUrl,
        youtubeVideoId,
        thumbnailUrl
      }
    });

    return sanitizeAdminBanner(updatedBanner);
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'Failed to update banner.';
    }
    throw err;
  }
};

const deleteBanner = async (id) => {
  const existing = await prisma.heroBanner.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Banner not found.');
    error.statusCode = 404;
    throw error;
  }

  try {
    if (existing.mediaType === 'IMAGE' && existing.imagePublicId) {
      await cloudinary.uploader.destroy(existing.imagePublicId);
    }
    await prisma.heroBanner.delete({ where: { id } });
    return true;
  } catch (err) {
    const error = new Error('Failed to delete banner.');
    error.statusCode = 500;
    throw error;
  }
};

const reorderBanners = async (orderedIds) => {
  try {
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.heroBanner.update({
          where: { id: orderedIds[i] },
          data: { displayOrder: -(i + 1) }
        });
      }

      for (let i = 0; i < orderedIds.length; i++) {
        await tx.heroBanner.update({
          where: { id: orderedIds[i] },
          data: { displayOrder: i + 1 }
        });
      }
    });
    return true;
  } catch (err) {
    const error = new Error('Failed to reorder banners.');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  getPublicBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  extractYouTubeId,
  getBestThumbnail
};
