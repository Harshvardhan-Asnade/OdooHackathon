import { DollarSign, TrendingUp, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { trips, invoiceData } from '../data/mockData';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function TripBudget() {
  const trip = trips[0];
  const spent = trip.totalSpent;
  const budget = trip.totalBudget;
  const remaining = budget - spent;
  const isOver = remaining < 0;
  const pct = Math.min((spent / budget) * 100, 100);

  const categories = [
    { name: 'Hotels', amount: 9000, color: 'var(--terracotta)', pct: 39 },
    { name: 'Flights', amount: 12000, color: 'var(--teal)', pct: 52 },
    { name: 'Activities', amount: 420, color: 'var(--gold)', pct: 2 },
    { name: 'Food & Dining', amount: 1580, color: 'var(--sage)', pct: 7 },
  ];

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
          <Link to={`/trips/${trip.id}/invoice`} className="btn btn-secondary"><DollarSign size={14} /> View Invoice</Link>
        </div>

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
              ${Math.abs(remaining).toLocaleString()}
            </span>
          </div>
          <div className="budget-stat-card">
            <span className="budget-stat-label">Avg / Day</span>
            <span className="budget-stat-value">${Math.round(spent / 5).toLocaleString()}</span>
          </div>
        </div>

        {/* Over Budget Alert */}
        {isOver && (
          <div className="budget-alert animate-in animate-in-delay-2">
            <AlertTriangle size={18} />
            <div>
              <strong>Over budget by ${Math.abs(remaining).toLocaleString()}</strong>
              <p>Consider adjusting activities or accommodation to stay within your planned budget.</p>
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
          {/* Category Breakdown */}
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

          {/* Daily Cost */}
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
      </div>
    </div>
  );
}
