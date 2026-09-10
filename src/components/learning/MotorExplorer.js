import React, {useState} from 'react';
import {Tool, Controls, Range, Figure, Results, Note, accent} from './LearningTools';
import {motorPoint} from './interviewModels.mjs';
export default function MotorExplorer() {
  const [voltage,setVoltage]=useState(12), [load,setLoad]=useState(35);
  const point=motorPoint(voltage,1,.02,load/100);
  const noLoad=motorPoint(voltage,1,.02,0), stall=motorPoint(voltage,1,.02,1);
  return <Tool title="Motor torque and speed">
    <Controls><Range label="Applied voltage" value={voltage} set={setVoltage} min={3} max={12} unit="V"/>
      <Range label="Torque as a fraction of stall torque" value={load} set={setLoad} min={0} max={100} unit="%"/></Controls>
    <Figure title="Linear motor speed versus torque" description="At fixed voltage, speed decreases as torque and current increase. The selected point follows the ideal line." height={300} dense>
      <path d="M70 30V240H550" stroke="currentColor" fill="none"/>
      <path d="M70 45L540 240" stroke={accent} strokeWidth="3" fill="none"/>
      <circle cx={70+4.7*load} cy={45+1.95*load} r="7" fill={accent}/>
      <text x={80} y={27}>{noLoad.rpm.toFixed(0)} rpm at zero torque</text>
      <text x={75} y={265}>0 N·m</text><text x={540} y={265} textAnchor="end">{stall.torque.toFixed(2)} N·m at stall</text>
      <text x={310} y={292} textAnchor="middle">Electromagnetic torque →</text>
    </Figure>
    <Results><p>Speed: <strong>{point.rpm.toFixed(0)} rpm</strong></p><p>Current: <strong>{point.current.toFixed(2)} A</strong></p>
      <p>Torque: <strong>{point.torque.toFixed(3)} N·m</strong></p><p>Copper loss: <strong>{(point.current**2).toFixed(2)} W</strong></p></Results>
    <Note>Assumed R = 1 Ω, torque constant = 0.02 N·m/A, and back EMF constant = 0.02 V·s/rad. This is not a thermal rating.</Note>
  </Tool>;
}
