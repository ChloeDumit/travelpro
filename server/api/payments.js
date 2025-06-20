import express from 'express';
import prisma from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get payments for a specific sale
router.get('/sale/:saleId', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { saleId: req.params.saleId },
      orderBy: { date: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Create a new payment
router.post('/', async (req, res) => {
  try {
    const { saleId, date, amount, currency, method, reference } = req.body;

    // Validate required fields
    if (!saleId || !date || !amount || !currency || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if sale exists
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        saleId,
        date: new Date(date),
        amount: parseFloat(amount),
        currency,
        method,
        reference: reference || '',
        status: 'confirmed', // Default to confirmed
      },
    });

    res.json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'confirmed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    res.json(payment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id },
    });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router; 