import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { buildWhatsAppUrl } from '../constants/contact';

// ─── Heart SVG — filled vs outline ───────────────────────────────────────────
const HeartFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="currentColor" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ─── Wishlist Item Card ───────────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onBuyNow }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(item.price);

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-image-wrapper">
        {item.isNew && <span className="product-card-badge">NEW</span>}
        <img
          src={item.imageURL}
          alt={item.name}
          className="wishlist-card-image"
          loading="lazy"
        />
        <button
          className="wishlist-card-remove-btn"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from wishlist`}
          title="Remove from wishlist"
        >
          <HeartFilled />
        </button>
      </div>
      <div className="wishlist-card-content">
        <span className="product-card-brand">{item.brand}</span>
        <h3 className="wishlist-card-name">{item.name}</h3>
        <div className="wishlist-card-footer">
          <span className="product-card-price">{formattedPrice}</span>
          <button
            className="btn-product-buy btn-primary"
            onClick={() => onBuyNow(item.name)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Wishlist = () => {
  const { user, signIn } = useAuth();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  useEffect(() => {
    document.title = 'My Wishlist — Majestic Sports';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Your saved badminton gear at Majestic Sports. Sign in to manage your wishlist and buy directly via WhatsApp.'
      );
    }
    window.scrollTo(0, 0);
  }, []);

  const handleBuyNow = (name) => {
    const message = `Hi, I want to buy ${name}`;
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-locked-state">
          <div className="wishlist-locked-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h1 className="wishlist-locked-title">Your Wishlist Awaits</h1>
          <p className="wishlist-locked-desc">
            Sign in with your Google account to save your favourite badminton gear and access it any time, on any device.
          </p>
          <button className="btn btn-secondary wishlist-signin-btn" onClick={signIn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Sign In to View Wishlist
          </button>
          <div className="wishlist-locked-browse">
            <Link to="/shop" className="wishlist-browse-link">
              Or browse the shop →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading-state">
          <div className="wishlist-spinner" />
          <p>Loading your wishlist…</p>
        </div>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <section className="wishlist-page-header">
          <div className="container wishlist-header-inner">
            <div className="wishlist-header-pattern" />
            <span className="hero-tag">Saved Gear</span>
            <h1 className="hero-display wishlist-title">My Wishlist</h1>
          </div>
        </section>
        <div className="wishlist-empty-state">
          <div className="wishlist-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2 className="wishlist-empty-title">Nothing saved yet</h2>
          <p className="wishlist-empty-desc">
            Tap the ♡ on any product to save it here. Your wishlist stays synced across devices.
          </p>
          <Link to="/shop" className="btn btn-secondary">
            Browse Gear
          </Link>
        </div>
      </div>
    );
  }

  // ── Populated wishlist ──────────────────────────────────────────────────────
  return (
    <div className="wishlist-page">
      {/* Hero header */}
      <section className="wishlist-page-header">
        <div className="container wishlist-header-inner">
          <div className="wishlist-header-pattern" />
          <span className="hero-tag">Saved Gear</span>
          <h1 className="hero-display wishlist-title">My Wishlist</h1>
          <p className="wishlist-count-label">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="wishlist-grid-section section">
        <div className="container">
          <div className="wishlist-top-bar">
            <p className="wishlist-top-bar-info">
              Tap ♡ to remove · Click "Buy Now" to purchase via WhatsApp
            </p>
            <Link to="/shop" className="btn btn-outline wishlist-continue-btn">
              Continue Shopping
            </Link>
          </div>
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
