import { useState } from 'react';
import { adminData, aiUsageStats } from '../data/mockData';
import { Activity, Bot, DollarSign, Map, Route, TrendingUp, Users } from 'lucide-react';
import { useTravelPlanner } from '../context/useTravelPlanner';
import './Pages.css';

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const { trips } = useTravelPlanner();
  const tabs = [
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'cities', label: 'Popular Cities', icon: Map },
    { id: 'activities', label: 'Popular Activities', icon: Activity },
    { id: 'analytics', label: 'Trends & Analytics', icon: TrendingUp },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header animate-in"><h1>Admin Panel</h1></div>
        <div className="admin-kpi-grid animate-in">
          <div className="admin-kpi"><Users size={18} /><span>Active users</span><strong>{adminData.totalUsers.toLocaleString()}</strong></div>
          <div className="admin-kpi"><Map size={18} /><span>Trips planned</span><strong>{adminData.totalTrips.toLocaleString()}</strong></div>
          <div className="admin-kpi"><DollarSign size={18} /><span>Avg budget</span><strong>${Math.round(trips.reduce((sum, trip) => sum + trip.totalBudget, 0) / trips.length).toLocaleString()}</strong></div>
          <div className="admin-kpi"><Bot size={18} /><span>AI actions</span><strong>{(aiUsageStats.itineraryGenerations + aiUsageStats.chatbotQuestions).toLocaleString()}</strong></div>
        </div>
        <div className="admin-tabs animate-in animate-in-delay-1">
          {tabs.map(t => (
            <button key={t.id} className={`admin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
        <div className="admin-content animate-in animate-in-delay-2">
          {tab === 'users' && (
            <div className="admin-stats">
              <div className="stat-card"><div className="stat-value">{adminData.totalUsers.toLocaleString()}</div><div className="stat-label">Total Users</div></div>
              <div className="stat-card"><div className="stat-value">{adminData.totalTrips.toLocaleString()}</div><div className="stat-label">Total Trips</div></div>
            </div>
          )}
          {tab === 'cities' && (
            <div className="admin-list">
              {adminData.popularCities.map((c,i) => (
                <div key={i} className="admin-list-item">
                  <span className="admin-rank">#{i+1}</span><span className="admin-name">{c.name}</span>
                  <div className="admin-bar-wrap"><div className="admin-bar" style={{width:`${(c.trips/900)*100}%`}}/></div>
                  <span className="admin-count">{c.trips} trips</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'activities' && (
            <div className="admin-list">
              {adminData.popularActivities.map((a,i) => (
                <div key={i} className="admin-list-item">
                  <span className="admin-rank">#{i+1}</span><span className="admin-name">{a.name}</span>
                  <div className="admin-bar-wrap"><div className="admin-bar teal" style={{width:`${(a.count/2500)*100}%`}}/></div>
                  <span className="admin-count">{a.count}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'analytics' && (
            <div className="analytics-dashboard">
              <div className="chart-container">
                <h3>Monthly Growth</h3>
                <div className="simple-chart">
                  {adminData.monthlyTrends.map((m,i) => (
                    <div key={i} className="chart-col">
                      <div className="chart-bar" style={{height:`${(m.trips/1000)*100}%`}} />
                      <span>{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-container">
                <h3>AI Feature Engagement</h3>
                <div className="engagement-list">
                  {aiUsageStats.engagement.map((item) => (
                    <div key={item.label} className="engagement-row">
                      <span>{item.label}</span>
                      <div className="admin-bar-wrap"><div className="admin-bar teal" style={{ width: `${item.value}%` }} /></div>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="admin-insight-grid">
                <div className="admin-insight"><Route size={18} /><span>Route optimizations</span><strong>{aiUsageStats.routeOptimizations.toLocaleString()}</strong></div>
                <div className="admin-insight"><DollarSign size={18} /><span>Avg AI savings</span><strong>${aiUsageStats.avgSavings}</strong></div>
                <div className="admin-insight"><TrendingUp size={18} /><span>Conversion</span><strong>{aiUsageStats.conversionRate}%</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
