import { LayoutList, Kanban, RefreshCw, ShoppingBag, Trash2 } from 'lucide-react';

export default function OrdersView({
  orders,
  loading,
  filter,
  setFilter,
  viewMode,
  setViewMode,
  selectedBranch,
  updateStatus,
  deleteOrder,
  fetchOrders
}) {
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Orders</h1>
            <span style={{ backgroundColor: 'var(--admin-surface-hover)', color: 'var(--admin-accent)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              {activeOrdersCount} Active
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
            Live kitchen routing and delivery dispatch for {selectedBranch}.
          </p>
        </div>

        {/* View Mode Toggle & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'var(--admin-surface-hover)' : 'transparent',
                color: viewMode === 'table' ? 'var(--admin-text)' : 'var(--admin-text-muted)',
                border: 'none', borderRadius: '4px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <LayoutList size={14} /> Table View
            </button>
            <button
              onClick={() => setViewMode('board')}
              style={{
                background: viewMode === 'board' ? 'var(--admin-surface-hover)' : 'transparent',
                color: viewMode === 'board' ? 'var(--admin-text)' : 'var(--admin-text-muted)',
                border: 'none', borderRadius: '4px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Kanban size={14} /> Board View
            </button>
          </div>

          <button
            onClick={fetchOrders}
            style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '7px 10px', borderRadius: '6px' }}
            title="Refresh Orders"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['all', 'Received', 'Cooking', 'Out for Delivery', 'Delivered'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              style={{
                backgroundColor: filter === tag ? 'var(--admin-accent)' : 'var(--admin-surface-hover)',
                color: filter === tag ? '#ffffff' : 'var(--admin-text-muted)',
                border: '1px solid ' + (filter === tag ? 'var(--admin-accent)' : 'var(--admin-border)'),
                borderRadius: '6px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', transition: 'all 0.15s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Table / Board Content */}
      <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '10px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Updating order records...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--admin-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
              <ShoppingBag size={24} />
            </div>
            <div style={{ fontWeight: 600, color: 'var(--admin-text)', fontSize: '0.95rem' }}>No orders found</div>
            <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem', maxWidth: '320px' }}>
              There are no records matching status "{filter}" for {selectedBranch}.
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--admin-surface-hover)', color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border)' }}>
                    <th style={{ padding: '12px 18px' }}>Order</th>
                    <th style={{ padding: '12px 18px' }}>Customer & Phone</th>
                    <th style={{ padding: '12px 18px' }}>Delivery Address</th>
                    <th style={{ padding: '12px 18px' }}>Payment</th>
                    <th style={{ padding: '12px 18px' }}>Dishes</th>
                    <th style={{ padding: '12px 18px' }}>Amount</th>
                    <th style={{ padding: '12px 18px' }}>Kitchen State</th>
                    <th style={{ padding: '12px 18px' }}>Time</th>
                    <th style={{ padding: '12px 18px', textAlign: 'right' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--admin-accent)', fontWeight: 600 }}>
                        #{String(order.id).slice(0, 6).toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{order.customer_name || 'Walk-in'}</div>
                        {order.phone && <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>{order.phone}</div>}
                      </td>
                      <td style={{ padding: '14px 18px', maxWidth: '180px', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {order.address || 'Counter / Dine-in'}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          backgroundColor: order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: order.payment_method === 'Bank Transfer' ? 'var(--admin-info)' : 'var(--admin-success)',
                          border: '1px solid ' + (order.payment_method === 'Bank Transfer' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(34, 197, 94, 0.3)'),
                          padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap'
                        }}>
                          {order.payment_method || 'COD'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {Array.isArray(order.items) && order.items.map((it, idx) => (
                            <span key={idx} style={{ backgroundColor: 'var(--admin-surface-hover)', border: '1px solid var(--admin-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                              {it.name} <b style={{ color: 'var(--admin-warning)' }}>×{it.quantity}</b>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>
                        Rs. {order.total}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{
                            backgroundColor: 'var(--admin-surface-hover)',
                            color: order.status === 'Delivered' ? 'var(--admin-success)' : 'var(--admin-warning)',
                            border: '1px solid var(--admin-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                          }}
                        >
                          <option value="Received" style={{ backgroundColor: '#131519' }}>Received</option>
                          <option value="Cooking" style={{ backgroundColor: '#131519' }}>Cooking</option>
                          <option value="Out for Delivery" style={{ backgroundColor: '#131519' }}>Out for Delivery</option>
                          <option value="Delivered" style={{ backgroundColor: '#131519' }}>Delivered</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button onClick={() => deleteOrder(order.id)} style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '4px' }} title="Purge order">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Kanban Board View */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px' }}>
                {[
                  { title: 'Received', color: 'var(--admin-warning)', statusKey: 'Received' },
                  { title: 'Cooking', color: 'var(--admin-info)', statusKey: 'Cooking' },
                  { title: 'Out for Delivery', color: 'var(--admin-accent)', statusKey: 'Out for Delivery' },
                  { title: 'Delivered', color: 'var(--admin-success)', statusKey: 'Delivered' }
                ].map((col) => {
                  const colOrders = orders.filter(o => (o.status || 'Received') === col.statusKey);
                  return (
                    <div key={col.statusKey} style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '10px', display: 'flex', flexDirection: 'column', maxHeight: '650px', overflow: 'hidden' }}>
                      <div style={{ padding: '12px 14px', backgroundColor: 'var(--admin-surface-hover)', borderBottom: '1px solid var(--admin-border)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: col.color }}>
                        <span>{col.title}</span>
                        <span style={{ backgroundColor: 'var(--admin-surface)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>{colOrders.length}</span>
                      </div>
                      <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                        {colOrders.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>No orders</div>
                        ) : (
                          colOrders.map((order) => (
                            <div key={order.id} style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'monospace', color: 'var(--admin-accent)', fontWeight: 700, fontSize: '0.78rem' }}>#{String(order.id).slice(0, 6).toUpperCase()}</span>
                                <span style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: '0.85rem' }}>Rs. {order.total}</span>
                              </div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)' }}>{order.customer_name || 'Walk-in'}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                {Array.isArray(order.items) && order.items.map((it, idx) => (
                                  <span key={idx} style={{ backgroundColor: 'var(--admin-surface-hover)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.68rem', color: 'var(--admin-text-muted)' }}>
                                    {it.name} <b>×{it.quantity}</b>
                                  </span>
                                ))}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--admin-border)', paddingTop: '6px' }}>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateStatus(order.id, e.target.value)}
                                  style={{ backgroundColor: 'var(--admin-surface-hover)', color: order.status === 'Delivered' ? 'var(--admin-success)' : 'var(--admin-warning)', border: '1px solid var(--admin-border)', padding: '3px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                  <option value="Received">Received</option>
                                  <option value="Cooking">Cooking</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                                <button onClick={() => deleteOrder(order.id)} style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', padding: '2px' }} title="Purge">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}