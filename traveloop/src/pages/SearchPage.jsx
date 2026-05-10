import { useState } from 'react';
import { Search, MapPin, Star, DollarSign } from 'lucide-react';
import { searchActivities } from '../data/mockData';
import './Pages.css';

export default function SearchPage() {
  const [query, setQuery] = useState('Paragliding');

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Search Activities & Cities</h1>
        </div>

        <div className="search-bar animate-in animate-in-delay-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Search activities, cities..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <h3 className="animate-in animate-in-delay-2" style={{ marginBottom: 'var(--space-lg)' }}>Results</h3>

        <div className="search-results">
          {searchActivities.map((item, i) => (
            <div key={item.id} className={`result-card animate-in animate-in-delay-${Math.min(i + 1, 6)}`}>
              <div className="result-info">
                <h4>{item.name}</h4>
                <div className="result-meta">
                  <span><MapPin size={13} /> {item.location}</span>
                  <span><DollarSign size={13} /> {item.price}</span>
                  <span><Star size={13} fill="var(--gold)" stroke="var(--gold)" /> {item.rating}</span>
                </div>
              </div>
              <button className="btn btn-sm btn-secondary">Add to Trip</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
