import React, {useState} from 'react';
import {Tool, Actions, Results, Note, Figure, Box, Arrow} from './learning/LearningTools';
export default function SequentialLogicExplorer() {
  const [request,setRequest]=useState(false),[active,setActive]=useState(false),[clocks,setClocks]=useState(0);
  return <Tool title="Moore and Mealy state experiment"><Actions><button aria-pressed={request} onClick={()=>setRequest(!request)}>Request: {request?'1':'0'}</button><button onClick={()=>{setActive(request);setClocks(clocks+1);}}>Apply clock edge</button><button onClick={()=>{setRequest(false);setActive(false);setClocks(0);}}>Reset experiment</button></Actions>
    <Figure title="Two-state machine" description={`Stored state is ${active?'active':'idle'}. A clock transfers the request to the next state.`} height={170}><Box x={55} y={60} w={150} label="Idle" /><Box x={395} y={60} w={150} label="Active" /><Arrow x1={205} y1={75} x2={395} y2={75} /><Arrow x1={395} y1={110} x2={205} y2={110} /><text x="300" y="45" textAnchor="middle">Request 1 + clock</text><text x="300" y="150" textAnchor="middle">Request 0 + clock</text></Figure>
    <Results><p>Stored state: <strong>{active?'Active':'Idle'}</strong></p><p>Moore output: <strong>{active?1:0}</strong></p><p>Mealy output: <strong>{!active&&request?1:0}</strong></p><p>Clock edges: <strong>{clocks}</strong></p></Results><Note>This example defines Moore output = active state and Mealy output = request while idle. Ideal logic excludes metastability and propagation delay.</Note></Tool>;
}
