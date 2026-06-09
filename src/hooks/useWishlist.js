import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * useWishlist(user)
 *
 * Subscribes in real-time to the authenticated user's wishlist subcollection:
 *   users/{uid}/wishlist/{productId}
 *
 * Each wishlist document stores a snapshot of the product so the Wishlist page
 * never needs a secondary Firestore round-trip.
 *
 * Returns:
 *   wishlistItems  — array of { id, name, brand, price, imageURL, isNew, ... }
 *   wishlistIds    — Set<string> of product IDs for O(1) `isWishlisted` checks
 *   loading        — true until the first snapshot arrives
 *   addToWishlist(product)      — writes/overwrites the subcollection doc
 *   removeFromWishlist(id)      — deletes the subcollection doc
 *   toggleWishlist(product)     — adds if absent, removes if present
 *   isWishlisted(id)            — boolean lookup
 */
const useWishlist = (user) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Real-time subscription — only active while a user is signed in
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      // Logged out — clear state and skip subscription
      setWishlistItems([]);
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);

    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
    const unsubscribe = onSnapshot(
      wishlistRef,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWishlistItems(items);
        setWishlistIds(new Set(items.map((i) => i.id)));
        setLoading(false);
      },
      (err) => {
        console.error('useWishlist snapshot error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ---------------------------------------------------------------------------
  // addToWishlist — stores a product snapshot in Firestore
  // ---------------------------------------------------------------------------
  const addToWishlist = useCallback(
    async (product) => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'wishlist', product.id);
      await setDoc(ref, {
        name:       product.name       ?? '',
        brand:      product.brand      ?? '',
        price:      product.price      ?? 0,
        imageURL:   product.imageURL   ?? '',
        isNew:      product.isNew      ?? false,
        categoryId: product.categoryId ?? '',
        description: product.description ?? '',
        addedAt:    serverTimestamp()
      });
    },
    [user]
  );

  // ---------------------------------------------------------------------------
  // removeFromWishlist — deletes the product doc from the subcollection
  // ---------------------------------------------------------------------------
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'wishlist', productId);
      await deleteDoc(ref);
    },
    [user]
  );

  // ---------------------------------------------------------------------------
  // toggleWishlist — convenience wrapper
  // ---------------------------------------------------------------------------
  const toggleWishlist = useCallback(
    async (product) => {
      if (!user) return;
      if (wishlistIds.has(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    },
    [user, wishlistIds, addToWishlist, removeFromWishlist]
  );

  // ---------------------------------------------------------------------------
  // isWishlisted — synchronous O(1) check
  // ---------------------------------------------------------------------------
  const isWishlisted = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds]
  );

  return {
    wishlistItems,
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted
  };
};

export default useWishlist;
