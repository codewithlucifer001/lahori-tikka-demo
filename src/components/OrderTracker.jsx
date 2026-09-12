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
    <section id="ordertracker" style={{ padding: '48px 24px', backgroundColor: 'var(--color-bg)' }}>
      <style>{`
        .tracker-line-bg {
          position: absolute;
          top: 22px;
          left: 5%;
          right: 5%;
          height: 4px;
          background-color: #262626;
          border-radius: 2px;
          z-index: 1;
        }
        .tracker-line-fill {
          position: absolute;
          top: 22px;
          left: 5%;
          width: ${progressPercent * 0.9}%;
          height: 4px;
          background-color: var(--color-primary, #C8102E);
          border-radius: 2px;
          z-index: 2;
          transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(200, 16, 46, 0.45);
        }
        .tracker-stages-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          z-index: 3;
        }
        .tracker-node {
          width: 44px;
          height: 44px;
        }
        @media (max-width: 480px) {
          .tracker-line-bg {
            top: 5%;
            bottom: 5%;
            left: 20px;
            right: auto;
            width: 4px;
            height: auto;
          }
          .tracker-line-fill {
            top: 5%;
            left: 20px;
            width: 4px !important;
            height: ${progressPercent * 0.85}% !important;
            transition: height 600ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          .tracker-stages-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            text-align: left;
          }
          .tracker-stage-item {
            flex-direction: row !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .tracker-node {
            width: 32px !important;
            height: 32px !important;
          }
          .tracker-label {
            max-width: 100% !important;
          }
        }
      `}</style>

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
            <div className="tracker-line-bg" />

            {/* Filled Animated Progress Line */}
            <div className="tracker-line-fill" />

            {/* Stages Grid */}
            <div className="tracker-stages-grid">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx <= safeStage;
                const isCurrent = idx === safeStage;

                return (
                  <div 
                    key={idx} 
                    className="tracker-stage-item"
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
                    <div className="tracker-node" style={{
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
                      <Icon size={18} />
                    </div>

                    {/* Step Label */}
                    <span className="tracker-label" style={{
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