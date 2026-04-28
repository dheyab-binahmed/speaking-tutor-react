import apiClient from "./api";

/**
 * Audio Service - Handles audio uploads and quality checks
 */
class AudioService {
  /**
   * Upload audio to a session
   */
  async uploadAudio(sessionId, audioBlob, filename = "recording.wav") {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, filename);

      const response = await apiClient.post(
        `/sessions/${sessionId}/audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get audio quality report for a session
   */
  async getAudioQualityReport(sessionId) {
    try {
      const response = await apiClient.get(
        `/sessions/${sessionId}/audio-quality`,
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
    if (error.response?.status === 400) {
      return new Error("Invalid audio file");
    }
    return error;
  }
}

export default new AudioService();
