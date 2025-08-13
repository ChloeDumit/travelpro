import express from 'express';
import prisma from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

router.get('/', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res) => {
  console.log(';entre')
  const suppliers = await prisma.supplier.findMany({
    where: {
      companyId: req.user.companyId
    }
  });
  res.json(suppliers);
});

router.get('/:id', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: parseInt(req.params.id), companyId: req.user.companyId },
  });
  res.json(supplier);
});

router.post('/', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res) => {
console.log('acaaaaaaaa', req.user)
  const supplier = await prisma.supplier.create({
    data: {
      ...req.body,
      companyId: req.user.companyId
    },
    include: {
      company: true
    }
  });
  res.json(supplier);
});

router.put('/:id', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res) => {
  const supplier = await prisma.supplier.update({
    where: { id: req.params.id, companyId: req.user.companyId },
    data: req.body,
  });
  res.json(supplier);
});

router.delete('/:id', authenticate, requireRole([ROLES.ADMIN, ROLES.SALES]), async (req, res) => {
  const supplier = await prisma.supplier.delete({
    where: { id: req.params.id, companyId: req.user.companyId },
  });
  res.json(supplier);
});



export default router;