/**
 * Token Service - Handles JWT token storage and retrieval
 */
const TOKEN_KEY_ACCESS = "polylingo_access_token";
const TOKEN_KEY_REFRESH = "polylingo_refresh_token";
const USER_KEY = "polylingo_auth_user";

class TokenService {
  /**
   * Save tokens to localStorage
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(TOKEN_KEY_ACCESS, accessToken);
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEY_REFRESH, refreshToken);
    }
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY_ACCESS);
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(TOKEN_KEY_REFRESH);
  }

  /**
   * Set access token (for refresh)
   */
  setAccessToken(token) {
    localStorage.setItem(TOKEN_KEY_ACCESS, token);
  }

  /**
   * Save user data
   */
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user data
   */
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  /**
   * Clear all tokens and user data
   */
  clearTokens() {
    localStorage.removeItem(TOKEN_KEY_ACCESS);
    localStorage.removeItem(TOKEN_KEY_REFRESH);
    localStorage.removeItem(USER_KEY);
  }
}

export default new TokenService();
