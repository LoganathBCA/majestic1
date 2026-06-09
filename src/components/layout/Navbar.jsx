import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthButton from '../auth/AuthButton';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppUrl, INSTAGRAM_URL } from '../../constants/contact';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  // JS Step 1: Scroll detection for sticky navbar visual change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // JS Step 2: Active link highlight via useLocation()
  const isActive = (path) => {
    return location.pathname === path;
  };



  // JS Step 1: useState for mobile menu open/close
  const toggleMobileMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="Majestic Sports" className="navbar-logo-img" />
          <span className="navbar-logo-text">MAJESTIC<span>SPORTS</span></span>
        </Link>

        {/* Desktop Nav Links — JS Step 2: active highlight */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>
            Shop
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        {/* Right side Actions */}
        <div className="navbar-actions">
          {/* Wishlist icon — only visible when logged in */}
          {user && (
            <Link
              to="/wishlist"
              className={`navbar-wishlist-btn ${isActive('/wishlist') ? 'active' : ''}`}
              aria-label={`My Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ''}`}
              title="My Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="navbar-wishlist-badge">{wishlistCount > 9 ? '9+' : wishlistCount}</span>
              )}
            </Link>
          )}

          {/* Integrate premium AuthButton */}
          <AuthButton />

          {/* JS Step 1: Hamburger toggle */}
          <button
            className={`hamburger-menu ${isOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer — JS Step 1: controlled by isOpen state */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-links">
            <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} style={{ '--index': 1 }}>
              Home
            </Link>
            <Link to="/shop" className={`mobile-nav-link ${isActive('/shop') ? 'active' : ''}`} style={{ '--index': 2 }}>
              Shop
            </Link>
            <Link to="/about" className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`} style={{ '--index': 3 }}>
              About
            </Link>
            <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} style={{ '--index': 4 }}>
              Contact
            </Link>
            {user && (
              <Link to="/wishlist" className={`mobile-nav-link ${isActive('/wishlist') ? 'active' : ''}`} style={{ '--index': 5 }}>
                My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            )}
          </div>
          
          <div className="mobile-drawer-footer" style={{ '--index': user ? 6 : 5 }}>
            <div className="mobile-drawer-auth">
              <AuthButton />
            </div>
            <div className="mobile-drawer-socials">
              <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>WhatsApp Consult</span>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mobile-social-icon" aria-label="Instagram @majestics_sports_dindigul">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
            <div className="mobile-drawer-brand">
              © {new Date().getFullYear()} MAJESTIC SPORTS
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
