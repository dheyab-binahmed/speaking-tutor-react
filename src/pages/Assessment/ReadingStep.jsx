import { useEffect, useState } from "react";
import { useAssessment } from "./assessmentContext";
import SessionService from "../../services/sessionService";

export default function ReadingStep() {
  const { data, update, goNext } = useAssessment();
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const currentQuestion = questions[idx];
  const isLast = idx === questions.length - 1;

  useEffect(() => {
    const loadReading = async () => {
      try {
        setLoading(true);
        setError(null);
        const content = await SessionService.getAssessmentContent("reading");
        setPassage(content?.passage || "");
        setQuestions(content?.questions || []);
      } catch (err) {
        setError(err.message || "Failed to load reading passage.");
      } finally {
        setLoading(false);
      }
    };

    loadReading();
  }, []);

  const goToNextQuestion = async () => {
    if (sel === null || !currentQuestion) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: sel,
    };
    setAnswers(nextAnswers);

    if (!isLast) {
      setIdx((current) => current + 1);
      const nextQuestion = questions[idx + 1];
      setSel(nextAnswers[nextQuestion?.id] ?? null);
      return;
    }

    try {
      setSubmitting(true);
      const response = await SessionService.updateAssessmentScore(
        data.sessionId,
        {
          test_type: "reading",
          responses: Object.entries(nextAnswers).map(
            ([question_id, answer_index]) => ({
              question_id,
              answer_index,
            }),
          ),
        },
      );

      const resultScore = response?.result?.score ?? 0;
      update({
        readingScore: resultScore,
        readingTotal: questions.length,
        readingResult: response,
      });
      goNext("reading");
    } catch (err) {
      setError(err.message || "Failed to submit reading answers.");
    } finally {
      setSubmitting(false);
    }
  };

  const isReady = !loading && questions.length > 0;

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
        <h2>Reading Comprehension</h2>
        <p>Read the backend-generated passage and answer the questions.</p>
      </div>
      <div className="test-content">
        {!isReady ? (
          <p>
            {loading
              ? "Loading reading passage..."
              : "No reading questions available."}
          </p>
        ) : (
          <>
            <div
              style={{
                background: "var(--light)",
                padding: "2rem",
                borderRadius: "var(--border-radius)",
                marginBottom: "2rem",
                lineHeight: 1.8,
              }}
            >
              <p id="readingText">{passage}</p>
            </div>
            <div className="test-question" id="readingQuestion">
              {currentQuestion?.question}
            </div>
            <div className="test-options" id="readingOptions">
              {currentQuestion?.options.map((opt, i) => (
                <div
                  key={i}
                  className={`test-option${sel === i ? " selected" : ""}`}
                  onClick={() => setSel(i)}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>{opt}</div>
                </div>
              ))}
            </div>
            <div className="test-progress-text" id="readingProgress">
              Question {idx + 1} of {questions.length}
            </div>
          </>
        )}
      </div>
      <button
        className="btn btn-primary"
        onClick={goToNextQuestion}
        disabled={sel === null || submitting || !isReady}
      >
        {isLast ? "See Results" : "Next Question"}{" "}
        <i className="fas fa-arrow-right" />
      </button>
    </div>
  );
}
