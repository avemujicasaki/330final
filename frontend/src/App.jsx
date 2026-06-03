import React, { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { AppProvider, useApp } from './context/AppContext';
import { useRouter } from './hooks/useRouter';
import { saveReturnTo } from './storage';
import Home from './pages/Home';
import Plans from './pages/Plans';
import CookDetail from './pages/CookDetail';
import Confirm from './pages/Confirm';
import Success from './pages/Success';
import Login from './pages/Login';
import BecomeCook from './pages/BecomeCook';
import Subscriptions from './pages/Subscriptions';
import Cart from './pages/Cart';
import CartCheckout from './pages/CartCheckout';
import OrderSuccess from './pages/OrderSuccess';
import StaticPage from './pages/StaticPage';

const AUTH_ROUTES = new Set(['confirm', 'cart-checkout']);

function RequireAuth({ children, navigate, routeName }) {
  const { user } = useApp();

  useEffect(() => {
    if (!user && AUTH_ROUTES.has(routeName)) {
      if (routeName === 'cart-checkout') saveReturnTo('/cart/checkout');
      navigate('/login');
    }
  }, [user, navigate, routeName]);

  if (!user && AUTH_ROUTES.has(routeName)) return null;
  return children;
}

function AppRoutes() {
  const { route, navigate } = useRouter();

  const page = (() => {
    switch (route.name) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'plans':
        return <Plans navigate={navigate} />;
      case 'cook':
        return <CookDetail cookId={route.params.cookId} navigate={navigate} />;
      case 'confirm':
        return (
          <RequireAuth navigate={navigate} routeName="confirm">
            <Confirm navigate={navigate} />
          </RequireAuth>
        );
      case 'cart-checkout':
        return (
          <RequireAuth navigate={navigate} routeName="cart-checkout">
            <CartCheckout navigate={navigate} />
          </RequireAuth>
        );
      case 'success':
        return <Success subscriptionId={route.params.subscriptionId} navigate={navigate} />;
      case 'order-success':
        return <OrderSuccess orderId={route.params.orderId} navigate={navigate} />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'become-cook':
        return <BecomeCook navigate={navigate} />;
      case 'subscriptions':
        return <Subscriptions navigate={navigate} />;
      case 'cart':
        return <Cart navigate={navigate} />;
      case 'static':
        return <StaticPage slug={route.params.slug} navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  })();

  return (
    <>
      <Nav route={route} navigate={navigate} />
      {page}
      <Footer navigate={navigate} />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
