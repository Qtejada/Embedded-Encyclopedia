import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Tool, Controls, Choice, Range, Figure, Results, Note} from './LearningTools';
import examples from './data/ltspice-batch-one.json';
import shared from './CurrentMirrorSimulation.module.css';
import styles from './SpiceBatchSimulation.module.css';

const colors=['var(--ifm-color-primary)','var(--hw-accent-teal, #47877e)','var(--ifm-font-color-base)'];
const pretty=s=>s.replaceAll('uF','µF').replace(/kilohms?/g,'kΩ').replaceAll('ohms','Ω');
const format=n=>n===0?'0':Number(n.toPrecision(4)).toString();
const intro={
  half:'A diode supplies the load during positive input cycles. A reservoir capacitor stores charge between these cycles.',
  bridge:'Four diodes supply the load during both input polarities. Two diodes conduct in each current path.',
  jfet:'Source resistance creates a negative gate to source voltage. This voltage reduces the drain current.',
  mosfet:'Both gates receive the same control voltage. The N-channel and P-channel loads switch in opposite states.',
  ce:'The collector signal is inverted. A bypass capacitor increases gain without changing the total DC emitter resistance.',
};

function Symbol({kind}) {
  if(kind.startsWith('OpAmps')) return <><path d="M-32-32v64L32 0zM0-32v16M0 32V16"/><text x="-27" y="21" stroke="none" fill="currentColor" fontSize="16">+</text><text x="-27" y="-11" stroke="none" fill="currentColor" fontSize="16">−</text></>;
  if(kind==='current') return <><circle cx="0" cy="40" r="30"/><path d="M0 0v10M0 70v10M0 20v40m-8-10 8 10 8-10"/></>;
  if(kind==='pnp') return <><path d="M0 48h16M16 16v64M16 32L64 0M16 64L64 96"/><path d="M23 69l22 5-8 12z" fill="currentColor"/></>;
  if(kind==='res') return <path d="M16 16v8l16 8-32 16 32 16-32 16 16 8v8"/>;
  if(kind==='cap') return <path d="M16 0v28m-16 0h32m-32 8h32m-16 0v28"/>;
  if(kind==='diode') return <><path d="M16 0v20M0 20h32L16 44zM0 44h32M16 44v20"/></>;
  if(kind==='voltage') return <><circle cx="0" cy="56" r="32"/><path d="M0 16v8M0 88v8M-8 40H8M0 32v16M-8 74H8"/></>;
  if(kind==='npn') return <><path d="M0 48h16M16 16v64M16 32L64 0M16 64L64 96"/><path d="M64 96l-22-7 8-12z" fill="currentColor"/></>;
  if(kind==='njf') return <><path d="M48 0v24H16M16 16v64M16 72h32v24M0 64h16"/><path d="M16 64l-12-5v10z" fill="currentColor"/></>;
  return <><path d="M48 0v16H16M16 8v16m0 16v16m0 16v16M0 80h8V16M16 80h32V48H24M48 80v16"/>
    <path d={kind==='pmos'?'M40 48l-14-5v10z':'M18 48l14-5v10z'} fill="currentColor"/></>;
}

function Schematic({data,run,axisValue}) {
  const [enlarged,setEnlarged]=useState(false);
  const {components,wires,flags}=data.schematic;
  const width=data.schematic.width || (data.kind==='bridge'?1200:data.kind==='half'?870:data.kind==='jfet'?650:1160);
  const height=data.schematic.height || (data.kind==='ce'?650:570);
  const values=p=>data.kind==='library'?p.display.replaceAll(`{${data.parameter}}`,format(run.value)):data.kind==='jfet'&&p.name==='VDD'?`${format(axisValue)} V`:p.value.startsWith('{')?(run.value===1e-12?'1 pF':pretty(run.label)):p.display.replace(', 50 Hz','').replace(', 1 kHz','');
  return <div className={`${styles.schematic} ${data.kind==='library'?styles.library:''} ${enlarged?styles.enlarged:''}`}>
    <button type="button" aria-pressed={enlarged} onClick={()=>setEnlarged(!enlarged)}>{enlarged?'Fit schematic':'Enlarge schematic'}</button>
    <Figure title={`${data.title} schematic`} width={width} height={height} dense
    description={`${data.intro || intro[data.kind]} Equal node labels are electrically connected. The drawing uses the same components and connections as the downloadable schematic.`}
    caption="Equal node labels connect. Values match the selected run. Scroll the drawing horizontally on a small screen.">
    <g stroke="currentColor" strokeWidth="2.2" fill="none">
      {wires.map(([x1,y1,x2,y2],i)=><line key={i} {...{x1,y1,x2,y2}}/>)}
      {components.map(p=><g key={p.name} transform={`translate(${p.x} ${p.y}) ${p.rotation==='R180'?'rotate(180)':''}`}><Symbol kind={p.kind}/></g>)}
      {flags.filter(f=>f[2]==='0').map(([x,y],i)=><path key={i} d={`M${x-14} ${y}h28m-23 7h18m-13 7h8`}/>)}
    </g>
    {components.map(p=>{
      const reversed=p.rotation==='R180';
      const x=p.x+(reversed?22:p.kind==='voltage'?42:['npn','njf','nmos'].includes(p.kind)?70:42);
      const y=p.y+(reversed?-22:p.kind==='cap'?18:40);
      return <g key={p.name} className={styles.componentLabel}><text x={x} y={y}>{p.name}</text><text x={x} y={y+25}>{values(p)}</text></g>;
    })}
    {flags.filter(f=>f[2]!=='0').map(([x,y,name],i)=><g key={i}>
      <circle cx={x} cy={y} r="4" fill="currentColor"/>
      <text x={x+5} y={y-10} className={styles.nodeLabel}>{name}</text>
    </g>)}
  </Figure></div>;
}

export default function SpiceBatchSimulation({circuit,data:providedData}) {
  const data=providedData || examples[circuit];
  const [caseIndex,setCaseIndex]=useState('1');
  const [groupIndex,setGroupIndex]=useState('0');
  const [view,setView]=useState(data.kind==='jfet'||data.kind==='library'?'full':'detail');
  const [cursor,setCursor]=useState(0);
  const run=data.cases[Number(caseIndex)];
  const group=data.groups[Number(groupIndex)];
  const bounds=data.detail || {half:[160,200],bridge:[160,200],jfet:[0,3],mosfet:[.95,1.05],ce:[58,60]}[data.kind];
  const points=view==='full'?run.points:run.points.filter(p=>p[0]>=bounds[0]&&p[0]<=bounds[1]);
  const row=points[Math.min(cursor,points.length-1)];
  const xmin=points[0][0], xmax=points[points.length-1][0];
  const series=group.traces.map(([key,label,scale])=>({label,scale,col:1+data.keys.indexOf(key)}));
  let low=0,high=0;
  points.forEach(p=>series.forEach(s=>{low=Math.min(low,p[s.col]*s.scale);high=Math.max(high,p[s.col]*s.scale);}));
  const rough=(high-low||1)/4;
  const magnitude=10**Math.floor(Math.log10(rough));
  const tickStep=([1,2,2.5,5,10].find(n=>n*magnitude>=rough)||10)*magnitude;
  const ymin=Math.floor(low/tickStep)*tickStep;
  const ymax=Math.max(ymin+tickStep,Math.ceil(high/tickStep)*tickStep);
  const ticks=Array.from({length:Math.round((ymax-ymin)/tickStep)+1},(_,i)=>ymin+i*tickStep);
  const x=v=>78+(data.logarithmic?Math.log(v/xmin)/Math.log(xmax/xmin):(v-xmin)/(xmax-xmin))*474;
  const axisAt=f=>data.logarithmic?xmin*(xmax/xmin)**f:xmin+(xmax-xmin)*f;
  const y=v=>35+(ymax-v)/(ymax-ymin)*216;
  const folder=useBaseUrl(`/simulations/${circuit}/`);
  const windows={half:'Last two source cycles',bridge:'Last two source cycles',jfet:'Low supply: 0 to 3 V',mosfet:'First rising gate edge',ce:'Last two signal cycles'};
  const changeView=v=>{setView(v);setCursor(0);};
  let observation=data.observation || '';
  if(data.kind==='half') observation='Select Current to see charging pulses. The diode current can greatly exceed the average load current.';
  if(data.kind==='bridge') observation='D1 and D4 carry one input polarity. D2 and D3 carry the other. Output current retains the same direction.';
  if(data.kind==='jfet') observation='Select the full sweep and move to 12 V. Compare the source voltage and drain current for each source resistor.';
  if(data.kind==='mosfet') observation='A low N-channel drain voltage means its load is on. A high P-channel drain voltage means its load is on.';
  if(data.kind==='ce') observation='The 1 µF bypass produces an intermediate gain and phase shift at 1 kHz. The 100 µF bypass gives nearly complete inversion.';
  return <Tool title={`Explore: ${data.title}`}>
    <p>{data.intro || intro[data.kind]}</p>
    <p className={shared.badge}>LTspice 24.1.9 · {data.analysis} · 27 °C · Three verified runs</p>
    <Controls>
      <Choice label={data.parameter || {half:'Reservoir capacitor',bridge:'Reservoir capacitor',jfet:'Source resistor',mosfet:'Load resistance',ce:'Emitter bypass'}[data.kind]} value={caseIndex} set={setCaseIndex} options={data.cases.map((c,i)=>[String(i),pretty(c.label)])}/>
      <Choice label="Plot" value={groupIndex} set={setGroupIndex} options={data.groups.map((g,i)=>[String(i),g.label])}/>
      {bounds && <Choice label="View" value={view} set={changeView} options={[["detail",windows[data.kind] || 'Detail'],["full","Full saved range"]]}/>}
    </Controls>
    {data.kind==='library'?<details className={shared.details}><summary>Circuit schematic</summary><Schematic data={data} run={run} axisValue={row[0]}/></details>:<Schematic data={data} run={run} axisValue={row[0]}/>}
    {data.kind==='library'?<><Range label="Saved sample" value={Math.min(cursor,points.length-1)} min={0} max={points.length-1} step={1} digits={0} unit="" set={setCursor}/><p>{data.axisLabel}: {format(row[0])} {data.axisUnit}</p></>:<Range label={data.kind==='jfet'?'Supply voltage':'Time'} value={row[0]} min={xmin} max={xmax} step={points[1][0]-points[0][0]} digits={data.kind==='mosfet'?3:2} unit={data.kind==='jfet'?'V':'ms'}
      set={v=>setCursor(Math.max(0,Math.min(points.length-1,Math.round((v-xmin)/(points[1][0]-points[0][0])))))}/>
    }
    <Figure title={`${data.title}: ${group.label.toLowerCase()} from LTspice`} height={320} dense
      description={`At ${format(row[0])} ${data.axisUnit || (data.kind==='jfet'?'volts':'milliseconds')}, ${series.map(s=>`${s.label} is ${format(row[s.col]*s.scale)} ${group.unit}`).join(', ')}.`}
      caption="Curves and cursor values come from saved LTspice results. The browser interpolates between saved samples.">
      {ticks.map(yt=><g key={yt}><line x1="78" x2="552" y1={y(yt)} y2={y(yt)} stroke="currentColor" opacity={Math.abs(yt)<1e-12?'.3':'.12'}/><text x="67" y={y(yt)+5} textAnchor="end" style={{fontSize:13}}>{format(yt)}</text></g>)}
      {[0,.25,.5,.75,1].map(f=><text key={f} x={x(axisAt(f))} y="276" textAnchor="middle" style={{fontSize:13}}>{format(axisAt(f))}</text>)}
      <text x="78" y="20" style={{fontSize:14}}>{group.label} ({group.unit})</text>
      <text x="315" y="309" textAnchor="middle" style={{fontSize:14}}>{data.axis}</text>
      {series.map((s,i)=><path key={s.label} d={points.map((p,j)=>`${j?'L':'M'}${x(p[0]).toFixed(2)},${y(p[s.col]*s.scale).toFixed(2)}`).join(' ')} fill="none" stroke={colors[i]} strokeWidth="2.6" strokeDasharray={i===1?'8 4':i===2?'2 4':undefined}/>)}
      <line x1={x(row[0])} x2={x(row[0])} y1="35" y2="251" stroke="currentColor" opacity=".55" strokeDasharray="3 4"/>
      {series.map((s,i)=><circle key={s.label} cx={x(row[0])} cy={y(row[s.col]*s.scale)} r="4" fill={colors[i]}/>)}
    </Figure>
    <ul className={styles.legend}>{series.map((s,i)=><li key={s.label}><svg width="28" height="12" aria-hidden="true"><line x1="0" x2="28" y1="6" y2="6" stroke={colors[i]} strokeWidth="3" strokeDasharray={i===1?'8 4':i===2?'2 4':undefined}/></svg>{s.label}</li>)}</ul>
    <Results>{series.map(s=><p key={s.label}>{s.label}: <strong>{format(row[s.col]*s.scale)} {group.unit}</strong></p>)}</Results>
    <p className={shared.observation}>{observation}</p>
    <details className={shared.details}><summary>Measured simulation results</summary>
      <p>{data.kind==='library'?'Results use the saved simulation samples. Frequency points are in Hz. Pulse widths are in seconds. Other extrema and means use the second half of the saved range.':data.kind==='half'||data.kind==='bridge'?'Mean output and ripple use the final source cycle. Peak diode current includes startup.':data.kind==='ce'?'Gain and phase use the final ten signal periods.':data.kind==='jfet'?'Bias values use the 12 V supply point.':'On currents use settled points between switching edges.'}</p>
      <table><thead><tr><th>Result</th><th>Value</th></tr></thead><tbody>{run.stats.map(([label,value,unit])=><tr key={label}><td>{label}</td><td>{format(value)} {unit}</td></tr>)}</tbody></table>
    </details>
    <div className={shared.downloads}><a className={shared.primary} href={`${folder}${circuit}.zip`} download>Download LTspice example (.zip)</a><a href={`${folder}results.csv`} download>Download original data (.csv)</a></div>
    <p>Extract all files, open <code>{circuit}.asc</code>, and select Run. The package includes plot settings and instructions.</p>
    <Note>The controls select saved results. They do not run LTspice in your browser.</Note>
  </Tool>;
}
