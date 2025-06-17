import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

router.get('/:id', async (req, res) => {
  const client = await prisma.client.findUnique({
    where: { id: req.params.id },
  });
  res.json(client);
});

router.post('/', async (req, res) => {
    console.log(req.body);
  const client = await prisma.client.create({
    data: req.body,
  });
  res.json(client);
});

router.put('/:id', async (req, res) => {
  const client = await prisma.client.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(client);
});

router.delete('/:id', async (req, res) => {
  const client = await prisma.client.delete({
    where: { id: req.params.id },
  });
  res.json(client);
});



export default router;