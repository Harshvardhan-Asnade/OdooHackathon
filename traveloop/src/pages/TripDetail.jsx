import { Link, useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, FileText, Package, StickyNote, Share2, BarChart3, Edit3, Sparkles, CloudSun, Route } from 'lucide-react';
import CollaborationPanel from '../components/CollaborationPanel';
import InteractiveMap from '../components/InteractiveMap';
import SmartInsights from '../components/SmartInsights';
import WeatherPanel from '../components/WeatherPanel';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Pages.css';

export default function TripDetail() {
  const { id } = useParams();
  const { getTripById, itineraries } = useTravelPlanner();
  const trip = getTripById(id);
  const itinerary = itineraries[trip.id] || { sections: [] };
  const remaining = trip.totalBudget - trip.totalSpent;

  return (
    <div className="page-content">
      <div className="container">
        <div className="trip-detail-header animate-in">
          <div className="trip-detail-cover" style={{ background: 'linear-gradient(135deg, rgba(191,91,59,0.12), rgba(191,91,59,0.04))' }}>
            <span style={{ fontSize: 72 }}>{trip.coverEmoji}</span>
          </div>
          <div className="trip-detail-info">
            <div className="trip-status status-upcoming">{trip.status}</div>
            <h1>{trip.name}</h1>
            <div className="trip-detail-meta">
              <span><MapPin size={15} /> {trip.cities.join(' → ')}</span>
              <span><Calendar size={15} /> {trip.startDate} — {trip.endDate}</span>
              <span><Users size={15} /> {trip.travelers.join(', ')}</span>
              <span><DollarSign size={15} /> Budget: ${trip.totalBudget.toLocaleString()} · Spent: ${trip.totalSpent.toLocaleString()} · {remaining >= 0 ? `Remaining: $${remaining.toLocaleString()}` : `Over: $${Math.abs(remaining).toLocaleString()}`}</span>
            </div>
            <p className="trip-description">{trip.description}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <Link to={`/trips/${trip.id}/itinerary/build`} className="btn btn-sm btn-primary"><Edit3 size={14} /> <span>Edit Trip</span></Link>
              <Link to={`/trips/${trip.id}/share`} className="btn btn-sm btn-secondary"><Share2 size={14} /> Share</Link>
            </div>
          </div>
        </div>

        <div className="trip-actions animate-in animate-in-delay-1">
          <Link to={`/trips/${trip.id}/itinerary`} className="action-card"><Calendar size={20} /><span>View Itinerary</span></Link>
          <Link to={`/trips/${trip.id}/budget`} className="action-card"><BarChart3 size={20} /><span>Budget</span></Link>
          <Link to={`/trips/${trip.id}/checklist`} className="action-card"><Package size={20} /><span>Packing List</span></Link>
          <Link to={`/trips/${trip.id}/notes`} className="action-card"><StickyNote size={20} /><span>Trip Notes</span></Link>
          <Link to={`/trips/${trip.id}/invoice`} className="action-card"><FileText size={20} /><span>Invoice</span></Link>
          <Link to={`/trips/${trip.id}/share`} className="action-card"><Share2 size={20} /><span>Share Trip</span></Link>
        </div>

        <div className="section animate-in animate-in-delay-2">
          <div className="section-header">
            <div><h2><Sparkles size={22} /> Smart Trip Intelligence</h2><p className="section-sub">AI fit, route, budget, and weather risk in one operational view</p></div>
          </div>
          <SmartInsights trip={trip} />
        </div>

        <div className="section animate-in animate-in-delay-2">
          <div className="section-header">
            <div><h2><Route size={22} /> Interactive Route Map</h2><p className="section-sub">Drag stops, optimize route order, and review nearby hotels and attractions</p></div>
          </div>
          <InteractiveMap trip={trip} />
        </div>

        <div className="section animate-in animate-in-delay-3">
          <div className="section-header">
            <div><h2><CloudSun size={22} /> Real-Time Travel Context</h2><p className="section-sub">Weather-aware suggestions and live route alerts</p></div>
          </div>
          <WeatherPanel trip={trip} />
        </div>

        <div className="section animate-in animate-in-delay-4">
          <h2>Itinerary Overview</h2>
          <div className="itinerary-overview">
            {itinerary.sections.map((section, i) => (
              <div key={section.id} className={`overview-card animate-in animate-in-delay-${i + 1}`}>
                <div className="overview-number">{i + 1}</div>
                <div className="overview-content">
                  <h4>{section.title}</h4>
                  <p>{section.description}</p>
                  <div className="overview-meta">
                    <span><Calendar size={13} /> {section.dateRange}</span>
                    <span><DollarSign size={13} /> ${section.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section animate-in animate-in-delay-5">
          <div className="section-header">
            <div><h2>Collaborative Planning</h2><p className="section-sub">Shared editing, live activity, and expense splitting</p></div>
          </div>
          <CollaborationPanel trip={trip} />
        </div>
      </div>
    </div>
  );
}
