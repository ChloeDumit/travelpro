import { CurrencyRate } from "../types";

/**
 * Convert amount from one currency to USD
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param currencyRates - Array of currency rates
 * @returns Converted amount in USD
 */
export function convertToUSD(
  amount: number,
  fromCurrency: string,
  currencyRates: CurrencyRate[]
): number {
  if (fromCurrency === "USD") {
    return amount;
  }

  const rate = currencyRates.find(
    (r) => r.currency === fromCurrency && r.isActive
  );

  if (!rate) {
    console.warn(`No exchange rate found for currency: ${fromCurrency}`);
    return amount; // Return original amount if no rate found
  }

  return amount * rate.rate;
}

/**
 * Convert amount from USD to another currency
 * @param amount - Amount in USD
 * @param toCurrency - Target currency
 * @param currencyRates - Array of currency rates
 * @returns Converted amount in target currency
 */
export function convertFromUSD(
  amount: number,
  toCurrency: string,
  currencyRates: CurrencyRate[]
): number {
  if (toCurrency === "USD") {
    return amount;
  }

  const rate = currencyRates.find(
    (r) => r.currency === toCurrency && r.isActive
  );

  if (!rate) {
    console.warn(`No exchange rate found for currency: ${toCurrency}`);
    return amount; // Return original amount if no rate found
  }

  return amount / rate.rate;
}

/**
 * Convert amount between two currencies
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param currencyRates - Array of currency rates
 * @returns Converted amount in target currency
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  currencyRates: CurrencyRate[]
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to USD first, then to target currency
  const usdAmount = convertToUSD(amount, fromCurrency, currencyRates);
  return convertFromUSD(usdAmount, toCurrency, currencyRates);
}

/**
 * Format currency with symbol
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrencyWithSymbol(
  amount: number,
  currency: string,
  locale: string = "en-US"
): string {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    CLP: "$",
    ARS: "$",
    BRL: "R$",
    MXN: "$",
    COP: "$",
    PEN: "S/",
    UYU: "$",
    BOB: "Bs",
  };

  const symbol = currencySymbols[currency] || currency;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if currency is not supported by Intl
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency rate for a specific currency
 * @param currency - Currency code
 * @param currencyRates - Array of currency rates
 * @returns Currency rate or null if not found
 */
export function getCurrencyRate(
  currency: string,
  currencyRates: CurrencyRate[]
): CurrencyRate | null {
  return (
    currencyRates.find((r) => r.currency === currency && r.isActive) || null
  );
}

/**
 * Check if currency rate exists and is active
 * @param currency - Currency code
 * @param currencyRates - Array of currency rates
 * @returns True if rate exists and is active
 */
export function hasActiveCurrencyRate(
  currency: string,
  currencyRates: CurrencyRate[]
): boolean {
  return currencyRates.some((r) => r.currency === currency && r.isActive);
}
