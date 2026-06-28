const eventService = require('../services/eventService');

const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await eventService.getAllEvents(page, limit);
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

const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const registerForEvent = async (req, res) => {
  try {
    // If Admin, they can supply userId in body to register someone else.
    // If User, they can only register themselves, determined by the JWT token.
    let targetSatId = req.user.userId;
    
    if (req.user.role === 'ADMIN' && req.body.userId) {
      targetSatId = req.body.userId;
    }

    const registration = await eventService.registerForEvent(req.params.id, targetSatId);
    
    res.status(201).json({
      success: true,
      data: registration,
      message: 'Successfully registered for the event'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await eventService.getEventRegistrations(req.params.id, page, limit);
    
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
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations
};
