import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'local' ? 'USD' : currency,
  });
  
  return formatter.format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// export function calculatePendingBalance(totalSale: number, payments: { amount: number }[]): number {
//   const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
//   return totalSale - totalPaid;
// }

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'paid':
      return 'bg-success-100 text-success-800';
    case 'pending':
    case 'draft':
      return 'bg-warning-100 text-warning-800';
    case 'cancelled':
      return 'bg-danger-100 text-danger-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}