---
title: Crystal Oscillators
sidebar_label: Crystal Oscillators
---

import CrystalOscillatorExplorer from '@site/src/components/CrystalOscillatorExplorer';

# Crystal Oscillators

A **clock source** gives a circuit a periodic timing reference.
A quartz crystal can make this reference accurate and stable.

A crystal does not generate energy.
It is a passive **resonator**.
An amplifier and a feedback network supply energy and make the resonator oscillate.
The complete circuit is a **crystal oscillator**.

This distinction is important:

* A **crystal resonator** has two terminals and needs an external oscillator circuit.
* An **oscillator module** contains a resonator, an amplifier, and an output buffer.
* A microcontroller can contain the amplifier but still need an external crystal and load components.

## 1. Why a Crystal Selects One Frequency

Quartz is a **piezoelectric** material.
It converts electrical energy to mechanical motion.
It also converts mechanical motion back to electrical energy.

The conversion occurs in two directions:

1. An applied voltage changes the shape of the quartz.
2. Mechanical motion creates charge on the crystal electrodes.

The crystal blank has mechanical resonant modes.
At a resonant mode, energy moves between elastic deformation and mechanical motion.
The resonator loses only a small part of this energy during each cycle.
This behavior gives a crystal a high **quality factor**, or **Q**.

A high Q produces a narrow frequency response.
The oscillator circuit uses this narrow response to reject most other frequencies.

### Startup

Oscillation starts from noise and turn-on disturbances.
It does not need a perfect input sine wave.

The startup sequence is:

1. Power reaches the amplifier.
2. Electrical noise contains many small frequency components.
3. The amplifier applies these components to the crystal network.
4. The **inverse piezoelectric effect** makes the quartz move.
5. The crystal stores more energy near one mechanical resonance.
6. The **direct piezoelectric effect** converts this motion back to an electrical signal.
7. The feedback network returns the signal with the necessary phase.
8. The amplifier adds more energy during each cycle.
9. The amplitude of the selected frequency increases while the other frequency components decrease.
10. Circuit nonlinearity limits the amplitude.

For startup, the loop gain magnitude must be greater than 1 at the selected frequency.
The total loop phase must also be an integer multiple of 360 degrees.

At steady state, the loop gain magnitude becomes 1.
The energy that the amplifier adds during one cycle equals the energy that the resonator loses.

### Fundamental and Overtone Modes

The lowest intended resonant mode is the **fundamental mode**.
Higher mechanical modes are **overtone modes**.
They occur near odd multiples of the fundamental frequency, but they are not exact harmonics.

An overtone crystal is cut and specified for operation on a selected overtone.
The oscillator circuit must suppress the fundamental mode and unwanted modes.
Use the operating mode in the crystal datasheet.
Do not assume that a fundamental crystal and an overtone crystal are interchangeable.

### Common Resonator Forms

A **32.768 kHz tuning-fork crystal** is common in watches and real-time clocks.
It uses little oscillator power, but it can have high ESR and a long startup time.
Use the low-frequency oscillator guidance from the active-device manufacturer.

An **AT-cut crystal** is common for clock frequencies in the megahertz range.
Its frequency-temperature curve is different from the curve of a tuning-fork crystal.
Do not apply a high-speed crystal procedure to a low-power 32.768 kHz oscillator without confirmation.

## 2. Electrical Equivalent Circuit

Near one resonant mode, a crystal can be represented by four components.

The **motional branch** contains these series components:

* **Motional inductance, L<sub>m</sub>:** Represents the moving mass.
* **Motional capacitance, C<sub>m</sub>:** Represents mechanical elasticity.
* **Motional resistance, R<sub>m</sub>:** Represents mechanical and electrical loss.

The motional branch is in parallel with:

* **Shunt capacitance, C<sub>0</sub>:** Represents electrode, package, and terminal capacitance.

These values are model parameters.
They are not discrete components that are visible inside the package.

### Series Resonance

If loss is small, the **series-resonant frequency** is:

> **f<sub>s</sub> = 1 / (2&pi;&radic;(L<sub>m</sub>C<sub>m</sub>))**

At <i>f<sub>s</sub></i>, the reactances of <i>L<sub>m</sub></i> and <i>C<sub>m</sub></i> cancel.
The motional branch impedance is approximately <i>R<sub>m</sub></i>.
The crystal impedance is low.

### Parallel Resonance

Above <i>f<sub>s</sub></i>, the motional branch becomes inductive.
It can resonate with <i>C<sub>0</sub></i>.
The crystal impedance becomes high at the **parallel-resonant**, or **antiresonant**, frequency.

For a lossless model:

> **f<sub>p</sub> &asymp; f<sub>s</sub>&radic;(1 + C<sub>m</sub>/C<sub>0</sub>)**

The motional capacitance is usually much smaller than the shunt capacitance.
For this reason, <i>f<sub>p</sub></i> is only slightly higher than <i>f<sub>s</sub></i>.

### Loaded Parallel Resonance

An external capacitance across the crystal lowers the parallel-resonant frequency.
If the effective external load is <i>C<sub>L</sub></i>, the lossless approximation is:

> **f<sub>L</sub> &asymp; f<sub>s</sub>&radic;(1 + C<sub>m</sub>/(C<sub>0</sub> + C<sub>L</sub>))**

The loaded frequency <i>f<sub>L</sub></i> is between <i>f<sub>s</sub></i> and the unloaded <i>f<sub>p</sub></i>.
More load capacitance moves <i>f<sub>L</sub></i> toward <i>f<sub>s</sub></i>.

Real loss and circuit parasitics change these approximations.
Use the complete model or a vendor calculation for a high-accuracy design.

<CrystalOscillatorExplorer />

### Series and Parallel Calibration

A crystal can be specified for **series calibration** or **parallel calibration**.

* A series-calibrated crystal has its nominal frequency at, or near, <i>f<sub>s</sub></i>.
  Its nominal frequency is not defined by a parallel-load condition.
* A parallel-calibrated crystal has its nominal frequency with a specified load capacitance.
  A Pierce oscillator usually uses this type.

The marked frequency does not identify the calibration method.
Read the datasheet or ordering code.

## 3. Crystal Specifications

Select a crystal from guaranteed limits, not only from typical values.

| Specification | Meaning | Design use |
| --- | --- | --- |
| **Nominal frequency** | Frequency at the specified calibration condition | Sets the required clock rate |
| **Operating mode** | Fundamental or specified overtone | Must agree with the oscillator circuit |
| **Frequency tolerance** | Initial frequency error at the reference temperature | Part of the initial accuracy budget |
| **Temperature stability** | Frequency change across temperature | Part of the environmental accuracy budget |
| **Aging** | Frequency change with elapsed time | Part of the lifetime accuracy budget |
| **Load capacitance, C<sub>L</sub>** | External effective load for a parallel-calibrated frequency | Sets the Pierce load network |
| **Maximum ESR** | Maximum specified crystal loss at the stated condition | Used for startup analysis |
| **Drive level** | Allowed or specified crystal power | Prevents excessive resonator stress |
| **Shunt capacitance, C<sub>0</sub>** | Static terminal capacitance | Used in the resonator model |
| **Motional values** | R<sub>m</sub>, L<sub>m</sub>, and C<sub>m</sub> | Used for detailed simulation and measurement |
| **Operating temperature** | Temperature range for guaranteed operation | Must include all powered-use conditions |
| **Package and mounting** | Mechanical and land-pattern requirements | Affects layout, assembly, and parasitics |

Some datasheets also specify **activity dips**, unwanted modes, shock, vibration, and reflow limits.
Check these limits for a product that operates in a severe environment.

### Quality Factor

For the series motional branch:

> **Q &asymp; 2&pi;f<sub>s</sub>L<sub>m</sub> / R<sub>m</sub>**

An equivalent expression is:

> **Q &asymp; 1 / (2&pi;f<sub>s</sub>C<sub>m</sub>R<sub>m</sub>)**

A high Q gives strong frequency selection.
It can also increase startup time because resonator energy can increase slowly.

## 4. The Pierce Oscillator

The **Pierce oscillator** is common in microcontrollers and digital clock circuits.
It uses an inverting amplifier and a crystal feedback path.

A typical circuit contains:

* An inverting gain element.
* A crystal between the amplifier input and output.
* A load capacitor from each crystal terminal to ground.
* A high-value feedback resistor that sets the amplifier direct-current bias.
* An optional series resistor that limits crystal drive.

An integrated oscillator block can contain the gain element and feedback resistor.
Read the device datasheet before you add an external feedback resistor.

### Detailed Operation

The Pierce circuit starts and reaches steady state in these steps:

1. The feedback resistor biases the amplifier in its linear region.
2. Noise produces a small change at the amplifier input.
3. The amplifier makes an inverted change at its output.
4. The output change drives the crystal and the load capacitors.
5. The crystal response returns a signal to the input.
6. The reactive network supplies the additional phase that the loop needs.
7. The crystal gives the largest useful feedback near its loaded resonance.
8. A signal at this frequency increases on each cycle.
9. The growing waveform moves the amplifier into a nonlinear region.
10. The nonlinear amplifier limits the waveform amplitude.
11. The resonator filters much of the generated harmonic energy.
12. A stable periodic waveform remains.

The waveform at a crystal pin is not always a clean logic-level square wave.
The oscillator output buffer converts the internal waveform to a logic signal.
Do not connect a large digital load directly to a crystal pin.

## 5. Load Capacitance and Frequency Pulling

For two Pierce load capacitors, the initial load estimate is:

> **C<sub>L</sub> &asymp; (C<sub>1</sub>C<sub>2</sub>) / (C<sub>1</sub> + C<sub>2</sub>) + C<sub>stray</sub>**

The stray term can include:

* Amplifier input and output capacitance.
* Package and socket capacitance.
* PCB pad and trace capacitance.
* Probe and test-fixture capacitance.

If <i>C<sub>1</sub> = C<sub>2</sub> = C</i>:

> **C<sub>L</sub> &asymp; C/2 + C<sub>stray</sub>**

This equation is an initial estimate.
Unequal pin capacitance, amplifier phase, and PCB parasitics can change the best values.

### Worked Load-Capacitance Example

A parallel-calibrated crystal specifies <i>C<sub>L</sub> = 12.5 pF</i>.
The estimated total stray capacitance is <i>2 pF</i>.
Use equal external capacitors.

1. Remove the stray contribution: <i>12.5 pF - 2 pF = 10.5 pF</i>.
2. Multiply by 2 for equal capacitors: <i>C = 2(10.5 pF)</i>.
3. The calculated value is <i>C = 21 pF</i>.

Start with approximately **21 pF on each pin**.
If 22 pF parts are used, the estimated load is 13 pF.
Verify the assembled frequency and startup margin before production release.

### C<sub>0</sub> Is Not C<sub>L</sub>

**C<sub>0</sub>** is a property of the crystal package and electrodes.
**C<sub>L</sub>** is the effective external load condition for frequency calibration.

Do not replace one value with the other.
Both values appear in the loaded-resonance model.

### Frequency Pulling

Changing the load capacitance changes the oscillation frequency.
This change is **frequency pulling**.

* More effective load capacitance usually moves the frequency closer to <i>f<sub>s</sub></i>.
* Less effective load capacitance usually moves the frequency upward toward <i>f<sub>p</sub></i>.

The available pull range is small because <i>C<sub>m</sub></i> is small.
Do not use load adjustment to correct a large frequency error.

A fixed capacitor tolerance also creates frequency error.
Use stable capacitor types when the accuracy requirement is strict.
Include PCB and pin capacitance in the tolerance analysis.
Use **C0G/NP0 capacitors** when the load network needs high temperature stability.
High-K ceramic capacitance can change with voltage and temperature.

## 6. Startup Margin and Negative Resistance

The active oscillator network can appear as a **negative resistance** at the crystal terminals.
This negative resistance supplies the energy that the crystal loses in its ESR.

For reliable startup:

> **|R<sub>negative</sub>| must be greater than the worst-case effective crystal loss.**

Define a startup margin ratio as:

> **Margin ratio = |R<sub>negative</sub>| / R<sub>loss,max</sub>**

Use maximum ESR at the applicable temperature and production conditions.
Startup can fail if the amplifier transconductance is too small or the load capacitance is too large.

There is no universal negative-resistance ratio for every oscillator.
Some vendors specify a required margin or a test method.
Use the oscillator manufacturer requirement.

Common verification methods include:

* Measure the oscillator port with the vendor procedure.
* Add resistance in series with the crystal until startup stops, if the vendor permits this test.
* Test startup across voltage, temperature, and component limits.

Do not infer a guaranteed startup margin from one room-temperature board.

## 7. Drive Level

The **drive level** is the power dissipated in the crystal motional resistance.
An approximate expression is:

> **P<sub>crystal</sub> &asymp; I<sub>m,rms</sub><sup>2</sup>R<sub>m</sub>**

Here, <i>I<sub>m,rms</sub></i> is the root-mean-square current in the motional branch.
Some vendor procedures use an effective loaded resistance instead of <i>R<sub>m</sub></i>.
Use the resistance that the selected vendor procedure defines.

Excessive drive can cause:

* A frequency shift.
* Nonlinear behavior.
* Faster aging.
* Permanent crystal damage.

An optional series resistor can reduce drive.
This resistor also changes loop gain and startup margin.
Select it with the oscillator and crystal vendor procedures.

A voltage measurement at one pin does not directly give motional current.
Use the specified measurement model, a current probe method, or a calibrated network method.

## 8. Startup Time and Amplitude Limiting

**Startup time** is the interval from power application to a usable clock.
It includes the resonator energy increase and output qualification.

Startup time can increase because of:

* High resonator Q.
* High ESR.
* Low amplifier gain.
* Low supply voltage.
* Large load capacitance.
* Low temperature or other environmental limits.
* A slow supply ramp.

The oscillator amplifier limits amplitude after startup.
Some circuits limit by amplifier saturation.
Other circuits control current or gain.

The output can toggle before its frequency and amplitude meet their limits.
Use the device **clock-ready** indication or the specified startup delay.
Hold dependent logic in reset until the clock is valid.

## 9. Frequency Accuracy and Time Error

Frequency error is commonly specified in **parts per million**, or **ppm**:

> **Error (ppm) = (f<sub>actual</sub> - f<sub>nominal</sub>) / f<sub>nominal</sub> &times; 10<sup>6</sup>**

One ppm is one part in one million.
The sign shows whether the clock runs fast or slow.

The time error caused by a constant fractional frequency offset is:

> **Time error = elapsed time &times; fractional frequency error**

For one day:

> **Time error (seconds/day) = error (ppm) &times; 0.0864**

### Worked Timing Example

A clock has a constant error of 20 ppm.

> **20 &times; 0.0864 = 1.728 seconds/day**

A clock that is 20 ppm fast gains approximately **1.728 seconds each day**.
A clock that is 20 ppm slow loses the same amount.

This result does not include temperature change or aging.

### Accuracy Budget

A practical budget can include:

* Initial crystal tolerance.
* Load-capacitance error.
* Temperature stability.
* Aging during the required service life.
* Supply sensitivity of the oscillator circuit.
* Mechanical stress, shock, and vibration.
* Measurement and calibration error.

For guaranteed independent limits, add the absolute worst-case values:

> **|Error<sub>total</sub>| &le; &Sigma;|Error<sub>limit</sub>|**

Use a root-sum-square calculation only for independent statistical quantities with justified distributions:

> **Error<sub>RSS</sub> = &radic;(&Sigma;Error<sub>i</sub><sup>2</sup>)**

Do not use RSS to replace guaranteed worst-case limits.
Do not add a per-year aging value without the specified time model.
Read whether aging is a first-year limit, a yearly limit, or a lifetime model.

## 10. Temperature, Aging, and Mechanical Stress

A quartz crystal changes frequency with temperature.
The shape of the frequency-temperature curve depends on the crystal cut.
The error is not always a straight line.

**Temperature stability** and **initial tolerance** are separate specifications.
Do not assume that one value includes the other.

**Aging** can result from stress relief, contamination, mounting changes, and electrode changes.
The rate is usually highest early in product life and lower later.

Board bending, shock, and vibration can also change frequency.
Place the crystal away from board edges, mounting holes, and high-stress areas when possible.
Follow the package handling and reflow limits.

## 11. Phase Noise and Jitter

Frequency accuracy describes the average clock rate.
**Jitter** describes short-term edge-time variation.
These quantities are different.

Important jitter terms are:

* **Period jitter:** Variation of one clock period from its ideal period.
* **Cycle-to-cycle jitter:** Difference between two adjacent periods.
* **Time-interval error:** Difference between an actual edge time and an ideal edge time.
* **RMS jitter:** Root-mean-square timing variation in a stated measurement bandwidth.
* **Peak-to-peak jitter:** Observed timing range during a stated record length.

**Phase noise** describes noise power around the carrier in the frequency domain.
It is commonly stated as single-sideband noise in dBc/Hz at an offset from the carrier.

For small phase noise, the RMS phase variation for a specified integration band is approximately:

> **&sigma;<sub>&phi;</sub> = &radic;(2&int;<sub>f1</sub><sup>f2</sup>10<sup>L(f)/10</sup>df)**

The corresponding RMS time jitter is:

> **&sigma;<sub>t</sub> = &sigma;<sub>&phi;</sub> / (2&pi;f<sub>0</sub>)**

In these equations:

* <i>L(f)</i> is single-sideband phase noise in dBc/Hz.
* <i>f<sub>1</sub></i> and <i>f<sub>2</sub></i> are integration limits.
* <i>f<sub>0</sub></i> is the carrier frequency.

Always state the integration limits.
Different limits give different jitter results.
Spurs can require separate treatment.

The crystal is only one noise source.
The amplifier, power supply, output buffer, and clock distribution network can add jitter.

## 12. Clock-Source Selection

Select the source from accuracy, jitter, startup, power, cost, and environmental requirements.

| Source | Contents | Main reason to use it | Main limitation |
| --- | --- | --- | --- |
| **Bare crystal** | Passive resonator | Good accuracy with an integrated oscillator amplifier | Needs startup, load, and layout analysis |
| **Crystal oscillator (XO)** | Crystal, amplifier, and output buffer | Complete fixed-frequency logic clock | More cost and power than a bare crystal |
| **TCXO** | Temperature-compensated crystal oscillator | Better frequency stability across temperature | Higher cost and power |
| **VCXO** | Voltage-controlled crystal oscillator | Small electronic frequency adjustment | Needs a clean control voltage |
| **OCXO** | Oven-controlled crystal oscillator | Very high frequency stability | High power, cost, size, and warmup time |
| **MEMS oscillator** | Mechanical resonator and electronics | Robust package and flexible ordering options | Noise and power depend on the device |
| **Ceramic resonator** | Passive ceramic resonator | Low cost and fast startup in many applications | Lower accuracy and Q than quartz in many applications |
| **RC oscillator** | Resistor-capacitor timing circuit | Low cost and easy integration | Lower accuracy and greater environmental sensitivity |

Check the output electrical standard for an oscillator module.
Examples include LVCMOS, clipped sine, LVDS, and LVPECL.
The receiver, termination, supply voltage, and layout must agree with the output type.

Use a **TCXO** when temperature error is too large for an uncompensated crystal.
Use a **VCXO** when a control loop must adjust frequency.
Use an **OCXO** when stability is more important than power and warmup time.

## 13. Design Procedure

Use this sequence for a new clock design.

1. **Define the clock requirement.**
   Specify frequency, total accuracy, jitter, startup time, temperature, lifetime, power, and cost.
2. **Select the source type.**
   Choose a bare crystal, oscillator module, or another resonator technology.
3. **Check the active-device oscillator specification.**
   Confirm supported frequency, mode, crystal ESR, load range, and drive method.
4. **Select the crystal.**
   Match nominal frequency, calibration method, mode, maximum ESR, drive level, and package.
5. **Create the accuracy budget.**
   Include initial tolerance, temperature, load error, aging, and circuit effects.
6. **Estimate the load capacitors.**
   Include pin, pad, trace, and package capacitance.
7. **Check startup margin.**
   Use worst-case ESR and the device-vendor method.
8. **Check crystal drive.**
   Add or adjust a series resistor only when the analysis requires it.
9. **Make the layout compact.**
   Keep the oscillator loop away from switching and high-current paths.
10. **Build prototypes.**
    Use representative components and the production PCB stackup.
11. **Measure frequency without disturbing the loop.**
    Use a buffered clock output or a low-capacitance method.
12. **Test operating limits.**
    Test startup, frequency, and jitter across voltage, temperature, and production tolerance.

## 14. PCB Layout

The oscillator loop has small signals and high impedance.
Parasitic capacitance and coupled noise can change its operation.

Use these layout practices:

* Put the crystal and load capacitors close to the oscillator pins.
* Keep crystal traces short.
* Keep the loop area small.
* Keep switching nodes, clocks, inductors, and high-current traces away.
* Do not route unrelated signals through or under the oscillator area.
* Connect load capacitors to a quiet local ground return.
* Avoid vias in the crystal loop when possible.
* Do not add test pads to crystal pins unless their capacitance is included.
* Keep the oscillator area away from board-flex and mounting stress.

Ground pours, guards, and layer keepouts have device-specific effects.
Some manufacturers recommend a grounded guard.
Other manufacturers specify a copper keepout below the crystal.
Use the active-device and crystal layout recommendations.

## 15. Measurement Without Circuit Disturbance

A normal passive oscilloscope probe can add several picofarads.
This capacitance can pull the frequency, reduce startup margin, or stop oscillation.

Use one of these methods:

* Measure a buffered clock-output pin.
* Use an active probe with very low input capacitance.
* Use the test method in the oscillator vendor documentation.
* Use a frequency counter on a buffered signal.

If a crystal pin must be measured:

1. Record the probe capacitance.
2. Select the less-sensitive test point specified by the device vendor.
3. Use a short ground connection.
4. Compare operation with and without the probe.

Do not judge crystal drive from a peak pin voltage alone.
Do not connect a frequency counter directly to a high-impedance crystal node.

### Frequency Measurement

Use enough counter gate time to resolve the required ppm.
Reference the counter to a source that is more accurate than the device under test.
Allow the board and reference to reach the specified temperature.

For a module, also measure output duty cycle, rise time, overshoot, and logic levels.
These properties affect the clock receiver even when the average frequency is correct.

## 16. Common Failure Modes

### The Oscillator Does Not Start

Possible causes include:

* Incorrect crystal mode or frequency range.
* Crystal maximum ESR above the oscillator capability.
* Too much load capacitance.
* Insufficient amplifier gain.
* An incorrect bias or feedback resistor.
* Too much series resistance.
* A damaged crystal or a soldering defect.
* Leakage or contamination around a high-impedance pin.
* A supply ramp outside the device requirement.

Check startup on repeated power cycles and at all environmental limits.

### The Frequency Is Incorrect

Possible causes include:

* Wrong series or parallel calibration.
* Wrong specified load capacitance.
* Incorrect load-capacitor values.
* An incorrect stray-capacitance estimate.
* Probe capacitance during measurement.
* Operation on the wrong resonant mode.
* Temperature, stress, or aging outside the budget.

### The Oscillator Starts Slowly

Possible causes include:

* High ESR.
* Low negative-resistance margin.
* Excess load capacitance.
* Low supply voltage.
* A slow power ramp.
* A startup delay that is shorter than the resonator settling time.

### The Crystal Drive Is Too High

Possible signs include frequency shift, unstable amplitude, excessive harmonics, or early aging.
Measure drive with the approved method.
Increase a series drive resistor only after a startup-margin check.

### The Clock Has Too Much Jitter

Possible causes include:

* Noisy oscillator supply.
* Noise coupled into crystal traces.
* A noisy control voltage in a VCXO.
* Poor output termination.
* Ground bounce in the output buffer.
* A measurement bandwidth or probe that is not suitable.

Separate resonator noise from buffer and distribution noise before you change the crystal network.

## 17. Verification Checklist

Before schematic release:

* [ ] The source type meets frequency, accuracy, jitter, startup, power, and cost requirements.
* [ ] Crystal calibration, operating mode, and nominal load are correct.
* [ ] Maximum ESR is compatible with the oscillator amplifier.
* [ ] Crystal drive is below the specified limit.
* [ ] Load-capacitor values include pin and PCB parasitics.
* [ ] The accuracy budget includes tolerance, temperature, load error, and aging.
* [ ] The reset strategy waits for a valid clock.

Before PCB release:

* [ ] The crystal loop is short and compact.
* [ ] The oscillator is separated from switching and high-current nodes.
* [ ] Load-capacitor returns follow the device guidance.
* [ ] Test pads and probe access do not add unplanned capacitance.
* [ ] Mechanical stress and reflow limits are addressed.

During validation:

* [ ] Startup passes repeated cycles at voltage and temperature limits.
* [ ] Negative-resistance margin meets the vendor requirement.
* [ ] Crystal drive meets the specified limit.
* [ ] Frequency meets the complete ppm budget.
* [ ] Jitter is measured with stated bandwidth and record length.
* [ ] The measurement setup does not disturb the oscillator.

## Related Topics

* [PCB Layout Overview](../../05-PCB-Layout/01-Overview.md)
* [Capacitors](../../01-Discrete-Components/01-Passives/02-Capacitors.md)
* [Digital Filters](../Filters/Digital-filters.md)
* [Sample and Hold](../Data-convertes/Sample-holding.md)
* [Comparators](../Amplifiers/comparators.md)
* [Phase-Locked Loops](./PLL.md)
* [Real-Time Clocks](./RTCs.md)

## Technical References

These manufacturer references give circuit-selection and validation procedures:

* [Texas Instruments: Clock Optimization and Design Guidelines](https://www.ti.com/lit/an/slla549/slla549.pdf)
* [Epson: Oscillator Circuit Basics and Design Conditions](https://www.epsondevice.com/crystal/en/techinfo/column/general/osc-circuit.html)
* [NDK: Oscillation-Circuit Configuration and Measurement Methods](https://www.ndk.com/en/products/info/post.html)
