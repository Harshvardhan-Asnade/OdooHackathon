import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, FileText, Package, StickyNote } from 'lucide-react';
import { trips, itineraries } from '../data/mockData';
import './Pages.css';

export default function TripDetail() {
  const trip = trips[0];
  const itinerary = itineraries.t1;

  return (
    <div className="page-content">
      <div className="container">
        <div className="trip-detail-header animate-in">
          <div className="trip-detail-cover" style={{ background: 'linear-gradient(135deg, #C2654A22, #C2654A08)' }}>
            <span style={{ fontSize: 72 }}>{trip.coverEmoji}</span>
          </div>
          <div className="trip-detail-info">
            <span className={`trip-status status-${trip.status}`}>{trip.status}</span>
            <h1>{trip.name}</h1>
            <div className="trip-detail-meta">
              <span><MapPin size={15} /> {trip.cities.join(' → ')}</span>
              <span><Calendar size={15} /> {trip.startDate} — {trip.endDate}</span>
              <span><Users size={15} /> {trip.travelers.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="trip-actions animate-in animate-in-delay-1">
          <Link to="/trips/t1/itinerary" className="action-card">
            <Calendar size={20} />
            <span>View Itinerary</span>
          </Link>
          <Link to="/trips/t1/checklist" className="action-card">
            <Package size={20} />
            <span>Packing List</span>
          </Link>
          <Link to="/trips/t1/notes" className="action-card">
            <StickyNote size={20} />
            <span>Trip Notes</span>
          </Link>
          <Link to="/trips/t1/invoice" className="action-card">
            <FileText size={20} />
            <span>Invoice</span>
          </Link>
        </div>

        <div className="section animate-in animate-in-delay-2">
          <h2>Itinerary Overview</h2>
          <div className="itinerary-overview">
            {itinerary.sections.map((section, i) => (
              <div key={section.id} className={`overview-card animate-in animate-in-delay-${i+1}`}>
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
