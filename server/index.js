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

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.corsOrigin,
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
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});