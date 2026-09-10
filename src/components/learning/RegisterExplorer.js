import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Figure, Note, accent} from './LearningTools';
import {registerField} from './interviewModels.mjs';
export default function RegisterExplorer() {
  const [value, setValue] = useState(182);
  const [low, setLow] = useState(3);
  const [width, setWidth] = useState(3);
  const effectiveWidth = Math.min(width, 8 - low);
  const result = registerField(value, low, effectiveWidth);
  return <Tool title="Read a register field">
    <Controls><Range label="Register value" value={value} set={setValue} min={0} max={255}/>
      <Range label="Lowest field bit" value={low} set={v => {setLow(v); setWidth(w => Math.min(w, 8-v));}} min={0} max={7}/>
      <Range label="Field width" value={effectiveWidth} set={setWidth} min={1} max={8-low}/></Controls>
    <Figure title="Eight register bits" description={`Register value ${value}. Bits ${low} through ${low+effectiveWidth-1} form the selected field.`} height={125} dense>
      {Array.from({length:8}, (_,i) => {const bit=7-i; const selected=bit>=low&&bit<low+effectiveWidth;return <g key={bit}>
        <rect x={15+i*72} y={40} width={64} height={48} fill={selected?accent:'none'} fillOpacity={selected?.16:1} stroke={selected?accent:'currentColor'}/>
        <text x={47+i*72} y={26} textAnchor="middle">bit {bit}</text>
        <text x={47+i*72} y={71} textAnchor="middle">{(value>>bit)&1}</text></g>;})}
    </Figure>
    <Results><p>Register: <strong>0x{value.toString(16).toUpperCase().padStart(2,'0')}</strong></p><p>Field: <strong>{result}</strong> decimal</p>
      <p>Mask after shift: <strong>0x{((1<<effectiveWidth)-1).toString(16).toUpperCase()}</strong></p></Results>
    <Note>This unsigned example has no read or write side effects.</Note>
  </Tool>;
}
