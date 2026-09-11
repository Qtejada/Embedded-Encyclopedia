import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

const base='/docs/Discrete-Components/Semicondctors/';
const circuits=[
  ['Half-wave rectifier','Diodes#ltspice-example-half-wave-rectifier','Compare the unfiltered output with two reservoir capacitors.'],
  ['Full-wave bridge rectifier','Diodes#ltspice-example-full-wave-bridge-rectifier','Follow the two current paths and compare ripple.'],
  ['JFET self bias','MOSFETs#ltspice-example-jfet-self-bias','Change the source resistor and examine the supply sweep.'],
  ['N-channel and P-channel switches','MOSFETs#ltspice-example-n-channel-and-p-channel-switches','Compare low-side and high-side load control.'],
  ['Common-emitter amplifier','BJTs#ltspice-example-common-emitter-amplifier','Compare gain, phase, and emitter bypass.'],
];

export default function SpiceBatchOne(){
  const zip=useBaseUrl('/simulations/ltspice-batch-one.zip');
  return <Layout title="LTspice circuit batch one" description="Five verified LTspice learning circuits.">
    <main className="container margin-vert--xl" style={{maxWidth:900}}>
      <h1>LTspice circuit batch one</h1>
      <p><Link to="/ltspice-circuits">Browse the complete circuit library</Link></p>
      <p>Five circuit examples with editable schematics, plot settings, instructions, and verified simulation data.</p>
      <p><a className="button button--primary" href={zip} download>Download all five circuits (.zip)</a></p>
      <ol>{circuits.map(([title,url,description])=><li key={title} style={{marginBottom:'1.2rem'}}><Link to={base+url}><strong>{title}</strong></Link><p>{description}</p></li>)}</ol>
      <h2>Test a circuit</h2>
      <ol><li>Extract the ZIP. Keep each circuit's files in its own folder.</li><li>Open the ASC file in LTspice and select Run.</li><li>Use the step legend to identify the three parameter settings.</li><li>Compare the traces with the lesson. Each folder includes instructions if plot settings do not load.</li></ol>
      <p>The circuit files include the component parameters. The browser displays saved LTspice results.</p>
    </main>
  </Layout>;
}
