import { useParams } from 'react-router-dom';
import { Clock, DollarSign, Sparkles } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import WeatherPanel from '../components/WeatherPanel';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { createDayWiseItinerary } from '../lib/plannerEngine';
import './Pages.css';

export default function ItineraryView() {
  const { id } = useParams();
  const { getTripById, itineraries, profile } = useTravelPlanner();
  const trip = getTripById(id);
  const data = itineraries[trip.id] || { sections: [] };
  const generatedDays = createDayWiseItinerary(trip, profile);
  const hasSavedDays = data.sections.some((section) => section.days?.length);

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>Itinerary — {trip.name}</h1>
            <p>Day-by-day activities, expenses, weather, and route context</p>
          </div>
        </div>

        <div className="itinerary-view-grid">
          <InteractiveMap trip={trip} />
          <WeatherPanel trip={trip} />
        </div>

        {!hasSavedDays && (
          <div className="budget-alert animate-in">
            <Sparkles size={18} />
            <div>
              <strong>Smart fallback itinerary</strong>
              <p>These days are generated from your profile until you save a custom itinerary.</p>
            </div>
          </div>
        )}

        {(hasSavedDays ? data.sections.flatMap((section) => section.days.map((day) => ({ ...day, sectionTitle: section.title }))) : generatedDays).map((day) => (
          <div key={`${day.city || day.sectionTitle}-${day.day}`} className="card day-card animate-in">
            <div className="day-badge">Day {day.day}</div>
            <h4 className="day-section-name">{day.sectionTitle || day.city} · {day.date || 'Flexible date'} · {day.focus || 'Discovery'}</h4>
            <div className="day-activities">
              {day.activities.map((act, i) => (
                <div key={i} className="activity-row">
                  <div className="activity-time"><Clock size={13} /> {act.time}</div>
                  <div className="activity-name">{act.name}</div>
                  <div className="activity-expense">
                    {(act.expense || 0) > 0 ? <><DollarSign size={13} /> {(act.expense || 0).toLocaleString()}</> : <span className="free-tag">Free</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="day-total">
              Day Total: <strong>${day.activities.reduce((sum, a) => sum + (a.expense || 0), 0).toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
