import React, { useState } from 'react';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import { useApp } from '../context/AppContext';
import { validatePayment } from '../utils/payment';

export default function CartCheckout({ navigate }) {
  const { cart, user, createMealOrder } = useApp();
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  if (cart.length === 0) {
    return (
      <main className="confirm">
        <div className="confirm-inner">
          <h1>Your cart is empty</h1>
          <p>Add meals from a cook&apos;s menu before checking out.</p>
          <button type="button" className="btn-primary" onClick={() => navigate('/plans')}>
            Browse Plans
          </button>
        </div>
      </main>
    );
  }

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
      const order = await createMealOrder({
        paymentLast4: cardNumber.replace(/\s/g, '').slice(-4),
      });
      navigate(`/order-success/${order.id}`);
    } catch (ex) {
      setError(ex.message || 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="confirm">
      <div className="confirm-inner checkout-wide">
        <div className="verify">
          <ShieldCheck size={42} />
        </div>
        <h1>Checkout</h1>
        <p>Review your meal order and pay once. Pick up each item on the day listed.</p>
        <div className="checkout-items">
          {cart.map((item) => (
            <article className="card checkout-line" key={item.key}>
              <div className="row">
                <div>
                  <h3>{item.name}</h3>
                  <p className="muted">
                    {item.day} · {item.cookName} · Qty {item.qty}
                  </p>
                </div>
                <b>${(item.price * item.qty).toFixed(2)}</b>
              </div>
            </article>
          ))}
          <article className="card total">
            <p>Order total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</p>
            <h2>${total.toFixed(2)}</h2>
            <small>One-time charge. Pick up on the scheduled day for each meal.</small>
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
          submitLabel="Confirm & Pay →"
          onSubmit={handleConfirm}
        />
        <button type="button" className="back" onClick={() => navigate('/cart')}>
          ← Back to cart
        </button>
      </div>
    </main>
  );
}
