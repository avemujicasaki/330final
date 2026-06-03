import React, { useMemo, useState } from 'react';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import MealImage from '../components/MealImage';
import { FILTER_OPTIONS, filterPlans } from '../data';
import { useApp } from '../context/AppContext';
import { useCatalog } from '../context/CatalogContext';

export default function Plans({ navigate }) {
  const { user, selectPlan } = useApp();
  const { plans, cooksById, loading, error } = useCatalog();
  const [filter, setFilter] = useState('All Plans');

  const filtered = useMemo(() => filterPlans(plans, filter), [plans, filter]);
  const displayName = user?.name || 'Guest';

  const openPlan = (planId, e) => {
    e?.stopPropagation?.();
    const plan = selectPlan(planId);
    if (plan) navigate(`/cook/${plan.cookId}`);
  };

  if (loading) {
    return (
      <main className="container page">
        <p className="muted">Loading meal plans…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page">
        <h1>Could not load plans</h1>
        <p className="form-error">{error}</p>
        <p className="muted">Make sure the backend is running: python3 manage.py runserver 8000</p>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Welcome back, {displayName}</h1>
      <p>Your campus community has {plans.length} fresh meal plans today.</p>
      <div className="section-head">
        <h2>Weekly recommended meal plans</h2>
        <div className="chips">
          {FILTER_OPTIONS.map((f) => (
            <button
              type="button"
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="empty">No plans match this filter. Try another category.</p>
      ) : (
        <div className="plan-grid">
          {filtered.map((p) => {
            const cook = cooksById[p.cookId];
            return (
              <article
                className="meal-card clickable"
                key={p.id}
                onClick={() => openPlan(p.id)}
                onKeyDown={(e) => e.key === 'Enter' && openPlan(p.id)}
                role="button"
                tabIndex={0}
              >
                <div className="img-wrap">
                  <MealImage src={p.image} alt={p.name} />
                  <span className="rating">
                    <Star size={16} />
                    {p.rating}
                  </span>
                </div>
                <div className="meal-body">
                  <div className="row">
                    <div>
                      <h3>{p.name}</h3>
                      <p>by {cook?.shortName || cook?.name}</p>
                    </div>
                    <b className="price">
                      ${p.price}
                      <small>/ week</small>
                    </b>
                  </div>
                  <p className="loc">
                    <MapPin size={16} />
                    {p.location}
                  </p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <button type="button" className="subscribe" onClick={(e) => openPlan(p.id, e)}>
                    Subscribe
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <section className="cook-cta">
        <div>
          <h2>Share your cooking skills</h2>
          <p>Turn your kitchen into a community hub and earn extra credits while helping students eat better.</p>
          <button type="button" onClick={() => navigate('/become-cook')}>
            Apply to Cook
          </button>
        </div>
        <aside>
          <ShieldCheck size={44} />
          <h3>Campus Verified</h3>
          <p>Every cook is a verified student or faculty member.</p>
        </aside>
      </section>
    </main>
  );
}
