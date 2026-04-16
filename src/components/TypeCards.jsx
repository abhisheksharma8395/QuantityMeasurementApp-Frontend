const typeConfig = [
  {
    type: 'LENGTH',
    label: 'Length',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"/><path d="M6 8v8"/><path d="M18 8v8"/><path d="M10 10v4"/><path d="M14 10v4"/>
      </svg>
    )
  },
  {
    type: 'TEMPERATURE',
    label: 'Temperature',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>
    )
  },
  {
    type: 'VOLUME',
    label: 'Volume',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l4 10H4L8 2z"/><path d="M4 12v6a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-6"/>
      </svg>
    )
  },
  {
    type: 'WEIGHT',
    label: 'Weight',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/><path d="M6.5 8a7 7 0 0 0-.47 2.69A17.24 17.24 0 0 0 12 12a17.24 17.24 0 0 0 5.97-1.31A7 7 0 0 0 17.5 8"/><path d="M3 20h18l-2-8H5l-2 8z"/>
      </svg>
    )
  }
];

export default function TypeCards({ currentType, onSelectType }) {
  return (
    <>
      <div className="section-label">Select Measurement Type</div>
      <div className="type-cards" id="type-cards">
        {typeConfig.map((item) => (
          <button
            key={item.type}
            className={`type-card${currentType === item.type ? ' active' : ''}`}
            data-type={item.type}
            id={`card-${item.type.toLowerCase()}`}
            onClick={() => onSelectType(item.type)}
          >
            <div className="type-card-icon">{item.icon}</div>
            <span className="type-card-label">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
