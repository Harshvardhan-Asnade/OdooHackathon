import { useState } from 'react';
import { Search, MapPin, DollarSign, TrendingUp, Plus, Globe, Sparkles, CloudSun } from 'lucide-react';
import { destinationCatalog } from '../data/mockData';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { getCityImageUrl } from '../lib/images';
import './Pages.css';

const regionFilters = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Middle East'];
const costFilters = ['All', 'Low', 'Medium', 'High', 'Very High'];

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  const [added, setAdded] = useState({});
  const { profile } = useTravelPlanner();
  const cities = destinationCatalog.map((city) => ({
    ...city,
    aiFit: Math.min(99, 58 + city.tags.filter((tag) => profile.interests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))).length * 13 + Math.round(city.rating * 4)),
  }));

  const filtered = cities.filter(c => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.country.toLowerCase().includes(query.toLowerCase())) return false;
    if (regionFilter !== 'All' && c.region !== regionFilter) return false;
    if (costFilter !== 'All' && c.costIndex !== costFilter) return false;
    return true;
  }).sort((a, b) => b.aiFit - a.aiFit);

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
              <div 
                className="city-card-top"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(28,25,23,0.3), rgba(28,25,23,0.7)), url(${getCityImageUrl(city.name, 400, 300)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '140px'
                }}
              >
                <span className="city-emoji-lg" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>{city.emoji}</span>
                <div className="city-popularity" style={{ color: 'white' }}>
                  <TrendingUp size={12} /> {city.popularity}
                </div>
              </div>
              <div className="city-card-body">
                <h3>{city.name}</h3>
                <span className="city-country"><MapPin size={12} /> {city.country} · {city.region}</span>
                <p className="city-desc">{city.description}</p>
                <div className="city-signal-row">
                  <span><Sparkles size={12} /> {city.aiFit}% AI fit</span>
                  <span><CloudSun size={12} /> Best {city.bestMonths.slice(0, 2).join('/')}</span>
                </div>
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
