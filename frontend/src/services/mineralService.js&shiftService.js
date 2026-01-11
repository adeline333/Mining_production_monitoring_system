// mineralService.js
import api from "./api";

export const mineralService = {
  create: async (mineralData) => {
    const response = await api.post("/minerals", mineralData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/minerals");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/minerals/${id}`);
    return response.data;
  },

  update: async (id, mineralData) => {
    const response = await api.put(`/minerals/${id}`, mineralData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/minerals/${id}`);
    return response.data;
  },
};

// shiftService.js
export const shiftService = {
  create: async (shiftData) => {
    const response = await api.post("/shifts", shiftData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/shifts");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  update: async (id, shiftData) => {
    const response = await api.put(`/shifts/${id}`, shiftData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/shifts/${id}`);
    return response.data;
  },
};
