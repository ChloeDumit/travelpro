export interface Classification {
  id: number;
  name: string;
}

export interface ClassificationFormData {
  name: string;
  classificationId?: string;
  email?: string;
  address?: string;
}
