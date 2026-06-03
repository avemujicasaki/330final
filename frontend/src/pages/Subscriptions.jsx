import React from 'react';
import { useApp } from '../context/AppContext';

export default function Subscriptions({ navigate }) {
  const { subscriptions, orders, skipSubscription, cancelSubscription, user, showToast } = useApp();
  const active = subscriptions.filter((s) => s.status === 'active');
  const inactive = subscriptions.filter((s) => s.status !== 'active');
  const mealOrders = orders.filter((o) => o.status === 'confirmed');

  if (!user) {
    return (
      <main className="container page">
        <h1>My Orders</h1>
        <p>Log in to view your weekly subscriptions and meal orders.</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/login')}>
          Log in
        </button>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>My Orders</h1>

      <h2>Weekly subscriptions</h2>
      <p className="muted">Skip or cancel before Friday midnight for changes to apply next week.</p>
      {active.length === 0 ? (
        <div className="empty">
          No active subscriptions.{' '}
          <button type="button" className="link" onClick={() => navigate('/plans')}>
            Find a plan
          </button>
        </div>
      ) : (
        <div className="sub-list">
          {active.map((s) => (
            <article className="card sub-card" key={s.id}>
              <div className="row">
                <div>
                  <h3>{s.planName}</h3>
                  <p>with {s.cookName}</p>
                  <p className="muted">
                    {s.pickupDays} · {s.pickupTime} · {s.location}
                  </p>
                </div>
                <b className="price">
                  ${Number(s.price).toFixed(2)}
                  <small>/ week</small>
                </b>
              </div>
              <div className="sub-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => skipSubscription(s.id).catch((e) => showToast(e.message))}
                >
                  Skip Next Week
                </button>
                <button
                  type="button"
                  className="link danger"
                  onClick={() => cancelSubscription(s.id).catch((e) => showToast(e.message))}
                >
                  Cancel Subscription
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 48 }}>Meal orders</h2>
      <p className="muted">One-time cart checkouts. Pick up on the day shown for each item.</p>
      {mealOrders.length === 0 ? (
        <div className="empty">No meal orders yet.</div>
      ) : (
        <div className="sub-list">
          {mealOrders.map((order) => (
            <article className="card sub-card" key={order.id}>
              <div className="row">
                <div>
                  <h3>Order {order.id}</h3>
                  <p className="muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <ul className="order-items-list">
                    {order.items.map((item) => (
                      <li key={item.key}>
                        {item.name} × {item.qty} — {item.day} ({item.cookName})
                      </li>
                    ))}
                  </ul>
                </div>
                <b className="price">${Number(order.total).toFixed(2)}</b>
              </div>
            </article>
          ))}
        </div>
      )}

      {inactive.length > 0 && (
        <>
          <h2 style={{ marginTop: 48 }}>Past subscriptions</h2>
          <div className="sub-list">
            {inactive.map((s) => (
              <article className="card sub-card muted-card" key={s.id}>
                <h3>{s.planName}</h3>
                <p>
                  Status: <strong>{s.status}</strong>
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
