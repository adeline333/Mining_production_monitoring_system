import api from "./api";

const equipmentService = {
  // Create equipment
  create: async (equipmentData) => {
    const response = await api.post("/equipment", equipmentData);
    return response.data;
  },

  // Get all equipment
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/equipment?${params}`);
    return response.data;
  },

  // Get single equipment
  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  // Update equipment
  update: async (id, equipmentData) => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data;
  },

  // Delete equipment
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },

  // Update equipment status
  updateStatus: async (id, status) => {
    const response = await api.put(`/equipment/${id}/status`, { status });
    return response.data;
  },

  // Log equipment usage
  logUsage: async (id, usageData) => {
    const response = await api.put(`/equipment/${id}/usage`, usageData);
    return response.data;
  },

  // Get equipment statistics
  getStatistics: async () => {
    const response = await api.get("/equipment/statistics");
    return response.data;
  },
};

export default equipmentService;
