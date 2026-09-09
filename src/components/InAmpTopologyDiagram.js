import React from 'react';
import {Tool, Figure, Note} from './learning/LearningTools';
function Resistor({x,y,label,vertical=false}) {return <g><rect x={x} y={y} width={vertical?18:44} height={vertical?38:18} fill="var(--ifm-background-color)" stroke="currentColor" /><text x={vertical?x-8:x+22} y={vertical?y+25:y-7} textAnchor={vertical?'end':'middle'}>{label}</text></g>;}
function Amp({x,y,label,plusTop=true}) {return <g><path d={`M${x} ${y} L${x} ${y+60} L${x+70} ${y+30} Z`} fill="none" stroke="currentColor" strokeWidth="2" /><text x={x+10} y={y+21}>{plusTop?'+':'−'}</text><text x={x+10} y={y+51}>{plusTop?'−':'+'}</text><text x={x+31} y={y+35}>{label}</text></g>;}
export default function InAmpTopologyDiagram() {return <Tool title="Three-op-amp instrumentation circuit"><Figure title="Complete symmetrical instrumentation amplifier" description="V1 drives the upper input amplifier. V2 drives the lower input amplifier. Equal feedback resistors R connect their outputs to their inverting inputs. RG joins the inverting-input feedback nodes. A third amplifier subtracts the upper output from the lower output using matched R2 over R1 resistor ratios, with the reference connected through the lower R2." width={700} height={370} dense>
  <Amp x={130} y={35} label="A1" /><Amp x={130} y={245} label="A2" plusTop={false} /><Amp x={460} y={140} label="A3" plusTop={false} />
  <g fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M35 50 H130 M35 290 H130 M130 80 H110 V260 H130 M200 65 H240 V125 H110 M200 275 H240 V215 H110" />
    <path d="M240 65 H400 V155 H460 M240 275 H400 V185 H460 M530 170 H655 M570 170 V110 H430 V155 M400 185 V330 H550" />
  </g>
  <Resistor x={158} y={116} label="R" /><Resistor x={158} y={206} label="R" /><Resistor x={101} y={151} label="RG" vertical /><Resistor x={292} y={56} label="R1" /><Resistor x={292} y={266} label="R1" /><Resistor x={483} y={101} label="R2" /><Resistor x={435} y={321} label="R2" />
  {[['110','125'],['110','215'],['240','65'],['240','275'],['430','155'],['400','185'],['570','170']].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="currentColor" />)}
  <text x="10" y="42">V1</text><text x="10" y="320">V2</text><text x="600" y="154">Vout</text><text x="555" y="336">Vref</text><text x="130" y="360">Input gain stage</text><text x="430" y="360">Matched difference stage</text>
  </Figure><Note>Ideal topology. Both R2/R1 ratios must match. Supply pins, decoupling, and protection are omitted. For a real device, check every internal-stage output range.</Note></Tool>;}
