import { useState } from "react";
import { useAssessment } from "./assessmentContext";

const QS = [
  {
    q: "Which sentence is grammatically correct?",
    opts: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      "She not like coffee.",
    ],
    c: 2,
  },
  {
    q: "Choose the correct past tense: 'Yesterday, I ___ to the store.'",
    opts: ["go", "goed", "went", "gone"],
    c: 2,
  },
  {
    q: "Select the correct plural: 'There are three ___ in the room.'",
    opts: ["childs", "children", "child", "childrens"],
    c: 1,
  },
  {
    q: "Which sentence uses articles correctly?",
    opts: [
      "I saw an movie yesterday.",
      "I saw a movie yesterday.",
      "I saw movie yesterday.",
      "I see the movie yesterday.",
    ],
    c: 1,
  },
  {
    q: "Choose the correct comparative form:",
    opts: [
      "This book is interesting than that.",
      "This book is more interesting than that.",
      "This book is interestinger.",
      "This book is most interesting than that.",
    ],
    c: 1,
  },
];

export default function GrammarStep() {
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
      update({ grammarScore: ns, grammarTotal: QS.length });
      goNext("grammar");
    }
  }

  return (
    <div className="test-container fade-in" style={{ margin: "2rem auto" }}>
      <div className="test-header">
        <h2>Grammar Assessment</h2>
        <p>Complete the following sentences with the correct grammar.</p>
      </div>
      <div className="test-content">
        <div className="test-question" id="grammarQuestion">
          {q.q}
        </div>
        <div className="test-options" id="grammarOptions">
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
        <div className="test-progress-text" id="grammarProgress">
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
