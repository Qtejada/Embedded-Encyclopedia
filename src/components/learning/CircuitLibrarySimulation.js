import React, {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SpiceBatchSimulation from './SpiceBatchSimulation';

export default function CircuitLibrarySimulation({circuit}) {
  const host=useRef(null);
  const [data,setData]=useState(null);
  const [failed,setFailed]=useState(false);
  const url=useBaseUrl(`/simulations/${circuit}/viewer.json`);
  const download=useBaseUrl(`/simulations/${circuit}/${circuit}.zip`);
  useEffect(()=>{
    const controller=new AbortController();
    const load=async()=>{
      try {
        const response=await fetch(url,{signal:controller.signal});
        if(!response.ok) throw new Error('Cannot load circuit');
        setData(await response.json());
      } catch(error) {if(error.name!=='AbortError') setFailed(true);}
    };
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();load();}
    },{rootMargin:'500px'});
    observer.observe(host.current);
    return ()=>{observer.disconnect();controller.abort();};
  },[url]);
  return <div ref={host} style={{minHeight:120}}>
    {data?<SpiceBatchSimulation circuit={circuit} data={data}/>:<p role="status">{failed?'The plot could not load. You can still download the circuit.':'Loading saved circuit results…'} <a href={download} download>Download LTspice example</a></p>}
  </div>;
}
