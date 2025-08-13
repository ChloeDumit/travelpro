export interface Operator {
  id: number;
  name: string;
}

export interface OperatorFormData {
  name: string;
  operatorId?: string;
  email?: string;
  address?: string;
}
