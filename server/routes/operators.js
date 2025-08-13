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
    try {
      const operators = await prisma.operator.findMany({
        where: {
          companyId: req.user.companyId,
        },
      });
      res.json(operators);
    } catch (error) {
      console.error("Error fetching operators:", error);
      res.status(500).json({ message: "Error al obtener operadores" });
    }
  }
);

router.get(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const operator = await prisma.operator.findUnique({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
      });

      if (!operator) {
        return res.status(404).json({ message: "Operador no encontrado" });
      }

      res.json(operator);
    } catch (error) {
      console.error("Error fetching operator:", error);
      res.status(500).json({ message: "Error al obtener operador" });
    }
  }
);

router.post(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const operator = await prisma.operator.create({
        data: {
          ...req.body,
          companyId: req.user.companyId,
        },
        include: {
          company: true,
        },
      });
      res.json(operator);
    } catch (error) {
      console.error("Error creating operator:", error);
      res.status(500).json({ message: "Error al crear operador" });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const operator = await prisma.operator.update({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
        data: req.body,
      });
      res.json(operator);
    } catch (error) {
      console.error("Error updating operator:", error);
      res.status(500).json({ message: "Error al actualizar operador" });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const operator = await prisma.operator.delete({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
      });
      res.json({ message: "Operador eliminado exitosamente" });
    } catch (error) {
      console.error("Error deleting operator:", error);
      res.status(500).json({ message: "Error al eliminar operador" });
    }
  }
);

export default router;
