import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const AuthButton = () => {
  const { user, loading, whatsappNo, signIn, signOut, openSubscribe, ADMIN_UID } = useAuth();
  const { wishlistItems } = useWishlist();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const wishlistCount = wishlistItems.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const [avatarError, setAvatarError] = useState(false);
  const [dropdownAvatarError, setDropdownAvatarError] = useState(false);

  // Reset image errors when user changes
  useEffect(() => {
    setAvatarError(false);
    setDropdownAvatarError(false);
  }, [user]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user?.uid === ADMIN_UID;
  const isSubscribed = !!whatsappNo;

  // While Firebase is checking the session, render nothing to avoid a flash
  if (loading) {
    return <div className="btn-auth-loading" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button className="btn-signin-nav" onClick={signIn}>
        Sign In
      </button>
    );
  }

  return (
    <div className="auth-user-menu" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        className="btn-avatar-nav"
        onClick={toggleDropdown}
        aria-label="User profile menu"
      >
        {!avatarError && user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="navbar-avatar-img"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="navbar-avatar-fallback">
            {getInitials(user.displayName)}
          </div>
        )}
        {!isSubscribed && !isAdmin && (
          <span className="avatar-badge-dot" title="Subscription pending"></span>
        )}
      </button>

      {/* User Dropdown Menu */}
      {isDropdownOpen && (
        <div className="auth-dropdown-menu">
          <div className="auth-dropdown-header">
            {!dropdownAvatarError && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="dropdown-avatar-img"
                onError={() => setDropdownAvatarError(true)}
              />
            ) : (
              <div className="dropdown-avatar-fallback">
                {getInitials(user.displayName)}
              </div>
            )}
            <div className="dropdown-user-info">
              <span className="dropdown-username">{user.displayName}</span>
              <span className="dropdown-email">{user.email}</span>
            </div>
          </div>

          <div className="auth-dropdown-status">
            {isAdmin ? (
              <span className="badge-admin">Admin Portal</span>
            ) : isSubscribed ? (
              <span className="badge-subscribed">WhatsApp Subscribed</span>
            ) : (
              <button
                className="badge-pending-btn"
                onClick={() => { setIsDropdownOpen(false); openSubscribe(); }}
              >
                Complete WhatsApp Sign Up
              </button>
            )}
          </div>

          <div className="auth-dropdown-divider"></div>

          <div className="auth-dropdown-links">
            {/* My Wishlist link — always visible for logged-in users */}
            <Link
              to="/wishlist"
              className="dropdown-link"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              My Wishlist
              {wishlistCount > 0 && (
                <span className="dropdown-wishlist-count">{wishlistCount}</span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="dropdown-link admin-link-highlight"
                onClick={() => setIsDropdownOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                Admin Dashboard
              </Link>
            )}

            {!isSubscribed && !isAdmin && (
              <button
                className="dropdown-link-btn"
                onClick={() => { setIsDropdownOpen(false); openSubscribe(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Subscribe to Alerts
              </button>
            )}

            <button className="dropdown-link-btn btn-signout" onClick={handleSignOut}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
