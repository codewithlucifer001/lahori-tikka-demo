import { CheckCircle2, Clock, Truck, Utensils } from 'lucide-react';

const stages = [
  { label: "Order Received", icon: Clock },
  { label: "Preparing in Kitchen", icon: Utensils },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered Hot", icon: CheckCircle2 }
];

export default function OrderTracker({ currentStage = 1 }) {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-title" style={{ display: 'inline-block' }}>Live Order Status</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
          Real-time tracking for deliveries across F, G & E sectors.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          backgroundColor: 'var(--color-card-bg)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)'
        }}>
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isPassed = idx <= currentStage;
            return (
              <div 
                key={idx} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: isPassed ? 1 : 0.4
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isPassed ? 'var(--color-primary)' : '#262626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Icon size={22} />
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isPassed ? 600 : 400,
                  color: isPassed ? 'var(--color-accent)' : 'var(--color-text-muted)'
                }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}