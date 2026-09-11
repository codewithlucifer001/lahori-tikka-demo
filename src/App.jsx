import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LoyaltyBanner from './components/LoyaltyBanner';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import OrderTracker from './components/OrderTracker';
import Reviews from './components/Reviews';
import Branches from './components/Branches';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [viewAdmin, setViewAdmin] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  useEffect(() => {
    const handleHash = () => setViewAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (viewAdmin) {
    return <AdminDashboard onExit={() => { window.location.hash = ''; setViewAdmin(false); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Discreet Demo Switcher Bar */}
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
          onClick={() => { window.location.hash = 'admin'; setViewAdmin(true); }}
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

      <Header />
      <LoyaltyBanner />
      <main>
        <Hero />
        <Menu />
        <Reservation />
        <OrderTracker currentStage={1} />
        <Reviews />
        <Branches />
      </main>
      <Footer />
    </div>
  );
}