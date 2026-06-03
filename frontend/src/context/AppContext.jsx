import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useCatalog } from './CatalogContext';
import {
  clearAuth,
  loadCart,
  loadPendingPlan,
  loadToken,
  loadUser,
  saveCart,
  savePendingPlan,
  saveToken,
  saveUser,
} from '../storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { getPlanById } = useCatalog();
  const [user, setUser] = useState(() => loadUser());
  const [cart, setCart] = useState(() => loadCart());
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingPlan, setPendingPlanState] = useState(() => loadPendingPlan());
  const [toast, setToast] = useState(null);
  const [authLoading, setAuthLoading] = useState(!!loadToken());

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const refreshUserData = useCallback(async () => {
    const [subs, ords] = await Promise.all([api.listSubscriptions(), api.listOrders()]);
    setSubscriptions(subs);
    setOrders(ords);
  }, []);

  useEffect(() => {
    const token = loadToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await api.me();
        setUser(me);
        saveUser(me);
        await refreshUserData();
      } catch {
        clearAuth();
        setUser(null);
        setSubscriptions([]);
        setOrders([]);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [refreshUserData]);

  const login = useCallback(
    async (email, password, name, mode = 'login') => {
      const body = { email: email.trim().toLowerCase(), password };
      const data =
        mode === 'signup'
          ? await api.register({ ...body, name: name || email.split('@')[0] })
          : await api.login(body);
      saveToken(data.token);
      saveUser(data.user);
      setUser(data.user);
      await refreshUserData();
      showToast(`Welcome back, ${data.user.name}!`);
      return data.user;
    },
    [refreshUserData, showToast]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setSubscriptions([]);
    setOrders([]);
    showToast('You have been logged out.');
  }, [showToast]);

  const selectPlan = useCallback(
    (planId) => {
      const plan = getPlanById(planId);
      if (!plan) return null;
      setPendingPlanState(plan);
      savePendingPlan(plan);
      return plan;
    },
    [getPlanById]
  );

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

  const createSubscription = useCallback(
    async (payload) => {
      const sub = await api.createSubscription({
        planId: payload.planId,
        planName: payload.planName,
        cookId: payload.cookId,
        cookName: payload.cookName,
        price: payload.price,
        mealsPerWeek: payload.mealsPerWeek,
        location: payload.location,
        pickupDays: payload.pickupDays,
        pickupTime: payload.pickupTime,
        paymentLast4: payload.paymentLast4,
      });
      setSubscriptions((prev) => [sub, ...prev]);
      clearPendingPlan();
      return sub;
    },
    [clearPendingPlan]
  );

  const createMealOrder = useCallback(
    async (payload) => {
      const items = cart.map(({ key, name, day, cookName, cookId, price, qty, image }) => ({
        key,
        name,
        day,
        cookName,
        cookId,
        price,
        qty,
        image: image || '',
      }));
      const order = await api.createOrder({
        paymentLast4: payload.paymentLast4,
        items,
      });
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      saveCart([]);
      return order;
    },
    [cart]
  );

  const skipSubscription = useCallback(
    async (id) => {
      const updated = await api.subscriptionAction(id, 'skip');
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('Next week skipped.');
    },
    [showToast]
  );

  const cancelSubscription = useCallback(
    async (id) => {
      const updated = await api.subscriptionAction(id, 'cancel');
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('Subscription cancelled.');
    },
    [showToast]
  );

  const submitCookApplication = useCallback(async (form) => {
    return api.submitCookApplication(form);
  }, []);

  const value = useMemo(
    () => ({
      user,
      cart,
      subscriptions,
      orders,
      pendingPlan,
      toast,
      authLoading,
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
      pendingPlan,
      toast,
      authLoading,
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
