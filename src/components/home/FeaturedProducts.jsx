import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import useProducts from '../../hooks/useProducts';

// Skeleton card for loading state
const ProductCardSkeleton = () => (
  <div className="product-card skeleton-card">
    <div className="skeleton-block skeleton-img" />
    <div className="product-card-body">
      <div className="skeleton-block skeleton-line" style={{ width: '60%', height: 12, marginBottom: 8 }} />
      <div className="skeleton-block skeleton-line" style={{ width: '90%', height: 16, marginBottom: 6 }} />
      <div className="skeleton-block skeleton-line" style={{ width: '40%', height: 14 }} />
    </div>
  </div>
);

const CURATED_FALLBACK_PRODUCTS = [
  {
    id: 'fallback-racket-1',
    name: 'Yonex Astrox 99 Pro Cherry Sunburst (4U/G5)',
    brand: 'Yonex',
    price: 19490,
    imageURL: '/images/racket.png',
    description: 'Designed for aggressive players looking for heavy power smashes and quick control. Features a head-heavy balance and stiff shaft.',
    isNew: true,
    categoryName: 'Rackets',
    categoryId: 'rackets'
  },
  {
    id: 'fallback-shoes-1',
    name: 'Li-Ning Ranger VI Professional Court Shoes',
    brand: 'Li-Ning',
    price: 12990,
    imageURL: '/images/shoes.png',
    description: 'Elite professional badminton footwear with advanced shock absorption, grip control, and breathable mesh.',
    isNew: true,
    categoryName: 'Shoes',
    categoryId: 'shoes'
  },
  {
    id: 'fallback-bag-1',
    name: 'Yonex Pro 3-Compartment Tournament Bag',
    brand: 'Yonex',
    price: 7990,
    imageURL: '/images/bag.png',
    description: 'Thermogard insulated bag with room for 9 rackets, separate shoe pocket, and accessories compartment.',
    isNew: false,
    categoryName: 'Bags',
    categoryId: 'bags'
  },
  {
    id: 'fallback-shuttle-1',
    name: 'Victor Gold No.1 Premium Tournament Shuttlecocks',
    brand: 'Victor',
    price: 2490,
    imageURL: '/images/shuttlecocks.png',
    description: 'BWF approved tournament grade goose feather shuttlecocks with exceptional flight durability and consistency.',
    isNew: true,
    categoryName: 'Shuttlecocks',
    categoryId: 'shuttlecocks'
  }
];

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts();

  // If there's an error or empty database, fallback to the curated list
  const showFallback = error || (!loading && products.length === 0);
  const featured = showFallback ? CURATED_FALLBACK_PRODUCTS : products.slice(0, 8);

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Trending Equipment</span>
          <h2 className="section-title">Featured Gear</h2>
          <div className="section-divider"></div>
        </div>

        {loading && !error && products.length === 0 && (
          <div className="products-grid">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {showFallback && (
              <div className="fallback-banner">
                <div className="fallback-banner-content">
                  <svg className="fallback-banner-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span className="fallback-banner-text">
                    Showing our <strong>Flagship Curated Collection</strong>. Available for custom orders and direct purchase inquiry via WhatsApp.
                  </span>
                </div>
              </div>
            )}

            <div className="products-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
              <Link to="/shop" className="btn btn-outline" style={{ textTransform: 'uppercase' }}>
                View Full Shop Catalog
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
