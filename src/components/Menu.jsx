import { useState, useMemo } from 'react';
import config from '../config/lahoriTikka.config';
import BillTransparency from './BillTransparency';
import { Plus, Utensils, Search, X, Drumstick, Beef, Flame, Soup, Fish, Wheat, CupSoda, ShoppingBag } from 'lucide-react';

// Map category names to lucide-react icons
const categoryIcons = {
  Chicken: Drumstick,
  Mutton: Beef,
  Karahi: Flame,
  Handi: Soup,
  Fish: Fish,
  Tandoor: Wheat,
  Beverages: CupSoda
};

export default function Menu({ cart, onAddToCart, onRemoveItem, onClearCart, lastAddedId, onScrollToBill }) {
  const categories = Object.keys(config.menu);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section id="menu" style={{ padding: '48px 16px', backgroundColor: 'var(--color-bg)', position: 'relative' }}>
      <style>{`
        @keyframes menuListFadeSlide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .menu-grid-container {
          animation: menuListFadeSlide 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .menu-search-wrapper {
          position: relative;
          max-width: 480px;
          margin-bottom: 24px;
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
        }
        .menu-search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.15);
        }
        .menu-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }
        .mobile-floating-cart {
          display: none;
        }
        @media (max-width: 768px) {
          .menu-workspace-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-floating-cart {
            display: flex;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999;
            background-color: var(--color-primary, #C8102E);
            color: #fff;
            padding: 14px 20px;
            border-radius: 30px;
            box-shadow: 0 6px 20px rgba(200, 16, 46, 0.5);
            align-items: center;
            gap: 10px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            font-size: 0.9rem;
          }
        }
        @media (max-width: 480px) {
          .menu-grid-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
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
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Circular Category Icons Row */}
        {!searchQuery ? (
          <div className="customer-category-scroll" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
            {categories.map((cat) => {
              const IconComponent = categoryIcons[cat] || Utensils;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    flexShrink: 0, outline: 'none'
                  }}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-alt-bg, #F7F7F7)',
                    border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    color: isActive ? '#fff' : 'var(--color-text)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? '0 4px 12px rgba(200,16,46,0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}>
                    <IconComponent size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                    whiteSpace: 'nowrap'
                  }}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ marginBottom: '24px', color: 'var(--color-text-muted)', fontSize: '0.86rem' }}>
            Found <b style={{ color: 'var(--color-primary)' }}>{displayedItems.length}</b> dishes matching "{searchQuery}"
          </div>
        )}

        {/* Menu Grid & Bill Panel Layout */}
        <div className="menu-workspace-grid">
          
          {/* Responsive Card Grid */}
          <div key={transitionKey} className="menu-grid-container">
            {displayedItems.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px',
                backgroundColor: 'var(--color-card-bg)', borderRadius: '12px',
                border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.9rem'
              }}>
                No dishes found matching your search.
              </div>
            ) : (
              displayedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--color-card-bg, #FFFFFF)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Item Image (4:3 Ratio) */}
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#f1f5f9', overflow: 'hidden', position: 'relative' }}>
                    {item.image && !imageErrors[item.name] ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={() => handleImageError(item.name)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <Utensils size={28} />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <h4 style={{ fontSize: '0.92rem', color: 'var(--color-text)', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                      {item.name}
                    </h4>
                    {item.category && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-alt-bg)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                        {item.category}
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                        Rs. {item.price}
                      </span>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '6px' }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Live Bill Panel */}
          <div>
            <BillTransparency 
              cart={cart} 
              onRemoveItem={onRemoveItem} 
              onClearCart={onClearCart} 
              lastAddedId={lastAddedId}
            />
          </div>
        </div>
      </div>

      {/* Persistent Mobile Floating Cart Button */}
      {totalCartCount > 0 && (
        <button onClick={onScrollToBill} className="mobile-floating-cart">
          <ShoppingBag size={18} />
          <span>View Bill ({totalCartCount})</span>
        </button>
      )}
    </section>
  );
}