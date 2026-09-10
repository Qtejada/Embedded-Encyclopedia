import test from 'node:test';
import assert from 'node:assert/strict';
import {registerField,motorPoint,buckPoint} from '../src/components/learning/interviewModels.mjs';
const near=(a,b,t=1e-6)=>assert.ok(Math.abs(a-b)<t,`${a} differs from ${b}`);
test('register example and boundary fields retain unsigned values',()=>{
  assert.equal(registerField(0xB6,3,3),6);
  assert.equal(registerField(255,0,8),255);
  assert.equal(registerField(128,7,1),1);
  assert.equal(registerField(127,7,1),0);
});
test('motor electrical power balances copper and converted mechanical power',()=>{
  for(const fraction of [0,.1,.5,1]){
    const p=motorPoint(12,1,.02,fraction);
    near(12*p.current,p.current**2+p.torque*p.rpm*2*Math.PI/60);
  }
  near(motorPoint(12,1,.02,1).current,12);
  near(motorPoint(12,1,.02,1).rpm,0);
});
test('buck waveforms satisfy volt-second and charge balance',()=>{
  for(const duty of [.2,.4,.5,.8]){
    const points=Array.from({length:10000},(_,i)=>buckPoint((i+.5)/10000,duty));
    near(points.reduce((s,p)=>s+p.inductorVoltage,0)/points.length,0);
    near(points.reduce((s,p)=>s+p.capacitorCurrent,0)/points.length,0);
    near(points.reduce((s,p)=>s+p.capacitorVoltage,0)/points.length,0);
    for(const phase of [duty/3,(1+duty)/2]){
      const h=1e-6;
      const derivative=(buckPoint(phase+h,duty).capacitorVoltage-buckPoint(phase-h,duty).capacitorVoltage)/(2*h);
      near(derivative,buckPoint(phase,duty).capacitorCurrent/.8);
    }
  }
});
