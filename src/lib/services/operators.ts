import { OperatorFormData } from "../../types";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const operatorsService = {
  getAllOperators: async () => {
    const response = await fetch(`${API_URL}/api/operators`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch operators");
    }
    return response.json();
  },

  createOperator: async (data: OperatorFormData) => {
    const response = await fetch(`${API_URL}/api/operators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create operator");
    }
    return response.json();
  },

  updateOperator: async (id: number, data: Partial<OperatorFormData>) => {
    const response = await fetch(`${API_URL}/api/operators/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update operator");
    }
    return response.json();
  },

  deleteOperator: async (id: number) => {
    const response = await fetch(`${API_URL}/api/operators/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete operator");
    }
    return response.json();
  },

  getOperatorById: async (id: number) => {
    const response = await fetch(`${API_URL}/api/operators/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch operator");
    }
    return response.json();
  },
};
