import React from 'react';

/**
 * FilterSidebar
 * Renders brand checkboxes, price slider, and new-arrivals toggle.
 * All data (brands list, max price) is derived from live Firestore
 * products by the parent Shop.jsx and passed as props.
 *
 * On mobile (< 992px) the sidebar becomes a slide-in drawer.
 *
 * Props
 * ──────────────────────────────────────────────────────────────
 *   availableBrands   : string[]    — unique brands from products
 *   selectedBrands    : string[]    — currently checked brands
 *   onBrandChange     : fn(string[])
 *   priceRange        : [min, max]
 *   onPriceChange     : fn([min, max])
 *   maxPrice          : number      — dynamic ceiling from products
 *   showNewOnly       : boolean
 *   onNewOnlyChange   : fn(boolean)
 *   isOpen            : boolean     — mobile drawer open state
 *   onClose           : fn()
 *   onClearAll        : fn()
 *   activeFilterCount : number      — badge count
 *   resultCount       : number      — matching products count
 */
const FilterSidebar = ({
  selectedBrands = [],
  onBrandChange,
  priceRange = [0, 20000],
  onPriceChange,
  showNewOnly = false,
  onNewOnlyChange,
  isOpen = false,
  onClose,
  onClearAll,
  maxPrice = 20000,
  availableBrands = [],
  activeFilterCount = 0,
  resultCount = 0
}) => {
  const brands = availableBrands;

  const handleBrandToggle = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    if (onBrandChange) onBrandChange(updated);
  };

  const handlePriceSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (onPriceChange) onPriceChange([0, val]);
  };

  // Percentage for slider fill track
  const sliderPercent = maxPrice > 0 ? Math.round((priceRange[1] / maxPrice) * 100) : 100;

  // Format currency in INR
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="filter-sidebar-overlay"
          onClick={onClose}
          role="presentation"
        />
      )}

      <aside
        className={`filter-sidebar${isOpen ? ' mobile-open' : ''}`}
        aria-label="Product filters"
      >
        <div className="filter-sidebar-content">
          {/* Header */}
          <div className="filter-sidebar-header">
            <h3>
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-header-badge">{activeFilterCount}</span>
              )}
            </h3>
            <div className="filter-header-actions">
              {activeFilterCount > 0 && (
                <button className="btn-clear-filters" onClick={onClearAll}>
                  Clear All
                </button>
              )}
              <button
                className="btn-close-filters-mobile"
                onClick={onClose}
                aria-label="Close filters"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable sections wrapper for mobile drawer layout */}
          <div className="filter-sidebar-scroll-wrapper">
            {/* ── Brand Filter ──────────────────────────────── */}
            <div className="filter-section">
              <h4 className="filter-section-title">Brand</h4>
              <div className="filter-options-list">
                {brands.length === 0 && (
                  <span className="filter-empty-hint">No brands available</span>
                )}
                {brands.map((brand) => (
                  <label key={brand} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="filter-checkbox"
                    />
                    <span className="custom-checkbox" />
                    <span className="filter-option-text">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Price Range Slider ────────────────────────── */}
            <div className="filter-section">
              <h4 className="filter-section-title">Max Price</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step={maxPrice > 5000 ? 500 : 100}
                  value={priceRange[1]}
                  onChange={handlePriceSliderChange}
                  className="price-slider"
                  style={{
                    background: `linear-gradient(to right, var(--secondary) 0%, var(--secondary) ${sliderPercent}%, var(--surface-container) ${sliderPercent}%, var(--surface-container) 100%)`
                  }}
                  aria-label="Maximum price"
                />
                <div className="price-display-row">
                  <span className="price-limit-min">{formatCurrency(0)}</span>
                  <span className="price-limit-current">{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* ── New Arrivals Toggle ───────────────────────── */}
            <div className="filter-section filter-section-toggles">
              <label className="filter-toggle-label">
                <div className="toggle-text-col">
                  <span className="toggle-title">New Arrivals Only</span>
                  <span className="toggle-desc">Show recently added equipment</span>
                </div>
                <div className="toggle-switch-wrapper">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={(e) => onNewOnlyChange && onNewOnlyChange(e.target.checked)}
                    className="toggle-switch-input"
                  />
                  <span className="toggle-switch-slider" />
                </div>
              </label>
            </div>
          </div>

          {/* ── Mobile: "Show Results" footer button ──────── */}
          <div className="filter-sidebar-footer-mobile">
            {activeFilterCount > 0 && (
              <button
                className="btn-clear-filters-mobile"
                onClick={onClearAll}
              >
                Clear All
              </button>
            )}
            <button
              className="btn-primary btn-show-results"
              onClick={onClose}
            >
              Show {resultCount} {resultCount === 1 ? 'Product' : 'Products'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
