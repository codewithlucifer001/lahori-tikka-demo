import config from '../config/lahoriTikka.config';
import { Flame, Clock, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{
      backgroundColor: 'var(--color-bg)',
      borderBottom: '1px solid var(--color-border)',
      padding: '48px 24px',
      overflow: 'hidden'
    }}>
      <div className="hero-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left: Text & Badges */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(200, 16, 46, 0.15)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-accent)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Flame size={15} color="var(--color-primary)" />
            Original Taste Since {config.since}
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            lineHeight: 1.15,
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            Crispy Outside. <br />
            <span style={{ color: 'var(--color-primary)' }}>Juicy Inside.</span>
          </h2>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            Char-grilled over live coals for that signature smoky desi flavor. Serving authentic Lahori karahi, platters, and BBQ right in F-8 Markaz & Park View City.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a href="#menu" className="btn-primary">
              Explore Live Menu
            </a>
            <a href="#reserve" className="btn-accent">
              Reserve Table
            </a>
          </div>

          <div className="hero-badges" style={{
            display: 'flex',
            gap: '20px',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <MapPin size={16} color="var(--color-accent)" />
              <span>F-8 & Park View City</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <Clock size={16} color="var(--color-accent)" />
              <span>Free Delivery in F, G & E</span>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          border: '1px solid var(--color-border)'
        }}>
          <img 
            className="hero-img"
            src={config.heroImage} 
            alt="Lahori Tikka Specials" 
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '420px',
              objectFit: 'cover',
              display: 'block'
            }} 
          />
        </div>
      </div>
    </section>
  );
}