import { useMemo } from 'react';
import config from '../../../config/lahoriTikka.config';
import { MapPin, Phone, ShoppingBag, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export default function BranchesView({ orders }) {
  const branchesData = useMemo(() => {
    return (config.branches || []).map(branch => {
      const branchOrders = orders.filter(o => {
        const addr = (o.address || '').toLowerCase();
        const target = branch.name.toLowerCase();
        if (target.includes('park view')) return addr.includes('park view');
        if (target.includes('f-8')) return addr.includes('f-8') || addr.includes('f8') || (!addr.includes('park view'));
        return true;
      });

      const todayStr = new Date().toISOString().split('T')[0];
      const todayRevenue = branchOrders
        .filter(o => o.created_at && o.created_at.startsWith(todayStr))
        .reduce((sum, o) => sum + Number(o.total || 0), 0);

      const activeCount = branchOrders.filter(o => o.status !== 'Delivered').length;

      const weeklySpark = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTotal = branchOrders
          .filter(o => o.created_at && o.created_at.startsWith(dateStr))
          .reduce((sum, o) => sum + Number(o.total || 0), 0);
        weeklySpark.push({ revenue: dayTotal });
      }

      return {
        ...branch,
        todayRevenue,
        activeCount,
        totalOrders: branchOrders.length,
        weeklySpark
      };
    });
  }, [orders]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Branches</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
          Performance metrics and operational hubs across Islamabad & Rawalpindi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {branchesData.map((branch) => (
          <div key={branch.id} style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 6px 0' }}>{branch.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                  <MapPin size={14} color="var(--admin-accent)" /> {branch.address}
                </div>
              </div>
              <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--admin-accent)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                Active Hub
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
              <Phone size={14} /> {branch.phone}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
              <div style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Today's Revenue</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--admin-success)', marginTop: '4px' }}>Rs. {branch.todayRevenue.toLocaleString()}</div>
              </div>
              <div style={{ backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Queue</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--admin-warning)', marginTop: '4px' }}>{branch.activeCount} orders</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border)', paddingTop: '12px', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} color="var(--admin-accent)" /> 7-Day Trend
              </span>
              <div style={{ width: '100px', height: '30px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={branch.weeklySpark}>
                    <Line type="monotone" dataKey="revenue" stroke="var(--admin-accent)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}