import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/error.js';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import salesRoutes from './routes/sales.js';
import clientsRoutes from './routes/clients.js';
import paymentsRoutes from './api/payments.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/payments', paymentsRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || config.port || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});