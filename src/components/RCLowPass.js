import React from 'react';

export default function RCLowPass() {
  const strokeColor = "var(--ifm-font-color-base)";
  const highlightColor = "var(--ifm-color-primary)";

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>RC Integrator (Low-Pass)</h4>
      {/* Increased height to 220 to match HighPass styling */}
      <svg width="100%" height="220" viewBox="0 0 300 220" style={{maxWidth: '450px'}}>
        
        {/* --- Schematic Group (Shifted down slightly) --- */}
        <g transform="translate(0, 20)">
            {/* Input */}
            <text x="20" y="55" fill={strokeColor} fontSize="14" fontWeight="bold">Vin</text>
            <circle cx="50" cy="50" r="3" fill={strokeColor} />
            <line x1="50" y1="50" x2="80" y2="50" stroke={strokeColor} strokeWidth="2" />

            {/* Resistor (Series) */}
            <polyline points="80,50 85,45 95,55 105,45 115,55 125,45 130,50" 
                      fill="none" stroke={strokeColor} strokeWidth="2" />
            <line x1="130" y1="50" x2="150" y2="50" stroke={strokeColor} strokeWidth="2" />
            <text x="105" y="35" fill={strokeColor} fontSize="12" textAnchor="middle" fontWeight="bold">R</text>

            {/* Junction */}
            <circle cx="150" cy="50" r="3" fill={strokeColor} />

            {/* Capacitor (Shunt to Ground) */}
            <line x1="150" y1="50" x2="150" y2="80" stroke={strokeColor} strokeWidth="2" />
            <line x1="140" y1="80" x2="160" y2="80" stroke={strokeColor} strokeWidth="2" /> {/* Plate 1 */}
            <line x1="140" y1="90" x2="160" y2="90" stroke={strokeColor} strokeWidth="2" /> {/* Plate 2 */}
            <line x1="150" y1="90" x2="150" y2="130" stroke={strokeColor} strokeWidth="2" />
            <text x="170" y="85" fill={strokeColor} fontSize="12" fontWeight="bold">C</text>

            {/* Ground */}
            <line x1="135" y1="130" x2="165" y2="130" stroke={strokeColor} strokeWidth="2" />
            <line x1="140" y1="135" x2="160" y2="135" stroke={strokeColor} strokeWidth="2" />
            <line x1="145" y1="140" x2="155" y2="140" stroke={strokeColor} strokeWidth="2" />

            {/* Output */}
            <line x1="150" y1="50" x2="250" y2="50" stroke={strokeColor} strokeWidth="2" />
            <circle cx="250" cy="50" r="3" fill={strokeColor} />
            <text x="260" y="55" fill={highlightColor} fontSize="14" fontWeight="bold">Vout</text>
        </g>

         {/* --- Waveforms Visualization --- */}
         
         {/* Input Waveform */}
         <g transform="translate(40, 180) scale(0.6)">
           {/* Fixed: Moved text up to y=-50 and centered it at x=40 */}
           <text x="40" y="-50" fontSize="18" fill={strokeColor} textAnchor="middle">Input: Square</text>
           <polyline points="0,20 20,20 20,-20 60,-20 60,20 80,20" fill="none" stroke={strokeColor} strokeWidth="3"/>
        </g>

        {/* Output Waveform */}
        <g transform="translate(200, 180) scale(0.6)">
           {/* Fixed: Moved text up to y=-50 and centered it at x=40 */}
           <text x="40" y="-50" fontSize="18" fill={highlightColor} textAnchor="middle">Output: Ramp</text>
           <path d="M 0,20 L 20,20 L 40,-15 L 60,20 L 80,-15" fill="none" stroke={highlightColor} strokeWidth="2"/>
        </g>

      </svg>
    </div>
  );
}