import { useState, useEffect } from "react";
import { companySettingsService } from "../lib/services/company-settings.service";
import { CurrencyRate } from "../types";

export function useCurrencyRates() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await companySettingsService.getCurrencyRates();
        if (response.data?.data) {
          setRates(response.data.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading currency rates"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertToUSD = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === "USD") return amount;

    const rate = rates.find((r) => r.currency === fromCurrency && r.isActive);
    if (!rate) {
      console.warn(`No active rate found for currency: ${fromCurrency}`);
      return amount; // Return original amount if no rate found
    }

    return amount * rate.rate;
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const usdAmount = convertToUSD(amount, currency);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usdAmount);
  };

  return {
    rates,
    loading,
    error,
    convertToUSD,
    formatCurrency,
  };
}
