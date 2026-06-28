import api from '../api/axios';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch current user profile');
    }
  },

  updateMe: async (data) => {
    try {
      const response = await api.put('/users/me', data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update current user profile');
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  },
  
  createUser: async (fullName, username, email = null) => {
    try {
      const payload = { fullName, username };
      if (email) payload.email = email;
      const response = await api.post('/users', payload);
      
      // Backend returns { success: true, credentials: {...}, user: {...} } at the top level
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },
  
  toggleUserStatus: async (id) => {
    try {
      const response = await api.patch(`/users/${id}/status`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle status');
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data.success;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
};
