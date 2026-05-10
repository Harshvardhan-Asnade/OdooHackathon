import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, Image, Sparkles, ArrowRight } from 'lucide-react';
import './Pages.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', place: '', startDate: '', endDate: '', description: '', coverEmoji: '🌍' });

  const emojis = ['🗼', '🌴', '🏔️', '🏖️', '⛩️', '🌍', '🏛️', '🗾', '🏙️', '⛰️', '🎭', '🌄'];

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
          <div>
            <h1>Plan a New Trip</h1>
            <p>Let's create something unforgettable</p>
          </div>
        </div>

        <div className="card animate-in animate-in-delay-1">
          <div className="card-body">
            {/* Trip Name */}
            <div className="form-group">
              <label><FileText size={14} /> Trip Name</label>
              <input className="form-input" placeholder="e.g., European Summer Adventure" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            {/* Destination */}
            <div className="form-group">
              <label><MapPin size={14} /> Destination</label>
              <input className="form-input" placeholder="Where do you want to go?" value={form.place} onChange={e => setForm({...form, place: e.target.value})} />
            </div>

            {/* Dates */}
            <div className="form-row">
              <div className="form-group">
                <label><Calendar size={14} /> Start Date</label>
                <input className="form-input" type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label><Calendar size={14} /> End Date</label>
                <input className="form-input" type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label><FileText size={14} /> Trip Description</label>
              <textarea className="form-input form-textarea" rows={3} placeholder="Describe your trip — what's the vibe, who's coming, what are you excited about?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            {/* Cover Photo / Emoji */}
            <div className="form-group">
              <label><Image size={14} /> Cover Photo (choose an icon)</label>
              <div className="emoji-picker">
                {emojis.map(e => (
                  <button key={e} className={`emoji-option ${form.coverEmoji === e ? 'selected' : ''}`} onClick={() => setForm({...form, coverEmoji: e})}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="section animate-in animate-in-delay-2">
          <div className="section-header">
            <h3><Sparkles size={18} /> Suggested Places & Activities</h3>
          </div>
          <div className="suggestion-grid">
            {suggestions.map((s, i) => (
              <div key={i} className={`suggestion-card animate-in animate-in-delay-${Math.min(i + 3, 8)}`}>
                <span className="suggestion-emoji">{s.emoji}</span>
                <div>
                  <strong>{s.name}</strong>
                  <span className="suggestion-loc">{s.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full animate-in animate-in-delay-4" onClick={() => navigate('/trips/t1/itinerary/build')}>
          Continue to Itinerary <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
