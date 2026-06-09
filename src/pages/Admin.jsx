import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import OverviewPanel from '../components/admin/OverviewPanel';
import CategoriesPanel from '../components/admin/CategoriesPanel';
import ProductsPanel from '../components/admin/ProductsPanel';
import SubscribersPanel from '../components/admin/SubscribersPanel';
import BroadcastPanel from '../components/admin/BroadcastPanel';
import FiltersPanel from '../components/admin/FiltersPanel';

const Admin = () => {
  const { user, loading, ADMIN_UID } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');

  // Dev-only bypass: only active in local development builds, never in production
  const isLocalhost = import.meta.env.DEV && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const hasBypassFlag = isLocalhost && localStorage.getItem('bypass_admin') === 'true';
  const isBypassed = isLocalhost && hasBypassFlag;

  // SEO — set title + meta description for Admin page
  useEffect(() => {
    document.title = 'Admin Dashboard — Majestic Sports';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Majestic Sports admin dashboard. Manage categories, products, subscribers, and WhatsApp broadcasts.');
    }
  }, []);

  // JS Step 1: Auth guard — redirect non-admin / unauthenticated visitors
  useEffect(() => {
    // Wait until Firebase has resolved the auth state before redirecting
    if (loading) return;
    if (isBypassed) return;
    if (!user || user.uid !== ADMIN_UID) {
      navigate('/');
    }
  }, [user, loading, ADMIN_UID, navigate, isBypassed]);

  // Render nothing while Firebase is still resolving the session
  if (loading && !isBypassed) return null;

  // Render nothing if the guard is about to redirect
  if (!isBypassed && (!user || user.uid !== ADMIN_UID)) return null;

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel setActivePanel={setActivePanel} />;
      case 'categories':
        return <CategoriesPanel />;
      case 'products':
        return <ProductsPanel />;
      case 'subscribers':
        return <SubscribersPanel />;
      case 'broadcast':
        return <BroadcastPanel />;
      case 'filters':
        return <FiltersPanel />;
      default:
        return <OverviewPanel setActivePanel={setActivePanel} />;
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <div className="admin-layout-container">
        {/* Admin Left Sidebar */}
        <AdminSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        
        {/* Main Content Area */}
        <main className="admin-main-content">
          <div className="admin-panel-viewport">
            {renderActivePanel()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
