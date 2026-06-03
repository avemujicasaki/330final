import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPostLoginPath } from '../storage';

export default function Login({ navigate }) {
  const { login, user, authLoading } = useApp();
  const [email, setEmail] = useState('alex@university.edu');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Alex');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(getPostLoginPath());
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid campus email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(email, password, mode === 'signup' ? name : undefined, mode);
      navigate(getPostLoginPath());
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="container page narrow">
        <p className="muted">Restoring your session…</p>
      </main>
    );
  }

  return (
    <main className="container page narrow">
      <h1>{mode === 'login' ? 'Log in' : 'Create account'}</h1>
      <p>Use your campus email and password (4+ characters).</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <label className="field">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label className="field">
          Campus email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary full" disabled={submitting}>
          {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>
      <button
        type="button"
        className="link center"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </main>
  );
}
