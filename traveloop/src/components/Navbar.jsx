import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Compass, LogOut, Menu, Moon, Settings, Sun, User, X } from 'lucide-react';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, profile, theme, toggleTheme } = useTravelPlanner();
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  if (isAuth) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <Compass size={24} className="brand-icon" />
          <span className="brand-text">Traveloop</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Explore</NavLink>
          <NavLink to="/trips" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>My Trips</NavLink>
          <NavLink to="/cities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Cities</NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Activities</NavLink>
          <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Community</NavLink>
        </div>

        <div className="navbar-actions">
          <button className="nav-avatar" title="Toggle theme" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/profile" className="nav-profile-pill" title="Profile">
            <span>{profile.firstName?.[0] || <User size={14} />}</span>
            <strong>{profile.firstName}</strong>
          </Link>
          <Link to="/admin" className="nav-avatar admin-link" title="Admin"><Settings size={16} /></Link>
          <button className="nav-avatar" title="Logout" onClick={handleLogout}><LogOut size={16} /></button>
          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
