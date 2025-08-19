import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "local" ? "USD" : currency,
  });

  return formatter.format(amount);
}

export function formatDate(dateStr: string | Date): string {
  if (!dateStr) return "Sin fecha";

  try {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/Montevideo",
    };

    return date.toLocaleDateString("es-UY", options).replace(".", "");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error en fecha";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-warning-100 text-warning-800";
    case "completed":
    case "paid":
      return "bg-success-100 text-success-800";
    case "pending":
    case "draft":
      return "bg-warning-100 text-warning-800";
    case "cancelled":
      return "bg-danger-100 text-danger-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function mapStatusToLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "completed":
      return "Liquidada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
}
