import { Client } from './client';

// User types
export type UserRole = 'admin' | 'sales' | 'finance';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Sale types
export type SaleType = 'individual' | 'corporate' | 'sports' | 'group';
export type Region = 'national' | 'international' | 'regional';
export type ServiceType = 'flight' | 'hotel' | 'package' | 'transfer' | 'excursion' | 'insurance' | 'other';
export type SaleStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';
export type Currency = 'USD' | 'EUR' | 'local';
export type ItemStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentMethod = 'creditCard' | 'cash' | 'transfer';

export interface SaleItem {
  id: string;
  classification: string;
  provider: string;
  operator: string;
  dateIn: string;
  dateOut: string;
  passengerCount: number;
  status: ItemStatus;
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
  clientId: string;
  creationDate: string;
  travelDate: string;
  saleType: SaleType;
  region: Region;
  serviceType: ServiceType;
  status: SaleStatus;
  currency: Currency;
  seller: User;
  passengerCount: number;
  items: SaleItem[];
  totalCost: number;
  pendingBalance: number;
  payments?: Payment[];
}

// Invoice types
export interface Invoice {
  id: string;
  saleId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'paid' | 'cancelled';
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
  status: 'pending' | 'confirmed';
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

// Form related types
export interface SaleFormData {
  passengerName: string;
  clientId: string;
  travelDate: string;
  saleType: SaleType;
  region: Region;
  serviceType: ServiceType;
  currency: Currency;
  seller: string;
  passengerCount: number;
  totalCost: number;
  totalSale: number;
  client: Client | null;
}

export interface SaleItemFormData {
  classification: string;
  provider: string;
  operator: string;
  dateIn: string;
  dateOut: string;
  passengerCount: number;
  status: ItemStatus;
  description: string;
  salePrice: number;
  saleCurrency: Currency;
  costPrice: number;
  costCurrency: Currency;
  reservationCode: string;
  paymentDate: string | null;
}

export interface ClientFormData {
  name: string;
  clientId: string;
  email: string;
  address: string;
}

export * from './sales';
export * from './user';
export * from './common';
export * from './client';