import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const [settings, setSettings] = useState({ email: true, reminders: true, dark: false })
  const { user } = useAuth()
  const displayName = user?.name || 'Learner'
  const displayEmail = user?.email || 'user@example.com'
  const displayLang = user?.preferredLanguage || 'Spanish'

  return (
    <div id="profile-page">
      <div className="container">

        <div className="profile-header">
          <h1>Your Profile</h1>
          <p>Manage your account and track your learning journey</p>
        </div>

        <div className="profile-container">

          {/* SIDEBAR */}
          <div className="profile-sidebar">
            <div className="profile-avatar"><i className="fas fa-user" /></div>
            <h2>{displayName}</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Learning English (Intermediate)</p>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">87%</div>
                <div className="profile-stat-label">Progress</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">14</div>
                <div className="profile-stat-label">Day Streak</div>
              </div>
            </div>

            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }}>
              <i className="fas fa-edit" /> Edit Profile
            </button>
          </div>

          {/* MAIN */}
          <div className="profile-main">
            <h2>Learning Statistics</h2>

            <div className="profile-stats">
              <div className="profile-stat"><div className="profile-stat-value">45h</div><div className="profile-stat-label">Total Practice</div></div>
              <div className="profile-stat"><div className="profile-stat-value">8</div><div className="profile-stat-label">Achievements</div></div>
              <div className="profile-stat"><div className="profile-stat-value">B1</div><div className="profile-stat-label">Current Level</div></div>
            </div>

            {/* Achievements */}
            <div style={{ marginTop: '2rem' }}>
              <h3>Recent Achievements</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, background: 'gold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-trophy" style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
                <div style={{ width: 60, height: 60, borderRadius: 12, background: 'silver', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-star" style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
                <div style={{ width: 60, height: 60, borderRadius: 12, background: '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-award" style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div style={{ marginTop: '2rem' }}>
              <h3>Account Settings</h3>
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--light)', borderRadius: 'var(--border-radius)' }}>
                  <span>Email Notifications</span>
                  <label className="switch">
                    <input type="checkbox" checked={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.checked }))} />
                    <span className="slider" />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--light)', borderRadius: 'var(--border-radius)' }}>
                  <span>Practice Reminders</span>
                  <label className="switch">
                    <input type="checkbox" checked={settings.reminders} onChange={e => setSettings(s => ({ ...s, reminders: e.target.checked }))} />
                    <span className="slider" />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--light)', borderRadius: 'var(--border-radius)' }}>
                  <span>Dark Mode</span>
                  <label className="switch">
                    <input type="checkbox" checked={settings.dark} onChange={e => setSettings(s => ({ ...s, dark: e.target.checked }))} />
                    <span className="slider" />
                  </label>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
