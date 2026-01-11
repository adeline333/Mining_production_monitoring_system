import api from "./api";

const userService = {
  // Get all users
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Get single user
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Toggle user status
  toggleStatus: async (id, isActive) => {
    const response = await api.put(`/users/${id}/toggle-status`, { isActive });
    return response.data;
  },
};

export default userService;
