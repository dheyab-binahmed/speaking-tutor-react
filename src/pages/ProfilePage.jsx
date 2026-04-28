import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AchievementService from "../services/achievementService";

export default function ProfilePage() {
  const [settings, setSettings] = useState({
    email: true,
    reminders: true,
    dark: false,
  });
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.full_name || user?.name || "Learner";
  const displayEmail = user?.email || "user@example.com";
  const displayLang =
    user?.preferred_language || user?.preferredLanguage || "Spanish";

  // Fetch achievements from backend
  useEffect(() => {
    if (!user) return;
    const fetchAchievements = async () => {
      try {
        const data = await AchievementService.getUserAchievements();
        setAchievements(data || []);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [user]);

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
            <div className="profile-avatar">
              <i className="fas fa-user" />
            </div>
            <h2>{displayName}</h2>
            <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
              Learning English (Intermediate)
            </p>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">
                  {user?.progress || 87}%
                </div>
                <div className="profile-stat-label">Progress</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{user?.streak || 0}</div>
                <div className="profile-stat-label">Day Streak</div>
              </div>
            </div>

            <button
              className="btn btn-outline"
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              <i className="fas fa-edit" /> Edit Profile
            </button>
          </div>

          {/* MAIN */}
          <div className="profile-main">
            <h2>Learning Statistics</h2>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">
                  {user?.total_hours || 45}h
                </div>
                <div className="profile-stat-label">Total Practice</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">
                  {achievements.length || 0}
                </div>
                <div className="profile-stat-label">Achievements</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">
                  {user?.assessment_level || "B1"}
                </div>
                <div className="profile-stat-label">Current Level</div>
              </div>
            </div>

            {/* Achievements */}
            <div style={{ marginTop: "2rem" }}>
              <h3>Recent Achievements</h3>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {loading ? (
                  <p>Loading achievements...</p>
                ) : achievements.length > 0 ? (
                  achievements.slice(0, 3).map((achievement, idx) => (
                    <div
                      key={achievement.id || idx}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        background:
                          achievement.color ||
                          ["gold", "silver", "#cd7f32"][idx % 3],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        title: achievement.name,
                      }}
                      title={achievement.description || achievement.name}
                    >
                      <i
                        className={`fas ${achievement.icon || "fa-star"}`}
                        style={{ color: "white", fontSize: "1.5rem" }}
                      />
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#9ca3af" }}>
                    No achievements yet. Start practicing!
                  </p>
                )}
              </div>
            </div>

            {/* Settings */}
            <div style={{ marginTop: "2rem" }}>
              <h3>Account Settings</h3>
              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "var(--light)",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <span>Email Notifications</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.email}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, email: e.target.checked }))
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "var(--light)",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <span>Practice Reminders</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.reminders}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          reminders: e.target.checked,
                        }))
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "var(--light)",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <span>Dark Mode</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.dark}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, dark: e.target.checked }))
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
