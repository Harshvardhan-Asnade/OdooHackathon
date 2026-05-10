import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Compass, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Auth.css';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: 'harsh@traveloop.com', password: 'demo-pass' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDemoMode, login } = useTravelPlanner();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate('/dashboard');
    } catch (authError) {
      setError(authError.message || 'Unable to sign in. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
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

          <div className="auth-mode-banner">
            {isDemoMode ? <Sparkles size={15} /> : <ShieldCheck size={15} />}
            <span>{isDemoMode ? 'Demo auth mode active. Add Supabase env keys for live sessions.' : 'Secure Supabase session enabled.'}</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                required
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
                  required
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

            {error && (
              <div className="auth-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="auth-extras">
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
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
