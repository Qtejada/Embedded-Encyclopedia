import React from 'react';
import {Figure} from './LearningTools';
function R({x,y,label}) {return <g><path d={`M${x} ${y}h10l5 -9l10 18l10 -18l10 18l5 -9h10`} fill="none" stroke="currentColor" strokeWidth="2"/><text x={x+30} y={y-22} textAnchor="middle">{label}</text></g>;}
function C({x,y,label}) {return <g><path d={`M${x} ${y}h24m0 -14v28m12 -28v28m0 -14h24`} fill="none" stroke="currentColor" strokeWidth="2"/><text x={x+30} y={y-24} textAnchor="middle">{label}</text></g>;}
function L({x,y,label}) {return <g><path d={`M${x} ${y}h10q0 -20 10 -20t10 20q0 -20 10 -20t10 20h10`} fill="none" stroke="currentColor" strokeWidth="2"/><text x={x+30} y={y-32} textAnchor="middle">{label}</text></g>;}
export default function PassiveModels({kind}) {
  const resistor=kind==='resistor', cap=kind==='capacitor';
  return <Figure title={`Real ${kind} equivalent circuit`} description={resistor?'Series resistance and lead inductance with parallel stray capacitance.':cap?'Series inductance and resistance feed a capacitor with parallel leakage resistance.':'Series winding resistance and inductance with parallel winding capacitance. Core loss is separate from this simple model.'} height={235} dense>
    <path d="M35 150H90M510 150H565" stroke="currentColor" fill="none" strokeWidth="2"/>
    <circle cx={35} cy={150} r={4} fill="currentColor"/><circle cx={565} cy={150} r={4} fill="currentColor"/>
    {cap?<><L x={90} y={150} label="ESL"/><path d="M150 150H210M270 150H330M390 150H510M330 150V65H350M410 65H450V150" fill="none" stroke="currentColor" strokeWidth="2"/>
      <R x={210} y={150} label="ESR"/><C x={330} y={150} label="C"/><R x={350} y={65} label="Leakage"/></>:
      <><path d="M90 150H180M240 150H330M390 150H510M90 150V60H270M330 60H510V150" fill="none" stroke="currentColor" strokeWidth="2"/>
        <R x={180} y={150} label={resistor?'R':'Winding R'}/><L x={330} y={150} label={resistor?'Lead L':'L'}/><C x={270} y={60} label="Stray C"/></>}
    <text x={300} y={215} textAnchor="middle">Lumped model within a limited frequency range</text>
  </Figure>;
}
