import React, { useState } from 'react';

export default function MosfetCalc() {
  // 1. Define State (The Variables)
  const [vth, setVth] = useState(2.0);
  const [vgs, setVgs] = useState(1.0);
  const [vds, setVds] = useState(5.0); // <--- Variable for Slider 3

  // 2. Logic
  let region = "";
  let statusColor = "#e9ecef";
  let desc = "";

  if (vgs < vth) {
      region = "CUTOFF";
      desc = `Vgs (${vgs}V) < Vth. Channel is closed.`;
      statusColor = "#343a40"; 
  } else if (vds < (vgs - vth)) {
      region = "OHMIC (LINEAR)";
      desc = "Mosfet acting like a resistor.";
      statusColor = "#2f9e44"; 
  } else {
      region = "SATURATION";
      desc = "Current is constant (Amplifier region).";
      statusColor = "#e03131"; 
  }

  // 3. The UI
  return (
    <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '20px', margin: '20px 0'}}>
      <h3>🎛️ Interactive Region Explorer</h3>
      
      <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
        
        {/* SLIDER 1: Vth */}
        <label>
          Threshold (Vth): <strong>{vth}V</strong>
          <input type="range" min="0.5" max="5" step="0.1" 
                 value={vth} 
                 onChange={(e) => setVth(Number(e.target.value))} 
                 style={{width: '100%'}}/>
        </label>
        
        {/* SLIDER 2: Vgs */}
        <label>
          Gate-Source (Vgs): <strong>{vgs}V</strong>
          <input type="range" min="0" max="10" step="0.1" 
                 value={vgs} 
                 onChange={(e) => setVgs(Number(e.target.value))} 
                 style={{width: '100%'}}/>
        </label>
        
        {/* SLIDER 3: Vds (Double Check this section!) */}
        <label>
          Drain-Source (Vds): <strong>{vds}V</strong>
          <input type="range" min="0" max="12" step="0.1" 
                 value={vds}  
                 onChange={(e) => setVds(Number(e.target.value))} 
                 style={{width: '100%'}}/>
        </label>

      </div>

      <div style={{textAlign: 'center', padding: '15px', backgroundColor: statusColor, color: 'white', borderRadius: '4px', fontWeight: 'bold'}}>
        {region}
      </div>
      <p style={{textAlign: 'center', marginTop: '10px', fontStyle: 'italic'}}>{desc}</p>
    </div>
  );
}