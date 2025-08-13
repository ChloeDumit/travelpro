import { ClassificationFormData } from "../../types";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const classificationsService = {
  getAllClassifications: async () => {
    const response = await fetch(`${API_URL}/api/classifications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch classifications");
    }
    return response.json();
  },

  createClassification: async (data: ClassificationFormData) => {
    const response = await fetch(`${API_URL}/api/classifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create classification");
    }
    return response.json();
  },

  updateClassification: async (
    id: number,
    data: Partial<ClassificationFormData>
  ) => {
    const response = await fetch(`${API_URL}/api/classifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update classification");
    }
    return response.json();
  },

  deleteClassification: async (id: number) => {
    const response = await fetch(`${API_URL}/api/classifications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete classification");
    }
    return response.json();
  },

  getClassificationById: async (id: number) => {
    const response = await fetch(`${API_URL}/api/classifications/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch classification");
    }
    return response.json();
  },
};
