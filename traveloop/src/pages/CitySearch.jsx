import { useState } from 'react';
import { Search, MapPin, DollarSign, TrendingUp, Plus, Filter, Globe } from 'lucide-react';
import './Pages.css';

const cities = [
  { id: 'c1', name: 'Paris', country: 'France', region: 'Europe', costIndex: 'High', popularity: 892, emoji: '🗼', description: 'City of lights, art, and romance' },
  { id: 'c2', name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 'High', popularity: 756, emoji: '🗾', description: 'Blend of tradition and futuristic innovation' },
  { id: 'c3', name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 'Low', popularity: 634, emoji: '🌴', description: 'Tropical paradise with rice terraces and temples' },
  { id: 'c4', name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 'Medium', popularity: 521, emoji: '🏛️', description: 'Ancient ruins, art, and world-class cuisine' },
  { id: 'c5', name: 'New York', country: 'USA', region: 'North America', costIndex: 'Very High', popularity: 498, emoji: '🗽', description: 'The city that never sleeps' },
  { id: 'c6', name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 'Low', popularity: 445, emoji: '🛕', description: 'Vibrant street food and ornate temples' },
  { id: 'c7', name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 'Medium', popularity: 412, emoji: '🏖️', description: 'Gaudí architecture and Mediterranean vibes' },
  { id: 'c8', name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 'Medium', popularity: 320, emoji: '⛰️', description: 'Table Mountain and stunning coastline' },
  { id: 'c9', name: 'Cusco', country: 'Peru', region: 'South America', costIndex: 'Low', popularity: 285, emoji: '🏔️', description: 'Gateway to Machu Picchu and Incan heritage' },
  { id: 'c10', name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 'Very High', popularity: 390, emoji: '🏙️', description: 'Futuristic skyline meets desert luxury' },
];

const regionFilters = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Middle East'];
const costFilters = ['All', 'Low', 'Medium', 'High', 'Very High'];

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [added, setAdded] = useState({});

  const filtered = cities.filter(c => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.country.toLowerCase().includes(query.toLowerCase())) return false;
    if (regionFilter !== 'All' && c.region !== regionFilter) return false;
    if (costFilter !== 'All' && c.costIndex !== costFilter) return false;
    return true;
  });

  const costColors = { 'Low': 'var(--sage)', 'Medium': 'var(--gold)', 'High': 'var(--terracotta)', 'Very High': 'var(--error)' };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>Discover Cities</h1>
            <p>Find and add cities to your trip</p>
          </div>
        </div>

        <div className="search-bar-v2 animate-in animate-in-delay-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Search by city name or country..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        <div className="city-filters animate-in animate-in-delay-2">
          <div className="filter-group">
            <span className="filter-label"><Globe size={13} /> Region</span>
            <div className="filter-chips">
              {regionFilters.map(r => (
                <button key={r} className={`chip ${regionFilter === r ? 'active' : ''}`} onClick={() => setRegionFilter(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label"><DollarSign size={13} /> Cost</span>
            <div className="filter-chips">
              {costFilters.map(c => (
                <button key={c} className={`chip ${costFilter === c ? 'active' : ''}`} onClick={() => setCostFilter(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="city-results-count animate-in animate-in-delay-3">
          <span>{filtered.length} cities found</span>
        </div>

        <div className="city-grid">
          {filtered.map((city, i) => (
            <div key={city.id} className={`city-card animate-in animate-in-delay-${Math.min(i + 3, 8)}`}>
              <div className="city-card-top">
                <span className="city-emoji-lg">{city.emoji}</span>
                <div className="city-popularity">
                  <TrendingUp size={12} /> {city.popularity}
                </div>
              </div>
              <div className="city-card-body">
                <h3>{city.name}</h3>
                <span className="city-country"><MapPin size={12} /> {city.country} · {city.region}</span>
                <p className="city-desc">{city.description}</p>
                <div className="city-card-footer">
                  <span className="city-cost-badge" style={{ color: costColors[city.costIndex] }}>
                    <DollarSign size={12} /> {city.costIndex}
                  </span>
                  <button
                    className={`btn btn-sm ${added[city.id] ? 'btn-teal' : 'btn-primary'}`}
                    onClick={() => setAdded(prev => ({ ...prev, [city.id]: !prev[city.id] }))}
                  >
                    {added[city.id] ? '✓ Added' : <><Plus size={14} /> <span>Add to Trip</span></>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
