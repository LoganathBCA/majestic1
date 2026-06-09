import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { buildWhatsAppUrl } from '../constants/contact';

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="currentColor" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

// Known spec fields with display labels
const SPEC_FIELDS = [
  { key: 'weight',       label: 'Weight' },
  { key: 'flexibility',  label: 'Flexibility / Stiffness' },
  { key: 'balancePoint', label: 'Balance Point' },
  { key: 'gripType',     label: 'Grip Type' },
  { key: 'stringTension',label: 'String Tension' },
  { key: 'material',     label: 'Material' },
  { key: 'playerLevel',  label: 'Recommended For' },
  { key: 'color',        label: 'Color' },
  { key: 'origin',       label: 'Origin / Made In' },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="pd-layout">
    <div className="pd-image-col">
      <div className="skeleton-block" style={{ width: '100%', height: '480px', borderRadius: 8 }} />
    </div>
    <div className="pd-info-col">
      <div className="skeleton-block" style={{ width: '40%', height: 14, marginBottom: 16 }} />
      <div className="skeleton-block" style={{ width: '85%', height: 32, marginBottom: 12 }} />
      <div className="skeleton-block" style={{ width: '30%', height: 28, marginBottom: 24 }} />
      <div className="skeleton-block" style={{ width: '100%', height: 120, marginBottom: 24 }} />
      <div className="skeleton-block" style={{ width: '100%', height: 200, marginBottom: 24 }} />
      <div className="skeleton-block" style={{ width: '100%', height: 52 }} />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgZoomed, setImgZoomed] = useState(false);

  const wishlisted = product ? isWishlisted(product.id) : false;

  // ── Fetch product from Firestore ──
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to load product. Please try again.');
        console.error('ProductDetail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ── SEO ──
  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Majestic Sports | Badminton Equipment Dindigul`;
      const rawDesc = product.description || `Buy ${product.name} from Majestic Sports. Premium badminton equipment in Dindigul.`;
      const truncatedDesc = rawDesc.length > 160 ? rawDesc.slice(0, 157) + '...' : rawDesc;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', truncatedDesc);

      // Canonical per product
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://eaf8614e.majestic1.pages.dev/product/${product.id}`);

      // Inject Product JSON-LD schema
      const existingScript = document.getElementById('product-jsonld');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.id = 'product-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: rawDesc,
        image: product.imageURL,
        brand: { '@type': 'Brand', name: product.brand || 'Majestic Sports' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'Majestic Sports' }
        }
      });
      document.head.appendChild(script);
    }
    return () => {
      document.title = 'Majestic Sports — Premium Badminton Equipment | Dindigul, Tamil Nadu';
      const script = document.getElementById('product-jsonld');
      if (script) script.remove();
    };
  }, [product]);

  const handleBuyNow = () => {
    const message = `Hi, I want to buy *${product.name}* (₹${Number(product.price).toLocaleString('en-IN')}). Please share availability and delivery details.`;
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  const handleWishlistToggle = async () => {
    if (!user) { signIn(); return; }
    try {
      await toggleWishlist(product);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const formattedPrice = product
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)
    : '';

  // ── Collect visible specs ──
  const visibleSpecs = product
    ? SPEC_FIELDS.filter(({ key }) => product[key] && String(product[key]).trim() !== '')
    : [];

  const additionalSpecs = product?.additionalSpecs?.filter(s => s.key && s.value) || [];
  const hasSpecs = visibleSpecs.length > 0 || additionalSpecs.length > 0;

  // ── Render ──
  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb / Back */}
        <div className="pd-breadcrumb">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>
            <BackIcon />
            <span>Back to Shop</span>
          </button>
          {product && (
            <span className="pd-breadcrumb-trail">
              <span className="pd-breadcrumb-sep">›</span>
              <span className="pd-breadcrumb-category">{product.categoryName}</span>
              <span className="pd-breadcrumb-sep">›</span>
              <span className="pd-breadcrumb-current">{product.name}</span>
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && <DetailSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="pd-error-state">
            <p className="pd-error-title">Oops!</p>
            <p className="pd-error-desc">{error}</p>
            <button className="btn-primary pd-error-btn" onClick={() => navigate('/shop')}>
              Return to Shop
            </button>
          </div>
        )}

        {/* Product Detail */}
        {!loading && product && (
          <div className="pd-layout">
            {/* ── Left: Image ── */}
            <div className="pd-image-col">
              <div
                className={`pd-image-wrapper ${imgZoomed ? 'zoomed' : ''}`}
                onClick={() => setImgZoomed(v => !v)}
                title={imgZoomed ? 'Click to zoom out' : 'Click to zoom in'}
              >
                {product.isNew && (
                  <span className="pd-new-badge">NEW ARRIVAL</span>
                )}
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="pd-main-image"
                  loading="eager"
                />
                <div className="pd-image-zoom-hint">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    {imgZoomed
                      ? <line x1="8" y1="11" x2="14" y2="11" />
                      : <><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>
                    }
                  </svg>
                  {imgZoomed ? 'Zoom Out' : 'Zoom In'}
                </div>
              </div>
            </div>

            {/* ── Right: Info ── */}
            <div className="pd-info-col">
              {/* Category + Brand */}
              <div className="pd-meta-row">
                {product.categoryName && (
                  <span className="pd-category-chip">{product.categoryName}</span>
                )}
                {product.brand && (
                  <span className="pd-brand-chip">{product.brand}</span>
                )}
              </div>

              {/* Name */}
              <h1 className="pd-product-name">{product.name}</h1>

              {/* Price */}
              <div className="pd-price-row">
                <span className="pd-price">{formattedPrice}</span>
                <span className="pd-price-note">Incl. of all taxes · Contact for delivery</span>
              </div>

              {/* Divider */}
              <div className="pd-divider" />

              {/* Description */}
              {product.description && (
                <div className="pd-description-block">
                  <h2 className="pd-section-label">Description</h2>
                  <p className="pd-description-text">{product.description}</p>
                </div>
              )}

              {/* Specifications Table */}
              {hasSpecs && (
                <div className="pd-specs-block">
                  <h2 className="pd-section-label">Specifications</h2>
                  <table className="pd-specs-table">
                    <tbody>
                      {visibleSpecs.map(({ key, label }) => (
                        <tr key={key} className="pd-spec-row">
                          <td className="pd-spec-label">{label}</td>
                          <td className="pd-spec-value">{product[key]}</td>
                        </tr>
                      ))}
                      {additionalSpecs.map((spec, i) => (
                        <tr key={`custom-${i}`} className="pd-spec-row">
                          <td className="pd-spec-label">{spec.key}</td>
                          <td className="pd-spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CTA Row */}
              <div className="pd-cta-row">
                <button className="pd-whatsapp-btn" onClick={handleBuyNow}>
                  <WhatsAppIcon />
                  Buy Now on WhatsApp
                </button>

                <button
                  className={`pd-wishlist-btn ${wishlisted ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pd-trust-row">
                <div className="pd-trust-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>100% Genuine Products</span>
                </div>
                <div className="pd-trust-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Pan-India Delivery</span>
                </div>
                <div className="pd-trust-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>WhatsApp Support</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
