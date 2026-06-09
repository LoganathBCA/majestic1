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
 * useFilters
 * Real-time filter groups from Firestore (collection: "filters").
 *
 * Each filter document shape:
 * {
 *   id          : string (auto)
 *   label       : string   — display name, e.g. "Brand", "Weight", "String Type"
 *   type        : string   — "checkbox" | "toggle" | "range"
 *   options     : string[] — list of option values (for checkbox type)
 *   sortOrder   : number   — controls display order in FilterSidebar
 *   createdAt   : timestamp
 * }
 */
const useFilters = () => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'filters'), orderBy('sortOrder', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          options: d.data().options || []
        }));
        setFilters(list);
        setLoading(false);
      },
      (err) => {
        console.error('useFilters snapshot error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /** addFilter — creates a new filter group */
  const addFilter = async ({ label, type, options }) => {
    const trimmed = label.trim();
    if (!trimmed) throw new Error('Filter label cannot be empty.');

    const exists = filters.some(
      (f) => f.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) throw new Error('A filter with this label already exists.');

    const maxOrder = filters.reduce((m, f) => Math.max(m, f.sortOrder || 0), 0);

    await addDoc(collection(db, 'filters'), {
      label: trimmed,
      type: type || 'checkbox',
      options: type === 'checkbox' ? (options || []) : [],
      sortOrder: maxOrder + 1,
      createdAt: serverTimestamp()
    });
  };

  /** updateFilter — full update of a filter group */
  const updateFilter = async (id, { label, type, options }) => {
    const trimmed = label.trim();
    if (!trimmed) throw new Error('Filter label cannot be empty.');

    const exists = filters.some(
      (f) => f.id !== id && f.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) throw new Error('Another filter already has this label.');

    await updateDoc(doc(db, 'filters', id), {
      label: trimmed,
      type: type || 'checkbox',
      options: type === 'checkbox' ? (options || []) : []
    });
  };

  /** deleteFilter — removes the filter group document */
  const deleteFilter = async (id) => {
    await deleteDoc(doc(db, 'filters', id));
  };

  return { filters, loading, error, addFilter, updateFilter, deleteFilter };
};

export default useFilters;
