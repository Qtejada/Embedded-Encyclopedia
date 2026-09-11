import React, {useState} from 'react';
import {Tool, Controls, Range, Figure, Results, Note, accent, secondary} from './LearningTools';

export default function ConvolutionExplorer() {
  const [t, setT] = useState(0.5);
  const left = Math.max(0, t - 1), right = Math.min(1, t);
  const overlap = Math.max(0, right - left);
  const x = v => 70 + (v + 1.5) * 100;
  return <Tool title="Slide two pulses through a convolution">
    <Controls><Range label="Time t" value={t} set={setT} min={-0.5} max={2.5} step={0.05} digits={2} unit="s" /></Controls>
    <Figure title="Pulse overlap and convolution result" height={350} dense description={`The fixed pulse spans zero to one. The reversed and shifted pulse spans ${Number(t - 1).toFixed(2)} to ${t.toFixed(2)}. Their overlap has width ${overlap.toFixed(2)}.`} caption="Unit-height pulses, each one second wide. The shaded width equals the integral of their product.">
      <text x={25} y={25}>x(τ)</text><text x={25} y={125}>h(t − τ)</text>
      {[90, 190].map(y => <g key={y}><line x1={45} x2={580} y1={y} y2={y} stroke="currentColor" />{[-1, 0, 1, 2, 3].map(v => <g key={v}><line x1={x(v)} x2={x(v)} y1={y-4} y2={y+4} stroke="currentColor" /><text x={x(v)} y={y+20} textAnchor="middle" fontSize="12">{v}</text></g>)}<text x={580} y={y+20}>τ</text></g>)}
      <path d={`M${x(-1.5)},90 H${x(0)} V40 H${x(1)} V90 H${x(3.5)}`} fill="none" stroke={accent} strokeWidth="3" />
      <path d={`M${x(-1.5)},190 H${x(t-1)} V140 H${x(t)} V190 H${x(3.5)}`} fill="none" stroke={secondary} strokeWidth="3" />
      {overlap > 0 && [40, 140].map(y => <rect key={y} x={x(left)} y={y} width={100*overlap} height={50} fill={accent} opacity=".22" />)}
      <text x={25} y={250}>y(t)</text><line x1={45} x2={580} y1={310} y2={310} stroke="currentColor" />
      <path d={`M${x(-1.5)},310 H${x(0)} L${x(1)},250 L${x(2)},310 H${x(3.5)}`} fill="none" stroke={accent} strokeWidth="3" />
      <circle cx={x(t)} cy={310-60*overlap} r="6" fill={secondary} />
      {[0,1,2].map(v => <text key={v} x={x(v)} y={333} textAnchor="middle" fontSize="12">{v}</text>)}<text x={560} y={333}>t (s)</text>
    </Figure>
    <Results>Overlap width: {overlap.toFixed(2)} s. Convolution value: {overlap.toFixed(2)}.</Results>
    <Note>The integral is zero when the pulses do not overlap. It reaches one at t = 1 s, then decreases.</Note>
  </Tool>;
}
