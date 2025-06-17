export type SaleType = 'individual' | 'corporate' | 'sports' | 'group';
export type Region = 'national' | 'international' | 'regional';
export type ServiceType = 'flight' | 'hotel' | 'package' | 'transfer' | 'excursion' | 'insurance' | 'other';
export type Currency = 'USD' | 'EUR' | 'local';
export type SaleStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

export interface Sale {
  id: string;
  passengerName: string;
  clientId: string;
  creationDate: Date;
  travelDate: Date;
  saleType: SaleType;
  serviceType: ServiceType;
  region: Region;
  passengerCount: number;
  totalCost: number;
  pendingBalance: number;
  currency: Currency;
  status: SaleStatus;
  seller: {
    id: string;
    username: string;
  };
}

export const saleTypeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporate', label: 'Corporativo' },
  { value: 'sports', label: 'Deportivo' },
  { value: 'group', label: 'Grupo' },
] as const;

export const regionOptions = [
  { value: 'national', label: 'Nacional' },
  { value: 'international', label: 'Internacional' },
  { value: 'regional', label: 'Regional' },
] as const;

export const serviceTypeOptions = [
  { value: 'flight', label: 'Vuelo' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'package', label: 'Paquete' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'excursion', label: 'Excursión' },
  { value: 'insurance', label: 'Seguro' },
  { value: 'other', label: 'Otro' },
] as const;

export const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'local', label: 'Moneda Local' },
] as const; 