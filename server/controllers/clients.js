import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getAllClients = async (req, res, next) => {
  try {
    const { companyId } = req.user;

    const clients = await prisma.client.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    const formattedClients = clients.map((client) => ({
      ...client,
      id: client.id.toString(),
    }));

    res.status(HTTP_STATUS.OK).json({
      message: "Clients fetched successfully",
      data: formattedClients,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const client = await prisma.client.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!client) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const formattedClient = {
      ...client,
      id: client.id.toString(),
    };

    res.status(HTTP_STATUS.OK).json({
      message: "Client fetched successfully",
      data: formattedClient,
    });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { name, clientId, email, address } = req.body;

    // Validate required fields
    if (!name) {
      throw new AppError("Name is required", HTTP_STATUS.BAD_REQUEST);
    }

    const client = await prisma.client.create({
      data: {
        companyId,
        name,
        clientId: clientId || "",
        email: email || null,
        address: address || null,
      },
    });

    const formattedClient = {
      ...client,
      id: client.id.toString(),
    };

    logger.info(`Client created: ${client.name}`);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Client created successfully",
      client: formattedClient,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const updateData = req.body;

    const existingClient = await prisma.client.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingClient) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    const formattedClient = {
      ...client,
      id: client.id.toString(),
    };

    logger.info(`Client ${id} updated`);
    res.status(HTTP_STATUS.OK).json({
      message: "Client updated successfully",
      client: formattedClient,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const existingClient = await prisma.client.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingClient) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });

    logger.info(`Client ${id} deleted`);
    res.status(HTTP_STATUS.OK).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
