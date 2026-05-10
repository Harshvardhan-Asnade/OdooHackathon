import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Trash2, Edit3, Plus, MoreVertical, Search } from 'lucide-react';
import { trips } from '../data/mockData';
import './Pages.css';

export default function MyTrips() {
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  const filtered = trips.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (searchQ && !t.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const statusConfig = {
    upcoming: { bg: 'var(--terracotta)', text: '#fff' },
    completed: { bg: 'var(--teal)', text: '#fff' },
    planning: { bg: 'var(--gold)', text: 'var(--charcoal)' },
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>My Trips</h1>
            <p>Manage all your travel plans</p>
          </div>
          <Link to="/trips/new" className="btn btn-primary"><Plus size={16} /> <span>New Trip</span></Link>
        </div>

        {/* Search + Filters */}
        <div className="mytrips-controls animate-in animate-in-delay-1">
          <div className="search-bar-v2" style={{ flex: 1 }}>
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search your trips..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <div className="filter-chips">
            {['all', 'upcoming', 'planning', 'completed'].map(f => (
              <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All Trips' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Cards */}
        <div className="mytrips-list">
          {filtered.map((trip, i) => (
            <div key={trip.id} className={`mytrip-card animate-in animate-in-delay-${Math.min(i + 2, 8)}`}>
              <div className="mytrip-cover" style={{ background: `linear-gradient(135deg, ${statusConfig[trip.status]?.bg || '#1A5653'}15, transparent)` }}>
                <span className="mytrip-emoji">{trip.coverEmoji}</span>
              </div>
              <div className="mytrip-body">
                <div className="mytrip-top">
                  <div>
                    <div className="mytrip-status" style={{ background: statusConfig[trip.status]?.bg, color: statusConfig[trip.status]?.text }}>
                      {trip.status}
                    </div>
                    <h3><Link to={`/trips/${trip.id}`}>{trip.name}</Link></h3>
                  </div>
                  <div className="mytrip-actions">
                    <Link to={`/trips/${trip.id}/itinerary/build`} className="btn-icon" title="Edit"><Edit3 size={15} /></Link>
                    <button className="btn-icon danger" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
                <div className="mytrip-meta">
                  <span><MapPin size={13} /> {trip.cities.join(' → ')}</span>
                  <span><Calendar size={13} /> {trip.startDate} — {trip.endDate}</span>
                  <span><Users size={13} /> {trip.travelers.length} travelers</span>
                </div>
                <div className="mytrip-footer">
                  <div className="mytrip-travelers">
                    {trip.travelers.slice(0, 4).map((t, ti) => (
                      <div key={ti} className="traveler-dot" style={{ zIndex: 4 - ti, marginLeft: ti > 0 ? '-6px' : 0 }}>{t[0]}</div>
                    ))}
                  </div>
                  <div className="mytrip-budget">
                    <span className="budget-label">Budget</span>
                    <span className="budget-value">${trip.totalBudget.toLocaleString()}</span>
                  </div>
                  <Link to={`/trips/${trip.id}`} className="btn btn-sm btn-secondary">View Trip →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state animate-in">
            <span style={{ fontSize: 48 }}>🧳</span>
            <h3>No trips found</h3>
            <p>Start planning your next adventure!</p>
            <Link to="/trips/new" className="btn btn-primary"><Plus size={16} /> <span>Create Trip</span></Link>
          </div>
        )}
      </div>
    </div>
  );
}
