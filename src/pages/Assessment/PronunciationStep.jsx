import { useEffect, useRef, useState } from "react";
import { useAssessment } from "./assessmentContext";
import SessionService from "../../services/sessionService";
import AudioService from "../../services/audioService";
import AudioRecorder from "../../utils/audioRecorder";

export default function PronunciationStep() {
  const { data, update, goNext, goPrev } = useAssessment();
  const recorderRef = useRef(new AudioRecorder());
  const timer = useRef(null);
  const bars = useRef([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(0);
  const [prompt, setPrompt] = useState("Loading pronunciation prompt...");
  const [analysis, setAnalysis] = useState(null);
  const [livePreview, setLivePreview] = useState("");
  const promptWordsRef = useRef([]);
  const recognitionRef = useRef(null);
  const spokenWordsRef = useRef([]);

  const fmt = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await SessionService.getAssessmentContent("pronunciation");
        setPrompt(
          response?.passage ||
            response?.prompt?.reference_text ||
            response?.prompt?.title ||
            "Read the prompt aloud.",
        );
        // prepare word array for live preview while recording
        const passageText =
          response?.passage ||
          response?.prompt?.reference_text ||
          response?.prompt?.title ||
          "";
        promptWordsRef.current = passageText
          .replace(/\s+/g, " ")
          .trim()
          .split(" ")
          .filter(Boolean);
      } catch (err) {
        setPrompt("Read the prompt aloud.");
        setError(err.message || "Failed to load pronunciation prompt.");
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
  }, []);

  const resetVisualizer = () => {
    bars.current.forEach((bar) => {
      if (bar) bar.style.height = "4px";
    });
  };

  async function start() {
    if (!AudioRecorder.isSupported()) {
      setError("Your browser does not support microphone recording.");
      return;
    }

    try {
      setError(null);
      setAnalysis(null);
      setRecording(true);
      setTime(0);
      await recorderRef.current.startRecording();

      // start speech recognition (for live transcript preview) when available
      try {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.lang = (data.language || "en").startsWith("en")
            ? "en-US"
            : data.language || "en-US";
          recognitionRef.current.interimResults = true;
          recognitionRef.current.maxAlternatives = 1;

          recognitionRef.current.onresult = (ev) => {
            try {
              let interim = "";
              let final = "";
              for (let i = 0; i < ev.results.length; i++) {
                const res = ev.results[i];
                if (res.isFinal) {
                  final += (res[0].transcript || "") + " ";
                } else {
                  interim += res[0].transcript || "";
                }
              }
              const full = (final + interim).trim();
              const words = full
                .replace(/\s+/g, " ")
                .split(" ")
                .filter(Boolean);
              spokenWordsRef.current = words;
              const lastTwo = words
                .slice(Math.max(0, words.length - 2))
                .join(" ");
              setLivePreview(lastTwo || "");
            } catch (err) {
              // ignore parsing errors
            }
          };

          recognitionRef.current.onerror = () => {
            recognitionRef.current = null;
          };

          recognitionRef.current.start();
        }
      } catch (err) {
        recognitionRef.current = null;
      }

      let elapsed = 0;
      timer.current = setInterval(() => {
        elapsed += 1;
        setTime(elapsed);
        bars.current.forEach((bar) => {
          if (bar) bar.style.height = `${Math.random() * 80 + 10}px`;
        });
        // Prefer live speech recognition transcript when available
        const spoken = spokenWordsRef.current || [];
        if (spoken.length > 0) {
          const lastTwoSpoken = spoken
            .slice(Math.max(0, spoken.length - 2))
            .join(" ");
          setLivePreview(lastTwoSpoken || "");
        } else {
          // fallback: estimate words-per-second and show last TWO words already read
          const words = promptWordsRef.current || [];
          const totalWords = words.length || 0;
          const estimatedDuration = Math.max(
            10,
            Math.min(120, Math.ceil(totalWords / 2 || 30)),
          );
          const wps = totalWords > 0 ? totalWords / estimatedDuration : 0.5;
          const readCount = Math.min(
            totalWords,
            Math.max(0, Math.floor(elapsed * wps)),
          );
          const sliceStart = Math.max(0, readCount - 2);
          const lastTwo = words
            .slice(sliceStart, readCount)
            .filter(Boolean)
            .join(" ");
          setLivePreview(lastTwo || "");
        }
        if (elapsed >= 30) {
          stop();
        }
      }, 1000);
    } catch (err) {
      setRecording(false);
      setError(err.message || "Failed to start recording.");
    }
  }

  async function stop() {
    clearInterval(timer.current);
    setRecording(false);
    resetVisualizer();
    // stop speech recognition if active
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    } catch (err) {
      recognitionRef.current = null;
    }

    try {
      setUploading(true);
      const blob = await recorderRef.current.stopRecording();
      const wavBlob = await AudioRecorder.blobToWav(blob);
      const response = await AudioService.uploadAudio(
        data.sessionId,
        wavBlob,
        "pronunciation.wav",
      );

      const pronunciationScore =
        response?.analysis?.scores?.accuracy_score ??
        response?.analysis?.scores?.overall_score ??
        response?.evaluation?.pronunciation_score ??
        0;

      setAnalysis(response?.analysis || null);
      update({ pronunciationScore, pronunciationAnalysis: response });
    } catch (err) {
      setError(err.message || "Failed to upload recording for analysis.");
    } finally {
      setUploading(false);
    }
  }

  function cont() {
    if (!analysis && !uploading) {
      setError("Please record and upload your pronunciation first.");
      return;
    }
    goNext("pronunciation");
  }

  return (
    <div className="test-container fade-in" style={{ margin: "2rem auto" }}>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="test-header">
        <h2>Pronunciation Assessment</h2>
        <p>
          Read the backend-generated prompt aloud. Your recording is uploaded
          and analyzed on the server.
        </p>
      </div>
      <div className="test-content">
        <div className="speaking-test">
          <div className="speaking-prompt">
            "{loading ? "Loading prompt..." : prompt}"
          </div>
          <div style={{ textAlign: "center", marginTop: 8, marginBottom: 6 }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Read so far
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: 4 }}>
              {livePreview || "..."}
            </div>
          </div>
          <div className="recording-section">
            <div className="recording-visualizer" id="pronunciationVisualizer">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (bars.current[i] = el)}
                  className="visualizer-bar"
                  style={{ height: "4px" }}
                />
              ))}
            </div>
            <div className="timer-display" id="pronunciationTimer">
              {fmt(time)}
            </div>
            <div className="recording-controls">
              <button
                className={`record-btn${recording ? " recording" : ""}`}
                onClick={recording ? stop : start}
                disabled={loading || uploading}
              >
                <i
                  className={`fas ${recording ? "fa-stop" : "fa-microphone"}`}
                />
              </button>
            </div>
            <p
              style={{
                color: "var(--gray)",
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              {uploading
                ? "Uploading and analyzing your pronunciation..."
                : recording
                  ? "Recording... click stop when done."
                  : "Speak clearly into your microphone. Try to pronounce each word accurately."}
            </p>
            {analysis && (
              <div
                className="grade-box"
                style={{ marginTop: "1rem", textAlign: "center" }}
              >
                <strong>Pronunciation score:</strong>{" "}
                {Math.round(
                  analysis?.scores?.overall_score ??
                    analysis?.scores?.accuracy_score ??
                    0,
                )}
                /100
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="test-navigation">
        <button
          className="btn btn-outline"
          onClick={() => goPrev("pronunciation")}
        >
          <i className="fas fa-arrow-left" /> Back
        </button>
        <button className="btn btn-primary" onClick={cont} disabled={uploading}>
          Continue to Speaking Test <i className="fas fa-arrow-right" />
        </button>
      </div>
    </div>
  );
}
