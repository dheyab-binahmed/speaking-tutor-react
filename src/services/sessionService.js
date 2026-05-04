import apiClient from "./api";

/**
 * Session Service - Handles session-related API calls
 */
class SessionService {
  /**
   * Start a new assessment session
   */
  async startAssessment(data = {}) {
    try {
      const response = await apiClient.post("/assessments/start", data);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get backend-generated content for an assessment step
   */
  async getAssessmentContent(stepType, filters = {}) {
    try {
      // include any cached session_id so the backend can return the same prompt
      const cachedSessionId = localStorage.getItem("assessment_session_id");
      const params = {
        step_type: stepType,
        ...(cachedSessionId ? { session_id: cachedSessionId } : {}),
        ...filters,
      };

      const response = await apiClient.get("/assessment/content", {
        params,
      });

      // persist session_id returned by server so prompts stay stable for the session
      if (response?.data?.session_id) {
        try {
          localStorage.setItem(
            "assessment_session_id",
            response.data.session_id,
          );
        } catch (err) {
          // ignore storage errors
        }
      }

      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get session details
   */
  async getSession(sessionId) {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}`);
      return response.data.session || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get session results
   */
  async getSessionResults(sessionId) {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/results`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get session transcript
   */
  async getSessionTranscript(sessionId) {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/transcript`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Cancel a session
   */
  async cancelSession(sessionId) {
    try {
      const response = await apiClient.post(`/sessions/${sessionId}/cancel`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Retry a failed session
   */
  async retrySession(sessionId) {
    try {
      const response = await apiClient.post(`/sessions/${sessionId}/retry`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Start recording for a session
   */
  async startRecording(sessionId) {
    try {
      const response = await apiClient.post(
        `/sessions/${sessionId}/start-recording`,
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Submit assessment results
   */
  async submitAssessmentResults(sessionId, results = {}) {
    try {
      const response = await apiClient.post(
        `/sessions/${sessionId}/submit-results`,
        results,
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Update assessment score
   */
  async updateAssessmentScore(sessionId, scoreData = {}) {
    try {
      const response = await apiClient.put(
        `/sessions/${sessionId}/score`,
        scoreData,
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get progress history
   */
  async getProgressHistory(filters = {}) {
    try {
      const response = await apiClient.get("/progress/history", {
        params: filters,
      });
      return response.data.sessions || response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get progress stats
   */
  async getProgressStats() {
    try {
      const response = await apiClient.get("/progress/stats");
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

export default new SessionService();
