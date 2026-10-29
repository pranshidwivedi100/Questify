import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://questify-backend-dg5z.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('questify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid redirecting if already on login or register
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && path !== '/') {
        localStorage.removeItem('questify_token');
        localStorage.removeItem('questify_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

