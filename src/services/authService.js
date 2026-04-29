import apiClient from "./api";
import TokenService from "./tokenService";

/**
 * Auth Service - Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(
    email,
    password,
    fullName,
    selectedLevel = null,
    preferredLanguage = null,
  ) {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        full_name: fullName,
        selected_level: selectedLevel,
        preferred_language: preferredLanguage,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token, user } = response.data;

      // Save tokens and user
      TokenService.setTokens(access_token, refresh_token);
      TokenService.setUser(user);

      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      TokenService.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await apiClient.get("/auth/profile");
      const user = response.data.user || response.data;
      TokenService.setUser(user);
      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data) {
    try {
      const response = await apiClient.put("/auth/profile", data);
      const user = response.data.user || response.data;
      TokenService.setUser(user);
      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    try {
      const response = await apiClient.post("/auth/verify-email", { token });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Request verification email
   */
  async requestVerificationEmail(email) {
    try {
      const response = await apiClient.post(
        "/auth/request-verification-email",
        { email },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Handle error responses
   */
  _handleError(error) {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.status === 401) {
      return new Error("Invalid credentials");
    }
    if (error.response?.status === 409) {
      return new Error("Email already registered");
    }
    return error;
  }
}

export default new AuthService();
