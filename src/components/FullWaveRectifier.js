// src/components/FullWaveRectifier.js
import React from 'react';

export default function FullWaveRectifier() {
  // Define colors using Docusaurus theme variables for auto light/dark mode
  const strokeColor = "var(--ifm-font-color-base)";
  const secondaryColor = "var(--ifm-color-emphasis-400)";
  const highlightColor = "var(--ifm-color-primary)"; // Our Hardware Yellow

  const width = 500;
  const height = 220;

  // Helper to draw a diode symbol
  const DiodeSymbol = ({ x, y, rotation }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <line x1="-15" y1="0" x2="-10" y2="0" stroke={strokeColor} strokeWidth="2" />
      <polygon points="-10,-10 -10,10 10,0" fill="none" stroke={strokeColor} strokeWidth="2" />
      <line x1="10" y1="-10" x2="10" y2="10" stroke={strokeColor} strokeWidth="2" />
      <line x1="10" y1="0" x2="15" y2="0" stroke={strokeColor} strokeWidth="2" />
    </g>
  );

  // Helper to draw a polarized capacitor
  const CapSymbol = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      {/* Positive Plate */}
      <line x1="-10" y1="-15" x2="-10" y2="15" stroke={strokeColor} strokeWidth="2" />
      <text x="-22" y="-5" fill={strokeColor} fontSize="12">+</text>
      {/* Negative Plate (Curved) */}
      <path d="M 10,-15 Q 5,0 10,15" fill="none" stroke={strokeColor} strokeWidth="2" />
      {/* Connection lines */}
      <line x1="-10" y1="0" x2="-25" y2="0" stroke={strokeColor} strokeWidth="2" />
      <line x1="10" y1="0" x2="25" y2="0" stroke={strokeColor} strokeWidth="2" />
    </g>
  );

  // Helper to draw a resistor load
  const ResistorSymbol = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <polyline
            points="-20,0 -15,-10 -5,10 5,-10 15,10 20,0"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
        />
    </g>
  );


  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
      <h4 style={{marginBottom: '20px'}}>Full-Wave Bridge Rectifier Circuit</h4>
      <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '600px'}}>
        
        {/* --- 1. AC Source & Transformer --- */}
        <g>
            <text x="40" y="110" fill={secondaryColor} fontSize="14" textAnchor="middle">AC Input</text>
            {/* Primary Coil */}
            <path d="M 80,60 C 70,60 70,70 80,70 C 70,70 70,80 80,80 C 70,80 70,90 80,90 C 70,90 70,100 80,100" fill="none" stroke={strokeColor} strokeWidth="2" transform="translate(0, 10)"/>
            <line x1="80" y1="70" x2="20" y2="70" stroke={strokeColor} strokeWidth="2" />
            <line x1="80" y1="110" x2="20" y2="110" stroke={strokeColor} strokeWidth="2" />
            <circle cx="20" cy="70" r="4" fill="none" stroke={strokeColor} strokeWidth="2" />
            <circle cx="20" cy="110" r="4" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* Core */}
            <line x1="95" y1="60" x2="95" y2="120" stroke={secondaryColor} strokeWidth="2" />
            <line x1="100" y1="60" x2="100" y2="120" stroke={secondaryColor} strokeWidth="2" />

            {/* Secondary Coil */}
            <path d="M 115,60 C 125,60 125,70 115,70 C 125,70 125,80 115,80 C 125,80 125,90 115,90 C 125,90 125,100 115,100" fill="none" stroke={strokeColor} strokeWidth="2" transform="translate(0, 10)"/>
            
            <text x="100" y="45" fill={secondaryColor} fontSize="12" textAnchor="middle">Transformer</text>
        </g>


        {/* --- 2. The Diode Bridge --- */}
        <g transform="translate(200, 90)">
            {/* Diamond connections */}
            <line x1="0" y1="-50" x2="50" y2="0" stroke={strokeColor} strokeWidth="2" />
            <line x1="50" y1="0" x2="0" y2="50" stroke={strokeColor} strokeWidth="2" />
            <line x1="0" y1="50" x2="-50" y2="0" stroke={strokeColor} strokeWidth="2" />
            <line x1="-50" y1="0" x2="0" y2="-50" stroke={strokeColor} strokeWidth="2" />

            {/* Diodes */}
            {/* D1 (Top Right) -> Points Down-Right */}
            <DiodeSymbol x={25} y={-25} rotation={45} />
            <text x={40} y={-35} fill={secondaryColor} fontSize="12">D1</text>

            {/* D2 (Bottom Right) -> Points Down-Right */}
            <DiodeSymbol x={25} y={25} rotation={45} />
            <text x={40} y={35} fill={secondaryColor} fontSize="12">D2</text>

            {/* D3 (Bottom Left) -> Points Down-Right */}
            <DiodeSymbol x={-25} y={25} rotation={45} />
            <text x={-45} y={35} fill={secondaryColor} fontSize="12">D3</text>

            {/* D4 (Top Left) -> Points Down-Right */}
            <DiodeSymbol x={-25} y={-25} rotation={45} />
            <text x={-45} y={-35} fill={secondaryColor} fontSize="12">D4</text>

            {/* Connection dots */}
            <circle cx="0" cy="-50" r="3" fill={strokeColor} /> {/* Top (DC+) */}
            <circle cx="0" cy="50" r="3" fill={strokeColor} />  {/* Bottom (DC-) */}
            <circle cx="-50" cy="0" r="3" fill={strokeColor} /> {/* Left (AC) */}
            <circle cx="50" cy="0" r="3" fill={strokeColor} />  {/* Right (AC) */}
        </g>


        {/* --- 3. Connections Transformer to Bridge --- */}
        {/* Top Secondary to Left Bridge */}
        <line x1="115" y1="70" x2="150" y2="70" stroke={strokeColor} strokeWidth="2" />
        <line x1="150" y1="70" x2="150" y2="90" stroke={strokeColor} strokeWidth="2" />

        {/* Bottom Secondary to Right Bridge */}
        <line x1="115" y1="110" x2="250" y2="110" stroke={strokeColor} strokeWidth="2" />
        <line x1="250" y1="110" x2="250" y2="90" stroke={strokeColor} strokeWidth="2" />


        {/* --- 4. Output Stage (Filter & Load) --- */}
        {/* Top Rail (DC+) */}
        <line x1="200" y1="40" x2="450" y2="40" stroke={strokeColor} strokeWidth="2" />
        <text x="460" y="45" fill={highlightColor} fontSize="14" fontWeight="bold">+ V_out</text>

        {/* Bottom Rail (DC-) */}
        <line x1="200" y1="140" x2="450" y2="140" stroke={strokeColor} strokeWidth="2" />
        <text x="460" y="145" fill={secondaryColor} fontSize="14" fontWeight="bold">- Gnd</text>

        {/* Filter Capacitor (Parallel) */}
        <line x1="320" y1="40" x2="320" y2="75" stroke={strokeColor} strokeWidth="2" />
        <CapSymbol x={320} y={90} />
        <line x1="320" y1="105" x2="320" y2="140" stroke={strokeColor} strokeWidth="2" />
        <text x="340" y="95" fill={secondaryColor} fontSize="12">C_filter</text>
        <circle cx="320" cy="40" r="3" fill={strokeColor} />
        <circle cx="320" cy="140" r="3" fill={strokeColor} />

        {/* Load Resistor (Parallel) */}
        <line x1="400" y1="40" x2="400" y2="75" stroke={strokeColor} strokeWidth="2" />
        <ResistorSymbol x={400} y={90} />
        <line x1="400" y1="105" x2="400" y2="140" stroke={strokeColor} strokeWidth="2" />
        <text x="420" y="95" fill={secondaryColor} fontSize="12">Load</text>
        <circle cx="400" cy="40" r="3" fill={strokeColor} />
        <circle cx="400" cy="140" r="3" fill={strokeColor} />

      </svg>
    </div>
  );
}