import { useState } from "react";
import { useAssessment } from "./assessmentContext";

const QS = [
  {
    text: "The concept of artificial intelligence has evolved significantly over the past few decades. Initially focused on simple problem-solving tasks, AI now encompasses machine learning, natural language processing, and computer vision. These advancements have revolutionized industries from healthcare to transportation, creating new opportunities while also raising important ethical questions about privacy and employment.",
    q: "What is the main topic of this passage?",
    opts: [
      "The history of computers",
      "The evolution and impact of artificial intelligence",
      "Ethical questions in technology",
      "Healthcare applications of technology",
    ],
    c: 1,
  },
  {
    text: "Renewable energy sources like solar and wind power are becoming increasingly important as the world seeks to reduce its dependence on fossil fuels. These clean energy alternatives not only help combat climate change but also create new job opportunities in the green economy.",
    q: "What is NOT mentioned as a benefit of renewable energy?",
    opts: [
      "Reducing dependence on fossil fuels",
      "Creating new job opportunities",
      "Being cheaper than fossil fuels",
      "Helping combat climate change",
    ],
    c: 2,
  },
  {
    text: "Effective communication is essential in both personal and professional settings. It involves not only speaking clearly but also active listening, understanding non-verbal cues, and adapting your message to your audience.",
    q: "What does effective communication involve?",
    opts: [
      "Only speaking clearly",
      "Speaking, listening, understanding cues, and adapting",
      "Writing skills only",
      "Using complex vocabulary",
    ],
    c: 1,
  },
];

export default function ReadingStep() {
  const { update, goNext } = useAssessment();
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const q = QS[idx];
  const isLast = idx === QS.length - 1;

  function next() {
    const ns = score + (sel === q.c ? 1 : 0);
    if (!isLast) {
      setScore(ns);
      setIdx((i) => i + 1);
      setSel(null);
    } else {
      update({ readingScore: ns, readingTotal: QS.length });
      goNext("reading");
    }
  }

  return (
    <div className="test-container fade-in" style={{ margin: "2rem auto" }}>
      <div className="test-header">
        <h2>Reading Comprehension</h2>
        <p>Read the following passage and answer the questions.</p>
      </div>
      <div className="test-content">
        <div
          style={{
            background: "var(--light)",
            padding: "2rem",
            borderRadius: "var(--border-radius)",
            marginBottom: "2rem",
            lineHeight: 1.8,
          }}
        >
          <p id="readingText">{q.text}</p>
        </div>
        <div className="test-question" id="readingQuestion">
          {q.q}
        </div>
        <div className="test-options" id="readingOptions">
          {q.opts.map((opt, i) => (
            <div
              key={i}
              className={`test-option${sel === i ? " selected" : ""}`}
              onClick={() => setSel(i)}
            >
              <div className="option-letter">{String.fromCharCode(65 + i)}</div>
              <div>{opt}</div>
            </div>
          ))}
        </div>
        <div className="test-progress-text" id="readingProgress">
          Question {idx + 1} of {QS.length}
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={next}
        disabled={sel === null}
      >
        {isLast ? "See Results" : "Next Question"}{" "}
        <i className="fas fa-arrow-right" />
      </button>
    </div>
  );
}
