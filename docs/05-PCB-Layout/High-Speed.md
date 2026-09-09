# High Speed Digital

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Edge Time Sets the Problem

A digital signal can need transmission-line analysis even when its clock frequency is low. A fast edge contains high-frequency energy.

Compare signal propagation time with rise and fall time. Do not classify a route from clock frequency alone.

For an approximate propagation velocity **v** and route length **l**:

<LearningEquation tex={"t_{flight}=\\frac{l}{v}"} />

## 2. Worked Example: A Slow Clock with a Fast Edge

**Assumptions:** A 1 MHz clock has a 1 ns rise time. Its trace is 150 mm long. Propagation velocity is 150 mm/ns.

1. One-way flight time is **1 ns**.
2. Round-trip time is **2 ns**.
3. The clock period is **1000 ns**.

The long clock period does not remove reflections during the 1 ns transition. Analyze the line and receiver response.

## 3. Timing and Signal Integrity

**Skew** is a time difference between related signals. Equal physical lengths do not guarantee equal delay if the routes use different structures.

**Crosstalk** transfers energy between nearby interconnections. A closer reference plane can reduce field spread, but geometry and routing still matter.

**Loss** reduces high-frequency content. Vias, connectors, and capacitors can also create impedance changes.

## 4. Routing Sequence

1. Record interface impedance, skew, loss, and topology limits.
2. Select the stackup and reference plane for each route.
3. Place connectors, termination, and coupling components.
4. Route critical signals with continuous return paths.
5. Include package and via delay where the timing method requires them.
6. Tune length only after the route topology is correct.

## 5. Worked Example: Convert Skew to Length

**Assumptions:** The remaining route-skew budget is 20 ps. Both routes have 6 ps/mm delay.

<LearningEquation tex={"\\Delta l_{max}=\\frac{20\\ ps}{6\\ ps/mm}\\approx3.33\\ mm"} />

This is a budget example, not a universal interface rule. If package skew already consumes 8 ps, only **2 mm** remains for board mismatch.

## 6. BGA Escape and Verification

Short narrow sections can help a **ball grid array (BGA)** escape. Check their impedance effect with the complete channel.

Backdrilling removes an unused via stub, but its clearance can reduce routing space. Coordinate this process before routing.

**References:** [TI, high-speed interface layout](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf), [AMD UG1099, routing and backdrilling trade-offs](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Layer-Count-Optimization).
