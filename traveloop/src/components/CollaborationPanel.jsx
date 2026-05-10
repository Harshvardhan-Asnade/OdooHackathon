import { useMemo, useState } from 'react';
import { CheckCircle2, CircleDollarSign, Copy, Link2, MessageSquare, Send, Users } from 'lucide-react';
import { collaborators, expenseSplits } from '../data/mockData';

export default function CollaborationPanel({ trip }) {
  const [invite, setInvite] = useState('');
  const [activity, setActivity] = useState([
    `${trip?.lastEditedBy || 'Cristina'} updated the itinerary sequence`,
    'AI moved outdoor Rome activities before the heat window',
    'Arjun added two hotel shortlist notes',
  ]);

  const balances = useMemo(() => {
    const totals = {};
    expenseSplits.forEach((expense) => {
      const share = expense.amount / expense.splitWith.length;
      expense.splitWith.forEach((person) => {
        totals[person] = (totals[person] || 0) - share;
      });
      totals[expense.paidBy] = (totals[expense.paidBy] || 0) + expense.amount;
    });
    return Object.entries(totals).map(([name, amount]) => ({ name, amount: Math.round(amount) }));
  }, []);

  function sendInvite(event) {
    event.preventDefault();
    if (!invite.trim()) return;
    setActivity((current) => [`Invite sent to ${invite.trim()}`, ...current]);
    setInvite('');
  }

  return (
    <div className="collab-grid">
      <div className="card collab-card">
        <div className="card-header compact">
          <div>
            <span className="mini-label">Shared editing</span>
            <h4><Users size={17} /> Collaborators</h4>
          </div>
          <button className="btn btn-sm btn-secondary"><Copy size={13} /> Copy link</button>
        </div>
        <div className="collaborator-list">
          {collaborators.map((member) => (
            <div key={member.id} className="collaborator-row">
              <div className="collaborator-avatar" style={{ background: member.color }}>{member.name[0]}</div>
              <div>
                <strong>{member.name}</strong>
                <span>{member.role} · {member.editing}</span>
              </div>
              <span className={`presence ${member.status}`}>{member.status}</span>
            </div>
          ))}
        </div>
        <form className="invite-form" onSubmit={sendInvite}>
          <Link2 size={14} />
          <input value={invite} onChange={(event) => setInvite(event.target.value)} placeholder="Invite by email" />
          <button type="submit"><Send size={14} /></button>
        </form>
      </div>

      <div className="card collab-card">
        <div className="card-header compact">
          <div>
            <span className="mini-label">Expense splitting</span>
            <h4><CircleDollarSign size={17} /> Balances</h4>
          </div>
        </div>
        <div className="balance-list">
          {balances.map((balance) => (
            <div key={balance.name} className="balance-row">
              <span>{balance.name}</span>
              <strong className={balance.amount >= 0 ? 'positive' : 'negative'}>
                {balance.amount >= 0 ? '+' : '-'}${Math.abs(balance.amount).toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
        <div className="expense-list">
          {expenseSplits.map((expense) => (
            <div key={expense.id} className="expense-row">
              <CheckCircle2 size={14} />
              <div>
                <strong>{expense.title}</strong>
                <span>{expense.paidBy} paid ${expense.amount.toLocaleString()} · {expense.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card collab-card activity-feed-card">
        <div className="card-header compact">
          <div>
            <span className="mini-label">Live activity</span>
            <h4><MessageSquare size={17} /> Planning feed</h4>
          </div>
        </div>
        <div className="activity-feed">
          {activity.map((item, index) => (
            <div key={`${item}-${index}`} className="activity-feed-item">
              <span />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
