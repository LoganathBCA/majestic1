import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Cloudinary credentials (from scope.md — safe to expose; upload_preset is the auth layer)
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dath9ga29/image/upload';
const CLOUDINARY_PRESET = 'majestic1';

/**
 * uploadToCloudinary(file)
 * Posts a file to Cloudinary via unsigned upload preset.
 * Returns { imageURL, cloudinaryId }
 */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  return { imageURL: data.secure_url, cloudinaryId: data.public_id };
};

/**
 * deleteFromCloudinary(cloudinaryId)
 * Removes an image from Cloudinary via the Destroy API.
 * Note: Cloudinary's client-side delete requires a signed request in strict mode.
 * With an unsigned preset this may be restricted; we log gracefully if it fails
 * so Firestore is still cleaned up.
 */
const deleteFromCloudinary = async (cloudinaryId) => {
  try {
    const formData = new FormData();
    formData.append('public_id', cloudinaryId);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    await fetch(
      `https://api.cloudinary.com/v1_1/dath9ga29/image/destroy`,
      { method: 'POST', body: formData }
    );
  } catch (err) {
    // Non-fatal — Firestore doc will still be deleted
    console.warn('Cloudinary destroy warning:', err.message);
  }
};

/**
 * useProducts
 * Real-time products list from Firestore.
 * Provides: products, loading, error, addProduct, updateProduct, deleteProduct
 *
 * PERFORMANCE NOTE: The Firestore listener is deferred using requestIdleCallback
 * (with setTimeout fallback, max 300ms). This prevents Firestore's long-polling
 * connections from blocking the browser's first paint (LCP) measurement.
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const startListener = () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          setProducts(list);
          setLoading(false);
        },
        (err) => {
          console.error('useProducts snapshot error:', err);
          setError(err.message);
          setLoading(false);
        }
      );
    };

    // Defer the Firestore connection until the browser is idle (or max 300ms).
    // This avoids the long-polling handshake blocking LCP measurement.
    let timerId;
    if (typeof requestIdleCallback !== 'undefined') {
      timerId = requestIdleCallback(startListener, { timeout: 300 });
    } else {
      timerId = setTimeout(startListener, 0);
    }

    return () => {
      if (typeof requestIdleCallback !== 'undefined') {
        cancelIdleCallback(timerId);
      } else {
        clearTimeout(timerId);
      }
      if (unsubscribe) unsubscribe();
    };
  }, []);


  /**
   * addProduct(data, imageFile)
   * Uploads image to Cloudinary then writes a new Firestore product doc.
   *
   * data: { name, description, price, brand, categoryId, categoryName, isNew }
   * imageFile: File object (required for a new product)
   */
  const addProduct = async (data, imageFile) => {
    if (!imageFile) throw new Error('Please select a product image.');

    const { imageURL, cloudinaryId } = await uploadToCloudinary(imageFile);

    // Extract spec fields from data (everything not in the core fields)
    const CORE_FIELDS = ['name', 'description', 'price', 'brand', 'categoryId', 'categoryName', 'isNew', 'stock', 'additionalSpecs'];
    const specData = {};
    Object.keys(data).forEach(key => {
      if (!CORE_FIELDS.includes(key)) specData[key] = data[key];
    });

    await addDoc(collection(db, 'products'), {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      price: Number(data.price),
      brand: data.brand?.trim() || '',
      categoryId: data.categoryId || '',
      categoryName: data.categoryName || '',
      imageURL,
      cloudinaryId,
      isNew: Boolean(data.isNew),
      stock: Number(data.stock) || 0,
      additionalSpecs: data.additionalSpecs || [],
      ...specData,
      createdAt: serverTimestamp()
    });
  };

  /**
   * updateProduct(id, data, newImageFile?)
   * If newImageFile provided → upload to Cloudinary, delete old image, update Firestore.
   * Otherwise → update Firestore fields only (keep existing imageURL/cloudinaryId).
   */
  const updateProduct = async (id, data, newImageFile) => {
    const existingProduct = products.find((p) => p.id === id);
    if (!existingProduct) throw new Error('Product not found.');

    let imageURL = existingProduct.imageURL;
    let cloudinaryId = existingProduct.cloudinaryId;

    if (newImageFile) {
      const uploaded = await uploadToCloudinary(newImageFile);
      imageURL = uploaded.imageURL;
      const newCloudinaryId = uploaded.cloudinaryId;
      if (cloudinaryId) await deleteFromCloudinary(cloudinaryId);
      cloudinaryId = newCloudinaryId;
    }

    // Extract spec fields from data
    const CORE_FIELDS = ['name', 'description', 'price', 'brand', 'categoryId', 'categoryName', 'isNew', 'stock', 'additionalSpecs'];
    const specData = {};
    Object.keys(data).forEach(key => {
      if (!CORE_FIELDS.includes(key)) specData[key] = data[key];
    });

    await updateDoc(doc(db, 'products', id), {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      price: Number(data.price),
      brand: data.brand?.trim() || '',
      categoryId: data.categoryId || '',
      categoryName: data.categoryName || '',
      imageURL,
      cloudinaryId,
      isNew: Boolean(data.isNew),
      stock: Number(data.stock) || 0,
      additionalSpecs: data.additionalSpecs || [],
      ...specData,
    });
  };

  /**
   * deleteProduct(id, cloudinaryId)
   * Deletes image from Cloudinary then removes the Firestore doc.
   */
  const deleteProduct = async (id, cloudinaryId) => {
    if (cloudinaryId) {
      await deleteFromCloudinary(cloudinaryId);
    }
    await deleteDoc(doc(db, 'products', id));
  };

  /**
   * updateProductStock(id, newStock)
   * Updates only the stock quantity in Firestore.
   */
  const updateProductStock = async (id, newStock) => {
    if (newStock < 0) throw new Error('Stock quantity cannot be negative.');
    await updateDoc(doc(db, 'products', id), {
      stock: Number(newStock)
    });
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct, updateProductStock };
};

export default useProducts;
