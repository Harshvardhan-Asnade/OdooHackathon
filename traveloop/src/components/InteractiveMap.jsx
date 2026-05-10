import { useMemo, useState } from 'react';
import { ArrowRight, GripVertical, Hotel, MapPin, Navigation, Route, Sparkles, Star } from 'lucide-react';
import { destinationCatalog } from '../data/mockData';
import {
  calculateRouteSummary,
  getPersonalizedRecommendations,
  getTripDestinations,
  optimizeRoute,
} from '../lib/plannerEngine';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function InteractiveMap({ trip, onRouteChange }) {
  const { profile } = useTravelPlanner();
  const [stops, setStops] = useState(() => getTripDestinations(trip));
  const [selectedCity, setSelectedCity] = useState(stops[0]?.name || trip?.cities?.[0]);
  const [dragIndex, setDragIndex] = useState(null);

  const routeSummary = useMemo(() => calculateRouteSummary(stops), [stops]);
  const recommendations = useMemo(
    () => getPersonalizedRecommendations(profile, { ...trip, cities: [selectedCity] }).slice(0, 4),
    [profile, selectedCity, trip],
  );

  const nearby = recommendations.length ? recommendations : destinationCatalog
    .filter((destination) => destination.name !== selectedCity)
    .slice(0, 4)
    .map((destination) => ({
      id: destination.id,
      type: 'Attraction',
      city: destination.name,
      name: destination.description,
      rating: destination.rating,
      price: destination.avgDailyBudget,
      distanceKm: Math.max(Math.round(destination.popularity / 240), 1),
      reason: `Strong ${destination.tags.slice(0, 2).join(' + ')} match.`,
    }));

  function applyOptimizedRoute() {
    const optimized = optimizeRoute(stops);
    setStops(optimized);
    onRouteChange?.(optimized);
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...stops];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setStops(next);
    setDragIndex(null);
    onRouteChange?.(next);
  }

  // Compute bounds for the Leaflet map
  const bounds = useMemo(() => {
    if (!stops.length) return null;
    const lats = stops.map(s => s.lat);
    const lngs = stops.map(s => s.lng);
    return [
      [Math.min(...lats) - 1, Math.min(...lngs) - 1],
      [Math.max(...lats) + 1, Math.max(...lngs) + 1]
    ];
  }, [stops]);

  const polylinePositions = stops.map(s => [s.lat, s.lng]);

  if (!stops.length) {
    return (
      <div className="smart-map empty-map">
        <MapPin size={18} />
        Add destinations to unlock route visualization.
      </div>
    );
  }

  return (
    <div className="smart-map">
      <div className="smart-map-canvas" style={{ zIndex: 0 }}>
        {bounds && (
          <MapContainer bounds={bounds} style={{ height: '100%', minHeight: '420px', width: '100%', borderRadius: 'var(--radius-xl)' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <Polyline positions={polylinePositions} color="var(--terracotta)" weight={3} dashArray="5, 10" />
            {stops.map((stop, index) => (
              <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                <Popup>
                  <strong>{stop.name}</strong><br/>
                  Stop {index + 1}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        <div className="map-floating-panel">
          <div>
            <span className="mini-label">Route distance</span>
            <strong>{routeSummary.distanceKm.toLocaleString()} km</strong>
          </div>
          <div>
            <span className="mini-label">Travel time</span>
            <strong>{routeSummary.travelHours.toFixed(1)} hr</strong>
          </div>
          <div>
            <span className="mini-label">Efficiency</span>
            <strong>{routeSummary.efficiencyScore}%</strong>
          </div>
        </div>
      </div>

      <div className="smart-map-side">
        <div className="map-side-header">
          <div>
            <span className="mini-label">Drag to reorder</span>
            <h4>Route Builder</h4>
          </div>
          <button className="btn btn-sm btn-primary" onClick={applyOptimizedRoute}>
            <Sparkles size={13} /> Optimize
          </button>
        </div>

        <div className="route-stop-list">
          {stops.map((stop, index) => (
            <div
              key={stop.id}
              className={`route-stop-card ${selectedCity === stop.name ? 'active' : ''}`}
              draggable
              onClick={() => setSelectedCity(stop.name)}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              <GripVertical size={15} />
              <span className="route-stop-badge">{index + 1}</span>
              <div>
                <strong>{stop.name}</strong>
                <span>{stop.country} · {stop.costIndex}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="route-segments">
          {routeSummary.segments.map((segment) => (
            <div key={`${segment.from}-${segment.to}`} className="route-segment">
              <span>{segment.from}</span>
              <ArrowRight size={12} />
              <span>{segment.to}</span>
              <strong>{segment.duration}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="nearby-panel">
        <div className="map-side-header">
          <div>
            <span className="mini-label">Nearby places</span>
            <h4>{selectedCity}</h4>
          </div>
          <Navigation size={18} />
        </div>
        <div className="nearby-list">
          {nearby.map((item) => (
            <div key={item.id} className="nearby-item">
              <div className="nearby-icon">
                {item.type === 'Hotel' ? <Hotel size={14} /> : <Route size={14} />}
              </div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.type} · {item.distanceKm} km · ${item.price}</span>
                <p>{item.reason}</p>
              </div>
              <span className="nearby-rating"><Star size={11} fill="currentColor" /> {item.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
