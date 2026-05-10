import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, Copy, Share2, Globe, Users } from 'lucide-react';
import CollaborationPanel from '../components/CollaborationPanel';
import InteractiveMap from '../components/InteractiveMap';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Pages.css';

export default function SharedItinerary() {
  const { id } = useParams();
  const { getTripById, itineraries } = useTravelPlanner();
  const trip = getTripById(id);
  if (!trip) return <div>Trip not found</div>;
  const data = itineraries[trip.id] || { sections: [] };

  const handleCopy = () => alert('Trip copied to your account!');
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: trip.name, text: `Check out my trip: ${trip.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="page-content">
      <div className="container container-narrow">
        {/* Public banner */}
        <div className="shared-banner animate-in">
          <Globe size={16} />
          <span>Collaborative itinerary · Shared access: {trip.sharedAccess}</span>
        </div>

        {/* Trip Header */}
        <div className="shared-header animate-in animate-in-delay-1">
          <span className="shared-emoji">{trip.coverEmoji}</span>
          <h1>{trip.name}</h1>
          <div className="shared-meta">
            <span><MapPin size={14} /> {trip.cities.join(' → ')}</span>
            <span><Calendar size={14} /> {trip.startDate} — {trip.endDate}</span>
            <span><DollarSign size={14} /> Budget: ${trip.totalBudget.toLocaleString()}</span>
            <span><Users size={14} /> {trip.travelers.length} travelers</span>
          </div>
          <p className="shared-by">Created by <strong>{trip.createdBy}</strong> · {trip.travelers.length} travelers</p>
          <div className="shared-actions">
            <button className="btn btn-primary" onClick={handleCopy}><Copy size={14} /> <span>Copy This Trip</span></button>
            <button className="btn btn-secondary" onClick={handleShare}><Share2 size={14} /> Share</button>
          </div>
        </div>

        <div className="section animate-in animate-in-delay-2">
          <InteractiveMap trip={trip} />
        </div>

        {/* Read-only Itinerary */}
        <div className="shared-itinerary">
          {data.sections.map((section, si) => (
            <div key={section.id} className={`shared-section animate-in animate-in-delay-${Math.min(si + 2, 8)}`}>
              <div className="shared-section-header">
                <div className="shared-section-num">{si + 1}</div>
                <div>
                  <h3>{section.title}</h3>
                  <span className="shared-section-dates"><Calendar size={12} /> {section.dateRange}</span>
                </div>
                <span className="shared-section-budget"><DollarSign size={13} /> ${section.budget.toLocaleString()}</span>
              </div>
              <p className="shared-section-desc">{section.description}</p>

              {section.days && section.days.length > 0 && (
                <div className="shared-days">
                  {section.days.map(day => (
                    <div key={day.day} className="shared-day">
                      <div className="shared-day-badge">Day {day.day}</div>
                      <div className="shared-activities">
                        {day.activities.map((act, ai) => (
                          <div key={ai} className="shared-activity">
                            <span className="shared-time"><Clock size={11} /> {act.time}</span>
                            <span className="shared-act-name">{act.name}</span>
                            <span className="shared-act-cost">
                              {act.expense > 0 ? `$${act.expense.toLocaleString()}` : <span className="free-tag">Free</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="shared-cta animate-in">
          <p>Love this itinerary? Make it yours!</p>
          <button className="btn btn-primary" onClick={handleCopy}><Copy size={14} /> <span>Copy Trip to My Account</span></button>
        </div>

        <CollaborationPanel trip={trip} />
      </div>
    </div>
  );
}
