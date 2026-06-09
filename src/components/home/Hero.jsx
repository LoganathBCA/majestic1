import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buildWhatsAppUrl } from '../../constants/contact';

const Hero = () => {
  const navigate = useNavigate();
  const { openSubscribe } = useAuth();

  const handleShopNow = () => {
    navigate('/shop');
  };

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  const scrollToNextSection = () => {
    const featuredSection = document.querySelector('.featured-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-bg-overlay"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-badge">Elite Performance Equipment</span>
          
          <h1 className="display hero-title">
            ELEVATE <br />
            <span className="text-accent-glow">YOUR GAME</span>
          </h1>
          
          <p className="hero-tagline">
            Discover elite badminton rackets, professional court shoes, and premium accessories selected for champions.
          </p>
          
          <div className="hero-actions">
            <button className="btn-hero-shop" onClick={handleShopNow}>
              Shop Catalog
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="btn-hero-subscribe" onClick={openSubscribe}>
              Subscribe for Drops
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </button>
            <button className="btn-hero-whatsapp" onClick={handleWhatsApp}>
              WhatsApp Us
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
          </div>

          {/* Floated Stats Dashboard */}
          <div className="hero-stats-board">
            <div className="hero-stat-card">
              <div className="hero-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-value">100% Authentic</span>
                <span className="hero-stat-label">Authorized Dealer</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12h8"></path>
                  <path d="M12 8v8"></path>
                </svg>
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-value">Pro Stringing</span>
                <span className="hero-stat-label">Custom Tensioning</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-value">Expert Advice</span>
                <span className="hero-stat-label">Direct WhatsApp Consult</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse Scroll indicator */}
      <div className="hero-scroll-indicator" onClick={scrollToNextSection}>
        <span>Explore Gear</span>
        <div className="scroll-indicator-mouse">
          <div className="scroll-indicator-wheel"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

