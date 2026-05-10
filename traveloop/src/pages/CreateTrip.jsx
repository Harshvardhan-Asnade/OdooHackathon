import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, Image, Sparkles, ArrowRight, DollarSign, Users } from 'lucide-react';
import { destinationCatalog } from '../data/mockData';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Pages.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { createTrip, profile } = useTravelPlanner();
  const [form, setForm] = useState({
    name: '',
    place: '',
    startDate: '',
    endDate: '',
    description: '',
    coverEmoji: '🌍',
    totalBudget: profile.preferredBudget || 4200,
    budgetTier: 'Comfort',
    travelers: [profile.firstName],
    interests: profile.interests || ['Food', 'History'],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreate = (ai = false) => {
    const trip = createTrip(form);
    navigate(`/trips/${trip.id}/itinerary/build${ai ? '?ai=true' : ''}`);
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      handleCreate(true);
    }, 900);
  };

  const emojis = ['🗼', '🌴', '🏔️', '🏖️', '⛩️', '🌍', '🏛️', '🗾', '🏙️', '⛰️', '🎭', '🌄'];

  const suggestions = destinationCatalog.slice(0, 6).map((destination) => ({
    emoji: destination.emoji,
    name: destination.name,
    location: destination.country,
    tags: destination.tags,
  }));
  const interests = ['Food', 'History', 'Museums', 'Architecture', 'Wellness', 'Beach', 'Adventure', 'Photography'];
  const updateInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

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
              <input className="form-input" placeholder="Paris, Rome, Florence" value={form.place} onChange={e => setForm({...form, place: e.target.value})} required />
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

            <div className="form-row">
              <div className="form-group">
                <label><DollarSign size={14} /> Budget</label>
                <input className="form-input" type="number" min="100" value={form.totalBudget} onChange={e => setForm({...form, totalBudget: e.target.value})} />
              </div>
              <div className="form-group">
                <label><Users size={14} /> Budget Tier</label>
                <select className="form-input" value={form.budgetTier} onChange={e => setForm({...form, budgetTier: e.target.value})}>
                  <option>Budget</option>
                  <option>Comfort</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label><FileText size={14} /> Trip Description</label>
              <textarea className="form-input form-textarea" rows={3} placeholder="Describe your trip — what's the vibe, who's coming, what are you excited about?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="form-group">
              <label><Sparkles size={14} /> AI Personalization</label>
              <div className="interest-picker">
                {interests.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={`chip ${form.interests.includes(interest) ? 'active' : ''}`}
                    onClick={() => updateInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
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

        <div className="create-trip-actions animate-in animate-in-delay-4" style={{ display: 'flex', gap: 'var(--space-md)', flexDirection: 'column' }}>
          <button 
            className="btn btn-primary btn-full" 
            onClick={() => handleCreate(false)}
            disabled={isGenerating}
          >
            Continue to Itinerary <ArrowRight size={16} />
          </button>
          
          <button 
            className="btn btn-full ai-generate-btn" 
            onClick={handleAIGenerate}
            disabled={isGenerating}
            style={{ 
              background: 'linear-gradient(135deg, var(--gold), #E8B451)', 
              color: 'var(--charcoal)',
              border: 'none',
              fontWeight: 700
            }}
          >
            {isGenerating ? (
              <><Sparkles size={16} className="spin-slow" /> Generating Itinerary...</>
            ) : (
              <><Sparkles size={16} /> Magic Plan with AI</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
