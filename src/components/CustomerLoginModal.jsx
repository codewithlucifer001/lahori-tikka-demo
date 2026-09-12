import { useState } from 'react';
import { Phone, Lock, X, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CustomerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('initial'); // 'initial' | 'phone_input' | 'otp_verify'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile number (e.g. 03001234567)');
      return;
    }
    setError('');
    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep('otp_verify');
    }, 600);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    // For demo purposes, use fixed OTP "123456" 
    // (Note: Replace or integrate with Supabase Auth phone provider if configured)
    if (otp === '123456') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({ phone: phone.trim() });
        onClose();
      }, 500);
    } else {
      setError('Invalid OTP. Use demo code: 123456');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-card-bg, #FFFFFF)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        maxWidth: '420px',
        width: '100%',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* STEP 1: Initial Choice */}
        {step === 'initial' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%',
              backgroundColor: 'rgba(200, 16, 46, 0.1)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
            }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
              Sign in to Lahori Tikka
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Track your orders easily and earn loyalty rewards on every meal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setStep('phone_input')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
              >
                <Phone size={16} /> Continue with Phone
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '12px', borderRadius: '6px',
                  backgroundColor: 'var(--color-alt-bg, #F7F7F7)', color: 'var(--color-text)',
                  border: '1px solid var(--color-border)', fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Phone Input */}
        {step === 'phone_input' && (
          <form onSubmit={handlePhoneSubmit}>
            <button
              type="button"
              onClick={() => { setStep('initial'); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginBottom: '16px', padding: 0 }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              Enter your mobile number
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              We will send you a 6-digit verification code.
            </p>

            {error && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '12px' }}>{error}</div>}

            <div style={{ marginBottom: '20px' }}>
              <input
                type="tel"
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-alt-bg, #F7F7F7)',
                  color: 'var(--color-text)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* STEP 3: OTP Verification */}
        {step === 'otp_verify' && (
          <form onSubmit={handleOtpVerify}>
            <button
              type="button"
              onClick={() => { setStep('phone_input'); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginBottom: '16px', padding: 0 }}
            >
              <ArrowLeft size={14} /> Change number
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              Enter 6-digit code
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Sent to <b style={{ color: 'var(--color-text)' }}>{phone}</b>. <br/>
              <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>Demo OTP Code: <b>123456</b></span>
            </p>

            {error && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '12px' }}>{error}</div>}

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-alt-bg, #F7F7F7)',
                  color: 'var(--color-text)', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '0.3em',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#22c55e" /> Secure Phone Verification
        </div>
      </div>
    </div>
  );
}