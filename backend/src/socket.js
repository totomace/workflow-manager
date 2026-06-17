const { Server } = require('socket.io');

let io;

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

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

module.exports = { initSocket, getIO };