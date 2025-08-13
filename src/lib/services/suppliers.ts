import { SupplierFormData } from '../../types';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


export const suppliersService = {
  getAllSuppliers: async () => {
    const response = await fetch(`${API_URL}/api/suppliers`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch suppliers');
    }
    return response.json();
  },

  createSupplier: async (data: SupplierFormData) => {
    const response = await fetch(`${API_URL}/api/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create supplier');
    }
    return response.json();
  },

  updateSupplier: async (id: string, data: Partial<SupplierFormData>) => {
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update supplier');
    }
    return response.json();
  },

  deleteSupplier: async (id: string) => {
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete supplier');
    }
    return response.json();
  },

  getSupplierById: async (id: string) => {
    const response = await fetch(`${API_URL}/api/suppliers/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch supplier');
    }
    return response.json();
  },
};