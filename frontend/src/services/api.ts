import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
});

// Add request interceptor for token injection
api.interceptors.request.use(config => {
  const token = localStorage.getItem('habitarium_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('habitarium_token');
      localStorage.removeItem('habitarium_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;