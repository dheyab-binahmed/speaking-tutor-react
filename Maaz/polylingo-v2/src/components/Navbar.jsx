import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <NavLink to="/" className="logo">
            <div className="logo-icon"><i className="fas fa-language" /></div>
            <span>PolyLingo</span>
          </NavLink>

          <div className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/lessons"   className={({ isActive }) => isActive ? 'active' : ''}>Lessons</NavLink>
            <NavLink to="/practice"  className={({ isActive }) => isActive ? 'active' : ''}>Practice</NavLink>
            <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink>
            <NavLink to="/profile"   className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink>
          </div>

          <div className="auth-buttons">
            <button className="btn btn-outline" onClick={() => navigate('/assessment')}>
              <i className="fas fa-rocket" /> Start Assessment
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
