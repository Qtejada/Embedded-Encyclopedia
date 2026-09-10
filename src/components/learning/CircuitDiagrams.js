import React from 'react';
import {Figure, accent} from './LearningTools';
function Wire({d}) {return <path d={d} stroke="currentColor" strokeWidth="2" fill="none"/>;}
function Switch({x,y,label}) {return <g><Wire d={`M${x} ${y}v12m0 30v12`}/><path d={`M${x} ${y+12}l15 28`} stroke={accent} strokeWidth="2"/><text x={x+23} y={y+32}>{label}</text></g>;}
export function BuckCircuit(){return <Figure title="Synchronous buck circuit" description="Upper and lower switches form a half bridge. The switch node feeds a series inductor and an output capacitor in parallel with the load. An input capacitor connects across the input rails." height={285} dense>
  <Wire d="M30 40H170V65M170 119V158M170 212V245H30M170 245H550M170 140H270q0 -18 12 -18t12 18q0 -18 12 -18t12 18H550M70 40V125m-14 0h28m-28 14h28m-14 0v106M410 140V187m-14 0h28m-28 14h28m-14 0v44M535 140V175h-10v40h20v-40h-10M535 215V245"/>
  <Switch x={170} y={65} label="Upper"/><Switch x={170} y={158} label="Lower"/>
  <text x={30} y={25}>Vin</text><text x={20} y={170}>Cin</text><text x={285} y={103}>L</text><text x={430} y={115}>Vout</text><text x={430} y={205}>Cout</text><text x={540} y={165}>Load</text><text x={35} y={273}>Ground</text>
</Figure>;}
export function HBridgeCircuit(){return <Figure title="H-bridge switch topology" description="Two half bridges connect to opposite motor terminals. The upper-left and lower-right switches drive forward. The other diagonal drives reverse. Never close both switches in one leg." height={290} dense>
  <Wire d="M80 35H500M150 35V55M450 35V55M150 109V168M450 109V168M150 222V250M450 222V250M80 250H500M150 140H265M335 140H450"/>
  <Switch x={150} y={55} label="Q1"/><Switch x={150} y={168} label="Q2"/><Switch x={450} y={55} label="Q3"/><Switch x={450} y={168} label="Q4"/>
  <circle cx={300} cy={140} r={35} stroke="currentColor" fill="none"/><text x={300} y={146} textAnchor="middle">Motor</text><text x={80} y={22}>Bus +</text><text x={80} y={277}>Ground</text>
</Figure>;}
export function ButtonLedCircuit(){return <Figure title="GPIO button and LED connections" description="An input has a pullup to the logic supply and a switch to ground. A separate output drives an LED through a series resistor. Both circuits share the MCU ground." height={250} dense>
  <Wire d="M120 35V60h-10v40h20V60h-10M120 100V145H245M120 145V175m0 35v20M325 100H385h0m0 -10v20h50V90h-50M435 100H480M505 100H555V230"/>
  <path d="M120 175l14 33M480 86L505 100L480 114ZM505 84V116M509 80l10 -10m-6 0h6v6M520 90l10 -10m-6 0h6v6" fill="none" stroke={accent} strokeWidth="2"/>
  <text x={80} y={24}>Logic supply</text><text x={142} y={82}>Pullup</text><text x={190} y={132}>GPIO input</text><text x={140} y={197}>Button</text>
  <text x={325} y={69}>GPIO output</text><text x={387} y={130}>Series R</text><text x={480} y={66}>LED</text><text x={110} y={248}>Ground</text><text x={510} y={248}>Ground</text>
</Figure>;}
