import api from "./api";

const incidentService = {
  // Create incident
  create: async (incidentData) => {
    const response = await api.post("/incidents", incidentData);
    return response.data;
  },

  // Get all incidents
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/incidents?${params}`);
    return response.data;
  },

  // Get single incident
  getById: async (id) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  // Update incident
  update: async (id, incidentData) => {
    const response = await api.put(`/incidents/${id}`, incidentData);
    return response.data;
  },

  // Delete incident
  delete: async (id) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  },

  // Update incident status
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/incidents/${id}/status`, statusData);
    return response.data;
  },

  // Get incident statistics
  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/incidents/statistics?${params}`);
    return response.data;
  },
};

export default incidentService;
