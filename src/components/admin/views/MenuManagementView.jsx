import { useState } from 'react';
import config from '../../../config/lahoriTikka.config';
import { Utensils, Check, Edit2 } from 'lucide-react';

export default function MenuManagementView() {
  const categories = Object.keys(config.menu || {});
  const [activeTab, setActiveTab] = useState(categories[0] || '');
  const [menuData, setMenuData] = useState(config.menu || {});
  const [editingItem, setEditingItem] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const handleStartEdit = (itemName, currentPrice) => {
    setEditingItem(itemName);
    setTempPrice(String(currentPrice));
  };

  const handleSavePrice = (category, itemName) => {
    const newPrice = Number(tempPrice);
    if (isNaN(newPrice) || newPrice <= 0) return;

    setMenuData(prev => ({
      ...prev,
      [category]: prev[category].map(dish => 
        dish.name === itemName ? { ...dish, price: newPrice } : dish
      )
    }));

    setEditingItem(null);
    setHasChanges(true);
  };

  const currentDishes = menuData[activeTab] || [];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Menu Management</h1>
          <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: '4px 0 0 0' }}>
            Inspect dishes and update live item pricing instantly.
          </p>
        </div>

        {hasChanges && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22C55E', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
            ⚠️ Unsaved demo changes active (Session Only)
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div style={{ backgroundColor: 'inherit', border: '1px solid inherit', borderRadius: '10px', padding: '4px 0' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                backgroundColor: activeTab === cat ? '#22C55E' : 'rgba(100, 116, 139, 0.1)',
                color: activeTab === cat ? '#ffffff' : 'inherit',
                border: 'none',
                borderRadius: '6px', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {currentDishes.map((dish) => {
          const isEditing = editingItem === dish.name;
          return (
            <div key={dish.name} style={{ backgroundColor: 'inherit', border: '1px solid rgba(100, 116, 139, 0.2)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(100,116,139,0.1)' }}>
                  {dish.image ? <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Utensils size={20} />}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, whiteCode: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{dish.name}</h4>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{activeTab}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(100, 116, 139, 0.15)', paddingTop: '12px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      style={{ width: '100px', padding: '6px 8px', backgroundColor: 'inherit', border: '1px solid #22C55E', borderRadius: '6px', color: 'inherit', fontSize: '0.85rem', outline: 'none' }}
                      autoFocus
                    />
                    <button onClick={() => handleSavePrice(activeTab, dish.name)} style={{ background: '#22C55E', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22C55E' }}>
                      Rs. {dish.price}
                    </span>
                    <button onClick={() => handleStartEdit(dish.name, dish.price)} style={{ background: 'rgba(100,116,139,0.1)', border: 'none', color: 'inherit', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Edit2 size={12} /> Edit Price
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}