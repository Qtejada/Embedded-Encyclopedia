"""Relocate viewers into the reading flow; preserve every existing prose block."""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[1]
D='docs/01-Discrete-Components/03-Semicondctors/01-Diodes.md'
B='docs/01-Discrete-Components/03-Semicondctors/02-BJTs.md'
F='docs/01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx'
O='docs/03-Signal-Modulation/Amplifiers/01-op-amps.md'
A='docs/03-Signal-Modulation/Amplifiers/02-differential-amps.md'
C='docs/03-Signal-Modulation/Amplifiers/comparators.md'
T='docs/03-Signal-Modulation/Filters/Active-filters.md'
placements={}
def put(file,before,*slugs):
 for slug in slugs:placements[slug]=(file,before)
put(D,'### B. Clamping (Simple Protection)','half-wave-rectifier','bridge-rectifier')
put(D,'### C. RC Snubbers and RCD Clamps','diode-limiter-clamp')
put(D,'## 2. Common Circuit Uses','zener-regulator')
put(O,'## 11. DC Accuracy and Input Limits','precision-rectifier')
put(B,'## 2. Ebers-Moll (Exponential Behavior)','bjt-switch')
put(B,'**Emitter Follower (Common Collector)**','common-emitter-amplifier')
put(B,'**Unity Phase Splitter (Transconductance-Amplifier Idea)**','emitter-follower')
put(B,'## 6. Current Sources and Mirrors','common-base-amplifier')
put(B,'## 9. BJTs Compared with FETs','emitter-degeneration','discrete-feedback-amplifier')
put(B,'## 7. Advanced Configurations and Power','bjt-current-mirror','pnp-current-mirror','degenerated-current-mirror','wilson-current-mirror','cascode-current-mirror')
put(B,'## 8. Negative Feedback and Stability','bjt-cascode-amplifier')
put(B,'**Class D Amplifiers:**','complementary-output-stage')
put(F,'## 4. Basic Applications','jfet-output-curves','jfet-transfer-curves','jfet-self-bias')
put(F,'### Analog Switches','mosfet-source-follower','jfet-source-follower')
put(F,'## 5. Analog Signal Switching','mosfet-switches')
put(F,'### BJT Current Sink and Mirror','jfet-current-source')
put(F,'### Hybrid JFET and Op-Amp Amplifier','jfet-bjt-feedback')
put(F,'### JFET Differential Amplifiers','jfet-opamp-feedback')
put(F,'## 8. Gate-Drive Dynamics','jfet-pair-feedback')
put(F,'## 9. Power MOSFET Design','mosfet-gate-charging')
put(F,'### Linear-Power Hot Spots','mosfet-current-mirror')
put(F,'**Enhancement and Depletion Devices**','mosfet-common-source','jfet-common-source')
put(O,'### High-Side Current Source','opamp-current-source')
put(O,'### Adjustable Inverter or Follower','opamp-gain-configurations')
put(O,'## 3. Negative-Feedback Theory','opamp-buffer-loading')
put(O,'### Non-Inverting Amplifier','opamp-summing')
put(O,'#### Component Clues','opamp-integrator')
put(T,'### 10. Sallen-Key Second-Order Low-Pass Filter','opamp-differentiator')
put(O,'## 8. Output-Current Boosters','transimpedance-amplifier')
put(O,'### Slew Rate','opamp-gain-bandwidth')
put(O,'### Capacitive Loading','opamp-slew-rate')
put(O,'### The Golden Rules','opamp-clipping')
put(O,'### Finite Loop-Gain Effects','capacitive-load-compensation')
put(A,'## 6. JFET Differential Pair','differential-pair','differential-pair-current-tail','differential-mirror-load')
put(A,'## 4. Why Resistor Matching Controls CMRR','opamp-difference')
put(T,'### 5. Differentiators and Integrators','rc-filter-pair')
put(T,'### 7. AC-Amplifier Low-Frequency Responses','active-filter-pair','active-bandpass')
put(C,'## 7. Dynamic Performance','comparator-hysteresis','transistor-schmitt-trigger')
put(C,'### Load and Power Control','short-pulse-generator','pulse-extension')
index=json.loads((R/'src/components/learning/data/circuit-index.json').read_text(encoding='utf-8-sig'))
assert set(placements)=={c['slug'] for c in index}
files={p:(R/p).read_text(encoding='utf-8') for p in {D,B,F,O,A,C,T}}
records={p:dict(path=p,beforeSha256=hashlib.sha256(text.encode()).hexdigest(),inserts=[],replacements=[]) for p,text in files.items()}
routes={p:'/docs/'+'/'.join(__import__('re').sub(r'^\d+-','',part) for part in Path(p).with_suffix('').parts[1:]) for p in files}
for item in index:
 slug=item['slug'];target,before=placements[slug]
 tag='<CurrentMirrorSimulation />' if slug=='bjt-current-mirror' else '<SpiceBatchSimulation circuit="'+slug+'" />' if slug in ['half-wave-rectifier','bridge-rectifier','jfet-self-bias','mosfet-switches','common-emitter-amplifier'] else '<CircuitLibrarySimulation circuit="'+slug+'" />'
 owners=[p for p,text in files.items() if tag in text];assert len(owners)==1,slug
 owner=owners[0];url=routes[target]+'#circuit-'+slug
 replacement='[Open this circuit beside its topic](<'+url+'>).'
 files[owner]=files[owner].replace(tag,replacement)
 records[owner]['replacements'].append(dict(before=tag,after=replacement))
 # The wrapper also lets historical rendered-text checks exclude only this new UI.
 block='\n<div data-ltspice-placement="'+slug+'">\n\n<details id="circuit-'+slug+'">\n<summary>LTspice: '+item['title']+'</summary>\n\n'+tag+'\n\n</details>\n\n</div>\n\n'
 assert files[target].count('\n'+before+'\n')==1,(slug,before)
 files[target]=files[target].replace('\n'+before+'\n',block+before+'\n')
 records[target]['inserts'].append(block)
 item['notesUrl']=item['url'];item['url']=url
 item['placement']=dict(article=target,before=before)
for p,text in files.items():
 (R/p).write_text(text,encoding='utf-8')
 records[p]['afterSha256']=hashlib.sha256(text.encode()).hexdigest()
(R/'scripts/ltspice-placement.json').write_text(json.dumps(list(records.values()),indent=2)+'\n',encoding='utf-8')
(R/'src/components/learning/data/circuit-index.json').write_text(json.dumps(index,indent=2)+'\n',encoding='utf-8')
print('Placed all 54 viewers beside their topics in seven articles.')
