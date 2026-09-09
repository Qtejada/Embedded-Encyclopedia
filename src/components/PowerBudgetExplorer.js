import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent} from './learning/LearningTools';
import {inrush, ldo, rectifier} from './learning/calculations.mjs';
export default function PowerBudgetExplorer({mode}) {
  const [voltage, setVoltage] = useState(mode === 'rectifier' ? 9 : 5), [capacitance, setCapacitance] = useState(mode === 'rectifier' ? 1000 : 100);
  const [time, setTime] = useState(5), [current, setCurrent] = useState(mode === 'rectifier' ? .1 : .2);
  const [vout, setVout] = useState(3.3), [thermal, setThermal] = useState(100), [ambient, setAmbient] = useState(50), [frequency, setFrequency] = useState(50);
  if (mode === 'inrush') return <Tool title="Capacitor inrush explorer"><Controls><Range label="Load capacitance" value={capacitance} set={setCapacitance} min={10} max={1000} step={10} unit="µF" /><Range label="Output voltage" value={voltage} set={setVoltage} min={1} max={12} unit="V" /><Range label="Ramp time" value={time} set={setTime} min={.5} max={20} step={.5} digits={1} unit="ms" /></Controls>
    <Figure title="Linear startup ramp" description={`The output rises from zero to ${voltage} volts in ${time} milliseconds.`} height={200}><path d="M55 25 V160 H550" fill="none" stroke="currentColor" /><polyline points={`55,160 ${55 + time * 20},40 550,40`} fill="none" stroke={accent} strokeWidth="3" /><text x="65" y="25">{voltage} V</text><text x="425" y="190">Time (0–24 ms)</text></Figure>
    <Results><p>Capacitor current: <strong>{(inrush(capacitance * 1e-6, voltage, time / 1000) * 1000).toFixed(1)} mA</strong></p></Results><Note>Constant capacitance and a linear voltage ramp. Add operating load current. The model does not check switch safe operating area.</Note></Tool>;
  if (mode === 'ldo') {
    const r = ldo(voltage, vout, current, thermal, ambient);
    return <Tool title="LDO heat estimate"><Controls><Range label="Input voltage" value={voltage} set={setVoltage} min={3} max={12} step={.1} digits={1} unit="V" /><Range label="Output voltage" value={vout} set={setVout} min={1} max={5} step={.1} digits={1} unit="V" /><Range label="Load current" value={current} set={setCurrent} min={.05} max={1} step={.05} digits={2} unit="A" /><Range label="Thermal resistance" value={thermal} set={setThermal} min={20} max={200} unit="°C/W" /><Range label="Ambient temperature" value={ambient} set={setAmbient} min={0} max={85} unit="°C" /></Controls>
      {voltage > vout ? <Results><p>Dissipation: <strong>{r.power.toFixed(3)} W</strong></p><p>Efficiency estimate: <strong>{r.efficiency.toFixed(1)}%</strong></p><p>Junction estimate: <strong>{r.junction.toFixed(1)} °C</strong></p></Results> : <p role="status">Input voltage must exceed output voltage. An LDO cannot increase voltage.</p>}
      <Note>Ground current is excluded. The selected device must meet dropout and maximum-temperature limits. Thermal resistance depends on the actual board.</Note></Tool>;
  }
  const r = rectifier(voltage, .7, current, frequency, capacitance * 1e-6);
  const valid = r.ripple < .25 * r.peak;
  return <Tool title="Rectifier ripple estimate"><Controls><Range label="Secondary voltage" value={voltage} set={setVoltage} min={5} max={15} unit="V RMS" /><Range label="Capacitance" value={capacitance} set={setCapacitance} min={100} max={2200} step={100} unit="µF" /><Range label="Load current" value={current} set={setCurrent} min={.05} max={.5} step={.05} digits={2} unit="A" /><Range label="AC frequency" value={frequency} set={setFrequency} min={50} max={60} step={10} unit="Hz" /></Controls>
    <Results><p>Peak estimate: <strong>{r.peak.toFixed(2)} V</strong></p><p>Ripple estimate: <strong>{r.ripple.toFixed(2)} V</strong></p>{valid && <p>Valley estimate: <strong>{r.valley.toFixed(2)} V</strong></p>}</Results>
    {!valid && <p role="status">Ripple is large relative to the peak. The small-ripple approximation needs a more complete circuit analysis.</p>}
    <Note>Isolated low-voltage input. Full-wave bridge, constant load, and 0.7 V per conducting diode. Transformer impedance and charging pulses are excluded.</Note></Tool>;
}
