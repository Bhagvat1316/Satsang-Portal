const journalService = require('../services/journalService');

const createJournal = async (req, res) => {
  try {
    // Determine target SAT ID
    let targetSatId = req.user.userId;
    if (req.user.role === 'ADMIN' && req.body.userId) {
      targetSatId = req.body.userId;
    }

    const journal = await journalService.createJournal(targetSatId, req.body);
    
    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getMyJournals = async (req, res) => {
  try {
    const { page, limit, month, year } = req.query;
    // Internal user UUID mapped via req.user object attached by authMiddleware
    const internalUserId = req.user.id;

    const result = await journalService.getJournals(internalUserId, page, limit, month, year);
    
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

const getJournalById = async (req, res) => {
  try {
    const internalUserId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const journal = await journalService.getJournalById(req.params.id, internalUserId, isAdmin);
    
    res.status(200).json({
      success: true,
      data: journal
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const updateJournal = async (req, res) => {
  try {
    const internalUserId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const journal = await journalService.updateJournal(req.params.id, req.body, internalUserId, isAdmin);
    
    res.status(200).json({
      success: true,
      data: journal
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const deleteJournal = async (req, res) => {
  try {
    const internalUserId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    await journalService.deleteJournal(req.params.id, internalUserId, isAdmin);
    
    res.status(200).json({
      success: true,
      data: null,
      message: 'Journal deleted successfully'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// --- ADMIN ENDPOINTS ---

const getAllJournals = async (req, res) => {
  try {
    const { page, limit, month, year, userId } = req.query;
    
    let targetInternalUserId = null;
    if (userId) {
      targetInternalUserId = await journalService.resolveUserInternalId(userId);
    }

    const result = await journalService.getJournals(targetInternalUserId, page, limit, month, year);
    
    res.status(200).json({
      success: true,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getUserJournalsByAdmin = async (req, res) => {
  try {
    const { page, limit, month, year } = req.query;
    const targetSatId = req.params.userId;
    
    const targetInternalUserId = await journalService.resolveUserInternalId(targetSatId);

    const result = await journalService.getJournals(targetInternalUserId, page, limit, month, year);
    
    res.status(200).json({
      success: true,
      pagination: result.pagination,
      data: result.data
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
  createJournal,
  getMyJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  getAllJournals,
  getUserJournalsByAdmin
};
