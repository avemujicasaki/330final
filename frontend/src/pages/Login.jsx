import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPostLoginPath } from '../storage';

export default function Login({ navigate }) {
  const { login, user } = useApp();
  const [email, setEmail] = useState('alex@university.edu');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Alex');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate(getPostLoginPath());
  }, [user, navigate]);

  const handleSubmit = (e) => {
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
    login(email, mode === 'signup' ? name : undefined);
    navigate(getPostLoginPath());
  };

  return (
    <main className="container page narrow">
      <h1>{mode === 'login' ? 'Log in' : 'Create account'}</h1>
      <p>Use your campus email. Demo mode accepts any password with 4+ characters.</p>
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
        <button type="submit" className="primary full">
          {mode === 'login' ? 'Log in' : 'Sign up'}
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
