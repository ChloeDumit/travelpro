import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const clients = await prisma.client.findMany({
      where: {
        companyId: req.user.companyId,
      },
    });
    res.json(clients);
  }
);

router.get(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
    });
    res.json(client);
  }
);

router.post(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const client = await prisma.client.create({
      data: {
        ...req.body,
        companyId: req.user.companyId,
      },
      include: {
        company: true,
      },
    });
    res.json(client);
  }
);

router.put(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
      data: req.body,
    });
    res.json(client);
  }
);

router.delete(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const client = await prisma.client.delete({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
    });
    res.json(client);
  }
);

export default router;
