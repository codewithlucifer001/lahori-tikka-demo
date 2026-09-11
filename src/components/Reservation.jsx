import { useState } from 'react';
import config from '../config/lahoriTikka.config';
import { Calendar, Users, Clock, Send } from 'lucide-react';

export default function Reservation() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    branch: config.branches[0].name,
    date: '',
    time: '20:00',
    guests: 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `*Table Reservation Request*\n- Name: ${form.name}\n- Phone: ${form.phone}\n- Branch: ${form.branch}\n- Date: ${form.date}\n- Time: ${form.time}\n- Guests: ${form.guests}`;
    window.open(`https://wa.me/923065550555?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="reserve" style={{ padding: '48px 24px', backgroundColor: 'var(--color-secondary)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="section-title">Reserve a Table</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Skip waiting in queue. Reserve your seating at F-8 Markaz or Park View City.
        </p>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--color-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ali Khan"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="tel"
              required
              placeholder="0300-1234567"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Select Branch</label>
            <select
              value={form.branch}
              onChange={e => setForm({ ...form, branch: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            >
              {config.branches.map(b => (
                <option key={b.id} value={b.name} style={{ background: '#111' }}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Time</label>
            <input
              type="time"
              required
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Number of Guests</label>
            <input
              type="number"
              min="1"
              max="30"
              value={form.guests}
              onChange={e => setForm({ ...form, guests: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0d0d0d',
                border: '1px solid var(--color-border)',
                color: 'white'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <button type="submit" className="btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <Send size={16} />
              Confirm Reservation via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}