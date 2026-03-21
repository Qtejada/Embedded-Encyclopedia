import React from 'react';

export default function RCHighPass() {
  // Use CSS variables for theme adaptation
  const strokeColor = "var(--ifm-font-color-base)";
  const highlightColor = "var(--ifm-color-primary)";

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>RC Differentiator (High-Pass)</h4>
      {/* Increased height slightly to accommodate text labels comfortably */}
      <svg width="100%" height="220" viewBox="0 0 300 220" style={{maxWidth: '450px'}}>

        {/* --- Schematic Group (Shifted down slightly) --- */}
        <g transform="translate(0, 20)">
            {/* Input Label */}
            <text x="20" y="55" fill={strokeColor} fontSize="14" fontWeight="bold">Vin</text>
            <circle cx="50" cy="50" r="3" fill={strokeColor} />
            {/* Wire to Cap */}
            <line x1="50" y1="50" x2="90" y2="50" stroke={strokeColor} strokeWidth="2" />

            {/* CLEAN CAPACITOR SYMBOL (Series) */}
            {/* Plate 1 (Left) */}
            <line x1="90" y1="40" x2="90" y2="60" stroke={strokeColor} strokeWidth="2" />
            {/* Plate 2 (Right) */}
            <line x1="100" y1="40" x2="100" y2="60" stroke={strokeColor} strokeWidth="2" />
            {/* Label C */}
            <text x="95" y="30" fill={strokeColor} fontSize="12" textAnchor="middle" fontWeight="bold">C</text>

            {/* Junction Wire */}
            <line x1="100" y1="50" x2="150" y2="50" stroke={strokeColor} strokeWidth="2" />
            <circle cx="150" cy="50" r="3" fill={strokeColor} />

            {/* Resistor (Shunt to Ground) */}
            <line x1="150" y1="50" x2="150" y2="70" stroke={strokeColor} strokeWidth="2" />
            <polyline points="150,70 145,75 155,80 145,85 155,90 145,95 155,100 150,105"
                      fill="none" stroke={strokeColor} strokeWidth="2" />
            <line x1="150" y1="105" x2="150" y2="130" stroke={strokeColor} strokeWidth="2" />
            <text x="170" y="90" fill={strokeColor} fontSize="12" fontWeight="bold">R</text>

            {/* Ground Symbol */}
            <line x1="135" y1="130" x2="165" y2="130" stroke={strokeColor} strokeWidth="2" />
            <line x1="140" y1="135" x2="160" y2="135" stroke={strokeColor} strokeWidth="2" />
            <line x1="145" y1="140" x2="155" y2="140" stroke={strokeColor} strokeWidth="2" />

            {/* Output Wire */}
            <line x1="150" y1="50" x2="250" y2="50" stroke={strokeColor} strokeWidth="2" />
            <circle cx="250" cy="50" r="3" fill={strokeColor} />
            <text x="260" y="55" fill={highlightColor} fontSize="14" fontWeight="bold">Vout</text>
        </g>

        {/* --- Waveforms Visualization --- */}
        
        {/* Input Waveform Group */}
        <g transform="translate(40, 180) scale(0.6)">
           <text x="40" y="-50" fontSize="18" fill={strokeColor} textAnchor="middle">Input: Square</text>
           <polyline points="0,20 20,20 20,-20 60,-20 60,20 80,20" fill="none" stroke={strokeColor} strokeWidth="3"/>
        </g>

        {/* Output Waveform Group */}
        <g transform="translate(200, 180) scale(0.6)">
           <text x="40" y="-60" fontSize="18" fill={highlightColor} textAnchor="middle">Output: Spikes</text>
           {/* FIX: Spikes now start and end at the baseline (y=20) */}
           <polyline points="0,20 20,20 20,-30 20,20 60,20 60,70 60,20 80,20" fill="none" stroke={highlightColor} strokeWidth="2"/>
        </g>

      </svg>
    </div>
  );
}