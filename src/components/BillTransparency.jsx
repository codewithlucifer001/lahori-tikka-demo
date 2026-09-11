import { Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BillTransparency({ cart, onRemoveItem, onClearCart }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST transparency
  const total = subtotal + gst;

  return (
    <div style={{
      backgroundColor: 'var(--color-card-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '20px',
      position: 'sticky',
      top: '80px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', margin: 0 }}>
          Your Live Bill
        </h3>
        {cart.length > 0 && (
          <button 
            onClick={onClearCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Your tray is empty. Tap any dish from the menu to build your transparent bill.
        </div>
      ) : (
        <>
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #262626',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    Rs. {item.price} × {item.quantity}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                    Rs. {item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
              <span>Govt. Tax & Service (5%)</span>
              <span>Rs. {gst}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              paddingTop: '8px',
              borderTop: '1px dashed var(--color-border)'
            }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--color-accent)' }}>Rs. {total}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '6px',
            padding: '8px',
            marginTop: '14px',
            fontSize: '0.75rem',
            color: '#4ade80'
          }}>
            <ShieldCheck size={16} />
            <span>100% Bill Transparency: Zero unapproved items.</span>
          </div>

          <a 
            href={`https://wa.me/923065550555?text=${encodeURIComponent(
              `New Order from Website:\n${cart.map(i => `- ${i.name} (x${i.quantity}): Rs.${i.price * i.quantity}`).join('\n')}\nGST (5%): Rs.${gst}\nTotal: Rs.${total}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '14px', padding: '10px' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </a>
        </>
      )}
    </div>
  );
}