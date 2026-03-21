import React, { useState } from 'react';

export default function VoltageDivider() {
  const [vin, setVin] = useState(5);
  const [rSource, setRSource] = useState(10); // 10 Ohms
  const [rLoad, setRLoad] = useState(1000);   // 1k Ohms

  // Calculate Vout
  const vOut = vin * (rLoad / (rSource + rLoad));
  // Calculate Efficiency / Loss
  const drop = vin - vOut;
  const efficiency = (vOut / vin) * 100;

  return (
    <div style={{ 
      border: '1px solid var(--ifm-color-emphasis-300)', 
      padding: '20px', 
      borderRadius: '8px',
      background: 'var(--ifm-background-surface-color)',
      margin: '20px 0'
    }}>
      <h4 style={{color: 'var(--ifm-color-primary)', textTransform: 'uppercase', marginBottom: '15px'}}>
        Simulation: Source Loading Effect
      </h4>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
        
        {/* Inputs */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{display: 'block', marginBottom: '10px'}}>
            <strong>Source Voltage (Vin):</strong> {vin}V
            <input type="range" min="1" max="24" value={vin} onChange={e => setVin(Number(e.target.value))} style={{width: '100%'}} />
          </label>

          <label style={{display: 'block', marginBottom: '10px'}}>
            <strong>Source Resistance (R<sub>s</sub>):</strong> {rSource}Ω
            <br/><small>Internal resistance of the supply</small>
            <input type="range" min="0" max="1000" step="10" value={rSource} onChange={e => setRSource(Number(e.target.value))} style={{width: '100%'}} />
          </label>

          <label style={{display: 'block', marginBottom: '10px'}}>
            <strong>Load Resistance (R<sub>L</sub>):</strong> {rLoad}Ω
            <br/><small>The circuit you are powering</small>
            <input type="range" min="10" max="2000" step="10" value={rLoad} onChange={e => setRLoad(Number(e.target.value))} style={{width: '100%'}} />
          </label>
        </div>

        {/* Visual Output */}
        <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{fontSize: '2.5rem', fontWeight: '800', color: 'var(--ifm-color-primary)'}}>
            {vOut.toFixed(2)} V
          </div>
          <div style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>Actual Output Voltage</div>

          <div style={{marginTop: '20px', width: '100%', height: '20px', background: '#ddd', borderRadius: '10px', overflow: 'hidden'}}>
            <div style={{
                width: `${efficiency}%`, 
                height: '100%', 
                background: efficiency > 90 ? '#2b8a3e' : (efficiency > 50 ? '#fab005' : '#fa5252'),
                transition: 'width 0.3s'
            }} />
          </div>
          <div style={{fontSize: '0.8rem', marginTop: '5px'}}>
            {efficiency.toFixed(1)}% of voltage reaches load
          </div>
          
          {efficiency < 50 && (
            <div className="alert alert--danger" style={{marginTop: '15px', padding: '10px', fontSize: '0.8rem'}}>
              <strong>Warning:</strong> Source R is higher than Load R. Most voltage is lost inside the source!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}