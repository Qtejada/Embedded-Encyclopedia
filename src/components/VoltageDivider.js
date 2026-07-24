import React, {useState} from 'react';

function formatResistance(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kΩ`;
  }

  return `${value} Ω`;
}

export default function VoltageDivider() {
  const [sourceVoltage, setSourceVoltage] = useState(5);
  const [sourceResistance, setSourceResistance] = useState(10);
  const [loadResistance, setLoadResistance] = useState(1000);

  const outputVoltage =
    sourceVoltage * (loadResistance / (sourceResistance + loadResistance));
  const voltageDrop = sourceVoltage - outputVoltage;
  const transferPercent = (outputVoltage / sourceVoltage) * 100;

  let resultColor = 'var(--hw-accent-red)';
  if (transferPercent > 90) {
    resultColor = 'var(--hw-accent-teal)';
  } else if (transferPercent > 50) {
    resultColor = 'var(--hw-accent-amber)';
  }

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">Source-loading simulator</div>
      <div className="interactive-block__body">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '1.25rem'}}>
              <strong>Source voltage:</strong> {sourceVoltage} V
              <input
                aria-label="Source voltage"
                type="range"
                min="1"
                max="24"
                value={sourceVoltage}
                onChange={(event) => setSourceVoltage(Number(event.target.value))}
              />
            </label>

            <label style={{display: 'block', marginBottom: '1.25rem'}}>
              <strong>Source resistance:</strong> {formatResistance(sourceResistance)}
              <small style={{display: 'block', color: 'var(--hw-text-secondary)'}}>
                This value is the internal resistance of the source.
              </small>
              <input
                aria-label="Source resistance"
                type="range"
                min="0"
                max="1000"
                step="10"
                value={sourceResistance}
                onChange={(event) => setSourceResistance(Number(event.target.value))}
              />
            </label>

            <label style={{display: 'block'}}>
              <strong>Load resistance:</strong> {formatResistance(loadResistance)}
              <small style={{display: 'block', color: 'var(--hw-text-secondary)'}}>
                This value is the resistance of the powered circuit.
              </small>
              <input
                aria-label="Load resistance"
                type="range"
                min="10"
                max="2000"
                step="10"
                value={loadResistance}
                onChange={(event) => setLoadResistance(Number(event.target.value))}
              />
            </label>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '800', color: resultColor}}>
              {outputVoltage.toFixed(2)} V
            </div>
            <div style={{color: 'var(--hw-text-secondary)'}}>Load voltage</div>

            <div
              aria-label={`${transferPercent.toFixed(1)} percent of source voltage reaches the load`}
              role="img"
              style={{
                width: '100%',
                height: '18px',
                marginTop: '1.25rem',
                background: 'var(--hw-border)',
                borderRadius: '9px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${transferPercent}%`,
                  height: '100%',
                  background: resultColor,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            </div>

            <div style={{marginTop: '0.5rem', color: 'var(--hw-text-secondary)'}}>
              The load receives {transferPercent.toFixed(1)}% of the source voltage.
            </div>
            <div style={{marginTop: '0.25rem', color: 'var(--hw-text-secondary)'}}>
              The source resistance causes a {voltageDrop.toFixed(2)} V decrease.
            </div>

            {transferPercent < 50 && (
              <div className="alert alert--warning" style={{marginTop: '1rem', marginBottom: 0}}>
                The source resistance is higher than the load resistance. Most of the source voltage does not reach the load.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
