import api from "./api";

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    const response = await api.put(`/auth/profile/${userId}`, profileData);
    return response.data;
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    const response = await api.put(
      `/auth/change-password/${userId}`,
      passwordData
    );
    return response.data;
  },
};

export default authService;
