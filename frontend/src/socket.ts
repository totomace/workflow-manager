import { io } from 'socket.io-client';
import client from './api/client';
import type { TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent, TokenRefreshedEvent } from './types';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')
  : 'http://localhost:5000';

console.log('🔌 Socket connecting to:', SOCKET_URL);

// Get auth token from localStorage - this function is called on EACH connection attempt
const getAuthToken = (): string | null => localStorage.getItem('accessToken');

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshingToken = false;

// Type the socket with event handlers using io() options
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  // Use a function for auth - Socket.IO calls this before each connection/reconnection attempt
  auth: () => ({
    token: getAuthToken(),
  }),
  // Disable auto-reconnect so we can handle token refresh manually
  reconnection: false,
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  // Re-enable auto-reconnect after successful connection
  socket.io.reconnection(true);
});

socket.on('connect_error', async (err: Error) => {
  console.error('❌ Socket connection error:', err.message);

  // If token expired, try to refresh and reconnect
  if (err.message === 'Token expired' && !isRefreshingToken) {
    isRefreshingToken = true;
    try {
      console.log('🔄 Token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const res = await client.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        console.log('✅ Token refreshed, reconnecting...');
        // Reconnect with new token
        socket.connect();
      } else {
        console.error('❌ No refresh token available');
        // Redirect to login
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      // Redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    } finally {
      isRefreshingToken = false;
    }
  } else if (err.message === 'Authentication required' || err.message === 'Invalid token') {
    // For other auth errors, redirect to login
    console.error('❌ Authentication failed, redirecting to login');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
  }
});

socket.on('disconnect', (reason: string) => {
  console.log('🔌 Socket disconnected:', reason);
  // Re-enable reconnection for non-auth related disconnects
  if (reason !== 'io client disconnect') {
    socket.io.reconnection(true);
  }
});

// Listen for token_refreshed event (from backend after manual refresh)
socket.on('token_refreshed', (data: TokenRefreshedEvent) => {
  if (data.success) {
    console.log('✅ Token refreshed via backend event');
  } else {
    console.error('❌ Backend token refresh failed:', data.error);
  }
});

export default socket;