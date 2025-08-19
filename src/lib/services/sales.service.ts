import { api } from "../api";
import { Sale } from "../../types";

export interface CreateSaleData {
  saleData: {
    passengerName: string;
    client: { id: string };
    travelDate: string;
    saleType: string;
    region: string;
    serviceType: string;
    currency: string;
    sellerId: string;
    passengerCount: number;
    totalCost: number;
    totalSale: number;
  };
  items: Array<{
    classificationId?: string;
    supplierId?: string;
    operatorId?: string;
    dateIn?: string;
    dateOut?: string;
    passengerCount: number;
    status: string;
    description?: string;
    salePrice: number;
    costPrice: number;
    reservationCode?: string;
    paymentDate?: string;
    passengers: Array<{
      passengerId: string;
      name: string;
      email?: string;
      dateOfBirth: string;
      saleId?: number;
    }>;
  }>;
}

export interface UpdateSaleData {
  passengerName?: string;
  travelDate?: string;
  saleType?: string;
  region?: string;
  serviceType?: string;
  currency?: string;
  passengerCount?: number;
  totalCost?: number;
  status?: string;
  items?: Array<{
    classificationId?: string;
    supplierId?: string;
    operatorId?: string;
    dateIn?: string;
    dateOut?: string;
    passengerCount: number;
    status: string;
    description?: string;
    salePrice: number;
    costPrice: number;
    reservationCode?: string;
    paymentDate?: string;
  }>;
}

export interface SalesStats {
  salesByStatus: {
    draft: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  salesCount: number;
  totalSales: number;
}

export interface SalesByType {
  salesBySaleType: Record<string, { count: number; totalCost: number }>;
  salesByServiceType: Record<string, { count: number; totalCost: number }>;
  salesByRegion: Record<string, { count: number; totalCost: number }>;
}

export interface UpcomingDeparture {
  id: string;
  passengerName: string;
  travelDate: string;
  region: string;
  serviceType: string;
  client: { name: string };
}

export interface SalesOverview {
  chartData: Array<{
    date: string;
    day: string;
    count: number;
    totalCost: number;
  }>;
}

export const salesService = {
  // Get all sales
  getAll: () => api.get<{ sales: Sale[] }>("/api/sales"),

  // Get sales by current user
  getMySales: () => api.get<{ sales: Sale[] }>("/api/sales/my-sales"),

  // Get sale by ID
  getById: (id: string) => api.get<Sale>(`/api/sales/${id}`),

  // Create new sale
  create: (data: CreateSaleData) =>
    api.post<{ message: string; sale: Sale }>("/api/sales", data),

  // Update sale
  update: (id: string, data: any) =>
    api.put<{ sale: Sale }>(`/api/sales/${id}`, data),

  // Delete sale
  delete: (id: string) => api.delete<{ message: string }>(`/api/sales/${id}`),

  // Get total sales amount
  getTotal: () => api.get<{ total: number }>("/api/sales/total"),

  // Get sales statistics
  getStats: () => api.get<SalesStats>("/api/sales/stats"),

  // Get sales statistics by type
  getStatsByType: () => api.get<SalesByType>("/api/sales/stats-by-type"),

  // Get upcoming departures
  getUpcomingDepartures: () =>
    api.get<{ departures: UpcomingDeparture[] }>(
      "/api/sales/upcoming-departures"
    ),

  // Get sales overview for charts
  getSalesOverview: () => api.get<SalesOverview>("/api/sales/sales-overview"),
};
