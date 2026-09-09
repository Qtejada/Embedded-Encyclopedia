import React, {useState} from 'react';
import {Tool, Controls, Range, Choice, Results, Note, Figure, Box, Arrow, accent} from './learning/LearningTools';
import {divider} from './learning/calculations.mjs';
export default function PassiveDesignExplorer({mode}) {
  const [load, setLoad] = useState(100);
  const [ratio, setRatio] = useState(.25);
  const [common, setCommon] = useState('differential');
  if (mode === 'resistor') {
    const result = divider(5, 10000, 10000, load * 1000);
    return <Tool title="Loaded-divider explorer"><Controls><Range label="Load resistance" value={load} set={setLoad} min={1} max={1000} unit="kΩ" /></Controls>
      <Figure title="Loaded resistor divider" description="Two 10 kiloohm resistors connect between 5 volts and ground. A variable load connects from their junction to ground." height={230}>
        <text x="50" y="70">5 V</text><path d="M100 65 H170 M260 65 H350 V120 M350 65 H490 V120 M350 175 V205 H490 V175" fill="none" stroke="currentColor" strokeWidth="2" />
        <Box x={170} y={40} w={90} h={50} label="10 kΩ" /><Box x={310} y={120} w={80} h={55} label="10 kΩ" /><Box x={445} y={120} w={90} h={55} label="Load" />
        <circle cx="350" cy="65" r="4" fill={accent} /><text x="360" y="45">{result.voltage.toFixed(3)} V</text><text x="335" y="225">Ground</text>
      </Figure><Results><p>Loaded output: <strong>{result.voltage.toFixed(3)} V</strong></p><p>Decrease: <strong>{(100 * (1 - result.voltage / result.unloaded)).toFixed(2)}%</strong></p></Results><Note>Ideal 5 V source. Both divider resistors are 10 kΩ. Tolerance and input bias current are excluded.</Note></Tool>;
  }
  if (mode === 'transformer') return <Tool title="Transformer ratio explorer"><Controls><Range label="Secondary-to-primary turns ratio" value={ratio} set={setRatio} min={.1} max={2} step={.05} digits={2} /></Controls>
    <Figure title="Transformer voltage and reflected load" description="An ideal transformer connects a 12 volt RMS input to a 6 ohm secondary load. There is no conductive connection between the windings." height={190}>
      <Box x={20} y={60} w={125} label="12 V RMS" /><Arrow x1={145} y1={90} x2={210} y2={90} /><Box x={210} y={40} w={160} h={100} label={`Ratio ${ratio.toFixed(2)}`} /><line x1={281} y1={55} x2={281} y2={75} stroke="currentColor" /><line x1={289} y1={55} x2={289} y2={75} stroke="currentColor" /><Arrow x1={370} y1={90} x2={440} y2={90} /><Box x={440} y={60} w={130} label="6 Ω load" />
      <text x="300" y="178" textAnchor="middle">Functional model. Separate windings.</text>
    </Figure><Results><p>Secondary: <strong>{(12 * ratio).toFixed(2)} V RMS</strong></p><p>Load current: <strong>{(2 * ratio).toFixed(2)} A RMS</strong></p><p>Reflected load: <strong>{(6 / ratio ** 2).toFixed(2)} Ω</strong></p></Results><Note>Ideal transformer. Loss, excitation current, frequency limits, and insulation ratings are excluded.</Note></Tool>;
  const isCommon = common === 'common';
  return <Tool title="Common-mode choke current paths"><Controls><Choice label="Current mode" value={common} set={setCommon} options={[["differential", "Differential mode"], ["common", "Common mode"]]} /></Controls>
    <Figure title="Coupled-winding current directions" description={isCommon ? 'Current travels left to right in both windings. Core flux adds. The return is outside the two-line path.' : 'Current travels left to right in the upper winding and right to left in the lower winding. Core flux cancels in the ideal model.'} height={250}>
      <rect x="230" y="30" width="140" height="170" rx="25" fill="none" stroke="currentColor" strokeDasharray="5 4" /><text x="300" y="225" textAnchor="middle">Shared core</text>
      {[70, 160].map(y => <g key={y}><path d={`M35 ${y} H230 q14 -30 28 0 q14 -30 28 0 q14 -30 28 0 q14 -30 28 0 H565`} fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="238" cy={y - 23} r="4" fill="currentColor" /></g>)}
      <Arrow x1={75} y1={45} x2={190} y2={45} /><Arrow x1={isCommon ? 75 : 190} y1={185} x2={isCommon ? 190 : 75} y2={185} /><text x="420" y="117">Flux {isCommon ? 'adds' : 'cancels'}</text>
    </Figure><Results><p>{isCommon ? 'Higher common-mode impedance.' : 'Low differential impedance in the ideal model.'}</p></Results><Note>Arrows show one instant. Real leakage inductance and capacitance affect the wanted signal.</Note></Tool>;
}
