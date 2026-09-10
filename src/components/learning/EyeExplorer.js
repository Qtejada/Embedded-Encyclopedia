import React, {useState} from 'react';
import {Tool, Controls, Range, Figure, Note, accent, secondary} from './LearningTools';
export default function EyeExplorer() {
  const [jitter,setJitter]=useState(10), [noise,setNoise]=useState(8);
  return <Tool title="Eye opening: timing and voltage">
    <Controls><Range label="Illustrated timing spread" value={jitter} set={setJitter} min={0} max={40} unit="% of interval"/>
      <Range label="Illustrated voltage spread" value={noise} set={setNoise} min={0} max={35} unit="% of swing"/></Controls>
    <Figure title="Illustrative eye diagram" description="Overlaid rising, falling, and constant levels surround a central test mask. More timing or voltage spread reduces the clear opening." height={290} dense>
      <path d="M55 25V250H570" stroke="currentColor" fill="none"/>
      {[0,1].flatMap(direction=>Array.from({length:14},(_,k)=>{
        const points=Array.from({length:151},(_,i)=>{const t=i/150*2;
          const shift=Math.sin(k*2.7)*jitter/100;
          const high=(Math.tanh((t-.5-shift)*15)-Math.tanh((t-1.5-shift)*15))/2;
          const level=direction?1-high:high;
          const v=level+noise/100*(.55*Math.sin(k*1.6)+.45*Math.sin(t*13+k));
          return `${60+t*250},${200-v*120}`;}).join(' ');
        return <polyline key={`${direction}-${k}`} points={points} fill="none" stroke={accent} opacity=".28"/>;
      }))}
      <path d="M230 140L270 105H350L390 140L350 175H270Z" fill={secondary} fillOpacity=".12" stroke={secondary} strokeDasharray="5 4"/>
      <text x={310} y={145} textAnchor="middle">Mask</text>
      <text x={60} y={275}>0 UI</text><text x={310} y={275} textAnchor="middle">1 UI</text><text x={560} y={275} textAnchor="end">2 UI</text>
    </Figure>
    <Note>UI means unit interval, or one symbol period. The mask and traces are illustrative. This tool does not calculate bit error rate or certify a link.</Note>
  </Tool>;
}
