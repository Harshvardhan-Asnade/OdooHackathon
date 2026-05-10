import { useState } from 'react';
import { Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import './Pages.css';

export default function BuildItinerary() {
  const [sections, setSections] = useState([
    { id: 1, title: 'Section 1', description: 'All the necessary information about this section.\nThis can be anything like travel section, hotel or any other activity', dateFrom: '2025-06-12', dateTo: '2025-06-16', budget: '5000' },
    { id: 2, title: 'Section 2', description: 'All the necessary information about this section.\nThis can be anything like travel section, hotel or any other activity', dateFrom: '2025-06-17', dateTo: '2025-06-21', budget: '6000' },
    { id: 3, title: 'Section 3', description: 'All the necessary information about this section.\nThis can be anything like travel section, hotel or any other activity', dateFrom: '2025-06-22', dateTo: '2025-06-25', budget: '4500' },
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: `Section ${sections.length + 1}`, description: '', dateFrom: '', dateTo: '', budget: '' }]);
  };

  const removeSection = (id) => setSections(sections.filter(s => s.id !== id));

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Build Your Itinerary</h1>
          <p>Organize your trip into sections</p>
        </div>

        <div className="itinerary-sections">
          {sections.map((section, i) => (
            <div key={section.id} className={`card itinerary-section animate-in animate-in-delay-${Math.min(i + 1, 6)}`}>
              <div className="card-header">
                <h3>{section.title}</h3>
                <button className="btn-icon danger" onClick={() => removeSection(section.id)}><Trash2 size={16} /></button>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <textarea className="form-input form-textarea" rows={3} defaultValue={section.description} placeholder="Describe this part of your trip..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><Calendar size={14} /> Date Range</label>
                    <div className="date-range">
                      <input type="date" className="form-input" defaultValue={section.dateFrom} />
                      <span className="date-sep">to</span>
                      <input type="date" className="form-input" defaultValue={section.dateTo} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><DollarSign size={14} /> Budget</label>
                    <input className="form-input" type="number" defaultValue={section.budget} placeholder="Budget for this section" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-outline btn-full add-section-btn animate-in" onClick={addSection}>
          <Plus size={18} /> Add Another Section
        </button>

        <button className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-lg)' }}>
          Save Itinerary
        </button>
      </div>
    </div>
  );
}
