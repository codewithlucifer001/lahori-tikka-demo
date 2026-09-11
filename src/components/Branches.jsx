import config from '../config/lahoriTikka.config';
import { MapPin, Phone } from 'lucide-react';

export default function Branches() {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: 'var(--color-secondary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title">Our Branches & Delivery Hubs</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {config.branches.map(branch => (
            <div
              key={branch.id}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '24px'
              }}
            >
              <h3 style={{ color: 'var(--color-text)', marginBottom: '12px', fontSize: '1.2rem' }}>
                {branch.name}
              </h3>
              <div style={{ display: 'flex', gap: '10px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span>{branch.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${branch.phone}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
                  {branch.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}