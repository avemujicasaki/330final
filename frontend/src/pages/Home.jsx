import React from 'react';
import { ArrowRight, CheckCircle2, ChefHat, CircleDollarSign, Utensils } from 'lucide-react';

export default function Home({ navigate }) {
  return (
    <>
      <section className="hero container">
        <div>
          <h1>One meal decision for the whole week.</h1>
          <p>
            CoachShare connects students with campus cooks offering simple weekly meal plans, so you can save time,
            reduce stress, and eat better.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-primary btn-hero" onClick={() => navigate('/plans')}>
              Find My Weekly Plan
              <ArrowRight size={20} />
            </button>
            <button type="button" className="btn-secondary btn-hero" onClick={() => navigate('/become-cook')}>
              Become a Student Cook
            </button>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80"
            alt="Students sharing a healthy campus meal"
          />
          <div className="float">
            <CheckCircle2 />
            <span>
              <b>5 Meals Ready</b>
              <br />
              Picked up by Sarah
            </span>
          </div>
        </div>
      </section>
      <section className="band">
        <div className="container center">
          <h2>Ditch the Decision Fatigue</h2>
          <p>Being a student is hard enough. Feeding yourself shouldn&apos;t be.</p>
          <div className="pain-grid">
            {[
              ['Endless Takeout Choices', Utensils],
              ['Decision Fatigue', ChefHat],
              ['Expensive Fees', CircleDollarSign],
            ].map(([title, Icon]) => (
              <article className="card" key={title}>
                <Icon className="orange" />
                <h3>{title}</h3>
                <p>Simple weekly plans reduce daily food decisions and help students eat better.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
