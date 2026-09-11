import React, {useState} from 'react';
import {Tool, Controls, Choice, Figure, Box, Arrow, Note, accent} from './LearningTools';

const descriptions = {
  ADD: 'ADD reads two registers. The ALU adds their values. The result passes through MEM without a data-memory access and returns to rd in WB.',
  LW: 'LW reads a base register. The ALU adds the signed immediate to form an address. Data memory supplies the value that WB writes to rd.',
  SW: 'SW reads a base register and a data register. The ALU forms the address. MEM stores the data. SW does not write a register.',
  BEQ: 'BEQ compares two register values in EX. If they match, the processor selects PC plus the signed branch offset and cancels younger instructions.',
};
export default function ProcessorDatapath() {
  const [op, setOp] = useState('LW');
  const memory = op === 'LW' || op === 'SW';
  const writes = op === 'LW' || op === 'ADD';
  return <Tool title="Trace an instruction through the datapath">
    <Controls><Choice label="Instruction" value={op} set={setOp} options={Object.keys(descriptions).map(v => [v, v])} /></Controls>
    <Figure title={`${op} datapath`} height={345} dense description={descriptions[op]} caption="Conceptual data paths. Pipeline registers also carry destination indices and control bits.">
      {[['IF', 65], ['ID', 185], ['EX', 305], ['MEM', 425], ['WB', 545]].map(([label, x]) => <text key={label} x={x} y={25} textAnchor="middle" fontWeight="bold">{label}</text>)}
      {[125, 245, 365, 485].map((x, i) => <g key={x}><line x1={x} x2={x} y1={38} y2={290} stroke="currentColor" strokeDasharray="3 5" opacity=".35" /><text x={x} y={310} textAnchor="middle" fontSize="11">{['IF/ID', 'ID/EX', 'EX/MEM', 'MEM/WB'][i]}</text></g>)}
      <Box x={20} y={60} w={90} h={38} label="PC" />
      <Arrow x1={65} y1={98} x2={65} y2={125} />
      <Box x={15} y={125} w={100} h={65} label="Instruction" />
      <text x={65} y={205} textAnchor="middle" fontSize="12">memory</text>
      <Arrow x1={115} y1={157} x2={135} y2={157} />
      <Box x={135} y={125} w={100} h={65} label="Registers" />
      <text x={185} y={215} textAnchor="middle" fontSize="12">Decode and</text>
      <text x={185} y={233} textAnchor="middle" fontSize="12">immediate</text>
      <Arrow x1={235} y1={157} x2={255} y2={157} />
      <Box x={255} y={125} w={100} h={65} label={op === 'BEQ' ? 'Compare' : 'ALU'} />
      <text x={305} y={215} textAnchor="middle" fontSize="12">{memory ? 'Base + offset' : op === 'ADD' ? 'rs1 + rs2' : 'PC + offset'}</text>
      <g opacity={op === 'BEQ' ? .3 : 1}><Arrow x1={355} y1={157} x2={375} y2={157} /><Box x={375} y={125} w={100} h={65} label={memory ? 'Data memory' : 'Pass result'} /></g>
      {op === 'SW' && <><Arrow x1={235} y1={175} x2={240} y2={175} /><Arrow x1={240} y1={175} x2={240} y2={265} /><Arrow x1={240} y1={265} x2={425} y2={265} /><Arrow x1={425} y1={265} x2={425} y2={190} /><text x={305} y={285} textAnchor="middle" fontSize="12">Store data follows the instruction</text></>}
      <g opacity={writes ? 1 : .3}><Arrow x1={475} y1={157} x2={495} y2={157} /><Box x={495} y={125} w={100} h={65} label="WB select" /><Arrow x1={545} y1={190} x2={545} y2={245} /><Arrow x1={545} y1={245} x2={130} y2={245} /><Arrow x1={130} y1={245} x2={130} y2={110} /><Arrow x1={130} y1={110} x2={185} y2={110} /><Arrow x1={185} y1={110} x2={185} y2={125} /></g>
      {writes && <text x={450} y={235} textAnchor="middle" fontSize="12">Write rd</text>}
      {op === 'BEQ' && <><Arrow x1={305} y1={125} x2={305} y2={79} /><Arrow x1={305} y1={79} x2={110} y2={79} /><text x={205} y={65} textAnchor="middle" fontSize="12" fill={accent}>Taken branch target</text></>}
    </Figure>
    <Note>{descriptions[op]}</Note>
    <Note>The normal next PC is PC + 4. Forwarding selectors and the normal PC increment path are omitted here. The cycle explorer models forwarding separately.</Note>
  </Tool>;
}
