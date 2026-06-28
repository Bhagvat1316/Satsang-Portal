const noticeService = require('../services/noticeService');

const createNotice = async (req, res) => {
  try {
    const notice = await noticeService.createNotice(req.body);
    res.status(201).json({
      success: true,
      data: notice
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await noticeService.getAllNotices(page, limit);
    
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

const getNoticeById = async (req, res) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const notice = await noticeService.updateNotice(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    await noticeService.deleteNotice(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Notice deleted successfully'
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
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
};
