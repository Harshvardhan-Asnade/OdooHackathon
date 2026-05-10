import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, Calendar, DollarSign, GripVertical, Loader, MapPin, Plus, Sparkles, Trash2 } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import { destinationCatalog } from '../data/mockData';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { generateItineraryPlan } from '../lib/gemini';
import { createDayWiseItinerary } from '../lib/plannerEngine';
import './Pages.css';

const cityOptions = destinationCatalog.map((destination) => ({
  name: destination.name,
  country: destination.country,
  emoji: destination.emoji,
}));

function makeInitialSections(trip, itinerary) {
  if (itinerary?.sections?.length) {
    return itinerary.sections.map((section, index) => {
      const city = trip.cities[index] || trip.cities[0] || section.title;
      const destination = destinationCatalog.find((item) => item.name === city);
      return {
        id: section.id || `${trip.id}-${index}`,
        city,
        country: destination?.country || '',
        emoji: destination?.emoji || trip.coverEmoji,
        title: section.title,
        description: section.description,
        dateFrom: trip.startDate,
        dateTo: trip.endDate,
        budget: String(section.budget || Math.round(trip.totalBudget / Math.max(trip.cities.length, 1))),
        activities: section.days?.flatMap((day) => day.activities.map((activity) => activity.name)) || [],
        dayPlan: section.days || [],
      };
    });
  }

  return trip.cities.map((city, index) => {
    const destination = destinationCatalog.find((item) => item.name === city);
    return {
      id: `${trip.id}-${city}-${index}`,
      city,
      country: destination?.country || '',
      emoji: destination?.emoji || trip.coverEmoji,
      title: `${city} Focus`,
      description: `Plan the best ${city} days around distance, budget, weather, and interests.`,
      dateFrom: trip.startDate,
      dateTo: trip.endDate,
      budget: String(Math.round(trip.totalBudget / Math.max(trip.cities.length, 1))),
      activities: [],
      dayPlan: [],
    };
  });
}

function sectionsToItinerary(sections) {
  return {
    sections: sections.map((section, index) => ({
      id: String(section.id),
      title: section.title,
      description: section.description,
      dateRange: `${section.dateFrom || 'TBD'} - ${section.dateTo || 'TBD'}`,
      budget: Number(section.budget || 0),
      days: section.dayPlan.length
        ? section.dayPlan
        : [{
            day: index + 1,
            city: section.city,
            activities: section.activities.map((activity, activityIndex) => ({
              time: `${String(9 + activityIndex * 2).padStart(2, '0')}:00`,
              name: activity,
              expense: activityIndex === 0 ? 0 : 35,
            })),
          }],
    })),
  };
}

export default function BuildItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAI = searchParams.get('ai') === 'true';
  const generatedRef = useRef(false);
  const { getTripById, itineraries, profile, updateItinerary, updateTrip } = useTravelPlanner();
  const trip = getTripById(id);
  const [sections, setSections] = useState(() => makeInitialSections(trip, itineraries[trip.id]));
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState([]);

  const totalBudget = sections.reduce((sum, section) => sum + (Number(section.budget) || 0), 0);
  const routeTrip = useMemo(() => ({ ...trip, cities: sections.map((section) => section.city) }), [sections, trip]);

  useEffect(() => {
    if (!isAI || generatedRef.current) return;
    generatedRef.current = true;
    handleAIGenerate();
    // The auto-generation should run once for the initial AI route load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAI]);

  const filteredCities = cityOptions.filter((city) =>
    !sections.find((section) => section.city === city.name)
    && (!citySearch || city.name.toLowerCase().includes(citySearch.toLowerCase()))
  );

  function updateSection(sectionId, patch) {
    setSections((current) => current.map((section) => (
      section.id === sectionId ? { ...section, ...patch } : section
    )));
  }

  function addStop(city) {
    setSections((current) => [...current, {
      id: Date.now(),
      city: city.name,
      country: city.country,
      emoji: city.emoji,
      title: `${city.name} Stop`,
      description: '',
      dateFrom: '',
      dateTo: '',
      budget: '',
      activities: [],
      dayPlan: [],
    }]);
    setShowCityPicker(false);
    setCitySearch('');
  }

  function removeSection(sectionId) {
    setSections((current) => current.filter((section) => section.id !== sectionId));
  }

  function moveSection(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const next = [...sections];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setSections(next);
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...sections];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setSections(next);
    setDragIndex(null);
  }

  function addActivity(sectionId) {
    const name = prompt('Enter activity name:');
    if (!name) return;
    setSections((current) => current.map((section) => (
      section.id === sectionId
        ? { ...section, activities: [...section.activities, name], dayPlan: [] }
        : section
    )));
  }

  function removeActivity(sectionId, activityIndex) {
    setSections((current) => current.map((section) => (
      section.id === sectionId
        ? { ...section, activities: section.activities.filter((_, index) => index !== activityIndex), dayPlan: [] }
        : section
    )));
  }

  async function handleAIGenerate() {
    setAiLoading(true);
    const result = await generateItineraryPlan({
      trip: routeTrip,
      profile,
      constraints: { optimizeFor: ['distance', 'budget', 'weather', 'travel time'] },
    });

    const grouped = new Map();
    const days = result.days?.length ? result.days : createDayWiseItinerary(routeTrip, profile);
    days.forEach((day) => {
      const current = grouped.get(day.city) || {
        id: `${routeTrip.id}-${day.city}`,
        city: day.city,
        country: destinationCatalog.find((destination) => destination.name === day.city)?.country || '',
        emoji: destinationCatalog.find((destination) => destination.name === day.city)?.emoji || routeTrip.coverEmoji,
        title: `${day.city} Smart Plan`,
        description: `${day.focus || 'Discovery'} days optimized for ${profile.travelStyle}.`,
        dateFrom: day.date,
        dateTo: day.date,
        budget: 0,
        activities: [],
        dayPlan: [],
      };
      current.dateTo = day.date;
      current.budget += Number(day.budget || 0);
      current.activities.push(...day.activities.map((activity) => activity.name));
      current.dayPlan.push(day);
      grouped.set(day.city, current);
    });

    setSections([...grouped.values()].map((section) => ({ ...section, budget: String(section.budget) })));
    setAiNotes(result.optimizationNotes || ['Route order, budget, weather, and travel windows were optimized.']);
    setAiLoading(false);
  }

  function handleSave() {
    const cities = sections.map((section) => section.city);
    updateTrip(trip.id, {
      cities,
      totalBudget,
      optimizationScore: 94,
      aiScore: Math.max(trip.aiScore || 88, 92),
    });
    updateItinerary(trip.id, sectionsToItinerary(sections));
    navigate(`/trips/${trip.id}`);
  }

  function handleRouteChange(stops) {
    const orderedNames = stops.map((stop) => stop.name);
    setSections((current) => orderedNames
      .map((city) => current.find((section) => section.city === city))
      .filter(Boolean));
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>Build Your Itinerary</h1>
            <p>Add stops, assign dates, drag route order, and generate day-wise AI plans</p>
          </div>
          <div className="itinerary-total">
            <span className="itinerary-total-label">Total Budget</span>
            <span className="itinerary-total-value">${totalBudget.toLocaleString()}</span>
          </div>
        </div>

        <div className="itinerary-builder-layout">
          <div>
            {(isAI || aiNotes.length > 0) && (
              <div className="budget-alert animate-in" style={{ backgroundColor: 'rgba(198,152,60,0.1)', borderColor: 'var(--gold)', color: 'var(--charcoal)', marginBottom: 'var(--space-2xl)' }}>
                <Sparkles size={24} color="var(--gold)" />
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>AI itinerary engine active</strong>
                  <p style={{ margin: 0 }}>{aiNotes[0] || 'Generate a custom itinerary based on your interests, budget, weather, and travel time.'}</p>
                </div>
              </div>
            )}

            <div className="route-overview animate-in animate-in-delay-1">
              {sections.map((section, index) => (
                <span key={section.id} className="route-stop">
                  <span className="route-emoji">{section.emoji}</span> {section.city}
                  {index < sections.length - 1 && <span className="route-arrow">→</span>}
                </span>
              ))}
            </div>

            <div className="itinerary-sections">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`card itinerary-section animate-in animate-in-delay-${Math.min(index + 1, 6)}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="card-header">
                    <div className="section-city-header">
                      <GripVertical size={16} className="drag-handle" />
                      <span className="section-emoji">{section.emoji}</span>
                      <div>
                        <h3>{section.title}</h3>
                        <span className="section-city-info"><MapPin size={12} /> {section.city}, {section.country}</span>
                      </div>
                    </div>
                    <div className="section-actions">
                      <button className="btn-icon" onClick={() => moveSection(index, -1)} disabled={index === 0} title="Move up"><ArrowUp size={14} /></button>
                      <button className="btn-icon" onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} title="Move down"><ArrowDown size={14} /></button>
                      <button className="btn-icon danger" onClick={() => removeSection(section.id)} title="Remove"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-input form-textarea" rows={2} value={section.description} onChange={(event) => updateSection(section.id, { description: event.target.value })} placeholder="Describe this part of your trip..." />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label><Calendar size={14} /> Travel Dates</label>
                        <div className="date-range">
                          <input type="date" className="form-input" value={section.dateFrom || ''} onChange={(event) => updateSection(section.id, { dateFrom: event.target.value })} />
                          <span className="date-sep">to</span>
                          <input type="date" className="form-input" value={section.dateTo || ''} onChange={(event) => updateSection(section.id, { dateTo: event.target.value })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label><DollarSign size={14} /> Budget</label>
                        <input className="form-input" type="number" value={section.budget} onChange={(event) => updateSection(section.id, { budget: event.target.value })} placeholder="$0" />
                      </div>
                    </div>

                    <div className="stop-activities">
                      <div className="stop-activities-header">
                        <label>Activities</label>
                        <button className="btn btn-sm btn-ghost" onClick={() => addActivity(section.id)}><Plus size={13} /> Add</button>
                      </div>
                      {section.activities.length > 0 ? (
                        <div className="activity-chips">
                          {section.activities.map((activity, activityIndex) => (
                            <span key={`${activity}-${activityIndex}`} className="activity-chip">
                              {activity}
                              <button className="chip-remove" onClick={() => removeActivity(section.id, activityIndex)}>×</button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-activities">No activities yet. Generate with AI or add manually.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showCityPicker ? (
              <div className="card city-picker animate-in">
                <h4>Select a City</h4>
                <input className="form-input" placeholder="Search cities..." value={citySearch} onChange={(event) => setCitySearch(event.target.value)} autoFocus style={{ marginBottom: 'var(--space-lg)' }} />
                <div className="city-picker-list">
                  {filteredCities.map((city) => (
                    <button key={city.name} className="city-picker-item" onClick={() => addStop(city)}>
                      <span>{city.emoji}</span> {city.name}, {city.country}
                    </button>
                  ))}
                  {filteredCities.length === 0 && <p className="no-activities">No cities available</p>}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowCityPicker(false)} style={{ marginTop: 'var(--space-md)' }}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-outline btn-full add-section-btn animate-in" onClick={() => setShowCityPicker(true)}>
                <Plus size={18} /> Add a Stop
              </button>
            )}
          </div>

          <aside className="itinerary-builder-aside">
            <button className="btn btn-primary btn-full" onClick={handleAIGenerate} disabled={aiLoading}>
              {aiLoading ? <><Loader size={15} className="spin-slow" /> Generating...</> : <><Sparkles size={15} /> Generate Day-wise AI Plan</>}
            </button>
            <InteractiveMap key={routeTrip.cities.join('|')} trip={routeTrip} onRouteChange={handleRouteChange} />
          </aside>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-2xl)' }}>
          <button className="btn btn-primary btn-full" onClick={handleSave}>Save Itinerary</button>
          <Link to={`/trips/${trip.id}`} className="btn btn-secondary btn-full">Preview Trip</Link>
        </div>
      </div>
    </div>
  );
}
