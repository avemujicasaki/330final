import React from 'react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import MealImage from '../components/MealImage';
import { useApp } from '../context/AppContext';
import { saveReturnTo } from '../storage';

export default function Cart({ navigate }) {
  const { cart, updateCartQty, clearCart, user } = useApp();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleCheckout = () => {
    if (!user) {
      saveReturnTo('/cart/checkout');
      navigate('/login');
      return;
    }
    navigate('/cart/checkout');
  };

  if (cart.length === 0) {
    return (
      <main className="container page">
        <h1>Your Cart</h1>
        <p className="empty">Your cart is empty. Order individual meals from a cook&apos;s menu.</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/plans')}>
          Browse Plans
        </button>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cart.map((item) => (
          <article className="cart-item card" key={item.key}>
            <div className="cart-item-img">
              <MealImage src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-body">
              <div className="row">
                <div>
                  <h3>{item.name}</h3>
                  <p className="muted">
                    {item.day} · {item.cookName}
                  </p>
                </div>
                <b className="cart-price">${(item.price * item.qty).toFixed(2)}</b>
              </div>
              <div className="cart-item-actions">
                <div className="qty-row">
                  <button type="button" className="qty-btn" aria-label="Decrease quantity" onClick={() => updateCartQty(item.key, item.qty - 1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" className="qty-btn" aria-label="Increase quantity" onClick={() => updateCartQty(item.key, item.qty + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="btn-text-danger" onClick={() => updateCartQty(item.key, 0)}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total-row">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <p className="muted">Individual meal orders are picked up on the day listed. For weekly plans, subscribe from the plans page.</p>
        <div className="cart-actions">
          <button type="button" className="btn-secondary" onClick={clearCart}>
            Clear Cart
          </button>
          <button type="button" className="btn-primary" onClick={() => navigate('/plans')}>
            Continue Shopping
          </button>
          <button type="button" className="btn-checkout" onClick={handleCheckout}>
            <ShoppingBag size={20} /> Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
