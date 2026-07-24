import React, { useState } from 'react';

export default function BJTBasicActive() {
  // 1. State (The Knobs)
  const [vin, setVin] = useState(0.0);   // Input Voltage to Base
  const [vcc, setVcc] = useState(10.0);  // Collector Supply
  const [beta, setBeta] = useState(100); // Transistor Gain

  // Constants
  const V_BE = 0.7;
  const R_BASE = 10000; // 10k Base Resistor
  const R_COLL = 1000;  // 1k Collector Resistor

  // 2. The Physics Math
  // Step A: Calculate Base Current
  let ib = 0;
  if (vin > V_BE) {
    ib = (vin - V_BE) / R_BASE; // Amps
  }

  // Step B: Calculate Ideal Collector Current (Infinite supply)
  const ic_ideal = ib * beta;

  // Step C: Calculate Max Possible Current (Saturation Limit)
  const V_CE_SAT = 0.1;
  const ic_max = Math.max(0, (vcc - V_CE_SAT) / R_COLL);

  // Step D: Determine Region & Real Values
  let ic = 0;
  let vce = vcc;
  let region = "CUTOFF";
  let statusColor = "#e9ecef"; // Grey
  let desc = "Base voltage is too low to forward bias the base-emitter junction.";

  if (vin <= V_BE) {
    // CUTOFF
    region = "CUTOFF";
    statusColor = "#343a40"; // Dark Grey
    ic = 0;
    vce = vcc;
    desc = `Vin (${vin.toFixed(1)} V) < 0.7 V. The switch is open.`;
  } 
  else if (ic_ideal < ic_max) {
    // ACTIVE
    region = "ACTIVE MODE";
    statusColor = "#2b8a3e"; // Green
    ic = ic_ideal;
    vce = vcc - (ic * R_COLL);
    desc = `IC = β × IB. Collector current increases with base drive.`;
  } 
  else {
    // SATURATION
    region = "SATURATION";
    statusColor = "#e03131"; // Red
    ic = ic_max; // Clamped
    vce = V_CE_SAT;
    desc = `The switch is closed. The 1 kΩ resistor limits collector current. More base drive does not increase it.`;
  }

  // Helper for unit display
  const tomA = (val) => (val * 1000).toFixed(2);

  // 3. The UI
  return (
    <div style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '25px', margin: '30px 0', background: 'var(--ifm-background-surface-color)'}}>
      <h4 style={{textTransform: 'uppercase', color: 'var(--ifm-color-primary)', marginBottom: '20px', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px'}}>
        BJT operating-region explorer (NPN)
      </h4>
      
      <div style={{display: 'grid', gap: '20px', marginBottom: '25px'}}>
        
        {/* CONTROL 1: INPUT VOLTAGE */}
        <label>
          <strong>Base Drive (V<sub>in</sub>):</strong> {vin.toFixed(1)} V
          <input type="range" min="0" max="5" step="0.1" 
                 value={vin} onChange={(e) => setVin(Number(e.target.value))} 
                 style={{width: '100%', accentColor: 'var(--ifm-color-primary)'}}/>
        </label>

        {/* CONTROL 2: SUPPLY VOLTAGE */}
        <label>
          <strong>Supply (V<sub>CC</sub>):</strong> {vcc.toFixed(1)} V
          <input type="range" min="1" max="20" step="0.5" 
                 value={vcc} onChange={(e) => setVcc(Number(e.target.value))} 
                 style={{width: '100%', accentColor: 'var(--ifm-color-primary)'}}/>
        </label>

        {/* CONTROL 3: BETA */}
        <label>
          <strong>Gain (β):</strong> {beta}
          <input type="range" min="50" max="300" step="10" 
                 value={beta} onChange={(e) => setBeta(Number(e.target.value))} 
                 style={{width: '100%', accentColor: 'var(--ifm-color-primary)'}}/>
        </label>

      </div>

      {/* RESULTS DASHBOARD */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem'}}>
        <div style={{background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '4px'}}>
            <strong>I<sub>B</sub></strong><br/>{tomA(ib)} mA
        </div>
        <div style={{background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '4px'}}>
            <strong>I<sub>C</sub></strong><br/>{tomA(ic)} mA
        </div>
        <div style={{background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '4px'}}>
            <strong>V<sub>CE</sub></strong><br/>{vce.toFixed(2)} V
        </div>
      </div>

      {/* REGION STATUS */}
      <div style={{
          textAlign: 'center', 
          padding: '15px', 
          backgroundColor: statusColor, 
          color: '#fff', 
          borderRadius: '6px', 
          fontWeight: '800',
          letterSpacing: '1px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {region}
      </div>
      <p style={{textAlign: 'center', marginTop: '15px', fontStyle: 'italic', color: 'var(--ifm-color-emphasis-700)'}}>
        {desc}
      </p>
    </div>
  );
}
