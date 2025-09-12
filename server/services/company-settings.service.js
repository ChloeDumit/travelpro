import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export class CompanySettingsService {
  constructor() {
    this.model = "companySettings";
  }

  // Get company settings
  async getSettings(companyId) {
    try {
      let settings = await prisma.companySettings.findUnique({
        where: { companyId },
      });

      // Create default settings if they don't exist
      if (!settings) {
        settings = await prisma.companySettings.create({
          data: {
            companyId,
            defaultCurrency: "USD",
          },
        });
      }

      return settings;
    } catch (error) {
      logger.error("Get company settings error:", error);
      throw new AppError(
        "Failed to fetch company settings",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update company settings
  async updateSettings(companyId, data) {
    try {
      const settings = await prisma.companySettings.upsert({
        where: { companyId },
        update: {
          defaultCurrency: data.defaultCurrency,
          updatedAt: new Date(),
        },
        create: {
          companyId,
          defaultCurrency: data.defaultCurrency,
        },
      });

      return settings;
    } catch (error) {
      logger.error("Update company settings error:", error);
      throw new AppError(
        "Failed to update company settings",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get all currency rates for a company
  async getCurrencyRates(companyId) {
    try {
      const rates = await prisma.currencyRate.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
      });

      return rates;
    } catch (error) {
      logger.error("Get currency rates error:", error);
      throw new AppError(
        "Failed to fetch currency rates",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Add new currency rate
  async addCurrencyRate(companyId, data) {
    try {
      // Check if rate already exists for this currency
      const existingRate = await prisma.currencyRate.findUnique({
        where: {
          companyId_currency: {
            companyId,
            currency: data.currency,
          },
        },
      });

      if (existingRate) {
        throw new AppError(
          "Currency rate already exists for this currency",
          HTTP_STATUS.CONFLICT
        );
      }

      const rate = await prisma.currencyRate.create({
        data: {
          companyId,
          currency: data.currency,
          rate: data.rate,
          isActive: data.isActive ?? true,
          lastUpdated: new Date(),
        },
      });

      return rate;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Add currency rate error:", error);
      throw new AppError(
        "Failed to add currency rate",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update currency rate
  async updateCurrencyRate(companyId, rateId, data) {
    try {
      const rate = await prisma.currencyRate.update({
        where: {
          id: parseInt(rateId),
          companyId, // Ensure user can only update their company's rates
        },
        data: {
          currency: data.currency,
          rate: data.rate,
          isActive: data.isActive,
          lastUpdated: new Date(),
          updatedAt: new Date(),
        },
      });

      return rate;
    } catch (error) {
      if (error.code === "P2025") {
        throw new AppError("Currency rate not found", HTTP_STATUS.NOT_FOUND);
      }

      logger.error("Update currency rate error:", error);
      throw new AppError(
        "Failed to update currency rate",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Delete currency rate
  async deleteCurrencyRate(companyId, rateId) {
    try {
      await prisma.currencyRate.delete({
        where: {
          id: parseInt(rateId),
          companyId, // Ensure user can only delete their company's rates
        },
      });

      return { message: "Currency rate deleted successfully" };
    } catch (error) {
      if (error.code === "P2025") {
        throw new AppError("Currency rate not found", HTTP_STATUS.NOT_FOUND);
      }

      logger.error("Delete currency rate error:", error);
      throw new AppError(
        "Failed to delete currency rate",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Toggle currency rate status
  async toggleCurrencyRate(companyId, rateId) {
    try {
      const rate = await prisma.currencyRate.findUnique({
        where: {
          id: parseInt(rateId),
          companyId,
        },
      });

      if (!rate) {
        throw new AppError("Currency rate not found", HTTP_STATUS.NOT_FOUND);
      }

      const updatedRate = await prisma.currencyRate.update({
        where: { id: parseInt(rateId) },
        data: {
          isActive: !rate.isActive,
          lastUpdated: new Date(),
          updatedAt: new Date(),
        },
      });

      return updatedRate;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Toggle currency rate error:", error);
      throw new AppError(
        "Failed to toggle currency rate",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Bulk update currency rates
  async updateCurrencyRates(companyId, rates) {
    try {
      // Delete existing rates
      await prisma.currencyRate.deleteMany({
        where: { companyId },
      });

      // Create new rates
      const newRates = await prisma.currencyRate.createMany({
        data: rates.map((rate) => ({
          companyId,
          currency: rate.currency,
          rate: rate.rate,
          isActive: rate.isActive ?? true,
          lastUpdated: new Date(),
        })),
      });

      // Return updated rates
      return await this.getCurrencyRates(companyId);
    } catch (error) {
      logger.error("Bulk update currency rates error:", error);
      throw new AppError(
        "Failed to update currency rates",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const companySettingsService = new CompanySettingsService();
