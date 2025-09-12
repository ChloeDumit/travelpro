export interface Passenger {
  id: string;
  name: string;
  passengerId: string;
  email?: string;
  dateOfBirth: string;
  saleId?: number;
  saleItemId?: number;
  companyId: number;
}

export interface PassengerFormData {
  name: string;
  passengerId: string;
  email?: string;
  dateOfBirth: string;
}

export interface CreatePassengerData extends PassengerFormData {
  companyId: number;
  saleId?: number;
  saleItemId?: number;
}

export interface UpdatePassengerData extends Partial<PassengerFormData> {}