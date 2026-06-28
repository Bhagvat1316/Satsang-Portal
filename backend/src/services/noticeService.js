const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to sanitize notice DTO
const sanitizeNotice = (notice) => {
  if (!notice) return null;
  return {
    id: notice.id,
    title: notice.title,
    description: notice.description,
    priority: notice.priority,
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt
  };
};

const validateNoticeData = (data) => {
  const { title, description, priority } = data;

  if (!title || typeof title !== 'string' || title.length < 3 || title.length > 150) {
    const error = new Error('Title is required and must be between 3 and 150 characters');
    error.statusCode = 400;
    throw error;
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    const error = new Error('Description is required');
    error.statusCode = 400;
    throw error;
  }

  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
  if (priority && !validPriorities.includes(priority)) {
    const error = new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
};

const createNotice = async (data) => {
  validateNoticeData(data);
  const { title, description, priority } = data;

  const notice = await prisma.notice.create({
    data: {
      title,
      description,
      priority: priority || 'MEDIUM'
    }
  });

  return sanitizeNotice(notice);
};

const getAllNotices = async (page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100); // Cap at 100 records
  const skip = (pageNum - 1) * limitNum;

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notice.count()
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    },
    data: notices.map(sanitizeNotice)
  };
};

const getNoticeById = async (id) => {
  let notice;
  try {
    notice = await prisma.notice.findUnique({
      where: { id }
    });
  } catch (err) {
    // Catches malformed UUID strings preventing Prisma 500 errors
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }

  if (!notice) {
    const error = new Error('Notice not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeNotice(notice);
};

const updateNotice = async (id, data) => {
  validateNoticeData(data);
  
  // Verify notice exists
  await getNoticeById(id);

  const { title, description, priority } = data;

  const updatedNotice = await prisma.notice.update({
    where: { id },
    data: {
      title,
      description,
      priority
    }
  });

  return sanitizeNotice(updatedNotice);
};

const deleteNotice = async (id) => {
  try {
    await prisma.notice.delete({
      where: { id }
    });
    return true;
  } catch (err) {
    const error = new Error('Notice not found or could not be deleted');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
};
