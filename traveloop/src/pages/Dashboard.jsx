import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, MapPin, Calendar, Users, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import { regions, trips } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const statusColors = {
    upcoming: { bg: 'var(--terracotta)', text: '#fff' },
    completed: { bg: 'var(--teal)', text: '#fff' },
    planning: { bg: 'var(--gold)', text: 'var(--charcoal)' },
  };

  return (
    <div className="page-content">
      <div className="container">
        {/* Hero — Asymmetric editorial layout */}
        <div className="hero animate-in">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Your Next Chapter
            </div>
            <h1 className="hero-title">
              Where will<br />
              <span className="hero-accent">your journey</span><br />
              take you?
            </h1>
            <p className="hero-subtitle">
              Plan, explore, and share unforgettable travel experiences with people who get it.
            </p>
            <Link to="/trips/new" className="hero-cta">
              Start Planning <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="hero-right">
            <div className="hero-card hero-card-1 animate-in animate-in-delay-2">
              <span>🗼</span>
              <div><strong>Paris</strong><small>3 trips planned</small></div>
            </div>
            <div className="hero-card hero-card-2 animate-in animate-in-delay-4">
              <span>⛩️</span>
              <div><strong>Kyoto</strong><small>2 trips planned</small></div>
            </div>
            <div className="hero-card hero-card-3 animate-in animate-in-delay-6">
              <span>🌴</span>
              <div><strong>Bali</strong><small>1 trip completed</small></div>
            </div>
            <div className="hero-globe animate-in animate-in-delay-3">🌍</div>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap animate-in animate-in-delay-2">
          <div className="search-bar-v2">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search destinations, activities, or trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-filter-btn">
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Regions — Horizontal scroll with overlap */}
        <section className="section animate-in animate-in-delay-3">
          <div className="section-header">
            <div>
              <h2>Explore Regions</h2>
              <p className="section-sub">Discover your next destination</p>
            </div>
            <Link to="/search" className="section-link">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="region-scroll">
            {regions.map((region, i) => (
              <Link to="/search" key={region.id} className={`region-card-v2 animate-in animate-in-delay-${Math.min(i + 4, 8)}`}>
                <div className="region-emoji-wrap" style={{ '--accent': region.color }}>
                  <span className="region-emoji-v2">{region.image}</span>
                </div>
                <div className="region-label">
                  <span className="region-name-v2">{region.name}</span>
                  <ArrowUpRight size={13} className="region-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trips — Masonry-like staggered layout */}
        <section className="section animate-in animate-in-delay-5">
          <div className="section-header">
            <div>
              <h2>Your Trips</h2>
              <p className="section-sub">Continue where you left off</p>
            </div>
            <Link to="/trips" className="section-link">View all <ArrowRight size={15} /></Link>
          </div>
          <div className="trips-grid-v2">
            {trips.map((trip, i) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className={`trip-card-v2 ${i === 0 ? 'trip-featured' : ''} animate-in animate-in-delay-${Math.min(i + 5, 8)}`}>
                <div className="trip-visual">
                  <span className="trip-emoji-v2">{trip.coverEmoji}</span>
                  <div className="trip-badge" style={{ background: statusColors[trip.status].bg, color: statusColors[trip.status].text }}>
                    {trip.status}
                  </div>
                </div>
                <div className="trip-content">
                  <h3 className="trip-title-v2">{trip.name}</h3>
                  <div className="trip-details">
                    <span className="trip-detail"><MapPin size={12} /> {trip.cities.slice(0, 2).join(', ')}{trip.cities.length > 2 ? ` +${trip.cities.length - 2}` : ''}</span>
                    <span className="trip-detail"><Calendar size={12} /> {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="trip-travelers">
                    {trip.travelers.slice(0, 3).map((t, ti) => (
                      <div key={ti} className="traveler-dot" style={{ zIndex: 3 - ti, marginLeft: ti > 0 ? '-6px' : 0 }}>
                        {t[0]}
                      </div>
                    ))}
                    {trip.travelers.length > 3 && <span className="traveler-more">+{trip.travelers.length - 3}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAB */}
        <Link to="/trips/new" className="fab-v2">
          <Plus size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
