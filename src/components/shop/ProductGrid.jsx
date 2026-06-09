import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="empty-shop-state">
        <h3>No Products Found</h3>
        <p>Try clearing your filters or selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="products-grid-layout">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  );
};

export default ProductGrid;
