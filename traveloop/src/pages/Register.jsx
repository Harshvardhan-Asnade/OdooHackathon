import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Camera } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', bio: '', password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

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
                <input className="form-input" placeholder="First name" value={form.firstName} onChange={update('firstName')} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input className="form-input" placeholder="Last name" value={form.lastName} onChange={update('lastName')} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={update('email')} />
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
              <input className="form-input" type="password" placeholder="Create a password" value={form.password} onChange={update('password')} />
            </div>

            <div className="form-group">
              <label>Tell us about yourself</label>
              <textarea className="form-input form-textarea" placeholder="What kind of traveler are you?" value={form.bio} onChange={update('bio')} rows={3} />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Create Account
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
