import React, {useState} from 'react';
import {Tool, Actions, Figure, Note, accent} from './LearningTools';
function Wire({d}) {return <path d={d} fill="none" stroke="currentColor" strokeWidth="2"/>;}
function Switch({x,y,on,label}) {return <g><Wire d={`M${x} ${y}h10m40 0h10`}/><path d={`M${x+10} ${y}L${x+50} ${on?y:y-18}`} stroke={accent} strokeWidth="3"/><text x={x+30} y={y+28} textAnchor="middle">{label}</text></g>;}
export default function ConverterPaths({mode}) {
  const [phase,setPhase]=useState(0), boost=mode==='boost';
  return <Tool title={boost?'Boost current paths':'Doubler switch connections'}>
    <Actions><button type="button" aria-pressed={phase===0} onClick={()=>setPhase(0)}>{boost?'Switch on':'Phase 1: charge'}</button>
      <button type="button" aria-pressed={phase===1} onClick={()=>setPhase(1)}>{boost?'Switch off':'Phase 2: transfer'}</button></Actions>
    <Figure title={boost?'Boost power circuit':'Two-phase switched-capacitor doubler'} description={boost?'An inductor joins input to the switch node. The switch joins that node to ground. A diode joins that node to the output capacitor and load.':'A flying capacitor first connects between input and ground, then between output and input. Four abstract switches implement these connections.'} height={boost?290:365} dense>
      {boost?<>
        <Wire d="M40 65H115q0 -20 12 -20t12 20q0 -20 12 -20t12 20H280M280 65H335M365 65H540M280 65V130M280 190V240M40 240H540M455 65V135m-15 0h30m-30 12h30m-15 0v93M530 65V130m-12 0h24v45h-24zM530 175V240"/>
        <path d="M335 50L365 65L335 80ZM365 48V82" fill="none" stroke="currentColor" strokeWidth="2"/>
        <g transform="translate(280 130) rotate(90)"><Switch x={0} y={0} on={phase===0} label=""/></g>
        <text x={40} y={40}>Vin</text><text x={145} y={30}>L</text><text x={320} y={38}>Diode</text><text x={440} y={40}>Vout</text>
        <text x={295} y={171}>Switch</text><text x={474} y={146}>C</text><text x={550} y={152}>Load</text><text x={40} y={264}>Ground</text>
      </>:<>
        <Wire d="M35 70H85M145 70H260V145m-20 0h40m-40 14h40m-20 0v81H145M85 240H35M260 70H350M410 70H540M260 240H350M410 240H470M500 70V145m-15 0h30m-30 14h30m-15 0v150H35"/>
        <Switch x={85} y={70} on={phase===0} label="S1"/><Switch x={85} y={240} on={phase===0} label="S2"/>
        <Switch x={350} y={70} on={phase===1} label="S3"/><Switch x={350} y={240} on={phase===1} label="S4"/>
        <text x={35} y={46}>Vin</text><text x={35} y={220}>Ground</text><text x={470} y={224}>Vin</text><text x={450} y={45}>Vout</text>
        <text x={235} y={174} textAnchor="end">Flying capacitor</text><text x={525} y={155}>Cout</text><text x={35} y={336}>Ground</text>
      </>}
    </Figure>
    <Note>{boost?(phase===0?'The inductor stores energy. The diode blocks and the output capacitor supplies the load.':'The switch opens. Inductor current passes through the diode into the output.'):
      (phase===0?'S1 and S2 close. The flying capacitor charges to Vin. The output capacitor supplies the load.':'S3 and S4 close. The lower plate rises to Vin and the upper plate transfers charge near 2 × Vin.')}</Note>
    {!boost&&<Note>Abstract ideal switches show the topology. A controller must insert nonoverlap. The load connects across Cout and is omitted for clarity.</Note>}
  </Tool>;
}
