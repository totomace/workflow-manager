import { io, Socket } from 'socket.io-client';
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
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_BASE = 1000; // 1 second base delay

// Type the socket with event handlers using io() options
const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  // Use a function for auth - Socket.IO calls this before each connection/reconnection attempt
  auth: () => ({
    token: getAuthToken(),
  }),
  // Enable auto-reconnect with exponential backoff
  reconnection: true,
  reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  reconnectionDelay: RECONNECT_DELAY_BASE,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  // Prevent MaxListenersExceededWarning by setting max listeners
  autoConnect: true,
});

// Set max listeners to prevent MaxListenersExceededWarning
// Check if method exists (may not exist in some browser bundles of socket.io-client)
if (typeof socket.setMaxListeners === 'function') {
  socket.setMaxListeners(20);
}

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  reconnectAttempts = 0; // Reset on successful connection
});

socket.on('connect_error', async (err: Error) => {
  console.error('❌ Socket connection error:', err.message);
  reconnectAttempts++;

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

// Handle reconnection attempts
socket.io.on('reconnect_attempt', (attemptNumber: number) => {
  console.log(`🔄 Reconnection attempt ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`);
});

socket.io.on('reconnect', (attemptNumber: number) => {
  console.log(`✅ Reconnected after ${attemptNumber} attempts`);
  reconnectAttempts = 0;
});

socket.io.on('reconnect_failed', () => {
  console.error('❌ Reconnection failed after all attempts');
  // Optionally redirect to login or show notification
  if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
    // Don't force redirect, just log - let user decide
    console.warn('⚠️ Socket reconnection failed. Please refresh the page or check your connection.');
  }
});

export default socket;