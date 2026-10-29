import api from './axios';

export const timerApi = {
  logSession: async (sessionData) => {
    const response = await api.post('/focus-sessions', sessionData);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get('/focus-sessions');
    return response.data;
  },

  deleteSession: async (id) => {
    await api.delete(`/focus-sessions/${id}`);
  }
};

