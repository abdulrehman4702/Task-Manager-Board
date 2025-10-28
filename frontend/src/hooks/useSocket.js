import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-room', userId);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const emitTaskUpdate = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('task-updated', data);
    }
  };

  const emitTaskCreate = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('task-created', data);
    }
  };

  const emitTaskDelete = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('task-deleted', data);
    }
  };

  const onTaskUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('task-updated', callback);
    }
  };

  const onTaskCreate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('task-created', callback);
    }
  };

  const onTaskDelete = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('task-deleted', callback);
    }
  };

  return {
    socket: socketRef.current,
    emitTaskUpdate,
    emitTaskCreate,
    emitTaskDelete,
    onTaskUpdate,
    onTaskCreate,
    onTaskDelete
  };
};
