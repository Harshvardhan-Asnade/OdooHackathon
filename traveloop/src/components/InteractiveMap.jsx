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

function buildMapPoints(stops) {
  if (!stops.length) return [];
  const lats = stops.map((stop) => stop.lat);
  const lngs = stops.map((stop) => stop.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = Math.max(maxLat - minLat, 1);
  const lngRange = Math.max(maxLng - minLng, 1);

  return stops.map((stop, index) => ({
    ...stop,
    x: 12 + ((stop.lng - minLng) / lngRange) * 76,
    y: 82 - ((stop.lat - minLat) / latRange) * 64,
    order: index + 1,
  }));
}

export default function InteractiveMap({ trip, onRouteChange }) {
  const { profile } = useTravelPlanner();
  const [stops, setStops] = useState(() => getTripDestinations(trip));
  const [selectedCity, setSelectedCity] = useState(stops[0]?.name || trip?.cities?.[0]);
  const [dragIndex, setDragIndex] = useState(null);

  const mapStops = useMemo(() => buildMapPoints(stops), [stops]);
  const routeSummary = useMemo(() => calculateRouteSummary(stops), [stops]);
  const recommendations = useMemo(
    () => getPersonalizedRecommendations(profile, { ...trip, cities: [selectedCity] }).slice(0, 4),
    [profile, selectedCity, trip],
  );

  const path = mapStops.map((stop) => `${stop.x},${stop.y}`).join(' ');

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
      <div className="smart-map-canvas">
        <svg viewBox="0 0 100 100" role="img" aria-label="Interactive route map">
          <defs>
            <linearGradient id="routeGlow" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--terracotta)" />
              <stop offset="55%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--teal)" />
            </linearGradient>
          </defs>
          <path className="map-grid-line" d="M8 25 C30 16 62 18 92 12" />
          <path className="map-grid-line" d="M4 62 C28 48 56 68 96 54" />
          <path className="map-grid-line" d="M20 8 C24 30 18 58 30 92" />
          <path className="map-grid-line" d="M68 4 C62 32 74 58 70 96" />
          <polyline className="route-line-shadow" points={path} />
          <polyline className="route-line" points={path} />
          {mapStops.map((stop) => (
            <g
              key={stop.id}
              className={`route-marker ${selectedCity === stop.name ? 'active' : ''}`}
              onClick={() => setSelectedCity(stop.name)}
            >
              <circle cx={stop.x} cy={stop.y} r="4.9" />
              <text x={stop.x} y={stop.y + 1.2} textAnchor="middle">{stop.order}</text>
            </g>
          ))}
        </svg>
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
