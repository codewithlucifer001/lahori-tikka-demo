import { useState, useRef, useEffect } from 'react';
import config from '../config/lahoriTikka.config';
import { Phone, MessageCircle, MapPin, ShoppingBag, User, ChevronDown, Package, LogOut, Menu, X } from 'lucide-react';
import BranchModal from './BranchModal';
import CustomerLoginModal from './CustomerLoginModal';

export default function Header({ cartCount = 0, onCartClick }) {
  const [fulfillmentMode, setFulfillmentMode] = useState('Delivery');
  const [selectedBranch, setSelectedBranch] = useState(config.branches[0].name);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  // Customer Auth State
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <style>{`
        .header-top-bar {
          background-color: #1a1a1a;
          color: #A3A3A3;
          padding: 6px 24px;
          font-size: 0.75rem;
        }
        .header-top-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          padding: 4px;
        }
        .mobile-drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 9999;
          display: flex;
          justify-content: flex-start;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .mobile-drawer {
          width: 280px;
          height: 100%;
          background: var(--color-card-bg, #11151e);
          border-right: 1px solid var(--color-border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 10px 0 30px rgba(0,0,0,0.5);
          animation: drawerSlideIn 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawerSlideIn {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .header-top-bar {
            padding: 8px 12px;
          }
          .header-top-inner {
            flex-direction: column;
            gap: 4px;
            text-align: center;
            font-size: 0.7rem;
          }
        }
      `}</style>
      <header style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }} className="header-container">
        
        {/* Secondary Top Bar Row */}
        <div className="header-top-bar">
          <div className="header-top-inner">
            <span>🔥 Free Delivery in F, G & E Sectors on orders above Rs. 1000</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href={`tel:${config.branches[0].phone}`} style={{ color: '#A3A3A3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} color="var(--color-accent)" /> {config.branches[0].phone}
              </a>
              <a href={config.socials.whatsapp} target="_blank" rel="noreferrer" style={{ color: '#A3A3A3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MessageCircle size={12} color="#25D366" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Hamburger + Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="mobile-menu-toggle"
              title="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

            <img 
              src={config.logo} 
              alt={config.name} 
              style={{ height: '42px', width: '42px', objectFit: 'contain', borderRadius: '50%' }} 
            />
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
                {config.name}
              </h1>
              <button 
                onClick={() => setIsBranchModalOpen(true)}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontSize: '0.72rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600
                }}
              >
                <MapPin size={12} /> Delivering to: {selectedBranch} ▾
              </button>
            </div>
          </div>

          {/* Center-Left Pill Toggle: Delivery | Pickup */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--color-alt-bg, #F7F7F7)',
            borderRadius: '24px',
            padding: '3px',
            border: '1px solid var(--color-border)'
          }}>
            {['Delivery', 'Pickup'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFulfillmentMode(mode)}
                style={{
                  background: fulfillmentMode === mode ? 'var(--color-primary)' : 'transparent',
                  color: fulfillmentMode === mode ? '#fff' : 'var(--color-text-muted)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Right Side: Cart Icon & Login/User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Clickable Cart Icon with Badge */}
            <button
              onClick={onCartClick}
              style={{
                position: 'relative',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="View Cart"
            >
              <ShoppingBag size={22} color="var(--color-text)" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  backgroundColor: 'var(--color-primary)', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700,
                  width: '18px', height: '18px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Login State or Profile Dropdown */}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'var(--color-alt-bg)', border: '1px solid var(--color-border)',
                    padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                    color: 'var(--color-text)', fontWeight: 600, fontSize: '0.82rem'
                  }}
                >
                  <User size={15} color="var(--color-primary)" />
                  <span>{user.phone}</span>
                  <ChevronDown size={14} />
                </button>

                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)',
                    borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: '180px', overflow: 'hidden', zIndex: 100
                  }}>
                    <a
                      href="#ordertracker"
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px', fontSize: '0.82rem', color: 'var(--color-text)',
                        textDecoration: 'none', borderBottom: '1px solid var(--color-border)'
                      }}
                    >
                      <Package size={15} /> My Orders
                    </a>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px', fontSize: '0.82rem', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <User size={15} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileDrawerOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>{config.name}</div>
              <button onClick={() => setIsMobileDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', fontWeight: 600 }}>
              <a href="#menu" onClick={() => setIsMobileDrawerOpen(false)} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Explore Menu</a>
              <a href="#reserve" onClick={() => setIsMobileDrawerOpen(false)} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Reserve a Table</a>
              <a href="#branches" onClick={() => setIsMobileDrawerOpen(false)} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Our Branches</a>
              <a href="#ordertracker" onClick={() => setIsMobileDrawerOpen(false)} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Track My Order</a>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={() => { setIsMobileDrawerOpen(false); setIsLoginModalOpen(true); }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={16} /> Customer Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branch Selector Modal */}
      <BranchModal 
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      {/* Customer Login Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
    </>
  );
}