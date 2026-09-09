import React, {useState} from 'react';
import {Tool, Controls, Range, Choice, Results, Note, Figure, Arrow, Box} from './learning/LearningTools';
import {reflection} from './learning/calculations.mjs';
export default function TraceReflectionExplorer() {
  const [load,setLoad]=useState(100),[kind,setKind]=useState('resistor');
  const r=reflection(1,50,50,kind==='open'?Infinity:kind==='short'?0:load);
  return <Tool title="First-arrival reflection explorer"><Controls><Choice label="Load type" value={kind} set={setKind} options={[["resistor","Resistive load"],["open","Open circuit"],["short","Short circuit"]]} />{kind==='resistor'&&<Range label="Load resistance" value={load} set={setLoad} min={10} max={200} step={5} unit="Ω" />}</Controls>
    <Figure title="Incident and reflected voltage waves" description={`The 0.5 volt incident wave reaches the load. A ${r.reflected.toFixed(3)} volt reflection returns toward the matched source.`} height={220}>
      <Box x={15} y={75} w={135} label="1 V, 50 Ω" /><Box x={445} y={75} w={140} label={kind==='resistor'?`${load} Ω`:kind==='open'?'Open':'Short'} /><path d="M150 85 H445 M150 125 H445" stroke="currentColor" /><text x="300" y="110" textAnchor="middle">50 Ω line</text><Arrow x1={175} y1={45} x2={420} y2={45} /><text x="300" y="28" textAnchor="middle">Incident +0.500 V</text><Arrow x1={420} y1={175} x2={175} y2={175} /><text x="300" y="207" textAnchor="middle">Reflected {r.reflected.toFixed(3)} V</text>
    </Figure><Results><p>Reflection coefficient: <strong>{r.gamma.toFixed(3)}</strong></p><p>First load voltage: <strong>{r.first.toFixed(3)} V</strong></p></Results><Note>Lossless line, ideal 1 V step, and 50 Ω source resistance. The source absorbs the returning wave. Load capacitance and later circuit effects are excluded.</Note></Tool>;
}
