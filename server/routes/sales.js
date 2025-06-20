import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, ROLES } from '../constants/index.js';
import logger from '../utils/logger.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all sales (admin and sales roles)
router.get('/', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        creationDate: 'desc'
      }
    });

    logger.info('Sales data fetched');
    res.status(HTTP_STATUS.OK).json({ sales });
  } catch (error) {
    next(error);
  }
});

// Get sales by user
router.get('/my-sales', authenticate, requireRole([ROLES.SALES]), async (req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: {
        creationDate: 'desc'
      }
    });

    logger.info(`User ${req.user.userId} fetched their sales`);
    res.status(HTTP_STATUS.OK).json({ sales });
  } catch (error) {
    next(error);
  }
});

// Create new sale
router.post('/', authenticate, requireRole([ROLES.SALES, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { saleData, items } = req.body;
    const userId = req.user.userId;

    // Validate that we have a client
    if (!saleData.client) {
      throw new AppError('Client is required', HTTP_STATUS.BAD_REQUEST);
    }

    const sale = await prisma.sale.create({
      data: {
        passengerName: saleData.passengerName,
        client: {
          connect: {
            id: saleData.client.id
          }
        },
        travelDate: new Date(saleData.travelDate),
        saleType: saleData.saleType,
        region: saleData.region,
        serviceType: saleData.serviceType,
        status: 'draft',
        currency: saleData.currency,
        seller: {
          connect: {
            id: saleData.seller
          }
        },
        passengerCount: saleData.passengerCount,
        totalCost: saleData.totalCost,
        items: {
          create: items.map(item => ({
            classification: item.classification,
            provider: item.provider,
            operator: item.operator,
            dateIn: new Date(item.dateIn),
            dateOut: new Date(item.dateOut),
            passengerCount: item.passengerCount,
            status: item.status,
            description: item.description,
            salePrice: item.salePrice,
            saleCurrency: item.saleCurrency,
            costPrice: item.costPrice,
            costCurrency: item.costCurrency,
            reservationCode: item.reservationCode,
            paymentDate: item.paymentDate ? new Date(item.paymentDate) : null,
          })),
        },
      },
      include: {
        items: true,
        seller: true,
        client: true,
      },
    });

    logger.info(`New sale created by user ${userId}`);
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    next(error);
  }
});

// Update sale
router.put('/:id', authenticate, requireRole([ROLES.SALES, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const userId = req.user.userId;

    // Check if sale exists and belongs to user
    const existingSale = await prisma.sale.findUnique({
      where: { id }
    });

    console.log(req.body);

    if (!existingSale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Prepare update data with proper date conversion and remove invalid fields
    const updateData = {
      passengerName: body.passengerName,
      travelDate: body.travelDate ? new Date(body.travelDate) : undefined,
      saleType: body.saleType,
      region: body.region,
      serviceType: body.serviceType,
      currency: body.currency,
      passengerCount: body.passengerCount,
      totalCost: body.totalCost,
      status: body.status,
    };

    // Only include fields that are actually present in the request
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Handle items update if provided
    if (body.items && Array.isArray(body.items)) {
      // Delete existing items
      await prisma.saleItem.deleteMany({
        where: { saleId: id }
      });

      // Add items to updateData
      updateData.items = {
        create: body.items.map(item => ({
          classification: item.classification,
          provider: item.provider,
          operator: item.operator,
          dateIn: new Date(item.dateIn),
          dateOut: new Date(item.dateOut),
          passengerCount: item.passengerCount,
          status: item.status,
          description: item.description,
          salePrice: item.salePrice,
          saleCurrency: item.saleCurrency,
          costPrice: item.costPrice,
          costCurrency: item.costCurrency,
          reservationCode: item.reservationCode,
          paymentDate: item.paymentDate ? new Date(item.paymentDate) : null,
        })),
      };
    }

    const updatedSale = await prisma.sale.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        seller: true,
        client: true,
      },
    });

    console.log(updatedSale);

    logger.info(`Sale ${id} updated by user ${userId}`);
    res.status(HTTP_STATUS.OK).json({
      message: 'Sale updated successfully',
      sale: updatedSale
    });
  } catch (error) {
    next(error);
  }
});

// Delete sale
router.delete('/:id', authenticate, requireRole([ROLES.SALES, ROLES.ADMIN]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Check if sale exists
    const existingSale = await prisma.sale.findUnique({
      where: { id }
    });

    if (!existingSale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Only allow deletion if user is admin or owns the sale
    if (userRole !== ROLES.ADMIN && existingSale.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    await prisma.sale.delete({
      where: { id }
    });

    logger.info(`Sale ${id} deleted by user ${userId}`);
    res.status(HTTP_STATUS.OK).json({
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get a single sale by ID
router.get('/:id', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
        seller: true,
        client: true,
      }
    });

    if (!sale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Only allow access if user is admin or owns the sale
    if (userRole !== ROLES.ADMIN && sale.seller.id !== userId) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    logger.info(`Sale ${id} fetched by user ${userId}`);
    res.status(HTTP_STATUS.OK).json(sale);
  } catch (error) {
    next(error);
  }
});

export default router; 