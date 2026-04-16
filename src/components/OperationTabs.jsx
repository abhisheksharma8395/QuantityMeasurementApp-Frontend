const operations = [
  {
    op: 'convert',
    label: 'Convert',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    )
  },
  {
    op: 'compare',
    label: 'Compare',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  },
  {
    op: 'add',
    label: 'Add',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    )
  },
  {
    op: 'subtract',
    label: 'Subtract',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    )
  },
  {
    op: 'divide',
    label: 'Divide',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="6" r="1.5"/><line x1="5" y1="12" x2="19" y2="12"/><circle cx="12" cy="18" r="1.5"/>
      </svg>
    )
  }
];

export default function OperationTabs({ currentOperation, onSelectOperation }) {
  return (
    <>
      <div className="section-label">Operation</div>
      <div className="operation-tabs" id="operation-tabs">
        {operations.map((item) => (
          <button
            key={item.op}
            className={`op-tab${currentOperation === item.op ? ' active' : ''}`}
            data-op={item.op}
            id={`op-${item.op}`}
            onClick={() => onSelectOperation(item.op)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
