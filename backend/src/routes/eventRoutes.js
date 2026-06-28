const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// --- Public Routes ---
// GET /api/events (Public: view all upcoming events)
router.get('/', eventController.getAllEvents);

// GET /api/events/:id (Public: view single event details)
router.get('/:id', eventController.getEventById);

// --- Authenticated Routes ---
router.use(authMiddleware);

// POST /api/events/:id/register (Auth: Users register for an event)
router.post('/:id/register', eventController.registerForEvent);

// --- Admin Only Routes ---
router.use(requireAdmin);

// POST /api/events (Admin: Create event)
router.post('/', eventController.createEvent);

// PUT /api/events/:id (Admin: Update event)
router.put('/:id', eventController.updateEvent);

// DELETE /api/events/:id (Admin: Delete event)
router.delete('/:id', eventController.deleteEvent);

// GET /api/events/:id/registrations (Admin: View who registered)
router.get('/:id/registrations', eventController.getEventRegistrations);

module.exports = router;
