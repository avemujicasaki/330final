import { useCallback, useEffect, useState } from 'react';

function parsePath(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'home', params: {} };
  if (segments[0] === 'plans') return { name: 'plans', params: {} };
  if (segments[0] === 'login') return { name: 'login', params: {} };
  if (segments[0] === 'become-cook') return { name: 'become-cook', params: {} };
  if (segments[0] === 'subscriptions') return { name: 'subscriptions', params: {} };
  if (segments[0] === 'cart' && segments[1] === 'checkout') return { name: 'cart-checkout', params: {} };
  if (segments[0] === 'cart') return { name: 'cart', params: {} };
  if (segments[0] === 'confirm') return { name: 'confirm', params: {} };
  if (segments[0] === 'order-success' && segments[1]) return { name: 'order-success', params: { orderId: segments[1] } };
  if (segments[0] === 'cook' && segments[1]) return { name: 'cook', params: { cookId: segments[1] } };
  if (segments[0] === 'success' && segments[1]) return { name: 'success', params: { subscriptionId: segments[1] } };
  if (['guidelines', 'safety', 'terms', 'support'].includes(segments[0])) {
    return { name: 'static', params: { slug: segments[0] } };
  }
  return { name: 'home', params: {} };
}

export function useRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const route = parsePath(pathname);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to) => {
    const path = to.startsWith('/') ? to : `/${to}`;
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
      setPathname(path);
    }
  }, []);

  return { route, navigate, pathname };
}
