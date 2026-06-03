import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OrderSuccess({ orderId, navigate }) {
  const { orders } = useApp();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <main className="confirm">
        <div className="confirm-inner">
          <h1>Order not found</h1>
          <button type="button" className="btn-primary" onClick={() => navigate('/plans')}>
            Browse Plans
          </button>
        </div>
      </main>
    );
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <main className="confirm success-page">
      <div className="confirm-inner">
        <div className="verify success">
          <CheckCircle2 size={48} />
        </div>
        <h1>Order confirmed!</h1>
        <p>
          Order <strong>{order.id}</strong> — {itemCount} {itemCount === 1 ? 'meal' : 'meals'} for $
          {order.total.toFixed(2)}.
        </p>
        <div className="checkout-items">
          {order.items.map((item) => (
            <article className="card checkout-line" key={item.key}>
              <h3>{item.name}</h3>
              <p className="muted">
                Pick up {item.day} · {item.cookName} · Qty {item.qty}
              </p>
            </article>
          ))}
        </div>
        <div className="actions stacked">
          <button type="button" className="btn-primary" onClick={() => navigate('/subscriptions')}>
            <ShoppingBag size={18} /> View My Orders
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/plans')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}
