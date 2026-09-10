const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getJwtSecret, getJwtVerifyOptions } = require('./config/jwt');

/**
 * @typedef {Object} JwtPayload
 * @property {number} id - User ID
 * @property {string} email - User email
 */

/**
 * @typedef {Object} SocketWithAuth
 * @property {string} id - Socket ID
 * @property {number} [userId] - Authenticated user ID
 * @property {string} [userEmail] - Authenticated user email
 * @property {Function} join - Join a room
 * @property {Function} leave - Leave a room
 * @property {Function} emit - Emit event
 * @property {Function} on - Listen for event
 * @property {Function} disconnect - Disconnect socket
 * @property {string} handshake - Handshake data
 * @property {Object} io - Socket.IO server instance
 */

/**
 * @typedef {Object} TokenRefreshedEvent
 * @property {boolean} success
 * @property {string} [error]
 */

// Track active connections per user: Map<userId, Set<socketId>>
/** @type {Map<string, Set<string>>} */
const userConnections = new Map();

/** @type {Server|null} */
let io = null;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} server - HTTP server
 * @returns {Server} Socket.IO server instance
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://workflow-manager-theta.vercel.app'
      ],
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    /** @type {string|undefined} */
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      /** @type {JwtPayload} */
      const decoded = jwt.verify(token, getJwtSecret(), getJwtVerifyOptions());
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (err) {
      // Provide more specific error for token expiration
      if (err.name === 'TokenExpiredError') {
        return next(new Error('Token expired'));
      }
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    /** @type {number|undefined} */
    const userId = socket.userId;
    console.log('Client connected:', socket.id, 'User:', userId);

    // Track this connection for the user
    if (userId) {
      const userIdStr = userId.toString();

      // Initialize set if first connection for this user
      if (!userConnections.has(userIdStr)) {
        userConnections.set(userIdStr, new Set());
      }

      // Add this socket to user's connections
      userConnections.get(userIdStr).add(socket.id);

      // Join user to their private room for targeted events
      // Only join if this is the first connection (room membership is per-socket, but we track at user level)
      socket.join(userIdStr);
      console.log(`User ${userIdStr} connected (socket: ${socket.id}). Active connections: ${userConnections.get(userIdStr).size}`);
    }

    // Handle token refresh request from client
    /**
     * @param {string} newToken - New JWT token
     */
    socket.on('refresh_token', async (newToken) => {
      try {
        /** @type {JwtPayload} */
        const decoded = jwt.verify(newToken, process.env.JWT_SECRET || 'your-secret-key');
        const oldUserId = socket.userId;
        const newUserId = decoded.id;

        // Update socket's userId
        socket.userId = newUserId;
        socket.userEmail = decoded.email;

        // If userId changed, handle room migration
        if (oldUserId !== newUserId) {
          // Leave old user's room
          if (oldUserId) {
            const oldUserIdStr = oldUserId.toString();
            socket.leave(oldUserIdStr);
            // Clean up old user's connection tracking
            if (userConnections.has(oldUserIdStr)) {
              userConnections.get(oldUserIdStr).delete(socket.id);
              if (userConnections.get(oldUserIdStr).size === 0) {
                userConnections.delete(oldUserIdStr);
              }
            }
          }

          // Join new user's room
          const newUserIdStr = newUserId.toString();
          socket.join(newUserIdStr);

          // Track new connection for new user
          if (!userConnections.has(newUserIdStr)) {
            userConnections.set(newUserIdStr, new Set());
          }
          userConnections.get(newUserIdStr).add(socket.id);
        } else {
          // Re-join the user's room with same userId (in case it changed)
          socket.join(socket.userId.toString());
        }

        /** @type {TokenRefreshedEvent} */
        const response = { success: true };
        socket.emit('token_refreshed', response);
      } catch (err) {
        /** @type {TokenRefreshedEvent} */
        const response = { success: false, error: 'Invalid token' };
        socket.emit('token_refreshed', response);
      }
    });

    /**
     * @param {string} reason - Disconnect reason
     */
    socket.on('disconnect', (reason) => {
      /** @type {number|undefined} */
      const userId = socket.userId;
      console.log('Client disconnected:', socket.id, 'User:', userId, 'Reason:', reason);

      // Clean up connection tracking
      if (userId) {
        const userIdStr = userId.toString();

        if (userConnections.has(userIdStr)) {
          const connections = userConnections.get(userIdStr);
          connections.delete(socket.id);

          console.log(`User ${userIdStr} disconnected (socket: ${socket.id}). Remaining connections: ${connections.size}`);

          // If this was the last connection for this user, clean up
          if (connections.size === 0) {
            userConnections.delete(userIdStr);
            console.log(`User ${userIdStr} has no more active connections. Cleaned up tracking.`);

            // Optional: Emit user offline event for presence tracking
            // io.emit('user:offline', { userId });
          }
        }
      }
    });
  });

  return io;
}

/**
 * Get Socket.IO server instance
 * @returns {Server} Socket.IO server instance
 * @throws {Error} If Socket.IO not initialized
 */
function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

module.exports = { initSocket, getIO };