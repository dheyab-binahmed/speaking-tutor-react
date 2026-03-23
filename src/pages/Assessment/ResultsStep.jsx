import { useNavigate } from 'react-router-dom'
import { useAssessment } from './assessmentContext'

export default function ResultsStep() {
  const { data } = useAssessment()
  const navigate  = useNavigate()
  const ps = data.pronunciationScore||7
  const fs = data.fluencyScore||6
  const gs = +((data.grammarScore||0)/(data.grammarTotal||5)*10).toFixed(1)
  const rs = +((data.readingScore||0)/(data.readingTotal||3)*10).toFixed(1)
  const overall = Math.round((ps+fs+gs+rs)/4)
  const level = overall>=9?'Advanced':overall>=7?'Intermediate':overall>=5?'Upper Beginner':'Beginner'
  // r=45, circumference ≈ 283
  const offset = 283 - (overall/10)*283

  return (
    <div className="results-container fade-in">
      <div className="results-header">
        <h1>Your Language Fluency Assessment</h1>
        <p>Based on your performance across all tests, here's your comprehensive language profile</p>
      </div>

      <div className="overall-score">
        <div className="score-circle">
          <svg viewBox="0 0 100 100">
            <circle className="score-circle-bg" cx="50" cy="50" r="45"/>
            <circle className="score-circle-progress" cx="50" cy="50" r="45" id="scoreCircle"
              style={{strokeDasharray:'283',strokeDashoffset:offset}}/>
          </svg>
          <div className="score-value" id="overallScore">{overall}</div>
        </div>
        <div className="score-label">Overall Fluency Score</div>
        <h2 id="fluencyLevel">{level}</h2>
        <p id="levelDescription" style={{color:'var(--gray)',maxWidth:'500px',margin:'0 auto'}}>
          Based on your performance, your proficiency level is {level}. Keep up the great work!
        </p>
      </div>

      <div className="results-breakdown">
        <div className="result-card">
          <div className="result-icon"><i className="fas fa-volume-up"/></div>
          <h3>Pronunciation</h3>
          <div className="result-score" id="pronunciationScore">{ps}/10</div>
          <p className="result-description">Your pronunciation accuracy score</p>
        </div>
        <div className="result-card">
          <div className="result-icon"><i className="fas fa-comments"/></div>
          <h3>Speaking Fluency</h3>
          <div className="result-score" id="fluencyScore">{fs}/10</div>
          <p className="result-description">Your conversational fluency score</p>
        </div>
        <div className="result-card">
          <div className="result-icon"><i className="fas fa-book"/></div>
          <h3>Grammar</h3>
          <div className="result-score" id="grammarScore">{gs}/10</div>
          <p className="result-description">Your grammar accuracy score</p>
        </div>
        <div className="result-card">
          <div className="result-icon"><i className="fas fa-book-reader"/></div>
          <h3>Reading</h3>
          <div className="result-score" id="readingScore">{rs}/10</div>
          <p className="result-description">Your reading comprehension score</p>
        </div>
      </div>

      <div className="recommendations">
        <h2>Your Personalized Learning Plan</h2>
        <div className="recommendation-list">
          <div className="recommendation-item">
            <div className="recommendation-icon"><i className="fas fa-microphone"/></div>
            <div><h4>Pronunciation Practice</h4><p>Focus on vowel sounds and intonation patterns</p></div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-icon"><i className="fas fa-comments"/></div>
            <div><h4>Daily Conversation</h4><p>Practice with AI tutor for 15 minutes daily</p></div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-icon"><i className="fas fa-pen"/></div>
            <div><h4>Grammar Exercises</h4><p>Complete verb tense and sentence structure exercises</p></div>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:'3rem'}}>
          <button className="btn btn-primary" style={{padding:'1rem 3rem',fontSize:'1.1rem'}} onClick={()=>navigate('/dashboard')}>
            <i className="fas fa-play-circle"/> Start Your Learning Journey
          </button>
        </div>
      </div>
    </div>
  )
}
