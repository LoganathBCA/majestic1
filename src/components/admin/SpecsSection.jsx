import React from 'react';

/**
 * SPEC_FIELDS — known badminton product spec fields with display labels.
 * Used in both the admin form and the product detail page.
 */
export const SPEC_FIELDS = [
  { key: 'weight',        label: 'Weight',                    placeholder: 'e.g. 4U (80–84g)' },
  { key: 'flexibility',   label: 'Flexibility / Stiffness',   placeholder: 'e.g. Extra Stiff, Medium' },
  { key: 'balancePoint',  label: 'Balance Point',             placeholder: 'e.g. Head Heavy, Even Balance' },
  { key: 'gripType',      label: 'Grip Type',                 placeholder: 'e.g. Synthetic / Towel' },
  { key: 'stringTension', label: 'String Tension (lbs)',      placeholder: 'e.g. 24–27 lbs' },
  { key: 'material',      label: 'Material',                  placeholder: 'e.g. High-Modulus Graphite' },
  { key: 'playerLevel',   label: 'Recommended For',           placeholder: 'e.g. Advanced / Professional' },
  { key: 'color',         label: 'Color / Colorway',          placeholder: 'e.g. Black / Red' },
  { key: 'origin',        label: 'Origin / Made In',          placeholder: 'e.g. Japan, China' },
];

/**
 * SpecsSection
 *
 * Renders a collapsible "Product Specifications" accordion inside the Admin
 * Add / Edit Product form. Displays known spec fields + dynamic custom rows.
 *
 * Props:
 *   specs           — object: { weight, flexibility, balancePoint, … }
 *   onSpecChange    — (key, value) => void
 *   customSpecs     — array of { key, value } for free-form additional specs
 *   onCustomSpecAdd     — () => void   add a new blank row
 *   onCustomSpecRemove  — (index) => void
 *   onCustomSpecChange  — (index, field, value) => void
 *   disabled        — bool (while form is submitting)
 */
const SpecsSection = ({
  specs = {},
  onSpecChange,
  customSpecs = [],
  onCustomSpecAdd,
  onCustomSpecRemove,
  onCustomSpecChange,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="specs-section">
      {/* Accordion Header */}
      <button
        type="button"
        className="specs-accordion-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="specs-accordion-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginRight: 8, flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="15" x2="12" y2="15" />
          </svg>
          Product Specifications
          <span className="specs-optional-tag">Optional</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="specs-accordion-body">
          <p className="specs-hint">
            These appear on the product detail page as a spec table. Only fill what's relevant.
          </p>

          {/* Known Spec Fields — 2-col grid */}
          <div className="specs-fields-grid">
            {SPEC_FIELDS.map(({ key, label, placeholder }) => (
              <div className="admin-form-group" key={key}>
                <label className="admin-form-label">{label}</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder={placeholder}
                  value={specs[key] || ''}
                  onChange={e => onSpecChange(key, e.target.value)}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>

          {/* Custom / Additional Specs */}
          <div className="specs-custom-block">
            <div className="specs-custom-header">
              <span className="specs-custom-label">Additional / Custom Specs</span>
              <button
                type="button"
                className="btn-admin btn-admin-ghost specs-add-btn"
                onClick={onCustomSpecAdd}
                disabled={disabled}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Row
              </button>
            </div>

            {customSpecs.length === 0 && (
              <p className="specs-custom-empty">
                No custom specs yet. Click "Add Row" to add a free-form spec (e.g. "Shuttle Speed → 77").
              </p>
            )}

            {customSpecs.map((spec, i) => (
              <div className="specs-custom-row" key={i}>
                <input
                  type="text"
                  className="admin-input specs-key-input"
                  placeholder="Spec name (e.g. Shuttle Speed)"
                  value={spec.key}
                  onChange={e => onCustomSpecChange(i, 'key', e.target.value)}
                  disabled={disabled}
                />
                <input
                  type="text"
                  className="admin-input specs-val-input"
                  placeholder="Value (e.g. 77)"
                  value={spec.value}
                  onChange={e => onCustomSpecChange(i, 'value', e.target.value)}
                  disabled={disabled}
                />
                <button
                  type="button"
                  className="specs-remove-btn"
                  onClick={() => onCustomSpecRemove(i)}
                  disabled={disabled}
                  aria-label={`Remove spec row ${i + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecsSection;
