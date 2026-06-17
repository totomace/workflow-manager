import { io } from 'socket.io-client';

// Dùng biến môi trường để lấy URL backend, bỏ phần /api/v1
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
  : 'http://localhost:5000';

console.log('Socket connecting to:', SOCKET_URL); // Giúp debug

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'], // Ưu tiên WebSocket, fallback polling
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});

export default socket;