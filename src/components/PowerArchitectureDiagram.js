import React, {useState} from 'react';
import {Tool, Choice, Controls, Figure, Box, Arrow, Note} from './learning/LearningTools';
export default function PowerArchitectureDiagram() {
  const [mode,setMode]=useState('linear');
  const names={linear:['DC input','Pass device','Output capacitor','Load'],switch:['DC input','Switching stage','Inductor + C','Load'],rectifier:['AC source','Bridge rectifier','Reservoir C','Regulator'],flyback:['DC input','Primary switch','Coupled winding','Rectifier + C']};
  return <Tool title="Power-conversion architecture"><Controls><Choice label="Architecture" value={mode} set={setMode} options={[["linear","Linear regulator"],["switch","Switching regulator"],["rectifier","AC rectifier path"],["flyback","Flyback energy path"]]} /></Controls>
    <Figure title={`${mode} functional path`} description={names[mode].join(' to ')+'. This is a functional diagram, not a construction schematic.'} height={250} dense>
      {names[mode].map((label,i)=><g key={label}><Box x={5+i*150} y={55} w={140} h={60} label={label} />{i<3&&<Arrow x1={145+i*150} y1={85} x2={155+i*150} y2={85} />}</g>)}
      {mode==='linear'||mode==='switch'?<><path d="M525 115 V205 H225 V125" fill="none" stroke="currentColor" strokeDasharray="5 4" /><text x="300" y="185">Feedback control</text></>:<text x="300" y="180" textAnchor="middle">{mode==='flyback'?'Store during on-time. Deliver during off-time.':'Rectification does not provide isolation.'}</text>}
      <text x="300" y="238" textAnchor="middle">{mode==='linear'?'Excess input power becomes heat.':mode==='switch'?'Switching controls average energy delivery.':'Protection and startup circuits are omitted.'}</text>
    </Figure><Note>{mode==='flyback'?'The winding is an energy-storage coupled inductor. A complete design needs flux, leakage, insulation, and control analysis.' : 'Original functional drawing. It does not reproduce a numbered source figure. Supply return and detailed component connections are omitted.'}</Note></Tool>;
}
