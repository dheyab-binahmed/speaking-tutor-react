import apiClient from "./api";

/**
 * Achievements Service - Handles user achievements
 */
class AchievementService {
  /**
   * Get all achievements
   */
  async getAchievements() {
    try {
      const response = await apiClient.get("/achievements");
      return response.data.achievements || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get current user's achievements
   */
  async getUserAchievements() {
    try {
      const response = await apiClient.get("/users/me/achievements");
      return response.data.achievements || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Award achievement to user (admin only)
   */
  async awardAchievement(userId, achievementId) {
    try {
      const response = await apiClient.post(
        `/admin/users/${userId}/achievements/${achievementId}`,
      );
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

export default new AchievementService();
