import { useState } from 'react';
import config from '../config/lahoriTikka.config';
import BillTransparency from './BillTransparency';
import { Plus } from 'lucide-react';

export default function Menu() {
  const categories = Object.keys(config.menu);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: item.name, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  return (
    <section id="menu" style={{ padding: '48px 24px', backgroundColor: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title">Live Menu & Ordering</h2>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                border: activeCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-card-bg)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid + Bill Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Menu Items List */}
          <div style={{ display: 'grid', gap: '14px' }}>
            {config.menu[activeCategory].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-text)', marginBottom: '4px' }}>
                    {item.name}
                  </h4>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.95rem' }}>
                    Rs. {item.price}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            ))}
          </div>

          {/* Transparent Live Bill Drawer */}
          <BillTransparency 
            cart={cart} 
            onRemoveItem={handleRemoveItem} 
            onClearCart={handleClearCart} 
          />
        </div>
      </div>
    </section>
  );
}