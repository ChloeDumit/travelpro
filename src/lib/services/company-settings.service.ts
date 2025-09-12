import { api } from "../api";
import {
  CompanySettings,
  CompanySettingsFormData,
  CurrencyRate,
  CurrencyRateFormData,
} from "../../types";

export interface CompanySettingsResponse {
  status: string;
  message: string;
  data: CompanySettings;
  timestamp: string;
}

export interface CurrencyRatesResponse {
  status: string;
  message: string;
  data: CurrencyRate[];
  timestamp: string;
}

export const companySettingsService = {
  // Get company settings
  getSettings: () => api.get<CompanySettingsResponse>("/api/company/settings"),

  // Update company settings
  updateSettings: (data: CompanySettingsFormData) =>
    api.put<CompanySettingsResponse>("/api/company/settings", data),

  // Get currency rates
  getCurrencyRates: () =>
    api.get<CurrencyRatesResponse>("/api/company/currency-rates"),

  // Update currency rates
  updateCurrencyRates: (rates: CurrencyRateFormData[]) =>
    api.put<CurrencyRatesResponse>("/api/company/currency-rates", { rates }),

  // Add new currency rate
  addCurrencyRate: (rate: CurrencyRateFormData) =>
    api.post<{ data: CurrencyRate }>("/api/company/currency-rates", rate),

  // Update specific currency rate
  updateCurrencyRate: (id: string, rate: CurrencyRateFormData) =>
    api.put<{ data: CurrencyRate }>(`/api/company/currency-rates/${id}`, rate),

  // Delete currency rate
  deleteCurrencyRate: (id: string) =>
    api.delete<{ message: string }>(`/api/company/currency-rates/${id}`),

  // Toggle currency rate status
  toggleCurrencyRate: (id: string) =>
    api.patch<{ data: CurrencyRate }>(
      `/api/company/currency-rates/${id}/toggle`
    ),
};
