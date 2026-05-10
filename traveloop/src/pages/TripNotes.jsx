import { useState } from 'react';
import { Plus, Edit2, Trash2, StickyNote } from 'lucide-react';
import { tripNotes } from '../data/mockData';
import './Pages.css';

export default function TripNotes() {
  const [filter, setFilter] = useState('all');
  const notes = tripNotes.t1;

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <div>
            <h1>Trip Notes</h1>
            <p>Trip: Paris & Rome Adventure</p>
          </div>
          <button className="btn btn-primary"><Plus size={16} /> Add Note</button>
        </div>

        <div className="filter-chips animate-in animate-in-delay-1">
          {['All', 'by Day', 'by Stop'].map(f => (
            <button key={f} className={`chip ${filter === f.toLowerCase() ? 'active' : ''}`} onClick={() => setFilter(f.toLowerCase())}>{f}</button>
          ))}
        </div>

        <div className="notes-list">
          {notes.map((note, i) => (
            <div key={note.id} className={`card note-card animate-in animate-in-delay-${Math.min(i+2,6)}`}>
              <div className="note-header">
                <h4><StickyNote size={16} /> {note.title}</h4>
                <div className="note-actions">
                  <button className="btn-icon"><Edit2 size={15} /></button>
                  <button className="btn-icon danger"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="note-content">{note.content}</p>
              <span className="note-meta">Day {note.day} · {note.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
