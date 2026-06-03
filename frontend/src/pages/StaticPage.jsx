import React from 'react';
import { STATIC_PAGES } from '../data';

export default function StaticPage({ slug, navigate }) {
  const page = STATIC_PAGES[slug];

  if (!page) {
    return (
      <main className="container page">
        <h1>Page not found</h1>
        <button type="button" className="primary" onClick={() => navigate('/')}>
          Home
        </button>
      </main>
    );
  }

  return (
    <main className="container page narrow">
      <h1>{page.title}</h1>
      <p className="lead">{page.body}</p>
      <button type="button" className="secondary" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </main>
  );
}
