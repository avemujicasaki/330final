import React, { useState } from 'react';
import { CalendarDays, ShieldCheck, Utensils } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import { useApp } from '../context/AppContext';
import { useCatalog } from '../context/CatalogContext';
import { validatePayment } from '../utils/payment';

export default function Confirm({ navigate }) {
  const { pendingPlan, user, createSubscription } = useApp();
  const { cooksById } = useCatalog();
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!pendingPlan) {
    return (
      <main className="confirm">
        <div className="confirm-inner">
          <h1>No plan selected</h1>
          <p>Choose a weekly meal plan before confirming.</p>
          <button type="button" className="primary" onClick={() => navigate('/plans')}>
            Browse Plans
          </button>
        </div>
      </main>
    );
  }

  const cook = cooksById[pendingPlan.cookId];

  const handleConfirm = async (e) => {
    e.preventDefault();
    const err = validatePayment({ cardName, cardNumber, expiry, cvc });
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const sub = await createSubscription({
        planId: pendingPlan.id,
        planName: pendingPlan.name,
        cookId: pendingPlan.cookId,
        cookName: cook?.name || 'Campus Cook',
        price: pendingPlan.price,
        mealsPerWeek: pendingPlan.mealsPerWeek,
        location: cook?.location || pendingPlan.location,
        pickupDays: cook?.pickupDays || 'Mon–Fri',
        pickupTime: cook?.pickupTime || '6:00 PM',
        paymentLast4: cardNumber.replace(/\s/g, '').slice(-4),
      });
      navigate(`/success/${sub.id}`);
    } catch (ex) {
      setError(ex.message || 'Could not create subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="confirm">
      <div className="confirm-inner">
        <div className="verify">
          <ShieldCheck size={42} />
        </div>
        <h1>Your &ldquo;One Decision&rdquo; for the Week</h1>
        <p>Review your subscription details below. Once confirmed, we&apos;ll handle the rest of your weekly meals.</p>
        <div className="summary-grid">
          <article className="card">
            <b>
              <Utensils size={18} /> Selected Plan
            </b>
            <h2>{pendingPlan.name}</h2>
            <p>{pendingPlan.mealsPerWeek} home-cooked meals per week</p>
            <span>Student Peer-to-Peer</span>
          </article>
          <article className="card">
            <b>
              <CalendarDays size={18} /> Pickup Schedule
            </b>
            <p>
              {cook?.pickupDays || 'Mon–Fri'}{' '}
              <strong>{cook?.pickupTime || '6:30 PM'}</strong>
            </p>
            <p>
              Location <strong>{cook?.location || pendingPlan.location}</strong>
            </p>
            <small>Prepared by {cook?.name}.</small>
          </article>
          <article className="card total">
            <p>Total Weekly Subscription</p>
            <h2>
              ${pendingPlan.price.toFixed(2)} <small>/ week</small>
            </h2>
            <small>Your card will be charged every Sunday evening. You can skip or cancel before Friday midnight.</small>
          </article>
        </div>
        <PaymentForm
          cardName={cardName}
          setCardName={setCardName}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expiry={expiry}
          setExpiry={setExpiry}
          cvc={cvc}
          setCvc={setCvc}
          error={error}
          submitting={submitting}
          submitLabel="Confirm Weekly Plan →"
          onSubmit={handleConfirm}
        />
        <button
          type="button"
          className="back"
          onClick={() => navigate(`/cook/${pendingPlan.cookId}`)}
        >
          Go back and edit selection
        </button>
      </div>
    </main>
  );
}
