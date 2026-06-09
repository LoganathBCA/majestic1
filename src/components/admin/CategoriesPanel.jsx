import React, { useState } from 'react';
import useCategories from '../../hooks/useCategories';
import { useToast } from '../../context/ToastContext';

const CategoriesPanel = () => {
  const { categories, loading, error: hookError, addCategory, updateCategory, deleteCategory } = useCategories();
  const toast = useToast();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ── Add Category ──────────────────────────────────────────────────
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    setSubmitting(true);
    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      toast.success(`Category "${newCategoryName.trim()}" added successfully.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit helpers ──────────────────────────────────────────────────
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const saveEdit = async (id) => {
    setError('');
    setSubmitting(true);
    try {
      await updateCategory(id, editingName);
      toast.success(`Category renamed to "${editingName.trim()}".`);
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products under it will be uncategorized.')) return;
    setError('');
    try {
      await deleteCategory(id);
      toast.success('Category deleted.');
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Manage Categories</h2>
            <p className="admin-panel-subtitle">Loading categories from Firestore…</p>
          </div>
        </div>
        <div className="admin-card">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-row" style={{ height: 44, marginBottom: 12, borderRadius: 4 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">Manage Categories</h2>
          <p className="admin-panel-subtitle">Create, edit, or delete categories for badminton merchandise.</p>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{categories.length}</span>
          <span className="admin-stat-label">Total Categories</span>
        </div>
      </div>

      {(error || hookError) && (
        <div className="admin-alert admin-alert-error">{error || hookError}</div>
      )}

      {/* Add Category Form */}
      <div className="admin-card">
        <form onSubmit={handleAddCategory} className="admin-inline-form">
          <div className="admin-form-group flex-grow">
            <label htmlFor="new-category-name" className="admin-form-label">Category Name</label>
            <input
              type="text"
              id="new-category-name"
              className="admin-input"
              placeholder="e.g., Footwear, Wristbands"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            className="btn-admin btn-admin-primary btn-add-cat"
            disabled={submitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {submitting ? 'Saving…' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="admin-card no-padding overflow-hidden">
        {categories.length === 0 ? (
          <div className="admin-empty-state">
            <p className="empty-title">No Categories Yet</p>
            <p className="empty-desc">Use the form above to add your first category.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Category Name</th>
                <th style={{ width: '20%' }}>Slug</th>
                <th style={{ width: '30%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className={editingId === category.id ? 'row-editing' : ''}>
                  <td>
                    {editingId === category.id ? (
                      <input
                        type="text"
                        className="admin-input admin-input-table"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        disabled={submitting}
                      />
                    ) : (
                      <span className="category-name-text">{category.name}</span>
                    )}
                  </td>
                  <td>
                    <span className="category-count-badge">{category.slug || '—'}</span>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(category.id)}
                            className="btn-admin-icon btn-save"
                            disabled={submitting}
                            title="Save Changes"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{submitting ? 'Saving…' : 'Save'}</span>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn-admin-icon btn-cancel"
                            disabled={submitting}
                            title="Cancel"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(category)}
                            className="btn-admin-icon btn-edit"
                            title="Edit Category"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="16 3 21 8 8 21 3 21 3 16 16 3" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="btn-admin-icon btn-delete"
                            title="Delete Category"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesPanel;
