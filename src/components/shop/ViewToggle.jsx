import React from 'react';

const ViewToggle = ({ activeView = 'grid', onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${activeView === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange && onViewChange('grid')}
        aria-label="Grid view"
        title="Grid view"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        className={`view-toggle-btn ${activeView === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange && onViewChange('list')}
        aria-label="List view"
        title="List view"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
          <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
          <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
