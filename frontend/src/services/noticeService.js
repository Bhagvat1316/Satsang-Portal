import api from '../api/axios';

export const noticeService = {
  getAllNotices: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(`/notices?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notices');
    }
  },
  
  getNoticeById: async (id) => {
    try {
      const response = await api.get(`/notices/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notice');
    }
  },
  
  createNotice: async (noticeData) => {
    try {
      const response = await api.post('/notices', noticeData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create notice');
    }
  },
  
  updateNotice: async (id, updates) => {
    try {
      const response = await api.put(`/notices/${id}`, updates);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update notice');
    }
  },
  
  deleteNotice: async (id) => {
    try {
      const response = await api.delete(`/notices/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete notice');
    }
  }
};
