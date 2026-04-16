export default function ResultCard({ visible, label, body }) {
  if (!visible) return null;

  return (
    <div className="result-card" id="result-card">
      <div className="result-card-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span id="result-label">{label}</span>
      </div>
      <div className="result-card-body" id="result-body">{body}</div>
    </div>
  );
}
