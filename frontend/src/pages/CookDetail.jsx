import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, Plus, Star } from 'lucide-react';
import MealImage from '../components/MealImage';
import OrderModal from '../components/OrderModal';
import { getCookById, getPlanById, plans } from '../data';
import { useApp } from '../context/AppContext';

const COOK_PLAN_MAP = { priya: 'thai', mark: 'muscle', yuki: 'bento' };

export default function CookDetail({ cookId, navigate }) {
  const { pendingPlan, selectPlan } = useApp();
  const cook = getCookById(cookId);
  const [orderItem, setOrderItem] = useState(null);

  if (!cook) {
    return (
      <main className="container page">
        <h1>Cook not found</h1>
        <button type="button" className="primary" onClick={() => navigate('/plans')}>
          Browse Plans
        </button>
      </main>
    );
  }

  const defaultPlanId = COOK_PLAN_MAP[cookId];
  const plan =
    pendingPlan?.cookId === cookId
      ? pendingPlan
      : getPlanById(defaultPlanId) || plans.find((p) => p.cookId === cookId);

  const handleReserve = () => {
    if (plan) selectPlan(plan.id);
    else if (defaultPlanId) selectPlan(defaultPlanId);
    navigate('/confirm');
  };

  return (
    <main className="container page">
      <section className="cook-top">
        <article className="bio-card">
          <img src={cook.image} alt={cook.name} />
          <div>
            <div className="row">
              <div>
                <h1>{cook.name}</h1>
                <b className="eyebrow">{cook.title}</b>
              </div>
              <span className="pill">
                <Star size={16} />
                {cook.rating} ({cook.reviews} reviews)
              </span>
            </div>
            <p>{cook.bio}</p>
            <div className="tags">
              {cook.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </article>
        <aside className="schedule">
          <h2>Pickup Schedule</h2>
          <p>
            <Clock /> {cook.schedule}
          </p>
          <p>
            <MapPin /> {cook.location}
          </p>
          {plan && (
            <p className="plan-highlight">
              Selected: <strong>{plan.name}</strong> — ${plan.price}/week
            </p>
          )}
          <button type="button" className="btn-reserve" onClick={handleReserve}>
            <CalendarDays size={20} /> Reserve Weekly Plan
          </button>
        </aside>
      </section>
      <section>
        <h2>Menu for the Week</h2>
        <p>Freshly prepared daily with love.</p>
        <div className="plan-grid">
          {cook.menu.map((m) => {
            const Icon = m.icon;
            return (
              <article className="meal-card" key={m.id}>
                <div className="img-wrap">
                  <MealImage src={m.image} alt={m.name} />
                  <span className="rating">${m.price.toFixed(2)}</span>
                </div>
                <div className="meal-body">
                  <div className="row">
                    <h3>{m.name}</h3>
                    <Icon className="orange" />
                  </div>
                  <p>{m.desc}</p>
                  <div className="meal-footer">
                    <span className="day-badge">{m.day}</span>
                    <button type="button" className="btn-order" onClick={() => setOrderItem(m)}>
                      <Plus size={18} /> Order
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section>
        <h2>Reviews</h2>
        <div className="review-grid">
          {cook.reviews_list.map((r) => (
            <blockquote key={r.author}>
              &ldquo;{r.text}&rdquo;
              <b> — {r.author}</b>
            </blockquote>
          ))}
        </div>
      </section>
      {orderItem && <OrderModal item={orderItem} cook={cook} onClose={() => setOrderItem(null)} />}
    </main>
  );
}
