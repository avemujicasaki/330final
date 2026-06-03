import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getPlanById } from '../data';
import {
  loadCart,
  loadCookApplications,
  loadOrders,
  loadPendingPlan,
  loadSubscriptions,
  loadUser,
  saveCart,
  saveCookApplications,
  saveOrders,
  savePendingPlan,
  saveSubscriptions,
  saveUser,
} from '../storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());
  const [cart, setCart] = useState(() => loadCart());
  const [subscriptions, setSubscriptions] = useState(() => loadSubscriptions());
  const [orders, setOrders] = useState(() => loadOrders());
  const [cookApplications, setCookApplications] = useState(() => loadCookApplications());
  const [pendingPlan, setPendingPlanState] = useState(() => loadPendingPlan());
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const login = useCallback((email, name) => {
    const next = { email, name: name || email.split('@')[0] };
    setUser(next);
    saveUser(next);
    showToast(`Welcome back, ${next.name}!`);
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    saveUser(null);
    showToast('You have been logged out.');
  }, [showToast]);

  const selectPlan = useCallback((planId) => {
    const plan = getPlanById(planId);
    if (!plan) return null;
    setPendingPlanState(plan);
    savePendingPlan(plan);
    return plan;
  }, []);

  const clearPendingPlan = useCallback(() => {
    setPendingPlanState(null);
    savePendingPlan(null);
  }, []);

  const addToCart = useCallback((item) => {
    const addQty = Math.max(1, item.qty ?? 1);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      let next;
      if (existing) {
        next = prev.map((i) =>
          i.key === item.key ? { ...i, qty: i.qty + addQty, image: i.image || item.image } : i
        );
      } else {
        next = [...prev, { ...item, qty: addQty }];
      }
      saveCart(next);
      return next;
    });
    showToast(addQty > 1 ? `Added ${addQty}× ${item.name} to cart` : `Added ${item.name} to cart`);
  }, [showToast]);

  const updateCartQty = useCallback((key, qty) => {
    setCart((prev) => {
      const next = qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, []);

  const createSubscription = useCallback((payload) => {
    const sub = {
      id: `sub-${Date.now()}`,
      type: 'subscription',
      createdAt: new Date().toISOString(),
      status: 'active',
      ...payload,
    };
    setSubscriptions((prev) => {
      const next = [sub, ...prev];
      saveSubscriptions(next);
      return next;
    });
    clearPendingPlan();
    return sub;
  }, [clearPendingPlan]);

  const createMealOrder = useCallback(
    (payload) => {
      const order = {
        id: `order-${Date.now()}`,
        type: 'meal',
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        items: cart.map(({ key, name, day, cookName, cookId, price, qty, image }) => ({
          key,
          name,
          day,
          cookName,
          cookId,
          price,
          qty,
          image,
        })),
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        ...payload,
      };
      setOrders((prev) => {
        const next = [order, ...prev];
        saveOrders(next);
        return next;
      });
      setCart([]);
      saveCart([]);
      return order;
    },
    [cart]
  );

  const skipSubscription = useCallback((id) => {
    setSubscriptions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, status: 'skipped', skippedAt: new Date().toISOString() } : s));
      saveSubscriptions(next);
      return next;
    });
    showToast('Next week skipped.');
  }, [showToast]);

  const cancelSubscription = useCallback((id) => {
    setSubscriptions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, status: 'cancelled', cancelledAt: new Date().toISOString() } : s));
      saveSubscriptions(next);
      return next;
    });
    showToast('Subscription cancelled.');
  }, [showToast]);

  const submitCookApplication = useCallback((form) => {
    const app = { id: `app-${Date.now()}`, ...form, status: 'pending', submittedAt: new Date().toISOString() };
    setCookApplications((prev) => {
      const next = [app, ...prev];
      saveCookApplications(next);
      return next;
    });
    return app;
  }, []);

  const value = useMemo(
    () => ({
      user,
      cart,
      subscriptions,
      orders,
      cookApplications,
      pendingPlan,
      toast,
      login,
      logout,
      selectPlan,
      clearPendingPlan,
      addToCart,
      updateCartQty,
      clearCart,
      createSubscription,
      createMealOrder,
      skipSubscription,
      cancelSubscription,
      submitCookApplication,
      showToast,
      cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
    }),
    [
      user,
      cart,
      subscriptions,
      orders,
      cookApplications,
      pendingPlan,
      toast,
      login,
      logout,
      selectPlan,
      clearPendingPlan,
      addToCart,
      updateCartQty,
      clearCart,
      createSubscription,
      createMealOrder,
      skipSubscription,
      cancelSubscription,
      submitCookApplication,
      showToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
