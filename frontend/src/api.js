import { loadToken } from './storage';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function parseError(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) return data.non_field_errors[0];
  for (const val of Object.values(data)) {
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
  }
  return fallback;
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = loadToken();
    if (token) headers.Authorization = `Token ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    throw new ApiError(parseError(data, res.statusText || 'Request failed'), res.status);
  }
  return data;
}

export function normalizePlan(plan) {
  return {
    ...plan,
    price: Number(plan.price),
    mealsPerWeek: plan.mealsPerWeek ?? plan.meals_per_week,
  };
}

export function normalizeCook(cook) {
  return {
    ...cook,
    menu: (cook.menu || []).map((m) => ({
      ...m,
      price: Number(m.price),
    })),
  };
}

export const api = {
  register: (body) => request('/auth/register/', { method: 'POST', body, auth: false }),
  login: (body) => request('/auth/login/', { method: 'POST', body, auth: false }),
  me: () => request('/me/'),
  listPlans: () => request('/plans/'),
  listCooks: () => request('/cooks/'),
  getCook: (id) => request(`/cooks/${id}/`, { auth: false }),
  listSubscriptions: () => request('/subscriptions/'),
  createSubscription: (body) => request('/subscriptions/', { method: 'POST', body }),
  subscriptionAction: (id, action) =>
    request(`/subscriptions/${id}/action/`, { method: 'POST', body: { action } }),
  listOrders: () => request('/orders/'),
  createOrder: (body) => request('/orders/', { method: 'POST', body }),
  submitCookApplication: (body) =>
    request('/cook-applications/', { method: 'POST', body, auth: false }),
};
