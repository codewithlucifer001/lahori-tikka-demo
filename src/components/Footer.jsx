import config from '../config/lahoriTikka.config';
import { MessageCircle, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-secondary)',
      borderTop: '1px solid var(--color-border)',
      padding: '40px 24px 20px',
      color: 'var(--color-text-muted)',
      fontSize: '0.9rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* Brand Column */}
        <div>
          <h3 style={{ color: 'var(--color-text)', fontSize: '1.2rem', marginBottom: '10px' }}>
            {config.name}
          </h3>
          <p style={{ lineHeight: 1.6, fontSize: '0.85rem' }}>{config.tagline}</p>
          <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--color-accent)' }}>
            Free Delivery to F, G & E Sectors, Islamabad
          </p>
        </div>

        {/* Branches */}
        <div>
          <h4 style={{ color: 'var(--color-text)', marginBottom: '12px' }}>Branches</h4>
          {config.branches.map(b => (
            <div key={b.id} style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text)' }}>{b.name}:</span> {b.phone}
            </div>
          ))}
        </div>

        {/* Social & Contact */}
        <div>
          <h4 style={{ color: 'var(--color-text)', marginBottom: '12px' }}>Connect Directly</h4>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <a 
              href={config.socials.instagram} 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: '#E1306C', display: 'flex', alignItems: 'center' }}
              title="Instagram"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a 
              href={config.socials.whatsapp} 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: '#25D366', display: 'flex', alignItems: 'center' }}
              title="WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
        fontSize: '0.78rem'
      }}>
        © {new Date().getFullYear()} {config.name}. All rights reserved. Demo preview designed for client showcase.
      </div>
    </footer>
  );
}