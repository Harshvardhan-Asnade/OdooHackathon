import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, DollarSign, GripVertical, MapPin, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import './Pages.css';

const cityOptions = [
  { name: 'Paris', country: 'France', emoji: '🗼' },
  { name: 'Rome', country: 'Italy', emoji: '🏛️' },
  { name: 'Tokyo', country: 'Japan', emoji: '⛩️' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴' },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️' },
  { name: 'New York', country: 'USA', emoji: '🗽' },
  { name: 'Bangkok', country: 'Thailand', emoji: '🛕' },
  { name: 'Florence', country: 'Italy', emoji: '🎨' },
  { name: 'Venice', country: 'Italy', emoji: '🚣' },
  { name: 'Kyoto', country: 'Japan', emoji: '🏯' },
];

export default function BuildItinerary() {
  const [searchParams] = useSearchParams();
  const isAI = searchParams.get('ai') === 'true';

  const [sections, setSections] = useState([
    { id: 1, city: 'Paris', country: 'France', emoji: '🗼', title: 'Paris Exploration', description: 'Arrive in Paris, explore the city of lights. Visit the Eiffel Tower, Louvre Museum, and enjoy authentic French cuisine.', dateFrom: '2025-06-12', dateTo: '2025-06-16', budget: '5000', activities: ['Eiffel Tower visit', 'Louvre Museum', 'Seine River Cruise'] },
    { id: 2, city: 'Rome', country: 'Italy', emoji: '🏛️', title: 'Rome Discovery', description: 'Travel to Rome and immerse yourself in ancient history. Colosseum, Vatican, and the best pasta in the world.', dateFrom: '2025-06-17', dateTo: '2025-06-21', budget: '6000', activities: ['Colosseum Tour', 'Vatican Museums', 'Roman Forum'] },
    { id: 3, city: 'Florence', country: 'Italy', emoji: '🎨', title: 'Florence & Venice', description: 'Art, architecture and gondola rides. Experience the Renaissance in Florence and romantic Venice.', dateFrom: '2025-06-22', dateTo: '2025-06-25', budget: '4500', activities: ['Uffizi Gallery', 'Gondola Ride'] },
  ]);

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const addStop = (city) => {
    setSections([...sections, {
      id: Date.now(), city: city.name, country: city.country, emoji: city.emoji,
      title: `${city.name} Stop`, description: '', dateFrom: '', dateTo: '', budget: '', activities: []
    }]);
    setShowCityPicker(false);
    setCitySearch('');
  };

  const removeSection = (id) => setSections(sections.filter(s => s.id !== id));

  const moveSection = (index, dir) => {
    const newIdx = index + dir;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const newSections = [...sections];
    [newSections[index], newSections[newIdx]] = [newSections[newIdx], newSections[index]];
    setSections(newSections);
  };

  const addActivity = (sectionId) => {
    const name = prompt('Enter activity name:');
    if (!name) return;
    setSections(sections.map(s => s.id === sectionId ? { ...s, activities: [...s.activities, name] } : s));
  };

  const removeActivity = (sectionId, actIdx) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, activities: s.activities.filter((_, i) => i !== actIdx) } : s));
  };

  const filteredCities = cityOptions.filter(c =>
    !sections.find(s => s.city === c.name) &&
    (!citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const totalBudget = sections.reduce((s, sec) => s + (parseInt(sec.budget) || 0), 0);

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <div>
            <h1>Build Your Itinerary</h1>
            <p>Add stops, assign dates & activities, reorder your route</p>
          </div>
          <div className="itinerary-total">
            <span className="itinerary-total-label">Total Budget</span>
            <span className="itinerary-total-value">${totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {isAI && (
          <div className="budget-alert animate-in" style={{ backgroundColor: 'rgba(198,152,60,0.1)', borderColor: 'var(--gold)', color: 'var(--charcoal)', marginBottom: 'var(--space-2xl)' }}>
            <Sparkles size={24} color="var(--gold)" />
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>AI-Generated Itinerary Ready!</strong>
              <p style={{ margin: 0 }}>We've created a custom itinerary based on your preferences. Feel free to tweak the days, change the route, or add new activities.</p>
            </div>
          </div>
        )}

        {/* Route overview */}
        <div className="route-overview animate-in animate-in-delay-1">
          {sections.map((s, i) => (
            <span key={s.id} className="route-stop">
              <span className="route-emoji">{s.emoji}</span> {s.city}
              {i < sections.length - 1 && <span className="route-arrow">→</span>}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="itinerary-sections">
          {sections.map((section, i) => (
            <div key={section.id} className={`card itinerary-section animate-in animate-in-delay-${Math.min(i + 1, 6)}`}>
              <div className="card-header">
                <div className="section-city-header">
                  <span className="section-emoji">{section.emoji}</span>
                  <div>
                    <h3>{section.title}</h3>
                    <span className="section-city-info"><MapPin size={12} /> {section.city}, {section.country}</span>
                  </div>
                </div>
                <div className="section-actions">
                  <button className="btn-icon" onClick={() => moveSection(i, -1)} disabled={i === 0} title="Move up"><ArrowUp size={14} /></button>
                  <button className="btn-icon" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} title="Move down"><ArrowDown size={14} /></button>
                  <button className="btn-icon danger" onClick={() => removeSection(section.id)} title="Remove"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input form-textarea" rows={2} defaultValue={section.description} placeholder="Describe this part of your trip..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><Calendar size={14} /> Travel Dates</label>
                    <div className="date-range">
                      <input type="date" className="form-input" defaultValue={section.dateFrom} />
                      <span className="date-sep">to</span>
                      <input type="date" className="form-input" defaultValue={section.dateTo} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><DollarSign size={14} /> Budget</label>
                    <input className="form-input" type="number" defaultValue={section.budget} placeholder="$0" />
                  </div>
                </div>

                {/* Activities per stop */}
                <div className="stop-activities">
                  <div className="stop-activities-header">
                    <label>Activities</label>
                    <button className="btn btn-sm btn-ghost" onClick={() => addActivity(section.id)}><Plus size={13} /> Add</button>
                  </div>
                  {section.activities.length > 0 ? (
                    <div className="activity-chips">
                      {section.activities.map((act, ai) => (
                        <span key={ai} className="activity-chip">
                          {act}
                          <button className="chip-remove" onClick={() => removeActivity(section.id, ai)}>×</button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-activities">No activities yet — add some!</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Stop */}
        {showCityPicker ? (
          <div className="card city-picker animate-in">
            <h4>Select a City</h4>
            <input className="form-input" placeholder="Search cities..." value={citySearch} onChange={e => setCitySearch(e.target.value)} autoFocus style={{ marginBottom: 'var(--space-lg)' }} />
            <div className="city-picker-list">
              {filteredCities.map(c => (
                <button key={c.name} className="city-picker-item" onClick={() => addStop(c)}>
                  <span>{c.emoji}</span> {c.name}, {c.country}
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

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-2xl)' }}>
          <button className="btn btn-primary btn-full">Save Itinerary</button>
          <Link to="/trips/t1" className="btn btn-secondary btn-full">Preview Trip</Link>
        </div>
      </div>
    </div>
  );
}
