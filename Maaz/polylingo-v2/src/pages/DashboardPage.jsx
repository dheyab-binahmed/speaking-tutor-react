import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const bars = [
    { day: 'Mon', h: 150 }, { day: 'Tue', h: 120 }, { day: 'Wed', h: 180 },
    { day: 'Thu', h: 90  }, { day: 'Fri', h: 160 }, { day: 'Sat', h: 75  }, { day: 'Sun', h: 200 },
  ]
  return (
    <div id="dashboard-page">
      <div className="container">

        <div className="dashboard-header">
          <h1>Welcome back, John!</h1>
          <p>Here's your language learning progress for today</p>
        </div>

        {/* STAT CARDS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-trophy" /></div>
            <div className="stat-content"><div className="stat-value">87%</div><div className="stat-label">Overall Progress</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-fire" /></div>
            <div className="stat-content"><div className="stat-value">14</div><div className="stat-label">Day Streak</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-clock" /></div>
            <div className="stat-content"><div className="stat-value">45min</div><div className="stat-label">Today's Practice</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-star" /></div>
            <div className="stat-content"><div className="stat-value">8</div><div className="stat-label">Achievements</div></div>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="dashboard-sections">

          {/* Today's Goals */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Today's Goals</h2>
              <button className="btn btn-outline" onClick={() => navigate('/lessons')}>View All</button>
            </div>
            <div className="daily-goal">
              <h3>Daily Practice Goal</h3>
              <p>Complete 30 minutes of practice today</p>
              <div className="goal-progress">
                <div className="goal-progress-bar" style={{ width: '75%' }} />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>75% completed (22/30 minutes)</p>
            </div>
            <div className="exercise-list">
              <div className="exercise-item" onClick={() => navigate('/practice')}>
                <div className="exercise-icon"><i className="fas fa-volume-up" /></div>
                <div><h4>Pronunciation Practice</h4><p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Complete 5 exercises</p></div>
              </div>
              <div className="exercise-item" onClick={() => navigate('/practice')}>
                <div className="exercise-icon"><i className="fas fa-comments" /></div>
                <div><h4>AI Conversation</h4><p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Talk with AI for 10 minutes</p></div>
              </div>
              <div className="exercise-item" onClick={() => navigate('/practice')}>
                <div className="exercise-icon"><i className="fas fa-book" /></div>
                <div><h4>Grammar Quiz</h4><p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Complete 10 questions</p></div>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Weekly Progress</h2>
              <button className="btn btn-outline">Details</button>
            </div>
            <div style={{ height: '200px', background: 'var(--light)', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '10px' }}>
              {bars.map(b => (
                <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', height: `${b.h}px` }} />
                  <span style={{ marginTop: 5, fontSize: '0.8rem', color: 'var(--gray)' }}>{b.day}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--gray)' }}>Your practice time this week: 7 hours 45 minutes</p>
          </div>

        </div>

        {/* LEADERBOARD */}
        <div className="leaderboard">
          <div className="section-header">
            <h2>Weekly Leaderboard</h2>
            <button className="btn btn-outline" onClick={() => navigate('/community')}>View All</button>
          </div>
          <ul className="leaderboard-list">
            {[
              { rank: 1, name: 'Alex Johnson', pts: '9,845 pts' },
              { rank: 2, name: 'Maria Garcia', pts: '9,120 pts' },
              { rank: 3, name: 'James Wilson', pts: '8,755 pts' },
              { rank: 4, name: 'You',          pts: '7,980 pts' },
              { rank: 5, name: 'Sarah Chen',   pts: '7,430 pts' },
            ].map(item => (
              <li key={item.rank} className="leaderboard-item">
                <div className="leaderboard-rank">{item.rank}</div>
                <div className="leaderboard-user" style={{ fontWeight: item.name === 'You' ? 700 : 400 }}>{item.name}</div>
                <div className="leaderboard-score">{item.pts}</div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
