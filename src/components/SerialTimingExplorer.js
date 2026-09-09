import React, {useState} from 'react';
import {Tool, Controls, Range, Choice, Results, Note, Figure, accent, secondary} from './learning/LearningTools';
import {uartBits} from './learning/calculations.mjs';
function digitalPath(bits, x, y, step) {
  return bits.map((b, i) => `${i ? 'L' : 'M'}${x + i * step} ${y - b * 32} H${x + (i + 1) * step}`).join(' ');
}
export default function SerialTimingExplorer({mode}) {
  const [byte, setByte] = useState(165), [spiMode, setSpiMode] = useState('0'), [baud, setBaud] = useState('115200');
  const bits = uartBits(byte), cpol = Number(spiMode) >> 1, cpha = Number(spiMode) & 1;
  const data = Array.from({length: 8}, (_, i) => (byte >> (7 - i)) & 1);
  const clock = Array.from({length: 17}, (_, i) => cpol ^ (i % 2));
  const values = clock.map((_, i) => i < cpha ? 0 : data[Math.min(7, Math.floor((i - cpha) / 2))]);
  return <Tool title={mode === 'uart' ? 'UART frame explorer' : 'SPI sampling-edge explorer'}><Controls><Range label="Data byte" value={byte} set={setByte} min={0} max={255} />{mode === 'uart' ? <Choice label="Bit rate" value={baud} set={setBaud} options={[["9600", "9600 bits/s"], ["115200", "115200 bits/s"]]} /> : <Choice label="SPI mode" value={spiMode} set={setSpiMode} options={[0,1,2,3].map(v => [String(v), `Mode ${v}`])} />}</Controls>
    {mode === 'uart' ? <Figure title="8N1 UART waveform" description={`Byte ${byte}, least significant bit first. One low start bit, eight data bits, and one high stop bit.`} height={200} dense>
      {bits.map((b, i) => <g key={i}><line x1={50+i*50} y1="40" x2={50+i*50} y2="155" stroke="currentColor" opacity=".2" /><text x={75+i*50} y="35" textAnchor="middle">{i === 0 ? 'Start' : i === 9 ? 'Stop' : `D${i-1}`}</text><text x={75+i*50} y="145" textAnchor="middle">{b}</text></g>)}
      <path d={digitalPath(bits, 50, 105, 50)} stroke={accent} strokeWidth="3" fill="none" /><text x="300" y="185" textAnchor="middle">Time → · {bits.length} bit periods</text>
    </Figure> : <Figure title="SPI clock and data waveform" description={`Mode ${spiMode}. Idle clock ${cpol}. Data uses most significant bit first. Sampling occurs on ${cpha ? 'second' : 'first'} edges. Dots mark samples.`} height={220} dense>
      <text x="0" y="65">CLK</text><text x="0" y="150">Data</text><path d={digitalPath(clock, 60, 80, 28)} fill="none" stroke="currentColor" strokeWidth="2" /><path d={digitalPath(values, 60, 160, 28)} fill="none" stroke={secondary} strokeWidth="3" />
      {data.map((b, i) => <g key={i}><line x1={60+(2*i+1+cpha)*28} y1="35" x2={60+(2*i+1+cpha)*28} y2="175" stroke={accent} strokeDasharray="4 4" /><circle cx={60+(2*i+1+cpha)*28} cy={160-b*32} r="4" fill={accent} /><text x={60+(2*i+1+cpha)*28} y="205" textAnchor="middle">{b}</text></g>)}
    </Figure>}
    <Results><p>Byte: <strong>0x{byte.toString(16).toUpperCase().padStart(2,'0')}</strong></p>{mode === 'uart' ? <><p>Bit time: <strong>{(1e6/Number(baud)).toFixed(3)} µs</strong></p><p>Frame time: <strong>{(1e6*10/Number(baud)).toFixed(3)} µs</strong></p></> : <p>Sample on the <strong>{Number(spiMode) === 0 || Number(spiMode) === 3 ? 'rising' : 'falling'} edge</strong>.</p>}</Results>
    <Note>{mode === 'uart' ? 'Non-inverted logic-level UART. Data order is least significant bit first. Gaps and clock mismatch are excluded.' : 'Selected transaction only. Chip select remains active throughout. Ideal edges exclude propagation, setup, and hold delays.'}</Note></Tool>;
}
