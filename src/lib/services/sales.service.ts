import { api } from "../api";
import { Sale, CreateSaleData, UpdateSaleData, SaleStatus } from "../../types";

export interface SalesListResponse {
  sales: Sale[];
}

export interface SalesStats {
  salesByStatus: Record<SaleStatus, number>;
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
  getAll: () => 
    api.get<SalesListResponse>("/api/sales"),

  getMySales: () => 
    api.get<SalesListResponse>("/api/sales/my-sales"),

  getById: (id: string) => 
    api.get<Sale>(`/api/sales/${id}`),

  create: (data: CreateSaleData) =>
    api.post<{ message: string; sale: Sale }>("/api/sales", data),

  update: (id: string, data: UpdateSaleData) =>
    api.put<{ message: string; sale: Sale }>(`/api/sales/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/sales/${id}`),

  getTotal: () => 
    api.get<{ total: number }>("/api/sales/total"),

  getStats: () => 
    api.get<SalesStats>("/api/sales/stats"),

  getStatsByType: () => 
    api.get<SalesByType>("/api/sales/stats-by-type"),

  getUpcomingDepartures: () =>
    api.get<{ departures: UpcomingDeparture[] }>("/api/sales/upcoming-departures"),

  getSalesOverview: () => 
    api.get<SalesOverview>("/api/sales/sales-overview"),
};