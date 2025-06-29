import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
});

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('habitarium_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('habitarium_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;