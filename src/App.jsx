import Header from './components/Header';
import Hero from './components/Hero';
import LoyaltyBanner from './components/LoyaltyBanner';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import OrderTracker from './components/OrderTracker';
import Reviews from './components/Reviews';
import Branches from './components/Branches';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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