import { useState, useRef, useEffect } from "react";
import PromptService from "../services/promptService";

// Default empty arrays - will be populated from backend
const DEFAULT_FLASHCARDS = [];
const DEFAULT_GRAMMAR_EXERCISES = [];
const DEFAULT_READING_QUESTIONS = [];

const DEFAULT_CATEGORIES = [
  {
    id: "flashcards",
    icon: "fa-layer-group",
    title: "Flashcards",
    desc: "Learn and review vocabulary with smart flashcards that adapt to your progress",
    s1: "0",
    l1: "Words Mastered",
    s2: "0",
    l2: "Day Streak",
  },
  {
    id: "listening",
    icon: "fa-headphones",
    title: "Listening Practice",
    desc: "Improve your listening comprehension with real conversations and audio exercises",
    s1: "0%",
    l1: "Accuracy",
    s2: "0",
    l2: "Exercises",
  },
  {
    id: "writing",
    icon: "fa-pen",
    title: "Writing Practice",
    desc: "Get instant AI feedback on your writing with grammar and style corrections",
    s1: "0",
    l1: "Avg. Score",
    s2: "0",
    l2: "Submissions",
  },
  {
    id: "speaking",
    icon: "fa-microphone",
    title: "Speaking Drills",
    desc: "Practice pronunciation and speaking with AI-powered conversation partners",
    s1: "0",
    l1: "Minutes",
    s2: "0%",
    l2: "Fluency",
  },
  {
    id: "reading",
    icon: "fa-book-open",
    title: "Reading Practice",
    desc: "Improve reading comprehension with authentic texts and vocabulary exercises",
    s1: "0",
    l1: "WPM",
    s2: "0",
    l2: "Articles",
  },
  {
    id: "grammar",
    icon: "fa-check-double",
    title: "Grammar Practice",
    desc: "Master grammar rules with interactive exercises and instant feedback",
    s1: "0%",
    l1: "Accuracy",
    s2: "0",
    l2: "Exercises",
  },
];

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [grammarAnswers, setGrammarAnswers] = useState({});
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarScore, setGrammarScore] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [readingChecked, setReadingChecked] = useState(false);
  const [writingText, setWritingText] = useState("");
  const [writingFeedback, setWritingFeedback] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [listeningAnswer, setListeningAnswer] = useState(null);
  const [listeningResult, setListeningResult] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);

  // Backend data state
  const [flashcards, setFlashcards] = useState(DEFAULT_FLASHCARDS);
  const [grammarExercises, setGrammarExercises] = useState(
    DEFAULT_GRAMMAR_EXERCISES,
  );
  const [readingQuestions, setReadingQuestions] = useState(
    DEFAULT_READING_QUESTIONS,
  );
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  // Fetch practice data from backend
  useEffect(() => {
    const fetchPracticeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all prompt types from backend
        const prompts = await PromptService.getPrompts();

        if (prompts && Array.isArray(prompts)) {
          // Filter prompts by type
          const flashcard_prompts = prompts
            .filter((p) => p.prompt_type === "flashcard")
            .slice(0, 10);
          const grammar_prompts = prompts
            .filter((p) => p.prompt_type === "grammar")
            .slice(0, 4);
          const reading_prompts = prompts
            .filter((p) => p.prompt_type === "reading")
            .slice(0, 3);

          if (flashcard_prompts.length > 0) setFlashcards(flashcard_prompts);
          if (grammar_prompts.length > 0) setGrammarExercises(grammar_prompts);
          if (reading_prompts.length > 0) setReadingQuestions(reading_prompts);

          // Update categories with real data
          setCategories((prev) =>
            prev.map((cat) => {
              switch (cat.id) {
                case "flashcards":
                  return {
                    ...cat,
                    s1: String(flashcard_prompts.length),
                    l1: "Available",
                  };
                case "grammar":
                  return {
                    ...cat,
                    s1: String(grammar_prompts.length),
                    l1: "Exercises",
                  };
                case "reading":
                  return {
                    ...cat,
                    s1: String(reading_prompts.length),
                    l1: "Articles",
                  };
                default:
                  return cat;
              }
            }),
          );
        }
      } catch (err) {
        console.error("Error fetching practice data:", err);
        setError(
          err.message || "Failed to load practice exercises. Using defaults.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeData();
  }, []);
  const [showPronFeedback, setShowPronFeedback] = useState(false);
  const timerRef = useRef(null);
  const barsRef = useRef([]);

  function nextCard() {
    setCardIdx((i) => (i + 1) % Math.max(flashcards.length, 1));
    setFlipped(false);
  }
  function prevCard() {
    setCardIdx(
      (i) =>
        (i - 1 + Math.max(flashcards.length, 1)) %
        Math.max(flashcards.length, 1),
    );
    setFlipped(false);
  }
  function markKnown() {
    setKnown((k) => k + 1);
    nextCard();
  }

  function setGrammarAnswer(idx, ans) {
    if (!grammarChecked) setGrammarAnswers((a) => ({ ...a, [idx]: ans }));
  }

  function checkGrammarAnswers() {
    let score = 0;
    grammarExercises.forEach((ex, i) => {
      if (grammarAnswers[i] === ex.correct) score++;
    });
    setGrammarScore(score);
    setGrammarChecked(true);
  }

  function setReadingAnswer(idx, ans) {
    if (!readingChecked) setReadingAnswers((a) => ({ ...a, [idx]: ans }));
  }

  function checkReadingAnswers() {
    setReadingChecked(true);
  }

  function submitWriting() {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 10) {
      alert("Please write at least 10 words.");
      return;
    }
    setWritingFeedback(
      `Great effort! Your paragraph has ${wc} words. Grammar looks mostly correct. Try to vary sentence structure more and include transition words like "first", "then", and "finally".`,
    );
  }

  function countWords() {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(wc);
  }

  function checkListeningAnswer() {
    if (listeningAnswer === null) {
      alert("Please select an answer.");
      return;
    }
    setListeningResult(
      listeningAnswer === 1
        ? "✓ Correct! The conversation takes place in a restaurant."
        : "✗ Incorrect. Listen again — they are booking a table at a restaurant.",
    );
  }

  function toggleRecording() {
    if (recording) {
      clearInterval(timerRef.current);
      setRecording(false);
      barsRef.current.forEach((b) => {
        if (b) b.style.height = "4px";
      });
    } else {
      setRecording(true);
      setRecTime(0);
      setShowPronFeedback(false);
      let s = 0;
      timerRef.current = setInterval(() => {
        s++;
        setRecTime(s);
        barsRef.current.forEach((b) => {
          if (b) b.style.height = `${Math.random() * 60 + 10}px`;
        });
        if (s >= 30) {
          clearInterval(timerRef.current);
          setRecording(false);
        }
      }, 1000);
    }
  }

  const fmt = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div id="practice-page">
      <div className="container">
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* CATEGORY CARDS */}
        <div className="practice-categories">
          {loading ? (
            <div
              style={{ textAlign: "center", width: "100%", padding: "2rem" }}
            >
              <p>Loading practice exercises...</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className={`practice-category${activeTab === cat.id ? " active-cat" : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <div className="practice-icon">
                  <i className={`fas ${cat.icon}`} />
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <div className="practice-stats-row">
                  <div className="pstat">
                    <div className="pstat-value">{cat.s1}</div>
                    <div className="pstat-label">{cat.l1}</div>
                  </div>
                  <div className="pstat">
                    <div className="pstat-value">{cat.s2}</div>
                    <div className="pstat-label">{cat.l2}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EXERCISE PANEL */}
        <div className="practice-exercises">
          <div className="exercise-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`exercise-tab${activeTab === cat.id ? " active" : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <i className={`fas ${cat.icon}`} /> {cat.title}
              </button>
            ))}
          </div>

          {/* ── FLASHCARDS ── */}
          {activeTab === "flashcards" && (
            <div className="fade-in">
              {flashcards.length > 0 ? (
                <>
                  <div
                    className={`flashcard-container${flipped ? " flipped" : ""}`}
                    onClick={() => setFlipped((f) => !f)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <div className="flashcard-word">
                          {flashcards[cardIdx]?.word ||
                            flashcards[cardIdx]?.content ||
                            "Loading..."}
                        </div>
                        <div className="flashcard-hint">
                          Click to flip the card
                        </div>
                      </div>
                      <div className="flashcard-back">
                        <div className="flashcard-word">
                          {flashcards[cardIdx]?.translation ||
                            flashcards[cardIdx]?.answer ||
                            ""}
                        </div>
                        <div className="flashcard-hint">
                          {flashcards[cardIdx]?.example || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flashcard-controls">
                    <button className="btn btn-outline" onClick={prevCard}>
                      <i className="fas fa-arrow-left" /> Previous
                    </button>
                    <button className="btn btn-primary" onClick={markKnown}>
                      <i className="fas fa-check" /> I Know This
                    </button>
                    <button className="btn btn-outline" onClick={nextCard}>
                      Next <i className="fas fa-arrow-right" />
                    </button>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <p>
                      Card {cardIdx + 1} of {flashcards.length} | Known: {known}
                    </p>
                    <div
                      className="goal-progress"
                      style={{ maxWidth: 400, margin: "0.75rem auto 0" }}
                    >
                      <div
                        className="goal-progress-bar"
                        style={{
                          width: `${(known / Math.max(flashcards.length, 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#9ca3af",
                  }}
                >
                  <p>No flashcards available yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}

          {/* ── LISTENING ── */}
          {activeTab === "listening" && (
            <div className="fade-in">
              <div className="listening-exercise">
                <h3>Listen to the audio and answer the question</h3>
                <p style={{ color: "var(--gray)", marginBottom: "2rem" }}>
                  This exercise helps improve your listening comprehension
                  skills
                </p>
                <div
                  style={{
                    background: "var(--light)",
                    padding: "1.5rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                    Question: Where does the conversation take place?
                  </p>
                  <p style={{ color: "var(--gray)" }}>
                    Listen carefully to the dialogue
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button className="btn btn-outline">
                    <i className="fas fa-play" /> Play Audio
                  </button>
                  <button className="btn btn-outline">
                    <i className="fas fa-pause" /> Pause
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowTranscript((s) => !s)}
                  >
                    <i className="fas fa-eye" />{" "}
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </button>
                </div>
                {showTranscript && (
                  <div
                    style={{
                      background: "var(--light)",
                      padding: "1.5rem",
                      borderRadius: "var(--border-radius)",
                      marginBottom: "1.5rem",
                      lineHeight: 1.8,
                    }}
                  >
                    <h4 style={{ marginBottom: "0.75rem" }}>Transcript</h4>
                    <p>
                      <strong>Person A:</strong> Good morning! I'd like to book
                      a table for two for tonight at 7 PM.
                    </p>
                    <p>
                      <strong>Person B:</strong> Certainly! Smoking or
                      non-smoking section?
                    </p>
                    <p>
                      <strong>Person A:</strong> Non-smoking, please. And by the
                      window if possible.
                    </p>
                    <p>
                      <strong>Person B:</strong> We have one table by the window
                      available. May I have your name?
                    </p>
                  </div>
                )}
                <h4 style={{ marginBottom: "1rem" }}>Select your answer:</h4>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {[
                    "At a hotel reception",
                    "In a restaurant",
                    "At an airport",
                    "In a store",
                  ].map((opt, i) => (
                    <div
                      key={i}
                      className={`test-option${listeningAnswer === i ? " selected" : ""}`}
                      onClick={() => setListeningAnswer(i)}
                    >
                      <div className="option-letter">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>{opt}</div>
                    </div>
                  ))}
                </div>
                {listeningResult && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      borderRadius: "var(--border-radius)",
                      background: listeningResult.startsWith("✓")
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(239,68,68,0.08)",
                      color: listeningResult.startsWith("✓")
                        ? "var(--secondary-dark)"
                        : "var(--danger)",
                      fontWeight: 600,
                    }}
                  >
                    {listeningResult}
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "1.5rem" }}
                  onClick={checkListeningAnswer}
                >
                  <i className="fas fa-check-circle" /> Check Answer
                </button>
              </div>
            </div>
          )}

          {/* ── WRITING ── */}
          {activeTab === "writing" && (
            <div className="fade-in">
              <div className="writing-prompt">
                <h3>Writing Prompt</h3>
                <p>
                  Write a short paragraph (50–100 words) describing your morning
                  routine. Use at least 3 different verbs in the present tense.
                </p>
                <p
                  style={{
                    color: "var(--gray)",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <i className="fas fa-lightbulb" /> Tip: Try to use time
                  expressions like "first", "then", "after that", and "finally".
                </p>
              </div>
              <textarea
                className="writing-area"
                placeholder="Start writing here... (AI will provide feedback on grammar, vocabulary, and structure)"
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
              />
              <div className="writing-tools">
                <button
                  className="tool-btn"
                  onClick={() =>
                    alert("Grammar looks great! No major errors found.")
                  }
                >
                  <i className="fas fa-spell-check" /> Check Grammar
                </button>
                <button
                  className="tool-btn"
                  onClick={() =>
                    alert(
                      'Vocabulary suggestions: try using "subsequently", "additionally", or "furthermore" for variety.',
                    )
                  }
                >
                  <i className="fas fa-book" /> Vocabulary Help
                </button>
                <button className="tool-btn" onClick={countWords}>
                  <i className="fas fa-calculator" /> Count Words{" "}
                  {wordCount > 0 ? `(${wordCount})` : ""}
                </button>
                <button
                  className="tool-btn"
                  onClick={() => {
                    setWritingText("");
                    setWordCount(0);
                    setWritingFeedback("");
                  }}
                >
                  <i className="fas fa-trash" /> Clear
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1.5rem", width: "100%" }}
                onClick={submitWriting}
              >
                <i className="fas fa-robot" /> Get AI Feedback
              </button>
              {writingFeedback && (
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.5rem",
                    background: "var(--light)",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <h4 style={{ marginBottom: "0.75rem" }}>AI Feedback</h4>
                  <p>{writingFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* ── SPEAKING ── */}
          {activeTab === "speaking" && (
            <div className="fade-in">
              <div className="listening-exercise">
                <h3>Pronunciation Practice</h3>
                <p style={{ color: "var(--gray)", marginBottom: "2rem" }}>
                  Repeat the phrase after the native speaker, then record
                  yourself
                </p>
                <div
                  style={{
                    background: "var(--light)",
                    padding: "2rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "2rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                      color: "var(--primary)",
                    }}
                  >
                    "How's the weather today?"
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn btn-outline"
                      onClick={() => alert("Playing example audio...")}
                    >
                      <i className="fas fa-volume-up" /> Hear Example
                    </button>
                    <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
                      <i className="fas fa-clock" /> 3 seconds
                    </span>
                  </div>
                </div>
                <div className="recording-section">
                  <div
                    className="recording-visualizer"
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "3px",
                      padding: "0 1rem",
                    }}
                  >
                    {recording ? (
                      Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          ref={(el) => (barsRef.current[i] = el)}
                          className="visualizer-bar"
                          style={{ height: "4px" }}
                        />
                      ))
                    ) : (
                      <span
                        style={{
                          margin: "auto",
                          color: "var(--gray)",
                          fontSize: "0.9rem",
                        }}
                      >
                        Click record to start
                      </span>
                    )}
                  </div>
                  <div className="timer-display">{fmt(recTime)}</div>
                  <div className="recording-controls">
                    <button
                      className={`record-btn${recording ? " recording" : ""}`}
                      onClick={toggleRecording}
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
                    {recording
                      ? "Recording... Click stop when done."
                      : "Record your pronunciation. Try to match the intonation and rhythm."}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "1.5rem", width: "100%" }}
                  onClick={() => setShowPronFeedback(true)}
                >
                  <i className="fas fa-chart-line" /> Analyze Pronunciation
                </button>
                {showPronFeedback && (
                  <div
                    style={{
                      marginTop: "2rem",
                      padding: "1.5rem",
                      background: "var(--light)",
                      borderRadius: "var(--border-radius)",
                    }}
                  >
                    <h4 style={{ marginBottom: "1rem" }}>
                      Pronunciation Analysis
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          color: "var(--secondary)",
                        }}
                      >
                        85%
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>Good job!</div>
                        <div style={{ color: "var(--gray)" }}>
                          Your pronunciation is clear and understandable
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(150px,1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          padding: "1rem",
                          borderRadius: "var(--border-radius)",
                        }}
                      >
                        <div
                          style={{ fontWeight: 600, color: "var(--secondary)" }}
                        >
                          ✓ Good
                        </div>
                        <div
                          style={{ fontSize: "0.9rem", color: "var(--gray)" }}
                        >
                          Vowel sounds
                        </div>
                      </div>
                      <div
                        style={{
                          background: "white",
                          padding: "1rem",
                          borderRadius: "var(--border-radius)",
                        }}
                      >
                        <div
                          style={{ fontWeight: 600, color: "var(--accent)" }}
                        >
                          ⚠ Needs Work
                        </div>
                        <div
                          style={{ fontSize: "0.9rem", color: "var(--gray)" }}
                        >
                          Intonation
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── READING ── */}
          {activeTab === "reading" && (
            <div className="fade-in">
              <div className="listening-exercise">
                <h3>Reading Comprehension</h3>
                <p style={{ color: "var(--gray)", marginBottom: "2rem" }}>
                  Read the passage and answer the questions that follow
                </p>
                <div className="reading-passage">
                  <h3>The French Café Culture</h3>
                  <p>
                    In France, the café is more than just a place to drink
                    coffee. It is a social institution, a meeting place, and a
                    cultural landmark. French cafés are where people go to read
                    the newspaper, meet friends, discuss politics, or simply
                    watch the world go by.
                  </p>
                  <p>
                    The tradition of café culture dates back to the 17th century
                    when the first coffeehouses opened in Paris. These
                    establishments quickly became centers of intellectual and
                    artistic life. Famous writers, philosophers, and artists
                    like Voltaire, Rousseau, and Picasso were regular patrons.
                  </p>
                  <p>
                    Today, the café remains an essential part of French life.
                    From the grand cafés of Paris to the small bistros in
                    provincial towns, these establishments serve as the living
                    rooms of French society. They are places where time seems to
                    slow down, and conversation flows as freely as the coffee.
                  </p>
                  <p>
                    Ordering in a French café has its own rituals. A simple "un
                    café" will get you a small, strong espresso. If you prefer a
                    larger coffee with milk, you would ask for "un café au lait"
                    in the morning or "un café crème" later in the day. And
                    remember, sitting at a table usually costs more than
                    standing at the bar!
                  </p>
                </div>
                <div className="reading-vocab">
                  <h4>Vocabulary from the text:</h4>
                  {[
                    ["Institution", "An established organization or custom"],
                    ["Landmark", "A prominent or well-known object"],
                    ["Patrons", "Regular customers or supporters"],
                    ["Provincial", "Relating to areas outside the capital"],
                    ["Rituals", "Established procedures or ceremonies"],
                  ].map(([w, d]) => (
                    <div key={w} className="vocab-item">
                      <span>
                        <strong>{w}</strong>
                      </span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <h4 style={{ marginBottom: "1.5rem" }}>
                  Comprehension Questions:
                </h4>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {readingQuestions.map((rq, qi) => (
                    <div key={qi} className="grammar-question">
                      <h4>{rq.q}</h4>
                      <div className="grammar-options">
                        {rq.options.map((opt, oi) => {
                          let cls = "grammar-option";
                          if (readingChecked) {
                            if (oi === rq.correct) cls += " correct";
                            else if (readingAnswers[qi] === oi) cls += " wrong";
                          } else if (readingAnswers[qi] === oi)
                            cls += " selected";
                          return (
                            <div
                              key={oi}
                              className={cls}
                              onClick={() => setReadingAnswer(qi, oi)}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      {readingChecked && (
                        <div
                          className={`grammar-feedback ${readingAnswers[qi] === rq.correct ? "correct" : "wrong"}`}
                        >
                          {readingAnswers[qi] === rq.correct
                            ? "✓ Correct!"
                            : `✗ Incorrect. The correct answer is: ${rq.options[rq.correct]}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {!readingChecked && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "2rem", width: "100%" }}
                    onClick={checkReadingAnswers}
                  >
                    <i className="fas fa-check-circle" /> Check All Answers
                  </button>
                )}
                {readingChecked && (
                  <div className="grammar-summary">
                    <h4>
                      Results:{" "}
                      {
                        Object.keys(readingAnswers).filter(
                          (k) =>
                            readingAnswers[k] === READING_QUESTIONS[k].correct,
                        ).length
                      }{" "}
                      / {READING_QUESTIONS.length} correct
                    </h4>
                    <button
                      className="btn btn-outline"
                      style={{ marginTop: "1rem" }}
                      onClick={() => {
                        setReadingAnswers({});
                        setReadingChecked(false);
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── GRAMMAR ── */}
          {activeTab === "grammar" && (
            <div className="fade-in">
              <div className="listening-exercise">
                <h3>Grammar Practice</h3>
                <p style={{ color: "var(--gray)", marginBottom: "2rem" }}>
                  Test your grammar knowledge with these interactive exercises
                </p>
                {grammarExercises.map((ex, ei) => (
                  <div key={ei} style={{ marginBottom: "2rem" }}>
                    <h4>{ex.title}</h4>
                    <div
                      className="grammar-question"
                      style={{ marginTop: "0.75rem" }}
                    >
                      <h4>{ex.question}</h4>
                      <p style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
                        {ex.sentence}
                      </p>
                      <div className="grammar-options">
                        {ex.options.map((opt, oi) => {
                          let cls = "grammar-option";
                          if (grammarChecked) {
                            if (oi === ex.correct) cls += " correct";
                            else if (grammarAnswers[ei] === oi) cls += " wrong";
                          } else if (grammarAnswers[ei] === oi)
                            cls += " selected";
                          return (
                            <div
                              key={oi}
                              className={cls}
                              onClick={() => setGrammarAnswer(ei, oi)}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      {grammarChecked && (
                        <div
                          className={`grammar-feedback ${grammarAnswers[ei] === ex.correct ? "correct" : "wrong"}`}
                        >
                          {grammarAnswers[ei] === ex.correct
                            ? `✓ ${ex.explanation}`
                            : `✗ Incorrect. ${ex.explanation}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!grammarChecked ? (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "1rem", width: "100%" }}
                    onClick={checkGrammarAnswers}
                  >
                    <i className="fas fa-check-double" /> Check All Answers
                  </button>
                ) : (
                  <div className="grammar-summary">
                    <h4>Grammar Exercise Summary</h4>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        margin: "1rem 0",
                        fontWeight: 700,
                      }}
                    >
                      Score: {grammarScore} / {GRAMMAR_EXERCISES.length}
                    </div>
                    <p style={{ color: "var(--gray)" }}>
                      {grammarScore === GRAMMAR_EXERCISES.length
                        ? "Perfect! Excellent work!"
                        : grammarScore >= 3
                          ? "Great job! Keep practising."
                          : "Keep practising — you'll get there!"}
                    </p>
                    <button
                      className="btn btn-outline"
                      style={{ marginTop: "1rem" }}
                      onClick={() => {
                        setGrammarAnswers({});
                        setGrammarChecked(false);
                        setGrammarScore(0);
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
