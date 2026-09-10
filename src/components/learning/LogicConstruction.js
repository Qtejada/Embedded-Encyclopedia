import React, {useState} from 'react';
import {Tool, Controls, Choice, Figure, Results, Note, accent} from './LearningTools';
export default function LogicConstruction() {
  const [gate,setGate]=useState('NAND');
  const [a,setA]=useState('0'),[b,setB]=useState('0');
  const av=Number(a),bv=Number(b);
  const result=gate==='NAND'?1-(av&bv):gate==='NOR'?1-(av|bv):1-av;
  return <Tool title="CMOS logic connections">
    <Controls><Choice label="Gate" value={gate} set={setGate} options={['NOT','NAND','NOR'].map(x=>[x,x])}/>
      <Choice label="Input A" value={a} set={setA} options={[[0,'0'],[1,'1']]}/>
      {gate!=='NOT'&&<Choice label="Input B" value={b} set={setB} options={[[0,'0'],[1,'1']]}/>}</Controls>
    <Figure title={`${gate} transistor network`} description={`${gate==='NOT'?'One P-channel transistor above one N-channel transistor':gate==='NAND'?'Parallel P-channel pullup and series N-channel pulldown':'Series P-channel pullup and parallel N-channel pulldown'}. Boxes represent transistor networks, not complete device symbols.`} height={270} dense>
      <path d="M300 25V55M300 115V155M300 215V245M300 135H530" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x={135} y={55} width={330} height={60} fill={result?accent:'none'} fillOpacity=".12" stroke="currentColor"/>
      <rect x={135} y={155} width={330} height={60} fill={!result?accent:'none'} fillOpacity=".12" stroke="currentColor"/>
      <text x={300} y={20} textAnchor="middle">VDD</text><text x={300} y={90} textAnchor="middle">{gate==='NOT'?'P-channel, gate A':gate==='NAND'?'P(A) ∥ P(B)':'P(A) in series with P(B)'}</text>
      <text x={300} y={190} textAnchor="middle">{gate==='NOT'?'N-channel, gate A':gate==='NAND'?'N(A) in series with N(B)':'N(A) ∥ N(B)'}</text>
      <text x={535} y={141}>Y = {result}</text><text x={300} y={265} textAnchor="middle">Ground</text>
    </Figure>
    <Results><p>Output Y: <strong>{result}</strong></p><p>{result?'Pullup path conducts.':'Pulldown path conducts.'}</p></Results>
    <table><thead><tr><th>A</th>{gate!=='NOT'&&<th>B</th>}<th>Y</th></tr></thead><tbody>
      {(gate==='NOT'?[[0,0],[1,0]]:[[0,0],[0,1],[1,0],[1,1]]).map(([x,y])=><tr key={`${x}${y}`}><td>{x}</td>{gate!=='NOT'&&<td>{y}</td>}<td>{gate==='NOT'?1-x:gate==='NAND'?1-(x&y):1-(x|y)}</td></tr>)}</tbody></table>
    <Note>Ideal steady states only. During a real input transition, both networks can conduct briefly.</Note>
  </Tool>;
}
