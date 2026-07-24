import React from 'react';

const textColor = 'var(--hw-text-primary)';
const mutedColor = 'var(--hw-text-secondary)';
const borderColor = 'var(--hw-border)';
const panelColor = 'var(--hw-surface-2)';
const accentColor = 'var(--ifm-color-primary)';
const blueColor = 'var(--hw-accent-blue)';
const tealColor = 'var(--hw-accent-teal)';

function Resistor({x, y}) {
  return (
    <polyline
      points={`${x},${y} ${x + 10},${y - 10} ${x + 25},${y + 10} ${x + 40},${y - 10} ${x + 55},${y + 10} ${x + 70},${y}`}
      fill="none"
      stroke={accentColor}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

function Inductor({x, y}) {
  return (
    <path
      d={`M ${x} ${y} c 0 -22 28 -22 28 0 c 0 -22 28 -22 28 0 c 0 -22 28 -22 28 0`}
      fill="none"
      stroke={blueColor}
      strokeWidth="3"
    />
  );
}

export default function CapacitorImpedanceDiagram() {
  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <div style={{textAlign: 'center', marginBottom: '0.5rem'}}>
        <strong style={{display: 'block', color: textColor, fontSize: '1.05rem'}}>Real capacitor impedance</strong>
        <span style={{color: mutedColor, fontSize: '0.82rem'}}>
          Capacitance dominates below self-resonance. Inductance dominates above self-resonance.
        </span>
      </div>
      <div className="diagram-scroll-hint">Scroll horizontally to compare the equivalent model and impedance curve.</div>
      <div style={{overflowX: 'auto'}}>
        <svg
          role="img"
          aria-labelledby="capacitor-impedance-title capacitor-impedance-description"
          viewBox="0 65 920 325"
          style={{display: 'block', width: '100%', minWidth: '760px', height: 'auto'}}
        >
        <title id="capacitor-impedance-title">Real capacitor model and impedance curve</title>
        <desc id="capacitor-impedance-description">
          A real capacitor contains equivalent series resistance and equivalent series inductance. Its impedance decreases, reaches a minimum at self-resonance, and then increases.
        </desc>

        <rect x="28" y="78" width="330" height="300" rx="12" fill={panelColor} stroke={borderColor} strokeWidth="2" />
        <text x="193" y="110" textAnchor="middle" fill={accentColor} fontSize="15" fontWeight="800">
          EQUIVALENT SERIES MODEL
        </text>

        <line x1="62" y1="210" x2="92" y2="210" stroke={textColor} strokeWidth="3" />
        <Resistor x={92} y={210} />
        <line x1="162" y1="210" x2="185" y2="210" stroke={textColor} strokeWidth="3" />
        <Inductor x={185} y={210} />
        <line x1="269" y1="210" x2="288" y2="210" stroke={textColor} strokeWidth="3" />
        <line x1="288" y1="188" x2="288" y2="232" stroke={tealColor} strokeWidth="4" />
        <line x1="302" y1="188" x2="302" y2="232" stroke={tealColor} strokeWidth="4" />
        <line x1="302" y1="210" x2="330" y2="210" stroke={textColor} strokeWidth="3" />

        <text x="127" y="184" textAnchor="middle" fill={accentColor} fontSize="13" fontWeight="800">ESR</text>
        <text x="227" y="174" textAnchor="middle" fill={blueColor} fontSize="13" fontWeight="800">ESL</text>
        <text x="295" y="174" textAnchor="middle" fill={tealColor} fontSize="13" fontWeight="800">C</text>

        <text x="193" y="278" textAnchor="middle" fill={mutedColor} fontSize="13">
          Plate, lead, and dielectric resistance
        </text>
        <text x="193" y="302" textAnchor="middle" fill={mutedColor} fontSize="13">
          Lead and internal inductance
        </text>
        <text x="193" y="326" textAnchor="middle" fill={mutedColor} fontSize="13">
          Intended capacitance
        </text>

        <rect x="382" y="78" width="510" height="300" rx="12" fill={panelColor} stroke={borderColor} strokeWidth="2" />
        <text x="637" y="110" textAnchor="middle" fill={accentColor} fontSize="15" fontWeight="800">
          IMPEDANCE V-CURVE
        </text>

        <line x1="438" y1="320" x2="845" y2="320" stroke={textColor} strokeWidth="2" />
        <line x1="438" y1="142" x2="438" y2="320" stroke={textColor} strokeWidth="2" />
        <text x="642" y="356" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">Frequency</text>
        <text x="405" y="230" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700" transform="rotate(-90 405 230)">
          Impedance
        </text>

        <path
          d="M 470 158 C 535 205 578 260 630 296 C 654 313 680 313 704 296 C 746 266 783 218 825 158"
          fill="none"
          stroke={blueColor}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line x1="668" y1="130" x2="668" y2="320" stroke={accentColor} strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="668" cy="307" r="7" fill={accentColor} />

        <text x="520" y="192" textAnchor="middle" fill={tealColor} fontSize="13" fontWeight="800">CAPACITIVE</text>
        <text x="790" y="192" textAnchor="middle" fill={blueColor} fontSize="13" fontWeight="800">INDUCTIVE</text>
        <text x="668" y="126" textAnchor="middle" fill={accentColor} fontSize="13" fontWeight="800">SRF</text>
        <text x="668" y="342" textAnchor="middle" fill={accentColor} fontSize="12" fontWeight="700">Minimum impedance ≈ ESR</text>

        <text x="510" y="276" textAnchor="middle" fill={mutedColor} fontSize="12">Impedance decreases</text>
        <text x="792" y="276" textAnchor="middle" fill={mutedColor} fontSize="12">Impedance increases</text>
        </svg>
      </div>
      <figcaption style={{marginTop: '0.5rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        The self-resonant frequency separates capacitive behavior from inductive behavior.
      </figcaption>
    </figure>
  );
}
