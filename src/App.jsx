import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import SubscribeModal from './components/auth/SubscribeModal';

// Lazy-loaded routes — split into separate chunks to reduce initial bundle size
const Shop = lazy(() => import('./pages/Shop'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Admin = lazy(() => import('./pages/Admin'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

/**
 * PageFallback
 * Minimal spinner shown while a lazy page chunk is loading.
 */
function PageFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" aria-label="Loading page..." role="status" />
    </div>
  );
}

/**
 * AnimatedRoutes
 * Wraps each route page in a fade-in container for smooth page transitions.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        {/* WishlistProvider must be inside AuthProvider so it can access useAuth() */}
        <BrowserRouter>
          <WishlistProvider>
            <Navbar />
            <div className="main-content">
              <AnimatedRoutes />
            </div>
            <Footer />
            <SubscribeModal />
          </WishlistProvider>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
