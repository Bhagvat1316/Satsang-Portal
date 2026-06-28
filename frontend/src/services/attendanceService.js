import api from '../api/axios';

export const attendanceService = {
  /**
   * Mark a list of users as PRESENT for a given sabha session.
   * @param {string[]} userIds - Array of SAT IDs (e.g. ['SAT1001', 'SAT1002'])
   * @param {object} session - { date, name, startTime, endTime }
   */
  markBulkPresent: async (userIds, session) => {
    try {
      const response = await api.post('/attendance/bulk-present', {
        sabhaDate: session.date,
        sabhaName: session.name,
        startTime: session.startTime,
        endTime: session.endTime,
        userIds
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark users as present');
    }
  },

  /**
   * Mark a list of users as ABSENT for a given sabha session.
   * @param {string[]} userIds - Array of SAT IDs (e.g. ['SAT1001', 'SAT1002'])
   * @param {object} session - { date, name, startTime, endTime }
   */
  markBulkAbsent: async (userIds, session) => {
    try {
      const response = await api.post('/attendance/bulk-absent', {
        sabhaDate: session.date,
        sabhaName: session.name,
        startTime: session.startTime,
        endTime: session.endTime,
        userIds
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark users as absent');
    }
  },

  /**
   * Fetch attendance history for a specific user.
   * Optionally filter by month (1-12) and year.
   * @param {string} userId - SAT ID of the user
   * @param {string} [month] - Optional month number
   * @param {string} [year] - Optional year
   */
  getUserAttendanceHistory: async (userId, month = '', year = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (month) queryParams.append('month', month);
      if (year) queryParams.append('year', year);
      const response = await api.get(`/attendance/user/${userId}?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance history');
    }
  },

  /**
   * Compatibility alias for getUserAttendanceHistory.
   * Maintains backward compatibility with pages that call getAttendanceByUser.
   * Routes to the real backend endpoint GET /api/attendance/user/:userId
   */
  getAttendanceByUser: async (userId, month = '', year = '') => {
    return attendanceService.getUserAttendanceHistory(userId, month, year);
  }
};

