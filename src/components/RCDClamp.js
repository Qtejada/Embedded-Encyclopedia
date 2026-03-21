import React from 'react';

export default function RCDClamp() {
  const strokeColor = "var(--ifm-font-color-base)";
  const highlightColor = "var(--ifm-color-primary)";

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>Dissipative RCD Snubber</h4>
      <svg width="100%" height="350" viewBox="0 0 400 350" style={{maxWidth: '450px'}}>
        
        {/* --- 1. Main Loop Outline --- */}
        {/* Top Wire */}
        <line x1="60" y1="40" x2="340" y2="40" stroke={strokeColor} strokeWidth="3" />
        {/* Bottom Wire */}
        <line x1="60" y1="310" x2="340" y2="310" stroke={strokeColor} strokeWidth="3" />
        
        {/* Left Wire with Voltage Source Symbol */}
        <line x1="60" y1="40" x2="60" y2="135" stroke={strokeColor} strokeWidth="3" />
        <circle cx="60" cy="175" r="40" fill="none" stroke={strokeColor} strokeWidth="3" />
        <text x="60" y="165" fill={strokeColor} fontSize="24" fontWeight="bold" textAnchor="middle">+</text>
        <line x1="50" y1="185" x2="70" y2="185" stroke={strokeColor} strokeWidth="3" /> {/* Minus */}
        <line x1="60" y1="215" x2="60" y2="310" stroke={strokeColor} strokeWidth="3" />

        {/* --- 3. Inductor (Primary) --- */}
        {/* Wire down to coil */}
        <line x1="340" y1="40" x2="340" y2="70" stroke={strokeColor} strokeWidth="3" />
        {/* Coils */}
        <path d="M 340,70 C 360,70 360,90 340,90 C 360,90 360,110 340,110 C 360,110 360,130 340,130 C 360,130 360,150 340,150" 
              fill="none" stroke={strokeColor} strokeWidth="3" />
        {/* Core Lines */}
        <line x1="370" y1="70" x2="370" y2="150" stroke={strokeColor} strokeWidth="3" />
        {/* Dot */}
        <circle cx="325" cy="140" r="4" fill={strokeColor} />
        
        {/* Wire from coil to node */}
        <line x1="340" y1="150" x2="340" y2="220" stroke={strokeColor} strokeWidth="3" />

        {/* --- 4. Simple N-Channel MOSFET --- */}
        <g transform="translate(340, 250)">
             {/* Gate */}
             <line x1="-30" y1="-15" x2="-30" y2="25" stroke={strokeColor} strokeWidth="3" />
             <line x1="-30" y1="5" x2="-50" y2="5" stroke={strokeColor} strokeWidth="3" /> {/* Gate Pin */}
             
             {/* Channel (Simplified) */}
             <line x1="-10" y1="-20" x2="-10" y2="30" stroke={strokeColor} strokeWidth="3" />

             {/* Connectors */}
             {/* Drain */}
             <line x1="-10" y1="-20" x2="0" y2="-20" stroke={strokeColor} strokeWidth="3" />
             <line x1="0" y1="-30" x2="0" y2="-20" stroke={strokeColor} strokeWidth="3" />
             
             {/* Source with Arrow */}
             <line x1="-10" y1="30" x2="0" y2="30" stroke={strokeColor} strokeWidth="3" />
             <line x1="0" y1="30" x2="0" y2="60" stroke={strokeColor} strokeWidth="3" />
             <polygon points="0,30 -10,25 -10,35" fill={strokeColor} />
        </g>

        {/* --- 5. RCD Snubber Network --- */}
        
        {/* Top rail connection for R and C */}
        <line x1="140" y1="40" x2="140" y2="80" stroke={strokeColor} strokeWidth="3" /> {/* R Top */}
        <line x1="200" y1="40" x2="200" y2="90" stroke={strokeColor} strokeWidth="3" /> {/* C Top */}

        {/* Resistor (Zig Zag) */}
        <polyline points="140,80 130,85 150,95 130,105 150,115 130,125 150,135 140,140" 
                  fill="none" stroke={strokeColor} strokeWidth="3" />
        <line x1="140" y1="140" x2="140" y2="160" stroke={strokeColor} strokeWidth="3" />

        {/* Capacitor (Plates) */}
        <line x1="180" y1="90" x2="220" y2="90" stroke={strokeColor} strokeWidth="3" />
        <line x1="180" y1="100" x2="220" y2="100" stroke={strokeColor} strokeWidth="3" />
        <line x1="200" y1="100" x2="200" y2="160" stroke={strokeColor} strokeWidth="3" />

        {/* Bottom RC Junction */}
        <line x1="140" y1="160" x2="240" y2="160" stroke={strokeColor} strokeWidth="3" />

        {/* Diode (Horizontal, pointing Left) */}
        {/* Line from Switch Node to Diode */}
        <line x1="340" y1="160" x2="270" y2="160" stroke={strokeColor} strokeWidth="3" />
        
        <g transform="translate(255, 160)">
            {/* Triangle pointing Left */}
            <polygon points="15,-10 15,10 -5,0" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Bar */}
            <line x1="-5" y1="-10" x2="-5" y2="10" stroke={strokeColor} strokeWidth="3" />
            {/* Connection */}
            <line x1="-5" y1="0" x2="-15" y2="0" stroke={strokeColor} strokeWidth="3" />
        </g>

        {/* Connection Dots */}
        <circle cx="140" cy="40" r="3" fill={strokeColor} />
        <circle cx="200" cy="40" r="3" fill={strokeColor} />
        <circle cx="340" cy="160" r="3" fill={strokeColor} />

      </svg>
    </div>
  );
}