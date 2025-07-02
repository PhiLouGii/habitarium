import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Add request interceptor for token injection
api.interceptors.request.use(config => {
  const token = localStorage.getItem('habitarium_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(response => response, error => {
  if (error.code === 'ECONNABORTED') {
    return Promise.reject(new Error('Request timed out. Please try again.'));
  }
  
  if (!error.response) {
    return Promise.reject(new Error('Network error. Please check your connection.'));
  }
  
  return Promise.reject(error);
});

export default api;