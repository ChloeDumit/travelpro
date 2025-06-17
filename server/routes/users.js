import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, ROLES } from '../constants/index.js';
import logger from '../utils/logger.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin and sales roles)
router.get('/', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    logger.info('Users list fetched');
    res.status(HTTP_STATUS.OK).json({ users });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    logger.info(`User ${updatedUser.email} updated their profile`);
    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.USER_UPDATED,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, requireRole([ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    logger.info(`Admin deleted user ${id}`);
    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.USER_DELETED
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
});

export default router; 