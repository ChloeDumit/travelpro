import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS, ERROR_MESSAGES, ROLES } from "../constants/index.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const getAllSales = async (req, res, next) => {
  try {
    const { companyId } = req.user;

    const sales = await prisma.sale.findMany({
      where: { companyId },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientId: true,
            email: true,
          },
        },
        items: {
          include: {
            classification: true,
            supplier: true,
            operator: true,
            passengers: true,
          },
        },
      },
      orderBy: { creationDate: "desc" },
    });

    const formattedSales = sales.map((sale) => ({
      ...sale,
      id: sale.id.toString(),
      sellerId: sale.sellerId.toString(),
      clientId: sale.clientId.toString(),
      client: {
        ...sale.client,
        id: sale.client.id.toString(),
      },
      seller: {
        ...sale.seller,
        id: sale.seller.id.toString(),
      },
      items: sale.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        saleId: item.saleId.toString(),
      })),
    }));

    logger.info("Sales data fetched");
    res.status(HTTP_STATUS.OK).json({ sales: formattedSales });
  } catch (error) {
    next(error);
  }
};

export const getMySales = async (req, res, next) => {
  try {
    const { companyId, userId } = req.user;

    const sales = await prisma.sale.findMany({
      where: {
        companyId,
        sellerId: parseInt(userId),
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientId: true,
            email: true,
          },
        },
        items: {
          include: {
            classification: true,
            supplier: true,
            operator: true,
            passengers: true,
          },
        },
      },
      orderBy: { creationDate: "desc" },
    });

    const formattedSales = sales.map((sale) => ({
      ...sale,
      id: sale.id.toString(),
      sellerId: sale.sellerId.toString(),
      clientId: sale.clientId.toString(),
      client: {
        ...sale.client,
        id: sale.client.id.toString(),
      },
      seller: {
        ...sale.seller,
        id: sale.seller.id.toString(),
      },
      items: sale.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        saleId: item.saleId.toString(),
      })),
    }));

    logger.info(`User ${userId} fetched their sales`);
    res.status(HTTP_STATUS.OK).json({ sales: formattedSales });
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { companyId, userId, role } = req.user;

    const sale = await prisma.sale.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientId: true,
            email: true,
            address: true,
          },
        },
        items: {
          include: {
            classification: true,
            supplier: true,
            operator: true,
            passengers: true,
          },
        },
      },
    });

    if (!sale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check permissions
    if (role !== ROLES.ADMIN && sale.sellerId !== parseInt(userId)) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    const formattedSale = {
      ...sale,
      id: sale.id.toString(),
      sellerId: sale.sellerId.toString(),
      clientId: sale.clientId.toString(),
      client: {
        ...sale.client,
        id: sale.client.id.toString(),
      },
      seller: {
        ...sale.seller,
        id: sale.seller.id.toString(),
      },
      items: sale.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        saleId: item.saleId.toString(),
        classificationName: item.classification?.[0]?.name || "",
        supplierName: item.supplier?.[0]?.name || "",
        operatorName: item.operator?.[0]?.name || "",
      })),
    };

    logger.info(`Sale ${id} fetched by user ${userId}`);
    res.status(HTTP_STATUS.OK).json(formattedSale);
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { saleData, items } = req.body;

    // Validate required data
    if (!saleData || !items || !Array.isArray(items)) {
      throw new AppError("Invalid sale data", HTTP_STATUS.BAD_REQUEST);
    }

    if (!saleData.client?.id) {
      throw new AppError("Client is required", HTTP_STATUS.BAD_REQUEST);
    }

    // Create sale with items
    const sale = await prisma.sale.create({
      data: {
        companyId,
        passengerName: saleData.passengerName,
        clientId: parseInt(saleData.client.id),
        travelDate: new Date(saleData.travelDate),
        saleType: saleData.saleType,
        region: saleData.region,
        serviceType: saleData.serviceType,
        status: "confirmed",
        currency: saleData.currency,
        sellerId: parseInt(saleData.sellerId),
        passengerCount: saleData.passengerCount,
        totalCost: saleData.totalCost,
        salePrice: saleData.totalSale,
        items: {
          create: items.map((item) => ({
            dateIn: item.dateIn ? new Date(item.dateIn) : null,
            dateOut: item.dateOut ? new Date(item.dateOut) : null,
            passengerCount: item.passengerCount,
            status: item.status || "pending",
            description: item.description || "",
            salePrice: item.salePrice,
            costPrice: item.costPrice,
            reservationCode: item.reservationCode || "",
            paymentDate: item.paymentDate ? new Date(item.paymentDate) : null,
            classification: item.classificationId
              ? {
                  connect: { id: parseInt(item.classificationId) },
                }
              : undefined,
            supplier: item.supplierId
              ? {
                  connect: { id: parseInt(item.supplierId) },
                }
              : undefined,
            operator: item.operatorId
              ? {
                  connect: { id: parseInt(item.operatorId) },
                }
              : undefined,
            passengers:
              item.passengers && item.passengers.length > 0
                ? {
                    connectOrCreate: item.passengers.map((passenger) => ({
                      where: { passengerId: passenger.passengerId },
                      create: {
                        name: passenger.name,
                        passengerId: passenger.passengerId,
                        email: passenger.email || null,
                        dateOfBirth: passenger.dateOfBirth,
                        companyId: companyId,
                      },
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientId: true,
            email: true,
          },
        },
        items: {
          include: {
            classification: true,
            supplier: true,
            operator: true,
            passengers: true,
          },
        },
      },
    });

    const formattedSale = {
      ...sale,
      id: sale.id.toString(),
      sellerId: sale.sellerId.toString(),
      clientId: sale.clientId.toString(),
      client: {
        ...sale.client,
        id: sale.client.id.toString(),
      },
      seller: {
        ...sale.seller,
        id: sale.seller.id.toString(),
      },
      items: sale.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        saleId: item.saleId.toString(),
      })),
    };

    logger.info(`New sale created by user ${req.user.userId}`);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Sale created successfully",
      sale: formattedSale,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, userId, role } = req.user;
    const updateData = req.body;

    // Check if sale exists
    const existingSale = await prisma.sale.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingSale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check permissions
    if (role !== ROLES.ADMIN && existingSale.sellerId !== parseInt(userId)) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Prepare update data
    const dataToUpdate = {};

    if (updateData.passengerName)
      dataToUpdate.passengerName = updateData.passengerName;
    if (updateData.travelDate)
      dataToUpdate.travelDate = new Date(updateData.travelDate);
    if (updateData.saleType) dataToUpdate.saleType = updateData.saleType;
    if (updateData.region) dataToUpdate.region = updateData.region;
    if (updateData.serviceType)
      dataToUpdate.serviceType = updateData.serviceType;
    if (updateData.currency) dataToUpdate.currency = updateData.currency;
    if (updateData.passengerCount)
      dataToUpdate.passengerCount = updateData.passengerCount;
    if (updateData.totalCost !== undefined)
      dataToUpdate.totalCost = updateData.totalCost;
    if (updateData.status) dataToUpdate.status = updateData.status;

    // Handle items update
    if (updateData.items && Array.isArray(updateData.items)) {
      // Delete existing items and their passengers
      await prisma.saleItem.deleteMany({
        where: { saleId: parseInt(id) },
      });

      // Create new items with passengers
      dataToUpdate.items = {
        create: updateData.items.map((item) => ({
          dateIn: item.dateIn ? new Date(item.dateIn) : null,
          dateOut: item.dateOut ? new Date(item.dateOut) : null,
          passengerCount: item.passengerCount,
          status: item.status || "pending",
          description: item.description || "",
          salePrice: item.salePrice,
          costPrice: item.costPrice,
          reservationCode: item.reservationCode || "",
          paymentDate: item.paymentDate ? new Date(item.paymentDate) : null,
          classification: item.classificationId
            ? {
                connect: { id: parseInt(item.classificationId) },
              }
            : undefined,
          supplier: item.supplierId
            ? {
                connect: { id: parseInt(item.supplierId) },
              }
            : undefined,
          operator: item.operatorId
            ? {
                connect: { id: parseInt(item.operatorId) },
              }
            : undefined,
          passengers:
            item.passengers && item.passengers.length > 0
              ? {
                  connectOrCreate: item.passengers.map((passenger) => ({
                    where: { passengerId: passenger.passengerId },
                    create: {
                      name: passenger.name,
                      passengerId: passenger.passengerId,
                      email: passenger.email || null,
                      dateOfBirth: passenger.dateOfBirth,
                      companyId: companyId,
                    },
                  })),
                }
              : undefined,
        })),
      };
    }

    const updatedSale = await prisma.sale.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientId: true,
            email: true,
          },
        },
        items: {
          include: {
            classification: true,
            supplier: true,
            operator: true,
            passengers: true,
          },
        },
      },
    });

    const formattedSale = {
      ...updatedSale,
      id: updatedSale.id.toString(),
      sellerId: updatedSale.sellerId.toString(),
      clientId: updatedSale.clientId.toString(),
      client: {
        ...updatedSale.client,
        id: updatedSale.client.id.toString(),
      },
      seller: {
        ...updatedSale.seller,
        id: updatedSale.seller.id.toString(),
      },
      items: updatedSale.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        saleId: item.saleId.toString(),
        classificationName: item.classification?.[0]?.name || "",
        supplierName: item.supplier?.[0]?.name || "",
        operatorName: item.operator?.[0]?.name || "",
      })),
    };

    logger.info(`Sale ${id} updated by user ${userId}`);
    res.status(HTTP_STATUS.OK).json({
      message: "Sale updated successfully",
      sale: formattedSale,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, userId, role } = req.user;

    const existingSale = await prisma.sale.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingSale) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check permissions
    if (role !== ROLES.ADMIN && existingSale.sellerId !== parseInt(userId)) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    await prisma.sale.delete({
      where: { id: parseInt(id) },
    });

    logger.info(`Sale ${id} deleted by user ${userId}`);
    res.status(HTTP_STATUS.OK).json({
      message: "Sale deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalSales = async (req, res, next) => {
  try {
    const { companyId, userId, role } = req.user;
    const whereClause =
      role === ROLES.ADMIN
        ? { companyId }
        : { companyId, sellerId: parseInt(userId) };

    const totalSales = await prisma.sale.aggregate({
      _sum: { salePrice: true },
      where: whereClause,
    });

    res.status(HTTP_STATUS.OK).json({
      total: totalSales._sum.salePrice || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesStats = async (req, res, next) => {
  try {
    const { companyId } = req.user;

    const statsByStatus = await prisma.sale.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { totalCost: true },
      where: { companyId },
    });

    const totalCount = await prisma.sale.count({
      where: { companyId },
    });

    const salesByStatus = {
      draft: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    statsByStatus.forEach((stat) => {
      if (stat.status && salesByStatus.hasOwnProperty(stat.status)) {
        salesByStatus[stat.status] = stat._count.id;
      }
    });

    const response = {
      salesByStatus,
      salesCount: totalCount,
      totalSales: statsByStatus.reduce(
        (sum, stat) => sum + (stat._sum.totalCost || 0),
        0
      ),
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getSalesStatsByType = async (req, res, next) => {
  try {
    const { companyId } = req.user;

    const [statsBySaleType, statsByServiceType, statsByRegion] =
      await Promise.all([
        prisma.sale.groupBy({
          by: ["saleType"],
          _count: { id: true },
          _sum: { totalCost: true },
          where: { companyId },
        }),
        prisma.sale.groupBy({
          by: ["serviceType"],
          _count: { id: true },
          _sum: { totalCost: true },
          where: { companyId },
        }),
        prisma.sale.groupBy({
          by: ["region"],
          _count: { id: true },
          _sum: { totalCost: true },
          where: { companyId },
        }),
      ]);

    const formatStats = (stats) => {
      const result = {};
      stats.forEach((stat) => {
        const key = stat.saleType || stat.serviceType || stat.region;
        result[key] = {
          count: stat._count.id,
          totalCost: stat._sum.totalCost || 0,
        };
      });
      return result;
    };

    const response = {
      salesBySaleType: formatStats(statsBySaleType),
      salesByServiceType: formatStats(statsByServiceType),
      salesByRegion: formatStats(statsByRegion),
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUpcomingDepartures = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingDepartures = await prisma.sale.findMany({
      where: {
        companyId,
        travelDate: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
        status: {
          in: ["confirmed", "completed"],
        },
      },
      select: {
        id: true,
        passengerName: true,
        travelDate: true,
        region: true,
        serviceType: true,
        client: {
          select: { name: true },
        },
      },
      orderBy: { travelDate: "asc" },
      take: 10,
    });

    const formattedDepartures = upcomingDepartures.map((departure) => ({
      ...departure,
      id: departure.id.toString(),
    }));

    res.status(HTTP_STATUS.OK).json({ departures: formattedDepartures });
  } catch (error) {
    next(error);
  }
};

export const getSalesOverview = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const salesByDay = await prisma.sale.groupBy({
      by: ["creationDate"],
      _count: { id: true },
      _sum: { totalCost: true },
      where: {
        companyId,
        creationDate: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
    });

    const salesMap = new Map();
    salesByDay.forEach((day) => {
      const dateKey = day.creationDate.toISOString().split("T")[0];
      salesMap.set(dateKey, {
        count: day._count.id,
        totalCost: day._sum.totalCost || 0,
      });
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dayData = salesMap.get(dateKey) || { count: 0, totalCost: 0 };

      chartData.push({
        date: dateKey,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: dayData.count,
        totalCost: dayData.totalCost,
      });
    }

    res.status(HTTP_STATUS.OK).json({ chartData });
  } catch (error) {
    next(error);
  }
};
