import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });
  res.json(user);
});

router.post('/', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(user);
});


router.delete('/:id', async (req, res) => {
  const user = await prisma.user.delete({
    where: { id: req.params.id },

  });
  res.json(user);
});




export default router;