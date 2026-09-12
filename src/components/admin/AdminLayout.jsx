import { useState } from 'react';
import { LayoutDashboard, ClipboardList, MapPin, UtensilsCrossed, Settings, Plus, ArrowLeft, RotateCcw, Menu, X, Sun, Moon, MapPin as MapPinIcon, ChevronDown } from 'lucide-react';
import config from '../../config/lahoriTikka.config';

export default function AdminLayout({ activeView, setActiveView, onNewOrder, onResetDatabase, onExit, children }) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
      setTimeout(() => setIsAnimating(false), 300);
    }, 250);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'branches', label: 'Branches', icon: MapPin },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    setIsMobileDrawerOpen(false);
  };

  const isDark = themeMode === 'dark';

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: isDark ? '#090A0F' : '#F8FAFC', 
      color: isDark ? '#F3F4F6' : '#0F172A', 
      fontFamily: 'sans-serif', 
      overflow: 'hidden', 
      position: 'relative',
      transition: 'background-color 0.4s ease, color 0.4s ease'
    }}>
      <style>{`
        :root {
          --admin-bg: ${isDark ? '#090A0F' : '#F8FAFC'};
          --admin-surface: ${isDark ? '#12141C' : '#FFFFFF'};
          --admin-surface-hover: ${isDark ? '#1A1D29' : '#F1F5F9'};
          --admin-border: ${isDark ? '#222634' : '#E2E8F0'};
          --admin-text: ${isDark ? '#F3F4F6' : '#0F172A'};
          --admin-text-muted: ${isDark ? '#9CA3AF' : '#64748B'};
          --admin-accent: #22C55E;
          --admin-accent-hover: #16A34A;
        }

        .curtain-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background-color: ${isDark ? '#090A0F' : '#F8FAFC'};
          z-index: 99999;
          clip-path: circle(0% at 95% 5%);
          transition: clip-path 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          pointer-events: none;
        }
        .curtain-overlay.active {
          clip-path: circle(150% at 95% 5%);
        }
        .admin-desktop-sidebar { display: flex; }
        .admin-mobile-topbar { display: none; }
        .admin-mobile-drawer-overlay { display: none; }

        @media (max-width: 900px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
          .admin-mobile-drawer-overlay { display: flex !important; }
        }
      `}</style>

      <div className={`curtain-overlay ${isAnimating ? 'active' : ''}`} />

      {/* Mobile Top Header */}
      <div className="admin-mobile-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        backgroundColor: isDark ? '#12141C' : '#FFFFFF', 
        borderBottom: isDark ? '1px solid #222634' : '1px solid #E2E8F0',
        padding: '0 20px', alignItems: 'center', justifyContent: 'space-between', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            style={{ background: 'none', border: 'none', color: isDark ? '#F3F4F6' : '#0F172A', cursor: 'pointer', padding: '4px' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={config.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Lahori Tikka Manager</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            style={{ background: isDark ? '#1A1D29' : '#F1F5F9', border: isDark ? '1px solid #222634' : '1px solid #E2E8F0', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#22C55E' }}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onNewOrder}
            style={{ backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
          >
            <Plus size={14} /> New
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="admin-mobile-drawer-overlay" onClick={() => setIsMobileDrawerOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999, backdropFilter: 'blur(4px)', justifyContent: 'flex-start'
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '260px', height: '100%', backgroundColor: isDark ? '#12141C' : '#FFFFFF', borderRight: isDark ? '1.5px solid #222634' : '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: isDark ? '1px solid #222634' : '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={config.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Manager Portal</div>
              </div>
              <button onClick={() => setIsMobileDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px',
                      backgroundColor: isActive ? (isDark ? '#1A1D29' : '#F1F5F9') : 'transparent',
                      color: isActive ? '#22C55E' : (isDark ? '#9CA3AF' : '#64748B'),
                      border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <Icon size={18} /> {item.label}
                  </button>
                );
              })}
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: isDark ? '1px solid #222634' : '1px solid #E2E8F0' }}>
              <button onClick={() => { setIsMobileDrawerOpen(false); onResetDatabase(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', backgroundColor: 'transparent', color: isDark ? '#9CA3AF' : '#64748B', border: 'none', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Reset Database
              </button>
              <button onClick={() => { setIsMobileDrawerOpen(false); onExit(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', backgroundColor: isDark ? '#1A1D29' : '#F1F5F9', color: isDark ? '#F3F4F6' : '#0F172A', border: isDark ? '1px solid #222634' : '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                <ArrowLeft size={14} /> Back to Site
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <aside className="admin-desktop-sidebar" style={{ 
        width: '245px', 
        backgroundColor: isDark ? '#12141C' : '#FFFFFF', 
        borderRight: isDark ? '1.5px solid #222634' : '1.5px solid #E2E8F0', 
        flexDirection: 'column', 
        padding: '24px 20px', 
        flexShrink: 0,
        transition: 'background-color 0.4s ease, border-color 0.4s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '16px', borderBottom: isDark ? '1px solid #222634' : '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1A1D29', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isDark ? '1px solid #222634' : '1px solid #E2E8F0' }}>
              <img src={config.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Lahori Tikka</div>
              <div style={{ fontSize: '0.68rem', color: isDark ? '#9CA3AF' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manager POS</div>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            style={{ 
              background: isDark ? '#1A1D29' : '#F1F5F9', 
              border: isDark ? '1px solid #222634' : '1px solid #E2E8F0', 
              borderRadius: '8px', 
              padding: '8px', 
              cursor: 'pointer', 
              color: '#22C55E',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        <button
          onClick={onNewOrder}
          style={{ width: '100%', backgroundColor: '#22C55E', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 14px', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)' }}
        >
          <Plus size={16} /> New Order Entry
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px',
                  backgroundColor: isActive ? (isDark ? '#1A1D29' : '#F1F5F9') : 'transparent',
                  color: isActive ? '#22C55E' : (isDark ? '#9CA3AF' : '#64748B'),
                  border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: isDark ? '1px solid #222634' : '1px solid #E2E8F0' }}>
          <button
            onClick={onResetDatabase}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', backgroundColor: 'transparent', color: isDark ? '#9CA3AF' : '#64748B', border: 'none', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
          >
            <RotateCcw size={14} /> Reset Database
          </button>
          <button
            onClick={onExit}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', backgroundColor: isDark ? '#1A1D29' : '#F1F5F9', color: isDark ? '#F3F4F6' : '#0F172A', border: isDark ? '1px solid #222634' : '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> Back to Site
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        backgroundColor: isDark ? '#090A0F' : '#F8FAFC', 
        color: isDark ? '#F3F4F6' : '#0F172A',
        padding: '32px', 
        marginTop: window.innerWidth <= 900 ? '60px' : '0' 
      }}>
        {children}
      </main>

    </div>
  );
}