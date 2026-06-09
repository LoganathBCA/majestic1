import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import useSubscribers from '../../hooks/useSubscribers';

/**
 * BroadcastPanel
 * Implements an interactive WhatsApp broadcast flow:
 *
 *   1. Compose Message: Type text, preview live in mock WhatsApp bubble, parse markup.
 *   2. Target Audience: Choose between all subscribers or those with active wishlists.
 *   3. Cockpit sending console: step-through recipients, open wa.me link with replaced {name},
 *      and display recipient's wishlist on-the-fly.
 */
const BroadcastPanel = () => {
  const { subscribers, loading, error, refetch } = useSubscribers();

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('compose'); // compose | sending | complete
  const [audienceFilter, setAudienceFilter] = useState('all'); // all | wishlist_only
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Wishlist caching for target filtering
  const [wishlistMap, setWishlistMap] = useState({});
  const [checkingWishlists, setCheckingWishlists] = useState(false);

  // Current recipient's wishlist items in cockpit
  const [currentWishlist, setCurrentWishlist] = useState([]);
  const [currentWishlistLoading, setCurrentWishlistLoading] = useState(false);

  /* ── Check wishlists for all subscribers for audience filtering ── */
  useEffect(() => {
    if (subscribers.length === 0) return;
    
    const loadWishlistStatus = async () => {
      setCheckingWishlists(true);
      const map = {};
      try {
        await Promise.all(
          subscribers.map(async (sub) => {
            if (!sub.whatsappNo) return;
            const ref = collection(db, 'users', sub.id, 'wishlist');
            const snap = await getDocs(ref);
            map[sub.id] = snap.size > 0;
          })
        );
        setWishlistMap(map);
      } catch (err) {
        console.error('Error fetching wishlists map:', err);
      } finally {
        setCheckingWishlists(false);
      }
    };

    loadWishlistStatus();
  }, [subscribers]);

  // Filter subscribers based on criteria
  const recipients = useMemo(() => {
    const waSubscribers = subscribers.filter((s) => s.whatsappNo);
    if (audienceFilter === 'wishlist_only') {
      return waSubscribers.filter((s) => wishlistMap[s.id] === true);
    }
    return waSubscribers;
  }, [subscribers, audienceFilter, wishlistMap]);

  const currentRecipient = recipients[currentIndex] || null;

  /* ── Fetch current recipient wishlist for the sending cockpit ── */
  useEffect(() => {
    if (status !== 'sending' || !currentRecipient) {
      setCurrentWishlist([]);
      return;
    }

    const fetchCurrentWishlist = async () => {
      setCurrentWishlistLoading(true);
      try {
        const ref = collection(db, 'users', currentRecipient.id, 'wishlist');
        const snap = await getDocs(ref);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCurrentWishlist(list);
      } catch (err) {
        console.error('Error loading current wishlist:', err);
      } finally {
        setCurrentWishlistLoading(false);
      }
    };

    fetchCurrentWishlist();
  }, [currentRecipient, status]);

  /* ── Formatting and previews ────────────────────────────────── */
  const parseWhatsAppMarkdown = (text) => {
    if (!text) return '<span class="preview-empty-text">Type a message to preview WhatsApp bubble...</span>';
    
    // Escape HTML
    let parsed = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Replace {name} placeholder
    parsed = parsed.replace(/\{name\}/g, '<span class="preview-variable-tag">{name}</span>');
    
    // Parse *bold* -> <strong>
    parsed = parsed.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    // Parse _italics_ -> <em>
    parsed = parsed.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Parse ~strikethrough~ -> <del>
    parsed = parsed.replace(/~(.*?)~/g, '<del>$1</del>');

    // Newlines -> <br/>
    parsed = parsed.replace(/\n/g, '<br />');
    
    return parsed;
  };

  const insertPlaceholder = (tag) => {
    setMessage(prev => prev + tag);
  };

  /* ── Action Handlers ────────────────────────────────────────── */
  const handleStartBroadcast = (e) => {
    e.preventDefault();
    if (!message.trim() || recipients.length === 0) return;
    setStatus('sending');
    setCurrentIndex(0);
    setOpenedCount(0);
    setSkippedCount(0);
    setConsoleLogs([`[INFO] Campaign started at ${new Date().toLocaleTimeString()}`, `[INFO] Targets: ${recipients.length} recipients`]);
  };

  const handleOpenChat = () => {
    if (!currentRecipient) return;
    
    // Replace variable placeholders dynamically
    const nameVal = currentRecipient.name || 'Player';
    const parsedMsg = message.replace(/\{name\}/g, nameVal);
    
    const cleanedNumber = currentRecipient.whatsappNo.replace(/[^\d]/g, '');
    const url = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(parsedMsg)}`;
    
    window.open(url, '_blank');
    setOpenedCount((prev) => prev + 1);
    
    setConsoleLogs((prev) => [
      ...prev,
      `[SUCCESS] Opened chat link for: ${nameVal} (${currentRecipient.whatsappNo})`
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= recipients.length) {
      setConsoleLogs((prev) => [...prev, `[INFO] Campaign finished at ${new Date().toLocaleTimeString()}`]);
      setStatus('complete');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    if (!currentRecipient) return;
    const nameVal = currentRecipient.name || 'Player';
    setSkippedCount((prev) => prev + 1);
    setConsoleLogs((prev) => [
      ...prev,
      `[SKIPPED] Skipped recipient: ${nameVal}`
    ]);
    handleNext();
  };

  const handleReset = () => {
    setMessage('');
    setStatus('compose');
    setCurrentIndex(0);
    setOpenedCount(0);
    setSkippedCount(0);
    setConsoleLogs([]);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">WhatsApp Broadcasts</h2>
          <p className="admin-panel-subtitle">
            Configure, preview, and step-through promotional message campaigns via WhatsApp.
          </p>
        </div>
        {status === 'compose' && (
          <div className="admin-stat-card">
            <span className="admin-stat-value">
              {loading ? '…' : recipients.length}
            </span>
            <span className="admin-stat-label">Active Audience</span>
          </div>
        )}
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
          Failed to load subscribers: {error}
          <button
            className="btn-clear-filters"
            onClick={refetch}
            style={{ marginLeft: 12, textDecoration: 'underline' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ═══ COMPOSE VIEW ═══════════════════════════════════ */}
      {status === 'compose' && (
        <div className="broadcast-composing-layout">
          {/* Editor Form */}
          <div className="admin-card compose-editor-card">
            <form onSubmit={handleStartBroadcast} className="admin-form">
              {/* Audience Filter Settings */}
              <div className="admin-form-group">
                <label className="admin-form-label">Target Audience</label>
                <div className="broadcast-audience-filters-grid">
                  <label className={`filter-radio-card ${audienceFilter === 'all' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="audience" 
                      value="all" 
                      checked={audienceFilter === 'all'} 
                      onChange={() => setAudienceFilter('all')} 
                    />
                    <div className="radio-card-content">
                      <span className="radio-title">All WhatsApp Subscribers</span>
                      <span className="radio-desc">Every player with a registered WhatsApp number</span>
                    </div>
                  </label>

                  <label className={`filter-radio-card ${audienceFilter === 'wishlist_only' ? 'active' : ''} ${checkingWishlists ? 'disabled' : ''}`}>
                    <input 
                      type="radio" 
                      name="audience" 
                      value="wishlist_only" 
                      checked={audienceFilter === 'wishlist_only'} 
                      onChange={() => setAudienceFilter('wishlist_only')} 
                      disabled={checkingWishlists}
                    />
                    <div className="radio-card-content">
                      <span className="radio-title">Wishlisted Players Only</span>
                      <span className="radio-desc">Target subscribers with active items in their wishlist</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Composer Area */}
              <div className="admin-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="admin-form-label required">Broadcast Message</label>
                  
                  {/* Dynamic Variable Buttons */}
                  <div className="editor-var-buttons">
                    <button 
                      type="button" 
                      className="btn-editor-var" 
                      onClick={() => insertPlaceholder('{name}')}
                      title="Insert recipient's first name dynamically"
                    >
                      + Recipient Name
                    </button>
                  </div>
                </div>

                <div className="textarea-wrapper">
                  <textarea
                    rows="7"
                    className="admin-input admin-textarea broadcast-textarea"
                    placeholder="e.g., Hi {name}! 👋 The new Yonex Astrox 99 Pro is back in stock in limited quantities. View it here: majestic-sports.com/shop. Or message us to buy!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    required
                  />
                  <span className={`char-count-badge ${message.length > 800 ? 'char-warning' : ''}`}>
                    {message.length} / 1000
                  </span>
                </div>

                <div className="formatting-tips-text">
                  Tip: Use <code>*bold*</code>, <code>_italics_</code>, or <code>~strike~</code> for WhatsApp style formatting.
                </div>
              </div>

              <div className="broadcast-audience-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--secondary)', flexShrink: 0 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>
                  This campaign will target <strong>{loading ? '…' : recipients.length}</strong> player accounts.
                  {audienceFilter === 'wishlist_only' && checkingWishlists && ' (loading wishlist indexes...)'}
                </span>
              </div>

              <div className="admin-form-actions" style={{ border: 'none', paddingTop: 0 }}>
                <button
                  type="submit"
                  className="btn-admin btn-admin-primary btn-broadcast-send"
                  disabled={!message.trim() || loading || recipients.length === 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Initiate Campaign
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Smartphone WhatsApp Live Preview */}
          <div className="whatsapp-preview-phone">
            <div className="phone-screen-container">
              <div className="phone-bar-notch"></div>
              
              {/* WhatsApp Header */}
              <div className="whatsapp-phone-header">
                <div className="wa-header-avatar">M</div>
                <div className="wa-header-details">
                  <span className="wa-header-title">Majestic Sports Alert</span>
                  <span className="wa-header-subtitle">Online</span>
                </div>
                <div className="wa-header-actions">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                </div>
              </div>

              {/* Chat View Area */}
              <div className="whatsapp-phone-chat-body">
                <div className="whatsapp-bubble-received">
                  <div 
                    className="whatsapp-bubble-content" 
                    dangerouslySetInnerHTML={{ __html: parseWhatsAppMarkdown(message) }}
                  />
                  <span className="whatsapp-bubble-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SENDING COCKPIT VIEW ═══════════════════════════ */}
      {status === 'sending' && currentRecipient && (
        <div className="broadcast-cockpit-layout">
          <div className="admin-card cockpit-main-card">
            {/* Progress Header */}
            <div className="broadcast-progress-header">
              <h3>Campaign Cockpit</h3>
              <span className="progress-fraction">
                {currentIndex + 1} / {recipients.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="admin-progress-container">
              <div className="admin-progress-bar-track">
                <div
                  className="admin-progress-bar-fill animated"
                  style={{ width: `${Math.round(((currentIndex + 1) / recipients.length) * 100)}%` }}
                />
              </div>
              <span className="admin-progress-percent">
                {Math.round(((currentIndex + 1) / recipients.length) * 100)}%
              </span>
            </div>

            {/* Current Recipient & Wishlist Panel */}
            <div className="cockpit-detail-grid">
              {/* Target Recipient Card */}
              <div className="broadcast-recipient-card">
                <div className="recipient-info" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  {currentRecipient.photoURL ? (
                    <img
                      src={currentRecipient.photoURL}
                      alt={currentRecipient.name}
                      className="recipient-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="recipient-avatar-initials">
                      {currentRecipient.name ? currentRecipient.name.substring(0, 2).toUpperCase() : '?'}
                    </div>
                  )}
                  <div className="recipient-details">
                    <span className="recipient-name">
                      {currentRecipient.name || 'Anonymous User'}
                    </span>
                    <span className="recipient-number">
                      {currentRecipient.whatsappNo}
                    </span>
                    <span className="recipient-email">{currentRecipient.email || 'No email associated'}</span>
                  </div>
                </div>
              </div>

              {/* Target Recipient Wishlist Preview */}
              <div className="cockpit-wishlist-preview-card">
                <span className="preview-label">User Wishlist ({currentWishlist.length})</span>
                
                {currentWishlistLoading ? (
                  <div className="skeleton-row" style={{ height: 38, marginTop: 8 }} />
                ) : currentWishlist.length === 0 ? (
                  <div className="cockpit-wishlist-empty">This player has no items wishlisted.</div>
                ) : (
                  <div className="cockpit-wishlist-scroll-items">
                    {currentWishlist.map(item => (
                      <div key={item.id} className="cockpit-wishlist-row">
                        <img src={item.imageURL} alt={item.name} className="cockpit-wishlist-thumb" />
                        <span className="cockpit-wishlist-name">{item.name}</span>
                        <span className="cockpit-wishlist-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Custom Message Output */}
            <div className="broadcast-message-preview" style={{ marginTop: 16 }}>
              <span className="preview-label">Custom Message Sent (Variables replaced)</span>
              <blockquote className="preview-blockquote">
                {message.replace(/\{name\}/g, currentRecipient.name || 'Player')}
              </blockquote>
            </div>

            {/* Console action triggers */}
            <div className="broadcast-action-buttons" style={{ marginTop: 24 }}>
              <button className="btn-admin btn-admin-ghost" onClick={handleSkip}>
                Skip Player
              </button>
              
              <button className="btn-admin btn-broadcast-open" onClick={handleOpenChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Open WhatsApp & Send
              </button>

              <button className="btn-admin btn-admin-primary" onClick={handleNext}>
                {currentIndex + 1 >= recipients.length ? 'Finish Campaign' : 'Next Recipient →'}
              </button>
            </div>
          </div>

          {/* Logging Output Terminal */}
          <div className="admin-card broadcast-console-card">
            <div className="broadcast-console">
              <div className="console-header">
                <span className="console-dot red"></span>
                <span className="console-dot yellow"></span>
                <span className="console-dot green"></span>
                <span className="console-title">Campaign Output Log</span>
              </div>
              <div className="console-body">
                {consoleLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`console-line ${log.includes('[SUCCESS]') ? 'success' : log.includes('[INFO]') ? 'info' : ''}`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ COMPLETE VIEW ══════════════════════════════════ */}
      {status === 'complete' && (
        <div className="admin-card broadcast-complete-card">
          <div className="complete-checkmark-wrapper">
            <svg className="complete-checkmark-svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <h3 className="complete-title">Broadcast Complete! ✅</h3>
          <p className="complete-desc">
            WhatsApp campaign was processed successfully.
          </p>

          <div className="complete-summary">
            <div className="summary-row">
              <span className="summary-label">Audience Target</span>
              <span className="summary-value">
                {audienceFilter === 'wishlist_only' ? 'Wishlisted Subscribers' : 'All Subscribers'}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Recipients Audited</span>
              <span className="summary-value">{recipients.length} Players</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Chats Opened</span>
              <span className="summary-value success-text">
                {openedCount} / {recipients.length}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Recipients Skipped</span>
              <span className="summary-value">{skippedCount}</span>
            </div>
            <div className="summary-row message-summary">
              <span className="summary-label">Campaign Message Template</span>
              <blockquote className="summary-blockquote">"{message}"</blockquote>
            </div>
          </div>

          <button onClick={handleReset} className="btn-admin btn-admin-primary">
            Create New Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default BroadcastPanel;
