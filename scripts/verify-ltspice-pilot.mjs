import {restoreSiteWording} from './approved-site-wording.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const hash=b=>createHash('sha256').update(b).digest('hex');
const originals=JSON.parse(fs.readFileSync(path.join(root,'scripts/ltspice-originals.json')));
for(const original of originals){
  const bytes=fs.readFileSync(path.join(root,original.path));
  const text=restoreSiteWording(original.path,bytes.toString('utf8').replace(/\r\n/g,'\n'));
  assert.equal(hash(text.slice(0,original.normalizedLength)),original.normalizedSha256,original.path);
  // These three articles receive append-only LTspice batches. Their newer
  // baseline and allowed additions are checked by verify-ltspice-batch-one.py.
  if(!/\/(01-Diodes\.md|02-BJTs\.md|03-MOSFETs\.mdx|01-op-amps\.md|02-differential-amps\.md|comparators\.md|Active-filters\.md)$/.test(original.path)) assert.equal(text.length,original.normalizedLength,`Unexpected article edit: ${original.path}`);
}
const dir=path.join(root,'static/simulations/bjt-current-mirror');
const validation=JSON.parse(fs.readFileSync(path.join(dir,'validation.json')));
assert.equal(hash(fs.readFileSync(path.join(dir,'bjt-current-mirror.asc'))),validation.ascSha256);
const curves=JSON.parse(fs.readFileSync(path.join(root,'src/components/learning/data/current-mirror.json')));
assert.equal(curves.cases.length,3);
for(const c of curves.cases){
  assert.equal(c.points.length,501);
  const check=validation.checks.find(x=>x.resistanceOhms===c.resistance);
  assert.ok(Math.abs(c.points[100][1]/1000-check.outputAt1V_A)<1e-12);
  assert.ok(Math.abs(c.points[500][1]/1000-check.outputAt5V_A)<1e-12);
  for(const [i,p] of c.points.entries()){
    assert.equal(p[0],i/100);
    assert.ok(p.every(Number.isFinite));
    assert.ok(Math.abs(p[2]/1000-(5-p[3])/c.resistance)<1e-10);
  }
}
const source=fs.readFileSync(path.join(root,'src/components/learning/CurrentMirrorSimulation.js'),'utf8');
assert.ok(!/[ÂÃÎ]/.test(source),'Corrupted UTF-8 display labels');
for(const name of ['bjt-current-mirror.asc','bjt-current-mirror.plt','bjt-current-mirror.cir','bjt-current-mirror.zip','README.txt','results.csv','validation.json']) assert.ok(fs.statSync(path.join(dir,name)).size>0);
console.log(`PASS: ${originals.length} pre-pilot articles preserved, three 501-point curves agree with LTspice validation, and download artifacts exist.`);
