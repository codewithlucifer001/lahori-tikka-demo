import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Flame, Inbox, MapPin } from 'lucide-react';

export default function OverviewView({
  animatedRevenue,
  animatedQueue,
  animatedOrders,
  animatedTax,
  weeklyData,
  monthlyData,
  hotProducts,
  selectedBranch,
  setSelectedBranch
}) {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header & Branch Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text, #0F172A)', margin: 0 }}>Overview</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted, #8B8D98)', margin: '4px 0 0 0' }}>Real-time sales performance and active branch metrics.</p>
        </div>

        {/* Branch Filter Dropdown / Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--admin-surface, #131519)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--admin-border, #1F2229)' }}>
          <MapPin size={15} color="var(--admin-accent, #22C55E)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--admin-text)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
          >
            <option value="All Branches" style={{ backgroundColor: 'var(--admin-surface, #131519)', color: 'var(--admin-text, #E4E4E7)' }}>All Branches</option>
            <option value="F-8 Markaz" style={{ backgroundColor: 'var(--admin-surface, #131519)', color: 'var(--admin-text, #E4E4E7)' }}>F-8 Markaz</option>
            <option value="Park View City" style={{ backgroundColor: 'var(--admin-surface, #131519)', color: 'var(--admin-text, #E4E4E7)' }}>Park View City</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Gross Revenue */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderLeft: '4px solid var(--admin-success, #22C55E)', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gross Revenue</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--admin-success)', marginTop: '4px' }}>Rs. {animatedRevenue.toLocaleString()}</div>
            </div>
            <div style={{ width: '65px', height: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}><Line type="monotone" dataKey="revenue" stroke="var(--admin-success)" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Queue */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderLeft: '4px solid var(--admin-warning, #F59E0B)', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Queue</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--admin-warning)', marginTop: '4px' }}>{animatedQueue}</div>
            </div>
            <div style={{ width: '65px', height: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}><Line type="monotone" dataKey="revenue" stroke="var(--admin-warning)" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderLeft: '4px solid var(--admin-info, #38BDF8)', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Orders</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--admin-info)', marginTop: '4px' }}>{animatedOrders}</div>
            </div>
            <div style={{ width: '65px', height: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}><Line type="monotone" dataKey="revenue" stroke="var(--admin-info)" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PRA Tax */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderLeft: '4px solid var(--admin-text-muted)', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PRA Tax (5%)</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--admin-text)', marginTop: '4px' }}>Rs. {animatedTax.toLocaleString()}</div>
            </div>
            <div style={{ width: '65px', height: '32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}><Line type="monotone" dataKey="revenue" stroke="var(--admin-text-muted)" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        
        {/* Weekly Sales Area Chart */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-text)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Weekly Sales</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>Last 7 Days (PKR)</span>
          </div>
          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-accent)" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="var(--admin-accent)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--admin-text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--admin-text-muted)" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--admin-text)' }} formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="var(--admin-accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#accentGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Bar Chart */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-text)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Monthly Sales</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>Last 4 Weeks (PKR)</span>
          </div>
          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--admin-text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--admin-text-muted)" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--admin-text)' }} formatter={(val) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--admin-accent)" radius={[4, 4, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Hot Products Section */}
      <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '10px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Flame size={18} color="var(--admin-warning)" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Hot Products</h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>Top 5 in {selectedBranch}</span>
        </div>

        {hotProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--admin-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Inbox size={32} color="var(--admin-border)" />
            <span style={{ fontSize: '0.84rem' }}>No branch sales recorded yet.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hotProducts.map((dish, idx) => (
              <div key={dish.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: idx === 0 ? 'var(--admin-accent)' : 'var(--admin-surface-hover)', color: idx === 0 ? '#fff' : 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0 }}>
                  #{idx + 1}
                </div>
                <div style={{ width: '220px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dish.name}
                </div>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--admin-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${dish.percentage}%`, height: '100%', backgroundColor: 'var(--admin-accent)', borderRadius: '4px' }} />
                </div>
                <div style={{ minWidth: '65px', textAlign: 'right', fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-accent)' }}>
                  {dish.count} <span style={{ fontWeight: 400, color: 'var(--admin-text-muted)', fontSize: '0.7rem' }}>sold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}