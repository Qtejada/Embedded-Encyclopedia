import React, {useState} from 'react';

const WIDTH = 640;
const HEIGHT = 250;
const PADDING = {top: 28, right: 28, bottom: 44, left: 46};
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const CENTER_Y = 118;
const AMPLITUDE = 72;

function makeSinePath(phaseShiftDegrees) {
  const points = [];

  for (let index = 0; index <= 180; index += 1) {
    const x = PADDING.left + (index / 180) * PLOT_WIDTH;
    const angle = (index / 180) * Math.PI * 4;
    const phase = (phaseShiftDegrees * Math.PI) / 180;
    const y = CENTER_Y - AMPLITUDE * Math.sin(angle + phase);
    points.push(`${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(' ');
}

function getPhaseText(phaseShift) {
  if (phaseShift === 0) {
    return 'Current and voltage have the same phase.';
  }

  if (phaseShift > 0) {
    return `Current leads voltage by ${phaseShift}°.`;
  }

  return `Current lags voltage by ${Math.abs(phaseShift)}°.`;
}

export default function PhaseDiagram() {
  const [phaseShift, setPhaseShift] = useState(90);
  const voltageColor = 'var(--ifm-color-primary)';
  const currentColor = 'var(--hw-accent-red)';
  const axisColor = 'var(--hw-text-secondary)';

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">Phase explorer</div>
      <div className="interactive-block__body">
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'}}>
          <strong>{getPhaseText(phaseShift)}</strong>
          <span style={{color: 'var(--hw-text-secondary)'}}>Phase difference: {phaseShift}°</span>
        </div>

        <input
          aria-label="Current phase difference in degrees"
          type="range"
          min="-180"
          max="180"
          step="15"
          value={phaseShift}
          onChange={(event) => setPhaseShift(Number(event.target.value))}
        />

        <svg
          role="img"
          aria-label={`Current and voltage waveforms. ${getPhaseText(phaseShift)}`}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{display: 'block', width: '100%', height: 'auto', marginTop: '1rem'}}
        >
          {[46, 82, 118, 154, 190].map((y) => (
            <line
              key={`horizontal-${y}`}
              x1={PADDING.left}
              y1={y}
              x2={WIDTH - PADDING.right}
              y2={y}
              stroke="var(--hw-border)"
              strokeWidth="1"
            />
          ))}

          {[0, 90, 180, 270, 360, 450, 540, 630, 720].map((degrees) => {
            const x = PADDING.left + (degrees / 720) * PLOT_WIDTH;
            return (
              <g key={`vertical-${degrees}`}>
                <line
                  x1={x}
                  y1={PADDING.top}
                  x2={x}
                  y2={CENTER_Y + AMPLITUDE}
                  stroke="var(--hw-border)"
                  strokeWidth="1"
                />
                <text x={x} y={218} textAnchor="middle" fill={axisColor} fontSize="12">
                  {degrees}°
                </text>
              </g>
            );
          })}

          <line
            x1={PADDING.left}
            y1={CENTER_Y}
            x2={WIDTH - PADDING.right}
            y2={CENTER_Y}
            stroke={axisColor}
            strokeWidth="1.5"
          />
          <path d={makeSinePath(0)} fill="none" stroke={voltageColor} strokeWidth="4" />
          <path
            d={makeSinePath(phaseShift)}
            fill="none"
            stroke={currentColor}
            strokeWidth="4"
            strokeDasharray="10 7"
          />

          <g transform="translate(450 16)">
            <line x1="0" y1="0" x2="28" y2="0" stroke={voltageColor} strokeWidth="4" />
            <text x="36" y="4" fill={voltageColor} fontSize="13" fontWeight="700">
              Voltage
            </text>
            <line x1="92" y1="0" x2="120" y2="0" stroke={currentColor} strokeWidth="4" strokeDasharray="8 6" />
            <text x="128" y="4" fill={currentColor} fontSize="13" fontWeight="700">
              Current
            </text>
          </g>

          <text x={WIDTH / 2} y={246} textAnchor="middle" fill={axisColor} fontSize="13">
            Electrical angle
          </text>
        </svg>
      </div>
    </div>
  );
}
