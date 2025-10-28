import express from 'express';
import cors from 'cors';
import authRoutes from './modules/Auth/auth.routes.js';
import taskRoutes from './modules/Task/task.routes.js';
import { authenticate } from './middleware/auth.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticate, taskRoutes);

export default app;
