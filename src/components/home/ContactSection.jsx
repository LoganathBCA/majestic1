import { Link } from 'react-router-dom';
import { buildWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, SUPPORT_EMAIL, HQ_ADDRESS, MAPS_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../../constants/contact';

const ContactSection = () => {
  const handleWhatsAppChat = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get in Touch</span>
          <h2 className="section-title">Connect With Us</h2>
          <div className="section-divider"></div>
        </div>

        <div className="contact-grid">
          {/* Direct WhatsApp Call-to-Action Card */}
          <div className="contact-card whatsapp-cta-card">
            <div className="whatsapp-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3 className="whatsapp-card-title">Instant WhatsApp Consult</h3>
            <p className="whatsapp-card-desc">
              Chat directly with our coaches and master stringers to get advice on rackets, string tension, or footwear sizing.
            </p>
            <button className="btn-contact-whatsapp btn-secondary" onClick={handleWhatsAppChat}>
              Start WhatsApp Chat
            </button>
          </div>

          {/* Help Center Preview Card */}
          <div className="contact-card support-preview-card">
            <div className="support-preview-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(0, 80, 204, 0.08)', color: 'var(--secondary)', marginBottom: 'var(--space-sm)', border: '1px dashed rgba(0, 80, 204, 0.2)', margin: '0 auto var(--space-sm) auto' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="whatsapp-card-title" style={{ color: 'var(--primary)', textAlign: 'center' }}>Inquiries & FAQs</h3>
            <p className="whatsapp-card-desc" style={{ textAlign: 'center', margin: '0 auto var(--space-md) auto' }}>
              Want to request a custom racket tension specification, inquire about shipping, or browse our comprehensive Badminton FAQ board?
            </p>
            <Link to="/contact" className="btn btn-outline preview-support-btn" style={{ alignSelf: 'center', textTransform: 'uppercase', width: '100%', textAlign: 'center' }}>
              Visit Contact & FAQ Center
            </Link>
          </div>
        </div>

        {/* Contact Info Details Row */}
        <div className="contact-details-list">
          <div className="detail-item-card">
            <div className="detail-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="detail-info">
              <span className="detail-label">Call Us</span>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="detail-value" style={{ color: 'var(--secondary)', textDecoration: 'underline', textDecorationColor: 'rgba(0,80,204,0.3)', textUnderlineOffset: '3px' }}>
                {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>

          <div className="detail-item-card">
            <div className="detail-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="detail-info">
              <span className="detail-label">Email Support</span>
              <span className="detail-value">{SUPPORT_EMAIL}</span>
            </div>
          </div>

          <div className="detail-item-card">
            <div className="detail-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="detail-info">
              <span className="detail-label">Our Shop</span>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="detail-value" style={{ color: 'var(--secondary)', textDecoration: 'underline', textDecorationColor: 'rgba(0,80,204,0.3)', textUnderlineOffset: '3px' }}>
                {HQ_ADDRESS}
              </a>
            </div>
          </div>

          <div className="detail-item-card">
            <div className="detail-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div className="detail-info">
              <span className="detail-label">Instagram</span>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="detail-value" style={{ color: 'var(--secondary)', textDecoration: 'underline', textDecorationColor: 'rgba(0,80,204,0.3)', textUnderlineOffset: '3px' }}>
                @{INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
