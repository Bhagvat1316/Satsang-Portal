const { PrismaClient } = require('@prisma/client');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const prisma = new PrismaClient();

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
    buttonLink: banner.buttonLink
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
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('Maximum of 10 banners allowed.');
    error.statusCode = 400;
    throw error;
  }

  try {
    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'SatsangPortal/HeroBanners',
    });

    // 2. Determine display order (append to end)
    const lastBanner = await prisma.heroBanner.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const nextOrder = lastBanner ? lastBanner.displayOrder + 1 : 1;

    // 3. Save to DB
    const newBanner = await prisma.heroBanner.create({
      data: {
        title: bannerData.title.trim(),
        subtitle: bannerData.subtitle.trim(),
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
        buttonText: bannerData.buttonText ? bannerData.buttonText.trim() : null,
        buttonLink: bannerData.buttonLink ? bannerData.buttonLink.trim() : null,
        startDate: bannerData.startDate ? new Date(bannerData.startDate) : null,
        endDate: bannerData.endDate ? new Date(bannerData.endDate) : null,
        displayOrder: nextOrder,
        isActive: bannerData.isActive !== undefined ? bannerData.isActive : true
      }
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return sanitizeAdminBanner(newBanner);
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('Failed to create banner.');
    error.statusCode = 500;
    throw error;
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

  if (filePath) {
    try {
      // Upload new image
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'SatsangPortal/HeroBanners',
      });
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;

      // Delete old image
      await cloudinary.uploader.destroy(existing.imagePublicId);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      const error = new Error('Failed to upload new banner image.');
      error.statusCode = 500;
      throw error;
    }
  }

  const updatedBanner = await prisma.heroBanner.update({
    where: { id },
    data: {
      title: bannerData.title ? bannerData.title.trim() : existing.title,
      subtitle: bannerData.subtitle ? bannerData.subtitle.trim() : existing.subtitle,
      buttonText: bannerData.buttonText !== undefined ? bannerData.buttonText : existing.buttonText,
      buttonLink: bannerData.buttonLink !== undefined ? bannerData.buttonLink : existing.buttonLink,
      startDate: bannerData.startDate !== undefined ? (bannerData.startDate ? new Date(bannerData.startDate) : null) : existing.startDate,
      endDate: bannerData.endDate !== undefined ? (bannerData.endDate ? new Date(bannerData.endDate) : null) : existing.endDate,
      isActive: bannerData.isActive !== undefined ? bannerData.isActive : existing.isActive,
      imageUrl,
      imagePublicId
    }
  });

  return sanitizeAdminBanner(updatedBanner);
};

const deleteBanner = async (id) => {
  const existing = await prisma.heroBanner.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Banner not found.');
    error.statusCode = 404;
    throw error;
  }

  try {
    await cloudinary.uploader.destroy(existing.imagePublicId);
    await prisma.heroBanner.delete({ where: { id } });
    return true;
  } catch (err) {
    const error = new Error('Failed to delete banner.');
    error.statusCode = 500;
    throw error;
  }
};

const reorderBanners = async (orderedIds) => {
  // orderedIds is an array of banner IDs in the new desired order
  try {
    await prisma.$transaction(async (tx) => {
      // Temporarily set display orders to negative to avoid unique constraint violations
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.heroBanner.update({
          where: { id: orderedIds[i] },
          data: { displayOrder: -(i + 1) }
        });
      }

      // Set final display orders
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
  reorderBanners
};
