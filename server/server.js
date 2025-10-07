import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import socketHandler from './sockets/socketHandler.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import songRoutes from './routes/songRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { scheduleRoomCleanup } from "./cronJobs/roomCleanup.js";
import { corsMiddleware, socketCorsConfig } from './config/cors.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: socketCorsConfig
});
app.use(corsMiddleware());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/room/create', apiLimiter);
app.use('/api/auth/login', apiLimiter);

app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/song', songRoutes);

app.get('/', (req, res) => res.send('API Running'));
scheduleRoomCleanup();
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
