import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import useSubscribers from '../../hooks/useSubscribers';

/**
 * SubscribersPanel
 * Displays all signed-up users fetched from Firestore.
 * Includes search filtering, avatar display, CSV export,
 * and a side drawer detailing the user's wishlisted products.
 */
const SubscribersPanel = () => {
  const { subscribers, loading, error, refetch } = useSubscribers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  
  // Drawer states
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  /* ── Fetch Selected Subscriber's Wishlist ─────────────────── */
  useEffect(() => {
    if (!selectedSubscriber) {
      setWishlistItems([]);
      return;
    }

    const fetchWishlist = async () => {
      setWishlistLoading(true);
      try {
        const wishlistRef = collection(db, 'users', selectedSubscriber.id, 'wishlist');
        const snap = await getDocs(wishlistRef);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        setWishlistItems(list);
      } catch (err) {
        console.error('Error fetching subscriber wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, [selectedSubscriber]);

  /* ── Export CSV ────────────────────────────────────────────── */
  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    
    const headers = ['Name', 'Email', 'WhatsApp Number', 'Date Subscribed'];
    const rows = subscribers.map((sub) => {
      const dateVal = sub.subscribedAt;
      const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
      const formattedDate = isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
      return [
        `"${(sub.name || 'Anonymous').replace(/"/g, '""')}"`,
        `"${(sub.email || '').replace(/"/g, '""')}"`,
        `"${sub.whatsappNo || ''}"`,
        `"${formattedDate}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `majestic_sports_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Helpers ──────────────────────────────────────────────── */
  const formatDate = (value) => {
    if (!value) return '—';
    const d = value?.toDate ? value.toDate() : new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  /* ── Filters ──────────────────────────────────────────────── */
  const filteredSubscribers = subscribers.filter((sub) => {
    const q = searchQuery.toLowerCase();
    return (
      (sub.name || '').toLowerCase().includes(q) ||
      (sub.email || '').toLowerCase().includes(q) ||
      (sub.whatsappNo || '').includes(q)
    );
  });

  const withWhatsApp = subscribers.filter((s) => s.whatsappNo).length;

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">Newsletter Subscribers</h2>
          <p className="admin-panel-subtitle">
            View profiles and wishlists of players subscribed to premium inventory drops.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{subscribers.length}</span>
            <span className="admin-stat-label">Total</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{withWhatsApp}</span>
            <span className="admin-stat-label">WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
          Error loading subscribers: {error}
          <button
            className="btn-clear-filters"
            onClick={refetch}
            style={{ marginLeft: 12, textDecoration: 'underline' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Search + Action Buttons */}
      <div className="admin-card">
        <div className="admin-search-wrapper" style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="admin-input admin-search-input"
              placeholder="Search by name, email, or WhatsApp number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="admin-search-clear" onClick={() => setSearchQuery('')}>
                Clear
              </button>
            )}
          </div>

          <button
            className="btn-admin btn-admin-ghost"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            style={{ whiteSpace: 'nowrap', padding: '8px 14px' }}
            title="Download subscribers list as CSV"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>

          <button
            className="btn-admin btn-admin-secondary"
            onClick={refetch}
            disabled={loading}
            style={{ whiteSpace: 'nowrap', padding: '8px 14px' }}
            title="Refresh subscriber list"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
        {searchQuery && (
          <div className="admin-search-results-info">
            Found {filteredSubscribers.length}{' '}
            {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="admin-card no-padding overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp Number</th>
                <th>Date Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td>
                    <div className="skeleton-block" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  </td>
                  <td><div className="skeleton-block skeleton-line" style={{ width: '70%', height: 14 }} /></td>
                  <td><div className="skeleton-block skeleton-line" style={{ width: '85%', height: 14 }} /></td>
                  <td><div className="skeleton-block skeleton-line" style={{ width: '60%', height: 14 }} /></td>
                  <td><div className="skeleton-block skeleton-line" style={{ width: '75%', height: 14 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subscribers Table */}
      {!loading && (
        <div className="admin-card no-padding overflow-hidden">
          {filteredSubscribers.length > 0 ? (
            <table className="admin-table admin-table-interactive">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>WhatsApp Number</th>
                  <th>Date Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedSubscriber(sub)}
                    className={selectedSubscriber?.id === sub.id ? 'active-row' : ''}
                    title="Click to view details and wishlist"
                  >
                    <td>
                      {sub.photoURL ? (
                        <img
                          src={sub.photoURL}
                          alt={sub.name || 'User'}
                          className="admin-sub-avatar-img"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="admin-sub-avatar"
                          style={{ backgroundColor: getAvatarColor(sub.name) }}
                        >
                          {getInitials(sub.name)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="admin-sub-name">{sub.name || '—'}</span>
                    </td>
                    <td>
                      <span className="admin-sub-email">{sub.email || '—'}</span>
                    </td>
                    <td>
                      {sub.whatsappNo ? (
                        <div className="admin-whatsapp-badge-wrapper">
                          <span className="whatsapp-icon-dot" />
                          <span className="admin-sub-whatsapp">{sub.whatsappNo}</span>
                        </div>
                      ) : (
                        <span className="admin-sub-no-wa">No number</span>
                      )}
                    </td>
                    <td>
                      <span className="admin-sub-date">{formatDate(sub.subscribedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <p className="empty-title">
                {searchQuery ? 'No Subscribers Found' : 'No Subscribers Yet'}
              </p>
              <p className="empty-desc">
                {searchQuery
                  ? 'No subscribers match your current search query.'
                  : 'When users sign in and provide their WhatsApp number, they will appear here.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Slide-Out Details Drawer ───────────────────────────── */}
      {selectedSubscriber && (
        <div className="admin-drawer-overlay" onClick={() => setSelectedSubscriber(null)}>
          <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Subscriber Details</h3>
              <button className="btn-drawer-close" onClick={() => setSelectedSubscriber(null)} aria-label="Close panel">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* Profile Card */}
              <div className="drawer-profile-card">
                {selectedSubscriber.photoURL ? (
                  <img
                    src={selectedSubscriber.photoURL}
                    alt={selectedSubscriber.name}
                    className="drawer-profile-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="drawer-profile-avatar-initials"
                    style={{ backgroundColor: getAvatarColor(selectedSubscriber.name) }}
                  >
                    {getInitials(selectedSubscriber.name)}
                  </div>
                )}
                
                <h4 className="drawer-profile-name">{selectedSubscriber.name || 'Anonymous Player'}</h4>
                <p className="drawer-profile-email">{selectedSubscriber.email || 'No email associated'}</p>
                
                <div className="drawer-profile-stats">
                  <div className="profile-stat-box">
                    <span className="stat-box-title">Registered</span>
                    <span className="stat-box-value">{formatDate(selectedSubscriber.subscribedAt).split(',')[0]}</span>
                  </div>
                  <div className="profile-stat-box">
                    <span className="stat-box-title">WhatsApp Status</span>
                    <span className="stat-box-value">
                      {selectedSubscriber.whatsappNo ? (
                        <span className="status-text success">Connected</span>
                      ) : (
                        <span className="status-text pending">None</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp DM Trigger */}
              {selectedSubscriber.whatsappNo && (
                <div className="drawer-contact-section">
                  <button
                    className="btn-admin btn-broadcast-open btn-drawer-whatsapp-dm"
                    onClick={() => {
                      const number = selectedSubscriber.whatsappNo.replace(/[^\d]/g, '');
                      const name = selectedSubscriber.name || 'Player';
                      const message = encodeURIComponent(`Hi ${name}! Thanks for subscribing to Majestic Sports alerts. Are there any particular rackets or shoes we can help you find today?`);
                      window.open(`https://wa.me/${number}?text=${message}`, '_blank');
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Contact on WhatsApp
                  </button>
                </div>
              )}

              {/* Wishlist Section */}
              <div className="drawer-wishlist-section">
                <h4 className="section-title">
                  Subscriber Wishlist ({wishlistItems.length})
                </h4>

                {wishlistLoading ? (
                  <div className="drawer-wishlist-loading">
                    {[1, 2].map((i) => (
                      <div key={i} className="wishlist-item skeleton-block" style={{ height: 62, marginBottom: 10, borderRadius: 4 }} />
                    ))}
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="drawer-wishlist-empty">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4, marginBottom: 8 }}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <p>No items wishlisted yet.</p>
                    <span>When this user adds products to their wishlist, they will list here.</span>
                  </div>
                ) : (
                  <div className="drawer-wishlist-list">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="drawer-wishlist-item">
                        <img src={item.imageURL || 'https://placehold.co/40x40'} alt={item.name} className="wishlist-item-thumb" />
                        <div className="wishlist-item-info">
                          <span className="wishlist-item-name">{item.name}</span>
                          <span className="wishlist-item-subtext">{item.brand || 'No brand'} · ₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        {selectedSubscriber.whatsappNo && (
                          <button
                            className="btn-wishlist-item-offer"
                            title={`Send custom offer for ${item.name}`}
                            onClick={() => {
                              const number = selectedSubscriber.whatsappNo.replace(/[^\d]/g, '');
                              const name = selectedSubscriber.name || 'Player';
                              const msg = encodeURIComponent(`Hi ${name}! We noticed you added the *${item.name}* to your wishlist on Majestic Sports. It is currently in stock! Would you like us to arrange delivery for you?`);
                              window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
                            }}
                          >
                            Offer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscribersPanel;
