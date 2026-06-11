import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initCronJobs } from './utils/cronJobs.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load env variables
dotenv.config();

import connectDB from './config/db.js';

connectDB();


const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Set io instance globally on express app
app.set('io', io);

// Socket.io Connection Event Handler
io.on('connection', (socket) => {
  console.log(`Socket Client Connected: ${socket.id}`);

  socket.on('joinOrderRoom', (orderId) => {
    console.log(`Socket ${socket.id} joined room: order_${orderId}`);
    socket.join(`order_${orderId}`);
  });

  socket.on('leaveOrderRoom', (orderId) => {
    console.log(`Socket ${socket.id} left room: order_${orderId}`);
    socket.leave(`order_${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket Client Disconnected: ${socket.id}`);
  });
});

// Configure Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

import { sendNewsletterWelcomeEmail } from './utils/emailService.js';
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  try {
    await sendNewsletterWelcomeEmail(email);
    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Slice & Dice Pizza API is running...');
});

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Initialize Cron Jobs
initCronJobs();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
