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
  const [year, month, day] = dateStr.toString().split("T")[0].split("-");
  const date = new Date(`${year}-${month}-${day}T00:00:00`);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Montevideo",
  };

  return date.toLocaleDateString("es-UY", options).replace(".", "");
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed":
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
