import apiClient from "./api";

/**
 * Admin Service - Handles admin operations
 */
class AdminService {
  /**
   * Get all users (admin only)
   */
  async getUsers(filters = {}) {
    try {
      const response = await apiClient.get("/admin/users", { params: filters });
      return response.data.users || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get specific user details (admin only)
   */
  async getUser(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data.user || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get admin settings
   */
  async getSettings() {
    try {
      const response = await apiClient.get("/admin/settings");
      return response.data.settings || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update admin setting
   */
  async updateSetting(key, value) {
    try {
      const response = await apiClient.put(`/admin/settings/${key}`, { value });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  _handleError(error) {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.status === 403) {
      return new Error("Access denied");
    }
    return error;
  }
}

export default new AdminService();
