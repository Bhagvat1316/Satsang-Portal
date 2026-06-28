const express = require('express');
const journalController = require('../controllers/journalController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// All journal routes require authentication
router.use(authMiddleware);

// --- User Routes (Admins can also use these) ---
// Create journal (User creates for self, Admin can supply userId body to create for others)
router.post('/', journalController.createJournal);

// Get my journals
router.get('/my', journalController.getMyJournals);

// Get single journal (Controller enforces access rights)
router.get('/:id', journalController.getJournalById);

// Update single journal (Controller enforces access rights)
router.put('/:id', journalController.updateJournal);

// Delete single journal (Controller enforces access rights)
router.delete('/:id', journalController.deleteJournal);

// --- Admin Only Routes ---
router.use(requireAdmin);

// Get all journals globally
router.get('/', journalController.getAllJournals);

// Get all journals for a specific SAT ID
router.get('/user/:userId', journalController.getUserJournalsByAdmin);

module.exports = router;
