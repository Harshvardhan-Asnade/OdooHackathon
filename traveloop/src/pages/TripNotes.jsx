import { useState } from 'react';
import { Plus, Edit2, Trash2, StickyNote, Sparkles, Camera, Loader } from 'lucide-react';
import { tripNotes } from '../data/mockData';
import './Pages.css';

const aiExtractedNotes = [
  { id: 'ai-n1', title: 'Receipt: Trattoria da Enzo', content: 'AI detected a restaurant receipt. Carbonara €12, House wine €8, Tiramisu €7. Total: €27 (~$30). Added to Food & Dining budget.', day: 3, date: 'Jun 19', isAI: true },
  { id: 'ai-n2', title: 'Ticket: Colosseum Entry', content: 'AI detected a museum ticket. Colosseum + Roman Forum + Palatine Hill combo ticket. €16 per person. Valid for 24 hours. Booking ref: COL-2025-8847.', day: 4, date: 'Jun 20', isAI: true },
];

export default function TripNotes() {
  const [filter, setFilter] = useState('all');
  const [notes, setNotes] = useState([...tripNotes.t1]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handlePhotoScan = () => {
    setScanning(true);
    setTimeout(() => {
      setNotes(prev => [...aiExtractedNotes, ...prev]);
      setScanning(false);
      setScanned(true);
    }, 2500);
  };

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <div>
            <h1>Trip Notes</h1>
            <p>Trip: Paris & Rome Adventure</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn" onClick={handlePhotoScan} disabled={scanning || scanned} style={{ background: 'linear-gradient(135deg, var(--gold), #E8B451)', color: 'var(--charcoal)', border: 'none', fontWeight: 700 }}>
              {scanning ? <><Loader size={14} className="spin-slow" /> Scanning...</> : scanned ? <><Sparkles size={14} /> Scanned!</> : <><Camera size={14} /> AI Photo Scan</>}
            </button>
            <button className="btn btn-primary"><Plus size={16} /> Add Note</button>
          </div>
        </div>

        {scanned && (
          <div className="budget-alert animate-in" style={{ backgroundColor: 'rgba(198,152,60,0.1)', borderColor: 'var(--gold)', color: 'var(--charcoal)', marginBottom: 'var(--space-xl)' }}>
            <Sparkles size={20} color="var(--gold)" />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>2 Items Extracted from Photos!</strong>
              <p style={{ margin: 0 }}>AI detected a restaurant receipt (€27 added to budget) and a Colosseum ticket (€16). Notes created automatically.</p>
            </div>
          </div>
        )}

        <div className="filter-chips animate-in animate-in-delay-1">
          {['All', 'by Day', 'by Stop', 'AI Notes'].map(f => (
            <button key={f} className={`chip ${filter === f.toLowerCase() ? 'active' : ''}`} onClick={() => setFilter(f.toLowerCase())}>{f}</button>
          ))}
        </div>

        <div className="notes-list">
          {notes
            .filter(n => filter === 'ai notes' ? n.isAI : true)
            .map((note, i) => (
            <div key={note.id} className={`card note-card animate-in animate-in-delay-${Math.min(i+2,6)}`} style={note.isAI ? { borderLeftColor: 'var(--gold)' } : {}}>
              <div className="note-header">
                <h4>
                  {note.isAI && <Sparkles size={14} color="var(--gold)" style={{ marginRight: 6 }} />}
                  <StickyNote size={16} /> {note.title}
                </h4>
                <div className="note-actions">
                  {note.isAI && <span style={{ fontSize: '9px', background: 'rgba(198,152,60,0.15)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, color: '#8A6D2A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Generated</span>}
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
