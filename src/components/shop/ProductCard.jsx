import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppUrl } from '../../constants/contact';
import { useNavigate } from 'react-router-dom';

// ─── Heart Icons ──────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="currentColor" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

const ProductCard = ({ product, layout = 'grid' }) => {
  const { user, signIn } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const { name, brand, price, isNew, imageURL, description } = product;
  const wishlisted = isWishlisted(product.id);

  // Format price to Indian Rupees style (e.g. ₹8,999)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const message = `Hi, I want to buy ${name}`;
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      signIn();
      return;
    }
    try {
      await toggleWishlist(product);
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className={`product-card ${layout === 'list' ? 'list-layout' : ''} product-card-clickable`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
    >
      <div className="product-card-image-wrapper">
        {isNew && <span className="product-card-badge">NEW</span>}
        <picture>
          {/* Use WebP for local fallback images; Cloudinary URLs serve their own format */}
          {imageURL && !imageURL.startsWith('http') && (
            <source
              srcSet={imageURL.replace(/\.png$/i, '.webp').replace(/\.jpg$/i, '.webp')}
              type="image/webp"
            />
          )}
          <img
            src={imageURL}
            alt={name}
            className="product-card-image"
            loading="lazy"
            width="228"
            height="228"
            decoding="async"
          />
        </picture>

        {/* Wishlist heart button */}
        <button
          className={`product-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* View Details overlay on hover */}
        <div className="product-card-view-overlay">
          <span className="product-card-view-label">View Details</span>
        </div>
      </div>

      <div className="product-card-content">
        <span className="product-card-brand">{brand}</span>
        <h3 className="product-card-title">{name}</h3>

        {layout === 'list' && description && (
          <p className="product-card-description">{description}</p>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">{formattedPrice}</span>
          <button className="btn-product-buy btn-primary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
