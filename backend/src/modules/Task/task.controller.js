import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from './task.service.js';

export const createTaskHandler = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await createTask(title, description || '', req.userId);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksHandler = async (req, res) => {
  try {
    const tasks = await getAllTasks(req.userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskHandler = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id, req.userId);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTaskHandler = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;

    const task = await updateTask(req.params.id, req.userId, updates);
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteTaskHandler = async (req, res) => {
  try {
    await deleteTask(req.params.id, req.userId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
