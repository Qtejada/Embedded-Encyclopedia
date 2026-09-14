# High Speed Digital


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Edge Time Sets the Problem

A digital signal can need [transmission-line](<./03-trace-impedance.md#1-characteristic-impedance>) analysis even when its clock frequency is low. A fast edge contains high-frequency energy.

Compare the time the signal takes to travel along the route with the time its edge takes to rise or fall. Clock frequency alone does not tell you whether the route needs transmission-line analysis.

For an approximate propagation velocity **v** and route length **l**:

<LearningEquation tex={"t_{flight}=\\frac{l}{v}"} />

## 2. Worked Example: A Slow Clock with a Fast Edge

**Assumptions:** A 1 MHz clock has a 1 ns rise time. Its trace is 150 mm long. Propagation velocity is 150 mm/ns.

1. One-way flight time is **1 ns**.
2. Round-trip time is **2 ns**.
3. The clock period is **1000 ns**.

The long clock period does not remove [reflections](<./03-trace-impedance.md#3-reflections>) during the 1 ns transition. Analyze the line and receiver response.

## 3. Timing and Signal Integrity

**Skew** is a time difference between related signals. Equal physical lengths do not guarantee equal delay if the routes use different structures.

**[Crosstalk](<./01-Overview.md#53-crosstalk-and-separation>)** transfers energy between nearby interconnections. A closer reference plane can reduce field spread, but geometry and routing still matter.

**Loss** reduces high-frequency content. Vias, connectors, and capacitors can also create impedance changes.

## 4. Routing Sequence

1. Record interface impedance, skew, loss, and topology limits.
2. Select the stackup and reference plane for each route.
3. Place connectors, termination, and coupling components.
4. Route critical signals with continuous [return paths](<./02-Return-Paths.md#1-a-signal-needs-a-return>).
5. Include package and via delay where the timing method needs them.
6. Tune length only after the route topology is correct.

## 5. Worked Example: Convert Skew to Length

**Assumptions:** The remaining route-skew budget is 20 ps. Both routes have 6 ps/mm delay.

<LearningEquation tex={"\\Delta l_{max}=\\frac{20\\ ps}{6\\ ps/mm}\\approx3.33\\ mm"} />

This is a budget example, not a universal interface rule. If package skew already consumes 8 ps, only **2 mm** remains for board mismatch.

## 6. BGA Escape and Verification

Short narrow sections can help a **[ball grid array](<./05-Packaging.md#wafer-die-and-package>) (BGA)** escape. Check their impedance effect with the complete channel.

Backdrilling removes an unused via stub, but its clearance can reduce routing space. Coordinate this process before routing.

**References:** [TI, high-speed interface layout](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf), [AMD UG1099, routing and backdrilling trade-offs](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Layer-Count-Optimization).


## Eye diagrams and interference

import EyeExplorer from '@site/src/components/learning/EyeExplorer';

<EyeExplorer />

An **eye diagram** draws many symbol intervals on top of one another. The open area shows where a receiver can distinguish the levels. A narrower eye leaves less timing margin; a shorter eye leaves less voltage margin.

Jitter makes transitions occur at different times, while noise spreads out the voltage levels. Channel loss and reflections also distort the signal, often by different amounts for different bit patterns.

A test **mask** defines a prohibited region under specified measurement conditions. A trace entering the mask fails that mask test.

A clear eye from a short capture does not prove a required bit error rate. Use the specified pattern, receiver model, sample count, and compliance method.

Improve the eye through suitable termination, lower loss, reduced coupling, controlled edges, or [equalization](<./03-trace-impedance.md#preemphasis-and-equalization>). Change one cause at a time and remeasure.

A **monotonic transition** crosses the receiver's decision region in one direction without turning back. Ringing that crosses a threshold repeatedly can look like extra edges and trigger false events.

An edge that is too slow increases uncertainty about when it crosses the threshold and can increase current inside the receiver. An unnecessarily fast edge adds high-frequency content and can produce ringing at impedance changes.

**Electromagnetic interference (EMI)** is unwanted electromagnetic disturbance. Fast voltage changes couple through capacitance. Fast current changes couple through [mutual inductance](<../01-Discrete-Components/02-Magnetics/01-Transformers.md#1-magnetic-coupling>).

Reduce loop area, maintain nearby return paths, and separate sensitive routes from switching nodes. A plane between layers reduces coupling more reliably than orthogonal routing alone.

**Desense** is reduced receiver sensitivity caused by interference. Keep clocks and converters away from sensitive radio paths and filter interference at its source.

A conductive shield gives a controlled path for induced currents. Seams, apertures, and poor bonds can reduce its effectiveness.

Connect the shield to the intended chassis or reference structure with a suitable high-frequency bond. Place it around the source or protected receiver as the design needs.

A **Faraday cage** is a conductive enclosure. It can reduce electric-field coupling but does not automatically block low-frequency magnetic fields.

## Power integrity as an impedance budget

**Power integrity (PI)** concerns the voltage delivered at the load across time and frequency. **Signal integrity (SI)** concerns the waveform received by the signal input.

<LearningEquation tex={"Z_{target}\\approx\\frac{\\Delta V_{allowed}}{\\Delta I_{load}}"} />

This target is a first design bound, not a complete stability model. For an assumed 50 mV allowance and 5 A step, it is 10 milliohms.

Processor loads combine switching capacitance, leakage, and time-varying activity. They are not accurately represented by one fixed resistor over all operating states.

Measure at the load with a small probe loop. Trigger on excursions to capture rare supply spikes. Include package and board impedance in the analysis.
