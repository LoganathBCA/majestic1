import React, { useMemo } from 'react';

/**
 * CategoryTabs
 * Builds pill-style tab buttons dynamically from the live Firestore
 * categories list.  Always prepends an "All Products" tab.
 *
 * Props
 * ─────────────────────────────────────────────────────────────────
 *   categories      : [{ id, name, slug }]  — from useCategories()
 *   loading         : boolean
 *   activeCategory  : string                — slug or 'all'
 *   onCategoryChange: fn(slug)
 */
const CategoryTabs = ({
  activeCategory = 'all',
  onCategoryChange,
  categories = [],
  categoryCounts = {},
  loading = false
}) => {
  // Build the full tab list: "All Products" + each Firestore category
  const tabs = useMemo(() => [
    { id: 'all', name: 'All Products', slug: 'all' },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
    }))
  ], [categories]);

  return (
    <div className="category-tabs-container">
      <div className="category-tabs" role="tablist" aria-label="Product categories">
        {tabs.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const count = categoryCounts[cat.slug];
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`category-tab-btn${isActive ? ' active' : ''}`}
              onClick={() => onCategoryChange && onCategoryChange(cat.slug)}
              disabled={loading}
            >
              {cat.name}
              {count !== undefined && <span className="category-tab-count">({count})</span>}
            </button>
          );
        })}

        {/* Shimmer placeholders while Firestore categories are loading */}
        {loading && tabs.length === 1 && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <span
                key={`skel-${i}`}
                className="category-tab-btn skeleton-tab"
                style={{ width: 70 + i * 18, display: 'inline-block', height: 36 }}
                aria-hidden="true"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;
