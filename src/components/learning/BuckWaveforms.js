import React, {useState} from 'react';
import {Tool, Controls, Range, Figure, Results, Note, accent, secondary} from './LearningTools';
import {buckPoint} from './interviewModels.mjs';
export default function BuckWaveforms() {
  const [duty,setDuty]=useState(40);
  const d=duty/100;
  const rows=[['Upper gate command',p=>p.on?1:0,0,1],['Switch node / Vin',p=>p.switchNode,0,1],
    ['Inductor voltage / Vin',p=>p.inductorVoltage,-1,1],['Inductor current (A)',p=>p.inductorCurrent,1,3],
    ['Capacitor current (A)',p=>p.capacitorCurrent,-1,1],['Capacitor voltage ripple',p=>p.capacitorVoltage,-.25,.25]];
  return <Tool title="Buck switching waveforms">
    <Controls><Range label="Duty cycle" value={duty} set={setDuty} min={20} max={80} unit="%"/></Controls>
    <Figure title="Buck waveforms over two periods" description="The upper switch drives inductor current upward. The lower switch drives it downward. Capacitor voltage follows the integral of capacitor current." height={570} dense>
      {rows.map(([label,fn,min,max],j)=>{const top=35+j*85, y=v=>top+48-(v-min)/(max-min)*48;
        const points=Array.from({length:601},(_,i)=>`${185+i*.66},${y(fn(buckPoint(i/300,d)))}`).join(' ');
        return <g key={label}><text x={5} y={top+9} style={{fontSize:13}}>{label}</text>
          <path d={`M185 ${y(0)}H582`} stroke="currentColor" opacity=".25" fill="none"/>
          {[0,1].map(n=><rect key={n} x={185+n*198} y={top-8} width={d*198} height={64} fill={accent} opacity=".06"/>)}
          <polyline points={points} stroke={j===5?secondary:accent} strokeWidth="2" fill="none"/></g>;})}
      <text x={185} y={562}>0</text><text x={383} y={562}>T</text><text x={575} y={562}>2T</text>
    </Figure>
    <Results><p>Ideal output: <strong>{d.toFixed(2)} × Vin</strong></p><p>Mean load current: <strong>2 A</strong></p></Results>
    <Note>Shading marks upper-switch conduction. Current ripple is fixed at 1.6 A peak to peak to compare shapes. Capacitor voltage uses a normalized scale.</Note>
  </Tool>;
}
