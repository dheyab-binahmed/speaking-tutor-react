import { useState, useEffect } from 'react'
import { useAssessment } from './assessmentContext'

const TOPICS = [
  'your favorite travel memory',
  'why daily practice helps fluency',
  'a challenge you solved recently',
  'your favorite book and why',
  'how you plan to use language in future work',
]

export default function SpeakingStep() {
  const { data, update, goNext, goPrev } = useAssessment()
  const languageName = data.language ? data.language.toUpperCase() : 'ENGLISH'

  // Random topic chosen once per render
  const [topic] = useState(() => TOPICS[Math.floor(Math.random() * TOPICS.length)])
  const initialPrompt = `AI: Hi! Let's practice speaking in ${languageName}. Please talk about ${topic}.`

  // Chat state
  const [messages, setMessages] = useState([{ role: 'ai', text: initialPrompt }])
  const [input, setInput] = useState('')
  const [score, setScore] = useState(null)
  const [recording, setRecording] = useState(false)

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    const voices = window.speechSynthesis.getVoices()
    const softVoice = voices.find(v => /female|soft|alloy|susan|kendra|lisa|anna/i.test(v.name)) || voices[0]
    if (softVoice) utterance.voice = softVoice

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const sendUserMessage = (spokenText) => {
    const trimmed = (spokenText ?? input).trim()
    if (!trimmed) return

    const aiResponse = 'Great response! Keep speaking clearly and naturally.'
    setMessages(prev => [...prev, { role: 'user', text: trimmed }, { role: 'ai', text: `AI: ${aiResponse}` }])
    speakText(aiResponse)
    setInput('')
  }

  // Start typing / speech recognition input
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please type your response.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setRecording(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendUserMessage(transcript)
    }
    recognition.onerror = () => {
      alert('Speech recognition failed. Please type your response.')
    }
    recognition.onend = () => setRecording(false)
    recognition.start()
  }

  const gradeConversation = () => {
    const userCount = messages.filter(m => m.role === 'user').length
    const generatedScore = Math.min(10, Math.max(4, 5 + userCount))
    setScore(generatedScore)
    update({ fluencyScore: generatedScore })
  }

  // Speak first AI prompt when component mounts
  useEffect(() => {
    const prompt = initialPrompt.replace(/^AI:\s*/, '')
    speakText(prompt)
  }, [initialPrompt])

  const handleContinue = () => {
    const userMessages = messages.filter(m => m.role === 'user').length
    if (userMessages === 0) {
      alert('Please respond at least once before continuing.')
      return
    }
    gradeConversation()
    setTimeout(() => goNext('speaking'), 350)
  }

  return (
    <div className="test-container fade-in" style={{ margin: '2rem auto', maxWidth: 920 }}>
      <div className="test-header">
        <h2>AI Speaking Conversation ({languageName})</h2>
        <p>AI starts with a random topic and you reply. Your responses are graded automatically.</p>
      </div>

      <div className="speaking-chat-card">
        <div className="chat-header">
          <div><strong>AI Tutor</strong> (Topic: {topic})</div>
          <span className="badge">Live speaking</span>
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              <div className="bubble-label">{msg.role === 'ai' ? 'AI Tutor' : 'You'}</div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your spoken reply..."
            onKeyDown={e => e.key === 'Enter' && sendUserMessage()}
          />
          <button className="btn btn-primary" onClick={sendUserMessage}>Send</button>
        </div>

        <div className="chat-controls">
          <button className="btn btn-secondary" onClick={startSpeechRecognition} disabled={recording}>
            {recording ? 'Listening...' : 'Speak Now'}
          </button>
          <button className="btn btn-outline" onClick={handleContinue}>Grade & Continue</button>
        </div>

        {score !== null && (
          <div className="grade-box">
            <strong>Speaking Grade:</strong> {score}/10 — {score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : 'Needs Practice'}
          </div>
        )}
      </div>

      <div className="test-navigation" style={{ marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={() => goPrev('speaking')}><i className="fas fa-arrow-left" /> Back</button>
      </div>
    </div>
  )
}
