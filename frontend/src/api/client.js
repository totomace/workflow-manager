import axios from 'axios';

// Dùng biến môi trường nếu có, nếu không thì fallback về localhost (dành cho dev)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Tự động gắn token vào header nếu có
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;