
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import User from './models/User.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import interactionRoutes from './routes/interactions.js';
import adminRoutes from './routes/admin.js';

// Load environment variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Validate environment variables
if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.length < 32
) {
  console.error(
    'Missing MONGO_URI or JWT_SECRET (minimum 32 characters) in server/.env'
  );
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

const origins = (
  process.env.CLIENT_ORIGIN || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim());
  console.log('Allowed CORS origins:', origins);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: origins
  }
});

app.set('io', io);

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: origins
  })
);

app.use(express.json({ limit: '80kb' }));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'CampusKart'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api', interactionRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  const isValidationError =
    err.name === 'ValidationError' ||
    err.name === 'CastError';

  res.status(isValidationError ? 400 : 500).json({
    error: isValidationError
      ? err.message
      : 'Server error'
  });
});

// Socket authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(payload.id);

    if (!user || user.suspended) {
      return next(new Error('Unauthorized'));
    }

    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

// Socket connection
io.on('connection', (socket) => {
  socket.join('user:' + socket.userId);
});

// Connect MongoDB and start server

 // Connect MongoDB and start server
async function startServer() {
  try {
    console.log('Connecting to MongoDB Atlas...');

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000
    });

    console.log('MongoDB connected successfully');

    const PORT = Number(process.env.PORT) || 5000;

    server.listen(PORT, () => {
      console.log(
        `CampusKart API running on http://localhost:${PORT}`
      );
    });

  } catch (err) {
    console.error('\n========== MONGODB CONNECTION ERROR ==========');

    console.error('Error name:', err.name);
    console.error('Error message:', err.message);

    if (err.reason?.servers) {
      for (const [host, info] of err.reason.servers) {
        console.error('\nServer:', host);
        console.error('Server type:', info.type);
        console.error('Server error:', info.error?.message || 'None');
        console.error('Error code:', info.error?.code || 'None');
      }
    }

    console.error('==============================================\n');

    process.exit(1);
  }
}

startServer();
