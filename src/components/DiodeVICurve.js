import React from 'react';

export default function DiodeVICurve() {
  const textColor = "var(--ifm-font-color-base)";
  const gridColor = "var(--ifm-color-emphasis-300)";
  const curveColor = "var(--ifm-color-primary)"; 

  const width = 400;
  const height = 250;
  const padding = 40;

  const originX = width / 2;
  const originY = height / 2 + 20;

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>Typical Silicon Diode I-V Characteristic</h4>
      <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '500px', overflow: 'visible'}}>
        
        {/* Grids */}
        <g stroke={gridColor} strokeWidth="1" strokeDasharray="4,4">
           <line x1={padding} y1={originY} x2={width - padding} y2={originY} />
           <line x1={originX} y1={padding} x2={originX} y2={height - padding} />
        </g>

        {/* Axes */}
        <g stroke={textColor} strokeWidth="2">
           <line x1={padding} y1={originY} x2={width - padding} y2={originY} markerEnd="url(#arrowhead)" />
           <line x1={originX} y1={height - padding} x2={originX} y2={padding} markerEnd="url(#arrowhead)" />
        </g>

        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={textColor} />
            </marker>
        </defs>

        {/* Curve */}
        <path 
          d={`M ${padding+20}, ${height-padding} 
              L ${padding+40}, ${originY+5} 
              Q ${originX-20}, ${originY} ${originX}, ${originY} 
              L ${originX+60}, ${originY} 
              Q ${originX+85}, ${originY} ${originX+95}, ${originY-80}
              L ${originX+100}, ${padding}`}
          fill="none" 
          stroke={curveColor} 
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Labels */}
        <g fill={textColor} fontSize="18" fontFamily="serif" textAnchor="middle" fontWeight="bold">
            <text x={width - padding + 25} y={originY + 5} alignmentBaseline="middle">V</text>
            <text x={originX} y={padding - 15}>I</text>
        </g>

        <g fill={textColor} fontSize="14" fontFamily="sans-serif">
            {/* Key Points */}
            <text x={originX + 60} y={originY + 25} fontSize="12" textAnchor="start">Vf (≈0.7V)</text>
            <text x={padding} y={originY - 10} fontSize="12" textAnchor="start">PIV / Breakdown</text>

            {/* Regions - Adjusted to +/- 55 for better centering */}
            <g fontWeight="bold" fill={curveColor} textAnchor="middle">
                {/* Moved right to +55 */}
                <text x={originX + 48} y={70}>Forward Bias</text> 
                
                {/* Moved left to -55 */}
                <text x={originX - 80} y={height - 50}>Reverse Bias</text>
            </g>
        </g>
      </svg>
    </div>
  );
}