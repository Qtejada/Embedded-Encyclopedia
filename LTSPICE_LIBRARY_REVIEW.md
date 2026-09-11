# LTspice circuit library update

## Summary

- Added 48 circuits to the six approved examples: 54 circuits in total.
- Added 144 new parameter cases. Each new case has a normal and refined LTspice run.
- Appended 48 lessons to seven existing articles.
- Added a searchable circuit index and navigation link.
- Extended the existing viewer for frequency sweeps, phase, new symbols, and on-demand loading.
- Added ZIP downloads with ASC, CIR, PLT, README, CSV, and validation JSON.
- Removed simulation labels and older site labels that described components as teaching models. Technical assumptions remain.
- Preserved existing text outside those authorized label edits. The audit manifests record each exception.

## Circuits added

| Circuit | Short summary |
| --- | --- |
| Zener shunt regulator | A series resistor supplies a Zener diode and a parallel load. |
| Diode limiter and DC clamp | One path limits voltage. A separate capacitor and diode path shifts the waveform level. |
| BJT switch and base drive | A base resistor controls a transistor that switches a resistor load. |
| BJT emitter follower | The emitter follows the base voltage with a base to emitter voltage difference. |
| Common-base amplifier | A signal enters the emitter while the base stays at a fixed voltage. |
| Emitter degeneration and current gain | Two amplifier paths compare complete emitter bypass with partial emitter bypass. |
| MOSFET common-source amplifier | A drain resistor converts channel-current changes into an inverted output voltage. |
| MOSFET source follower | The source voltage follows the gate while the drain connects to the supply. |
| MOSFET gate charging and switching energy | A gate resistor controls how quickly gate capacitance receives charge. |
| JFET output characteristics | Separate gate and drain sources expose the JFET device characteristic. |
| JFET transfer characteristics | Separate gate and drain sources expose the JFET device characteristic. |
| JFET common-source amplifier | The source resistor sets DC bias, and its bypass capacitor increases signal gain. |
| JFET source follower | A JFET supplies a source signal with high gate input resistance. |
| Two-terminal JFET current sink | A JFET and source resistor form a current sink between the drain and ground. |
| PNP current mirror | A PNP mirror supplies current from the positive rail into a load. |
| Current mirror with emitter resistors | Equal emitter resistors add local feedback to the two mirror transistors. |
| Wilson current mirror | A third transistor feeds current back into the mirror base node. |
| Cascode current mirror | A second transistor above each mirror branch holds the lower collector voltage nearly constant. |
| MOSFET current mirror | Two MOSFETs share gate and source voltages to copy a reference current. |
| Op-amp controlled current sink | An op-amp drives a MOSFET until the sense-resistor voltage equals the command voltage. |
| Differential pair with resistor tail | Two transistors share an emitter resistor and steer current between their collectors. |
| Differential pair with current-source tail | A constant tail current fixes the total current available to a differential pair. |
| Differential pair with mirror load | A PNP mirror combines the two branch-current changes into one output. |
| BJT cascode amplifier | A common-base transistor sits above a common-emitter transistor. |
| Complementary output stage and class AB bias | An NPN and a PNP transistor supply opposite halves of the load current. |
| Precision half-wave rectifier | An op-amp and two diodes rectify small signals without losing a full diode drop at the output. |
| Inverting and noninverting amplifiers | Two feedback networks demonstrate the sign and magnitude of closed-loop voltage gain. |
| Buffer and source loading | A voltage follower separates a high-resistance source from its load. |
| Summing amplifier | Two input resistors feed a common summing node. |
| Four-resistor difference amplifier | Matched resistor ratios reject a shared input voltage and amplify the difference. |
| Practical integrator | A feedback capacitor converts input current into a changing output voltage. |
| Band-limited differentiator | An input capacitor converts changes in input voltage into current. |
| Transimpedance amplifier | An op-amp converts input current to output voltage through a feedback resistor. |
| Closed-loop gain and bandwidth | Higher closed-loop gain reduces the bandwidth of a dominant-pole op-amp. |
| Slew-rate limiting | A limited output slope prevents a fast, large signal from following the input. |
| Output clipping | An amplifier cannot produce output voltage beyond its available supply range. |
| Capacitive load and isolation resistor | A series output resistor separates a capacitive load from the amplifier feedback node. |
| RC low-pass and high-pass filters | The same resistor and capacitor values produce opposite first-order filter responses. |
| Active low-pass and high-pass filters | Op-amps buffer first-order filters and add voltage gain. |
| Buffered band-pass filter | A high-pass stage rejects low frequencies, and a following low-pass stage rejects high frequencies. |
| Comparator with positive feedback | Positive feedback creates separate switching thresholds for rising and falling input. |
| Transistor Schmitt trigger | Two transistors share an emitter resistor that creates positive feedback. |
| Short pulse from an input step | A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse. |
| Transistor pulse extension | A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse. |
| Discrete amplifier with negative feedback | A differential pair, voltage-gain transistor, and emitter follower form a feedback amplifier. |
| JFET and BJT feedback amplifier | A JFET input, PNP gain transistor, and NPN follower share a feedback path. |
| JFET input stage with op-amp feedback | An op-amp holds the JFET drain voltage near a reference while returning feedback to its source. |
| JFET differential pair inside a feedback loop | A JFET differential pair drives an op-amp, and the output returns to the second gate. |

## Verification

- Actual ASC files ran in LTspice 24.1.9. Generated netlists match separately assembled expected connections.
- Refined runs use tighter tolerances and smaller time steps, finer DC steps, or denser AC sweeps.
- Each case passes numerical behavior checks. validation.json records the results and comparison errors.
- Newton or Gmin initialization retries are accepted only when LTspice subsequently completes the simulation.
- All 70 article prefixes reconstruct with the recorded wording exceptions. Historical source and subsection audits remain enabled.
- Every ZIP is checked against its source files. All 54 index links target a built lesson subsection.
- All 54 ZIP downloads were served byte-for-byte by the local production preview.
- The production build, 70 article routes, 1,655 local article links, and 490 historical subsection links pass.
- Browser checks cover search, parameter selection, phase plots, cursor controls, light and dark modes, and mobile layout.
- Git preserves simulation asset bytes so archive and schematic hashes remain valid after checkout.
- The browser displays saved results. It does not run LTspice.

## Scope and file notes

- Related variants share a schematic where useful: inverting/noninverting gain, low-pass/high-pass filters, and class B/class AB output stages.
- Schematics use standard symbols and named net connections. Equal node labels connect.
- Op-amp examples use UniversalOpamp2 from the LTspice installation. The ADI library is not redistributed.
- Semiconductor parameters are included. The circuits are original examples, not reproduced book figures.
- AC sweeps describe the linear response around the operating point. They do not establish large-signal behavior.
- The original half-bridge request remains interpreted as half-wave rectification, as recorded in the approved plan.
