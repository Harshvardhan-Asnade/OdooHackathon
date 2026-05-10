import { useState } from 'react';
import { Check, Plus, RotateCcw, Share, Sparkles, Loader } from 'lucide-react';
import { packingLists } from '../data/mockData';
import './Pages.css';

const aiPackingItems = {
  'Weather-Smart': [
    { id: 'ai1', text: 'Lightweight rain jacket (Paris showers expected)', checked: false },
    { id: 'ai2', text: 'SPF 50 sunscreen (Rome will be 32°C)', checked: false },
    { id: 'ai3', text: 'Wide-brim sun hat', checked: false },
    { id: 'ai4', text: 'Breathable linen shirts (3x)', checked: false },
  ],
  'Activity-Based': [
    { id: 'ai5', text: 'Comfortable walking shoes (avg 18k steps/day)', checked: false },
    { id: 'ai6', text: 'Museum-friendly crossbody bag', checked: false },
    { id: 'ai7', text: 'Portable phone charger (long sightseeing days)', checked: false },
    { id: 'ai8', text: 'Blister band-aids', checked: false },
  ],
  'Destination Essentials': [
    { id: 'ai9', text: 'EU power adapter (Type C/F)', checked: false },
    { id: 'ai10', text: 'Offline maps downloaded (Google Maps)', checked: false },
    { id: 'ai11', text: 'Travel insurance printout', checked: false },
    { id: 'ai12', text: 'Photocopies of passport', checked: false },
  ],
};

export default function PackingChecklist() {
  const [data, setData] = useState(JSON.parse(JSON.stringify(packingLists.t1)));
  const [aiGenerated, setAiGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const toggleItem = (catIdx, itemIdx) => {
    const newData = { ...data, categories: data.categories.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      items: cat.items.map((item, ii) => ii !== itemIdx ? item : { ...item, checked: !item.checked })
    })};
    setData(newData);
  };

  const handleAIGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const aiCategories = Object.entries(aiPackingItems).map(([name, items]) => ({ name: `✨ ${name}`, items }));
      setData(prev => ({
        ...prev,
        categories: [...prev.categories, ...aiCategories]
      }));
      setAiGenerated(true);
      setGenerating(false);
    }, 2000);
  };

  const totalItems = data.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = data.categories.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0);
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <div>
            <h1>Packing Checklist</h1>
            <p>Trip: Paris & Rome Adventure</p>
          </div>
          {!aiGenerated && (
            <button className="btn ai-btn" onClick={handleAIGenerate} disabled={generating} style={{ background: 'linear-gradient(135deg, var(--gold), #E8B451)', color: 'var(--charcoal)', border: 'none', fontWeight: 700 }}>
              {generating ? <><Loader size={14} className="spin-slow" /> Analyzing trip...</> : <><Sparkles size={14} /> AI Smart Pack</>}
            </button>
          )}
        </div>

        {aiGenerated && (
          <div className="budget-alert animate-in" style={{ backgroundColor: 'rgba(198,152,60,0.1)', borderColor: 'var(--gold)', color: 'var(--charcoal)', marginBottom: 'var(--space-xl)' }}>
            <Sparkles size={20} color="var(--gold)" />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px' }}>AI Packing List Generated!</strong>
              <p style={{ margin: 0 }}>Based on Paris weather (22-26°C, rain possible), Rome heat (32°C), and your activities (18k+ steps/day of sightseeing), I've added {Object.values(aiPackingItems).flat().length} smart items.</p>
            </div>
          </div>
        )}

        <div className="card animate-in animate-in-delay-1">
          <div className="progress-section">
            <span className="progress-text">Progress: {checkedItems}/{totalItems} items packed</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {data.categories.map((cat, catIdx) => (
          <div key={cat.name} className={`card checklist-category animate-in animate-in-delay-${Math.min(catIdx + 2, 6)}`}>
            <div className="category-header">
              <h4>{cat.name}</h4>
              <span className="category-count">{cat.items.filter(i => i.checked).length}/{cat.items.length}</span>
            </div>
            <div className="checklist-items">
              {cat.items.map((item, itemIdx) => (
                <label key={item.id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
                  <div className={`checkbox ${item.checked ? 'checked' : ''}`} onClick={() => toggleItem(catIdx, itemIdx)}>
                    {item.checked && <Check size={14} />}
                  </div>
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="checklist-actions animate-in">
          <button className="btn btn-outline"><Plus size={16} /> Add Item</button>
          <button className="btn btn-ghost"><RotateCcw size={16} /> Reset All</button>
          <button className="btn btn-secondary"><Share size={16} /> Share</button>
        </div>
      </div>
    </div>
  );
}
