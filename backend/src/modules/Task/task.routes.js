import express from 'express';
import {
  createTaskHandler,
  getTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
} from './task.controller.js';

const router = express.Router();

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.get('/:id', getTaskHandler);
router.put('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
