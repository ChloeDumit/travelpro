import { Payment } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const paymentsService = {
  // Get payments for a specific sale
  async getPaymentsBySaleId(saleId: string) {
    const response = await fetch(`${API_URL}/api/payments/sale/${saleId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  },

  // Create a new payment
  async createPayment(paymentData: {
    saleId: string;
    date: string;
    amount: number;
    currency: 'USD' | 'EUR' | 'local';
    method: 'creditCard' | 'cash' | 'transfer';
    reference: string;
  }) {
    const response = await fetch(`${API_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    return response.json();
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: 'pending' | 'confirmed') {
    const response = await fetch(`${API_URL}/api/payments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }
    return response.json();
  },

  // Delete a payment
  async deletePayment(id: string) {
    const response = await fetch(`${API_URL}/api/payments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
  },
}; 