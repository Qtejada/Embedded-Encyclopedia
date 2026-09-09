import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent} from './learning/LearningTools';
import {converter} from './learning/calculations.mjs';
export default function SwitchingConverterExplorer({topology = 'buck'}) {
  const [vin, setVin] = useState(topology === 'buck' ? 12 : 5);
  const [duty, setDuty] = useState(topology === 'buck' ? 100 * 5 / 12 : topology === 'boost' ? 100 * 7 / 12 : 50);
  const [inductance, setInductance] = useState(22);
  const [load, setLoad] = useState(topology === 'buck' ? 1 : .2);
  const [frequency, setFrequency] = useState(500);
  const r = converter(topology, vin, duty / 100, inductance * 1e-6, frequency * 1e3, load);
  const valid = r.valley > 0;
  const y = i => 205 - i / (r.peak * 1.2) * 165;
  const middle = 65 + 475 * duty / 100;
  return <Tool title={`${topology === 'inverting' ? 'Inverting buck-boost' : topology === 'buck' ? 'Buck' : 'Boost'} current explorer`}>
    <Controls><Range label="Input voltage" value={vin} set={setVin} min={3} max={24} unit="V" /><Range label="Duty cycle" value={duty} set={setDuty} min={10} max={80} unit="%" digits={1} /><Range label="Inductance" value={inductance} set={setInductance} min={10} max={100} unit="µH" /><Range label="Load current" value={load} set={setLoad} min={.05} max={3} step={.05} digits={2} unit="A" /><Range label="Switching frequency" value={frequency} set={setFrequency} min={100} max={1000} step={50} unit="kHz" /></Controls>
    {valid ? <Figure title="One inductor-current cycle" description={`Inductor current rises during on-time and falls during off-time. Valley ${r.valley.toFixed(3)} amperes. Peak ${r.peak.toFixed(3)} amperes.`} height={255}>
      <rect x="65" y="30" width={middle - 65} height="175" fill={accent} opacity=".08" /><path d="M65 25 V205 H555" fill="none" stroke="currentColor" /><text x="8" y="28">I (A)</text><text x="70" y="240">0</text><text x="470" y="240">{(1000 / frequency).toFixed(2)} µs</text>
      <line x1={middle} y1="30" x2={middle} y2="205" stroke="currentColor" strokeDasharray="4 4" /><polyline points={`65,${y(r.valley)} ${middle},${y(r.peak)} 540,${y(r.valley)}`} fill="none" stroke={accent} strokeWidth="3" /><text x="85" y="50">On</text><text x="490" y="50">Off</text><text x="70" y={y(r.average) - 8}>{r.average.toFixed(3)} A average</text>
    </Figure> : <p role="status"><strong>CCM model not valid:</strong> The calculated valley reaches zero. Increase load, inductance, or frequency to restore positive current.</p>}
    <Results>{valid ? <><p>Ideal output: <strong>{r.voltage.toFixed(2)} V</strong></p><p>Ripple estimate: <strong>{r.ripple.toFixed(3)} A</strong></p><p>Peak: <strong>{r.peak.toFixed(3)} A</strong></p><p>Valley: <strong>{r.valley.toFixed(3)} A</strong></p></> : <p>Output and current estimates are hidden outside CCM.</p>}</Results>
    <Note>Ideal steady continuous conduction mode (CCM). This model excludes losses, control-loop behavior, startup, and current limiting. The voltage relation is not valid after CCM fails.</Note>
  </Tool>;
}
