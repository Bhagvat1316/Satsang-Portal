import api from '../api/axios';

export const eventService = {
  getAllEvents: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(`/events?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },
  
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event details');
    }
  },
  
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },
  
  updateEvent: async (id, updates) => {
    try {
      const response = await api.put(`/events/${id}`, updates);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },
  
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },
  
  registerForEvent: async (eventId) => {
    // Note: Do not wrap in try/catch here so the UI can intercept the 400 status directly
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  getEventRegistrations: async (eventId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/events/${eventId}/registrations?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch registrations');
    }
  }
};
