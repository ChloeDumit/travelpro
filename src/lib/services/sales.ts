import { Sale, SaleFormData, SaleItemFormData } from '../../types';
import { Client } from '../../types/client';

const API_URL = 'http://localhost:3001/api';

export const salesService = {
  // Get all sales
  async getAllSales() {
    const response = await fetch(`${API_URL}/sales`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch sales');
    }
    return response.json();
  },

  // Get a single sale by ID
  async getSaleById(id: string) {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch sale');
    }
    return response.json();
  },

  // Create a new sale
  async createSale(saleData: SaleFormData & { client: Client | null }, items: SaleItemFormData[]) {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ 
        saleData: {
          ...saleData,
          client: saleData.client
        }, 
        items 
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create sale');
    }
    return response.json();
  },

  // Update a sale
  async updateSale(id: string, saleData: Partial<Sale>) {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      throw new Error('Failed to update sale');
    }
    return response.json();
  },

  // Delete a sale
  async deleteSale(id: string) {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete sale');
    }
  },

  // Update sale status
  async updateSaleStatus(id: string, status: 'draft' | 'confirmed' | 'completed' | 'cancelled') {
    const response = await fetch(`${API_URL}/sales/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update sale status');
    }
    return response.json();
  },
}; 