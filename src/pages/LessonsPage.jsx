import { useNavigate } from 'react-router-dom'

export default function LessonsPage() {
  const navigate = useNavigate()
  return (
    <div id="lessons-page">
      <div className="container">

        <div className="lessons-header">
          <h1>Your Learning Path</h1>
          <p>Follow your personalized learning path to achieve fluency</p>
        </div>

        {/* CATEGORIES */}
        <div className="lesson-categories">
          <div className="lesson-category" onClick={() => navigate('/practice')}>
            <div className="category-icon"><i className="fas fa-volume-up" /></div>
            <h3>Pronunciation</h3>
            <p>Master sounds, intonation, and accent reduction</p>
            <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '80%' }} /></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>12/15 lessons completed</p>
          </div>
          <div className="lesson-category" onClick={() => navigate('/practice')}>
            <div className="category-icon"><i className="fas fa-comments" /></div>
            <h3>Conversation</h3>
            <p>Practice real-life dialogues and speaking skills</p>
            <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '65%' }} /></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>8/12 lessons completed</p>
          </div>
          <div className="lesson-category" onClick={() => navigate('/practice')}>
            <div className="category-icon"><i className="fas fa-book" /></div>
            <h3>Grammar</h3>
            <p>Learn sentence structure and grammar rules</p>
            <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '45%' }} /></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>6/13 lessons completed</p>
          </div>
        </div>

        {/* LESSON LIST */}
        <div style={{ marginTop: '3rem' }}>
          <div className="section-header">
            <h2>Recommended Lessons</h2>
            <button className="btn btn-outline">Filter</button>
          </div>
          <div className="lesson-list">

            <div className="lesson-card">
              <h3>Perfect Your "TH" Sound</h3>
              <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>Practice the difficult "TH" sound with interactive exercises</p>
              <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '60%' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Duration: 15 min</span>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/practice')}>Continue</button>
              </div>
            </div>

            <div className="lesson-card">
              <h3>Restaurant Conversations</h3>
              <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>Learn how to order food and make reservations</p>
              <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '30%' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Duration: 20 min</span>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/practice')}>Continue</button>
              </div>
            </div>

            <div className="lesson-card">
              <h3>Past Tense Mastery</h3>
              <p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>Learn to use past tenses correctly in conversation</p>
              <div className="lesson-progress"><div className="lesson-progress-bar" style={{ width: '0%' }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Duration: 25 min</span>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/practice')}>Start</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
