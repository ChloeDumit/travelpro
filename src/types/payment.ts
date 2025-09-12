export type PaymentMethod = "creditCard" | "cash" | "transfer";
export type PaymentStatus = "pending" | "confirmed" | "failed" | "cancelled";

export interface Payment {
  id: string;
  saleId: string;
  date: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
}

export interface CreatePaymentData {
  saleId: string;
  date: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string;
}

export interface UpdatePaymentData extends Partial<CreatePaymentData> {
  status?: PaymentStatus;
}