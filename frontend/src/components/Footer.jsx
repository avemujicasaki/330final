import React from 'react';

export default function Footer({ navigate }) {
  const links = [
    ['guidelines', 'Community Guidelines'],
    ['safety', 'Safety'],
    ['terms', 'Terms of Service'],
    ['support', 'Support'],
  ];

  return (
    <footer>
      <button type="button" className="footer-brand" onClick={() => navigate('/')}>
        CoachShare
      </button>
      {links.map(([slug, label]) => (
        <button key={slug} type="button" className="footer-link" onClick={() => navigate(`/${slug}`)}>
          {label}
        </button>
      ))}
      <small>© 2024 CoachShare. Built for the campus community.</small>
    </footer>
  );
}
