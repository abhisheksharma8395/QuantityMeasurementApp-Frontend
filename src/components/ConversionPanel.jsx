import { UNITS } from '../data/units';

export default function ConversionPanel({
  currentMeasurementType,
  currentOperation,
  fromValue,
  fromUnit,
  toValue,
  toUnit,
  targetUnit,
  onFromValueChange,
  onFromUnitChange,
  onToValueChange,
  onToUnitChange,
  onTargetUnitChange,
  onSwap
}) {
  const unitList = UNITS[currentMeasurementType] || [];
  const isConvert = currentOperation === 'convert';
  const showTargetUnit = currentOperation === 'add' || currentOperation === 'subtract';

  return (
    <>
      {/* Conversion Panel */}
      <div className="conversion-panel" id="conversion-panel">
        {/* FROM Side */}
        <div className="conversion-side" id="from-side">
          <div className="panel-label">FROM</div>
          <div className="input-group">
            <label htmlFor="from-value" className="input-label">Value</label>
            <input
              type="number"
              id="from-value"
              className="input-field"
              placeholder="Enter value"
              step="any"
              value={fromValue}
              onChange={(e) => onFromValueChange(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="from-unit" className="input-label">Unit</label>
            <select
              id="from-unit"
              className="select-field"
              value={fromUnit}
              onChange={(e) => onFromUnitChange(e.target.value)}
            >
              {unitList.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="conversion-center">
          <button
            id="swap-btn"
            className="swap-btn"
            title="Swap units"
            aria-label="Swap units"
            onClick={onSwap}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </button>
        </div>

        {/* TO Side */}
        <div className="conversion-side" id="to-side">
          <div className="panel-label">TO</div>
          <div className="input-group">
            <label htmlFor="to-value" className="input-label">{isConvert ? 'Result' : 'Value'}</label>
            <input
              type={isConvert ? 'text' : 'number'}
              id="to-value"
              className={`input-field${isConvert ? ' result-field' : ''}`}
              placeholder={isConvert ? 'Result' : 'Enter second value'}
              readOnly={isConvert}
              step="any"
              value={toValue}
              onChange={(e) => onToValueChange(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="to-unit" className="input-label">Unit</label>
            <select
              id="to-unit"
              className="select-field"
              value={toUnit}
              onChange={(e) => onToUnitChange(e.target.value)}
            >
              {unitList.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Unit (for Add/Subtract) */}
      {showTargetUnit && (
        <div className="target-unit-section" id="target-unit-section">
          <div className="input-group target-unit-group">
            <label htmlFor="target-unit" className="input-label">Target Unit (optional)</label>
            <select
              id="target-unit"
              className="select-field"
              value={targetUnit}
              onChange={(e) => onTargetUnitChange(e.target.value)}
            >
              {unitList.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
}
