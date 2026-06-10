import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import CategoryTabs from '../components/shop/CategoryTabs';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductGrid from '../components/shop/ProductGrid';
import ProductList from '../components/shop/ProductList';
import ViewToggle from '../components/shop/ViewToggle';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';

/**
 * SkeletonCard — shimmer placeholder while live Firestore data loads.
 * Matches the exact dimensions of a real ProductCard for seamless transition.
 */
const SkeletonCard = () => (
  <div className="product-card skeleton-card" aria-hidden="true">
    <div className="skeleton-block skeleton-img" />
    <div className="product-card-body">
      <div className="skeleton-block skeleton-line" style={{ width: '50%', height: 10, marginBottom: 10 }} />
      <div className="skeleton-block skeleton-line" style={{ width: '85%', height: 14, marginBottom: 8 }} />
      <div className="skeleton-block skeleton-line" style={{ width: '65%', height: 14, marginBottom: 12 }} />
      <div className="skeleton-block skeleton-line" style={{ width: '100%', height: 36 }} />
    </div>
  </div>
);

const FALLBACK_CATEGORIES = [
  { id: 'cat-rackets', name: 'Rackets', slug: 'rackets' },
  { id: 'cat-shoes', name: 'Shoes', slug: 'shoes' },
  { id: 'cat-bags', name: 'Bags', slug: 'bags' },
  { id: 'cat-shuttlecocks', name: 'Shuttlecocks', slug: 'shuttlecocks' }
];

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
    categoryId: 'cat-rackets'
  },
  {
    id: 'fallback-racket-2',
    name: 'Li-Ning Aeronaut 9000 Combat Racket',
    brand: 'Li-Ning',
    price: 17990,
    imageURL: '/images/racket.png',
    description: 'Aeronaut technology utilizes a unique air-stream channel integrated into the racket head to reduce air resistance.',
    isNew: false,
    categoryName: 'Rackets',
    categoryId: 'cat-rackets'
  },
  {
    id: 'fallback-racket-3',
    name: 'Victor Thruster Ryuga II Lee Zii Jia Edition',
    brand: 'Victor',
    price: 16290,
    imageURL: '/images/racket.png',
    description: 'Stiff shaft and heavy head. Endorsed by Lee Zii Jia, offering outstanding power and sharp attacking angles.',
    isNew: true,
    categoryName: 'Rackets',
    categoryId: 'cat-rackets'
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
    categoryId: 'cat-shoes'
  },
  {
    id: 'fallback-shoes-2',
    name: 'Yonex Power Cushion 65Z3 White/Red',
    brand: 'Yonex',
    price: 11490,
    imageURL: '/images/shoes.png',
    description: 'Professional player standard shoe. Features power cushion technology for quick repulsion and low stress on joints.',
    isNew: false,
    categoryName: 'Shoes',
    categoryId: 'cat-shoes'
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
    categoryId: 'cat-bags'
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
    categoryId: 'cat-shuttlecocks'
  },
  {
    id: 'fallback-shuttle-2',
    name: 'Apacs Aero Flight 700 Match Grade Shuttlecocks',
    brand: 'Apacs',
    price: 1890,
    imageURL: '/images/shuttlecocks.png',
    description: 'Excellent duck feather shuttlecocks for club matches, providing stable trajectory and solid hitting feel.',
    isNew: false,
    categoryName: 'Shuttlecocks',
    categoryId: 'cat-shuttlecocks'
  }
];

const Shop = () => {
  const location = useLocation();
  /* ── live Firestore data ─────────────────────────────────── */
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // SEO — set title + meta description for Shop page
  useEffect(() => {
    document.title = 'Buy Badminton Rackets, Shoes & Accessories — Majestic Sports | Dindigul';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Browse Majestic Sports\' full collection of premium badminton rackets (Yonex, Victor, Li-Ning), court shoes, bags, shuttlecocks, and accessories. Filter by brand and price. Expert WhatsApp consultation available. Dindigul, Tamil Nadu.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://eaf8614e.majestic1.pages.dev/shop');
  }, []);

  /* ── fallbacks wiring ────────────────────────────────────── */
  const showFallback = productsError || (!productsLoading && products.length === 0);
  const activeProducts = useMemo(() => {
    return showFallback ? CURATED_FALLBACK_PRODUCTS : products;
  }, [products, showFallback]);

  const activeCategories = useMemo(() => {
    const fallback = categoriesError || (!categoriesLoading && categories.length === 0);
    return fallback ? FALLBACK_CATEGORIES : categories;
  }, [categories, categoriesLoading, categoriesError]);

  /* ── filter / sort state ─────────────────────────────────── */
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]); // [0,0] = "not yet initialised"
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Handle category query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  /* ── derived values ──────────────────────────────────────── */
  const loading = productsLoading || categoriesLoading;

  // Dynamic max price from active products list
  const maxPrice = useMemo(
    () => (activeProducts.length > 0 ? Math.max(...activeProducts.map((p) => p.price || 0)) : 20000),
    [activeProducts]
  );

  // Derive effective price range without a sync effect (avoids re-render loops)
  const effectivePriceRange = useMemo(() => {
    if (priceRange[1] === 0) return [0, maxPrice];
    return [priceRange[0], Math.min(priceRange[1], maxPrice)];
  }, [priceRange, maxPrice]);

  // Find the active category document from the categories list
  const activeCategoryDoc = useMemo(() => {
    return activeCategories.find((c) => c.slug === activeCategory);
  }, [activeCategories, activeCategory]);

  // Dynamic category product counts
  const categoryCounts = useMemo(() => {
    const counts = { all: activeProducts.length };
    activeProducts.forEach((p) => {
      const cat = activeCategories.find((c) => c.id === p.categoryId) ||
                  activeCategories.find((c) => c.name.toLowerCase() === (p.categoryName || '').toLowerCase());
      const slug = cat ? cat.slug : (p.categoryName || '').toLowerCase().replace(/\s+/g, '-');
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  }, [activeProducts, activeCategories]);

  // Unique brands extracted from active product data
  const availableBrands = useMemo(
    () => [...new Set(activeProducts.map((p) => p.brand).filter(Boolean))].sort(),
    [activeProducts]
  );

  // Active filter count for UI badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.length > 0) count++;
    if (showNewOnly) count++;
    if (priceRange[1] !== 0 && priceRange[1] < maxPrice) count++;
    return count;
  }, [selectedBrands, showNewOnly, priceRange, maxPrice]);

  /* ── clear all sidebar filters ───────────────────────────── */
  const handleClearAll = useCallback(() => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setShowNewOnly(false);
  }, [maxPrice]);

  /* ── combined filter + sort pipeline on active data ────────── */
  const filteredProducts = useMemo(() => {
    return activeProducts
      // 1. Category filter — match on categoryId, slug or lowercased name
      .filter((p) => {
        if (activeCategory === 'all') return true;
        if (activeCategoryDoc && p.categoryId === activeCategoryDoc.id) return true;
        const slug = (p.categoryName || '').toLowerCase().replace(/\s+/g, '-');
        return slug === activeCategory || (p.categoryName || '').toLowerCase() === activeCategory;
      })
      // 2. Brand filter
      .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
      // 3. Price range
      .filter((p) => (p.price || 0) >= effectivePriceRange[0] && (p.price || 0) <= effectivePriceRange[1])
      // 4. New arrivals only
      .filter((p) => !showNewOnly || p.isNew)
      // 5. Sort
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return (a.price || 0) - (b.price || 0);
          case 'price-desc':
            return (b.price || 0) - (a.price || 0);
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'newest':
          default:
            if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
            return 0;
        }
      });
  }, [activeProducts, activeCategory, activeCategoryDoc, selectedBrands, effectivePriceRange, showNewOnly, sortBy]);

  /* ── render ──────────────────────────────────────────────── */
  return (
    <div className="shop-page">
      {/* Premium Shop Header */}
      <div className="shop-header">
        <div className="container">
          <span className="shop-header-subtitle">Elite Badminton Equipment</span>
          <h1 className="shop-header-title">The Pro Shop</h1>
          <div className="shop-header-divider"></div>
        </div>
      </div>

      <div className="container">
        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={activeCategories}
          categoryCounts={categoryCounts}
          loading={categoriesLoading && !showFallback}
        />

        {showFallback && !loading && (
          <div className="fallback-banner" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="fallback-banner-content">
              <svg className="fallback-banner-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span className="fallback-banner-text">
                Showing <strong>Showcase Catalog</strong>. Available for custom orders and direct purchase inquiry via WhatsApp.
              </span>
            </div>
          </div>
        )}

        {/* Shop Layout Grid */}
        <div className="shop-layout">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            priceRange={effectivePriceRange}
            onPriceChange={setPriceRange}
            showNewOnly={showNewOnly}
            onNewOnlyChange={setShowNewOnly}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
            onClearAll={handleClearAll}
            maxPrice={maxPrice}
            availableBrands={availableBrands}
            activeFilterCount={activeFilterCount}
            resultCount={filteredProducts.length}
          />

          {/* Main Product Area */}
          <main className="shop-main-content">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div className="toolbar-info">
                <span className="product-count">
                  {loading && !showFallback
                    ? 'Loading products…'
                    : <>Showing <strong>{filteredProducts.length}</strong> of {activeProducts.length} products</>
                  }
                </span>
              </div>

              <div className="toolbar-actions">
                {/* Mobile Filter Trigger */}
                <button
                  className="btn-mobile-filter-trigger"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  aria-label="Open filters"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="filter-badge">{activeFilterCount}</span>
                  )}
                </button>

                {/* Sort By */}
                <div className="sort-dropdown-wrapper">
                  <select
                    id="shop-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <div className="sort-dropdown-arrow">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* View Toggle */}
                <ViewToggle activeView={view} onViewChange={setView} />
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="active-filters-chips">
                <span className="active-filters-label">Active Filters:</span>
                <div className="chips-list">
                  {selectedBrands.map((brand) => (
                    <div className="filter-chip" key={`brand-${brand}`}>
                      <span>{brand}</span>
                      <button
                        onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                        className="btn-remove-chip"
                        aria-label={`Remove brand ${brand}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {showNewOnly && (
                    <div className="filter-chip">
                      <span>New Arrivals</span>
                      <button
                        onClick={() => setShowNewOnly(false)}
                        className="btn-remove-chip"
                        aria-label="Remove new arrivals filter"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {priceRange[1] !== 0 && priceRange[1] < maxPrice && (
                    <div className="filter-chip">
                      <span>Max: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[1])}</span>
                      <button
                        onClick={() => setPriceRange([0, maxPrice])}
                        className="btn-remove-chip"
                        aria-label="Remove price filter"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button className="btn-clear-all-chips" onClick={handleClearAll}>
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Product Render */}
            <div className="shop-products-container">
              {/* Loading Skeleton */}
              {loading && !showFallback && (
                <div className="products-grid-layout">
                  {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* No Results */}
              {!loading && filteredProducts.length === 0 && (
                <div className="shop-empty-state">
                  <div className="shop-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--outline)" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <p className="shop-empty-title">No products found</p>
                  <p className="shop-empty-desc">Try adjusting your filters or check back later.</p>
                  {activeFilterCount > 0 && (
                    <button className="btn-primary" onClick={handleClearAll} style={{ marginTop: 16 }}>
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Products — Grid or List */}
              {!loading && filteredProducts.length > 0 && (
                view === 'grid'
                  ? <ProductGrid products={filteredProducts} />
                  : <ProductList products={filteredProducts} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
