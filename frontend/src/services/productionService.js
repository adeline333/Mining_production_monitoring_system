import api from "./api";

const productionService = {
  // Create production record
  create: async (productionData) => {
    const response = await api.post("/production", productionData);
    return response.data;
  },

  // Get all production records
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/production?${params}`);
    return response.data;
  },

  // Get single production record
  getById: async (id) => {
    const response = await api.get(`/production/${id}`);
    return response.data;
  },

  // Update production record
  update: async (id, productionData) => {
    const response = await api.put(`/production/${id}`, productionData);
    return response.data;
  },

  // Delete production record
  delete: async (id) => {
    const response = await api.delete(`/production/${id}`);
    return response.data;
  },

  // Approve production record
  approve: async (id) => {
    const response = await api.put(`/production/${id}/approve`);
    return response.data;
  },

  // Get production statistics
  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/production/statistics?${params}`);
    return response.data;
  },
};

export default productionService;
