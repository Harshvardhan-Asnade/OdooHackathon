import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-shape shape-1" />
        <div className="auth-bg-shape shape-2" />
        <div className="auth-bg-shape shape-3" />
      </div>

      <div className="auth-container animate-in">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <Compass size={32} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue planning your adventures</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input
                id="username"
                type="text"
                placeholder="your@email.com"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="form-input"
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-extras">
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="stamp">
            <span className="stamp-emoji">✈️</span>
            <span className="stamp-text">ADVENTURE<br/>AWAITS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
