import { itineraries } from '../data/mockData';
import { Clock, DollarSign } from 'lucide-react';
import './Pages.css';

export default function ItineraryView() {
  const data = itineraries.t1;

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Itinerary — Paris & Rome Adventure</h1>
          <p>Day-by-day activities and expenses</p>
        </div>

        {data.sections.map((section) =>
          section.days.map((day) => (
            <div key={`${section.id}-${day.day}`} className="card day-card animate-in">
              <div className="day-badge">Day {day.day}</div>
              <h4 className="day-section-name">{section.title}</h4>
              <div className="day-activities">
                {day.activities.map((act, i) => (
                  <div key={i} className="activity-row">
                    <div className="activity-time"><Clock size={13} /> {act.time}</div>
                    <div className="activity-name">{act.name}</div>
                    <div className="activity-expense">
                      {act.expense > 0 ? <><DollarSign size={13} /> {act.expense.toLocaleString()}</> : <span className="free-tag">Free</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="day-total">
                Day Total: <strong>${day.activities.reduce((sum, a) => sum + a.expense, 0).toLocaleString()}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
