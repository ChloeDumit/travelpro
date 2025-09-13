export interface Client {
  id: string | number;
  companyId: number;
  name: string;
  clientId: string;
  email?: string;
  address?: string;
  createdAt: string;
}

export interface ClientFormData {
  name: string;
  clientId?: string;
  email?: string;
  address?: string;
}

export interface CreateClientData extends ClientFormData {
  companyId: number;
}

export interface UpdateClientData extends Partial<ClientFormData> {}
