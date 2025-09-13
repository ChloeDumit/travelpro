import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all supplier payments
const getAllSupplierPayments = async (req, res) => {
  try {
    const { companyId } = req.user;

    const payments = await prisma.supplierPayment.findMany({
      where: { companyId },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        relatedSales: {
          select: {
            id: true,
            passengerName: true,
            totalCost: true,
            status: true,
            creationDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ payments });
  } catch (error) {
    console.error("Error getting supplier payments:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get supplier payment by ID
const getSupplierPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const payment = await prisma.supplierPayment.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        relatedSales: {
          select: {
            id: true,
            passengerName: true,
            totalCost: true,
            status: true,
            creationDate: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error getting supplier payment:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Create new supplier payment
const createSupplierPayment = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      supplierId,
      amount,
      currency,
      paymentDate,
      description,
      relatedSales,
      paymentMethod,
      reference,
    } = req.body;

    // Validate required fields
    if (
      !supplierId ||
      !amount ||
      !currency ||
      !paymentDate ||
      !description ||
      !paymentMethod
    ) {
      return res.status(400).json({
        error: "Todos los campos requeridos deben ser proporcionados",
      });
    }

    // Check if supplier exists and belongs to company
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(supplierId),
        companyId,
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    // Create the payment
    const payment = await prisma.supplierPayment.create({
      data: {
        companyId,
        supplierId: parseInt(supplierId),
        amount: parseFloat(amount),
        currency,
        paymentDate: new Date(paymentDate),
        description,
        paymentMethod,
        reference,
        relatedSales:
          relatedSales && relatedSales.length > 0
            ? {
                connect: relatedSales.map((saleId) => ({
                  id: parseInt(saleId),
                })),
              }
            : undefined,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        relatedSales: {
          select: {
            id: true,
            passengerName: true,
            totalCost: true,
            status: true,
            creationDate: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Pago creado exitosamente",
      payment,
    });
  } catch (error) {
    console.error("Error creating supplier payment:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Update supplier payment
const updateSupplierPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const updateData = req.body;

    // Check if payment exists and belongs to company
    const existingPayment = await prisma.supplierPayment.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingPayment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    // Prepare update data
    const dataToUpdate = {};
    if (updateData.amount !== undefined)
      dataToUpdate.amount = parseFloat(updateData.amount);
    if (updateData.currency !== undefined)
      dataToUpdate.currency = updateData.currency;
    if (updateData.paymentDate !== undefined)
      dataToUpdate.paymentDate = new Date(updateData.paymentDate);
    if (updateData.description !== undefined)
      dataToUpdate.description = updateData.description;
    if (updateData.paymentMethod !== undefined)
      dataToUpdate.paymentMethod = updateData.paymentMethod;
    if (updateData.reference !== undefined)
      dataToUpdate.reference = updateData.reference;

    // Update the payment
    const updatedPayment = await prisma.supplierPayment.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        relatedSales: {
          select: {
            id: true,
            passengerName: true,
            totalCost: true,
            status: true,
            creationDate: true,
          },
        },
      },
    });

    res.json({
      message: "Pago actualizado exitosamente",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating supplier payment:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Delete supplier payment
const deleteSupplierPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    // Check if payment exists and belongs to company
    const existingPayment = await prisma.supplierPayment.findFirst({
      where: {
        id: parseInt(id),
        companyId,
      },
    });

    if (!existingPayment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    // Delete the payment
    await prisma.supplierPayment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Pago eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting supplier payment:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get sales by supplier
const getSalesBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { companyId } = req.user;

    // Check if supplier exists and belongs to company
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(supplierId),
        companyId,
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    // Get all sales that have items with this supplier
    const sales = await prisma.sale.findMany({
      where: {
        companyId,
        items: {
          some: {
            supplier: {
              some: {
                id: parseInt(supplierId),
              },
            },
          },
        },
      },
      include: {
        items: {
          where: {
            supplier: {
              some: {
                id: parseInt(supplierId),
              },
            },
          },
          select: {
            id: true,
            costPrice: true,
            description: true,
            passengerCount: true,
            dateIn: true,
            dateOut: true,
          },
        },
      },
      orderBy: { creationDate: "desc" },
    });

    // Calculate total amount for this supplier
    // Items are already filtered by supplier in the Prisma query
    const totalAmount = sales.reduce((sum, sale) => {
      return (
        sum + sale.items.reduce((itemSum, item) => itemSum + item.costPrice, 0)
      );
    }, 0);

    // Get currency from first sale (assuming all sales use same currency)
    const currency = sales.length > 0 ? sales[0].currency : "USD";

    // Format sales data
    // Items are already filtered by supplier in the Prisma query
    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      passengerName: sale.passengerName,
      totalCost: sale.items.reduce((sum, item) => sum + item.costPrice, 0),
      status: sale.status,
      creationDate: sale.creationDate,
    }));

    res.json({
      supplierId: supplier.id,
      supplierName: supplier.name,
      totalAmount,
      currency,
      sales: formattedSales,
    });
  } catch (error) {
    console.error("Error getting sales by supplier:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get all suppliers with their sales and payment status
const getSuppliersWithSales = async (req, res) => {
  try {
    const { companyId } = req.user;

    const suppliers = await prisma.supplier.findMany({
      where: { companyId },
      include: {
        saleItems: {
          include: {
            sale: {
              select: {
                id: true,
                passengerName: true,
                totalCost: true,
                status: true,
                creationDate: true,
              },
            },
          },
        },
        payments: {
          select: {
            amount: true,
            currency: true,
          },
        },
      },
    });

    const suppliersWithSales = suppliers.map((supplier) => {
      // Group sales by sale ID to avoid duplicates
      const salesMap = new Map();
      supplier.saleItems.forEach((item) => {
        if (!salesMap.has(item.sale.id)) {
          salesMap.set(item.sale.id, {
            id: item.sale.id,
            passengerName: item.sale.passengerName,
            totalCost: item.costPrice,
            status: item.sale.status,
            creationDate: item.sale.creationDate,
            currency: item.sale.currency,
          });
        }
      });

      const sales = Array.from(salesMap.values());
      const totalAmount = sales.reduce((sum, sale) => sum + sale.totalCost, 0);
      const totalPaid = supplier.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const currency = sales.length > 0 ? sales[0].currency : "USD";

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        totalAmount: totalAmount - totalPaid, // Amount pending
        currency,
        sales,
      };
    });

    res.json({ suppliers: suppliersWithSales });
  } catch (error) {
    console.error("Error getting suppliers with sales:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get payment history for a specific supplier
const getPaymentHistory = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { companyId } = req.user;

    // Check if supplier exists and belongs to company
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(supplierId),
        companyId,
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    const payments = await prisma.supplierPayment.findMany({
      where: {
        supplierId: parseInt(supplierId),
        companyId,
      },
      include: {
        relatedSales: {
          select: {
            id: true,
            passengerName: true,
            totalCost: true,
            status: true,
            creationDate: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    res.json({ payments });
  } catch (error) {
    console.error("Error getting payment history:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const { companyId } = req.user;

    const stats = await prisma.supplierPayment.aggregate({
      where: { companyId },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalPaid = stats._sum.amount || 0;
    const totalPayments = stats._count.id || 0;

    // Get total amount owed to suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { companyId },
      include: {
        saleItems: {
          select: {
            costPrice: true,
          },
        },
      },
    });

    const totalOwed = suppliers.reduce((sum, supplier) => {
      return (
        sum +
        supplier.saleItems.reduce(
          (itemSum, item) => itemSum + item.costPrice,
          0
        )
      );
    }, 0);

    const totalPending = totalOwed - totalPaid;

    res.json({
      stats: {
        totalOwed,
        totalPaid,
        totalPending,
        totalPayments,
        averagePayment: totalPayments > 0 ? totalPaid / totalPayments : 0,
      },
    });
  } catch (error) {
    console.error("Error getting payment stats:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export {
  getAllSupplierPayments,
  getSupplierPaymentById,
  createSupplierPayment,
  updateSupplierPayment,
  deleteSupplierPayment,
  getSalesBySupplier,
  getSuppliersWithSales,
  getPaymentHistory,
  getPaymentStats,
};
