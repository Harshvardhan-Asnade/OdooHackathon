import { useState } from 'react';
import { User, MapPin, Mail, Phone, Edit3, Save, Trash2, Heart, Shield, Sparkles, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Pages.css';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const { profile, saveProfile, trips } = useTravelPlanner();
  const [user, setUser] = useState({ ...profile });
  const [lang, setLang] = useState('English');

  const savedDestinations = ['Paris', 'Tokyo', 'Bali', 'Barcelona'];
  const upcomingTrips = trips.filter(t => t.status !== 'completed');
  const completedTrips = trips.filter(t => t.status === 'completed');

  const handleSave = async () => {
    await saveProfile(user);
    setEditing(false);
  };

  return (
    <div className="page-content">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header animate-in">
          <div className="profile-avatar"><User size={40} /></div>
          <div className="profile-info">
            {editing ? (
              <div className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input className="form-input" value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} /></div>
                  <div className="form-group"><label>Last Name</label><input className="form-input" value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email</label><input className="form-input" type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} /></div>
                  <div className="form-group"><label>Phone</label><input className="form-input" value={user.phone} onChange={e => setUser({...user, phone: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>City</label><input className="form-input" value={user.city} onChange={e => setUser({...user, city: e.target.value})} /></div>
                  <div className="form-group"><label>Country</label><input className="form-input" value={user.country} onChange={e => setUser({...user, country: e.target.value})} /></div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                  <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> <span>Save Changes</span></button>
                  <button className="btn btn-ghost" onClick={() => { setUser({...profile}); setEditing(false); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1>{profile.firstName} {profile.lastName} {profile.verified && <BadgeCheck size={24} color="var(--teal)" />}</h1>
                <div className="profile-meta">
                  <span><Mail size={14} /> {profile.email}</span>
                  <span><Phone size={14} /> {profile.phone}</span>
                  <span><MapPin size={14} /> {profile.city}, {profile.country}</span>
                </div>
                <p className="profile-bio">{profile.bio}</p>
                <div className="profile-interest-row">
                  {profile.interests.map((interest) => <span key={interest}>{interest}</span>)}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><Edit3 size={14} /> Edit Profile</button>
              </>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Settings */}
          <div className="profile-sidebar">
            <div className="card animate-in animate-in-delay-1">
              <h4><Shield size={16} /> Settings</h4>
              <div className="setting-row">
                <span>Plan</span>
                <strong>{profile.planTier}</strong>
              </div>
              <div className="setting-row">
                <span>Language</span>
                <select className="form-input setting-select" value={lang} onChange={e => setLang(e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Japanese</option>
                </select>
              </div>
              <div className="setting-row">
                <span>Email Notifications</span>
                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
              </div>
              <div className="setting-row">
                <span>Public Profile</span>
                <label className="toggle"><input type="checkbox" /><span className="toggle-slider" /></label>
              </div>
            </div>

            <div className="card animate-in animate-in-delay-2">
              <h4><Sparkles size={16} /> AI Personalization</h4>
              <div className="personalization-meter">
                <div className="personalization-fill" style={{ width: `${Math.min(profile.interests.length * 13 + 35, 96)}%` }} />
              </div>
              <p className="muted-text">Recommendations use your interests, previous trips, preferred budget, and saved destinations.</p>
            </div>

            <div className="card animate-in animate-in-delay-2">
              <h4><Heart size={16} /> Saved Destinations</h4>
              <div className="saved-list">
                {savedDestinations.map((d, i) => (
                  <div key={i} className="saved-item"><MapPin size={13} /> {d}</div>
                ))}
              </div>
            </div>

            <div className="card danger-zone animate-in animate-in-delay-3">
              <h4><Trash2 size={16} /> Danger Zone</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--warm-gray)', marginBottom: 'var(--space-lg)' }}>Permanently delete your account and all data.</p>
              <button className="btn btn-sm" style={{ background: 'var(--error)', color: 'white' }}><Trash2 size={14} /> Delete Account</button>
            </div>
          </div>

          {/* Trips */}
          <div className="profile-main">
            <section className="section animate-in animate-in-delay-2">
              <h2>Upcoming Trips</h2>
              <div className="trips-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {upcomingTrips.map(trip => (
                  <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card">
                    <div className="trip-cover" style={{ background: `linear-gradient(135deg, var(--teal-glow), transparent)` }}><span className="trip-emoji">{trip.coverEmoji}</span></div>
                    <div className="trip-info"><h4>{trip.name}</h4><div className="trip-meta"><span><MapPin size={13} /> {trip.cities[0]}</span></div></div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="section animate-in animate-in-delay-3">
              <h2>Completed Trips</h2>
              <div className="trips-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {completedTrips.map(trip => (
                  <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card">
                    <div className="trip-cover" style={{ background: `linear-gradient(135deg, rgba(94,140,98,0.1), transparent)` }}><span className="trip-emoji">{trip.coverEmoji}</span></div>
                    <div className="trip-info"><h4>{trip.name}</h4><div className="trip-meta"><span><MapPin size={13} /> {trip.cities[0]}</span></div></div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
