import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../supabase';
import config from '../config/lahoriTikka.config';
import { 
  ArrowLeft, Plus, RefreshCw, Trash2, X, Flame, MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

function useCountUp(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimestampRef = useRef(null);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const startVal = previousValueRef.current;
    const endVal = Number(targetValue) || 0;
    
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let animationFrameId;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimestampRef.current) startTimestampRef.current = timestamp;
      const elapsed = timestamp - startTimestampRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = Math.round(startVal + (endVal - startVal) * easedProgress);
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

    const total = ordersList
      .filter(o => o.created_at && o.created_at.startsWith(dateStr))
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

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

    const total = ordersList
      .filter(o => {
        if (!o.created_at) return false;
        const oDate = new Date(o.created_at);
        return oDate >= start && oDate <= end;
      })
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    result.push({ name: `Wk ${weeks - i}`, revenue: total });
  }
  return result;
}

export default function AdminDashboard({ onExit }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
    if (typeof config.menu === 'object' && !Array.isArray(config.menu)) {
      return config.menu;
    }
    return { 'All Dishes': config.menu };
  })();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('realtime:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const resetAllOrders = async () => {
    if (!window.confirm("Clear all orders and reset revenue to zero permanently?")) return;
    const { error } = await supabase.from('orders').delete().neq('customer_name', '___NON_EXISTENT___');
    if (!error) {
      setOrders([]);
    } else {
      console.error('Failed to reset:', error.message);
    }
  };

  const handleAddItemToManual = (dish) => {
    const existing = selectedItems.find(i => i.id === dish.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
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

    const { error } = await supabase.from('orders').insert([{
      customer_name: customerName.trim() || 'Counter Walk-in',
      phone: 'Counter / Call',
      address: `${modalBranch} — Counter Pickup`,
      payment_method: 'Cash on Delivery',
      items: selectedItems,
      subtotal,
      gst,
      total,
      status: 'Received'
    }]);

    if (!error) {
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

  const filteredOrders = filter === 'all' 
    ? branchFilteredOrders 
    : branchFilteredOrders.filter(o => o.status?.toLowerCase() === filter.toLowerCase());

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

    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxCount = sorted.length > 0 ? sorted[0].count : 1;
    return sorted.map(item => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100)
    }));
  }, [branchFilteredOrders]);

  const manualSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const manualGst = Math.round(manualSubtotal * 0.05);
  const manualTotal = manualSubtotal + manualGst;

  const currentCategoryDishes = menuCategories[activeCategory] || [];

  return (
    <div className="pos-app">
      <style>{`
        .pos-app {
          background-color: #0b0d11;
          min-height: 100vh;
          color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }
        .pos-topbar {
          background: #11141b;
          border-bottom: 1px solid #1e2430;
          padding: 14px 28px;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        .pos-brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pos-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }
        .pos-btn {
          border-radius: 6px;
          padding: 8px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: none;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .pos-grid-kpi {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 16px 28px 20px 28px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .pos-kpi {
          background: rgba(17, 17, 17, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .pos-kpi:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .pos-kpi-label {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pos-kpi-val {
          font-size: 1.65rem;
          font-weight: 800;
          margin-top: 6px;
        }

        .pos-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 0 28px 20px 28px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .pos-chart-card {
          background: #11141b;
          border: 1px solid #1e2430;
          border-radius: 10px;
          padding: 20px 20px 14px 20px;
        }
        .pos-chart-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 14px;
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }
        .pos-chart-subtitle {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 400;
        }

        .pos-hot-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 28px 24px 28px;
        }
        .pos-hot-card {
          background: #11141b;
          border: 1px solid #1e2430;
          border-radius: 10px;
          padding: 20px 24px;
        }
        .pos-hot-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid #171d27;
        }
        .pos-hot-row:last-child {
          border-bottom: none;
          padding-bottom: 2px;
        }

        .pos-main-workspace {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 28px 40px 28px;
        }
        .pos-table-card {
          background: #11141b;
          border: 1px solid #1e2430;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Desktop Table View */
        .pos-table-desktop {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.82rem;
        }
        .pos-table-desktop th {
          padding: 12px 18px;
        }
        .pos-table-desktop td {
          padding: 14px 18px;
          border-bottom: 1px solid #181d27;
        }

        /* Mobile Card View (STEP 12) */
        .pos-cards-mobile {
          display: none;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
        }
        .pos-order-card {
          background: #151923;
          border: 1px solid #232c3d;
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Modal Styles */
        @keyframes modalOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSpringPop {
          0% {
            opacity: 0;
            transform: scale(0.93) translateY(16px);
          }
          70% {
            transform: scale(1.01) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .pos-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(5, 7, 10, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          justifyContent: center;
          align-items: center;
          z-index: 99999;
          padding: 14px;
          animation: modalOverlayFade 180ms ease-out forwards;
        }
        .pos-modal-window {
          background: #11151e;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          width: 100%;
          max-width: 940px;
          height: 82vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.04);
          animation: modalSpringPop 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pos-modal-body {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          flex: 1;
          overflow: hidden;
        }
        .pos-cat-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .pos-dish-card {
          background: #151a26;
          border: 1px solid #232c3d;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }
        .pos-dish-card:hover {
          border-color: rgba(200, 16, 46, 0.7);
          background: #19202e;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        .pos-dish-card:active {
          transform: scale(0.97);
        }

        /* Responsive Breakpoints (STEP 12) */
        @media (max-width: 960px) {
          .pos-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .pos-topbar {
            padding: 12px 16px;
            flex-wrap: wrap;
            gap: 12px;
          }
          .pos-brand-subtitle {
            display: none;
          }
          .pos-actions-group {
            width: 100%;
            justify-content: space-between;
            gap: 6px;
            margin-left: 0;
          }
          .pos-btn {
            flex: 1;
            padding: 8px 6px;
            font-size: 0.74rem;
          }
          .pos-grid-kpi {
            grid-template-columns: repeat(2, 1fr); /* 2x2 grid */
            gap: 10px;
            padding: 14px 16px;
          }
          .pos-charts-grid,
          .pos-hot-section,
          .pos-main-workspace {
            padding-left: 16px;
            padding-right: 16px;
          }
          .pos-table-desktop {
            display: none; /* Hide wide table */
          }
          .pos-cards-mobile {
            display: flex; /* Stacked order cards */
          }
          .pos-modal-window {
            height: 94vh;
          }
          .pos-modal-body {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
        }

        @media (max-width: 480px) {
          .pos-grid-kpi {
            grid-template-columns: 1fr; /* Full vertical stack on 375px screens */
            gap: 8px;
          }
          .pos-kpi {
            padding: 14px 16px;
          }
          .pos-kpi-val {
            font-size: 1.45rem;
          }
          .pos-hot-row {
            flex-wrap: wrap;
            gap: 8px;
          }
          .pos-hot-row > div:nth-child(2) {
            width: 140px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="pos-topbar">
        <div className="pos-brand-group">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#C8102E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: 'white',
            flexShrink: 0
          }}>
            LT
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc', lineHeight: 1.2 }}>
              Lahori Tikka Manager POS
            </div>
            <div className="pos-brand-subtitle" style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
              Operations Control & Table Service
            </div>
          </div>
        </div>

        <div className="pos-actions-group">
          <button
            onClick={resetAllOrders}
            className="pos-btn"
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8' }}
          >
            Reset Database
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="pos-btn"
            style={{ background: '#C8102E', color: 'white' }}
          >
            <Plus size={15} /> <span>New Order</span>
          </button>
          <button
            onClick={onExit}
            className="pos-btn"
            style={{ background: '#1c222e', border: '1px solid #283040', color: '#cbd5e1' }}
          >
            <ArrowLeft size={14} /> <span>Back</span>
          </button>
        </div>
      </header>

      {/* Branch Filter Navigation Strip */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 16px 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color="#FFD700" />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Hub Branch:
          </span>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {['All Branches', 'F-8 Markaz', 'Park View City'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                style={{
                  backgroundColor: selectedBranch === b ? '#FFD700' : '#141822',
                  color: selectedBranch === b ? '#000000' : '#94a3b8',
                  border: '1px solid ' + (selectedBranch === b ? '#FFD700' : '#222938'),
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
          Active: <b style={{ color: '#f8fafc' }}>{selectedBranch}</b>
        </span>
      </div>

      {/* KPI Cards (Stack 2x2 or 1x1 on mobile) */}
      <div className="pos-grid-kpi">
        <div className="pos-kpi">
          <div className="pos-kpi-label">Gross Revenue</div>
          <div className="pos-kpi-val" style={{ color: '#FFD700' }}>
            Rs. {animatedRevenue.toLocaleString()}
          </div>
        </div>
        <div className="pos-kpi">
          <div className="pos-kpi-label">Active Queue</div>
          <div className="pos-kpi-val" style={{ color: '#38bdf8' }}>
            {animatedQueue}
          </div>
        </div>
        <div className="pos-kpi">
          <div className="pos-kpi-label">Total Orders</div>
          <div className="pos-kpi-val">
            {animatedOrders}
          </div>
        </div>
        <div className="pos-kpi">
          <div className="pos-kpi-label">PRA Tax (5%)</div>
          <div className="pos-kpi-val">
            Rs. {animatedTax.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="pos-charts-grid">
        <div className="pos-chart-card">
          <div className="pos-chart-title">
            <span>Weekly Sales</span>
            <span className="pos-chart-subtitle">Last 7 Days (PKR)</span>
          </div>
          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8102E" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#C8102E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '0.78rem' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C8102E" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#crimsonGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pos-chart-card">
          <div className="pos-chart-title">
            <span>Monthly Sales</span>
            <span className="pos-chart-subtitle">Last 4 Weeks (PKR)</span>
          </div>
          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '0.78rem' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hot Products Ranking Section */}
      <div className="pos-hot-section">
        <div className="pos-hot-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Flame size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Hot Products
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: 'auto' }}>
              Top 5 in {selectedBranch}
            </span>
          </div>

          {hotProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.8rem' }}>
              No branch sales recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {hotProducts.map((dish, idx) => (
                <div key={dish.name} className="pos-hot-row">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: idx === 0 ? '#C8102E' : '#1c222e',
                    border: '1px solid ' + (idx === 0 ? '#C8102E' : '#283040'),
                    color: idx === 0 ? 'white' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    flexShrink: 0
                  }}>
                    #{idx + 1}
                  </div>

                  <div style={{ width: '220px', minWidth: '150px', fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dish.name}
                  </div>

                  <div style={{ flex: 1, height: '8px', backgroundColor: '#171d27', borderRadius: '4px', overflow: 'hidden', minWidth: '70px' }}>
                    <div style={{
                      width: `${dish.percentage}%`,
                      height: '100%',
                      backgroundColor: '#FFD700',
                      borderRadius: '4px',
                      transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>

                  <div style={{ minWidth: '65px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 700, color: '#FFD700' }}>
                    {dish.count} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.7rem' }}>sold</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Order Workspace */}
      <div className="pos-main-workspace">
        <div className="pos-table-card">
          
          {/* Controls Bar */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid #1e2430',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {['all', 'Received', 'Cooking', 'Out for Delivery', 'Delivered'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  style={{
                    backgroundColor: filter === tag ? '#C8102E' : '#1c222e',
                    color: filter === tag ? '#ffffff' : '#94a3b8',
                    border: '1px solid ' + (filter === tag ? '#C8102E' : '#283040'),
                    borderRadius: '5px',
                    padding: '5px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={fetchOrders}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Orders Section */}
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Updating order records...</div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>No orders found under "{filter}" for {selectedBranch}.</div>
          ) : (
            <>
              {/* 1. Desktop Full Table */}
              <table className="pos-table-desktop">
                <thead>
                  <tr style={{ backgroundColor: '#0d1017', color: '#64748b', borderBottom: '1px solid #1e2430' }}>
                    <th>Order</th>
                    <th>Customer & Phone</th>
                    <th>Delivery Address</th>
                    <th>Payment</th>
                    <th>Dishes</th>
                    <th>Amount</th>
                    <th>Kitchen State</th>
                    <th>Time</th>
                    <th style={{ textAlign: 'right' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', color: '#FFD700', fontWeight: 600 }}>
                        #{String(order.id).slice(0, 6).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{order.customer_name || 'Walk-in'}</div>
                        {order.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{order.phone}</div>}
                      </td>
                      <td style={{ maxWidth: '180px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        {order.address || 'Counter / Dine-in'}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: order.payment_method === 'Bank Transfer' ? '#38bdf8' : '#4ade80',
                          border: '1px solid ' + (order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(34, 197, 94, 0.3)'),
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}>
                          {order.payment_method || 'COD'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {Array.isArray(order.items) && order.items.map((it, idx) => (
                            <span key={idx} style={{
                              backgroundColor: '#1c222e',
                              border: '1px solid #283040',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.72rem'
                            }}>
                              {it.name} <b style={{ color: '#f59e0b' }}>×{it.quantity}</b>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                        Rs. {order.total}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{
                            backgroundColor: '#1c222e',
                            color: order.status === 'Delivered' ? '#4ade80' : '#f59e0b',
                            border: '1px solid #283040',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Received">Received</option>
                          <option value="Cooking">Cooking</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Purge order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 2. Mobile Stacked Cards (≤768px and 375px) */}
              <div className="pos-cards-mobile">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="pos-order-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', color: '#FFD700', fontWeight: 700, fontSize: '0.85rem' }}>
                        #{String(order.id).slice(0, 6).toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                          {order.customer_name || 'Walk-in'}
                        </div>
                        {order.phone && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.phone}</div>}
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          {order.address || 'Dine-in / Pickup'}
                        </div>
                      </div>
                      <span style={{
                        backgroundColor: order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                        color: order.payment_method === 'Bank Transfer' ? '#38bdf8' : '#4ade80',
                        border: '1px solid ' + (order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(34, 197, 94, 0.3)'),
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 600
                      }}>
                        {order.payment_method || 'COD'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0' }}>
                      {Array.isArray(order.items) && order.items.map((it, idx) => (
                        <span key={idx} style={{
                          backgroundColor: '#1c222e',
                          border: '1px solid #283040',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem'
                        }}>
                          {it.name} <b style={{ color: '#f59e0b' }}>×{it.quantity}</b>
                        </span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px dashed #232c3d',
                      paddingTop: '8px',
                      marginTop: '4px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                        Rs. {order.total}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{
                            backgroundColor: '#1c222e',
                            color: order.status === 'Delivered' ? '#4ade80' : '#f59e0b',
                            border: '1px solid #283040',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Received">Received</option>
                          <option value="Cooking">Cooking</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Purge"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* POS Manual Order Modal */}
      {showManualModal && (
        <div className="pos-modal-overlay">
          <div className="pos-modal-window">
            
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#141822'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#f8fafc' }}>
                  Cashier Order Entry
                </h2>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Select dishes to assemble order receipt
                </span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="pos-modal-body">
              <div style={{ padding: '16px', borderRight: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                <div className="pos-cat-scroll">
                  {Object.keys(menuCategories).map((catKey) => (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setActiveCategory(catKey)}
                      style={{
                        backgroundColor: activeCategory === catKey ? '#C8102E' : '#171c26',
                        color: activeCategory === catKey ? '#ffffff' : '#94a3b8',
                        border: '1px solid ' + (activeCategory === catKey ? '#C8102E' : '#232b3a'),
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {catKey}
                    </button>
                  ))}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '10px',
                  overflowY: 'auto',
                  flex: 1,
                  paddingRight: '6px'
                }}>
                  {currentCategoryDishes.map((dish) => (
                    <div
                      key={dish.id || dish.name}
                      onClick={() => handleAddItemToManual(dish)}
                      className="pos-dish-card"
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', marginBottom: '8px', lineHeight: 1.3 }}>
                        {dish.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#FFD700', fontWeight: 700 }}>
                          Rs. {dish.price}
                        </span>
                        <span style={{ 
                          backgroundColor: '#C8102E', 
                          color: 'white', 
                          borderRadius: '5px', 
                          padding: '3px 8px', 
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}>
                          + Add
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1017' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Table / Customer (e.g. Table 4)"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#151922',
                      border: '1px solid #232c3d',
                      color: 'white',
                      fontSize: '0.8rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <select
                    value={modalBranch}
                    onChange={e => setModalBranch(e.target.value)}
                    style={{
                      backgroundColor: '#151922',
                      border: '1px solid #232c3d',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '0 8px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="F-8 Markaz">F-8 Markaz</option>
                    <option value="Park View City">Park View City</option>
                  </select>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                  {selectedItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b', fontSize: '0.82rem' }}>
                      Click dishes on the left to assemble bill.
                    </div>
                  ) : (
                    selectedItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '9px 0',
                          borderBottom: '1px solid #1a202c',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.name}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Rs. {item.price} each</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            style={{ 
                              background: '#19202e', 
                              border: '1px solid #283347', 
                              color: 'white', 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '4px', 
                              cursor: 'pointer' 
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            style={{ 
                              background: '#19202e', 
                              border: '1px solid #283347', 
                              color: 'white', 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '4px', 
                              cursor: 'pointer' 
                            }}
                          >
                            +
                          </button>
                          <span style={{ minWidth: '60px', textAlign: 'right', fontWeight: 700, color: '#FFD700' }}>
                            Rs. {item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ borderTop: '1px solid #1e2430', paddingTop: '14px', marginTop: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#94a3b8' }}>
                    <span>Subtotal</span>
                    <span>Rs. {manualSubtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#94a3b8' }}>
                    <span>Govt Tax (5%)</span>
                    <span>Rs. {manualGst}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: 800, 
                    fontSize: '1rem', 
                    color: '#FFD700', 
                    marginBottom: '16px' 
                  }}>
                    <span>Total Bill</span>
                    <span>Rs. {manualTotal}</span>
                  </div>

                  <button
                    type="button"
                    onClick={submitManualOrder}
                    disabled={selectedItems.length === 0}
                    style={{
                      width: '100%',
                      backgroundColor: selectedItems.length === 0 ? '#202837' : '#C8102E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '11px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'background-color 150ms ease'
                    }}
                  >
                    Confirm & Dispatch Order
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}