import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent} from './learning/LearningTools';
import {pullup} from './learning/calculations.mjs';
export default function I2cPullupExplorer() {
  const [resistance, setResistance] = useState(1.5), [capacitance, setCapacitance] = useState(200);
  const r = pullup(3.3, .4, .003, capacitance * 1e-12, 300e-9, resistance * 1000);
  const end = Math.max(1000, resistance * capacitance * 3);
  const points = Array.from({length:101}, (_, i) => `${55+i*4.8},${185-145*(1-Math.exp(-end*i/100/(resistance*capacitance)))}`).join(' ');
  return <Tool title="I²C pull-up window"><Controls><Range label="Pull-up resistance" value={resistance} set={setResistance} min={.5} max={10} step={.1} digits={1} unit="kΩ" /><Range label="Bus capacitance" value={capacitance} set={setCapacitance} min={50} max={500} step={10} unit="pF" /></Controls>
    <Figure title="Passive bus rise" description={`A resistor charges the bus from zero to 3.3 volts. The 30 to 70 percent rise time is ${(r.rise*1e9).toFixed(0)} nanoseconds.`} height={245}>
      <path d="M55 25 V185 H550" fill="none" stroke="currentColor" /><polyline points={points} fill="none" stroke={accent} strokeWidth="3" />{[.3,.7].map(v => <g key={v}><line x1="55" y1={185-145*v} x2="535" y2={185-145*v} stroke="currentColor" strokeDasharray="4 4" opacity=".5" /><text x="0" y={190-145*v}>{v*100}%</text></g>)}<text x="60" y="225">0</text><text x="420" y="225">{end.toFixed(0)} ns</text>
    </Figure><Results><p>Allowed resistance: <strong>{(r.min/1000).toFixed(2)}–{(r.max/1000).toFixed(2)} kΩ</strong></p><p>Rise time: <strong>{(r.rise*1e9).toFixed(0)} ns</strong></p><p>Current at 0.4 V: <strong>{(r.lowCurrent*1000).toFixed(2)} mA</strong></p><p><strong>{resistance*1000 >= r.min && resistance*1000 <= r.max ? 'Within the assumed limits.' : 'Outside the assumed limits.'}</strong></p></Results>
    <Note>Assumed limits: 3.3 V supply, 0.4 V low at 3 mA, and 300 ns maximum rise time. Tolerance, leakage, buffers, and active pull-ups are excluded.</Note></Tool>;
}
