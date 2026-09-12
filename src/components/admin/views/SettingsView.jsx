import { useState } from 'react';
import { Settings, Shield, Printer, Percent, Clock, Key, Save } from 'lucide-react';
import config from '../../../config/lahoriTikka.config';

export default function SettingsView() {
  const [taxRate, setTaxRate] = useState(5);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [printerIp, setPrinterIp] = useState('192.168.1.150');
  const [autoPrint, setAutoPrint] = useState(true);
  const [branchStatus, setBranchStatus] = useState(
    config.branches.reduce((acc, b) => ({ ...acc, [b.name]: true }), {})
  );
  const [pinCode, setPinCode] = useState('1996');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleToggleBranch = (branchName) => {
    setBranchStatus(prev => ({ ...prev, [branchName]: !prev[branchName] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>System Settings</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
            Configure restaurant tax rules, printer hardware, branch availability, and security access.
          </p>
        </div>

        {savedMessage && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: 'var(--admin-success, #22C55E)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
            ✓ Settings saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Tax & Service Charges */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
            <Percent size={18} color="var(--admin-accent)" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Tax & Service Charge Rules</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>PRA Tax Percentage (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>Service Charge (%)</label>
              <input
                type="number"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Branch Operational Status */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
            <Clock size={18} color="var(--admin-warning, #F59E0B)" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Branch Operational Status</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {config.branches.map(branch => (
              <div key={branch.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--admin-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text)' }}>{branch.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>{branch.address}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBranch(branch.name)}
                  style={{
                    backgroundColor: branchStatus[branch.name] ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: branchStatus[branch.name] ? 'var(--admin-success, #22C55E)' : 'var(--admin-danger, #EF4444)',
                    border: `1px solid ${branchStatus[branch.name] ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    padding: '6px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {branchStatus[branch.name] ? '● Online' : '○ Offline'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Printer & Hardware */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
            <Printer size={18} color="var(--admin-info, #38BDF8)" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Kitchen Printer & Hardware</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>Kitchen Thermal Printer IP</label>
              <input
                type="text"
                value={printerIp}
                onChange={(e) => setPrinterIp(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text)', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
              <input
                type="checkbox"
                id="autoPrint"
                checked={autoPrint}
                onChange={(e) => setAutoPrint(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--admin-accent)', cursor: 'pointer' }}
              />
              <label htmlFor="autoPrint" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)', cursor: 'pointer' }}>
                Auto-print kitchen docket when new order is placed
              </label>
            </div>
          </div>
        </div>

        {/* Staff Access PIN */}
        <div style={{ backgroundColor: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
            <Key size={18} color="var(--admin-warning, #F59E0B)" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Manager POS Access Code</h3>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              style={{ width: '150px', padding: '10px 12px', backgroundColor: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text)', fontSize: '0.85rem', outline: 'none', letterSpacing: '0.2em' }}
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
          <button
            type="submit"
            style={{ backgroundColor: 'var(--admin-accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)' }}
          >
            <Save size={16} /> Save All Settings
          </button>
        </div>

      </form>

    </div>
  );
}