import React, { useState } from 'react';

export default function GainBandwidthGraph() {
  const [gainDB, setGainDB] = useState(40); // Default to 40dB

  // Op-Amp Constants
  const GBWP = 1000000; // 1 MHz
  const openLoopDCGainDB = 100; // 100 dB
  const poleFreq = 10; // 10 Hz

  // Calculate actual bandwidth based on selected closed-loop gain
  // GBWP = Gain(linear) * BW -> BW = GBWP / 10^(GainDB/20)
  const bandwidth = GBWP / Math.pow(10, gainDB / 20);

  // SVG Drawing Dimensions
  const width = 600;
  const height = 400;
  const pad = { top: 20, right: 40, bottom: 50, left: 60 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  // Scaling Functions
  const minFreqLog = 0; // 10^0 = 1 Hz
  const maxFreqLog = 7; // 10^7 = 10 MHz
  const maxGainDB = 120; // Y-axis max

  const getX = (freq) => pad.left + ((Math.log10(freq) - minFreqLog) / (maxFreqLog - minFreqLog)) * w;
  const getY = (db) => pad.top + h - (db / maxGainDB) * h;

  // Path Generation
  const openLoopPath = `M ${getX(1)} ${getY(100)} L ${getX(10)} ${getY(100)} L ${getX(1000000)} ${getY(0)}`;
  const closedLoopPath = `M ${getX(1)} ${getY(gainDB)} L ${getX(bandwidth)} ${getY(gainDB)} L ${getX(1000000)} ${getY(0)}`;
  const shadePath = `${closedLoopPath} L ${getX(1000000)} ${getY(0)} L ${getX(1)} ${getY(0)} Z`;

  // Formatting Helper
  const formatFreq = (hz) => {
    if (hz >= 1000000) return `${(hz / 1000000).toFixed(1)} MHz`;
    if (hz >= 1000) return `${(hz / 1000).toFixed(1)} kHz`;
    return `${hz.toFixed(0)} Hz`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Controls */}
      <div style={{ padding: '15px', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <strong>Closed Loop Gain: {gainDB} dB</strong>
          <strong>Bandwidth: {formatFreq(bandwidth)}</strong>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="1" 
          value={gainDB} 
          onChange={(e) => setGainDB(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Graph */}
      <div style={{ background: 'var(--ifm-background-color)', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
          
          {/* Grid Lines & Labels */}
          {[0, 20, 40, 60, 80, 100, 120].map((db) => (
            <g key={`y-${db}`}>
              <line x1={pad.left} y1={getY(db)} x2={width - pad.right} y2={getY(db)} stroke="var(--ifm-color-emphasis-200)" strokeDasharray="4 4" />
              <text x={pad.left - 10} y={getY(db) + 4} textAnchor="end" fontSize="12" fill="var(--ifm-color-emphasis-600)">{db} dB</text>
            </g>
          ))}
          
          {[1, 10, 100, 1000, 10000, 100000, 1000000, 10000000].map((f) => (
            <g key={`x-${f}`}>
              <line x1={getX(f)} y1={pad.top} x2={getX(f)} y2={height - pad.bottom} stroke="var(--ifm-color-emphasis-200)" strokeDasharray="4 4" />
              <text x={getX(f)} y={height - pad.bottom + 20} textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-600)">
                {f === 1 ? '1Hz' : f === 1000 ? '1kHz' : f === 1000000 ? '1MHz' : ''}
              </text>
            </g>
          ))}

          {/* Axes Titles */}
          <text x={pad.left + w / 2} y={height - 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="var(--ifm-font-color-base)">Frequency (Hz)</text>
          <text x={- (pad.top + h / 2)} y={20} transform="rotate(-90)" textAnchor="middle" fontSize="14" fontWeight="bold" fill="var(--ifm-font-color-base)">Gain (dB)</text>

          {/* Shaded Area under Closed Loop */}
          <path d={shadePath} fill="rgba(0, 150, 255, 0.1)" />

          {/* Open Loop Curve */}
          <path d={openLoopPath} fill="none" stroke="var(--ifm-color-emphasis-400)" strokeWidth="3" strokeDasharray="6 6" />
          
          {/* Closed Loop Curve */}
          <path d={closedLoopPath} fill="none" stroke="#25c2a0" strokeWidth="4" />

          {/* Bandwidth Marker */}
          <circle cx={getX(bandwidth)} cy={getY(gainDB)} r="6" fill="#25c2a0" />
          <line x1={getX(bandwidth)} y1={getY(gainDB)} x2={getX(bandwidth)} y2={height - pad.bottom} stroke="#25c2a0" strokeWidth="2" strokeDasharray="4 4" />
          
        </svg>
      </div>
    </div>
  );
}