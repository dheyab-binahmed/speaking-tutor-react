import apiClient from "./api";

/**
 * Prompts Service - Handles prompts/questions
 */
class PromptService {
  /**
   * Get all prompts with optional filters
   */
  async getPrompts(filters = {}) {
    try {
      const response = await apiClient.get("/prompts", { params: filters });
      return response.data.prompts || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get a specific prompt
   */
  async getPrompt(promptId) {
    try {
      const response = await apiClient.get(`/prompts/${promptId}`);
      return response.data.prompt || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Create a new prompt (admin only)
   */
  async createPrompt(data) {
    try {
      const response = await apiClient.post("/admin/prompts", data);
      return response.data.prompt || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update a prompt (admin only)
   */
  async updatePrompt(promptId, data) {
    try {
      const response = await apiClient.put(`/admin/prompts/${promptId}`, data);
      return response.data.prompt || response.data;
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
    return error;
  }
}

export default new PromptService();
