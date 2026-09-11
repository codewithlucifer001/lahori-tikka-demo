import config from '../config/lahoriTikka.config';
import { Phone, MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      backgroundColor: 'var(--color-secondary)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }} className="header-container">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={config.logo} 
            alt={config.name} 
            style={{ height: '42px', width: '42px', objectFit: 'contain', borderRadius: '50%' }} 
          />
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--color-text)', margin: 0 }}>
              {config.name}
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)' }}>
              F-8 Markaz • Since {config.since}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a 
            href={`tel:${config.branches[0].phone}`} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)'
            }}
          >
            <Phone size={16} color="var(--color-accent)" />
            <span className="header-phone-text">{config.branches[0].phone}</span>
          </a>

          <a 
            href={config.socials.whatsapp} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}