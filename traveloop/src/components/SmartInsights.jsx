import { BrainCircuit, Clock, MapPinned, PiggyBank, Sparkles } from 'lucide-react';
import { buildSmartTripSummary } from '../lib/plannerEngine';
import { useTravelPlanner } from '../context/useTravelPlanner';

export default function SmartInsights({ trip }) {
  const { profile } = useTravelPlanner();
  const summary = buildSmartTripSummary(profile, trip);

  const insightCards = [
    {
      label: 'AI fit',
      value: `${trip.aiScore || 88}%`,
      icon: BrainCircuit,
      text: 'Personalized to interests, previous trips, and budget style.',
    },
    {
      label: 'Budget estimate',
      value: `$${summary.budget.total.toLocaleString()}`,
      icon: PiggyBank,
      text: `$${summary.budget.dailyBase}/day baseline before shared expenses.`,
    },
    {
      label: 'Route saved',
      value: `${summary.routeSavingsKm.toLocaleString()} km`,
      icon: MapPinned,
      text: 'Potential savings if the optimized order is applied.',
    },
    {
      label: 'Weather risk',
      value: summary.weatherRisk,
      icon: Clock,
      text: 'Outdoor plans shift around heat, rain, and transfer windows.',
    },
  ];

  return (
    <div className="smart-insights">
      {insightCards.map((card) => (
        <div key={card.label} className="smart-insight-card">
          <div className="smart-insight-icon"><card.icon size={17} /></div>
          <span className="mini-label">{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.text}</p>
        </div>
      ))}

      <div className="smart-rec-card">
        <div className="smart-rec-header">
          <Sparkles size={17} />
          <div>
            <span className="mini-label">Top recommendations</span>
            <strong>AI-ranked for this route</strong>
          </div>
        </div>
        {summary.topRecommendations.map((item) => (
          <div key={item.id} className="smart-rec-row">
            <span>{item.fitScore}%</span>
            <div>
              <strong>{item.name}</strong>
              <p>{item.city} · {item.type} · {item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
