"""Check retained article structure after the authorized readability rewrite.

This checks non-prose invariants, not semantic equivalence of rewritten prose.
The immutable baseline comes from the saved pre-rewrite sources.
"""
from pathlib import Path
import collections
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASELINE = json.loads((ROOT / 'scripts/readability-baseline.json').read_text(encoding='utf-8'))
failures = []
totals = collections.Counter()
for record in BASELINE['files']:
    text = (ROOT / record['path']).read_text(encoding='utf-8')
    for name, pattern in BASELINE['patterns'].items():
        values = re.findall(pattern, text, re.M)
        if name == 'linkDestinations':
            values.sort()
        actual = {'count': len(values), 'sha256': hashlib.sha256('\n\0\n'.join(values).encode()).hexdigest()}
        if actual != record['checks'][name]:
            failures.append(f"{record['path']}: {name}")
        totals[name] += len(values)
    if record['path'].endswith('/Phils-lab.md'):
        if hashlib.sha256(text.encode()).hexdigest() != record['beforeSha256']:
            failures.append("Phil's Lab changed")
    if re.search(r'\bthus\b', text, re.I):
        failures.append(f"{record['path']}: excluded word")
    if re.search(r'\*\*The (?:problem|fix):', text, re.I):
        failures.append(f"{record['path']}: canned label")
assert not failures, '\n'.join(failures)
print(f"PASS: retained structure across {len(BASELINE['files'])} documents; Phil's Lab unchanged.")
for name, count in totals.items():
    print(f'  {name}: {count}')
print('Prose meaning requires editorial review; hashes do not prove semantic equivalence.')
