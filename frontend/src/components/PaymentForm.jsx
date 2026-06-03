import React from 'react';

export default function PaymentForm({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvc,
  setCvc,
  error,
  submitting,
  submitLabel,
  onSubmit,
}) {
  return (
    <form className="payment-form" onSubmit={onSubmit}>
      <h3>Payment details</h3>
      <label className="field">
        Name on card
        <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Alex Johnson" required />
      </label>
      <label className="field">
        Card number
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, '').slice(0, 19))}
          placeholder="4242 4242 4242 4242"
          inputMode="numeric"
          required
        />
      </label>
      <div className="field-row">
        <label className="field">
          Expiry
          <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} required />
        </label>
        <label className="field">
          CVC
          <input
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            inputMode="numeric"
            required
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="confirm-btn" disabled={submitting}>
        {submitting ? 'Processing…' : submitLabel}
      </button>
    </form>
  );
}
