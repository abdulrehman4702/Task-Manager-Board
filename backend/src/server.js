import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import dotenv from 'dotenv';

dotenv.config();

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

connectDB();

const io = initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
