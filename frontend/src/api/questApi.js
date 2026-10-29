import api from './axios';

export const questApi = {
  getQuests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'ALL') params.append('priority', filters.priority);
    if (filters.subjectId) params.append('subjectId', filters.subjectId);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/quests?${params.toString()}`);
    return response.data;
  },

  getQuestById: async (id) => {
    const response = await api.get(`/quests/${id}`);
    return response.data;
  },

  createQuest: async (questData) => {
    const response = await api.post('/quests', questData);
    return response.data;
  },

  updateQuest: async (id, questData) => {
    const response = await api.put(`/quests/${id}`, questData);
    return response.data;
  },

  deleteQuest: async (id) => {
    await api.delete(`/quests/${id}`);
  },

  completeQuest: async (id) => {
    const response = await api.patch(`/quests/${id}/complete`);
    return response.data;
  },

  reopenQuest: async (id) => {
    const response = await api.patch(`/quests/${id}/reopen`);
    return response.data;
  },

  getCalendarQuests: async (start, end) => {
    const response = await api.get('/quests/calendar', {
      params: { start, end }
    });
    return response.data;
  },

  getOverdueQuests: async () => {
    const response = await api.get('/quests/overdue');
    return response.data;
  }
};

