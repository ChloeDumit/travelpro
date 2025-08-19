import { Client } from "./client";
import { Operator } from "./operator";
import { Classification } from "./classification";
import { Supplier } from "./supplier";

// User types
export type UserRole = "admin" | "sales" | "finance";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Sale types
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
export type SaleStatus = "draft" | "confirmed" | "completed" | "cancelled";
export type Currency = "USD" | "EUR" | "local";
export type PaymentMethod = "creditCard" | "cash" | "transfer";

export interface SaleItem {
  id: string;
  classification: string;
  provider: string;
  operator: string;
  dateIn: string;
  dateOut: string;
  passengerCount: number;
  description: string;
  salePrice: number;
  saleCurrency: Currency;
  costPrice: number;
  costCurrency: Currency;
  reservationCode: string;
  paymentDate: string | null;
}

export interface Sale {
  id: string;
  passengerName: string;
  client: Client;
  creationDate: string;
  travelDate: string;
  saleType: SaleType;
  region: Region;
  serviceType: ServiceType;
  status: SaleStatus;
  currency: Currency;
  seller: User;
  passengerCount: number;
  items: SaleItemFormData[];
  totalCost: number;
  pendingBalance: number;
  payments?: Payment[];
  salePrice: number;
}

// Invoice types
export interface Invoice {
  id: string;
  saleId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: Currency;
  status: "pending" | "paid" | "cancelled";
}

// Payment types
export interface Payment {
  id: string;
  saleId: string;
  date: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  reference: string;
  status: "pending" | "confirmed";
}

// Supplier payment types
export interface SupplierPayment {
  id: string;
  operator: string;
  date: string;
  operationNumber: string;
  amount: number;
  currency: Currency;
  paymentMethod: string;
  relatedSales: string[];
}

// Passenger types
export interface Passenger {
  passengerId: string;
  name: string;
  email?: string;
  dateOfBirth: string;
  saleId?: number;
}

// Form related types
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
  client: Client | null;
}

export interface SaleItemFormData {
  classificationId: number;
  classificationName: string;
  supplierId: number;
  supplierName: string;
  operatorId: number;
  operatorName: string;
  dateIn: string;
  dateOut: string;
  passengerCount: number;
  description: string;
  salePrice: number;
  costPrice: number;
  reservationCode: string;
  paymentDate: string | null;
  passengers: Passenger[];
  classification: Classification[];
  supplier: Supplier[];
  operator: Operator[];
}

export interface ClientFormData {
  name: string;
  clientId?: string;
  email?: string;
  address?: string;
}

export interface SupplierFormData {
  name: string;
}

export interface OperatorFormData {
  name: string;
}

export interface ClassificationFormData {
  name: string;
}

export interface PassengerFormData {
  name: string;
  passengerId: string;
  email?: string;
  dateOfBirth: string;
}

export * from "./operator";
export * from "./sales";
export * from "./user";
export * from "./common";
export * from "./client";
export * from "./supplier";
export * from "./classification";
