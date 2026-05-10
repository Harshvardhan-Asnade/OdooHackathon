import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Compass } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/dashboard', label: 'Explore' },
    { path: '/trips', label: 'My Trips' },
    { path: '/community', label: 'Community' },
    { path: '/search', label: 'Search' },
  ];

  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  if (isAuth) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <Compass className="brand-icon" size={26} />
          <span className="brand-text">Traveloop</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link to="/profile" className="nav-avatar" title="Profile">
            <User size={18} />
          </Link>
          <button
            className="nav-avatar admin-link"
            onClick={() => navigate('/admin')}
            title="Admin"
          >
            ⚙
          </button>
          <button
            className="nav-avatar"
            onClick={() => navigate('/login')}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
