import React, { useState, useEffect, useRef } from 'react';

export default function InductorFlybackAnim() {
  const [switchClosed, setSwitchClosed] = useState(false);
  const switchRef = useRef(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    switchRef.current = switchClosed;
  }, [switchClosed]);

  // Helper to safely get theme variables
  const getThemeColor = (varName, fallback) => {
    if (typeof window !== 'undefined') {
      const val = getComputedStyle(document.body).getPropertyValue(varName).trim();
      return val || fallback;
    }
    return fallback;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // --- PHYSICS STATE (KEPT EXACTLY AS YOU PROVIDED) ---
    let current = 0;        
    let voltageDisplay = 0; 
    let spikeTimer = 0;     
    const SPIKE_DURATION = 180; 
    let flowOffset = 0;     

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // --- THEME ADAPTATION (FIXED) ---
      // We grab the current theme colors every frame so it responds to the toggle
      const themeBg = getThemeColor('--ifm-background-surface-color', '#ffffff');
      const themeText = getThemeColor('--ifm-font-color-base', '#333333');
      const themePrimary = getThemeColor('--ifm-color-primary', '#2b8a3e');
      
      // Colors mapped to Theme
      const cBg = themeBg;           // Canvas Background matches site
      const cWire = themeText;       // Wires match text color
      const cActive = themePrimary;  // Charging color matches theme accent
      
      const cSpark = '#ea580c';     // Orange Spark
      const cMeterBg = '#0f172a';   // Meter always dark slate
      const cMeterText = '#f1f5f9'; // Meter text always light

      const isSwitchClosed = switchRef.current;

      // Clear background with THEME color
      ctx.fillStyle = cBg;
      ctx.fillRect(0, 0, width, height);
      
      // --- PHYSICS LOOP (UNCHANGED) ---
      if (isSwitchClosed) {
        if (current < 1.0) current += 0.015;
        spikeTimer = 0;
        voltageDisplay = 0; 
      } else {
        if (current > 0.05 && spikeTimer === 0) {
            spikeTimer = SPIKE_DURATION; 
        }
        
        if (spikeTimer > 0) {
            current *= 0.985;
            spikeTimer--;
            const noise = (Math.random() * 200);
            voltageDisplay = -(current * 3000) - noise;
        } else {
            current = 0;
            voltageDisplay = 12; 
        }
      }

      // --- LAYOUT ---
      const cx = width / 2;
      const cy = height / 2 + 30; 
      const scale = 1.0; 
      
      const circuitW = 400 * scale; 
      const leftX = cx - (circuitW / 2);
      const rightX = cx + (circuitW / 2);
      const topY = cy - (50 * scale);
      const bottomY = cy + (50 * scale);
      
      const switchStart = leftX + (80 * scale);
      const switchEnd = leftX + (180 * scale);
      const inductorStart = switchEnd + (40 * scale);
      
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // --- 1. DRAW LCD METER ---
      ctx.save();
      const meterW = 200;
      const meterH = 70;
      const meterX = cx - meterW / 2;
      const meterY = 30; 

      // Bezel
      ctx.fillStyle = "#334155"; // Slate 700
      ctx.beginPath();
      ctx.roundRect(meterX - 5, meterY - 5, meterW + 10, meterH + 10, 8);
      ctx.fill();

      // Screen Background
      ctx.fillStyle = spikeTimer > 0 ? "#450a0a" : "#022c22"; // Red or Green tinted background
      if (spikeTimer === 0 && !isSwitchClosed) ctx.fillStyle = "#1e293b"; // Idle Dark

      ctx.beginPath();
      ctx.roundRect(meterX, meterY, meterW, meterH, 4);
      ctx.fill();
      
      // Screen Inner Shadow
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 32px monospace";
      
      if (spikeTimer > 0) {
          ctx.fillStyle = "#f87171"; // Light Red LED
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 10;
          ctx.fillText(`${voltageDisplay.toFixed(0)} V`, cx, meterY + 25);
          
          ctx.font = "bold 12px sans-serif";
          ctx.shadowBlur = 0;
          ctx.fillText("⚠ HIGH VOLTAGE SURGE", cx, meterY + 52);
      } else if (isSwitchClosed) {
          ctx.fillStyle = "#34d399"; // Light Green LED
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
          ctx.fillText("0.0 V", cx, meterY + 25);
          
          ctx.font = "bold 12px sans-serif";
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#64748b";
          ctx.fillText("SHORT CIRCUIT (IDEAL)", cx, meterY + 52);
      } else {
          ctx.fillStyle = "#94a3b8"; // Dim Gray
          ctx.shadowBlur = 0;
          ctx.fillText("12.0 V", cx, meterY + 25);
           ctx.font = "bold 14px sans-serif";
          ctx.fillText("SOURCE VOLTAGE", cx, meterY + 52);
      }
      ctx.restore();


      // --- 2. DRAW CIRCUIT LINES ---
      ctx.lineWidth = 4;
      ctx.strokeStyle = cWire;

      // Source Circle
      ctx.beginPath();
      ctx.arc(leftX, cy, 25 * scale, 0, Math.PI*2);
      ctx.stroke();
      
      // DC Label
      ctx.fillStyle = cWire;
      ctx.font = `bold ${14 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("DC", leftX, cy);

      // Top Rail
      ctx.beginPath();
      ctx.moveTo(leftX, cy - (25 * scale)); 
      ctx.lineTo(leftX, topY);
      ctx.lineTo(switchStart, topY);
      ctx.stroke();

      // SWITCH ARM
      ctx.beginPath();
      ctx.moveTo(switchStart, topY);
      if (isSwitchClosed) {
          ctx.lineTo(switchEnd, topY);
      } else {
          ctx.lineTo(switchEnd - (10*scale), topY - (35*scale)); 
      }
      ctx.stroke();

      // Switch Contacts
      ctx.fillStyle = cBg; 
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(switchStart, topY, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(switchEnd, topY, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();

      // Middle Rail
      ctx.beginPath();
      ctx.moveTo(switchEnd, topY);
      ctx.lineTo(inductorStart, topY);
      ctx.stroke();

      // --- ARC ---
      if (spikeTimer > 0) {
          ctx.save();
          const intensity = current; 
          ctx.strokeStyle = cSpark;
          ctx.lineWidth = 2 + (intensity * 2);
          
          ctx.beginPath();
          ctx.moveTo(switchStart, topY);
          
          const targetX = switchEnd - (10*scale);
          const targetY = topY - (35*scale);
          const steps = 6;
          
          for(let i=1; i<=steps; i++) {
              const t = i/steps;
              const tx = switchStart + (targetX - switchStart) * t;
              const ty = topY + (targetY - topY) * t;
              const jit = (Math.random() - 0.5) * (25 * intensity);
              ctx.lineTo(tx + jit, ty + jit);
          }
          ctx.stroke();
          ctx.restore();
      }

      // --- INDUCTOR ---
      const loopRadius = 12 * scale;
      const loops = 4;
      const coilW = loopRadius * 2 * loops;
      
      // Field
      if (current > 0.05) {
          ctx.save();
          ctx.strokeStyle = isSwitchClosed ? cActive : cSpark;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.ellipse(inductorStart + (coilW/2), topY, coilW*0.8, 30*scale, 0, 0, Math.PI*2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(inductorStart + (coilW/2), topY, coilW*1.0, 45*scale, 0, 0, Math.PI*2);
          ctx.stroke();
          ctx.restore();
      }

      // Coil Wires
      ctx.lineWidth = 4;
      ctx.strokeStyle = cWire;
      ctx.beginPath();
      for (let i = 0; i < loops; i++) {
          const lx = inductorStart + (i * loopRadius * 2);
          ctx.arc(lx + loopRadius, topY, loopRadius, Math.PI, 0);
      }
      ctx.stroke();

      // Return Path
      ctx.beginPath();
      const coilEnd = inductorStart + coilW;
      ctx.moveTo(coilEnd, topY);
      ctx.lineTo(rightX, topY);
      ctx.lineTo(rightX, bottomY);
      ctx.lineTo(leftX, bottomY);
      ctx.lineTo(leftX, cy + (25 * scale)); 
      ctx.stroke();

      // --- PARTICLES ---
      if (current > 0.05) {
          flowOffset += (current * 5.0); 
          ctx.fillStyle = spikeTimer > 0 ? cSpark : cActive;
          
          const totalDist = 900 * scale; 
          
          for(let i=0; i<12; i++) {
              let d = (i * (totalDist/12) + flowOffset) % totalDist;
              
              let px=0, py=0;
              let visible = true;
              
              if (d < 250*scale) {
                  const t = d / (250*scale);
                  px = leftX + (switchStart - leftX) * t;
                  py = topY;
              }
              else if (d < 350*scale) {
                  if (!isSwitchClosed && !spikeTimer) visible = false;
                  const t = (d - 250*scale) / (100*scale);
                  px = switchStart + (switchEnd - switchStart) * t;
                  py = topY;
                  if (spikeTimer > 0) {
                       py -= (35*scale) * t; 
                       py += (Math.random()-0.5)*10;
                  }
              }
              else if (d < 600*scale) {
                  const t = (d - 350*scale) / (250*scale);
                  px = switchEnd + (rightX - switchEnd) * t;
                  py = topY;
              }
              else {
                  const rem = d - 600*scale;
                  const totalReturn = 300*scale;
                  const t = rem / totalReturn;
                  
                  if (t < 0.2) { 
                      px = rightX; 
                      py = topY + (bottomY-topY)*(t/0.2);
                  } else if (t < 0.8) { 
                      px = rightX - (rightX-leftX)*((t-0.2)/0.6);
                      py = bottomY;
                  } else { 
                      px = leftX; 
                      py = bottomY - (bottomY-cy)*((t-0.8)/0.2);
                  }
              }

              if (visible) {
                  ctx.beginPath();
                  ctx.arc(px, py, 3, 0, Math.PI*2);
                  ctx.fill();
              }
          }
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };
    
    draw();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, []); 

  // --- STYLES (Replaced Tailwind with Standard JS) ---
  const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--ifm-background-surface-color)', // Adapts to theme
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto'
  };

  const titleStyle = {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: 'var(--ifm-color-emphasis-700)',
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
  };

  const canvasContainerStyle = {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--ifm-color-emphasis-200)',
      backgroundColor: 'var(--ifm-background-surface-color)',
      marginBottom: '1.5rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
  };

  // Button styles switch based on state
  const buttonStyle = {
      width: '100%',
      maxWidth: '300px',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.1s ease',
      border: 'none',
      borderBottom: switchClosed ? 'none' : '4px solid rgba(0,0,0,0.2)', // 3D lip effect
      transform: switchClosed ? 'translateY(4px)' : 'translateY(0)',
      backgroundColor: switchClosed ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
      color: switchClosed ? '#ffffff' : 'var(--ifm-color-emphasis-700)',
      boxShadow: switchClosed ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Inductive Flyback Demonstration
      </h3>

      <div style={canvasContainerStyle}>
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={320}
            style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
        />
      </div>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
        <button 
            onMouseDown={() => setSwitchClosed(true)}
            onMouseUp={() => setSwitchClosed(false)}
            onMouseLeave={() => setSwitchClosed(false)}
            onTouchStart={(e) => { e.preventDefault(); setSwitchClosed(true); }}
            onTouchEnd={(e) => { e.preventDefault(); setSwitchClosed(false); }}
            style={buttonStyle}
        >
            {switchClosed ? "⚡ CHARGING ⚡" : "HOLD TO CHARGE"}
        </button>
      </div>
      
      <p style={{marginTop: '10px', fontStyle: 'italic', color: 'var(--ifm-color-emphasis-600)', textAlign: 'center'}}>
         Hold to build field. Release to see the <strong style={{color: '#fa5252'}}>High Voltage Spike</strong>.
      </p>

    </div>
  );
}