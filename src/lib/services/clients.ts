import { Client, ClientFormData } from '../../types';
const API_URL = 'http://localhost:3001/api';


export const clientsService = {
  getAllClients: async () => {
    const response = await fetch(`${API_URL}/clients`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  createClient: async (data: ClientFormData) => {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return response.json();
  },

  updateClient: async (id: string, data: Partial<ClientFormData>) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return response.json();
  },

  deleteClient: async (id: string) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
    return response.json();
  },

  getClientById: async (id: string) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return response.json();
  },
};