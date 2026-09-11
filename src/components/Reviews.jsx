import config from '../config/lahoriTikka.config';
import { Star } from 'lucide-react';

export default function Reviews() {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title">Verified Customer Ratings</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {config.reviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text)', marginBottom: '12px', fontSize: '0.95rem' }}>
                "{rev.text}"
              </p>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                — {rev.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}