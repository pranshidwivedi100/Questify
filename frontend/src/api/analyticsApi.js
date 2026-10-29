import api from './axios';

export const analyticsApi = {
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }
};

