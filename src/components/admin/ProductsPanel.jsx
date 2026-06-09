import React, { useState, useRef } from 'react';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import { useToast } from '../../context/ToastContext';
import SpecsSection, { SPEC_FIELDS } from './SpecsSection';

const ProductsPanel = () => {
  const { products, loading: productsLoading, error: productsError, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const toast = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Spec fields — keyed object for known specs
  const emptySpecs = () => Object.fromEntries(SPEC_FIELDS.map(f => [f.key, '']));
  const [specs, setSpecs] = useState(emptySpecs());
  // Additional free-form specs: [{key, value}]
  const [customSpecs, setCustomSpecs] = useState([]);

  const fileInputRef = useRef(null);

  // ── Form helpers ──────────────────────────────────────────────────
  const resetForm = () => {
    setName(''); setCategoryId(''); setCategoryName('');
    setPrice(''); setStock(''); setBrand('');
    setDescription(''); setIsNew(false);
    setImagePreview(null); setImageFile(null);
    setSpecs(emptySpecs()); setCustomSpecs([]);
    setFormError('');
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    resetForm();
    // Default to first category if available
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
      setCategoryName(categories[0].name);
    }
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setName(product.name || '');
    setCategoryId(product.categoryId || '');
    setCategoryName(product.categoryName || '');
    setPrice(product.price?.toString() || '');
    setStock(product.stock?.toString() || '');
    setBrand(product.brand || '');
    setDescription(product.description || '');
    setIsNew(product.isNew || false);
    setImagePreview(product.imageURL || null);
    setImageFile(null);
    // Restore known specs
    const loadedSpecs = Object.fromEntries(SPEC_FIELDS.map(f => [f.key, product[f.key] || '']));
    setSpecs(loadedSpecs);
    // Restore custom specs
    setCustomSpecs(Array.isArray(product.additionalSpecs) ? product.additionalSpecs : []);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = categories.find((c) => c.id === selectedId);
    setCategoryId(selectedId);
    setCategoryName(selectedCat ? selectedCat.name : '');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Spec handlers ─────────────────────────────────────────────────
  const handleSpecChange = (key, value) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomSpecAdd = () => {
    setCustomSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleCustomSpecRemove = (index) => {
    setCustomSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomSpecChange = (index, field, value) => {
    setCustomSpecs(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) { setFormError('Product name is required.'); return; }
    if (!price || isNaN(Number(price)) || Number(price) < 0) { setFormError('Enter a valid price.'); return; }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) { setFormError('Enter a valid stock quantity.'); return; }
    if (!editingProduct && !imageFile) { setFormError('Please select a product image.'); return; }

    setSubmitting(true);
    try {
      // Build known spec fields — only include non-empty ones
      const specData = {};
      SPEC_FIELDS.forEach(({ key }) => {
        if (specs[key] && specs[key].trim()) specData[key] = specs[key].trim();
      });
      // Filter out empty custom specs
      const cleanCustomSpecs = customSpecs.filter(s => s.key.trim() && s.value.trim());

      const data = {
        name, categoryId, categoryName,
        price: Number(price), stock: Number(stock),
        brand, description, isNew,
        ...specData,
        additionalSpecs: cleanCustomSpecs,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data, imageFile || null);
        toast.success(`"${name.trim()}" updated successfully.`);
      } else {
        await addProduct(data, imageFile);
        toast.success(`"${name.trim()}" published successfully.`);
      }
      handleCloseForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This also removes the image from Cloudinary.`)) return;
    try {
      await deleteProduct(product.id, product.cloudinaryId);
      toast.success(`"${product.name}" deleted.`);
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────
  if (productsLoading || categoriesLoading) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Manage Products</h2>
            <p className="admin-panel-subtitle">Loading products from Firestore…</p>
          </div>
        </div>
        <div className="admin-stats-grid">
          {[1, 2, 3].map((i) => <div key={i} className="admin-stat-card skeleton-block" />)}
        </div>
        <div className="admin-card">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-row" style={{ height: 60, marginBottom: 12, borderRadius: 4 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">Manage Products</h2>
          <p className="admin-panel-subtitle">Maintain the equipment inventory catalog, prices, and stock levels.</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleOpenAddForm} className="btn-admin btn-admin-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        )}
      </div>

      {productsError && <div className="admin-alert admin-alert-error">{productsError}</div>}

      {/* Stats (list view only) */}
      {!isFormOpen && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-value">{products.length}</span>
            <span className="admin-stat-label">Total Products</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{products.filter((p) => (p.stock || 0) <= 15).length}</span>
            <span className="admin-stat-label">Low Stock Items</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">
              ₹{products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0).toLocaleString('en-IN')}
            </span>
            <span className="admin-stat-label">Stock Valuation</span>
          </div>
        </div>
      )}

      {isFormOpen ? (
        /* ── Add / Edit Form ── */
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editingProduct ? 'Edit Product Details' : 'Add New Product'}</h3>
            <button onClick={handleCloseForm} className="btn-admin-close" disabled={submitting}>
              Cancel
            </button>
          </div>

          {formError && <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>{formError}</div>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-grid">
              {/* Left column */}
              <div className="admin-form-col-left">
                <div className="admin-form-group">
                  <label className="admin-form-label required">Product Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., Yonex Astrox 100 Game"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Brand</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., Yonex, Victor, Li-Ning"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label required">Category</label>
                    <select
                      className="admin-input admin-select"
                      value={categoryId}
                      onChange={handleCategoryChange}
                      disabled={submitting}
                    >
                      <option value="">— Select category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label required">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="admin-input"
                      placeholder="1200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label required">Stock Qty</label>
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="20"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    rows="4"
                    className="admin-input admin-textarea"
                    placeholder="Key specs, materials, player level recommendations…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    disabled={submitting}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="isNew" className="admin-form-label" style={{ margin: 0 }}>
                    Mark as New Arrival
                  </label>
                </div>
              </div>

              {/* Right column — Image upload */}
              <div className="admin-form-col-right">
                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Product Image {!editingProduct && <span style={{ color: 'var(--error)' }}>*</span>}
                  </label>
                  {submitting && imageFile && (
                    <div className="admin-alert" style={{ marginBottom: 8, background: 'rgba(2,102,255,0.06)', border: '1px solid rgba(2,102,255,0.2)', color: 'var(--secondary)', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
                      Uploading to Cloudinary…
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div className="image-upload-zone" onClick={() => !submitting && fileInputRef.current.click()}>
                    {imagePreview ? (
                      <div className="image-preview-wrapper">
                        <img src={imagePreview} alt="Preview" className="upload-preview" />
                        <div className="upload-overlay">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span>Replace Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p className="upload-main-text">Click to browse files</p>
                        <p className="upload-sub-text">PNG, JPG, or WEBP · uploaded to Cloudinary</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <SpecsSection
              specs={specs}
              onSpecChange={handleSpecChange}
              customSpecs={customSpecs}
              onCustomSpecAdd={handleCustomSpecAdd}
              onCustomSpecRemove={handleCustomSpecRemove}
              onCustomSpecChange={handleCustomSpecChange}
              disabled={submitting}
            />

            <div className="admin-form-actions">
              <button type="button" onClick={handleCloseForm} className="btn-admin btn-admin-ghost" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn-admin btn-admin-primary" disabled={submitting}>
                {submitting
                  ? (imageFile ? 'Uploading image…' : 'Saving…')
                  : (editingProduct ? 'Save Changes' : 'Publish Product')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── Products Table ── */
        <div className="admin-card no-padding overflow-hidden">
          {products.length === 0 ? (
            <div className="admin-empty-state">
              <p className="empty-title">No Products Yet</p>
              <p className="empty-desc">Click "Add Product" to publish your first item.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Item</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-prod-thumbnail-wrapper">
                        <img
                          src={product.imageURL || 'https://placehold.co/48x48?text=?'}
                          alt={product.name}
                          className="admin-prod-thumbnail"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="admin-prod-info">
                        <span className="admin-prod-name">{product.name}</span>
                        <span className="admin-prod-desc-truncated">{product.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="admin-category-badge">{product.categoryName || '—'}</span>
                    </td>
                    <td className="admin-price-cell">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`admin-stock-status ${(product.stock || 0) <= 15 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock || 0} units
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <button
                          onClick={() => handleOpenEditForm(product)}
                          className="btn-admin-icon btn-edit"
                          title="Edit Product"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="16 3 21 8 8 21 3 21 3 16 16 3" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="btn-admin-icon btn-delete"
                          title="Delete Product"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;
