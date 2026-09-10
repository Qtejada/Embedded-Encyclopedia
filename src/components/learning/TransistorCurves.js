import React from 'react';
import {Figure, accent, secondary} from './LearningTools';
export default function TransistorCurves({kind='mosfet'}) {
 const mos=kind==='mosfet';
 const colors=[accent,secondary,'currentColor'];
 return <Figure title={mos?'MOSFET output characteristic family':'BJT output characteristic family'} description={mos?'Three illustrative drain-current curves increase in the linear region and flatten in saturation as drain voltage increases. Higher gate voltage produces more current.':'Three illustrative collector-current curves show a low-voltage knee followed by a nearly constant active-region current. Higher base current produces more collector current.'} height={295} dense>
  <WireAxes/>
  {[1,2,3].map((n)=>{const values=Array.from({length:181},(_,i)=>{const v=i/180*5;const current=mos?(v<n?n*v-v*v/2:n*n/2):n*(1-Math.exp(-v/.12))*(1+v/80);return `${65+v*94},${240-current*39}`;}).join(' ');
  return <g key={n}><polyline points={values} fill="none" stroke={colors[n-1]} strokeWidth="2.5"/><text x={345} y={mos?230-(n*n/2)*39:228-n*1.06*39}>{mos?`VGS = ${n+1} V`:`IB = ${n*10} µA`}</text></g>;})}
  <text x={8} y={25}>{mos?'ID':'IC'} (mA)</text><text x={65} y={264}>0</text><text x={525} y={264}>5 V</text><text x={300} y={290} textAnchor="middle">{mos?'Drain-to-source voltage':'Collector-to-emitter voltage'}</text>
 </Figure>;
}
function WireAxes(){return <path d="M65 30V240H550" stroke="currentColor" fill="none"/>;}
