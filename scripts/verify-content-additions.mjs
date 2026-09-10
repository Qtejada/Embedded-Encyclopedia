import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import katex from 'katex';
import {restoreBeforeInlineLinks} from './inline-link-utils.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/content-originals.json')));
let changed = 0, equations = 0;
for (const entry of baseline.documents) {
  const current = restoreBeforeInlineLinks(entry.path, fs.readFileSync(path.join(root, entry.path)));
  const originalPrefix = current.subarray(0, entry.bytes);
  assert.equal(createHash('sha256').update(originalPrefix).digest('hex'), entry.sha256, `Original writing changed: ${entry.path}`);
  const addition = current.subarray(entry.bytes).toString('utf8');
  if (addition.trim()) changed++;
  assert.ok(!/\bthus\b/i.test(addition), `Prohibited word in addition: ${entry.path}`);
  assert.ok(!addition.includes('$$'), `Unrendered math block: ${entry.path}`);
  for (const match of addition.matchAll(/<LearningEquation tex=\{("(?:[^"\\]|\\.)*")\} \/>/g)) {
    katex.renderToString(JSON.parse(match[1]), {throwOnError: true, trust: false, strict: 'error'});
    equations++;
  }
}
const phil = baseline.documents.find(entry => entry.path.endsWith('Phils-lab.md'));
assert.equal(fs.statSync(path.join(root, phil.path)).size, phil.bytes, "Phil's Lab must remain unchanged");
console.log(`PASS: ${baseline.documents.length} original documents preserved byte for byte as prefixes after removing recorded inline-link wrappers.`);
console.log(`PASS: ${changed} expanded pages, ${equations} valid equations, no prohibited word in additions.`);
console.log("PASS: Phil's Lab unchanged.");
