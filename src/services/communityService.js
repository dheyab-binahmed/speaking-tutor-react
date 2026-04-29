import apiClient from "./api";

/**
 * Community Service - Handles community-related API calls (posts, groups, partners)
 */
class CommunityService {
  /**
   * Get all community posts
   */
  async getPosts(filters = {}) {
    try {
      const response = await apiClient.get("/community/posts", {
        params: filters,
      });
      return response.data.posts || response.data || [];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Create a new community post
   */
  async createPost(content, metadata = {}) {
    try {
      const response = await apiClient.post("/community/posts", {
        content,
        ...metadata,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Like a post
   */
  async likePost(postId) {
    try {
      const response = await apiClient.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Comment on a post
   */
  async commentOnPost(postId, comment) {
    try {
      const response = await apiClient.post(
        `/community/posts/${postId}/comments`,
        { content: comment },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get all community groups
   */
  async getGroups(filters = {}) {
    try {
      const response = await apiClient.get("/community/groups", {
        params: filters,
      });
      return response.data.groups || response.data || [];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Create a new group
   */
  async createGroup(name, description, metadata = {}) {
    try {
      const response = await apiClient.post("/community/groups", {
        name,
        description,
        ...metadata,
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Join a group
   */
  async joinGroup(groupId) {
    try {
      const response = await apiClient.post(
        `/community/groups/${groupId}/join`,
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get group details
   */
  async getGroupDetails(groupId) {
    try {
      const response = await apiClient.get(`/community/groups/${groupId}`);
      return response.data.group || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get group posts/messages
   */
  async getGroupPosts(groupId, filters = {}) {
    try {
      const response = await apiClient.get(
        `/community/groups/${groupId}/posts`,
        {
          params: filters,
        },
      );
      return response.data.posts || response.data || [];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get all language partners
   */
  async getPartners(filters = {}) {
    try {
      const response = await apiClient.get("/community/partners", {
        params: filters,
      });
      return response.data.partners || response.data || [];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Connect with a partner
   */
  async connectWithPartner(partnerId) {
    try {
      const response = await apiClient.post(
        `/community/partners/${partnerId}/connect`,
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get community stats/leaderboard
   */
  async getLeaderboard(period = "week") {
    try {
      const response = await apiClient.get("/community/leaderboard", {
        params: { period },
      });
      return response.data.leaderboard || response.data || [];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Search community content
   */
  async search(query, type = "all") {
    try {
      const response = await apiClient.get("/community/search", {
        params: { q: query, type },
      });
      return response.data.results || response.data || [];
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

export default new CommunityService();
