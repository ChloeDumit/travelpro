import express from 'express';
import prisma from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: true,
        seller: true,
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
    res.json(sales);
  } catch (error) {
    
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Get total sales - MUST be before /:id route
router.get('/total', async (req, res) => {
  try {
    const totalSales = await prisma.sale.aggregate({
      _sum: {
        totalCost: true,
      },
    });
    console.log('totalSales', totalSales);
    res.json(totalSales._sum.totalCost || 0);
  } catch (error) {
    console.error('Error fetching total sales:', error);
    res.status(500).json({ error: 'Failed to fetch total sales' });
  }
});

// Get sales statistics - MUST be before /:id route
router.get('/stats', async (req, res) => {
  try {
    const [totalSales, salesCount, salesByStatus] = await Promise.all([
      // Total sales amount
      prisma.sale.aggregate({
        _sum: {
          totalCost: true,
        },
      }),
      // Total number of sales
      prisma.sale.count(),
      // Sales by status
      prisma.sale.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
    ]);

    const stats = {
      totalSales: totalSales._sum.totalCost || 0,
      salesCount: salesCount,
      salesByStatus: salesByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching sales statistics:', error);
    res.status(500).json({ error: 'Failed to fetch sales statistics' });
  }
});

// Get a single sale by ID
router.get('/:id', async (req, res) => {
  console.log('req.params.id',req.params.id);
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        seller: true,
        client: true,
        payments: true,
      },
    });

    console.log('sale',sale);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
});

// Create a new sale
router.post('/', async (req, res) => {
  try {
    const { saleData, items } = req.body;
    console.log(saleData, items);
    const sale = await prisma.sale.create({
      data: {
        passengerName: saleData.passengerName,
        clientId: saleData.clientId,
        travelDate: new Date(saleData.travelDate),
        saleType: saleData.saleType,
        region: saleData.region,
        serviceType: saleData.serviceType,
        status: 'draft',
        currency: saleData.currency,
        seller: {
          connect: {
            id: '1'
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
      },
    });
    res.json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

// Update sale status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const sale = await prisma.sale.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: true,
        seller: true,
      },
    });
    res.json(sale);
  } catch (error) {
    console.error('Error updating sale status:', error);
    res.status(500).json({ error: 'Failed to update sale status' });
  }
});

export default router; 