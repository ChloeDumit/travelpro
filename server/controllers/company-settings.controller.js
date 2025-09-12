import { ApiResponse, asyncHandler } from "../utils/response.js";
import { companySettingsService } from "../services/company-settings.service.js";
import { validate } from "../config/validation.js";
import { companySettingsSchemas } from "../config/validation.js";

export const companySettingsController = {
  // Get company settings
  getSettings: asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const settings = await companySettingsService.getSettings(companyId);

    return ApiResponse.success(
      res,
      settings,
      "Company settings fetched successfully"
    );
  }),

  // Update company settings
  updateSettings: [
    validate(companySettingsSchemas.updateSettings),
    asyncHandler(async (req, res) => {
      const { companyId } = req.user;
      const data = req.body;

      const settings = await companySettingsService.updateSettings(
        companyId,
        data
      );

      return ApiResponse.success(
        res,
        settings,
        "Company settings updated successfully"
      );
    }),
  ],

  // Get currency rates
  getCurrencyRates: asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const rates = await companySettingsService.getCurrencyRates(companyId);

    return ApiResponse.success(
      res,
      rates,
      "Currency rates fetched successfully"
    );
  }),

  // Add currency rate
  addCurrencyRate: [
    validate(companySettingsSchemas.addCurrencyRate),
    asyncHandler(async (req, res) => {
      const { companyId } = req.user;
      const data = req.body;

      const rate = await companySettingsService.addCurrencyRate(
        companyId,
        data
      );

      return ApiResponse.created(res, rate, "Currency rate added successfully");
    }),
  ],

  // Update currency rate
  updateCurrencyRate: [
    validate(companySettingsSchemas.updateCurrencyRate),
    asyncHandler(async (req, res) => {
      const { companyId } = req.user;
      const { id } = req.params;
      const data = req.body;

      const rate = await companySettingsService.updateCurrencyRate(
        companyId,
        id,
        data
      );

      return ApiResponse.success(
        res,
        rate,
        "Currency rate updated successfully"
      );
    }),
  ],

  // Delete currency rate
  deleteCurrencyRate: asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const { id } = req.params;

    await companySettingsService.deleteCurrencyRate(companyId, id);

    return ApiResponse.success(res, null, "Currency rate deleted successfully");
  }),

  // Toggle currency rate status
  toggleCurrencyRate: asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const { id } = req.params;

    const rate = await companySettingsService.toggleCurrencyRate(companyId, id);

    return ApiResponse.success(
      res,
      rate,
      "Currency rate status updated successfully"
    );
  }),

  // Bulk update currency rates
  updateCurrencyRates: [
    validate(companySettingsSchemas.updateCurrencyRates),
    asyncHandler(async (req, res) => {
      const { companyId } = req.user;
      const { rates } = req.body;

      const updatedRates = await companySettingsService.updateCurrencyRates(
        companyId,
        rates
      );

      return ApiResponse.success(
        res,
        updatedRates,
        "Currency rates updated successfully"
      );
    }),
  ],
};
