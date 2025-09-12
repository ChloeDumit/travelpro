export interface Supplier {
  id: number;
  name: string;
  companyId: number;
}

export interface SupplierFormData {
  name: string;
}

export interface CreateSupplierData extends SupplierFormData {
  companyId: number;
}

export interface UpdateSupplierData extends Partial<SupplierFormData> {}