import React from 'react';
import {Tool, Note, Figure, Box, Arrow, accent} from './learning/LearningTools';
export default function ProtectionPathDiagram() {
  return <Tool title="Transient-current path"><Figure title="TVS shunt path at a power entry" description="A connector feeds a series fuse and the protected circuit. A TVS connects from the protected supply to the entry return. The short shunt path carries transient current." height={290} dense>
    <Box x={15} y={40} w={100} label="Connector" /><Box x={175} y={45} w={100} h={50} label="Fuse" /><Box x={450} y={40} w={140} label="Circuit" />
    <path d="M115 70 H175 M275 70 H450 M345 70 V135 M345 190 V235 H65 V100 M520 100 V235 H345" fill="none" stroke="currentColor" strokeWidth="2" />
    <Box x={305} y={135} w={80} h={55} label="TVS" /><circle cx="345" cy="70" r="4" fill={accent} /><Arrow x1={325} y1={90} x2={325} y2={125} /><Arrow x1={325} y1={202} x2={325} y2={223} /><Arrow x1={305} y1={220} x2={145} y2={220} /><text x="190" y="270">Entry return · short surge loop</text>
  </Figure><Note>Functional power-entry diagram. Select polarity, fuse position, and return connection for the actual fault model. Components have separate surge limits.</Note></Tool>;
}
