import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent, secondary} from './learning/LearningTools';
export default function RailSequenceExplorer({mode}) {
  const [delay, setDelay] = useState(mode === 'reset' ? 4 : 1), [fault, setFault] = useState(false);
  const a = 2 + delay, b = a + 3, c = b + 2;
  const path = (y, start, ramp = 0) => `M130 ${y + 25} H${130 + start * 23} L${130 + (start + ramp) * 23} ${y} H565`;
  return <Tool title={mode === 'reset' ? 'Reset-release timeline' : 'Power-sequence timeline'}><Controls><Range label={mode === 'reset' ? 'Reset release delay' : 'Rail A power-good delay'} value={delay} set={setDelay} min={1} max={10} unit="ms" /></Controls>
    <label><input type="checkbox" checked={fault} onChange={e => setFault(e.target.checked)} /> {mode === 'reset' ? 'Supply never reaches the rising threshold' : 'Rail A never becomes valid'}</label>
    <Figure title="Supply dependency timeline" description={fault ? 'The supply condition is not satisfied. Reset remains active, or later rails remain disabled.' : mode === 'reset' ? `Supply becomes valid at 2 milliseconds. Reset releases at ${a} milliseconds.` : `Rail A is valid at 2 milliseconds. Rail B enables at ${a}, becomes valid at ${b}, and Rail C enables at ${c} milliseconds.`} height={265} dense>
      <text x="5" y="55">{mode === 'reset' ? 'Supply valid' : 'Rail A valid'}</text><text x="5" y="125">{mode === 'reset' ? 'RESET_N' : 'Rail B valid'}</text>{mode !== 'reset' && <text x="5" y="195">Rail C enable</text>}
      <path d={fault ? 'M130 75 H565' : path(50, 2)} stroke={accent} fill="none" strokeWidth="3" />
      <path d={fault ? 'M130 145 H565' : path(120, mode === 'reset' ? a : b)} stroke={secondary} fill="none" strokeWidth="3" />
      {mode !== 'reset' && <path d={fault ? 'M130 215 H565' : path(190, c)} stroke="currentColor" fill="none" strokeWidth="3" />}
      {[0, 5, 10, 15].map(t => <g key={t}><line x1={130 + t * 23} y1="28" x2={130 + t * 23} y2="225" stroke="currentColor" opacity=".15" /><text x={130 + t * 23} y="250" textAnchor="middle">{t} ms</text></g>)}
    </Figure><Results><p>{fault ? 'Required voltage condition is absent.' : mode === 'reset' ? `Reset releases at ${a} ms.` : `Rail B enables at ${a} ms. Rail C enables at ${c} ms.`}</p></Results>
    <Note>{mode === 'reset' ? 'Ideal active-low reset. Supply crosses its rising threshold at 2 ms unless the fault is selected. Propagation delay and hysteresis are excluded.' : 'Logic states are shown, not analog ramps. Rail B rises in 3 ms and has a 2 ms power-good delay. Fault logic is illustrative.'}</Note></Tool>;
}
