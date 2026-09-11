import { useState } from 'react';
import { Trash2, ShieldCheck, ArrowRight, Loader2, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function BillTransparency({ cart, onRemoveItem, onClearCart, lastAddedId }) {
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Customer Form Details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [formError, setFormError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please enter your name, phone number, and delivery address.');
      return;
    }
    setFormError('');
    setLoading(true);

    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        payment_method: paymentMethod,
        items: cart,
        subtotal,
        gst,
        total,
        status: 'Received'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        alert(`Supabase Database Error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        localStorage.setItem('active_order_id', data[0].id);
        setConfirmedOrder(data[0]);
        onClearCart();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Order submission failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const sendToWhatsApp = () => {
    if (!confirmedOrder) return;

    const bankDetails = confirmedOrder.payment_method === 'Bank Transfer'
      ? `\n*Bank:* Meezan Bank\n*Account Title:* Lahori Tikka\n*IBAN / A/C:* 01010102030405\n_(Please share payment screenshot here)_`
      : '';

    const msg = `*New Order Confirmed (#${String(confirmedOrder.id).slice(0, 6).toUpperCase()})*\n` +
      `*Customer:* ${confirmedOrder.customer_name}\n` +
      `*Phone:* ${confirmedOrder.phone}\n` +
      `*Address:* ${confirmedOrder.address}\n` +
      `*Payment:* ${confirmedOrder.payment_method}\n\n` +
      `*Items:*\n${(confirmedOrder.items || []).map((i) => `- ${i.name} (x${i.quantity}): Rs.${i.price * i.quantity}`).join('\n')}\n` +
      `GST (5%): Rs.${confirmedOrder.gst}\n` +
      `*Total: Rs.${confirmedOrder.total}*${bankDetails}`;

    window.open(`https://wa.me/923065550555?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-card-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '20px',
      position: 'sticky',
      top: '80px'
    }}>
      <style>{`
        @keyframes cartItemSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-18px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-cart-item {
          animation: cartItemSlideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

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
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '14px', paddingRight: '4px' }}>
            {cart.map((item) => {
              const isRecent = item.id === lastAddedId;
              return (
                <div 
                  key={item.id} 
                  className={isRecent ? 'animate-cart-item' : ''}
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
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery & Payment Form */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Delivery & Payment Details
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#121215',
                  border: '1px solid #2d3748',
                  color: 'white',
                  fontSize: '0.78rem',
                  boxSizing: 'border-box'
                }}
              />

              <input
                type="tel"
                placeholder="Phone Number (e.g. 0300 1234567) *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#121215',
                  border: '1px solid #2d3748',
                  color: 'white',
                  fontSize: '0.78rem',
                  boxSizing: 'border-box'
                }}
              />

              <textarea
                rows={2}
                placeholder="Complete Delivery Address (House #, Street, Sector) *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#121215',
                  border: '1px solid #2d3748',
                  color: 'white',
                  fontSize: '0.78rem',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />

              {/* Payment Selector */}
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Payment Method
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid ' + (paymentMethod === 'Cash on Delivery' ? '#C8102E' : '#2d3748'),
                      backgroundColor: paymentMethod === 'Cash on Delivery' ? 'rgba(200, 16, 46, 0.15)' : '#121215',
                      color: paymentMethod === 'Cash on Delivery' ? '#fff' : '#94a3b8'
                    }}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid ' + (paymentMethod === 'Bank Transfer' ? '#C8102E' : '#2d3748'),
                      backgroundColor: paymentMethod === 'Bank Transfer' ? 'rgba(200, 16, 46, 0.15)' : '#121215',
                      color: paymentMethod === 'Bank Transfer' ? '#fff' : '#94a3b8'
                    }}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>
            </div>

            {formError && (
              <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '6px' }}>
                {formError}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              <span>Govt. Tax (5%)</span>
              <span>Rs. {gst}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              paddingTop: '6px',
              borderTop: '1px dashed var(--color-border)'
            }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--color-accent)' }}>Rs. {total}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '14px', padding: '10px' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Place Order</span>}
            {!loading && <ArrowRight size={16} />}
          </button>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#12161f',
            border: '1px solid #2d3748',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle size={44} color="#22c55e" />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#f8fafc' }}>Order Received!</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 14px 0' }}>
              Order <b style={{ color: '#FFD700' }}>#{String(confirmedOrder.id).slice(0, 6).toUpperCase()}</b> has been registered for delivery.
            </p>

            <div style={{ backgroundColor: '#0d1117', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', textAlign: 'left' }}>
              <div style={{ marginBottom: '4px' }}><b>Delivery To:</b> {confirmedOrder.customer_name} ({confirmedOrder.phone})</div>
              <div style={{ marginBottom: '4px' }}><b>Address:</b> {confirmedOrder.address}</div>
              <div style={{ marginBottom: '4px' }}><b>Payment:</b> <span style={{ color: '#FFD700' }}>{confirmedOrder.payment_method}</span></div>
              <div style={{ borderTop: '1px dashed #2d3748', paddingTop: '6px', marginTop: '6px' }}>
                <b>Total: </b><span style={{ color: '#4ade80' }}>Rs. {confirmedOrder.total}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={sendToWhatsApp}
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={16} /> Send Order Details to WhatsApp
              </button>
              <button
                onClick={() => setConfirmedOrder(null)}
                style={{
                  backgroundColor: '#1e2430',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}