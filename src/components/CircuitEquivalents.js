import React from 'react';

const textColor = 'var(--hw-text-primary)';
const mutedColor = 'var(--hw-text-secondary)';
const lineColor = 'var(--ifm-color-primary)';
const sourceColor = 'var(--hw-accent-blue)';

function Resistor({x, y, orientation = 'horizontal', label}) {
  const horizontalPoints = `${x},${y} ${x + 8},${y - 10} ${x + 20},${y + 10} ${x + 32},${y - 10} ${x + 44},${y + 10} ${x + 56},${y - 10} ${x + 64},${y}`;
  const verticalPoints = `${x},${y} ${x - 10},${y + 8} ${x + 10},${y + 20} ${x - 10},${y + 32} ${x + 10},${y + 44} ${x - 10},${y + 56} ${x},${y + 64}`;

  return (
    <g>
      <polyline
        points={orientation === 'horizontal' ? horizontalPoints : verticalPoints}
        fill="none"
        stroke={lineColor}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x={orientation === 'horizontal' ? x + 32 : x + 22}
        y={orientation === 'horizontal' ? y - 18 : y + 36}
        textAnchor={orientation === 'horizontal' ? 'middle' : 'start'}
        fill={textColor}
        fontSize="14"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
}

export default function CircuitEquivalents() {
  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <svg
        role="img"
        aria-labelledby="equivalent-circuits-title equivalent-circuits-description"
        viewBox="0 0 760 280"
        style={{display: 'block', width: '100%', height: 'auto'}}
      >
        <title id="equivalent-circuits-title">Thevenin and Norton equivalent circuits</title>
        <desc id="equivalent-circuits-description">
          A Thevenin voltage source and series resistor are equivalent to a Norton current source and parallel resistor.
        </desc>

        <text x="180" y="28" textAnchor="middle" fill={textColor} fontSize="18" fontWeight="800">
          Thevenin model
        </text>
        <text x="570" y="28" textAnchor="middle" fill={textColor} fontSize="18" fontWeight="800">
          Norton model
        </text>

        <line x1="62" y1="72" x2="118" y2="72" stroke={lineColor} strokeWidth="3" />
        <line x1="62" y1="218" x2="292" y2="218" stroke={lineColor} strokeWidth="3" />
        <line x1="62" y1="72" x2="62" y2="104" stroke={lineColor} strokeWidth="3" />
        <line x1="62" y1="186" x2="62" y2="218" stroke={lineColor} strokeWidth="3" />
        <circle cx="62" cy="145" r="41" fill="var(--hw-surface-2)" stroke={sourceColor} strokeWidth="3" />
        <text x="62" y="137" textAnchor="middle" fill={sourceColor} fontSize="20" fontWeight="800">+</text>
        <text x="62" y="168" textAnchor="middle" fill={sourceColor} fontSize="24" fontWeight="800">−</text>
        <text x="62" y="260" textAnchor="middle" fill={mutedColor} fontSize="14">Vth</text>
        <Resistor x={118} y={72} label="Rth" />
        <line x1="182" y1="72" x2="292" y2="72" stroke={lineColor} strokeWidth="3" />
        <circle cx="292" cy="72" r="6" fill={lineColor} />
        <circle cx="292" cy="218" r="6" fill={lineColor} />
        <text x="306" y="78" fill={mutedColor} fontSize="14">A</text>
        <text x="306" y="224" fill={mutedColor} fontSize="14">B</text>

        <line x1="452" y1="72" x2="682" y2="72" stroke={lineColor} strokeWidth="3" />
        <line x1="452" y1="218" x2="682" y2="218" stroke={lineColor} strokeWidth="3" />
        <line x1="476" y1="72" x2="476" y2="104" stroke={lineColor} strokeWidth="3" />
        <line x1="476" y1="186" x2="476" y2="218" stroke={lineColor} strokeWidth="3" />
        <circle cx="476" cy="145" r="41" fill="var(--hw-surface-2)" stroke={sourceColor} strokeWidth="3" />
        <line x1="476" y1="169" x2="476" y2="121" stroke={sourceColor} strokeWidth="3" />
        <path d="M 476 112 L 468 126 L 484 126 Z" fill={sourceColor} />
        <text x="476" y="260" textAnchor="middle" fill={mutedColor} fontSize="14">In</text>
        <line x1="588" y1="72" x2="588" y2="102" stroke={lineColor} strokeWidth="3" />
        <Resistor x={588} y={102} orientation="vertical" label="Rn" />
        <line x1="588" y1="166" x2="588" y2="218" stroke={lineColor} strokeWidth="3" />
        <circle cx="682" cy="72" r="6" fill={lineColor} />
        <circle cx="682" cy="218" r="6" fill={lineColor} />
        <text x="696" y="78" fill={mutedColor} fontSize="14">A</text>
        <text x="696" y="224" fill={mutedColor} fontSize="14">B</text>

        <text x="375" y="151" textAnchor="middle" fill={mutedColor} fontSize="28">≡</text>
      </svg>
      <figcaption style={{marginTop: '0.75rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        The two models have the same electrical behavior at terminals A and B.
      </figcaption>
    </figure>
  );
}
