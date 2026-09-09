import React, {useState} from 'react';
import {Tool, Controls, Choice, Actions, Results, Note} from './learning/LearningTools';
import {canArbitration} from './learning/calculations.mjs';
export default function CanArbitrationExplorer() {
  const [other, setOther] = useState('296'), [step, setStep] = useState(0);
  const r = canArbitration(288, Number(other));
  const decided = r.difference >= 0 && step >= r.difference;
  return <Tool title="CAN arbitration stepper"><Controls><Choice label="Node B identifier" value={other} set={v => {setOther(v);setStep(0);}} options={[["296","0x128"],["280","0x118"],["288","0x120 (same identifier)"]]} /></Controls>
    <Actions><button onClick={() => setStep(Math.max(0,step-1))} disabled={step===0}>Previous bit</button><button onClick={() => setStep(Math.min(10,step+1))} disabled={step===10}>Next bit</button><button onClick={() => setStep(0)}>Restart</button></Actions>
    <div style={{overflowX:'auto'}}><table><caption>Identifier bits, most significant first. Brackets mark the selected bit.</caption><thead><tr><th scope="col">Node</th>{Array.from({length:11},(_,i)=><th key={i} scope="col">{10-i}</th>)}</tr></thead><tbody>{[['A: 0x120',r.bitsA],['B',r.bitsB]].map(([name,bits])=><tr key={name}><th scope="row">{name}</th>{[...bits].map((bit,i)=><td key={i} style={{fontWeight:step===i?'bold':undefined}}>{step===i?`[${bit}]`:bit}</td>)}</tr>)}</tbody></table></div>
    <Results><p>Selected bit: <strong>{10-step}</strong></p><p>{r.difference === -1 ? 'Identifiers match. The identifier alone does not select a winner.' : decided ? `Identifier 0x${r.winner.toString(16).toUpperCase()} wins at bit ${10-r.difference}.` : 'Both nodes still compete. No different identifier bit has occurred.'}</p></Results>
    <Note>Standard 11-bit data frames. Zero is dominant. Bit stuffing, later frame fields, and extended identifiers are excluded. The losing node stops driving after the first difference.</Note></Tool>;
}
