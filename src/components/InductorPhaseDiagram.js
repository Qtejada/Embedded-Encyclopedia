import React from 'react';

export default function InductorPhaseDiagram() {
  const strokeColor = "var(--ifm-font-color-base)";
  const colorV = "var(--ifm-color-primary)"; // Voltage (Yellow)
  const colorI = "#fa5252"; // Current (Red)

  const width = 300;
  const centerY = 60;
  const amplitude = 40;
  const period = 120; 
  const startX = 20;
  const endX = 280;

  const generateSinePath = (phaseShiftDeg) => {
    let path = `M ${startX} ${centerY - amplitude * Math.sin((phaseShiftDeg * Math.PI) / 180)}`;
    for (let x = startX; x <= endX; x += 2) {
      const angle = ((x - startX) / period) * 2 * Math.PI;
      const totalAngle = angle + (phaseShiftDeg * Math.PI) / 180;
      const y = centerY - amplitude * Math.sin(totalAngle);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', padding: '15px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '10px'}}>Phase: V leads I by 90°</h4>
      <svg width="300" height="120" viewBox="0 0 300 120">
        <line x1="20" y1="60" x2="280" y2="60" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="10" x2="20" y2="110" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        
        {/* Voltage Sine Wave (90° Lead - Starts at Peak) */}
        <path d={generateSinePath(90)} fill="none" stroke={colorV} strokeWidth="3" />
        <text x="270" y="30" fill={colorV} fontWeight="bold" fontSize="12">V</text>

        {/* Current Sine Wave (0° - Starts at Zero) */}
        <path d={generateSinePath(0)} fill="none" stroke={colorI} strokeWidth="3" strokeDasharray="4,4" />
        <text x="270" y="65" fill={colorI} fontWeight="bold" fontSize="12">I</text>

        <line x1="20" y1="10" x2="20" y2="60" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
        <text x="25" y="115" fill={strokeColor} fontSize="10">Time →</text>
      </svg>
      <p style={{fontSize: '0.8rem', marginTop: '5px'}}>
        <span style={{color: colorV, fontWeight: 'bold'}}>Voltage (Green)</span> must exist across the inductor <i>before</i> <span style={{color: colorI, fontWeight: 'bold'}}>Current (Red)</span> can start ramping up.
      </p>
    </div>
  );
}