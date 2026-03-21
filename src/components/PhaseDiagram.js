import React from 'react';

export default function PhaseDiagram() {
  const strokeColor = "var(--ifm-font-color-base)";
  const colorV = "var(--ifm-color-primary)"; // Voltage (Yellow)
  const colorI = "#fa5252"; // Current (Red)

  // Configuration
  const width = 300;
  const height = 120;
  const startX = 20;
  const endX = 280;
  const centerY = 60;
  const amplitude = 40;
  const period = 120; // Pixels per cycle

  // Helper to generate exact sine wave path strings
  const generateSinePath = (phaseShiftDeg) => {
    let path = `M ${startX} ${centerY - amplitude * Math.sin((phaseShiftDeg * Math.PI) / 180)}`;
    
    for (let x = startX; x <= endX; x += 2) {
      // Convert x to angle (radians)
      // (x - startX) / period * 2π
      const angle = ((x - startX) / period) * 2 * Math.PI;
      // Add phase shift
      const totalAngle = angle + (phaseShiftDeg * Math.PI) / 180;
      
      // Calculate Y (Inverted because SVG y=0 is top)
      const y = centerY - amplitude * Math.sin(totalAngle);
      
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '10px'}}>Phase: I leads V by 90°</h4>
      <svg width="300" height="120" viewBox="0 0 300 120">
        {/* Axes */}
        <line x1="20" y1="60" x2="280" y2="60" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="10" x2="20" y2="110" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        
        {/* Voltage Sine Wave (0° Phase) */}
        {/* Starts at 0, goes Up */}
        <path d={generateSinePath(0)} fill="none" stroke={colorV} strokeWidth="3" />
        <text x="270" y="65" fill={colorV} fontWeight="bold" fontSize="12">V</text>

        {/* Current Sine Wave (90° Phase Lead) */}
        {/* Starts at Peak, goes Down */}
        <path d={generateSinePath(90)} fill="none" stroke={colorI} strokeWidth="3" strokeDasharray="4,4" />
        <text x="270" y="30" fill={colorI} fontWeight="bold" fontSize="12">I</text>

        {/* Markers for T=0 */}
        <line x1="20" y1="10" x2="20" y2="60" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
        <text x="25" y="115" fill={strokeColor} fontSize="10">Time →</text>
        
        {/* Peak Markers to visualize the lead */}
        {/* Current Peak at x=20 */}
        <circle cx="20" cy="20" r="3" fill={colorI} />
        {/* Voltage Peak at x=50 (90 deg later) */}
        <circle cx="50" cy="20" r="3" fill={colorV} />
      </svg>
      <p style={{fontSize: '0.8rem', marginTop: '5px'}}>
        <span style={{color: colorI, fontWeight: 'bold'}}>Current (Red)</span> is already at its peak when <span style={{color: colorV, fontWeight: 'bold'}}>Voltage (Yellow)</span> is just starting at zero.
      </p>
    </div>
  );
}