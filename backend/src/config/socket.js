import { Server } from 'socket.io';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('task-updated', (data) => {
      socket.broadcast.emit('task-updated', data);
    });

    socket.on('task-created', (data) => {
      socket.broadcast.emit('task-created', data);
    });

    socket.on('task-deleted', (data) => {
      socket.broadcast.emit('task-deleted', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
