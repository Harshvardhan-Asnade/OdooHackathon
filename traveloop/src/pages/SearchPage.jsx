import { useState } from 'react';
import { Search, MapPin, Star, DollarSign, Clock, Filter, Plus, Check, Sparkles } from 'lucide-react';
import { recommendationCatalog } from '../data/mockData';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { getPersonalizedRecommendations } from '../lib/plannerEngine';
import './Pages.css';

const baseActivities = [
  { id: 'a1', name: 'Paragliding in Interlaken', location: 'Switzerland', price: 180, rating: 4.9, type: 'Adventure', duration: '2 hrs', description: 'Soar above the Swiss Alps with stunning views of Jungfrau.' },
  { id: 'a2', name: 'Cooking Class in Tuscany', location: 'Italy', price: 95, rating: 4.8, type: 'Food', duration: '4 hrs', description: 'Learn authentic Italian pasta-making from local chefs.' },
  { id: 'a3', name: 'Temple Tour in Kyoto', location: 'Japan', price: 45, rating: 4.9, type: 'Sightseeing', duration: '6 hrs', description: 'Visit ancient temples including Kinkaku-ji and Fushimi Inari.' },
  { id: 'a4', name: 'Scuba Diving in Bali', location: 'Indonesia', price: 70, rating: 4.7, type: 'Adventure', duration: '3 hrs', description: 'Explore coral reefs and marine life in crystal clear waters.' },
  { id: 'a5', name: 'Museum Pass in Paris', location: 'France', price: 55, rating: 4.6, type: 'Sightseeing', duration: 'Full day', description: 'Access to Louvre, Musée d\'Orsay, and 50+ museums.' },
  { id: 'a6', name: 'Street Food Tour Bangkok', location: 'Thailand', price: 30, rating: 4.8, type: 'Food', duration: '3 hrs', description: 'Taste authentic Thai street food with a local guide.' },
  { id: 'a7', name: 'Hiking Table Mountain', location: 'South Africa', price: 0, rating: 4.7, type: 'Adventure', duration: '5 hrs', description: 'Summit one of the New 7 Wonders of Nature.' },
  { id: 'a8', name: 'Flamenco Show in Seville', location: 'Spain', price: 40, rating: 4.5, type: 'Entertainment', duration: '1.5 hrs', description: 'Experience passionate flamenco in an intimate tablao setting.' },
];

const types = ['All', 'Adventure', 'Sightseeing', 'Food', 'Entertainment'];
const costs = ['All', 'Free', 'Under $50', '$50–$100', '$100+'];
const durations = ['All', '1–2 hrs', '3–4 hrs', '5+ hrs', 'Full day'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [added, setAdded] = useState({});
  const { profile, trips } = useTravelPlanner();
  const activeTrip = trips[0];
  const smartActivities = getPersonalizedRecommendations(profile, activeTrip)
    .filter((item) => item.type === 'Activity' || item.type === 'Restaurant')
    .map((item) => ({
      id: item.id,
      name: item.name,
      location: item.city,
      price: item.price,
      rating: item.rating,
      type: item.type === 'Restaurant' ? 'Food' : 'Sightseeing',
      duration: item.type === 'Restaurant' ? '2 hrs' : '3 hrs',
      description: item.reason,
      fitScore: item.fitScore,
    }));
  const activities = [...smartActivities, ...baseActivities, ...recommendationCatalog
    .filter((item) => item.type === 'Activity')
    .map((item) => ({
      id: `catalog-${item.id}`,
      name: item.name,
      location: item.city,
      price: item.price,
      rating: item.rating,
      type: 'Sightseeing',
      duration: '3 hrs',
      description: item.reason,
      fitScore: 76,
    }))];

  const filtered = activities.filter(a => {
    if (query && !a.name.toLowerCase().includes(query.toLowerCase()) && !a.location.toLowerCase().includes(query.toLowerCase())) return false;
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (costFilter === 'Free' && a.price > 0) return false;
    if (costFilter === 'Under $50' && a.price >= 50) return false;
    if (costFilter === '$50–$100' && (a.price < 50 || a.price > 100)) return false;
    if (costFilter === '$100+' && a.price < 100) return false;
    if (durationFilter === '1–2 hrs' && !['1.5 hrs', '2 hrs'].includes(a.duration)) return false;
    if (durationFilter === '3–4 hrs' && !['3 hrs', '4 hrs'].includes(a.duration)) return false;
    if (durationFilter === '5+ hrs' && !a.duration.includes('5') && !a.duration.includes('6')) return false;
    if (durationFilter === 'Full day' && a.duration !== 'Full day') return false;
    return true;
  }).sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>Explore Activities</h1>
            <p>Browse and add activities to enrich your trip</p>
          </div>
        </div>

        <div className="search-bar-v2 animate-in animate-in-delay-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Search activities by name or location..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {/* Filters */}
        <div className="activity-filters animate-in animate-in-delay-2">
          <div className="filter-group">
            <span className="filter-label"><Filter size={13} /> Type</span>
            <div className="filter-chips">{types.map(t => (<button key={t} className={`chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>))}</div>
          </div>
          <div className="filter-group">
            <span className="filter-label"><DollarSign size={13} /> Cost</span>
            <div className="filter-chips">{costs.map(c => (<button key={c} className={`chip ${costFilter === c ? 'active' : ''}`} onClick={() => setCostFilter(c)}>{c}</button>))}</div>
          </div>
          <div className="filter-group">
            <span className="filter-label"><Clock size={13} /> Duration</span>
            <div className="filter-chips">{durations.map(d => (<button key={d} className={`chip ${durationFilter === d ? 'active' : ''}`} onClick={() => setDurationFilter(d)}>{d}</button>))}</div>
          </div>
        </div>

        <div className="activity-results-count animate-in animate-in-delay-3">
          <span>{filtered.length} activities found</span>
        </div>

        <div className="activity-grid">
          {filtered.map((item, i) => (
            <div key={item.id} className={`activity-card animate-in animate-in-delay-${Math.min(i + 3, 8)}`}>
              <div className="activity-card-header">
                <span className="activity-type-tag">{item.type}</span>
                <div className="activity-rating"><Star size={12} fill="var(--gold)" stroke="var(--gold)" /> {item.rating}</div>
              </div>
              <h4>{item.name}</h4>
              {item.fitScore && <span className="ai-fit-pill"><Sparkles size={11} /> {item.fitScore}% AI fit</span>}
              <p className="activity-desc">{item.description}</p>
              <div className="activity-meta-row">
                <span><MapPin size={12} /> {item.location}</span>
                <span><Clock size={12} /> {item.duration}</span>
                <span className="activity-price"><DollarSign size={12} /> {item.price === 0 ? 'Free' : `$${item.price}`}</span>
              </div>
              <button
                className={`btn btn-sm btn-full ${added[item.id] ? 'btn-teal' : 'btn-secondary'}`}
                onClick={() => setAdded(prev => ({...prev, [item.id]: !prev[item.id]}))}
              >
                {added[item.id] ? <><Check size={14} /> Added to Trip</> : <><Plus size={14} /> Add to Trip</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
