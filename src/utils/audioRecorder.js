/**
 * Audio Recording Utility
 * Handles recording, processing, and uploading audio files
 */

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioContext = null;
    this.stream = null;
    this.chunks = [];
    this.isRecording = false;
    this.recordingStartTime = null;
    this.recordingDuration = 0;
  }

  /**
   * Check if browser supports audio recording
   */
  static isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.AudioContext &&
      window.MediaRecorder
    );
  }

  /**
   * Start recording audio
   */
  async startRecording(onDataAvailable = null) {
    try {
      if (this.isRecording) {
        console.warn("Already recording");
        return false;
      }

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create audio context
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks = [];
      this.recordingStartTime = Date.now();

      // Handle data available events
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          if (onDataAvailable) {
            onDataAvailable(event.data);
          }
        }
      };

      // Handle stop
      this.mediaRecorder.onstop = () => {
        this.recordingDuration = (Date.now() - this.recordingStartTime) / 1000;
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error("Error starting recording:", err);
      throw new Error(
        err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone permission."
          : "Failed to start recording. Please check your microphone.",
      );
    }
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.isRecording || !this.mediaRecorder) {
        reject(new Error("Not recording"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.recordingDuration = (Date.now() - this.recordingStartTime) / 1000;

        // Create blob from chunks
        const mimeType = this.mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(this.chunks, { type: mimeType });

        // Stop stream
        this.stream.getTracks().forEach((track) => track.stop());

        this.isRecording = false;
        this.chunks = [];

        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording without saving
   */
  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach((track) => track.stop());
      this.isRecording = false;
      this.chunks = [];
    }
  }

  /**
   * Get current recording duration in seconds
   */
  getRecordingDuration() {
    if (!this.isRecording) {
      return this.recordingDuration;
    }
    return (Date.now() - this.recordingStartTime) / 1000;
  }

  /**
   * Convert blob to WAV format (basic conversion)
   */
  static async blobToWav(blob) {
    // If already WAV, return as is
    if (blob.type === "audio/wav") {
      return blob;
    }

    try {
      // Convert webm/ogg to wav using AudioContext
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const wavBlob = AudioRecorder._audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (err) {
      console.warn("Could not convert to WAV, using original:", err);
      return blob;
    }
  }

  /**
   * Convert AudioBuffer to WAV blob
   */
  static _audioBufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const channelData = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }

    const length = audioBuffer.length * numberOfChannels * bytesPerSample;
    const buffer = new ArrayBuffer(36 + length);
    const view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    let offset = 0;
    writeString(offset, "RIFF");
    offset += 4;
    view.setUint32(offset, 36 + length, true);
    offset += 4;
    writeString(offset, "WAVE");
    offset += 4;
    writeString(offset, "fmt ");
    offset += 4;
    view.setUint32(offset, 16, true); // fmt chunk size
    offset += 4;
    view.setUint16(offset, format, true);
    offset += 2;
    view.setUint16(offset, numberOfChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * blockAlign, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitDepth, true);
    offset += 2;
    writeString(offset, "data");
    offset += 4;
    view.setUint32(offset, length, true);
    offset += 4;

    // Write PCM samples
    const index = offset;
    const volume = 0.8;
    offset = index;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true,
        );
        offset += 2;
      }
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  /**
   * Get list of supported MIME types
   */
  static getSupportedMimeTypes() {
    const types = [
      "audio/webm",
      "audio/wav",
      "audio/mp4",
      "audio/ogg",
      "audio/mpeg",
    ];
    return types.filter(
      (type) => MediaRecorder.isTypeSupported(type) || type === "audio/wav",
    );
  }
}

export default AudioRecorder;
