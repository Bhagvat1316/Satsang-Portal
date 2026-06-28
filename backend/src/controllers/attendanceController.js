const attendanceService = require('../services/attendanceService');

const createAttendance = async (req, res) => {
  try {
    const result = await attendanceService.createAttendance(req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const markBulkPresent = async (req, res) => {
  try {
    const result = await attendanceService.processBulkAttendance(req.body, 'PRESENT');
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process bulk attendance'
    });
  }
};

const markBulkAbsent = async (req, res) => {
  try {
    const result = await attendanceService.processBulkAttendance(req.body, 'ABSENT');
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process bulk attendance'
    });
  }
};

const getUserAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    // Security Check: Users can only see their own history, Admins can see anyone
    if (req.user.role !== 'ADMIN' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only access your own attendance records.'
      });
    }

    const data = await attendanceService.getUserAttendanceHistory(userId, month, year);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const data = await attendanceService.getAttendanceReport(month, year);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getMonthlyAttendanceAnalytics = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await attendanceService.getMonthlyAttendanceAnalytics(year);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getTopAttendees = async (req, res) => {
  try {
    const { month, year } = req.query;
    const data = await attendanceService.getTopAttendees(month, year);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  createAttendance,
  markBulkPresent,
  markBulkAbsent,
  getUserAttendanceHistory,
  getAttendanceReport,
  getMonthlyAttendanceAnalytics,
  getTopAttendees
};
