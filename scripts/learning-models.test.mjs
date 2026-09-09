import test from 'node:test';
import assert from 'node:assert/strict';
import {divider, converter, shunt, inrush, ldo, rectifier, pullup, reflection, drift, noise, bga, canArbitration, uartBits} from '../src/components/learning/calculations.mjs';
const near = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual-expected)<tolerance, `${actual} != ${expected}`);

test('loaded divider reproduces the independent worked example', () => {
  near(divider(5,10000,10000,100000).voltage, 50/21);
  near(divider(5,10000,10000,1e12).voltage, 2.5, 1e-7);
});
test('converter examples and continuous-current boundary', () => {
  const buck = converter('buck',12,5/12,22e-6,500e3,1);
  near(buck.voltage,5); near(buck.ripple,35/132); near(buck.peak,1+35/264);
  const boost = converter('boost',5,7/12,22e-6,500e3,.2);
  near(boost.voltage,12); near(boost.average,.48);
  const inv = converter('inverting',5,.5,22e-6,500e3,.2);
  near(inv.voltage,-5); near(inv.peak,.4+5/44);
  assert.ok(converter('boost',5,.7,10e-6,100e3,.05).valley<0);
});
test('current shunt separates offset and shared-copper errors', () => {
  const kelvin=shunt(5,.01,20e-6,50);
  near(kelvin.power,.25); near(kelvin.offsetError,.002); near(kelvin.reading,5.002);
  near(shunt(5,.01,20e-6,50,.001).reading,5.502);
  near(shunt(.01,.01,-20e-6,50).reading,.008);
});
test('power examples use consistent SI units', () => {
  near(inrush(100e-6,5,.005),.1);
  const heat=ldo(5,3.3,.2,100,50);
  near(heat.power,.34); near(heat.junction,84); near(heat.efficiency,66);
  const dc=rectifier(9,.7,.1,50,1000e-6);
  near(dc.ripple,1); near(dc.valley,10.327922061357856);
});
test('I2C resistor window and rise-time examples', () => {
  const r=pullup(3.3,.4,.003,200e-12,300e-9,1500);
  near(r.min,966.6666666666666); near(r.max,1770.3292812463118,1e-5);
  near(r.rise,254.19e-9); near(r.lowCurrent,.0019333333333333333);
});
test('reflection handles matched, open, and short loads', () => {
  near(reflection(1,50,50,100).first,2/3);
  near(reflection(1,50,50,50).gamma,0);
  near(reflection(1,50,50,Infinity).first,1);
  near(reflection(1,50,50,0).first,0);
});
test('clock error has direction and zero noise stays zero', () => {
  near(drift(20,30),51.84); near(drift(-20,30),-51.84);
  near(noise(3,4,10000),500); near(noise(0,0,10000),0);
});
test('BGA equality and negative margin are distinct', () => {
  assert.ok(bga(.8,.4,.08,.08,2).fits);
  near(bga(.8,.4,.08,.08,2).margin,0);
  assert.ok(!bga(.5,.26,.08,.08,2).fits);
});
test('CAN arbitration changes winner and handles equal identifiers', () => {
  const r=canArbitration(0x120,0x128);
  assert.equal(r.winner,0x120); assert.equal(10-r.difference,3);
  assert.equal(canArbitration(0x120,0x118).winner,0x118);
  assert.equal(canArbitration(0x120,0x120).difference,-1);
});
test('UART sends start, least-significant bit first, and stop', () => {
  assert.deepEqual(uartBits(1),[0,1,0,0,0,0,0,0,0,1]);
  assert.deepEqual(uartBits(255),[0,1,1,1,1,1,1,1,1,1]);
});
