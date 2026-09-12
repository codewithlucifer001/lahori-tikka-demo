import { useState } from 'react';
import config from '../config/lahoriTikka.config';
import { MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={{
      backgroundColor: '#1A1A1A',
      color: '#FFFFFF',
      padding: '60px 24px 30px 24px',
      borderTop: '1px solid #333'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        
        {/* Column 1: Brand & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={config.logo} 
              alt={config.name} 
              style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '50%' }} 
            />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              {config.name}
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#A3A3A3', lineHeight: 1.6, margin: 0 }}>
            {config.tagline}. Authentic Lahori karahi, platters, and coal-grilled BBQ served fresh across Islamabad.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <a 
              href={config.socials.instagram} 
              target="_blank" 
              rel="noreferrer"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem'
              }}
              title="Instagram"
            >
              IG
            </a>
            <a 
              href={config.socials.whatsapp} 
              target="_blank" 
              rel="noreferrer"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#25D366', textDecoration: 'none'
              }}
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFD700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li><a href="#menu" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Explore Menu</a></li>
            <li><a href="#branches" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Branch Locator</a></li>
            <li><a href="#reservation" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Reserve a Table</a></li>
            <li><a href="#ordertracker" style={{ color: '#A3A3A3', textDecoration: 'none' }}>Order Tracker</a></li>
          </ul>
        </div>

        {/* Column 3: Newsletter Signup */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFD700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Stay Updated
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginBottom: '14px' }}>
            Get updates on new items & exclusive offers directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                backgroundColor: '#262626', border: '1px solid #383838',
                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
            >
              <Send size={14} /> Subscribe
            </button>
            {subscribed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '0.78rem', marginTop: '4px' }}>
                <CheckCircle2 size={14} /> Subscribed successfully!
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid #262626',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.78rem',
        color: '#888'
      }}>
        <span>© {new Date().getFullYear()} Lahori Tikka. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: '#888', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}