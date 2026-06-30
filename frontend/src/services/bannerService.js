import api from '../api/axios';

export const bannerService = {
  getPublicBanners: async () => {
    try {
      const response = await api.get('/banners');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch public banners');
    }
  },

  getAllBannersAdmin: async () => {
    try {
      const response = await api.get('/banners/admin');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all banners');
    }
  },

  createBanner: async (formData) => {
    try {
      const response = await api.post('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create banner');
    }
  },

  updateBanner: async (id, formData) => {
    try {
      const response = await api.put(`/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update banner');
    }
  },

  deleteBanner: async (id) => {
    try {
      const response = await api.delete(`/banners/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete banner');
    }
  },

  reorderBanners: async (orderedIds) => {
    try {
      const response = await api.patch('/banners/reorder', { orderedIds });
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reorder banners');
    }
  }
};
