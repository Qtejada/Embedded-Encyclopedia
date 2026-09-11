import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import circuits from '../components/learning/data/circuit-index.json';

export default function CircuitLibrary(){
  const [query,setQuery]=useState('');
  const [group,setGroup]=useState('All topics');
  const base=useBaseUrl('/simulations/');
  const matches=circuits.filter(c=>(group==='All topics'||c.group===group)&&`${c.title} ${c.intro}`.toLowerCase().includes(query.toLowerCase()));
  return <Layout title="LTspice circuits" description="54 circuit examples with editable schematics and verified simulation results.">
    <main className="container margin-vert--xl" style={{maxWidth:1000}}>
      <h1>LTspice circuits</h1>
      <p>Explore component behavior, then combine the basic circuit blocks. Each example links to its lesson and includes an editable schematic, plot settings, instructions, original data, and a validation record.</p>
      <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',margin:'2rem 0'}}>
        <label>Find a circuit<br/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="JFET, current mirror, filter…" style={{padding:'.6rem',maxWidth:'100%',width:320}}/></label>
        <label>Topic<br/><select value={group} onChange={e=>setGroup(e.target.value)} style={{padding:'.6rem'}}>{['All topics',...new Set(circuits.map(c=>c.group))].map(g=><option key={g}>{g}</option>)}</select></label>
      </div>
      <p role="status">{matches.length} of {circuits.length} circuits</p>
      <ul style={{listStyle:'none',padding:0}}>{matches.map(c=><li key={c.slug} style={{borderTop:'1px solid var(--ifm-color-emphasis-300)',padding:'1.3rem 0'}}>
        <h2 style={{fontSize:'1.3rem',marginBottom:'.4rem'}}><Link to={c.url}>{c.title}</Link></h2>
        <p style={{marginBottom:'.5rem'}}>{c.intro}</p>
        <a href={`${base}${c.slug}/${c.slug}.zip`} download>Download LTspice files (.zip)</a>
      </li>)}</ul>
      <h2>Open an example</h2>
      <ol><li>Extract the ZIP into a folder.</li><li>Open the ASC file in LTspice and select Run.</li><li>Use View → Step Legend to identify the parameter settings.</li><li>If a plot does not appear, use Plot Settings → Open Plot Settings File and select the included PLT file.</li></ol>
      <p>The website displays saved LTspice results. The included CIR is an equivalent netlist. Op-amp examples use UniversalOpamp2, which is supplied with LTspice.</p>
    </main>
  </Layout>;
}
