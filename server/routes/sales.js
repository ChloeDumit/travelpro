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
        },
      },
      where: {
        companyId: req.user.companyId
      },
      orderBy: {
        creationDate: 'desc'
      }
    },

  );

    logger.info('Sales data fetched');
console.log(sales)
    res.status(HTTP_STATUS.OK).json({ sales });
    
  } catch (error) {
    next(error);
  }
});

// Get sales by user
router.get('/my-sales', authenticate, requireRole([ROLES.SALES]), async (req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({
      where: {
        companyId: req.user.companyId
      },
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
    const companyId = req.user.companyId;

    // Validate that we have a client
    if (!saleData.client) {
      throw new AppError('Client is required', HTTP_STATUS.BAD_REQUEST);
    }

    const sale = await prisma.sale.create({
      data: {
        company: {
          connect: {
            id: req.user.companyId
          }
        },
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
        salePrice: saleData.totalSale,
        items: {
          create: items.map(item => ({
            classification: item.classification,
            provider: item.provider,
            operator: item.operator,
            dateIn: item.dateIn ?? new Date(item.dateIn),
            dateOut: item.dateOut ?? new Date(item.dateOut),
            passengerCount: item.passengerCount,
            status: item.status,
            description: item.description,
            salePrice: item.salePrice,
            saleCurrency: item.saleCurrency,
            costPrice: item.costPrice,
            costCurrency: item.costCurrency,
            reservationCode: item.reservationCode,
            paymentDate: item.paymentDate ?? new Date(item.paymentDate),
          })),
        },
      },
      include: {
        items: true,
        seller: true,
        client: true,
        company: true
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
      where: { id, companyId: req.user.companyId }
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

// Get total sales amount
router.get('/total', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const totalSales = await prisma.sale.aggregate({
      _sum: {
        totalCost: true
      },
      where: {
        companyId: req.user.companyId
      }
    });

    res.status(HTTP_STATUS.OK).json({ total: totalSales._sum.totalCost || 0 });
  } catch (error) {
    next(error);
  }
});


// Get sales statistics
router.get('/stats', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    // Get sales grouped by status
    const statsByStatus = await prisma.sale.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      _sum: {
        totalCost: true
      },
      where: {
        companyId: req.user.companyId
      }
    });

    // Get total sales count
    const totalCount = await prisma.sale.count();

    // Transform the data to match frontend expectations
    const salesByStatus = {
      draft: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };

    statsByStatus.forEach(stat => {
      if (stat.status && salesByStatus.hasOwnProperty(stat.status)) {
        salesByStatus[stat.status] = stat._count.id;
      }
    });

    const response = {
      salesByStatus,
      salesCount: totalCount,
      totalSales: statsByStatus.reduce((sum, stat) => sum + (stat._sum.totalCost || 0), 0)
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
});

// Get sales statistics by type
router.get('/stats-by-type', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    // Get sales grouped by saleType
    const statsBySaleType = await prisma.sale.groupBy({
      by: ['saleType'],
      _count: {
        id: true
      },
      _sum: {
        totalCost: true
      },
      where: {
        companyId: req.user.companyId
      }
    });

    // Get sales grouped by serviceType
    const statsByServiceType = await prisma.sale.groupBy({
      by: ['serviceType'],
      _count: {
        id: true
      },
      _sum: {
        totalCost: true
      },
      where: {
        companyId: req.user.companyId
      }
    });

    // Get sales grouped by region
    const statsByRegion = await prisma.sale.groupBy({
      by: ['region'],
      _count: {
        id: true
      },
      _sum: {
        totalCost: true
      },
      where: {
        companyId: req.user.companyId
      }
    });

    // Transform the data
    const salesBySaleType = {};
    const salesByServiceType = {};
    const salesByRegion = {};

    statsBySaleType.forEach(stat => {
      salesBySaleType[stat.saleType] = {
        count: stat._count.id,
        totalCost: stat._sum.totalCost || 0
      };
    });

    statsByServiceType.forEach(stat => {
      salesByServiceType[stat.serviceType] = {
        count: stat._count.id,
        totalCost: stat._sum.totalCost || 0
      };
    });

    statsByRegion.forEach(stat => {
      salesByRegion[stat.region] = {
        count: stat._count.id,
        totalCost: stat._sum.totalCost || 0
      };
    });

    const response = {
      salesBySaleType,
      salesByServiceType,
      salesByRegion
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
});

// Get upcoming departures
router.get('/upcoming-departures', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingDepartures = await prisma.sale.findMany({
      where: {
        travelDate: {
          gte: today,
          lte: thirtyDaysFromNow
        },
        status: {
          in: ['confirmed', 'completed']
        },
        companyId: req.user.companyId
        
      },
      select: {
        id: true,
        passengerName: true,
        travelDate: true,
        region: true,
        serviceType: true,
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        travelDate: 'asc'
      },
      take: 10
    }
    );

    res.status(HTTP_STATUS.OK).json({ departures: upcomingDepartures });
  } catch (error) {
    next(error);
  }
});

// Get sales overview data for chart
router.get('/sales-overview', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // 6 days ago (to include today = 7 days total)
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of that day

    // Get sales count by day for the last 7 days
    const salesByDay = await prisma.sale.groupBy({
      by: ['creationDate'],
      _count: {
        id: true
      },
      _sum: {
        totalCost: true
      },
      where: {
        creationDate: {
          gte: sevenDaysAgo,
          lte: today
        },
        companyId: req.user.companyId
      }
    });

    // Create a map of dates to sales data
    const salesMap = new Map();
    salesByDay.forEach(day => {
      const dateKey = day.creationDate.toISOString().split('T')[0];
      salesMap.set(dateKey, {
        count: day._count.id,
        totalCost: day._sum.totalCost || 0
      });
    });

    // Generate data for the last 7 days (including today)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = salesMap.get(dateKey) || { count: 0, totalCost: 0 };
      
      chartData.push({
        date: dateKey,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayData.count,
        totalCost: dayData.totalCost
      });
    }

    res.status(HTTP_STATUS.OK).json({ chartData });
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
      },
      where: {
        companyId: req.user.companyId
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
})


export default router;