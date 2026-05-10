import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, FileText, Package, StickyNote, Share2, BarChart3, Edit3 } from 'lucide-react';
import { trips, itineraries } from '../data/mockData';
import './Pages.css';

export default function TripDetail() {
  const trip = trips[0];
  const itinerary = itineraries.t1;
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
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <Link to="/trips/t1/itinerary/build" className="btn btn-sm btn-primary"><Edit3 size={14} /> <span>Edit Trip</span></Link>
              <Link to="/trips/t1/share" className="btn btn-sm btn-secondary"><Share2 size={14} /> Share</Link>
            </div>
          </div>
        </div>

        <div className="trip-actions animate-in animate-in-delay-1">
          <Link to="/trips/t1/itinerary" className="action-card"><Calendar size={20} /><span>View Itinerary</span></Link>
          <Link to="/trips/t1/budget" className="action-card"><BarChart3 size={20} /><span>Budget</span></Link>
          <Link to="/trips/t1/checklist" className="action-card"><Package size={20} /><span>Packing List</span></Link>
          <Link to="/trips/t1/notes" className="action-card"><StickyNote size={20} /><span>Trip Notes</span></Link>
          <Link to="/trips/t1/invoice" className="action-card"><FileText size={20} /><span>Invoice</span></Link>
          <Link to="/trips/t1/share" className="action-card"><Share2 size={20} /><span>Share Trip</span></Link>
        </div>

        <div className="section animate-in animate-in-delay-2">
          <h2>Route Map</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: 350 }}>
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(trip.cities.join(' to '))}&t=&z=5&ie=UTF8&iwloc=&output=embed`}
              title="Google Map Route"
            ></iframe>
          </div>
        </div>

        <div className="section animate-in animate-in-delay-3">
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
      </div>
    </div>
  );
}
