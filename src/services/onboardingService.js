import apiClient from "./api";

/**
 * Onboarding Service - Handles user onboarding
 */
class OnboardingService {
  /**
   * Get onboarding status
   */
  async getStatus() {
    try {
      const response = await apiClient.get("/onboarding/status");
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Set proficiency level
   */
  async setLevel(level) {
    try {
      const response = await apiClient.post("/onboarding/level", { level });
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
    return error;
  }
}

export default new OnboardingService();
