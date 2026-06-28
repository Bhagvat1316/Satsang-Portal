const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply base authentication to all attendance routes
router.use(authMiddleware);

// --- User Routes ---
// Users can access this endpoint; controller checks if they are accessing their own data or if they are admin
router.get('/user/:userId', attendanceController.getUserAttendanceHistory);

// --- Admin Only Routes ---
router.use(requireAdmin);

router.post('/', attendanceController.createAttendance);
router.post('/bulk-present', attendanceController.markBulkPresent);
router.post('/bulk-absent', attendanceController.markBulkAbsent);
router.get('/report', attendanceController.getAttendanceReport);
router.get('/report/monthly', attendanceController.getMonthlyAttendanceAnalytics);
router.get('/top-attendees', attendanceController.getTopAttendees);

module.exports = router;
