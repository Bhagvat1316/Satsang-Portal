const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to sanitize Event DTO
const sanitizeEvent = (event) => {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    venue: event.venue,
    eventDate: event.eventDate.toISOString().split('T')[0],
    createdAt: event.createdAt,
    updatedAt: event.updatedAt
  };
};

const validateEventData = (data, isNew = false) => {
  const { title, description, venue, eventDate } = data;

  if (!title || typeof title !== 'string' || title.length < 3 || title.length > 150) {
    const error = new Error('Title is required and must be between 3 and 150 characters');
    error.statusCode = 400;
    throw error;
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    const error = new Error('Description is required and cannot be empty');
    error.statusCode = 400;
    throw error;
  }

  if (!venue || typeof venue !== 'string' || venue.length > 200) {
    const error = new Error('Venue is required and cannot exceed 200 characters');
    error.statusCode = 400;
    throw error;
  }

  if (!eventDate || isNaN(new Date(eventDate).getTime())) {
    const error = new Error('Valid Event Date is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNew) {
    const eDate = new Date(`${eventDate}T00:00:00Z`);
    const now = new Date();
    // Reset time for today to allow today's events if desired, or strictly future
    now.setUTCHours(0, 0, 0, 0);
    if (eDate < now) {
      const error = new Error('Event Date must be a valid future or current date');
      error.statusCode = 400;
      throw error;
    }
  }
};

const createEvent = async (data) => {
  validateEventData(data, true);
  const { title, description, venue, eventDate } = data;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      venue,
      eventDate: new Date(`${eventDate}T00:00:00Z`)
    }
  });

  return sanitizeEvent(event);
};

const getAllEvents = async (page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      skip,
      take: limitNum,
      orderBy: { eventDate: 'asc' }, // Sort by nearest upcoming date first
      where: {
        eventDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) } // Optionally only upcoming, or all. Requirement says "nearest upcoming date first".
      }
    }),
    prisma.event.count({
      where: {
        eventDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) }
      }
    })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    },
    data: events.map(sanitizeEvent)
  };
};

const getEventById = async (id) => {
  let event;
  try {
    event = await prisma.event.findUnique({ where: { id } });
  } catch (err) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeEvent(event);
};

const updateEvent = async (id, data) => {
  validateEventData(data, false);
  
  // Verify exists
  await getEventById(id);

  const { title, description, venue, eventDate } = data;

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      venue,
      eventDate: new Date(`${eventDate}T00:00:00Z`)
    }
  });

  return sanitizeEvent(updatedEvent);
};

const deleteEvent = async (id) => {
  try {
    await prisma.event.delete({ where: { id } });
    return true;
  } catch (err) {
    const error = new Error('Event not found or could not be deleted');
    error.statusCode = 404;
    throw error;
  }
};

const registerForEvent = async (eventId, userSatId) => {
  let event;
  try {
    event = await prisma.event.findUnique({ where: { id: eventId } });
  } catch(err) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { userId: userSatId } });
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'ACTIVE') {
    const error = new Error('Only active users can register for events');
    error.statusCode = 403;
    throw error;
  }

  // Check duplicate
  const existingReg = await prisma.eventRegistration.findUnique({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: event.id
      }
    }
  });

  if (existingReg) {
    const error = new Error('User is already registered for this event');
    error.statusCode = 400;
    throw error;
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      userId: user.id,
      eventId: event.id
    }
  });

  return {
    userId: user.userId,
    fullName: user.fullName,
    registeredAt: registration.registeredAt
  };
};

const getEventRegistrations = async (eventId, page = 1, limit = 10) => {
  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  // Validate event exists
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error();
  } catch (err) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const [registrations, total] = await Promise.all([
    prisma.eventRegistration.findMany({
      where: { eventId },
      skip,
      take: limitNum,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: {
          select: {
            userId: true,
            fullName: true
          }
        }
      }
    }),
    prisma.eventRegistration.count({ where: { eventId } })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  const data = registrations.map(reg => ({
    userId: reg.user.userId,
    fullName: reg.user.fullName,
    registeredAt: reg.registeredAt
  }));

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    },
    data
  };
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
