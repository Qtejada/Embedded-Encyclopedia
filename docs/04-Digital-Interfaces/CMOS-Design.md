---
title: CMOS Timing and Power
sidebar_position: 27
---

import LearningEquation from '@site/src/components/LearningEquation';

# CMOS Timing and Power

## 1. From logic function to transistor network

**Complementary metal-oxide-semiconductor (CMOS)** logic uses complementary transistor networks. The pull-up network connects the output to the supply. The pull-down network connects it to ground.

An n-channel transistor conducts when its gate voltage is sufficiently above its source voltage. A p-channel transistor uses the opposite gate polarity.

Start with [CMOS gate construction](<./DigitalGeneral.md#cmos-gate-construction-and-boolean-reduction>) before analyzing delay.

| Gate | Pull-down network | Pull-up network |
| --- | --- | --- |
| Inverter | One n-channel transistor | One p-channel transistor |
| Two-input NAND | Two n-channel transistors in series | Two p-channel transistors in parallel |
| Two-input NOR | Two n-channel transistors in parallel | Two p-channel transistors in series |

For valid steady inputs, complementary networks avoid an intentional supply-to-ground path. Real devices still have leakage current.

During an input transition, both networks can conduct briefly. Slow input edges can increase this short-circuit current.

## 2. Capacitance and delay

The output load includes wire capacitance, drain capacitance, and input capacitance from subsequent gates. These capacitances require charge during each transition.

A first-order model replaces the conducting network with an effective resistance. For a step input, the output reaches half its final change after approximately 0.69 RC.

<LearningEquation tex={String.raw`t_{pHL}\approx0.69R_nC_L,\qquad t_{pLH}\approx0.69R_pC_L`} />

These estimates assume a lumped load and a constant effective resistance. Real transistor resistance changes during the transition.

**Propagation delay** and **rise time** use different measurement points. A first-order 10% to 90% rise time is approximately 2.2 RC.

### Worked example: load increase

Assume an effective resistance of 2 kΩ and a load of 20 fF. The estimated propagation delay is 27.6 ps.

If the load increases to 60 fF, the estimate becomes 82.8 ps. These assumed values illustrate the model, not a particular fabrication process.

### Transistor width

A wider transistor generally reduces channel resistance at the same operating point. It also increases input and diffusion capacitance.

Increasing one gate's width can slow the previous gate. Gate sizing must consider the complete path.

Two equal series transistors have approximately twice one transistor's resistance in a simple model. Wider devices can compensate, but internal node capacitance also changes.

## 3. Distributed wire resistance

A long wire has resistance and capacitance along its length. One capacitor at the endpoint cannot represent every internal voltage.

For a resistance-capacitance tree, the **Elmore time constant** weights each capacitor by the resistance shared with the observation path.

Consider a ladder with R1, then C1 to ground, then R2, then C2 to ground. Observe the voltage across C2.

<LearningEquation tex={String.raw`\tau_E=R_1(C_1+C_2)+R_2C_2`} />

Assume R1 = R2 = 1 kΩ and C1 = C2 = 10 fF. The Elmore time constant is 30 ps.

This is a first-moment estimate. It is not an exact 50% delay for every network.

Wire delay can grow approximately with length squared when both resistance and capacitance grow with length. Buffers can divide a long path into shorter sections.

## 4. Buffer chains

A small gate can drive a large capacitance through a sequence of larger gates. Each stage drives a smaller capacitance ratio.

Assume the final load is 64 times the first stage's input capacitance. Three stages with size ratios of four give sizes 1, 4, and 16.

The last stage drives the load of 64. Each stage has an electrical effort of four.

Adding stages also adds intrinsic delay and power. The best stage count depends on gate type, parasitic delay, branching loads, and output polarity.

**Logical effort** compares a gate's input capacitance with an inverter that has equal output drive. It helps estimate delay before detailed transistor simulation.

## 5. Switching and leakage power

Define activity α as the average number of output charging events per clock cycle. A charging event means a zero-to-one transition.

<LearningEquation tex={String.raw`P_{switch}=\alpha C_LV_{DD}^{2}f,\qquad P_{leak}=V_{DD}I_{leak}`} />

The switching expression describes energy drawn from the supply. Half remains in the capacitor after charging. The next discharge dissipates that stored energy.

### Worked example: activity

Assume α = 0.1, C = 20 fF, V = 1 V, and f = 100 MHz. The estimated switching power is 0.2 µW.

Doubling frequency doubles this estimate. Reducing voltage to 0.8 V multiplies it by 0.64, if capacitance and activity remain unchanged.

Lower voltage can increase delay. A valid design must still satisfy timing.

Input probabilities alone do not describe correlated transitions or glitches. Include internal node activity, clock loads, short-circuit current, and leakage in a complete power estimate.

## 6. Pass gates and dynamic nodes

An n-channel pass transistor passes a strong low level. Its high level can stop below the supply because its gate overdrive decreases.

A p-channel pass transistor has the complementary limitation. A **transmission gate** places both device types in parallel with complementary controls.

Transmission gates still have finite resistance and parasitic capacitance. They do not provide voltage gain.

**Dynamic logic** stores charge during precharge and conditionally removes it during evaluation. Leakage, charge sharing, and noise can change a floating node.

A keeper can maintain charge against leakage. It must not prevent the evaluation network from changing the node.

## 7. Register timing and clock skew

Define clock skew as capture-clock arrival minus launch-clock arrival. Positive skew gives more time for setup but less margin for hold.

<LearningEquation tex={String.raw`T\ge t_{cq,max}+t_{comb,max}+t_{setup}-t_{skew}`} />
<LearningEquation tex={String.raw`t_{cq,min}+t_{comb,min}\ge t_{hold}+t_{skew}`} />

These relations describe one register-to-register path without additional uncertainty. Add the required uncertainty and variation margins during timing analysis.

A slower clock can fix a setup violation. It does not normally fix a hold violation on the same active edge.

Connect these limits to [pipeline boundaries](<./RISC-V-Pipeline.md#data-and-control-must-remain-together>) and [clocked logic](<./Sequential-Design.md#2-clocked-and-combinational-processes>).

## References

The junior notes motivate the examples and topic selection. The numerical examples use assumed values.

* [CMOS VLSI Design: DC and transient response](https://pages.hmc.edu/harris/cmosvlsi/4e/lect/lect5.pdf)
* [CMOS VLSI Design: power](https://pages.hmc.edu/harris/cmosvlsi/4e/lect/lect7.pdf)
* [CMOS VLSI Design: sequential circuits](https://pages.hmc.edu/harris/cmosvlsi/4e/lect/lect11.pdf)
