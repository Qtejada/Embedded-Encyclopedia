import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Tool, Controls, Choice, Range, Figure, Results, Note} from './LearningTools';
import data from './data/current-mirror.json';
import styles from './CurrentMirrorSimulation.module.css';

const ground = (x,y) => <g stroke="currentColor" fill="none"><path d={`M${x-12} ${y}h24 M${x-8} ${y+5}h16 M${x-4} ${y+10}h8`} /></g>;
const wire = 'currentColor';
const output = 'var(--ifm-color-primary)';
const reference = 'var(--hw-accent-teal, #47877e)';

export default function CurrentMirrorSimulation() {
  const [resistance, setResistance] = useState('4300');
  const [sample, setSample] = useState(100);
  const [view, setView] = useState('full');
  const run = data.cases.find(c => c.resistance === Number(resistance));
  const row = run.points[sample];
  const [voltage, current, refCurrent, base] = row;
  const xmax = view === 'full' ? 5 : 0.8;
  const visible = run.points.filter(p => p[0] <= xmax);
  const maxCurrent = Math.ceil(Math.max(...run.points.map(p=>p[2]))*2)/2;
  const ymin = -maxCurrent/2, ymax = maxCurrent*1.12;
  const x = v => 76 + v/xmax*486;
  const y = mA => 34 + (ymax-mA)/(ymax-ymin)*220;
  const line = col => visible.map((p,i)=>`${i?'L':'M'}${x(p[0]).toFixed(2)},${y(p[col]).toFixed(2)}`).join(' ');
  const folder = useBaseUrl('/simulations/bjt-current-mirror/');
  const updateView = next => {setView(next); if(next==='knee') setSample(Math.min(sample,80));};
  return <Tool title="Explore a BJT current mirror">
    <p className={styles.intro}>Two matched transistors share a base voltage. Q1 establishes the bias. Q2 sinks current from the output.</p>
    <p className={styles.badge}>LTspice 24.1.9 · DC sweep · 27 °C</p>
    <Controls>
      <Choice label="Reference resistor" value={resistance} set={setResistance} options={[["2200","2.2 kΩ"],["4300","4.3 kΩ"],["8200","8.2 kΩ"]]} />
      <Choice label="Voltage range" value={view} set={updateView} options={[["full","Full sweep: 0 to 5 V"],["knee","Low-voltage detail: 0 to 0.8 V"]]} />
    </Controls>
    <Range label="Output voltage" value={voltage} set={v=>setSample(Math.round(v*100))} min={0} max={xmax} step={.01} unit="V" digits={2} />
    <Figure title="BJT current mirror schematic" height={330} dense description="A 5 V source drives the reference resistor into the joined base and collector of Q1. Both NPN emitters connect to ground. Q2 shares the base node. A test source imposes the Q2 collector voltage." caption="Original teaching circuit. VTEST sets the output voltage for this measurement. A practical load supplies current into OUT.">
      <g stroke={wire} strokeWidth="2" fill="none">
        <path d="M90 95V40H180V70 M180 120V175 M180 145H290V215 M245 215H330 M400 175V40H510V95 M90 145V285 M180 275V285 M400 275V285 M510 145V285" />
        <path d="M180 70l-8 5 16 8-16 8 16 8-16 8 8 5v8" />
        <circle cx="90" cy="120" r="25" /><circle cx="510" cy="120" r="25" />
        <path d="M84 110h12 M90 104v12 M84 133h12 M504 110h12 M510 104v12 M504 133h12" />
        <path d="M180 175v15l30 15 M210 195v40 M210 215h35 M210 225l-30 25v25 M330 215h40 M370 195v40 M370 205l30-15v-15 M370 225l30 25v25" />
      </g>
      <g fill={wire}><polygon points="180,250 185,238 194,248" /><polygon points="400,250 386,248 395,238" />{[[180,145],[290,215]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="4" />)}</g>
      {ground(90,285)}{ground(180,285)}{ground(400,285)}{ground(510,285)}
      <g style={{fontSize:14}}>
        <text x="90" y="72" textAnchor="middle">VCC = 5 V</text>
        <text x="205" y="88">RREF</text><text x="205" y="112">{Number(resistance)/1000} kΩ</text>
        <text x="510" y="72" textAnchor="middle">VTEST = {voltage.toFixed(2)} V</text>
        <text x="400" y="28" textAnchor="middle">OUT</text>
        <text x="145" y="218" textAnchor="end">Q1</text><text x="435" y="218">Q2</text>
        <text x="292" y="242" textAnchor="middle">BASE: {base.toFixed(3)} V</text>
        <text x="292" y="316" textAnchor="middle">Matched NPN teaching models</text>
      </g>
      <g stroke={output} fill={output}><path d="M423 81v53" strokeWidth="2" /><path d="M423 140l-5-10h10z" /></g>
      <text x="434" y="173" style={{fontSize:14}}>Iout</text>
    </Figure>
    <Figure title="Output and reference current from LTspice" height={320} dense description={`For a ${resistance} ohm reference resistor at ${voltage.toFixed(2)} volts output, the output current is ${current.toFixed(4)} milliamperes and reference current is ${refCurrent.toFixed(4)} milliamperes.`} caption="Solid line: Q2 collector current. Dashed line: current through RREF. Positive output current enters Q2's collector.">
      {[ymin,0,maxCurrent/2,maxCurrent].map(tick=><g key={tick}><line x1="76" x2="562" y1={y(tick)} y2={y(tick)} stroke={wire} opacity=".15" /><text x="65" y={y(tick)+5} textAnchor="end" style={{fontSize:13}}>{tick.toFixed(2)}</text></g>)}
      {[0,.2,.4,.6,.8,1].map(frac=><g key={frac}><line x1={x(frac*xmax)} x2={x(frac*xmax)} y1="34" y2="254" stroke={wire} opacity=".12" /><text x={x(frac*xmax)} y="278" textAnchor="middle" style={{fontSize:13}}>{(frac*xmax).toFixed(view==='full'?0:2)}</text></g>)}
      <text x="76" y="20" style={{fontSize:14}}>Current (mA)</text><text x="319" y="310" textAnchor="middle" style={{fontSize:14}}>Output voltage (V)</text>
      <path d={line(2)} fill="none" stroke={reference} strokeWidth="2.5" strokeDasharray="8 5" />
      <path d={line(1)} fill="none" stroke={output} strokeWidth="3" />
      <line x1={x(voltage)} x2={x(voltage)} y1="34" y2="254" stroke={wire} strokeDasharray="3 4" opacity=".65" />
      <circle cx={x(voltage)} cy={y(current)} r="5" fill={output} /><circle cx={x(voltage)} cy={y(refCurrent)} r="4" fill={reference} />
    </Figure>
    <Results>
      <p>Output: <strong>{current.toFixed(4)} mA</strong></p>
      <p>Reference: <strong>{refCurrent.toFixed(4)} mA</strong></p>
      <p>Output / reference: <strong>{(100*current/refCurrent).toFixed(1)}%</strong></p>
    </Results>
    <p className={styles.observation}>{voltage < base
      ? 'Q2 has a forward-biased base-collector junction at this point. The mirror is outside its normal forward-active operating region.'
      : 'Q2 operates in its forward-active region. Base currents and the Early effect prevent an exact copy of the reference current.'}</p>
    <details className={styles.details}><summary>Selected results as a table</summary>
      <table><thead><tr><th>Output voltage</th><th>Output current</th><th>Reference current</th></tr></thead><tbody>{[0,10,20,50,100,300,500].map(i=><tr key={i}><td>{run.points[i][0].toFixed(2)} V</td><td>{run.points[i][1].toFixed(4)} mA</td><td>{run.points[i][2].toFixed(4)} mA</td></tr>)}</tbody></table>
    </details>
    <div className={styles.downloads}>
      <a className={styles.primary} href={`${folder}bjt-current-mirror.zip`} download>Download LTspice example (.zip)</a>
      <a href={`${folder}results.csv`} download>Download plotted data (.csv)</a>
    </div>
    <p>Extract the ZIP, open <code>bjt-current-mirror.asc</code>, and select Run. The package includes plot settings and instructions.</p>
    <Note>The controls select saved LTspice results in 10 mV increments. They do not run LTspice in your browser. The matched model excludes device variation and self-heating.</Note>
  </Tool>;
}
