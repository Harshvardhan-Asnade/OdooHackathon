import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, MapPin, Calendar, ArrowRight, Sparkles, ArrowUpRight, DollarSign, TrendingUp, CloudSun, Route } from 'lucide-react';
import { regions } from '../data/mockData';
import SmartInsights from '../components/SmartInsights';
import WeatherPanel from '../components/WeatherPanel';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { getCityImageUrl } from '../lib/images';
import './Dashboard.css';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, trips } = useTravelPlanner();

  const statusColors = {
    upcoming: { bg: 'var(--terracotta)', text: '#fff' },
    completed: { bg: 'var(--teal)', text: '#fff' },
    planning: { bg: 'var(--gold)', text: 'var(--charcoal)' },
  };

  const totalBudget = trips.reduce((s, t) => s + t.totalBudget, 0);
  const totalSpent = trips.reduce((s, t) => s + t.totalSpent, 0);
  const featuredTrip = trips[0];
  const searchedTrips = trips.filter((trip) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return trip.name.toLowerCase().includes(query)
      || trip.cities.some((city) => city.toLowerCase().includes(query))
      || trip.interests?.some((interest) => interest.toLowerCase().includes(query));
  });

  return (
    <div className="page-content">
      <div className="container">
        {/* Hero */}
        <div className="hero animate-in">
          <div className="hero-left">
            <div className="hero-eyebrow"><span className="eyebrow-dot" /> Welcome back</div>
            <h1 className="hero-title">
              Hello,<br />
              <span className="hero-accent">{profile.firstName}</span>
            </h1>
            <p className="hero-subtitle">Plan, optimize, budget, and collaborate on travel plans with AI that understands your style.</p>
            <Link to="/trips/new" className="hero-cta">Start Planning <ArrowUpRight size={18} /></Link>
          </div>
          <div className="hero-right">
            <div className="hero-card hero-card-1 animate-in animate-in-delay-2"><span>🗼</span><div><strong>Paris</strong><small>3 trips planned</small></div></div>
            <div className="hero-card hero-card-2 animate-in animate-in-delay-4"><span>⛩️</span><div><strong>Kyoto</strong><small>2 trips planned</small></div></div>
            <div className="hero-card hero-card-3 animate-in animate-in-delay-6"><span>🌴</span><div><strong>Bali</strong><small>1 trip completed</small></div></div>
            <div className="hero-globe animate-in animate-in-delay-3">🌍</div>
          </div>
        </div>

        {/* Budget Highlights */}
        <div className="budget-highlights animate-in animate-in-delay-1">
          <div className="highlight-card">
            <div className="highlight-icon"><TrendingUp size={18} /></div>
            <div><span className="highlight-label">Total Trips</span><span className="highlight-value">{trips.length}</span></div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon"><DollarSign size={18} /></div>
            <div><span className="highlight-label">Total Budget</span><span className="highlight-value">${totalBudget.toLocaleString()}</span></div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon"><DollarSign size={18} /></div>
            <div><span className="highlight-label">Total Spent</span><span className="highlight-value">${totalSpent.toLocaleString()}</span></div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon"><MapPin size={18} /></div>
            <div><span className="highlight-label">Cities Visited</span><span className="highlight-value">{new Set(trips.flatMap(t => t.cities)).size}</span></div>
          </div>
        </div>

        {featuredTrip && (
          <section className="section animate-in animate-in-delay-2">
            <div className="section-header">
              <div><h2>AI Planning Command Center</h2><p className="section-sub">Budget, route, weather, and recommendation intelligence for {featuredTrip.name}</p></div>
              <Link to={`/trips/${featuredTrip.id}`} className="section-link">Open trip <ArrowRight size={15} /></Link>
            </div>
            <SmartInsights trip={featuredTrip} />
          </section>
        )}

        {/* Search */}
        <div className="search-wrap animate-in animate-in-delay-2">
          <div className="search-bar-v2">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search destinations, activities, or trips..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
            <button className="search-filter-btn"><SlidersHorizontal size={14} /> Filters</button>
          </div>
        </div>

        {featuredTrip && (
          <div className="dashboard-live-grid animate-in animate-in-delay-3">
            <div className="live-stat-card">
              <CloudSun size={18} />
              <span>Weather routing</span>
              <strong>{featuredTrip.weatherScore || 84}% safe</strong>
            </div>
            <div className="live-stat-card">
              <Route size={18} />
              <span>Route optimization</span>
              <strong>{featuredTrip.optimizationScore || 80}% efficient</strong>
            </div>
            <div className="live-stat-card">
              <Sparkles size={18} />
              <span>AI usage</span>
              <strong>+18% this week</strong>
            </div>
          </div>
        )}

        {/* Recommended Destinations */}
        <section className="section animate-in animate-in-delay-3">
          <div className="section-header">
            <div><h2>Recommended Destinations</h2><p className="section-sub">Popular places our travelers love</p></div>
            <Link to="/cities" className="section-link">View all <ArrowRight size={15} /></Link>
          </div>
          <div className="region-scroll">
            {regions.map((region, i) => (
              <Link 
                to="/cities" 
                key={region.id} 
                className={`region-card-v2 animate-in animate-in-delay-${Math.min(i + 4, 8)}`}
                style={{ 
                  backgroundImage: `linear-gradient(rgba(28,25,23,0.3), rgba(28,25,23,0.6)), url(${getCityImageUrl(region.name, 300, 400)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '200px'
                }}
              >
                <div className="region-label"><span className="region-name-v2" style={{ color: 'white' }}>{region.name}</span><ArrowUpRight size={13} className="region-arrow" style={{ color: 'white' }} /></div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Trips */}
        <section className="section animate-in animate-in-delay-5">
          <div className="section-header">
            <div><h2>Recent Trips</h2><p className="section-sub">Continue where you left off</p></div>
            <Link to="/trips" className="section-link">View all <ArrowRight size={15} /></Link>
          </div>
          <div className="trips-grid-v2">
            {searchedTrips.map((trip, i) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className={`trip-card-v2 ${i === 0 ? 'trip-featured' : ''} animate-in animate-in-delay-${Math.min(i + 5, 8)}`}>
                <div 
                  className="trip-visual"
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(28,25,23,0.2), rgba(28,25,23,0.5)), url(${getCityImageUrl(trip.cities?.[0], 400, 300)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="trip-badge" style={{ background: statusColors[trip.status].bg, color: statusColors[trip.status].text }}>{trip.status}</div>
                </div>
                <div className="trip-content">
                  <h3 className="trip-title-v2">{trip.name}</h3>
                  <div className="trip-details">
                    <span className="trip-detail"><MapPin size={12} /> {trip.cities.slice(0, 2).join(', ')}{trip.cities.length > 2 ? ` +${trip.cities.length - 2}` : ''}</span>
                    <span className="trip-detail"><Calendar size={12} /> {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="trip-travelers">
                    {trip.travelers.slice(0, 3).map((t, ti) => (<div key={ti} className="traveler-dot" style={{ zIndex: 3 - ti, marginLeft: ti > 0 ? '-6px' : 0 }}>{t[0]}</div>))}
                    {trip.travelers.length > 3 && <span className="traveler-more">+{trip.travelers.length - 3}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {featuredTrip && (
          <section className="section animate-in animate-in-delay-6">
            <div className="section-header">
              <div><h2>Real-Time Trip Signals</h2><p className="section-sub">Weather and travel alerts that feed the AI optimizer</p></div>
            </div>
            <WeatherPanel trip={featuredTrip} />
          </section>
        )}

        <Link to="/trips/new" className="fab-v2"><Plus size={20} strokeWidth={2.5} /></Link>
      </div>
    </div>
  );
}
