import React, {useState} from 'react';
import {Tool, Actions, Note, Figure, Arrow, accent, secondary} from './learning/LearningTools';
export default function ReturnPathExplorer() {
  const [slot,setSlot]=useState(false);
  return <Tool title="Reference-plane continuity"><Actions><button aria-pressed={!slot} onClick={()=>setSlot(false)}>Continuous plane</button><button aria-pressed={slot} onClick={()=>setSlot(true)}>Plane with a slot</button></Actions>
    <Figure title="Forward signal and plane return" description={slot?'The signal crosses above a plane slot. The return current takes a longer path around the slot.':'The high-frequency return follows near the forward trace on the continuous plane.'} height={300}>
      <rect x="45" y="55" width="510" height="175" rx="8" fill={secondary} opacity=".12" stroke="currentColor" />{slot&&<rect x="280" y="55" width="40" height="125" fill="var(--ifm-background-color)" stroke="currentColor" strokeDasharray="4 3" />}
      <Arrow x1={70} y1={100} x2={530} y2={100} /><text x="70" y="37">Forward trace above the plane</text>
      {slot?<><path d="M530 130 H335 V200 H265 V130 H70" fill="none" stroke={secondary} strokeWidth="4" strokeDasharray="7 4" /><Arrow x1={140} y1={130} x2={70} y2={130} color={secondary} /><text x="328" y="175">Slot</text></>:<Arrow x1={530} y1={135} x2={70} y2={135} color={secondary} />}
      <text x="65" y="260">Return current: {slot?'longer detour':'near the trace'}</text><text x="65" y="286">Plane beneath the signal layer</text>
    </Figure><Note>The dashed path illustrates a return-current detour. Real current spreads over the plane. No field strength or impedance is calculated.</Note></Tool>;
}
