import React, {useState} from 'react';
import {Tool, Choice, Controls, Note, Results, Figure, accent, secondary} from './learning/LearningTools';
export default function ChargeProfileDiagram() {
  const [stage,setStage]=useState('cc');
  const stages={pre:[60,100,'Reduced current for a permitted recovery condition.'],cc:[160,200,'Current remains limited while cell voltage rises.'],cv:[360,150,'Voltage remains regulated while current decreases.'],done:[510,55,'Charging stops after the required termination conditions.']};
  return <Tool title="Lithium-ion charging states"><Controls><Choice label="Charging stage" value={stage} set={setStage} options={[["pre","Precharge"],["cc","Constant current"],["cv","Constant voltage"],["done","Termination"]]} /></Controls>
    <Figure title="Conceptual cell-voltage and charge-current curves" description="Voltage rises through precharge and constant-current stages, then remains constant. Current is low in precharge, higher in constant current, decreases during constant voltage, and stops at termination." height={270} dense>
      <rect x={stages[stage][0]} y="30" width={stages[stage][1]} height="180" fill={accent} opacity=".1" /><path d="M60 25 V210 H570" fill="none" stroke="currentColor" />
      <path d="M60 180 L160 155 L360 60 H565" stroke={accent} strokeWidth="3" fill="none" /><path d="M60 175 H160 V105 H360 Q435 175 510 183 V210 H565" stroke={secondary} strokeWidth="3" fill="none" />
      <text x="385" y="47">Cell voltage</text><text x="385" y="140">Charge current</text><text x="65" y="240">Precharge</text><text x="180" y="240">Constant I</text><text x="365" y="240">Constant V</text><text x="520" y="240">Stop</text>
    </Figure><Results><p>{stages[stage][2]}</p></Results><Note>Conceptual curves with separate arbitrary vertical scales. Stage durations and thresholds are not to scale. Use the exact cell and charger limits.</Note></Tool>;
}
