import React, { useState } from 'react';
import { ArrowLeft, Menu, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Nav({ route, navigate }) {
  const { user, cartCount, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const showBack =
    route.name === 'cook' ||
    route.name === 'confirm' ||
    route.name === 'cart-checkout' ||
    route.name === 'static';

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        {showBack ? (
          <button type="button" className="icon-btn" aria-label="Go back" onClick={() => window.history.back()}>
            <ArrowLeft size={22} />
          </button>
        ) : (
          <span className="nav-spacer" />
        )}
        <button type="button" className="brand" onClick={() => go('/')}>
          CoachShare
        </button>
        <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button type="button" onClick={() => go('/plans')}>
            Find a Plan
          </button>
          <button type="button" onClick={() => go('/become-cook')}>
            Become a Cook
          </button>
          {user && (
            <button type="button" onClick={() => go('/subscriptions')}>
              My Orders
            </button>
          )}
          <button type="button" className="cart-btn" onClick={() => go('/cart')}>
            <ShoppingCart size={18} />
            Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button type="button" className="login outline" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="login" onClick={() => go('/login')}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
