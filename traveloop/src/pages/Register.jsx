import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Camera, Compass, Sparkles } from 'lucide-react';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { isDemoMode, register } = useTravelPlanner();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', bio: '', password: '',
    travelStyle: 'Balanced explorer',
    preferredBudget: '4200',
    interests: ['Food', 'History'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form);
      navigate('/dashboard');
    } catch (authError) {
      setError(authError.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };
  const interests = ['Food', 'History', 'Architecture', 'Wellness', 'Beach', 'Adventure', 'Photography', 'Shopping'];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-shape shape-1" />
        <div className="auth-bg-shape shape-2" />
        <div className="auth-bg-shape shape-3" />
      </div>

      <div className="auth-container register-container animate-in">
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="auth-logo">
              <Compass size={32} />
            </div>
            <h1>Join Traveloop</h1>
            <p>Start planning unforgettable journeys</p>
          </div>

          <div className="auth-mode-banner">
            <Sparkles size={15} />
            <span>{isDemoMode ? 'Your profile is saved locally until Supabase keys are configured.' : 'Profile metadata will sync to Supabase Auth.'}</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="avatar-upload">
              <div className="avatar-circle">
                <Camera size={24} />
              </div>
              <span>Add Photo</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input className="form-input" placeholder="First name" value={form.firstName} onChange={update('firstName')} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input className="form-input" placeholder="Last name" value={form.lastName} onChange={update('lastName')} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={update('email')} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input className="form-input" placeholder="Your city" value={form.city} onChange={update('city')} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input className="form-input" placeholder="Your country" value={form.country} onChange={update('country')} />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" placeholder="Create a password" value={form.password} onChange={update('password')} required minLength={6} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Travel Style</label>
                <select className="form-input" value={form.travelStyle} onChange={update('travelStyle')}>
                  <option>Balanced explorer</option>
                  <option>Budget backpacker</option>
                  <option>Luxury slow traveler</option>
                  <option>Adventure maximizer</option>
                  <option>Family comfort planner</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Budget</label>
                <input className="form-input" type="number" min="100" value={form.preferredBudget} onChange={update('preferredBudget')} />
              </div>
            </div>

            <div className="form-group">
              <label>Interests for AI Recommendations</label>
              <div className="interest-picker">
                {interests.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={`chip ${form.interests.includes(interest) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Tell us about yourself</label>
              <textarea className="form-input form-textarea" placeholder="What kind of traveler are you?" value={form.bio} onChange={update('bio')} rows={3} />
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
