import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buildWhatsAppUrl, INSTAGRAM_URL } from '../../constants/contact';

const Footer = () => {
  const { openSubscribe } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo">
            <img src="/images/logo.png" alt="Majestic Sports" className="footer-logo-img" />
            <span>MAJESTIC<span>SPORTS</span></span>
          </Link>
          <p className="footer-desc">
            Elevate your game with our handpicked premium badminton equipment and accessories. Designed for champions who demand perfection.
          </p>
          <div className="footer-socials">
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram @majestics_sports_dindigul" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-links-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Shop Column */}
        <div className="footer-links-col">
          <h4 className="footer-title">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=rackets">Badminton Rackets</Link></li>
            <li><Link to="/shop?category=shoes">Shoes</Link></li>
            <li><Link to="/shop?category=shuttlecocks">Shuttlecocks</Link></li>
            <li><Link to="/shop?category=accessories">Accessories</Link></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="footer-contact-col">
          <h4 className="footer-title">Newsletter</h4>
          <p className="footer-newsletter-text">
            Subscribe to get direct notifications about new arrivals and exclusive deals on WhatsApp.
          </p>
          <button 
            className="btn-subscribe-footer btn-secondary"
            onClick={openSubscribe}
          >
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container" style={{ flexWrap: 'wrap', gap: 10 }}>
          <p className="copyright" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span>&copy; {currentYear} Majestic Sports. All rights reserved. Built for champions.</span>
          </p>
          <div className="footer-bottom-links">
            <span style={{ cursor: 'default', opacity: 0.6 }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'default', opacity: 0.6 }}>Terms of Service</span>
            <span>•</span>
            <span style={{ opacity: 0.6 }}>
              Developed by{' '}
              <a
                href="https://dshiners.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}
              >
                D Shiners
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
