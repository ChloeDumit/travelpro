export interface Operator {
  id: number;
  name: string;
  companyId: number;
}

export interface OperatorFormData {
  name: string;
}

export interface CreateOperatorData extends OperatorFormData {
  companyId: number;
}

export interface UpdateOperatorData extends Partial<OperatorFormData> {}