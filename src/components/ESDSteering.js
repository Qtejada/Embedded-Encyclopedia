import React from 'react';

export default function ESDSteering() {
  // Use theme color for everything to match the "white on dark" look of the generated image
  const strokeColor = "var(--ifm-font-color-base)";

  // Solid Diode Symbol (Points Up)
  const DiodeUp = ({x, y}) => (
    <g transform={`translate(${x},${y})`}>
        {/* Triangle (Anode) - Filled */}
        <polygon points="0,-10 -10,10 10,10" fill={strokeColor} />
        {/* Bar (Cathode) */}
        <line x1="-15" y1="-10" x2="15" y2="-10" stroke={strokeColor} strokeWidth="3" />
        {/* Connection lines */}
        <line x1="0" y1="10" x2="0" y2="20" stroke={strokeColor} strokeWidth="3" />
        <line x1="0" y1="-10" x2="0" y2="-20" stroke={strokeColor} strokeWidth="3" />
    </g>
  );

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h3 style={{marginBottom: '25px', color: strokeColor}}>ESD Steering Protection</h3>
      <svg width="100%" height="250" viewBox="0 0 500 250" style={{maxWidth: '600px', margin: 'auto', display: 'block'}}>

        {/* --- Rails --- */}
        {/* VCC Rail (Top) */}
        <text x="490" y="45" fill={strokeColor} fontWeight="bold" textAnchor="end" fontSize="18">VCC (+5V)</text>
        <line x1="150" y1="50" x2="400" y2="50" stroke={strokeColor} strokeWidth="3" />
        <circle cx="275" cy="50" r="5" fill={strokeColor} />

        {/* GND Rail (Bottom) */}
        <text x="490" y="225" fill={strokeColor} fontWeight="bold" textAnchor="end" fontSize="18">GND</text>
        <line x1="150" y1="220" x2="400" y2="220" stroke={strokeColor} strokeWidth="3" />
        <circle cx="275" cy="220" r="5" fill={strokeColor} />


        {/* --- Signal Path --- */}
        {/* Input Connector Box */}
        <rect x="10" y="110" width="120" height="50" fill="none" stroke={strokeColor} strokeWidth="3" />
        <text x="70" y="130" fill={strokeColor} textAnchor="middle" fontSize="16">Input</text>
        <text x="70" y="150" fill={strokeColor} textAnchor="middle" fontSize="16">Connector</text>
        
        {/* Main Trace */}
        <line x1="130" y1="135" x2="420" y2="135" stroke={strokeColor} strokeWidth="3" />
        {/* Arrow head */}
        <polygon points="420,135 405,125 405,145" fill={strokeColor} /> 
        <text x="430" y="140" fill={strokeColor} fontWeight="bold" fontSize="18" dominantBaseline="middle">To IC Pin</text>

        {/* Central Junction Dot */}
        <circle cx="275" cy="135" r="5" fill={strokeColor} />


        {/* --- Protection Diodes --- */}
        {/* Top Diode (D1) - Connects Signal to VCC */}
        <line x1="275" y1="135" x2="275" y2="50" stroke={strokeColor} strokeWidth="3" />
        <DiodeUp x={275} y={95} /> 
        <text x="300" y="95" fontSize="16" fill={strokeColor} dominantBaseline="middle">D1 (Clamps to VCC)</text>

        {/* Bottom Diode (D2) - Connects GND to Signal */}
        <line x1="275" y1="135" x2="275" y2="220" stroke={strokeColor} strokeWidth="3" />
        <DiodeUp x={275} y={180} />
        <text x="300" y="180" fontSize="16" fill={strokeColor} dominantBaseline="middle">D2 (Clamps to GND)</text>

      </svg>
    </div>
  );
}