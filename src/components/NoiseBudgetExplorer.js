import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent, secondary} from './learning/LearningTools';
import {noise} from './learning/calculations.mjs';
export default function NoiseBudgetExplorer() {
  const [a,setA]=useState(3),[b,setB]=useState(4),[band,setBand]=useState(10);
  const total=a*a+b*b, fraction=total?a*a/total:0;
  return <Tool title="Independent white-noise budget"><Controls><Range label="Source 1 density" value={a} set={setA} min={0} max={20} unit="nV/√Hz" /><Range label="Source 2 density" value={b} set={setB} min={0} max={20} unit="nV/√Hz" /><Range label="Noise bandwidth" value={band} set={setBand} min={1} max={100} unit="kHz" /></Controls>
    <Figure title="Share of total noise power" description={`Source 1 supplies ${total?(100*fraction).toFixed(1):0} percent of noise power. The sources are independent.`} height={120}><rect x="40" y="30" width="520" height="30" fill="currentColor" opacity=".08" />{total>0&&<><rect x="40" y="30" width={520*fraction} height="30" fill={accent} /><rect x={40+520*fraction} y="30" width={520*(1-fraction)} height="30" fill={secondary} /></>}<text x="40" y="100">Source 1: {total?(100*fraction).toFixed(1):0}%</text><text x="350" y="100">Source 2: {total?(100*(1-fraction)).toFixed(1):0}%</text></Figure>
    <Results><p>Combined density: <strong>{Math.hypot(a,b).toFixed(2)} nV/√Hz</strong></p><p>Integrated noise: <strong>{(noise(a,b,band*1000)/1000).toFixed(3)} µV RMS</strong></p></Results><Note>Independent, flat noise densities and rectangular bandwidth. Correlation, 1/f noise, and filter shape are excluded. RMS means root mean square.</Note></Tool>;
}
