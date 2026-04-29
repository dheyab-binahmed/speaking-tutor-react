import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SessionService from "../../services/sessionService";
import { useAssessment } from "./assessmentContext";

function ScoreBar({ label, value, max = 100, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
          fontSize: "0.9rem",
          fontWeight: 600,
        }}
      >
        <span style={{ color: "#374151" }}>{label}</span>
        <span style={{ color }}>
          {Math.round(value)}/{max}
        </span>
      </div>
      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "99px",
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function ResultsStep() {
  const { data } = useAssessment();
  const navigate = useNavigate();
  const { completeAssessment } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      if (!data.sessionId) {
        setError("Missing assessment session. Please restart the assessment.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await SessionService.getSessionResults(data.sessionId);
        const backendResults = response?.results || response || null;
        setResults(backendResults);

        try {
          await SessionService.submitAssessmentResults(data.sessionId, {
            results: backendResults,
          });
        } catch (submitErr) {
          console.error(
            "Failed to submit final assessment results:",
            submitErr,
          );
        }

        if (backendResults) {
          completeAssessment(backendResults);
        }
      } catch (err) {
        setError(err.message || "Failed to load assessment results.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [completeAssessment, data.sessionId]);

  const componentScores = results?.component_scores || {};
  const pronunciation =
    componentScores.pronunciation ?? data.pronunciationScore ?? 0;
  const fluency = componentScores.fluency ?? data.fluencyScore ?? 0;
  const grammar = componentScores.grammar ?? data.grammarScore ?? 0;
  const reading =
    componentScores.reading_accuracy ??
    componentScores.reading ??
    data.readingScore ??
    0;
  const overall =
    results?.overall_score ??
    Math.round((pronunciation + fluency + grammar + reading) / 4);
  const level =
    results?.proficiency_level ||
    (overall >= 80
      ? "Advanced"
      : overall >= 65
        ? "Intermediate"
        : overall >= 45
          ? "Upper Beginner"
          : "Beginner");

  const CIRC = 283;
  const offset = CIRC - (overall / 100) * CIRC;
  const scoreColor =
    overall >= 80
      ? "#10b981"
      : overall >= 65
        ? "#6366f1"
        : overall >= 45
          ? "#f59e0b"
          : "#ef4444";

  const breakdown = [
    {
      label: "Pronunciation",
      value: pronunciation,
      icon: "fa-volume-up",
      color: "#8b5cf6",
    },
    {
      label: "Speaking Fluency",
      value: fluency,
      icon: "fa-comments",
      color: "#10b981",
    },
    { label: "Grammar", value: grammar, icon: "fa-book", color: "#f59e0b" },
    {
      label: "Reading",
      value: reading,
      icon: "fa-book-reader",
      color: "#3b82f6",
    },
  ];

  const recommendations = results?.recommendations?.length
    ? results.recommendations.map((item, index) => ({
        icon: ["fa-microphone", "fa-comments", "fa-pen"][index % 3],
        title: item,
        desc: "Suggested by the backend evaluation pipeline.",
        color: ["#8b5cf6", "#10b981", "#f59e0b"][index % 3],
      }))
    : [
        {
          icon: "fa-microphone",
          title: "Pronunciation Practice",
          desc: "Focus on vowel sounds and word endings.",
          color: "#8b5cf6",
        },
        {
          icon: "fa-comments",
          title: "Daily Conversation",
          desc: "Practice with the AI tutor every day.",
          color: "#10b981",
        },
        {
          icon: "fa-pen",
          title: "Grammar Exercises",
          desc: "Repeat the grammar drills you missed.",
          color: "#f59e0b",
        },
      ];

  const handleStart = () => {
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "2rem 1.25rem 4rem",
        animation: "fadeInUp 0.5s ease",
      }}
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

      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(99,102,241,0.1)",
            color: "#6366f1",
            padding: "0.35rem 1rem",
            borderRadius: "99px",
            fontSize: "0.85rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          <i className="fas fa-trophy" /> Assessment Complete!
        </div>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Your Language Fluency Results
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Based on your backend-scored performance across all assessment areas
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Loading backend results...
        </div>
      ) : (
        <>
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "clamp(1.5rem, 4vw, 3rem)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              marginBottom: "2rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "2rem",
              alignItems: "center",
            }}
            className="result-overall-card"
          >
            <div
              style={{
                position: "relative",
                width: "160px",
                height: "160px",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: "rotate(-90deg)",
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="9"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  style={{
                    transition:
                      "stroke-dashoffset 1.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 900,
                    color: "#111827",
                    lineHeight: 1,
                  }}
                >
                  {Math.round(overall)}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  / 100
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: `${scoreColor}18`,
                  color: scoreColor,
                  padding: "0.3rem 0.9rem",
                  borderRadius: "99px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                {level}
              </div>
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: "0.5rem",
                }}
              >
                Overall Score: {Math.round(overall)}/100
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                }}
              >
                {results?.summary_feedback ||
                  "Your score is based on the backend evaluation of pronunciation, speaking, grammar, and reading."}
              </p>

              <div style={{ marginTop: "1.25rem" }}>
                {breakdown.map((s) => (
                  <ScoreBar
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    color={s.color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {breakdown.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  textAlign: "center",
                  border: `2px solid ${s.color}20`,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${s.color}18`,
                    color: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem",
                    fontSize: "1.1rem",
                  }}
                >
                  <i className={`fas ${s.icon}`} />
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {Math.round(s.value)}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#9ca3af",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  / 100
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginTop: "0.5rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#111827",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              <i
                className="fas fa-map-signs"
                style={{ color: "#6366f1", marginRight: "0.5rem" }}
              />
              Your Personalized Learning Plan
            </h2>
            <div style={{ display: "grid", gap: "0.875rem" }}>
              {recommendations.map((r) => (
                <div
                  key={r.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: `${r.color}08`,
                    border: `1px solid ${r.color}20`,
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: r.color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    <i className={`fas ${r.icon}`} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#111827",
                        fontSize: "0.95rem",
                      }}
                    >
                      {r.title}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      {r.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleStart}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "1rem 2.5rem",
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(99,102,241,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(99,102,241,0.4)";
              }}
            >
              <i className="fas fa-play-circle" /> Continue to Dashboard
            </button>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.85rem",
                color: "#9ca3af",
              }}
            >
              Your backend evaluation has been saved.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
