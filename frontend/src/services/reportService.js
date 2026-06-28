import api from '../api/axios';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const reportService = {
  getAttendanceReport: async (month = '', year = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (month && month !== 'All') queryParams.append('month', month);
      if (year && year !== 'All') queryParams.append('year', year);

      const response = await api.get(`/attendance/report?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance report');
    }
  },

  getMonthlyAttendanceAnalytics: async (year = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (year && year !== 'All') queryParams.append('year', year);

      const response = await api.get(`/attendance/report/monthly?${queryParams.toString()}`);
      const rawData = response.data.data || [];

      // Normalize dataset to guarantee all 12 months are present
      const normalizedData = MONTH_NAMES.map(monthName => {
        const existingData = rawData.find(d => d.month === monthName);
        return existingData || {
          month: monthName,
          present: 0,
          absent: 0,
          percentage: 0
        };
      });

      return normalizedData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch monthly analytics');
    }
  },

  getTopAttendees: async (month = '', year = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (month && month !== 'All') queryParams.append('month', month);
      if (year && year !== 'All') queryParams.append('year', year);

      const response = await api.get(`/attendance/top-attendees?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top attendees');
    }
  }
};
