export interface Classification {
  id: number;
  name: string;
  companyId: number;
}

export interface ClassificationFormData {
  name: string;
}

export interface CreateClassificationData extends ClassificationFormData {
  companyId: number;
}

export interface UpdateClassificationData extends Partial<ClassificationFormData> {}