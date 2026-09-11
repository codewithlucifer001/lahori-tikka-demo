import { Gift } from 'lucide-react';

export default function LoyaltyBanner() {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderTop: '1px solid rgba(255, 215, 0, 0.25)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.25)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      color: 'var(--color-accent)',
      fontSize: '0.9rem',
      fontWeight: 600,
      textAlign: 'center'
    }}>
      <Gift size={20} color="var(--color-accent)" />
      <span>Earn 1 Loyalty Point for every Rs. 100 spent. 500 points = Free Chicken Tikka Plate.</span>
    </div>
  );
}