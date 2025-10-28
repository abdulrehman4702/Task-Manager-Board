import { Task } from './task.model.js';

export const createTask = async (title, description, userId) => {
  const task = new Task({
    title,
    description,
    userId
  });

  await task.save();
  return task;
};

export const getAllTasks = async (userId) => {
  return Task.find({ userId }).sort({ createdAt: -1 });
};

export const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

export const updateTask = async (taskId, userId, updates) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new Error('Task not found');
  }

  Object.assign(task, updates);
  await task.save();

  return task;
};

export const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new Error('Task not found');
  }

  await Task.deleteOne({ _id: taskId });
  return task;
};
