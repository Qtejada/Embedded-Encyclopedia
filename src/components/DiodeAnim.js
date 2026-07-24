import React from 'react';

export default function DiodeAnim() {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4>Current-flow visualization</h4>
      <svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        role="img"
        aria-label="Forward-biased diode with current moving from anode to cathode"
      >
        {/* Circuit Line */}
        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--ifm-font-color-base)" strokeWidth="4" />
        
        {/* Diode Triangle */}
        <polygon points="120,20 120,80 180,50" fill="var(--ifm-font-color-base)" />
        {/* Diode Bar (Cathode) */}
        <line x1="180" y1="20" x2="180" y2="80" stroke="var(--ifm-font-color-base)" strokeWidth="6" />

        {/* Moving Electrons (Yellow Dots) */}
        <circle r="6" fill="#f59f00">
          <animate attributeName="cx" from="0" to="300" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cy" from="50" to="50" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Second Electron delayed */}
        <circle r="6" fill="#f59f00">
          <animate attributeName="cx" from="0" to="300" dur="2s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="cy" from="50" to="50" dur="2s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
        
        {/* Labels - SHIFTED LEFT */}
        {/* Was x=100, now x=85 */}
        <text x="85" y="95" fontSize="12" fill="var(--ifm-font-color-base)">Anode (+)</text>
        {/* Was x=190, now x=175 */}
        <text x="175" y="95" fontSize="12" fill="var(--ifm-font-color-base)">Cathode (-)</text>
      </svg>
      <p style={{fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)'}}>Forward biased: Current flows from anode to cathode.</p>
    </div>
  );
}
