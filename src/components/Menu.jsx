import { useState, useMemo } from 'react';
import config from '../config/lahoriTikka.config';
import BillTransparency from './BillTransparency';
import { Plus, Utensils, Search, X } from 'lucide-react';

export default function Menu() {
  const categories = Object.keys(config.menu);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [transitionKey, setTransitionKey] = useState(0);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setTransitionKey((prev) => prev + 1);
  };

  const handleImageError = (itemName) => {
    setImageErrors((prev) => ({ ...prev, [itemName]: true }));
  };

  const handleAddToCart = (item) => {
    const itemId = item.name;
    setLastAddedId(itemId);

    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, id: itemId, quantity: 1 }];
    });

    setTimeout(() => {
      setLastAddedId(null);
    }, 350);
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const displayedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return config.menu[activeCategory] || [];
    }

    const allDishes = [];
    Object.keys(config.menu).forEach((cat) => {
      (config.menu[cat] || []).forEach((dish) => {
        if (dish.name.toLowerCase().includes(query)) {
          allDishes.push({ ...dish, category: cat });
        }
      });
    });
    return allDishes;
  }, [searchQuery, activeCategory]);

  return (
    <section id="menu" style={{ padding: '48px 16px', backgroundColor: 'var(--color-bg)' }}>
      <style>{`
        @keyframes menuListFadeSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .menu-items-container {
          animation: menuListFadeSlide 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .menu-search-wrapper {
          position: relative;
          max-width: 480px;
          margin-bottom: 20px;
          width: 100%;
        }
        .menu-search-input {
          width: 100%;
          padding: 12px 38px 12px 42px;
          border-radius: 24px;
          background-color: var(--color-card-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .menu-search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.2);
        }

        @media (max-width: 480px) {
          .menu-item-row {
            padding: 10px 12px !important;
            gap: 10px !important;
          }
          .menu-item-thumb {
            width: 50px !important;
            height: 50px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title">Live Menu & Ordering</h2>

        {/* Search Input */}
        <div className="menu-search-wrapper">
          <Search 
            size={18} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            className="menu-search-input"
            placeholder="Search dishes (e.g. Malai Botti, Karahi, Naan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Smooth Horizontal Category Scroll */}
        {!searchQuery ? (
          <div className="customer-category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '24px',
                  border: activeCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-card-bg)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'background-color 150ms ease, border-color 150ms ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: '24px', color: 'var(--color-text-muted)', fontSize: '0.86rem' }}>
            Found <b style={{ color: 'var(--color-accent)' }}>{displayedItems.length}</b> dishes matching "{searchQuery}"
          </div>
        )}

        {/* Menu Grid & Bill Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '28px',
          alignItems: 'start'
        }}>
          <div key={transitionKey} className="menu-items-container" style={{ display: 'grid', gap: '14px' }}>
            {displayedItems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 20px',
                backgroundColor: 'var(--color-card-bg)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontSize: '0.9rem'
              }}>
                No dishes found matching your search.
              </div>
            ) : (
              displayedItems.map((item, index) => (
                <div
                  key={index}
                  className="menu-item-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div 
                      className="menu-item-thumb"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#121215',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.image && !imageErrors[item.name] ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={() => handleImageError(item.name)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <Utensils size={20} color="#64748b" />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{
                        fontSize: '0.92rem',
                        color: 'var(--color-text)',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem' }}>
                          Rs. {item.price}
                        </span>
                        {item.category && (
                          <span style={{
                            fontSize: '0.68rem',
                            color: '#94a3b8',
                            backgroundColor: '#262626',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary"
                    style={{
                      padding: '7px 12px',
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      flexShrink: 0
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              ))
            )}
          </div>

          <BillTransparency 
            cart={cart} 
            onRemoveItem={handleRemoveItem} 
            onClearCart={handleClearCart} 
            lastAddedId={lastAddedId}
          />
        </div>
      </div>
    </section>
  );
}