import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BecomeCook({ navigate }) {
  const { submitCookApplication, user } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    specialty: '',
    location: '',
    availability: '',
    bio: '',
  });
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes('@') || !form.specialty.trim() || !form.location.trim()) {
      setError('Please fill in name, email, specialty, and pickup location.');
      return;
    }
    submitCookApplication(form);
    setSubmitted(true);
    setError('');
  };

  if (submitted) {
    return (
      <main className="container page narrow center-block">
        <div className="verify">
          <ShieldCheck size={42} />
        </div>
        <h1>Application submitted</h1>
        <p>Thanks, {form.name}! Our team will review your cook application within 3–5 business days.</p>
        <button type="button" className="primary" onClick={() => navigate('/plans')}>
          Back to Plans
        </button>
      </main>
    );
  }

  return (
    <main className="container page narrow">
      <h1>Become a Student Cook</h1>
      <p>Share your meals with campus peers. All cooks complete a safety orientation before listing plans.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          Full name
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label className="field">
          Campus email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label className="field">
          Cooking specialty
          <input value={form.specialty} onChange={update('specialty')} placeholder="e.g. Thai, meal prep, bento" required />
        </label>
        <label className="field">
          Pickup location
          <input value={form.location} onChange={update('location')} placeholder="e.g. Library Plaza" required />
        </label>
        <label className="field">
          Weekly availability
          <input value={form.availability} onChange={update('availability')} placeholder="Mon–Fri 12–2 PM" />
        </label>
        <label className="field">
          Short bio
          <textarea value={form.bio} onChange={update('bio')} rows={4} placeholder="Tell students about your cooking style…" />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary full">
          Submit Application
        </button>
      </form>
    </main>
  );
}
