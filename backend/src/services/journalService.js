const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to sanitize JournalEntry DTO and map User -> SAT ID
const sanitizeJournal = (journal) => {
  if (!journal) return null;
  return {
    id: journal.id,
    userId: journal.user ? journal.user.userId : undefined,
    fullName: journal.user ? journal.user.fullName : undefined,
    title: journal.title,
    learning: journal.learning,
    sabhaDate: journal.sabhaDate.toISOString().split('T')[0],
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt
  };
};

const validateJournalData = (data) => {
  const { title, learning, sabhaDate } = data;

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.length > 150) {
    const error = new Error('Title is required and must be between 3 and 150 characters');
    error.statusCode = 400;
    throw error;
  }

  if (!learning || typeof learning !== 'string' || learning.trim() === '') {
    const error = new Error('Learning is required and cannot be blank');
    error.statusCode = 400;
    throw error;
  }

  if (!sabhaDate || isNaN(new Date(sabhaDate).getTime())) {
    const error = new Error('Valid Sabha Date is required');
    error.statusCode = 400;
    throw error;
  }
};

const resolveUserInternalId = async (targetUserId) => {
  const user = await prisma.user.findUnique({
    where: { userId: targetUserId }
  });

  if (!user) {
    const error = new Error(`User not found for SAT ID: ${targetUserId}`);
    error.statusCode = 404;
    throw error;
  }

  return user.id;
};

// Create a journal entry
const createJournal = async (targetUserId, data) => {
  validateJournalData(data);
  const internalUserId = await resolveUserInternalId(targetUserId);

  const { title, learning, sabhaDate } = data;

  const journal = await prisma.journalEntry.create({
    data: {
      userId: internalUserId,
      title: title.trim(),
      learning: learning.trim(),
      sabhaDate: new Date(`${sabhaDate}T00:00:00Z`)
    },
    include: {
      user: {
        select: {
          userId: true,
          fullName: true
        }
      }
    }
  });

  return sanitizeJournal(journal);
};

// Get journals (with pagination and optional filters)
const getJournals = async (internalUserId = null, page = 1, limit = 10, month = null, year = null) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const whereClause = {};

  if (internalUserId) {
    whereClause.userId = internalUserId;
  }

  if (month && year) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    whereClause.sabhaDate = {
      gte: startDate,
      lt: endDate
    };
  } else if (year) {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));
    whereClause.sabhaDate = {
      gte: startDate,
      lt: endDate
    };
  }

  const [journals, total] = await Promise.all([
    prisma.journalEntry.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { sabhaDate: 'desc' },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true
          }
        }
      }
    }),
    prisma.journalEntry.count({ where: whereClause })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    },
    data: journals.map(sanitizeJournal)
  };
};

// Get single journal
const getJournalById = async (id, internalUserId = null, requireAdmin = false) => {
  let journal;
  try {
    journal = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true
          }
        }
      }
    });
  } catch (err) {
    const error = new Error('Journal not found');
    error.statusCode = 404;
    throw error;
  }

  if (!journal) {
    const error = new Error('Journal not found');
    error.statusCode = 404;
    throw error;
  }

  // Security barrier: Non-admins can only view their own journal
  if (!requireAdmin && internalUserId && journal.userId !== internalUserId) {
    const error = new Error('Forbidden: You can only access your own journals');
    error.statusCode = 403;
    throw error;
  }

  return sanitizeJournal(journal);
};

// Update journal
const updateJournal = async (id, data, internalUserId = null, requireAdmin = false) => {
  validateJournalData(data);
  const { title, learning, sabhaDate } = data;

  // Fetch handles security 403 barrier intrinsically
  await getJournalById(id, internalUserId, requireAdmin);

  const updatedJournal = await prisma.journalEntry.update({
    where: { id },
    data: {
      title: title.trim(),
      learning: learning.trim(),
      sabhaDate: new Date(`${sabhaDate}T00:00:00Z`)
    },
    include: {
      user: {
        select: {
          userId: true,
          fullName: true
        }
      }
    }
  });

  return sanitizeJournal(updatedJournal);
};

// Delete journal
const deleteJournal = async (id, internalUserId = null, requireAdmin = false) => {
  // Security barrier
  await getJournalById(id, internalUserId, requireAdmin);

  try {
    await prisma.journalEntry.delete({ where: { id } });
    return true;
  } catch (err) {
    const error = new Error('Journal not found or could not be deleted');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  resolveUserInternalId
};
