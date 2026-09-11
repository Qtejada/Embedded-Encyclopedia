import React, {useMemo,useState} from 'react';
import {Tool,Controls,Choice,Actions,Range,Results,Figure,Arrow,Note,accent} from './LearningTools';
import {PIPELINE_PROGRAMS,STAGES,formatInstruction,simulatePipeline} from './pipelineModel.mjs';

export default function PipelineExplorer(){
  const [program,setProgram]=useState('load'),[forward,setForward]=useState('on'),[position,setPosition]=useState(0);
  const result=useMemo(()=>simulatePipeline(PIPELINE_PROGRAMS[program].code,{forwarding:forward==='on'}),[program,forward]);
  const index=Math.min(position,result.trace.length-1), row=result.trace[index];
  function choose(set,value){set(value);setPosition(0);}
  const instructions=[...new Map(result.trace.flatMap(r=>r.slots.filter(Boolean).map(i=>[i.uid,i]))).values()];
  return <Tool title="Five-stage pipeline explorer">
    <Controls>
      <Choice label="Program" value={program} set={v=>choose(setProgram,v)} options={Object.entries(PIPELINE_PROGRAMS).map(([k,p])=>[k,p.name])}/>
      <Choice label="Data forwarding" value={forward} set={v=>choose(setForward,v)} options={[["on","Enabled"],["off","Disabled: stall until registers are ready"]]}/>
    </Controls>
    <pre aria-label="Selected RISC-V program"><code>{PIPELINE_PROGRAMS[program].code.map((i,n)=>`${String(n*4).padStart(2)}: ${formatInstruction(i)}`).join('\n')}</code></pre>
    <Actions><button onClick={()=>setPosition(0)} disabled={index===0}>Reset</button><button onClick={()=>setPosition(Math.max(0,index-1))} disabled={index===0}>Previous cycle</button><button onClick={()=>setPosition(Math.min(result.trace.length-1,index+1))} disabled={index===result.trace.length-1}>Next cycle</button><button onClick={()=>setPosition(result.trace.length-1)}>Show final cycle</button></Actions>
    <Range label="Cycle" value={index+1} set={v=>setPosition(v-1)} min={1} max={result.trace.length}/>
    <Figure title={`Pipeline occupancy in cycle ${row.cycle}`} description={row.slots.map((i,n)=>`${STAGES[n]}: ${formatInstruction(i)}`).join('. ')} height={140} dense>
      {STAGES.map((stage,n)=><g key={stage}><rect x={n*120+5} y={20} width={105} height={85} fill={row.slots[n]?accent:'none'} fillOpacity={.09} stroke="currentColor"/><text x={n*120+57} y={47} textAnchor="middle">{stage}</text><text x={n*120+57} y={73} textAnchor="middle">{row.slots[n]?`PC ${row.slots[n].pc}`:'Bubble'}</text><text x={n*120+57} y={94} textAnchor="middle">{row.slots[n]?.op||'—'}</text>{n<4&&<Arrow x1={n*120+111} y1={60} x2={n*120+123} y2={60}/>}</g>)}
    </Figure>
    <Results><p><strong>Cycle {row.cycle}</strong> of {result.cycles}</p><p>Completed: <strong>{row.retired}</strong></p><p>Stalls so far: <strong>{row.stalls}</strong></p><p>Canceled so far: <strong>{row.flushes}</strong></p></Results>
    <div aria-live="polite"><p><strong>During this cycle:</strong> {row.events.length?row.events.join(' '):'Instructions advance without an architectural write.'}</p>{row.forwarded.length>0&&<p><strong>Forwarded operands:</strong> {row.forwarded.join('. ')}.</p>}</div>
    <table><caption>State after this cycle completes</caption><thead><tr><th>x0</th><th>x1</th><th>x2</th><th>x3</th><th>x4</th><th>Memory [0]</th><th>Memory [4]</th></tr></thead><tbody><tr>{[...row.registers.slice(0,5),row.memory[0],row.memory[4]].map((v,i)=><td key={i}>{v}</td>)}</tr></tbody></table>
    <div tabIndex={0} style={{overflowX:'auto'}} aria-label="Pipeline timing table. Scroll horizontally to inspect all cycles."><table><caption>Instruction timing. A repeated IF or ID is a stall. Cancel marks a discarded instruction.</caption><thead><tr><th>Instruction</th>{result.trace.map(r=><th key={r.cycle} style={{background:r.cycle===row.cycle?'var(--hw-bg-elevated)':'transparent'}}>{r.cycle}</th>)}</tr></thead><tbody>{instructions.map(i=><tr key={i.uid}><th scope="row" style={{whiteSpace:'nowrap'}}>PC {i.pc}: {formatInstruction(i)}</th>{result.trace.map(r=>{const stage=r.slots.findIndex(s=>s?.uid===i.uid);return <td key={r.cycle}>{r.canceled.includes(i.uid)?'Cancel':stage<0?'·':STAGES[stage]}</td>;})}</tr>)}</tbody></table></div>
    <Note>Separate instruction and data memories each take one cycle. Branches resolve in EX. Stores receive their data in EX. There are no cache misses or exceptions. All registers start at zero. Memory [0] starts at 12. This is an instruction subset, not a complete RISC-V emulator.</Note>
  </Tool>;
}
