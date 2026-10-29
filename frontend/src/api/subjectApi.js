import api from './axios';

export const subjectApi = {
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    await api.delete(`/subjects/${id}`);
  }
};

