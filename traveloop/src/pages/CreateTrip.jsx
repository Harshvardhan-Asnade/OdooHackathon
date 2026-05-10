import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Plus, Trash2, Sparkles } from 'lucide-react';
import './Pages.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ place: '', startDate: '', endDate: '' });

  const suggestions = [
    { emoji: '🗼', name: 'Eiffel Tower', location: 'Paris' },
    { emoji: '🏛️', name: 'Colosseum', location: 'Rome' },
    { emoji: '🎭', name: 'Broadway Show', location: 'New York' },
    { emoji: '⛩️', name: 'Fushimi Inari', location: 'Kyoto' },
    { emoji: '🏖️', name: 'Beach Hopping', location: 'Bali' },
    { emoji: '🌄', name: 'Machu Picchu', location: 'Peru' },
  ];

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Plan a New Trip</h1>
          <p>Let's create something unforgettable</p>
        </div>

        <div className="card animate-in animate-in-delay-1">
          <div className="card-body">
            <div className="form-group">
              <label><MapPin size={14} /> Select a Place</label>
              <input className="form-input" placeholder="Where do you want to go?" value={form.place} onChange={(e) => setForm({...form, place: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={14} /> Start Date</label>
                <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label><Calendar size={14} /> End Date</label>
                <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="section animate-in animate-in-delay-2">
          <div className="section-header">
            <h3><Sparkles size={18} /> Suggested Places & Activities</h3>
          </div>
          <div className="suggestion-grid">
            {suggestions.map((s, i) => (
              <div key={i} className={`suggestion-card animate-in animate-in-delay-${(i % 6) + 1}`}>
                <span className="suggestion-emoji">{s.emoji}</span>
                <div>
                  <strong>{s.name}</strong>
                  <span className="suggestion-loc">{s.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full animate-in animate-in-delay-3" onClick={() => navigate('/trips/t1/itinerary/build')}>
          Continue to Itinerary →
        </button>
      </div>
    </div>
  );
}
