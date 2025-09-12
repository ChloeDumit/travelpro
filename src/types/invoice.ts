export type InvoiceStatus = "pending" | "paid" | "cancelled";

export interface Invoice {
  id: string;
  saleId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
}

export interface CreateInvoiceData {
  saleId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status?: InvoiceStatus;
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {}