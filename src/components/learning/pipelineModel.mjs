export const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];
const writes = i => i && ['add', 'sub', 'addi', 'lw'].includes(i.op) && i.rd !== 0;
const sources = i => !i ? [] : i.op === 'addi' || i.op === 'lw' ? [i.rs1] : ['add', 'sub', 'sw', 'beq'].includes(i.op) ? [i.rs1, i.rs2] : [];
const ins = (op, rd, rs1, rs2, imm = 0) => ({op, rd, rs1, rs2, imm});
export const PIPELINE_PROGRAMS = {
  independent: {name: 'Independent instructions', code: [ins('addi',1,0,0,3),ins('addi',2,0,0,5),ins('addi',3,0,0,7),ins('addi',4,0,0,9)]},
  forwarding: {name: 'Dependent ALU results', code: [ins('addi',1,0,0,3),ins('addi',1,1,0,2),ins('addi',1,1,0,4),ins('add',2,1,1),ins('sub',3,2,1)]},
  load: {name: 'Load, use, and store', code: [ins('lw',1,0,0,0),ins('add',2,1,1),ins('sw',0,0,2,4)]},
  branch: {name: 'Taken branch cancels a store', code: [ins('addi',1,0,0,1),ins('beq',0,1,1,12),ins('sw',0,0,1,0),ins('addi',2,0,0,99),ins('addi',2,0,0,7),ins('sw',0,0,2,4)]},
};
export function formatInstruction(i) {
  if (!i) return 'Bubble';
  if (['lw','sw'].includes(i.op)) return `${i.op} x${i.op==='lw'?i.rd:i.rs2}, ${i.imm}(x${i.rs1})`;
  if(i.op==='beq')return `beq x${i.rs1}, x${i.rs2}, +${i.imm}`;
  if(i.op==='addi')return `addi x${i.rd}, x${i.rs1}, ${i.imm}`;
  if(i.op==='nop')return 'nop';
  return `${i.op} x${i.rd}, x${i.rs1}, x${i.rs2}`;
}
// Explicit teaching model: separate one-cycle memories, EX branch resolution,
// WB visible to ID in the same cycle, and store data captured in EX.
export function simulatePipeline(program, {forwarding=true, memory={0:12,4:0}, limit=200}={}) {
  let registers=Array(32).fill(0), mem={...memory}, serial=0, pc=0, retired=0, stalls=0, flushes=0;
  const fetch = address => address>=0 && address%4===0 && address/4<program.length ? {...program[address/4],pc:address,uid:serial++} : null;
  let slots=[fetch(pc),null,null,null,null];pc+=4;
  const trace=[];
  for(let cycle=1;slots.some(Boolean);cycle++) {
    if(cycle>limit)throw new Error('Teaching program exceeded its cycle limit.');
    const [f,d,e,m,w]=slots, events=[], forwarded=[];
    registers=[...registers];mem={...mem};
    if(w){retired++;if(writes(w)){registers[w.rd]=w.result|0;events.push(`WB writes x${w.rd} = ${w.result|0}.`);}}
    registers[0]=0;
    let toWB=m?{...m}:null;
    if(m?.op==='lw'){toWB.result=mem[m.result>>>0]??0;events.push(`MEM loads ${toWB.result} from address ${m.result>>>0}.`);}
    if(m?.op==='sw'){mem[m.result>>>0]=m.store|0;events.push(`MEM stores ${m.store|0} at address ${m.result>>>0}.`);}
    function operand(reg,latched) {
      if(reg===0)return 0;
      if(forwarding&&writes(m)&&m.rd===reg&&m.op!=='lw'){forwarded.push(`EX/MEM → EX: x${reg} = ${m.result|0}`);return m.result|0;}
      if(forwarding&&writes(w)&&w.rd===reg){forwarded.push(`MEM/WB → EX: x${reg} = ${w.result|0}`);return w.result|0;}
      return latched|0;
    }
    let toMEM=e?{...e}:null,taken=false,target=0;
    if(e){
      const a=operand(e.rs1,e.a),b=sources(e).length>1?operand(e.rs2,e.b):0;
      if(['add','sub'].includes(e.op))toMEM.result=(e.op==='add'?a+b:a-b)|0;
      if(['addi','lw','sw'].includes(e.op))toMEM.result=(a+e.imm)|0;
      if(e.op==='sw')toMEM.store=b;
      if(e.op==='beq'){taken=a===b;target=e.pc+e.imm;events.push(`EX compares ${a} and ${b}. Branch ${taken?'taken':'not taken'}.`);}
    }
    const needs=sources(d).filter(r=>r!==0);
    const hazard=forwarding ? e?.op==='lw'&&writes(e)&&needs.includes(e.rd) : [e,m].some(p=>writes(p)&&needs.includes(p.rd));
    let next, canceled=[];
    if(taken){
      canceled=[d,f].filter(Boolean).map(i=>i.uid);flushes+=canceled.length;
      next=[fetch(target),null,null,toMEM,toWB];pc=target+4;
      events.push(`Redirect fetch to address ${target}. Cancel ${canceled.length} younger instructions.`);
    } else if(hazard){
      stalls++;next=[f,d,null,toMEM,toWB];
      events.push('Hold IF and ID. Insert a bubble into EX for the next cycle.');
    } else {
      const decoded=d?{...d,a:registers[d.rs1]??0,b:registers[d.rs2]??0}:null;
      next=[fetch(pc),f,decoded,toMEM,toWB];pc+=4;
    }
    trace.push({cycle,slots,registers,memory:mem,events,forwarded:[...new Set(forwarded)],stalled:!!hazard&&!taken,canceled,retired,stalls,flushes});
    slots=next;
  }
  return {trace,registers,memory:mem,cycles:trace.length,retired,stalls,flushes};
}
