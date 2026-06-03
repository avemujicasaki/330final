import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Success({ subscriptionId, navigate }) {
  const { subscriptions } = useApp();
  const sub = subscriptions.find((s) => s.id === subscriptionId);

  if (!sub) {
    return (
      <main className="confirm">
        <div className="confirm-inner">
          <h1>Subscription not found</h1>
          <button type="button" className="primary" onClick={() => navigate('/subscriptions')}>
            View My Subscriptions
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="confirm success-page">
      <div className="confirm-inner">
        <div className="verify success">
          <CheckCircle2 size={48} />
        </div>
        <h1>You&apos;re all set!</h1>
        <p>Subscription <strong>{sub.id}</strong> is active. Pick up at {sub.location} on {sub.pickupDays} around {sub.pickupTime}.</p>
        <div className="summary-grid">
          <article className="card">
            <h2>{sub.planName}</h2>
            <p>with {sub.cookName}</p>
            <p>
              <strong>${Number(sub.price).toFixed(2)}</strong> / week
            </p>
          </article>
        </div>
        <div className="actions stacked">
          <button type="button" className="primary" onClick={() => navigate('/subscriptions')}>
            Manage Subscription
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/plans')}>
            Browse More Plans
          </button>
        </div>
      </div>
    </main>
  );
}
