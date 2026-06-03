import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, normalizeCook, normalizePlan } from '../api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [plans, setPlans] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [cookDetails, setCookDetails] = useState({});
  const cookCache = useRef({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [plansData, cooksData] = await Promise.all([api.listPlans(), api.listCooks()]);
        if (cancelled) return;
        setPlans(plansData.map(normalizePlan));
        setCooks(cooksData);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load meal plans.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cooksById = useMemo(() => Object.fromEntries(cooks.map((c) => [c.id, c])), [cooks]);

  const getPlanById = useCallback((id) => plans.find((p) => p.id === id), [plans]);

  const fetchCook = useCallback(async (id) => {
    if (cookCache.current[id]) return cookCache.current[id];
    const raw = await api.getCook(id);
    const cook = normalizeCook(raw);
    cookCache.current[id] = cook;
    setCookDetails((prev) => ({ ...prev, [id]: cook }));
    return cook;
  }, []);

  const value = useMemo(
    () => ({
      plans,
      cooks,
      cooksById,
      loading,
      error,
      getPlanById,
      fetchCook,
      cookDetails,
    }),
    [plans, cooks, cooksById, loading, error, getPlanById, fetchCook, cookDetails]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
