const API_URL = 'http://localhost:3001/api';

export const usersService = {
  async getAllUsers() {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    return response.json();
  }
};