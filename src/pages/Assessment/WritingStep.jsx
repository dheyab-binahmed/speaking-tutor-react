import { useEffect, useState } from "react";
import { useAssessment } from "./assessmentContext";
import SessionService from "../../services/sessionService";

export default function WritingStep() {
  const { data, update, goNext, goPrev } = useAssessment();
  const [prompt, setPrompt] = useState({
    topic: "Writing Assessment",
    prompt: "Write your response below.",
    instructions: "Please write your response in English.",
    min_words: 150,
    closing_prompt: "Thank you for your response.",
  });
  const [content, setContent] = useState("");
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const countWords = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(countWords(text));
  };

  const submitWriting = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (wordCount < prompt.min_words) {
        setError(
          `Your response must be at least ${prompt.min_words} words. Current: ${wordCount}`,
        );
        return false;
      }

      const response = await SessionService.updateAssessmentScore(
        data.sessionId,
        {
          test_type: "writing",
          transcript: content,
          message_count: countWords(content),
        },
      );

      const nextScore =
        response?.result?.score ?? response?.evaluation?.fluency_score ?? 0;
      setScore(nextScore);
      update({
        writingScore: response?.evaluation?.fluency_score ?? nextScore,
        writingResult: response,
      });
      return true;
    } catch (err) {
      console.error("Error submitting writing:", err);
      setError("Failed to submit writing. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (wordCount === 0) {
      setError("Please write something before continuing.");
      return;
    }

    const submitted = await submitWriting();
    if (submitted) {
      goNext("writing");
    }
  };

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setLoading(true);
        const content = await SessionService.getAssessmentContent("writing");
        setPrompt(
          content || {
            topic: "Writing Assessment",
            prompt: "Write your response below.",
            instructions: "Please write your response in English.",
            min_words: 150,
            closing_prompt: "Thank you for your response.",
          },
        );
      } catch (err) {
        setError(err.message || "Failed to load writing prompt.");
      } finally {
        setLoading(false);
      }
    };

    loadPrompt();
  }, []);

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
        <h2>Writing Assessment: {prompt.topic}</h2>
        <p>{prompt.instructions}</p>
      </div>

      <div className="writing-card" style={{ marginBottom: "1.5rem" }}>
        <div className="writing-prompt">
          <h3>Topic:</h3>
          <p style={{ fontSize: "1.05em", lineHeight: 1.6, color: "#1f2937" }}>
            {prompt.prompt}
          </p>
        </div>

        <div
          className="writing-requirements"
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.95em",
          }}
        >
          <strong>Requirements:</strong>
          <ul style={{ marginTop: "0.5rem", marginBottom: 0 }}>
            <li>Minimum {prompt.min_words} words required</li>
            <li>Write in clear, grammatically correct sentences</li>
            <li>Use relevant vocabulary for your level</li>
            <li>Organize your ideas logically</li>
          </ul>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Your Response:
          </label>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write your response here..."
            style={{
              width: "100%",
              minHeight: "300px",
              padding: "1rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontFamily: "inherit",
              fontSize: "1em",
              resize: "vertical",
            }}
            disabled={loading}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              color: wordCount < prompt.min_words ? "#dc2626" : "#059669",
              fontWeight: 600,
            }}
          >
            Word count: {wordCount} / {prompt.min_words}
          </div>
          {wordCount >= prompt.min_words && (
            <span style={{ color: "#059669", fontSize: "0.9em" }}>
              ✓ Meets minimum requirement
            </span>
          )}
        </div>

        <div
          className="writing-controls"
          style={{ display: "flex", gap: "1rem" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={submitting || loading || wordCount === 0}
            style={{ flex: 1 }}
          >
            {submitting ? "Submitting..." : "Submit & Continue"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setContent("")}
            disabled={loading || content === ""}
          >
            Clear
          </button>
        </div>

        {score !== null && (
          <div
            className="grade-box"
            style={{
              marginTop: "1.5rem",
              background: "#dbeafe",
              border: "2px solid #0284c7",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <strong>Writing Score:</strong> {Math.round(score)}/100 —{" "}
            {score >= 80
              ? "Excellent work!"
              : score >= 60
                ? "Good effort!"
                : "Keep practicing"}
          </div>
        )}
      </div>

      <div className="test-navigation" style={{ marginTop: "1rem" }}>
        <button className="btn btn-outline" onClick={() => goPrev("writing")}>
          <i className="fas fa-arrow-left" /> Back
        </button>
      </div>
    </div>
  );
}
