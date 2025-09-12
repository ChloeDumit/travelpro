import { User } from "./user";
import { Client } from "./client";
import { Supplier } from "./supplier";
import { Operator } from "./operator";
import { Classification } from "./classification";
import { Passenger } from "./passenger";

export type SaleType = "individual" | "corporate" | "sports" | "group";
export type Region = "national" | "international" | "regional";
export type ServiceType =
  | "flight"
  | "hotel"
  | "package"
  | "transfer"
  | "excursion"
  | "insurance"
  | "other";
export type Currency = "USD" | "EUR" | "local";
export type SaleStatus = "draft" | "confirmed" | "completed" | "cancelled";
export type ItemStatus = "pending" | "confirmed" | "cancelled";

export interface SaleItem {
  id: string;
  saleId: string;
  dateIn?: string;
  dateOut?: string;
  passengerCount: number;
  status: ItemStatus;
  description?: string;
  salePrice: number;
  costPrice: number;
  reservationCode?: string;
  paymentDate?: string;
  // Relations
  classification?: Classification[];
  supplier?: Supplier[];
  operator?: Operator[];
  passengers?: Passenger[];
}

export interface Sale {
  id: string;
  companyId: number;
  passengerName: string;
  clientId: string;
  creationDate: string;
  travelDate: string;
  saleType: SaleType;
  region: Region;
  serviceType: ServiceType;
  status: SaleStatus;
  currency: Currency;
  sellerId: string;
  passengerCount: number;
  totalCost: number;
  salePrice: number;
  // Relations
  client: Client;
  seller: User;
  items: SaleItem[];
}

export interface SaleFormData {
  passengerName: string;
  clientId: string;
  travelDate: string;
  saleType: SaleType;
  region: Region;
  serviceType: ServiceType;
  currency: Currency;
  sellerId: string;
  passengerCount: number;
  totalCost: number;
  totalSale: number;
}

export interface SaleItemFormData {
  classificationId?: number;
  supplierId?: number;
  operatorId?: number;
  dateIn?: string;
  dateOut?: string;
  passengerCount: number;
  description?: string;
  salePrice: number;
  costPrice: number;
  reservationCode?: string;
  paymentDate?: string;
  passengers: Passenger[];
  // For display purposes
  classificationName?: string;
  supplierName?: string;
  operatorName?: string;
  classification?: Classification[];
  supplier?: Supplier[];
  operator?: Operator[];
}

export interface CreateSaleData {
  saleData: SaleFormData & { client: { id: string } };
  items: SaleItemFormData[];
}

export interface UpdateSaleData extends Partial<SaleFormData> {
  items?: SaleItemFormData[];
}

// Options for form selects
export const saleTypeOptions = [
  { value: "individual", label: "Individual" },
  { value: "corporate", label: "Corporativo" },
  { value: "sports", label: "Deportivo" },
  { value: "group", label: "Grupo" },
] as const;

export const regionOptions = [
  { value: "national", label: "Nacional" },
  { value: "international", label: "Internacional" },
  { value: "regional", label: "Regional" },
] as const;

export const serviceTypeOptions = [
  { value: "flight", label: "Vuelo" },
  { value: "hotel", label: "Hotel" },
  { value: "package", label: "Paquete" },
  { value: "transfer", label: "Transfer" },
  { value: "excursion", label: "Excursión" },
  { value: "insurance", label: "Seguro" },
  { value: "other", label: "Otro" },
] as const;

export const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "confirmed", label: "Confirmada" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
] as const;
