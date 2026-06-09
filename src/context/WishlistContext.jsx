import React, { createContext, useContext } from 'react';
import useWishlistHook from '../hooks/useWishlist';
import { useAuth } from './AuthContext';

/**
 * WishlistContext
 * Thin provider that wires the useWishlist hook to the authenticated user
 * and exposes the wishlist API globally — no prop-drilling required.
 *
 * Must be rendered *inside* AuthProvider so useAuth() has a value.
 */
const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const wishlist = useWishlistHook(user);

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
};
