import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DollarSign, TrendingUp, AlertTriangle, PieChart, BarChart3, Sparkles, Loader, Check } from 'lucide-react';
import CollaborationPanel from '../components/CollaborationPanel';
import { useTravelPlanner } from '../context/useTravelPlanner';
import { estimateTripBudget } from '../lib/plannerEngine';
import './Pages.css';

export default function TripBudget() {
  const { id } = useParams();
  const { getTripById } = useTravelPlanner();
  const trip = getTripById(id);
  const estimated = estimateTripBudget(trip);
  const spent = trip.totalSpent;
  const budget = trip.totalBudget || estimated.total;
  const remaining = budget - spent;
  const isOver = remaining < 0;
  const pct = Math.min((spent / budget) * 100, 100);

  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(estimated.suggestions.map((suggestion) => ({ ...suggestion, accepted: false })));

  const handleAIAnalyze = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowAI(true); }, 2000);
  };

  const acceptSuggestion = (id) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, accepted: !s.accepted } : s));
  };

  const totalSavings = suggestions.filter(s => s.accepted).reduce((sum, s) => sum + s.savings, 0);

  const categories = estimated.categories;

  const dailyBudget = [
    { day: 'Day 1', amount: 3800, limit: 4000 },
    { day: 'Day 2', amount: 870, limit: 4000 },
    { day: 'Day 3', amount: 4000, limit: 4000 },
    { day: 'Day 4', amount: 950, limit: 4000 },
    { day: 'Day 5', amount: 5200, limit: 4000, over: true },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in">
          <div>
            <h1>Trip Budget</h1>
            <p>{trip.name} · {trip.cities.length} cities</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            {!showAI && (
              <button className="btn" onClick={handleAIAnalyze} disabled={loading} style={{ background: 'linear-gradient(135deg, var(--gold), #E8B451)', color: 'var(--charcoal)', border: 'none', fontWeight: 700 }}>
                {loading ? <><Loader size={14} className="spin-slow" /> Analyzing...</> : <><Sparkles size={14} /> AI Budget Savior</>}
              </button>
            )}
            <Link to={`/trips/${trip.id}/invoice`} className="btn btn-secondary"><DollarSign size={14} /> View Invoice</Link>
          </div>
        </div>

        {/* AI Budget Savior Panel */}
        {showAI && (
          <div className="card animate-in" style={{ borderLeft: '3px solid var(--gold)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <Sparkles size={20} color="var(--gold)" />
              <div>
                <h4 style={{ margin: 0 }}>AI Budget Savior</h4>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--warm-gray)' }}>Smart suggestions to optimize your spending</span>
              </div>
              {totalSavings > 0 && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--sage)' }}>
                  Save ${totalSavings}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {suggestions.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', background: s.accepted ? 'rgba(94,140,98,0.06)' : 'rgba(28,25,23,0.02)', borderRadius: 'var(--radius-md)', border: `1px solid ${s.accepted ? 'rgba(94,140,98,0.2)' : 'rgba(28,25,23,0.04)'}`, transition: 'all 0.2s' }}>
                  <button onClick={() => acceptSuggestion(s.id)} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: s.accepted ? 'var(--sage)' : 'transparent', border: s.accepted ? 'none' : '2px solid rgba(28,25,23,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
                    {s.accepted && <Check size={14} />}
                  </button>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', textDecoration: s.accepted ? 'line-through' : 'none', color: s.accepted ? 'var(--warm-gray)' : 'var(--charcoal)' }}>{s.text}</span>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--sage)', whiteSpace: 'nowrap' }}>-${s.savings}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Summary Cards */}
        <div className="budget-summary animate-in animate-in-delay-1">
          <div className="budget-stat-card">
            <span className="budget-stat-label">Total Budget</span>
            <span className="budget-stat-value">${budget.toLocaleString()}</span>
          </div>
          <div className="budget-stat-card">
            <span className="budget-stat-label">Total Spent</span>
            <span className="budget-stat-value spent">${spent.toLocaleString()}</span>
          </div>
          <div className={`budget-stat-card ${isOver ? 'over' : ''}`}>
            <span className="budget-stat-label">{isOver ? 'Over Budget' : 'Remaining'}</span>
            <span className={`budget-stat-value ${isOver ? 'danger' : 'success'}`}>
              {isOver && <AlertTriangle size={16} />}
              ${Math.abs(remaining - totalSavings).toLocaleString()}
              {totalSavings > 0 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--sage)' }}> (AI saved ${totalSavings})</span>}
            </span>
          </div>
          <div className="budget-stat-card">
            <span className="budget-stat-label">Avg / Day</span>
            <span className="budget-stat-value">${estimated.dailyBase.toLocaleString()}</span>
          </div>
        </div>

        <div className="card animate-in animate-in-delay-2">
          <h4><TrendingUp size={16} /> Automatic Estimate</h4>
          <div className="estimate-strip">
            <span>AI estimated trip cost</span>
            <strong>${estimated.total.toLocaleString()}</strong>
            <span>{trip.travelers.length} travelers · {trip.cities.length} cities · {trip.budgetTier}</span>
          </div>
        </div>

        {/* Over Budget Alert */}
        {isOver && !showAI && (
          <div className="budget-alert animate-in animate-in-delay-2">
            <AlertTriangle size={18} />
            <div>
              <strong>Over budget by ${Math.abs(remaining).toLocaleString()}</strong>
              <p>Click "AI Budget Savior" above to get smart suggestions for cutting costs without sacrificing experiences.</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="card animate-in animate-in-delay-2">
          <h4 style={{ marginBottom: 'var(--space-lg)' }}>Budget Usage</h4>
          <div className="budget-progress">
            <div className="budget-progress-bar">
              <div className={`budget-progress-fill ${isOver ? 'over' : ''}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className="budget-progress-pct">{Math.round((spent/budget)*100)}%</span>
          </div>
        </div>

        <div className="budget-grid">
          <div className="card animate-in animate-in-delay-3">
            <h4><PieChart size={16} /> Spending by Category</h4>
            <div className="category-breakdown">
              {categories.map((cat, i) => (
                <div key={i} className="category-row">
                  <div className="category-color" style={{ background: cat.color }} />
                  <span className="category-name">{cat.name}</span>
                  <div className="category-bar-wrap">
                    <div className="category-bar" style={{ width: `${cat.pct}%`, background: cat.color }} />
                  </div>
                  <span className="category-amount">${cat.amount.toLocaleString()}</span>
                  <span className="category-pct">{cat.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card animate-in animate-in-delay-4">
            <h4><BarChart3 size={16} /> Daily Spending</h4>
            <div className="daily-chart">
              {dailyBudget.map((d, i) => (
                <div key={i} className="daily-col">
                  <div className="daily-bar-container">
                    <div className="daily-limit-line" style={{ bottom: `${(d.limit / 6000) * 100}%` }} />
                    <div className={`daily-bar ${d.over ? 'over' : ''}`} style={{ height: `${(d.amount / 6000) * 100}%` }}>
                      <span className="daily-amount">${d.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="daily-label">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="daily-legend">
              <span className="legend-item"><span className="legend-line" /> Daily limit ($4,000)</span>
            </div>
          </div>
        </div>

        <div className="section animate-in animate-in-delay-5">
          <div className="section-header">
            <div><h2>Shared Budget Controls</h2><p className="section-sub">Split expenses and settle balances with collaborators</p></div>
          </div>
          <CollaborationPanel trip={trip} />
        </div>
      </div>
    </div>
  );
}
