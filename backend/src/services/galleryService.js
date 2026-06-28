const { PrismaClient } = require('@prisma/client');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const prisma = new PrismaClient();

// DTO to strip publicId before returning
const sanitizeGalleryItem = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    eventName: item.eventName,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    uploadedAt: item.uploadedAt
  };
};

const uploadGalleryImage = async (filePath, eventName, title, description) => {
  if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
    // Delete temp file if validation fails
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('eventName is required');
    error.statusCode = 400;
    throw error;
  }

  try {
    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'satsang_portal/gallery',
    });

    // 2. Save both imageUrl and publicId in database
    const galleryItem = await prisma.gallery.create({
      data: {
        eventName: eventName.trim(),
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        imageUrl: result.secure_url,
        publicId: result.public_id
      }
    });

    // Delete temporary file from local disk
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return sanitizeGalleryItem(galleryItem);
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    const error = new Error('Failed to upload image to Cloudinary');
    error.statusCode = 500;
    throw error;
  }
};

const getAllGalleryImages = async (page = 1, limit = 20, eventNameFilter = null) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {};
  if (eventNameFilter && typeof eventNameFilter === 'string' && eventNameFilter.trim() !== '') {
    // Case-insensitive filtering on eventName
    whereClause.eventName = {
      contains: eventNameFilter.trim(),
      mode: 'insensitive'
    };
  }

  const [items, total] = await Promise.all([
    prisma.gallery.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { uploadedAt: 'desc' } // newest first
    }),
    prisma.gallery.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    },
    data: items.map(sanitizeGalleryItem)
  };
};

const getGalleryItemById = async (id) => {
  let item;
  try {
    item = await prisma.gallery.findUnique({ where: { id } });
  } catch (err) {
    const error = new Error('Gallery item not found');
    error.statusCode = 404;
    throw error;
  }

  if (!item) {
    const error = new Error('Gallery item not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeGalleryItem(item);
};

const deleteGalleryImage = async (id) => {
  let item;
  try {
    item = await prisma.gallery.findUnique({ where: { id } });
  } catch (err) {
    const error = new Error('Gallery item not found');
    error.statusCode = 404;
    throw error;
  }

  if (!item) {
    const error = new Error('Gallery item not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    // 1. Delete image from Cloudinary using publicId
    await cloudinary.uploader.destroy(item.publicId);
    
    // 2. Delete database row
    await prisma.gallery.delete({ where: { id } });
    
    return true;
  } catch (err) {
    const error = new Error('Failed to delete image from Cloudinary or Database');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  uploadGalleryImage,
  getAllGalleryImages,
  getGalleryItemById,
  deleteGalleryImage
};
