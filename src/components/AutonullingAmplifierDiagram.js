import React from 'react';

const goldColor = 'var(--ifm-color-primary)';
const blueColor = 'var(--hw-accent-blue)';
const tealColor = 'var(--hw-accent-teal)';
const purpleColor = 'var(--hw-accent-purple)';
const textColor = 'var(--hw-text-primary)';
const mutedColor = 'var(--hw-text-secondary)';
const panelColor = 'var(--hw-surface-2)';

function Arrow({x1, y1, x2, y2, color = goldColor}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 11} y2={y2} stroke={color} strokeWidth="3" />
      <path d={`M ${x2} ${y2} L ${x2 - 14} ${y2 - 8} L ${x2 - 14} ${y2 + 8} Z`} fill={color} />
    </g>
  );
}

function Stage({x, y, width, title, detail, color}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="94" rx="11" fill={panelColor} stroke={color} strokeWidth="2.5" />
      <text x={x + width / 2} y={y + 35} textAnchor="middle" fill={color} fontSize="16" fontWeight="800">
        {title}
      </text>
      <text x={x + width / 2} y={y + 63} textAnchor="middle" fill={textColor} fontSize="13" fontWeight="600">
        {detail}
      </text>
    </g>
  );
}

export default function AutonullingAmplifierDiagram() {
  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <svg
        role="img"
        aria-labelledby="autonull-title autonull-description"
        viewBox="0 0 920 460"
        style={{display: 'block', width: '100%', height: 'auto'}}
      >
        <title id="autonull-title">Functional diagram of the autonulling laboratory amplifier</title>
        <desc id="autonull-description">
          A hold circuit stores the input baseline. A subtraction node removes the baseline before two amplifier stages amplify subsequent changes.
        </desc>

        <text x="460" y="30" textAnchor="middle" fill={textColor} fontSize="19" fontWeight="800">
          Autonulling DC laboratory amplifier
        </text>
        <text x="460" y="53" textAnchor="middle" fill={mutedColor} fontSize="13">
          Stores the baseline • Amplifies subsequent changes • ±10 V output
        </text>

        <text x="34" y="160" fill={mutedColor} fontSize="13">Input</text>
        <Arrow x1={34} y1={178} x2={120} y2={178} />

        <g>
          <circle cx="162" cy="178" r="39" fill={panelColor} stroke={goldColor} strokeWidth="3" />
          <text x="162" y="171" textAnchor="middle" fill={textColor} fontSize="24" fontWeight="800">+</text>
          <text x="162" y="199" textAnchor="middle" fill={textColor} fontSize="26" fontWeight="800">−</text>
          <text x="162" y="235" textAnchor="middle" fill={mutedColor} fontSize="12">Subtract stored null</text>
        </g>

        <Arrow x1={201} y1={178} x2={272} y2={178} />
        <Stage x={272} y={131} width={190} title="U1" detail="Instrumentation gain" color={blueColor} />
        <Arrow x1={462} y1={178} x2={520} y2={178} />
        <Stage x={520} y={131} width={170} title="U2" detail="Fixed gain: 10" color={tealColor} />
        <Arrow x1={690} y1={178} x2={760} y2={178} />

        <rect x="760" y="132" width="128" height="92" rx="11" fill={panelColor} stroke={goldColor} strokeWidth="2.5" />
        <text x="824" y="167" textAnchor="middle" fill={goldColor} fontSize="16" fontWeight="800">OUTPUT</text>
        <text x="824" y="194" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">Up to ×1000</text>

        <path d="M 94 178 L 94 304 L 226 304" fill="none" stroke={purpleColor} strokeWidth="3" />
        <path d="M 226 304 L 212 296 L 212 312 Z" fill={purpleColor} />

        <rect x="226" y="268" width="426" height="112" rx="13" fill="var(--hw-surface-1)" stroke={purpleColor} strokeWidth="2.5" />
        <text x="439" y="297" textAnchor="middle" fill={purpleColor} fontSize="16" fontWeight="800">
          NULLING PATH: U3, U4, U5
        </text>
        <text x="330" y="330" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">
          Sample and hold
        </text>
        <text x="330" y="354" textAnchor="middle" fill={mutedColor} fontSize="12">
          Stores the input baseline
        </text>
        <line x1="424" y1="322" x2="424" y2="356" stroke={goldColor} strokeWidth="3" />
        <line x1="403" y1="322" x2="445" y2="322" stroke={goldColor} strokeWidth="4" />
        <line x1="403" y1="338" x2="445" y2="338" stroke={goldColor} strokeWidth="4" />
        <text x="470" y="333" fill={textColor} fontSize="13" fontWeight="700">Hold capacitor</text>
        <text x="548" y="354" textAnchor="middle" fill={mutedColor} fontSize="12">
          Leakage controls null drift
        </text>

        <path d="M 652 324 L 704 324 L 704 414 L 162 414 L 162 217" fill="none" stroke={purpleColor} strokeWidth="3" />
        <path d="M 162 217 L 154 231 L 170 231 Z" fill={purpleColor} />

        <text x="460" y="443" textAnchor="middle" fill={mutedColor} fontSize="13">
          Required input drift: less than 10 µV • Required null drift: less than 1 µV/min
        </text>
      </svg>
      <figcaption style={{marginTop: '0.75rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        The nulling path stores the baseline. The signal path amplifies only the changes that occur after the null operation.
      </figcaption>
    </figure>
  );
}
