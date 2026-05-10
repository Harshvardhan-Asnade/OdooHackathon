import { AlertTriangle, CloudSun, Radio, Umbrella, Wind } from 'lucide-react';
import { getTravelUpdatesForTrip, getWeatherForTrip } from '../lib/plannerEngine';

export default function WeatherPanel({ trip }) {
  const weather = getWeatherForTrip(trip);
  const updates = getTravelUpdatesForTrip(trip);

  return (
    <div className="weather-grid">
      <div className="weather-main card">
        <div className="card-header compact">
          <div>
            <span className="mini-label">Live context</span>
            <h4><CloudSun size={17} /> Weather-aware plan</h4>
          </div>
          <span className="live-pill"><Radio size={12} /> Updating</span>
        </div>
        <div className="weather-cards">
          {weather.map((item) => (
            <div key={item.city} className={`weather-card risk-${item.risk.toLowerCase()}`}>
              <div className="weather-card-top">
                <strong>{item.city}</strong>
                <span>{item.date}</span>
              </div>
              <div className="weather-temp">{item.temp}</div>
              <p>{item.condition}</p>
              <div className="weather-tip">
                {item.risk === 'Medium' ? <Umbrella size={13} /> : <Wind size={13} />}
                {item.recommendation}
              </div>
            </div>
          ))}
          {weather.length === 0 && (
            <div className="weather-card">
              <strong>No weather data yet</strong>
              <p>Add known cities to receive planning recommendations.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card travel-alerts">
        <div className="card-header compact">
          <div>
            <span className="mini-label">Travel updates</span>
            <h4><AlertTriangle size={17} /> Alerts</h4>
          </div>
        </div>
        <div className="travel-alert-list">
          {updates.map((update) => (
            <div key={`${update.city}-${update.type}`} className={`travel-alert severity-${update.severity.toLowerCase()}`}>
              <span>{update.type}</span>
              <strong>{update.city}</strong>
              <p>{update.message}</p>
            </div>
          ))}
          {updates.length === 0 && <p className="muted-text">No active route alerts for this itinerary.</p>}
        </div>
      </div>
    </div>
  );
}
