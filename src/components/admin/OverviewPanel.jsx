import React, { useState, useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useSubscribers from '../../hooks/useSubscribers';
import { useToast } from '../../context/ToastContext';

const OverviewPanel = ({ setActivePanel }) => {
  const { products, loading: productsLoading, updateProductStock } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { subscribers, loading: subscribersLoading } = useSubscribers();
  const toast = useToast();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [stockUpdatingId, setStockUpdatingId] = useState(null);

  // Keep a ticking clock for operations dashboard aesthetic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  /* ── Calculations ─────────────────────────────────────────── */
  const totalValuation = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 15);
  const totalSubscribers = subscribers.length;
  const whatsappSubscribers = subscribers.filter((s) => s.whatsappNo).length;

  // Category Distribution
  const categoryCounts = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      count,
      percent: products.length > 0 ? Math.round((count / products.length) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // Recent 4 Subscribers
  const recentSubscribers = [...subscribers]
    .sort((a, b) => {
      const dateA = a.subscribedAt?.toDate ? a.subscribedAt.toDate() : new Date(a.subscribedAt);
      const dateB = b.subscribedAt?.toDate ? b.subscribedAt.toDate() : new Date(b.subscribedAt);
      return dateB - dateA;
    })
    .slice(0, 4);

  /* ── Actions ──────────────────────────────────────────────── */
  const handleStockUpdate = async (product, amount) => {
    const newStock = (product.stock || 0) + amount;
    if (newStock < 0) return;

    setStockUpdatingId(product.id);
    try {
      await updateProductStock(product.id, newStock);
      toast.success(`Updated "${product.name}" stock to ${newStock}.`);
    } catch (err) {
      toast.error(`Failed to update stock: ${err.message}`);
    } finally {
      setStockUpdatingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#0050cc', '#0266ff', '#000000', '#44474d', '#75777e', '#ba1a1a'];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getRelativeTime = (timeValue) => {
    if (!timeValue) return 'recently';
    const date = timeValue?.toDate ? timeValue.toDate() : new Date(timeValue);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? 'yesterday' : `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    if (seconds < 10) return 'just now';
    return `${Math.floor(seconds)} seconds ago`;
  };

  /* ── Skeletons ────────────────────────────────────────────── */
  const isLoading = productsLoading || categoriesLoading || subscribersLoading;

  if (isLoading) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ alignItems: 'center' }}>
          <div>
            <h2 className="admin-panel-title">Dashboard Overview</h2>
            <p className="admin-panel-subtitle">Loading operational statistics and activities…</p>
          </div>
        </div>
        <div className="admin-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-stat-card skeleton-block" style={{ height: 92, borderRadius: 4 }} />
          ))}
        </div>
        <div className="admin-form-grid" style={{ marginTop: 24 }}>
          <div className="admin-card skeleton-block" style={{ height: 350, borderRadius: 4 }} />
          <div className="admin-card skeleton-block" style={{ height: 350, borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Overview Page Header */}
      <div className="admin-panel-header overview-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="admin-panel-title">Dashboard Overview</h2>
          <p className="admin-panel-subtitle">Majestic Sports inventory levels, subscribers, and promotions console.</p>
        </div>
        <div className="admin-clock-widget">
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Analytics Stat Cards */}
      <div className="admin-stats-grid overview-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="admin-stat-value">₹{totalValuation.toLocaleString('en-IN')}</span>
          <span className="admin-stat-label">Catalog Valuation</span>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="admin-stat-value">{products.length}</span>
          <span className="admin-stat-label">Total Products</span>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="admin-stat-value">{totalSubscribers}</span>
          <span className="admin-stat-label">Subscribers ({whatsappSubscribers} WA)</span>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="admin-stat-value">{categories.length}</span>
          <span className="admin-stat-label">Categories</span>
        </div>
      </div>

      {/* Operations Grid */}
      <div className="admin-form-grid overview-grid">
        {/* Left Side: Inventory & Category details */}
        <div className="overview-col-left" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Low Stock Alert Widget */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="alert-pulse-dot" style={{ backgroundColor: lowStockProducts.length > 0 ? 'var(--error)' : '#00875a' }}></span>
                <h3 style={{ margin: 0 }}>Low Stock Alert</h3>
              </div>
              <span className="admin-badge-count bg-error">{lowStockProducts.length} Items</span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="admin-empty-state" style={{ padding: '24px 12px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00875a" strokeWidth="2" style={{ marginBottom: 8 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="empty-title" style={{ fontSize: 16, color: '#00875a' }}>All Inventory Stocked</p>
                <p className="empty-desc" style={{ fontSize: 13 }}>Every product catalog item has more than 15 units available.</p>
              </div>
            ) : (
              <div className="admin-low-stock-list">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="low-stock-item">
                    <img src={product.imageURL || 'https://placehold.co/40x40?text=?'} alt={product.name} className="low-stock-thumb" />
                    <div className="low-stock-info">
                      <span className="low-stock-name">{product.name}</span>
                      <span className="low-stock-desc">{product.brand || 'No Brand'} · ₹{product.price}</span>
                    </div>
                    
                    {/* Inline Stock Adjustment */}
                    <div className="low-stock-action-adjust">
                      <button 
                        className="btn-stock-adjust minus"
                        onClick={() => handleStockUpdate(product, -1)}
                        disabled={stockUpdatingId === product.id || product.stock <= 0}
                        title="Reduce stock by 1"
                      >
                        -
                      </button>
                      <span className={`low-stock-count-val ${(product.stock || 0) <= 5 ? 'critical' : 'warning'}`}>
                        {stockUpdatingId === product.id ? '…' : `${product.stock} units`}
                      </span>
                      <button 
                        className="btn-stock-adjust plus"
                        onClick={() => handleStockUpdate(product, 1)}
                        disabled={stockUpdatingId === product.id}
                        title="Increase stock by 1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution Widget */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ marginBottom: 16 }}>
              <h3>Catalog Mix</h3>
              <span className="admin-badge-count">{products.length} Products</span>
            </div>
            
            <div className="admin-catalog-mix-bars">
              {categoryCounts.map((cat) => (
                <div key={cat.id} className="catalog-mix-bar-row">
                  <div className="catalog-mix-bar-labels">
                    <span className="catalog-mix-cat-name">{cat.name}</span>
                    <span className="catalog-mix-cat-val">{cat.count} items ({cat.percent}%)</span>
                  </div>
                  <div className="catalog-mix-bar-track">
                    <div className="catalog-mix-bar-fill" style={{ width: `${cat.percent}%` }}></div>
                  </div>
                </div>
              ))}
              {categoryCounts.length === 0 && (
                <p className="empty-desc" style={{ textAlign: 'center', padding: '12px 0' }}>No categories created yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Activity & Shortcuts */}
        <div className="overview-col-right" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Recent Subscribers List */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ marginBottom: 16 }}>
              <h3>Recent Signups</h3>
              <button className="btn-admin-link" onClick={() => setActivePanel('subscribers')}>View All</button>
            </div>

            <div className="recent-signups-list">
              {recentSubscribers.map((sub) => (
                <div key={sub.id} className="recent-signup-item">
                  {sub.photoURL ? (
                    <img src={sub.photoURL} alt={sub.name} className="recent-signup-avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="recent-signup-avatar-initials" style={{ backgroundColor: getAvatarColor(sub.name) }}>
                      {getInitials(sub.name)}
                    </div>
                  )}
                  <div className="recent-signup-details">
                    <span className="signup-name">{sub.name || 'Anonymous'}</span>
                    <span className="signup-email">{sub.email || 'No email provided'}</span>
                    <span className="signup-time">{getRelativeTime(sub.subscribedAt)}</span>
                  </div>
                  {sub.whatsappNo && (
                    <button 
                      className="btn-quick-whatsapp-contact"
                      onClick={() => window.open(`https://wa.me/${sub.whatsappNo.replace(/[^\d]/g, '')}`, '_blank')}
                      title="Contact subscriber on WhatsApp"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {recentSubscribers.length === 0 && (
                <div className="admin-empty-state" style={{ padding: '24px 0' }}>
                  <p className="empty-title" style={{ fontSize: 15 }}>No Subscribers</p>
                  <p className="empty-desc">When users subscribe, they will be listed here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Shortcuts Widget */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ marginBottom: 16 }}>
              <h3>Quick Operations</h3>
            </div>
            
            <div className="dashboard-shortcuts-grid">
              <button className="shortcut-btn" onClick={() => setActivePanel('products')}>
                <div className="shortcut-icon-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="shortcut-texts">
                  <span className="shortcut-title">Publish Product</span>
                  <span className="shortcut-desc">Add gear item to catalog</span>
                </div>
              </button>

              <button className="shortcut-btn" onClick={() => setActivePanel('categories')}>
                <div className="shortcut-icon-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M3 20h4M3 12h18M3 4h18" />
                  </svg>
                </div>
                <div className="shortcut-texts">
                  <span className="shortcut-title">Add Category</span>
                  <span className="shortcut-desc">Create catalog section</span>
                </div>
              </button>

              <button className="shortcut-btn" onClick={() => setActivePanel('broadcast')}>
                <div className="shortcut-icon-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <div className="shortcut-texts">
                  <span className="shortcut-title">WhatsApp Broadcast</span>
                  <span className="shortcut-desc">Send alert campaign</span>
                </div>
              </button>

              <button className="shortcut-btn storefront" onClick={() => window.open('/', '_blank')}>
                <div className="shortcut-icon-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div className="shortcut-texts">
                  <span className="shortcut-title">View Site</span>
                  <span className="shortcut-desc">Open shop interface</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
