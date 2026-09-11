import { CheckCircle2, Clock, Truck, Utensils } from 'lucide-react';

const stages = [
  { label: "Order Received", icon: Clock },
  { label: "Preparing in Kitchen", icon: Utensils },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered Hot", icon: CheckCircle2 }
];

export default function OrderTracker({ currentStage = 1 }) {
  // Clamped progress calculation: 0% at stage 0, 100% at stage 3
  const safeStage = Math.max(0, Math.min(currentStage, stages.length - 1));
  const progressPercent = (safeStage / (stages.length - 1)) * 100;

  return (
    <section style={{ padding: '48px 24px', backgroundColor: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-title" style={{ display: 'inline-block' }}>Live Order Status</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '0.95rem' }}>
          Real-time tracking for deliveries across F, G & E sectors.
        </p>

        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          padding: '40px 24px 32px 24px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          position: 'relative'
        }}>
          {/* Timeline Container */}
          <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
            
            {/* Background Muted Track Line */}
            <div style={{
              position: 'absolute',
              top: '22px',
              left: '5%',
              right: '5%',
              height: '4px',
              backgroundColor: '#262626',
              borderRadius: '2px',
              zIndex: 1
            }} />

            {/* Filled Animated Crimson Progress Line */}
            <div style={{
              position: 'absolute',
              top: '22px',
              left: '5%',
              width: `${progressPercent * 0.9}%`,
              height: '4px',
              backgroundColor: 'var(--color-primary, #C8102E)',
              borderRadius: '2px',
              zIndex: 2,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px rgba(200, 16, 46, 0.45)'
            }} />

            {/* Stages Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              position: 'relative',
              zIndex: 3
            }}>
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx <= safeStage;
                const isCurrent = idx === safeStage;

                return (
                  <div 
                    key={idx} 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'opacity 300ms ease',
                      opacity: isPassed ? 1 : 0.45
                    }}
                  >
                    {/* Step Icon Node */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? 'var(--color-primary, #C8102E)' : '#1a1a1a',
                      border: isPassed ? '2px solid rgba(255, 215, 0, 0.4)' : '2px solid #2d2d2d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      transition: 'all 400ms ease',
                      transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isCurrent ? '0 0 16px rgba(200, 16, 46, 0.6)' : 'none'
                    }}>
                      <Icon size={20} />
                    </div>

                    {/* Step Label */}
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: isPassed ? 600 : 400,
                      color: isPassed ? 'var(--color-accent, #FFD700)' : 'var(--color-text-muted)',
                      maxWidth: '120px',
                      lineHeight: 1.3,
                      transition: 'color 300ms ease'
                    }}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}