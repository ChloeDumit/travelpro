import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    const currencyCode = currency === "local" ? "USD" : currency;
    
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Sin fecha";

  try {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    };

    return date.toLocaleDateString("es-ES", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error en fecha";
  }
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Sale statuses
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    // Payment statuses
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return statusColors[status] || "bg-gray-100 text-gray-800";
}

export function mapStatusToLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    draft: "Borrador",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
    pending: "Pendiente",
    paid: "Pagado",
    failed: "Fallido",
  };

  return statusLabels[status] || status;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}