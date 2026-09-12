import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../supabase';
import config from '../config/lahoriTikka.config';
import { X } from 'lucide-react';
import AdminLayout from './admin/AdminLayout';
import OverviewView from './admin/views/OverviewView';
import OrdersView from './admin/views/OrdersView';
import BranchesView from './admin/views/BranchesView';
import MenuManagementView from './admin/views/MenuManagementView';
import SettingsView from './admin/views/SettingsView';

function useCountUp(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimestampRef = useRef(null);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const startVal = previousValueRef.current;
    const endVal = Number(targetValue) || 0;
    if (startVal === endVal) { setDisplayValue(endVal); return; }

    let animationFrameId;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimestampRef.current) startTimestampRef.current = timestamp;
      const elapsed = timestamp - startTimestampRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startVal + (endVal - startVal) * easeOutCubic(progress));
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        previousValueRef.current = endVal;
        startTimestampRef.current = null;
      }
    };

    startTimestampRef.current = null;
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration]);

  return displayValue;
}

function groupRevenueByDay(ordersList, days = 7) {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const total = ordersList.filter(o => o.created_at && o.created_at.startsWith(dateStr)).reduce((sum, o) => sum + Number(o.total || 0), 0);
    result.push({ name: label, revenue: total });
  }
  return result;
}

function groupRevenueByWeek(ordersList, weeks = 4) {
  const result = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    const total = ordersList.filter(o => {
      if (!o.created_at) return false;
      const oDate = new Date(o.created_at);
      return oDate >= start && oDate <= end;
    }).reduce((sum, o) => sum + Number(o.total || 0), 0);
    result.push({ name: `Wk ${weeks - i}`, revenue: total });
  }
  return result;
}

export default function AdminDashboard({ onExit }) {
  const [activeView, setActiveView] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [showManualModal, setShowManualModal] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalBranch, setModalBranch] = useState('F-8 Markaz');
  const [activeCategory, setActiveCategory] = useState(
    config?.menu && typeof config.menu === 'object' && !Array.isArray(config.menu)
      ? Object.keys(config.menu)[0]
      : 'All'
  );

  const menuCategories = (() => {
    if (!config?.menu) return {};
    if (typeof config.menu === 'object' && !Array.isArray(config.menu)) return config.menu;
    return { 'All Dishes': config.menu };
  })();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const localOrders = JSON.parse(localStorage.getItem('lahori_local_orders') || '[]');
      const remoteOrders = (!error && data) ? data : [];
      const mergedMap = new Map();
      [...remoteOrders, ...localOrders].forEach(o => { if (o && o.id) mergedMap.set(o.id, o); });
      setOrders(Array.from(mergedMap.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
    } catch (err) {
      setOrders(JSON.parse(localStorage.getItem('lahori_local_orders') || '[]'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const channel = supabase.channel('realtime:orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => { fetchOrders(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id, status) => {
    if (String(id).startsWith('loc_')) {
      const localOrders = JSON.parse(localStorage.getItem('lahori_local_orders') || '[]');
      const updated = localOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('lahori_local_orders', JSON.stringify(updated));
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      return;
    }
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id) => {
    if (String(id).startsWith('loc_')) {
      const localOrders = JSON.parse(localStorage.getItem('lahori_local_orders') || '[]');
      const updated = localOrders.filter(o => o.id !== id);
      localStorage.setItem('lahori_local_orders', JSON.stringify(updated));
      setOrders(orders.filter(o => o.id !== id));
      return;
    }
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) setOrders(orders.filter(o => o.id !== id));
  };

  const resetAllOrders = async () => {
    if (!window.confirm("Clear all orders and reset revenue to zero permanently?")) return;
    localStorage.removeItem('lahori_local_orders');
    await supabase.from('orders').delete().neq('customer_name', '___NON_EXISTENT___');
    setOrders([]);
  };

  const handleAddItemToManual = (dish) => {
    const existing = selectedItems.find(i => i.id === dish.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (id, delta) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.id === id) {
        const next = item.quantity + delta;
        return next > 0 ? { ...item, quantity: next } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const submitManualOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;
    const newManualOrder = {
      id: 'loc_' + Date.now(),
      customer_name: customerName.trim() || 'Counter Walk-in',
      phone: 'Counter / Call',
      address: `${modalBranch} — Counter Pickup`,
      payment_method: 'Cash on Delivery',
      items: selectedItems,
      subtotal, gst, total,
      status: 'Received',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('orders').insert([newManualOrder]);
    } catch (err) {
      const existingLocal = JSON.parse(localStorage.getItem('lahori_local_orders') || '[]');
      localStorage.setItem('lahori_local_orders', JSON.stringify([newManualOrder, ...existingLocal]));
    } finally {
      setShowManualModal(false);
      setCustomerName('');
      setSelectedItems([]);
      fetchOrders();
    }
  };

  const branchFilteredOrders = useMemo(() => {
    if (selectedBranch === 'All Branches') return orders;
    return orders.filter(o => {
      const addr = (o.address || '').toLowerCase();
      const target = selectedBranch.toLowerCase();
      if (target.includes('park view')) return addr.includes('park view');
      if (target.includes('f-8')) return addr.includes('f-8') || addr.includes('f8') || (!addr.includes('park view'));
      return true;
    });
  }, [orders, selectedBranch]);

  const totalRevenue = branchFilteredOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalGst = branchFilteredOrders.reduce((sum, o) => sum + Number(o.gst || 0), 0);
  const activeOrders = branchFilteredOrders.filter(o => o.status !== 'Delivered').length;
  const totalOrdersCount = branchFilteredOrders.length;

  const animatedRevenue = useCountUp(totalRevenue);
  const animatedQueue = useCountUp(activeOrders);
  const animatedOrders = useCountUp(totalOrdersCount);
  const animatedTax = useCountUp(totalGst);

  const filteredOrders = filter === 'all' ? branchFilteredOrders : branchFilteredOrders.filter(o => o.status?.toLowerCase() === filter.toLowerCase());
  const weeklyData = useMemo(() => groupRevenueByDay(branchFilteredOrders, 7), [branchFilteredOrders]);
  const monthlyData = useMemo(() => groupRevenueByWeek(branchFilteredOrders, 4), [branchFilteredOrders]);

  const hotProducts = useMemo(() => {
    const counts = {};
    branchFilteredOrders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!item.name) return;
          counts[item.name] = (counts[item.name] || 0) + (Number(item.quantity) || 1);
        });
      }
    });
    const sorted = Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCount = sorted.length > 0 ? sorted[0].count : 1;
    return sorted.map(item => ({ ...item, percentage: Math.round((item.count / maxCount) * 100) }));
  }, [branchFilteredOrders]);

  const manualSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const manualGst = Math.round(manualSubtotal * 0.05);
  const manualTotal = manualSubtotal + manualGst;
  const currentCategoryDishes = menuCategories[activeCategory] || [];

  return (
    <AdminLayout
      activeView={activeView}
      setActiveView={setActiveView}
      onNewOrder={() => setShowManualModal(true)}
      onResetDatabase={resetAllOrders}
      onExit={onExit}
    >
      {activeView === 'overview' && (
        <OverviewView
          animatedRevenue={animatedRevenue}
          animatedQueue={animatedQueue}
          animatedOrders={animatedOrders}
          animatedTax={animatedTax}
          weeklyData={weeklyData}
          monthlyData={monthlyData}
          hotProducts={hotProducts}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      )}

      {activeView === 'orders' && (
        <OrdersView
          orders={filteredOrders}
          loading={loading}
          filter={filter}
          setFilter={setFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedBranch={selectedBranch}
          updateStatus={updateStatus}
          deleteOrder={deleteOrder}
          fetchOrders={fetchOrders}
        />
      )}

      {activeView === 'branches' && <BranchesView orders={orders} />}
      {activeView === 'menu' && <MenuManagementView />}
      {activeView === 'settings' && <SettingsView />}

      {/* Manual Order Modal */}
      {showManualModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 7, 10, 0.78)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, padding: '14px' }}>
          <div style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '16px', width: '100%', maxWidth: '940px', height: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--admin-surface)' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: 'var(--admin-text)' }}>Cashier Order Entry</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Select dishes to assemble order receipt</span>
              </div>
              <button onClick={() => setShowManualModal(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {Object.keys(menuCategories).map((catKey) => (
                    <button key={catKey} type="button" onClick={() => setActiveCategory(catKey)} style={{ backgroundColor: activeCategory === catKey ? 'var(--admin-accent)' : 'var(--admin-surface-hover)', color: activeCategory === catKey ? '#fff' : 'var(--admin-text-muted)', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}>{catKey}</button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '6px' }}>
                  {currentCategoryDishes.map((dish) => (
                    <div key={dish.id || dish.name} onClick={() => handleAddItemToManual(dish)} style={{ backgroundColor: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '8px' }}>{dish.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: 700 }}>Rs. {dish.price}</span>
                        <span style={{ backgroundColor: 'var(--admin-accent)', color: 'white', borderRadius: '5px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 600 }}>+ Add</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--admin-bg)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input type="text" placeholder="Table / Customer" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'white', fontSize: '0.8rem' }} />
                  <select value={modalBranch} onChange={e => setModalBranch(e.target.value)} style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '6px', color: 'var(--admin-text)', fontSize: '0.76rem', fontWeight: 600, padding: '0 8px', cursor: 'pointer' }}>
                    <option value="F-8 Markaz">F-8 Markaz</option>
                    <option value="Park View City">Park View City</option>
                  </select>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                  {selectedItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>Click dishes on the left to assemble bill.</div>
                  ) : (
                    selectedItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--admin-border)', fontSize: '0.8rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{item.name}</div>
                          <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem' }}>Rs. {item.price} each</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button type="button" onClick={() => handleUpdateQty(item.id, -1)} style={{ background: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button type="button" onClick={() => handleUpdateQty(item.id, 1)} style={{ background: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                          <span style={{ minWidth: '60px', textAlign: 'right', fontWeight: 700, color: 'var(--admin-accent)' }}>Rs. {item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px', marginTop: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: 'var(--admin-text-muted)' }}><span>Subtotal</span><span>Rs. {manualSubtotal}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--admin-text-muted)' }}><span>Govt Tax (5%)</span><span>Rs. {manualGst}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--admin-accent)', marginBottom: '16px' }}><span>Total Bill</span><span>Rs. {manualTotal}</span></div>
                  <button type="button" onClick={submitManualOrder} disabled={selectedItems.length === 0} style={{ width: '100%', backgroundColor: selectedItems.length === 0 ? 'var(--admin-surface-hover)' : 'var(--admin-accent)', color: 'white', border: 'none', borderRadius: '8px', padding: '11px', fontWeight: 700, fontSize: '0.84rem', cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer' }}>Confirm & Dispatch Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}