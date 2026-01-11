import api from "./api";

const reportService = {
  // Create report
  create: async (reportData) => {
    const response = await api.post("/reports", reportData);
    return response.data;
  },

  // Get all reports
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports?${params}`);
    return response.data;
  },

  // Get single report
  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Update report
  update: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // Delete report
  delete: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Generate production summary report
  generateProductionSummary: async (data) => {
    const response = await api.post("/reports/generate/production", data);
    return response.data;
  },

  // Generate equipment report
  generateEquipmentReport: async (data) => {
    const response = await api.post("/reports/generate/equipment", data);
    return response.data;
  },

  // Approve report
  approve: async (id) => {
    const response = await api.put(`/reports/${id}/approve`);
    return response.data;
  },
};

export default reportService;
