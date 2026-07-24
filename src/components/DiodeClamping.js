import React from 'react';

export default function DiodeClamping() {
  const strokeColor = "var(--ifm-font-color-base)";
  const highlightColor = "var(--ifm-color-primary)";

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>Diode voltage clamp (limiter)</h4>
      <svg
        width="100%"
        height="180"
        viewBox="0 0 400 180"
        role="img"
        aria-label="Diode circuit that limits the output to approximately 0.7 volts"
        style={{maxWidth: '400px'}}
      >
        
        {/* Input Side */}
        <text x="30" y="95" fill={strokeColor} fontSize="14" textAnchor="end">Input</text>
        <line x1="40" y1="90" x2="100" y2="90" stroke={strokeColor} strokeWidth="2" />
        <circle cx="40" cy="90" r="3" fill={strokeColor} />

        {/* Series Resistor */}
        <polyline points="100,90 105,80 115,100 125,80 135,100 145,80 150,90" fill="none" stroke={strokeColor} strokeWidth="2" />
        <text x="125" y="70" fill="var(--ifm-color-emphasis-600)" fontSize="12" textAnchor="middle">R_limit</text>

        {/* Output Line */}
        <line x1="150" y1="90" x2="330" y2="90" stroke={strokeColor} strokeWidth="2" />
        <circle cx="330" cy="90" r="3" fill={strokeColor} />
        <text x="340" y="95" fill={highlightColor} fontSize="14" fontWeight="bold">Output</text>

        {/* Clamping Diode (Points Down to Ground) */}
        {/* Connection Dot */}
        <circle cx="250" cy="90" r="3" fill={strokeColor} />
        <line x1="250" y1="90" x2="250" y2="110" stroke={strokeColor} strokeWidth="2" />
        
        {/* Diode Symbol (Anode top, Cathode bottom = Clamps Pos) 
            Wait, user said "Limit to fwd voltage ABOVE ref". 
            So Anode to Signal, Cathode to Ground.
        */}
        <g transform="translate(250, 125) rotate(90)">
             <line x1="-15" y1="0" x2="-10" y2="0" stroke={strokeColor} strokeWidth="2" />
             <polygon points="-10,-10 -10,10 10,0" fill="none" stroke={strokeColor} strokeWidth="2" />
             <line x1="10" y1="-10" x2="10" y2="10" stroke={strokeColor} strokeWidth="2" />
             <line x1="10" y1="0" x2="15" y2="0" stroke={strokeColor} strokeWidth="2" />
        </g>

        {/* Ground Connection */}
        <line x1="250" y1="140" x2="250" y2="160" stroke={strokeColor} strokeWidth="2" />
        <line x1="235" y1="160" x2="265" y2="160" stroke={strokeColor} strokeWidth="2" />
        <line x1="240" y1="165" x2="260" y2="165" stroke={strokeColor} strokeWidth="2" />
        <line x1="245" y1="170" x2="255" y2="170" stroke={strokeColor} strokeWidth="2" />

        {/* Explanation Text */}
        <text x="200" y="40" fill="var(--ifm-color-emphasis-600)" fontSize="12" fontStyle="italic">
             Maximum V_out ≈ 0.7 V
        </text>

      </svg>
    </div>
  );
}
