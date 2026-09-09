import React, {useState} from 'react';
import {Tool, Controls, Range, Choice, Results, Note, Figure, Box, Arrow} from './learning/LearningTools';
import {shunt} from './learning/calculations.mjs';
export default function ShuntExplorer() {
  const [current, setCurrent] = useState(5), [offset, setOffset] = useState(20), [connection, setConnection] = useState('kelvin');
  const stray = connection === 'kelvin' ? 0 : .001;
  const r = shunt(current, .01, offset * 1e-6, 50, stray);
  return <Tool title="Shunt measurement error"><Controls><Range label="Measured current" value={current} set={setCurrent} min={.01} max={5} step={.01} digits={2} unit="A" /><Range label="Input offset" value={offset} set={setOffset} min={-100} max={100} unit="µV" /><Choice label="Sense connection" value={connection} set={setConnection} options={[["kelvin", "Kelvin at shunt terminals"], ["shared", "Includes 1 mΩ of copper"]]} /></Controls>
    <Figure title="Shunt and sense path" description={connection === 'kelvin' ? 'Sense taps connect directly across the shunt. Load current flows through the separate power path.' : 'The sense path includes an extra 1 milliohm copper resistance, which adds measurement error.'} height={250}>
      <Arrow x1={20} y1={70} x2={160} y2={70} /><Box x={160} y={40} w={140} label="10 mΩ shunt" /><path d="M300 70 H350" stroke="currentColor" /><Box x={350} y={45} w={130} h={50} label="1 mΩ copper" /><Arrow x1={480} y1={70} x2={580} y2={70} />
      <path d={`M160 70 V180 H220 M${connection === 'kelvin' ? 300 : 480} 70 V180 H360`} fill="none" stroke="currentColor" strokeWidth="2" /><Box x={220} y={150} w={140} label="Gain 50" /><text x="300" y="235" textAnchor="middle">Separate voltage-sense path</text>
    </Figure><Results><p>True current: <strong>{current.toFixed(3)} A</strong></p><p>Indicated current: <strong>{r.reading.toFixed(3)} A</strong></p><p>Shunt loss: <strong>{r.power.toFixed(3)} W</strong></p><p>Ideal output: <strong>{r.voltage.toFixed(3)} V</strong></p></Results><Note>10 mΩ shunt and gain 50. Output clipping, shunt tolerance, temperature drift, and amplifier gain error are excluded.</Note></Tool>;
}
