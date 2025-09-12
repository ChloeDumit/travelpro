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
    const passengers = await prisma.passenger.findMany({
      where: {
        companyId: req.user.companyId,
      },
    });
    res.json({ passengers });
  }
);

router.get(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const passenger = await prisma.passenger.findUnique({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
    });
    res.json(passenger);
  }
);

router.post(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const passenger = await prisma.passenger.create({
        data: {
          ...req.body,
          companyId: req.user.companyId,
        },
      });
      res.json({ message: "Passenger created successfully", passenger });
    } catch (error) {
      console.error("Error creating passenger:", error);
      res.status(400).json({
        message: "Error creating passenger",
        error: error.message,
      });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const passenger = await prisma.passenger.update({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
      data: req.body,
    });
    res.json(passenger);
  }
);

router.delete(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    const passenger = await prisma.passenger.delete({
      where: { id: parseInt(req.params.id), companyId: req.user.companyId },
    });
    res.json(passenger);
  }
);

export default router;
