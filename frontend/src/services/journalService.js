import api from '../api/axios';

export const journalService = {
  getMyJournals: async (page = 1, limit = 10, month = '', year = '') => {
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (month) queryParams.append('month', month);
      if (year) queryParams.append('year', year);

      const response = await api.get(`/journals/my?${queryParams.toString()}`);
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch journals');
    }
  },

  getAllJournals: async (page = 1, limit = 10, month = '', year = '', userId = '') => {
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (month) queryParams.append('month', month);
      if (year) queryParams.append('year', year);
      if (userId) queryParams.append('userId', userId);

      const response = await api.get(`/journals?${queryParams.toString()}`);
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all journals');
    }
  },

  getJournalById: async (id) => {
    try {
      const response = await api.get(`/journals/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch journal entry');
    }
  },

  createJournal: async (data) => {
    try {
      const response = await api.post('/journals', data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create journal entry');
    }
  },

  updateJournal: async (id, data) => {
    try {
      const response = await api.put(`/journals/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update journal entry');
    }
  },

  deleteJournal: async (id) => {
    try {
      const response = await api.delete(`/journals/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete journal entry');
    }
  }
};
