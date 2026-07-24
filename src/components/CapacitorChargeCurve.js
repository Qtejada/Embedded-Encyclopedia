import React from 'react';

const textColor = 'var(--hw-text-primary)';
const mutedColor = 'var(--hw-text-secondary)';
const gridColor = 'var(--hw-border)';
const accentColor = 'var(--ifm-color-primary)';
const blueColor = 'var(--hw-accent-blue)';

export default function CapacitorChargeCurve() {
  const left = 82;
  const right = 840;
  const top = 62;
  const bottom = 320;
  const width = right - left;
  const height = bottom - top;

  const xForTau = (tau) => left + (tau / 5) * width;
  const yForCharge = (charge) => bottom - charge * height;
  const points = Array.from({length: 81}, (_, index) => {
    const tau = (index / 80) * 5;
    const charge = 1 - Math.exp(-tau);
    return `${xForTau(tau)},${yForCharge(charge)}`;
  }).join(' ');

  const milestones = [
    {tau: 1, charge: 0.632, label: '1τ: 63%'},
    {tau: 3, charge: 0.950, label: '3τ: 95%'},
    {tau: 5, charge: 0.993, label: '5τ: 99%'},
  ];

  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <div style={{textAlign: 'center', marginBottom: '0.5rem'}}>
        <strong style={{display: 'block', color: textColor, fontSize: '1.05rem'}}>RC charging curve</strong>
        <span style={{color: mutedColor, fontSize: '0.82rem'}}>vC(t) = VS × (1 − e^(−t/RC))</span>
      </div>
      <div className="diagram-scroll-hint">Scroll horizontally to examine the full curve.</div>
      <div style={{overflowX: 'auto'}}>
        <svg
          role="img"
          aria-labelledby="capacitor-charge-title capacitor-charge-description"
          viewBox="0 45 900 340"
          style={{display: 'block', width: '100%', minWidth: '680px', height: 'auto'}}
        >
        <title id="capacitor-charge-title">Capacitor voltage during RC charging</title>
        <desc id="capacitor-charge-description">
          The capacitor voltage rises exponentially to 63 percent after one time constant, 95 percent after three time constants, and approximately 99 percent after five time constants.
        </desc>

        {[0, 0.25, 0.5, 0.75, 1].map((charge) => (
          <g key={charge}>
            <line
              x1={left}
              y1={yForCharge(charge)}
              x2={right}
              y2={yForCharge(charge)}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray={charge === 0 ? undefined : '5 6'}
            />
            <text
              x={left - 12}
              y={yForCharge(charge) + 5}
              textAnchor="end"
              fill={mutedColor}
              fontSize="12"
            >
              {Math.round(charge * 100)}%
            </text>
          </g>
        ))}

        {[0, 1, 2, 3, 4, 5].map((tau) => (
          <g key={tau}>
            <line x1={xForTau(tau)} y1={bottom} x2={xForTau(tau)} y2={bottom + 7} stroke={textColor} strokeWidth="2" />
            <text x={xForTau(tau)} y={bottom + 26} textAnchor="middle" fill={mutedColor} fontSize="12">
              {tau === 0 ? '0' : `${tau}τ`}
            </text>
          </g>
        ))}

        <line x1={left} y1={top} x2={left} y2={bottom} stroke={textColor} strokeWidth="2" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={textColor} strokeWidth="2" />
        <polyline points={points} fill="none" stroke={blueColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {milestones.map(({tau, charge, label}) => {
          const x = xForTau(tau);
          const y = yForCharge(charge);
          const anchor = tau === 5 ? 'end' : 'start';
          const labelX = tau === 5 ? x - 10 : x + 10;
          return (
            <g key={label}>
              <line x1={x} y1={y} x2={x} y2={bottom} stroke={accentColor} strokeWidth="2" strokeDasharray="5 5" />
              <circle cx={x} cy={y} r="6" fill={accentColor} />
              <text x={labelX} y={y - 12} textAnchor={anchor} fill={accentColor} fontSize="13" fontWeight="800">
                {label}
              </text>
            </g>
          );
        })}

        <text x="25" y="195" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700" transform="rotate(-90 25 195)">
          Capacitor voltage
        </text>
        <text x="460" y="374" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">
          Time in RC time constants
        </text>
        </svg>
      </div>
      <figcaption style={{marginTop: '0.5rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        Engineers usually treat the capacitor as fully charged after five time constants.
      </figcaption>
    </figure>
  );
}
