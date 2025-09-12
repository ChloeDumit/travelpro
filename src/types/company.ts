export interface CurrencyRate {
  id: string;
  currency: string;
  rate: number; // Rate to USD
  lastUpdated: string;
  isActive: boolean;
}

export interface CompanySettings {
  id: string;
  companyId: string;
  defaultCurrency: string;
  currencyRates: CurrencyRate[];
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyRateFormData {
  currency: string;
  rate: number;
  isActive: boolean;
}

export interface CompanySettingsFormData {
  defaultCurrency: string;
  currencyRates: CurrencyRateFormData[];
}

// Currency options for the UI
export const currencyOptions = [
  { value: "USD", label: "USD - Dólar Americano" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CLP", label: "CLP - Peso Chileno" },
  { value: "ARS", label: "ARS - Peso Argentino" },
  { value: "BRL", label: "BRL - Real Brasileño" },
  { value: "MXN", label: "MXN - Peso Mexicano" },
  { value: "COP", label: "COP - Peso Colombiano" },
  { value: "PEN", label: "PEN - Sol Peruano" },
  { value: "UYU", label: "UYU - Peso Uruguayo" },
  { value: "BOB", label: "BOB - Boliviano" },
];
