const KEYS = {
  user: 'coachshare_user',
  token: 'coachshare_token',
  cart: 'coachshare_cart',
  pendingPlan: 'coachshare_pending_plan',
  returnTo: 'coachshare_return_to',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadUser() {
  return read(KEYS.user, null);
}

export function saveUser(user) {
  if (user) write(KEYS.user, user);
  else localStorage.removeItem(KEYS.user);
}

export function loadToken() {
  return localStorage.getItem(KEYS.token);
}

export function saveToken(token) {
  if (token) localStorage.setItem(KEYS.token, token);
  else localStorage.removeItem(KEYS.token);
}

export function clearAuth() {
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.token);
}

export function loadCart() {
  return read(KEYS.cart, []);
}

export function saveCart(cart) {
  write(KEYS.cart, cart);
}

export function loadPendingPlan() {
  return read(KEYS.pendingPlan, null);
}

export function savePendingPlan(plan) {
  if (plan) write(KEYS.pendingPlan, plan);
  else localStorage.removeItem(KEYS.pendingPlan);
}

export function saveReturnTo(path) {
  if (path) localStorage.setItem(KEYS.returnTo, path);
  else localStorage.removeItem(KEYS.returnTo);
}

export function loadReturnTo() {
  return localStorage.getItem(KEYS.returnTo) || null;
}

export function clearReturnTo() {
  localStorage.removeItem(KEYS.returnTo);
}

/** After login, prefer saved return path, then pending subscription checkout. */
export function getPostLoginPath() {
  const returnTo = loadReturnTo();
  if (returnTo) {
    clearReturnTo();
    return returnTo;
  }
  if (loadPendingPlan()) return '/confirm';
  return '/plans';
}
