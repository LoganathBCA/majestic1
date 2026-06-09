import React, { useState } from 'react';
import useFilters from '../../hooks/useFilters';
import { useToast } from '../../context/ToastContext';

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const FILTER_TYPES = [
  { value: 'checkbox', label: 'Checkbox List', desc: 'Multi-select options (e.g. Brand, Color)' },
  { value: 'toggle',   label: 'On/Off Toggle', desc: 'Boolean switch (e.g. New Arrivals Only)' },
  { value: 'range',    label: 'Price / Range',  desc: 'Numeric slider (managed automatically)' }
];

const typeIcon = (type) => {
  switch (type) {
    case 'checkbox': return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    );
    case 'toggle': return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>
    );
    case 'range': return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="8" cy="12" r="3" fill="currentColor"/></svg>
    );
    default: return null;
  }
};

const typeBadgeClass = (type) => {
  switch (type) {
    case 'checkbox': return 'filter-type-badge filter-type-checkbox';
    case 'toggle':   return 'filter-type-badge filter-type-toggle';
    case 'range':    return 'filter-type-badge filter-type-range';
    default:         return 'filter-type-badge';
  }
};

/* ─── Option Tag Input ─────────────────────────────────────────────────── */
const OptionTagInput = ({ options, onChange }) => {
  const [inputVal, setInputVal] = useState('');

  const addOption = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (options.includes(trimmed)) return;
    onChange([...options, trimmed]);
    setInputVal('');
  };

  const removeOption = (opt) => {
    onChange(options.filter((o) => o !== opt));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addOption(inputVal);
    }
    if (e.key === 'Backspace' && inputVal === '' && options.length > 0) {
      removeOption(options[options.length - 1]);
    }
  };

  return (
    <div className="fp-option-tag-input">
      <div className="fp-option-tag-field">
        {options.map((opt) => (
          <span key={opt} className="fp-option-tag">
            {opt}
            <button type="button" className="fp-option-tag-remove" onClick={() => removeOption(opt)} aria-label={`Remove ${opt}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          className="fp-option-tag-text-input"
          placeholder={options.length === 0 ? 'Type an option, press Enter or comma…' : 'Add more…'}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addOption(inputVal)}
        />
      </div>
      <p className="fp-option-hint">Press <kbd>Enter</kbd> or <kbd>,</kbd> to add each option. Backspace removes the last tag.</p>
    </div>
  );
};

/* ─── Add / Edit Form ──────────────────────────────────────────────────── */
const FilterForm = ({ initial, onSave, onCancel, submitting }) => {
  const [label,   setLabel]   = useState(initial?.label   || '');
  const [type,    setType]    = useState(initial?.type    || 'checkbox');
  const [options, setOptions] = useState(initial?.options || []);
  const [err,     setErr]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!label.trim()) { setErr('Filter label is required.'); return; }
    if (type === 'checkbox' && options.length === 0) {
      setErr('Add at least one option for a Checkbox filter.'); return;
    }
    try {
      await onSave({ label, type, options });
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <form className="fp-form" onSubmit={handleSubmit}>
      {err && <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>{err}</div>}

      {/* Label */}
      <div className="admin-form-group">
        <label className="admin-form-label" htmlFor="fp-label">Filter Label <span style={{ color: 'var(--error)' }}>*</span></label>
        <input
          id="fp-label"
          type="text"
          className="admin-input"
          placeholder="e.g. Brand, String Type, Weight"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={submitting}
        />
      </div>

      {/* Type */}
      <div className="admin-form-group">
        <label className="admin-form-label">Filter Type <span style={{ color: 'var(--error)' }}>*</span></label>
        <div className="fp-type-grid">
          {FILTER_TYPES.map((ft) => (
            <label
              key={ft.value}
              className={`fp-type-card ${type === ft.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="filter-type"
                value={ft.value}
                checked={type === ft.value}
                onChange={() => setType(ft.value)}
                disabled={submitting}
                className="fp-type-radio"
              />
              <span className="fp-type-card-icon">{typeIcon(ft.value)}</span>
              <span className="fp-type-card-label">{ft.label}</span>
              <span className="fp-type-card-desc">{ft.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Options (only for checkbox) */}
      {type === 'checkbox' && (
        <div className="admin-form-group">
          <label className="admin-form-label">Options <span style={{ color: 'var(--error)' }}>*</span></label>
          <OptionTagInput options={options} onChange={setOptions} />
        </div>
      )}

      {type === 'toggle' && (
        <div className="fp-info-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Toggle filters are boolean (on/off). No options needed — the label itself is the toggle title shown to shoppers.
        </div>
      )}

      {type === 'range' && (
        <div className="fp-info-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Range filters use product price data automatically. Min/Max are derived from live product listings.
        </div>
      )}

      {/* Actions */}
      <div className="fp-form-actions">
        <button type="button" className="btn-admin btn-admin-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-admin btn-admin-primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Filter'}
        </button>
      </div>
    </form>
  );
};

/* ─── Main Panel ───────────────────────────────────────────────────────── */
const FiltersPanel = () => {
  const { filters, loading, error: hookError, addFilter, updateFilter, deleteFilter } = useFilters();
  const toast = useToast();

  const [mode,        setMode]        = useState('list');   // 'list' | 'add' | 'edit'
  const [editTarget,  setEditTarget]  = useState(null);
  const [submitting,  setSubmitting]  = useState(false);

  /* ── Add ── */
  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await addFilter(data);
      toast.success(`Filter "${data.label}" added successfully.`);
      setMode('list');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Edit ── */
  const startEdit = (filter) => {
    setEditTarget(filter);
    setMode('edit');
  };

  const handleEdit = async (data) => {
    setSubmitting(true);
    try {
      await updateFilter(editTarget.id, data);
      toast.success(`Filter "${data.label}" updated.`);
      setMode('list');
      setEditTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (filter) => {
    if (!window.confirm(`Delete filter "${filter.label}"? This cannot be undone.`)) return;
    try {
      await deleteFilter(filter.id);
      toast.success(`Filter "${filter.label}" deleted.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Shop Filters</h2>
            <p className="admin-panel-subtitle">Loading filters from Firestore…</p>
          </div>
        </div>
        <div className="admin-card">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-row" style={{ height: 52, marginBottom: 12, borderRadius: 4 }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Add form ── */
  if (mode === 'add') {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Add New Filter</h2>
            <p className="admin-panel-subtitle">Define a new filter group for the Shop page sidebar.</p>
          </div>
          <button className="btn-admin btn-admin-secondary" onClick={() => setMode('list')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Filters
          </button>
        </div>
        {hookError && <div className="admin-alert admin-alert-error">{hookError}</div>}
        <div className="admin-card">
          <FilterForm onSave={handleAdd} onCancel={() => setMode('list')} submitting={submitting} />
        </div>
      </div>
    );
  }

  /* ── Edit form ── */
  if (mode === 'edit' && editTarget) {
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Edit Filter</h2>
            <p className="admin-panel-subtitle">Modify <strong>{editTarget.label}</strong> filter settings and options.</p>
          </div>
          <button className="btn-admin btn-admin-secondary" onClick={() => { setMode('list'); setEditTarget(null); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Filters
          </button>
        </div>
        {hookError && <div className="admin-alert admin-alert-error">{hookError}</div>}
        <div className="admin-card">
          <FilterForm initial={editTarget} onSave={handleEdit} onCancel={() => { setMode('list'); setEditTarget(null); }} submitting={submitting} />
        </div>
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">Shop Filters</h2>
          <p className="admin-panel-subtitle">Manage filter groups displayed in the Shop sidebar.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="admin-stat-card">
            <span className="admin-stat-value">{filters.length}</span>
            <span className="admin-stat-label">Total Filters</span>
          </div>
          <button className="btn-admin btn-admin-primary" onClick={() => setMode('add')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Filter
          </button>
        </div>
      </div>

      {hookError && <div className="admin-alert admin-alert-error">{hookError}</div>}

      {/* Info callout */}
      <div className="fp-callout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Filters defined here control what shoppers see in the <strong>Shop page sidebar</strong>. Changes take effect immediately after saving.</span>
      </div>

      {/* Filters list */}
      {filters.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </div>
            <p className="empty-title">No Filters Yet</p>
            <p className="empty-desc">Click "Add Filter" to create your first shop filter group.</p>
          </div>
        </div>
      ) : (
        <div className="fp-filter-list">
          {filters.map((filter, idx) => (
            <div key={filter.id} className="fp-filter-card">
              {/* Left: order indicator */}
              <div className="fp-filter-order">#{idx + 1}</div>

              {/* Center: info */}
              <div className="fp-filter-info">
                <div className="fp-filter-top-row">
                  <span className="fp-filter-label">{filter.label}</span>
                  <span className={typeBadgeClass(filter.type)}>
                    {typeIcon(filter.type)}
                    <span style={{ marginLeft: 5 }}>{FILTER_TYPES.find(f => f.value === filter.type)?.label || filter.type}</span>
                  </span>
                </div>

                {filter.type === 'checkbox' && filter.options?.length > 0 && (
                  <div className="fp-filter-options-preview">
                    {filter.options.slice(0, 8).map((opt) => (
                      <span key={opt} className="fp-preview-tag">{opt}</span>
                    ))}
                    {filter.options.length > 8 && (
                      <span className="fp-preview-more">+{filter.options.length - 8} more</span>
                    )}
                  </div>
                )}

                {filter.type === 'toggle' && (
                  <span className="fp-filter-meta">Boolean on/off — no options required</span>
                )}
                {filter.type === 'range' && (
                  <span className="fp-filter-meta">Dynamic price slider — auto-range from products</span>
                )}
              </div>

              {/* Right: actions */}
              <div className="fp-filter-actions">
                <button
                  className="btn-admin-icon btn-edit"
                  onClick={() => startEdit(filter)}
                  title="Edit Filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>
                  <span>Edit</span>
                </button>
                <button
                  className="btn-admin-icon btn-delete"
                  onClick={() => handleDelete(filter)}
                  title="Delete Filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
