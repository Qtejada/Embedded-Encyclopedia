import React from 'react';

export default function SchottkySymbol() {
  const strokeColor = "var(--ifm-font-color-base)";
  const metalColor = "#adb5bd"; // Grey for Metal
  const semiColor = "#ffec99";  // Light Yellow for Silicon

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', margin: '30px 0' }}>
      
      {/* 1. THE SYMBOL */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', flex: '1', minWidth: '200px' }}>
        <h4 style={{marginBottom: '10px'}}>Circuit Symbol</h4>
        <svg width="150" height="100" viewBox="0 0 150 100">
           {/* Anode Line */}
           <line x1="20" y1="50" x2="60" y2="50" stroke={strokeColor} strokeWidth="3" />
           {/* Triangle */}
           <polygon points="60,20 60,80 110,50" fill="none" stroke={strokeColor} strokeWidth="3" />
           {/* Cathode Line */}
           <line x1="110" y1="50" x2="140" y2="50" stroke={strokeColor} strokeWidth="3" />
           
           {/* The "S" Curve Bar */}
           <polyline points="110,20 110,80" fill="none" stroke={strokeColor} strokeWidth="3" />
           {/* Top Hook (Right) */}
           <polyline points="110,20 120,20 120,25" fill="none" stroke={strokeColor} strokeWidth="3" />
           {/* Bottom Hook (Left) */}
           <polyline points="110,80 100,80 100,75" fill="none" stroke={strokeColor} strokeWidth="3" />
        </svg>
      </div>

      {/* 2. THE STRUCTURE */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', flex: '1', minWidth: '200px' }}>
        <h4 style={{marginBottom: '10px'}}>Internal Structure</h4>
        <svg width="200" height="100" viewBox="0 0 200 100">
           {/* Silicon N-Type Block */}
           <rect x="50" y="50" width="100" height="40" fill={semiColor} stroke={strokeColor} strokeWidth="2" />
           <text x="100" y="75" fontSize="12" fill="#000" textAnchor="middle">N-Type Silicon</text>
           
           {/* Metal Junction Block */}
           <rect x="50" y="20" width="100" height="30" fill={metalColor} stroke={strokeColor} strokeWidth="2" />
           <text x="100" y="40" fontSize="12" fill="#000" textAnchor="middle">Metal (Au/Pt/W)</text>

           {/* Terminals */}
           <line x1="100" y1="20" x2="100" y2="5" stroke={strokeColor} strokeWidth="2" />
           <text x="100" y="10" fontSize="10" fill={strokeColor} textAnchor="middle">Anode</text>

           <line x1="100" y1="90" x2="100" y2="100" stroke={strokeColor} strokeWidth="2" />
           <text x="100" y="100" fontSize="10" fill={strokeColor} textAnchor="middle" dy="5">Cathode</text>
        </svg>
      </div>

    </div>
  );
}