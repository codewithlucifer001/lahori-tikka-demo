import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import OrderTracker from './components/OrderTracker';
import Reviews from './components/Reviews';
import Branches from './components/Branches';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [viewAdmin, setViewAdmin] = useState(
    window.location.hash === '#admin' || window.location.pathname === '/admin'
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [lastAddedId, setLastAddedId] = useState(null);

  useEffect(() => {
    const checkRoute = () => {
      const isManagerRoute = window.location.hash === '#admin' || window.location.pathname === '/admin';
      setViewAdmin(isManagerRoute);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleOpenDashboard = () => {
    window.location.hash = 'admin';
    setViewAdmin(true);
  };

  const handleExitDashboard = () => {
    window.location.hash = '';
    setIsAuthenticated(false);
    setViewAdmin(false);
  };

  const handleAddToCart = (item) => {
    const itemId = item.name;
    setLastAddedId(itemId);

    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: itemId, quantity: 1 }];
    });

    setTimeout(() => {
      setLastAddedId(null);
    }, 350);
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const handleScrollToBill = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (viewAdmin) {
    if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} onExit={handleExitDashboard} />;
    }
    return <AdminDashboard onExit={handleExitDashboard} />;
  }

  return (
    <div className="light-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Demo Switcher Bar */}
      <div style={{
        backgroundColor: '#050505',
        borderBottom: '1px solid #222',
        padding: '6px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.78rem',
        color: '#888'
      }}>
        <span>Demo Mode: Lahori Tikka Client Showcase</span>
        <button
          onClick={handleOpenDashboard}
          style={{
            background: 'transparent',
            border: '1px solid #444',
            color: '#FFD700',
            padding: '3px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.72rem'
          }}
        >
          Open Manager Dashboard ↗
        </button>
      </div>

      <Header cartCount={totalCartCount} onCartClick={handleScrollToBill} />
      <main>
        <Hero />
        <Menu 
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          lastAddedId={lastAddedId}
          onScrollToBill={handleScrollToBill}
        />
        <Reservation />
        <OrderTracker currentStage={1} />
        <Reviews />
        <Branches />
      </main>
      <Footer />
    </div>
  );
}