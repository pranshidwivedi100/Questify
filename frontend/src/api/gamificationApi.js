import api from './axios';

export const gamificationApi = {
  getProgress: async () => {
    const response = await api.get('/gamification/progress');
    return response.data;
  },

  getAchievements: async () => {
    const response = await api.get('/gamification/achievements');
    return response.data;
  }
};

