import React from 'react';

export default function TVSSymbol() {
  const strokeColor = "var(--ifm-font-color-base)";
  
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', margin: '30px 0' }}>
      
      {/* UNI-DIRECTIONAL */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', flex: '1', minWidth: '150px' }}>
        <h5 style={{marginBottom: '15px'}}>Unidirectional</h5>
        <svg width="140" height="100" viewBox="0 0 140 100">
            {/* Input wire */}
            <line x1="10" y1="50" x2="50" y2="50" stroke={strokeColor} strokeWidth="3" />
            
            {/* Triangle (Anode) */}
            <polygon points="50,20 50,80 90,50" fill="none" stroke={strokeColor} strokeWidth="3" />
            
            {/* Cathode Bar (Z-Shape) */}
            <line x1="90" y1="20" x2="90" y2="80" stroke={strokeColor} strokeWidth="3" />
            <line x1="90" y1="20" x2="100" y2="10" stroke={strokeColor} strokeWidth="3" /> {/* Top angled tip */}
            <line x1="90" y1="80" x2="80" y2="90" stroke={strokeColor} strokeWidth="3" />  {/* Bottom angled tip */}
            
            {/* Output wire */}
            <line x1="90" y1="50" x2="130" y2="50" stroke={strokeColor} strokeWidth="3" />
        </svg>
      </div>

      {/* BI-DIRECTIONAL */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', flex: '1', minWidth: '150px' }}>
        <h5 style={{marginBottom: '15px'}}>Bidirectional</h5>
        <svg width="140" height="100" viewBox="0 0 140 100">
            {/* Left Wire */}
            <line x1="10" y1="50" x2="30" y2="50" stroke={strokeColor} strokeWidth="3" />
            
            {/* Left Triangle (Points Right) */}
            <polygon points="30,20 30,80 70,50" fill="none" stroke={strokeColor} strokeWidth="3" />
            
            {/* Right Triangle (Points Left) */}
            <polygon points="110,20 110,80 70,50" fill="none" stroke={strokeColor} strokeWidth="3" />
            
            {/* Right Wire */}
            <line x1="110" y1="50" x2="130" y2="50" stroke={strokeColor} strokeWidth="3" />

            {/* Center Common Cathode Bar */}
            <line x1="70" y1="20" x2="70" y2="80" stroke={strokeColor} strokeWidth="3" />

            {/* Z-Tips on Center Bar */}
            <line x1="70" y1="20" x2="80" y2="10" stroke={strokeColor} strokeWidth="3" /> {/* Top angled tip */}
            <line x1="70" y1="80" x2="60" y2="90" stroke={strokeColor} strokeWidth="3" /> {/* Bottom angled tip */}
        </svg>
      </div>

    </div>
  );
}