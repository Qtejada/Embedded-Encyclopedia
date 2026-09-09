import React, {useState} from 'react';
import {Tool, Controls, Range, Results, Note, Figure, accent} from './learning/LearningTools';
import {drift} from './learning/calculations.mjs';
export default function RtcDriftExplorer() {
  const [ppm,setPpm]=useState(20),[days,setDays]=useState(30);
  const error=drift(ppm,days);
  return <Tool title="Clock drift explorer"><Controls><Range label="Frequency error" value={ppm} set={setPpm} min={-50} max={50} unit="ppm" /><Range label="Elapsed days" value={days} set={setDays} min={1} max={365} /></Controls>
    <Figure title="Time error over the selected interval" description={`At ${days} days, the clock ${error<0?'loses':'gains'} ${Math.abs(error).toFixed(2)} seconds. Error grows linearly in this constant-frequency model.`} height={210}>
      <path d="M60 25 V180 M60 105 H550" fill="none" stroke="currentColor" /><line x1="60" y1="105" x2="530" y2={105-ppm*1.4} stroke={accent} strokeWidth="3" /><text x="5" y="110">0 s</text><text x="60" y="202">0 days</text><text x="440" y="202">{days} days</text><text x="315" y="25">Final error: {error.toFixed(2)} s</text>
    </Figure><Results><p>Clock {error<0?'loses':'gains'} <strong>{Math.abs(error).toFixed(3)} s</strong></p><p>Daily error: <strong>{drift(ppm,1).toFixed(3)} s/day</strong></p></Results><Note>Constant frequency error. The vertical scale adjusts with the selected interval. Temperature variation, aging, and corrections are excluded.</Note></Tool>;
}
