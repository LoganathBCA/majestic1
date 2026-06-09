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

/**
 * useCategories
 * Real-time categories list from Firestore.
 * Provides: categories, loading, error, addCategory, updateCategory, deleteCategory
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        setCategories(list);
        setLoading(false);
      },
      (err) => {
        console.error('useCategories snapshot error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * addCategory(name)
   * Creates a new category document in Firestore.
   */
  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Category name cannot be empty.');

    // Duplicate check (client-side guard)
    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) throw new Error('A category with this name already exists.');

    const slug = trimmed.toLowerCase().replace(/\s+/g, '-');

    await addDoc(collection(db, 'categories'), {
      name: trimmed,
      slug,
      createdAt: serverTimestamp()
    });
  };

  /**
   * updateCategory(id, name)
   * Renames an existing category document.
   */
  const updateCategory = async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Category name cannot be empty.');

    const exists = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) throw new Error('Another category already has this name.');

    const slug = trimmed.toLowerCase().replace(/\s+/g, '-');

    await updateDoc(doc(db, 'categories', id), { name: trimmed, slug });
  };

  /**
   * deleteCategory(id)
   * Removes a category document from Firestore.
   */
  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};

export default useCategories;
