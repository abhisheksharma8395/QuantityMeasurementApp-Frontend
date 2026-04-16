function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch {
    return dateString;
  }
}

export default function HistoryView({ historyItems, onBack }) {
  return (
    <section id="history-view" className="view active-view">
      <div className="view-header">
        <button id="back-from-history" className="btn btn-ghost btn-sm" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <h2 className="view-title">Conversion History</h2>
      </div>
      <div className="history-list" id="history-list">
        {(!historyItems || historyItems.length === 0) ? (
          <div className="empty-state" id="history-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No history yet</p>
          </div>
        ) : (
          historyItems.map((item, index) => {
            // Backend QuantityMeasurementEntity fields:
            // thisValue, thisUnit, thisMeasurementType
            // thatValue, thatUnit, thatMeasurementType
            // operation, resultValue, resultUnit, resultString
            // isError, errorMessage, createdAt
            const operation = item.operation || '—';
            const thisVal = item.thisValue;
            const thisUnit = item.thisUnit || '';
            const thatVal = item.thatValue;
            const thatUnit = item.thatUnit || '';
            const measurementType = item.thisMeasurementType || '';

            // Build result display
            let result = '—';
            if (item.resultString) {
              result = item.resultString;
            } else if (item.resultValue !== null && item.resultValue !== undefined) {
              result = `${item.resultValue} ${item.resultUnit || ''}`.trim();
            }

            if (item.isError && item.errorMessage) {
              result = `❌ ${item.errorMessage}`;
            }

            // Build detail text
            let detail = '';
            if (thisVal !== undefined && thisVal !== null) detail += thisVal;
            detail += ' ';
            if (thisUnit) detail += thisUnit;
            
            if (thatVal !== undefined && thatVal !== null) {
              detail += ' & ' + thatVal + ' ';
              if (thatUnit) detail += thatUnit;
            }

            const formattedTime = item.createdAt ? formatDate(item.createdAt) : '';

            return (
              <div
                key={item.id || index}
                className="history-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="history-op-badge">{operation}</span>
                <div className="history-detail">
                  {detail}
                  {measurementType && (
                    <span> ({measurementType})</span>
                  )}
                  {formattedTime && (
                    <>
                      <br />
                      <span className="history-time">{formattedTime}</span>
                    </>
                  )}
                </div>
                <span className="history-result">{String(result)}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
