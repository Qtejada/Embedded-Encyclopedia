import test from 'node:test';
import assert from 'node:assert/strict';
import {PIPELINE_PROGRAMS as P,simulatePipeline} from '../src/components/learning/pipelineModel.mjs';
test('independent instructions fill and drain in N + 4 cycles',()=>{
 const r=simulatePipeline(P.independent.code);assert.equal(r.cycles,8);assert.equal(r.retired,4);assert.equal(r.stalls,0);assert.deepEqual(r.registers.slice(1,5),[3,5,7,9]);
});
test('youngest producer wins over an older matching register',()=>{
 const r=simulatePipeline(P.forwarding.code);assert.equal(r.cycles,9);assert.deepEqual(r.registers.slice(1,4),[9,18,9]);
});
test('load-use adds one bubble and forwards the correct store value',()=>{
 const r=simulatePipeline(P.load.code);assert.equal(r.cycles,8);assert.equal(r.stalls,1);assert.equal(r.registers[2],24);assert.equal(r.memory[4],24);
});
test('disabled forwarding stalls but preserves architectural results',()=>{
 for(const p of Object.values(P)){const a=simulatePipeline(p.code),b=simulatePipeline(p.code,{forwarding:false});assert.deepEqual(b.registers,a.registers,p.name);assert.deepEqual(b.memory,a.memory,p.name);assert.ok(b.cycles>=a.cycles);}
});
test('taken branch cancels wrong-path register and memory writes',()=>{
 const r=simulatePipeline(P.branch.code);assert.equal(r.cycles,10);assert.equal(r.flushes,2);assert.equal(r.retired,4);assert.equal(r.memory[0],12);assert.equal(r.memory[4],7);assert.equal(r.registers[2],7);
});
test('zero register ignores writes and creates no dependency stall',()=>{
 const r=simulatePipeline([{op:'lw',rd:0,rs1:0,imm:0},{op:'addi',rd:1,rs1:0,imm:3}]);assert.equal(r.registers[0],0);assert.equal(r.registers[1],3);assert.equal(r.stalls,0);
});

test('a load into an immediate destination does not create a false source dependency',()=>{
 const r=simulatePipeline([{op:'lw',rd:1,rs1:0,imm:0},{op:'addi',rd:1,rs1:0,imm:5}]);assert.equal(r.stalls,0);assert.equal(r.registers[1],5);
});

test('load data reaches both branch comparison and store operands',()=>{
 const program=[{op:'lw',rd:1,rs1:0,imm:0},{op:'beq',rs1:1,rs2:0,imm:8},{op:'sw',rs1:0,rs2:1,imm:4}];
 const r=simulatePipeline(program);assert.equal(r.stalls,1);assert.equal(r.flushes,0);assert.equal(r.memory[4],12);
 const taken=simulatePipeline(program,{memory:{0:0,4:99}});assert.equal(taken.memory[4],99);assert.equal(taken.flushes,1);
});

test('generated straight-line programs match an independent sequential interpreter',()=>{
 let seed=20260911;const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let trial=0;trial<60;trial++){
   const code=[],expected=Array(32).fill(0),mem={0:12,4:0};
   for(let n=0;n<25;n++){
     const op=['add','sub','addi','lw','sw'][random(5)],rd=random(6),rs1=op==='lw'||op==='sw'?0:random(6),rs2=random(6),imm=op==='lw'||op==='sw'?4*random(2):random(31)-15;
     code.push({op,rd,rs1,rs2,imm});
     if(op==='sw')mem[imm]=expected[rs2];
     else if(rd!==0)expected[rd]=op==='add'?(expected[rs1]+expected[rs2])|0:op==='sub'?(expected[rs1]-expected[rs2])|0:op==='addi'?(expected[rs1]+imm)|0:mem[imm];
   }
   for(const forwarding of [false,true]){const r=simulatePipeline(code,{forwarding});assert.deepEqual(r.registers,expected);assert.deepEqual(r.memory,mem);assert.equal(r.retired,code.length);}
 }
});
