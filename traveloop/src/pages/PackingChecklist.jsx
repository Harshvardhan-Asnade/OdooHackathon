import { useState } from 'react';
import { Check, Plus, RotateCcw, Share, ChevronDown } from 'lucide-react';
import { packingLists } from '../data/mockData';
import './Pages.css';

export default function PackingChecklist() {
  const [data, setData] = useState(JSON.parse(JSON.stringify(packingLists.t1)));

  const toggleItem = (catIdx, itemIdx) => {
    const newData = { ...data, categories: data.categories.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      items: cat.items.map((item, ii) => ii !== itemIdx ? item : { ...item, checked: !item.checked })
    })};
    setData(newData);
  };

  const totalItems = data.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedItems = data.categories.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0);
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Packing Checklist</h1>
          <p>Trip: Paris & Rome Adventure</p>
        </div>

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
