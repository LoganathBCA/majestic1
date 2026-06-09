import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubscribeModal = () => {
  const { showModal, modalStep, signIn, closeSubscribe, submitWhatsApp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (!showModal) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    // Validate 10-digit Indian mobile number
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      // Save to Firestore — format: 91XXXXXXXXXX (matches scope.md Firestore schema)
      await submitWhatsApp(`91${cleaned}`);
      // modalStep is advanced to 3 inside submitWhatsApp on success
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    closeSubscribe();
  };

  const handleExplore = () => {
    closeSubscribe();
    navigate('/shop');
  };

  return (
    <div className="modal-overlay" onClick={closeSubscribe}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={closeSubscribe}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* ── Step 1: Google Sign-In ── */}
        {modalStep === 1 && (
          <div className="modal-step-content step-1">
            <div className="modal-graphic">
              <svg viewBox="0 0 100 100" className="shuttlecock-icon" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"></circle>
                <path d="M50 35 L40 70 L60 70 Z" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinejoin="round"></path>
                <path d="M44 70 L46 76 L54 76 L56 70 Z" fill="var(--primary)"></path>
                <line x1="45" y1="48" x2="55" y2="48" stroke="var(--secondary)" strokeWidth="1.5"></line>
                <line x1="42" y1="58" x2="58" y2="58" stroke="var(--secondary)" strokeWidth="1.5"></line>
                <path d="M50 35 C42 45 42 60 40 70" fill="none" stroke="var(--secondary)" strokeWidth="1.5"></path>
                <path d="M50 35 C58 45 58 60 60 70" fill="none" stroke="var(--secondary)" strokeWidth="1.5"></path>
              </svg>
            </div>

            <h2 className="modal-title">JOIN THE ELITE CLUB</h2>
            <p className="modal-subtitle">
              Subscribe to get instant notifications about restocks, exclusive releases, and premium badminton drops directly on your WhatsApp.
            </p>

            <button className="btn-google-signin" onClick={signIn}>
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* ── Step 2: WhatsApp Number ── */}
        {modalStep === 2 && (
          <div className="modal-step-content step-2">
            <h2 className="modal-title">CONNECT WHATSAPP</h2>
            <p className="modal-subtitle">
              We need your WhatsApp number to deliver restock and launch alerts directly.
            </p>

            <form onSubmit={handlePhoneSubmit} className="modal-form">
              <div className="phone-input-group">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className={`phone-input ${error ? 'input-error' : ''}`}
                  autoFocus
                  required
                  disabled={saving}
                />
              </div>

              {error && <span className="error-text">{error}</span>}

              <button
                type="submit"
                className="btn-modal-submit btn-secondary"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Subscribe to Alerts'}
              </button>
            </form>

            <button className="btn-modal-skip" onClick={handleSkip} disabled={saving}>
              Skip for now
            </button>
          </div>
        )}

        {/* ── Step 3: Success ── */}
        {modalStep === 3 && (
          <div className="modal-step-content step-3">
            <div className="success-graphic">
              <svg className="checkmark-svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>

            <h2 className="modal-title">YOU'RE ON THE LIST!</h2>
            <p className="modal-subtitle">
              Welcome to the inner circle. We will alert you on WhatsApp the moment new gear lands or items restock.
            </p>

            <button className="btn-modal-explore btn-primary" onClick={handleExplore}>
              Explore Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
