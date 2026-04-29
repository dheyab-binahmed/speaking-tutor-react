import { useEffect, useState } from "react";
import { useAssessment } from "./assessmentContext";
import SessionService from "../../services/sessionService";

export default function SpeakingStep() {
  const { data, update, goNext, goPrev } = useAssessment();
  const languageName = data.language ? data.language.toUpperCase() : "ENGLISH";
  const [conversation, setConversation] = useState({
    topic: "your speaking practice topic",
    opening_prompt: `Let's practice speaking in ${languageName}.`,
    follow_up_prompts: [],
    closing_prompt: "Thanks for sharing your ideas.",
  });
  const [topic, setTopic] = useState("your speaking practice topic");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(null);
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiTurnIndex, setAiTurnIndex] = useState(0);

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const sendUserMessage = (spokenText) => {
    const trimmed = (spokenText ?? input).trim();
    if (!trimmed) return;

    const nextPrompt =
      conversation.follow_up_prompts[aiTurnIndex] ||
      conversation.closing_prompt ||
      "Great response! Keep speaking clearly and naturally.";

    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "ai", text: `AI: ${nextPrompt}` },
    ]);
    setAiTurnIndex((current) => current + 1);
    speakText(nextPrompt);
    setInput("");
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Your browser does not support speech recognition. Please type your response.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendUserMessage(transcript);
    };
    recognition.onerror = () => {
      alert("Speech recognition failed. Please type your response.");
    };
    recognition.onend = () => setRecording(false);
    recognition.start();
  };

  const gradeConversation = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const userCount = messages.filter((m) => m.role === "user").length;
      const transcript = messages.map((m) => `${m.role}: ${m.text}`).join("\n");
      const response = await SessionService.updateAssessmentScore(
        data.sessionId,
        {
          test_type: "speaking",
          transcript,
          message_count: userCount,
        },
      );

      const nextScore =
        response?.result?.score ?? response?.evaluation?.fluency_score ?? 0;
      setScore(nextScore);
      update({
        fluencyScore: response?.evaluation?.fluency_score ?? nextScore,
        speakingResult: response,
      });
      return true;
    } catch (err) {
      console.error("Error grading conversation:", err);
      setError("Failed to grade speaking. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setLoading(true);
        const content = await SessionService.getAssessmentContent("speaking");
        const nextTopic = content?.topic || conversation.topic;
        const openingPrompt =
          content?.opening_prompt ||
          `Let's practice speaking in ${languageName}. Please share your thoughts.`;

        setTopic(nextTopic);
        setConversation(
          content || {
            topic: nextTopic,
            opening_prompt: openingPrompt,
            follow_up_prompts: [],
            closing_prompt: "Thanks for sharing your ideas.",
          },
        );
        setMessages([{ role: "ai", text: `AI: ${openingPrompt}` }]);
        setAiTurnIndex(0);
        speakText(openingPrompt);
      } catch (err) {
        const fallbackPrompt = `Let's practice speaking in ${languageName}. Please share your thoughts.`;
        setMessages([{ role: "ai", text: `AI: ${fallbackPrompt}` }]);
        speakText(fallbackPrompt);
        setError(err.message || "Failed to load speaking content.");
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageName]);

  const handleContinue = async () => {
    const userMessages = messages.filter((m) => m.role === "user").length;
    if (userMessages === 0) {
      alert("Please respond at least once before continuing.");
      return;
    }

    const graded = await gradeConversation();
    if (graded) {
      goNext("speaking");
    }
  };

  return (
    <div
      className="test-container fade-in"
      style={{ margin: "2rem auto", maxWidth: 920 }}
    >
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
        <h2>AI Speaking Conversation ({languageName})</h2>
        <p>
          The backend generates the conversation topic and follow-up prompts.
          Your responses are graded automatically.
        </p>
      </div>

      <div className="speaking-chat-card">
        <div className="chat-header">
          <div>
            <strong>AI Tutor</strong> (Topic: {topic})
          </div>
          <span className="badge">Live speaking</span>
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              <div className="bubble-label">
                {msg.role === "ai" ? "AI Tutor" : "You"}
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <p style={{ color: "#6b7280" }}>Loading speaking content...</p>
          )}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your spoken reply..."
            onKeyDown={(e) => e.key === "Enter" && sendUserMessage()}
          />
          <button className="btn btn-primary" onClick={sendUserMessage}>
            Send
          </button>
        </div>

        <div className="chat-controls">
          <button
            className="btn btn-secondary"
            onClick={startSpeechRecognition}
            disabled={recording || loading}
          >
            {recording ? "Listening..." : "Speak Now"}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={submitting || loading}
          >
            {submitting ? "Grading..." : "Grade & Continue"}
          </button>
        </div>

        {score !== null && (
          <div className="grade-box">
            <strong>Speaking Grade:</strong> {Math.round(score)}/100 —{" "}
            {score >= 80
              ? "Excellent"
              : score >= 60
                ? "Good"
                : "Needs Practice"}
          </div>
        )}
      </div>

      <div className="test-navigation" style={{ marginTop: "1rem" }}>
        <button className="btn btn-outline" onClick={() => goPrev("speaking")}>
          <i className="fas fa-arrow-left" /> Back
        </button>
      </div>
    </div>
  );
}
