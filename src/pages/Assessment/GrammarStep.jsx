import { useEffect, useState } from "react";
import { useAssessment } from "./assessmentContext";
import SessionService from "../../services/sessionService";

export default function GrammarStep() {
  const { data, update, goNext } = useAssessment();
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
    const loadGrammar = async () => {
      try {
        setLoading(true);
        setError(null);
        const content = await SessionService.getAssessmentContent("grammar");
        setQuestions(content?.questions || []);
      } catch (err) {
        setError(err.message || "Failed to load grammar questions.");
      } finally {
        setLoading(false);
      }
    };

    loadGrammar();
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
          test_type: "grammar",
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
        grammarScore: resultScore,
        grammarTotal: questions.length,
        grammarResult: response,
      });
      goNext("grammar");
    } catch (err) {
      setError(err.message || "Failed to submit grammar answers.");
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
        <h2>Grammar Assessment</h2>
        <p>Complete the backend-generated grammar questions.</p>
      </div>
      <div className="test-content">
        {!isReady ? (
          <p>
            {loading
              ? "Loading grammar questions..."
              : "No grammar questions available."}
          </p>
        ) : (
          <>
            <div className="test-question" id="grammarQuestion">
              {currentQuestion?.question}
            </div>
            <div className="test-options" id="grammarOptions">
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
            <div className="test-progress-text" id="grammarProgress">
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
