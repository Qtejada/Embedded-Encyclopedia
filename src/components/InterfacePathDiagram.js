import React from 'react';
import {Tool, Figure, Box, Arrow, Note} from './learning/LearningTools';
export default function InterfacePathDiagram({mode}) {
  const ethernet=mode==='ethernet';
  const labels=ethernet?['Processor / MAC','PHY','Magnetics','Connector']:['Host','Bus interface','FIFO + UART','Serial peer'];
  return <Tool title={ethernet?'Ethernet interface path':'Protocol bridge path'}><Figure title={ethernet?'Processor to cable architecture':'Host to serial bridge architecture'} description={ethernet?'The processor MAC connects digitally to the PHY. The PHY connects through suitable magnetics to the cable connector.':'The host accesses a bridge over a serial bus. The bridge buffers bytes and transfers them through a UART to a peer.'} height={220} dense>
    {labels.map((label,i)=><g key={label}><Box x={5+i*150} y={70} w={140} h={60} label={label} />{i<3&&<Arrow x1={145+i*150} y1={100} x2={155+i*150} y2={100} />}</g>)}
    <text x="300" y="35" textAnchor="middle">{ethernet?'Digital interface · physical layer · cable':'Transactions · buffering · serial frames'}</text><text x="300" y="185" textAnchor="middle">Data can travel in both directions.</text>
  </Figure><Note>{ethernet?'Functional diagram for a conventional transformer-coupled port. Clock, management, power, and protection connections are omitted.' : 'Functional diagram. The bridge does not automatically provide cable-level translation or electrical isolation.'}</Note></Tool>;
}
