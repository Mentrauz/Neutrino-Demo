/**
 * ParentIndicator — shows which parent has the higher legacy influence.
 * Uses a warm, understated card design.
 */
export default function ParentIndicator({ results }) {
  if (!results) return null;

  const { motherTotal, fatherTotal, dominantParent } = results;
  const isMother = dominantParent === 'Mother';
  const diff = Math.abs(motherTotal - fatherTotal).toFixed(3);

  return (
    <div className="parent-indicator">
      <h2 className="section-title">Dominant Parental Legacy</h2>
      <div className={`indicator-card ${isMother ? 'mother-dominant' : 'father-dominant'}`}>
        <div className="indicator-icon">
          {isMother ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-mother)' }}>
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
              <path d="M12 13v3"/>
              <path d="M9 16h6"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-father)' }}>
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
              <path d="M15 3l3 3-3 3"/>
              <path d="M18 6h-3"/>
            </svg>
          )}
        </div>
        <div className="indicator-content">
          <h3 className="indicator-parent">{dominantParent}</h3>
          <p className="indicator-subtitle">carries the stronger legacy influence</p>
        </div>
        <div className="indicator-stats">
          <div className="stat-row">
            <span className="stat-label mother-label">Mother</span>
            <div className="stat-bar-wrapper">
              <div
                className="stat-bar mother-bar"
                style={{ width: `${motherTotal}%` }}
              />
            </div>
            <span className="stat-value">{motherTotal.toFixed(3)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label father-label">Father</span>
            <div className="stat-bar-wrapper">
              <div
                className="stat-bar father-bar"
                style={{ width: `${fatherTotal}%` }}
              />
            </div>
            <span className="stat-value">{fatherTotal.toFixed(3)}</span>
          </div>
        </div>
        <p className="indicator-diff">
          Difference: <strong>{diff}</strong> points
        </p>
      </div>
    </div>
  );
}
