import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
  : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

export default socket;