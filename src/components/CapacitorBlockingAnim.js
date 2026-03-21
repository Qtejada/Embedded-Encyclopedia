import React, { useState, useEffect, useRef } from 'react';

export default function CapacitorBlockingAnim() {
  const [mode, setMode] = useState('DC'); // 'DC' or 'AC'
  const canvasRef = useRef(null);
  
  const getThemeColor = (varName) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.body).getPropertyValue(varName).trim();
    }
    return '#333';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // We maintain time in a ref so it doesn't reset on re-renders
    let time = 0;
    
    // Electron particles (fixed starting relative positions 0.0 to 1.0)
    const electrons = Array.from({ length: 12 }, (_, i) => i * (1/12));

    const draw = () => {
      // 1. SPEED CONTROL (The "Global Clock")
      // At 60FPS, adding 0.02 per frame means ~1.2 units per second.
      // Since the charging curve takes ~5.0 units to complete, 
      // 5.0 / 1.2 = ~4.1 seconds to full charge.
      time += 0.02; 
      
      const colorWire = getThemeColor('--ifm-font-color-base');
      const colorPrimary = getThemeColor('--ifm-color-primary'); 
      const colorRed = '#fa5252';  
      const colorBlue = '#4dabf7'; 

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const capX = width / 2;
      const plateGap = 30;
      const plateH = 70;

      ctx.clearRect(0, 0, width, height);

      // --- 2. Calculate Physics ---
      let plateCharge = 0; 
      let moveOffset = 0; // This determines dot position

      if (mode === 'DC') {
        // --- DC LOOP LOGIC ---
        // Cycle Length: 10.0 units (approx 8 seconds total loop)
        // Charge Phase: 0 to 5.0 (takes ~4 seconds)
        // Hold Phase: 5.0 to 10.0 (stays full)
        const cycleLength = 10.0;
        
        if (time > cycleLength) {
            time = 0; // Reset loop
        }

        // Clamp logic: Stop calculating charge curve after t=5.0
        const t = Math.min(time, 5.0); 
        
        // Curve: 1 - e^(-t)
        const curve = 1 - Math.exp(-t); 
        plateCharge = curve;

        // Visual Movement: 
        // We reduced the multiplier from 3.0 to 2.0.
        // This means the dots travel less total distance over the 4 seconds.
        // Result: Slower, lazier movement.
        moveOffset = curve * 2.0; 

      } else {
        // AC: Sine wave
        // Slower frequency (time * 0.4 instead of 0.5)
        plateCharge = Math.sin(time * 0.4);
        moveOffset = Math.sin(time * 0.4) * 0.4;
      }

      // --- 3. Draw Wires ---
      ctx.beginPath();
      ctx.strokeStyle = colorWire;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      
      const wireLeftEnd = capX - plateGap/2;
      const wireRightStart = capX + plateGap/2;

      // Left Wire
      ctx.moveTo(60, centerY);
      ctx.lineTo(wireLeftEnd, centerY);
      // Right Wire
      ctx.moveTo(wireRightStart, centerY);
      ctx.lineTo(width - 60, centerY);
      ctx.stroke();

      // --- 4. Draw Capacitor Plates ---
      const drawPlate = (x, charge) => {
        ctx.fillStyle = colorWire;
        // Metal Plate
        ctx.fillRect(x - 3, centerY - plateH/2, 6, plateH);
        
        // Charge Glow
        if (Math.abs(charge) > 0.05) {
            const glowColor = charge > 0 ? colorRed : colorBlue;
            ctx.fillStyle = glowColor;
            ctx.globalAlpha = Math.abs(charge);
            ctx.fillRect(x - 6, centerY - plateH/2 - 2, 12, plateH + 4);
            
            // Symbols
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(charge > 0 ? "+" : "-", x, centerY - plateH/2 - 8);
            ctx.fillText(charge > 0 ? "+" : "-", x, centerY + plateH/2 + 20);
        }
        ctx.globalAlpha = 1.0;
      };

      drawPlate(wireLeftEnd, plateCharge);
      drawPlate(wireRightStart, -plateCharge);

      // --- 5. Draw Electrons ---
      ctx.fillStyle = colorPrimary;
      
      electrons.forEach((basePos) => {
        // Position = Base + Offset (looped 0..1)
        let pos = (basePos + moveOffset) % 1;
        if (pos < 0) pos += 1;

        // Map 0..1 to Screen X
        const totalSpan = width - 120; 
        const relativeX = pos * totalSpan + 60;

        // Masking: Check if the dot is inside the gap
        const gapBuffer = 5; 
        const inGap = (relativeX > wireLeftEnd - gapBuffer) && (relativeX < wireRightStart + gapBuffer);

        if (!inGap) {
             ctx.beginPath();
             ctx.arc(relativeX, centerY, 4, 0, Math.PI * 2);
             ctx.fill();
        }
      });

      // --- 6. Draw Source Symbol ---
      ctx.fillStyle = colorWire;
      ctx.beginPath();
      ctx.arc(40, centerY, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(mode === 'DC' ? "DC" : "~", 40, centerY);

      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    draw();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [mode]);

  return (
    <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', boxShadow: 'var(--shadow)' }}>
      <div style={{marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
        <button 
            onClick={() => setMode('DC')}
            style={{
                padding: '8px 20px', borderRadius: '20px', border: '2px solid var(--ifm-color-primary)', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                backgroundColor: mode === 'DC' ? 'var(--ifm-color-primary)' : 'transparent',
                color: mode === 'DC' ? '#000' : 'var(--ifm-color-primary)'
            }}
        >
            DC Step (Loop)
        </button>
        <button 
            onClick={() => setMode('AC')}
            style={{
                padding: '8px 20px', borderRadius: '20px', border: '2px solid var(--ifm-color-primary)', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                backgroundColor: mode === 'AC' ? 'var(--ifm-color-primary)' : 'transparent',
                color: mode === 'AC' ? '#000' : 'var(--ifm-color-primary)'
            }}
        >
            AC Sine (Pass)
        </button>
      </div>
      
      <canvas ref={canvasRef} width={500} height={120} style={{maxWidth: '100%', borderRadius: '4px'}} />
      
      <p style={{fontSize: '0.9rem', fontStyle: 'italic', marginTop: '10px', color: 'var(--ifm-color-emphasis-700)'}}>
        {mode === 'DC' 
            ? "DC: Current flows slowly to charge plates. Once charged, current stops." 
            : "AC: Voltage flips direction constantly. Current flows back and forth."}
      </p>
    </div>
  );
}