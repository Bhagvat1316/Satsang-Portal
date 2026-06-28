import api from '../api/axios';

export const galleryService = {
  getGallery: async (page = 1, limit = 100, eventName = '') => {
    try {
      const queryParams = new URLSearchParams({ page, limit });
      if (eventName) queryParams.append('eventName', eventName);
      
      const response = await api.get(`/gallery?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch gallery');
    }
  },
  
  getGalleryById: async (id) => {
    try {
      const response = await api.get(`/gallery/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch gallery item');
    }
  },
  
  uploadImage: async (formData) => {
    try {
      const response = await api.post('/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
  
  deleteImage: async (id) => {
    try {
      const response = await api.delete(`/gallery/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete image');
    }
  }
};
