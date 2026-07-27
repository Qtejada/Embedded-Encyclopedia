import React, { useState } from 'react';

export default function MosfetCalc() {
  const [vth, setVth] = useState(2.0);
  const [vgs, setVgs] = useState(1.0);
  const [vds, setVds] = useState(5.0);

  let region = "";
  let statusColor = "#e9ecef";
  let desc = "";

  if (vgs <= vth) {
    region = "CUTOFF";
    desc = `VGS (${vgs.toFixed(1)} V) ≤ Vth (${vth.toFixed(1)} V). The channel is off.`;
    statusColor = "#343a40";
  } else if (vds < (vgs - vth)) {
    region = "OHMIC (LINEAR)";
    desc = "VDS is less than VGS − Vth. The MOSFET operates as a voltage-controlled resistor.";
    statusColor = "#1b5e20";
  } else {
    region = "SATURATION";
    desc = "VDS is at least VGS − Vth. The MOSFET operates in the constant-current amplifier region.";
    statusColor = "#e03131";
  }

  return (
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      background: 'var(--ifm-background-surface-color)'
    }}>
      <h3 style={{color: 'var(--ifm-color-primary)'}}>
        N-channel MOSFET operating-region explorer
      </h3>

      <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
        <label>
          Threshold (V<sub>th</sub>): <strong>{vth.toFixed(1)} V</strong>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={vth}
            onChange={(e) => setVth(Number(e.target.value))}
            style={{width: '100%'}}
          />
        </label>

        <label>
          Gate-source voltage (V<sub>GS</sub>): <strong>{vgs.toFixed(1)} V</strong>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={vgs}
            onChange={(e) => setVgs(Number(e.target.value))}
            style={{width: '100%'}}
          />
        </label>

        <label>
          Drain-source voltage (V<sub>DS</sub>): <strong>{vds.toFixed(1)} V</strong>
          <input
            type="range"
            min="0"
            max="12"
            step="0.1"
            value={vds}
            onChange={(e) => setVds(Number(e.target.value))}
            style={{width: '100%'}}
          />
        </label>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '15px',
        backgroundColor: statusColor,
        color: 'white',
        borderRadius: '4px',
        fontWeight: 'bold'
      }} aria-live="polite">
        {region}
      </div>

      <p style={{textAlign: 'center', marginTop: '10px', fontStyle: 'italic'}}>
        {desc}
      </p>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--ifm-color-emphasis-700)',
        marginBottom: 0
      }}>
        This explorer uses the ideal long-channel region boundaries.
      </p>
    </div>
  );
}
