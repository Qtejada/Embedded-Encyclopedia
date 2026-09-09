import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent} from './learning/LearningTools';
import {bga} from './learning/calculations.mjs';
export default function BgaEscapeExplorer() {
  const [pitch,setPitch]=useState(.8),[diameter,setDiameter]=useState(.4),[width,setWidth]=useState(.08),[clearance,setClearance]=useState(.08),[count,setCount]=useState(2);
  const r=bga(pitch,diameter,width,clearance,count), scale=260/pitch;
  const start=300-r.needed*scale/2+clearance*scale;
  return <Tool title="BGA straight-channel fit"><Controls><Range label="Pad pitch" value={pitch} set={setPitch} min={.5} max={1} step={.02} digits={2} unit="mm" /><Range label="Pad diameter" value={diameter} set={setDiameter} min={.2} max={.5} step={.01} digits={2} unit="mm" /><Range label="Trace width" value={width} set={setWidth} min={.05} max={.15} step={.01} digits={2} unit="mm" /><Range label="Clearance" value={clearance} set={setClearance} min={.05} max={.15} step={.01} digits={2} unit="mm" /><Range label="Trace count" value={count} set={setCount} min={1} max={2} /></Controls>
    <Figure title="Two adjacent pads and escape traces" description={`${count} traces require ${r.needed.toFixed(3)} millimeters. The pad gap is ${r.gap.toFixed(3)} millimeters. ${r.fits?'The nominal dimensions fit.':'The nominal dimensions do not fit.'}`} height={270}>
      {[170,430].map(x=><circle key={x} cx={x} cy="145" r={diameter*scale/2} stroke="currentColor" fill="currentColor" fillOpacity=".08" />)}
      {Array.from({length:count},(_,i)=><rect key={i} x={start+i*(width+clearance)*scale} y="40" width={width*scale} height="210" fill={accent} opacity=".7" />)}
      <path d="M170 25 H430 M170 20 V30 M430 20 V30" fill="none" stroke="currentColor" /><text x="300" y="17" textAnchor="middle">Pitch {pitch.toFixed(2)} mm</text><text x="300" y="265" textAnchor="middle">Gap {r.gap.toFixed(3)} mm</text>
    </Figure><Results><p>Required: <strong>{r.needed.toFixed(3)} mm</strong></p><p>Remaining: <strong>{r.margin.toFixed(3)} mm</strong></p><p><strong>{r.fits?'Nominal geometry fits.':'Geometry does not fit.'}</strong></p></Results><Note>Original pad-channel model. It excludes vias, mask, etch variation, impedance, and package constraints. A geometric fit is not fabrication approval.</Note></Tool>;
}
