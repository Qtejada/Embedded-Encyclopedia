---
title: Phase-Locked Loops
sidebar_label: Phase-Locked Loops
---

import PllExplorer from '@site/src/components/PllExplorer'

# Phase-Locked Loops

A **phase-locked loop (PLL)** adjusts an oscillator to follow a reference signal. It compares their phase, filters the resulting error, and uses that correction to speed up or slow down the oscillator.

A PLL can combine analog and digital functions.
It can generate a clock, multiply frequency, recover a clock from data, clean jitter, demodulate frequency modulation, or align two periodic signals.

A PLL is in **lock** when the reference and feedback signals have the same average frequency and their phase difference stays within a bounded range. They do not have to line up exactly. The remaining phase offset depends on the detector, loop filter, and real circuit errors.

## 1. Core PLL Architecture

A common charge-pump PLL contains these blocks:

1. A **reference source** supplies the input frequency and phase.
2. An optional **reference divider** divides the reference frequency.
3. A **phase-frequency detector (PFD)** compares the reference and feedback edges.
4. A **charge pump (CP)** converts the detector decision into UP or DOWN current pulses.
5. A **loop filter** converts the current pulses into a smooth tuning voltage.
6. A **controlled oscillator** converts the tuning command into frequency.
7. A **feedback divider** divides the oscillator output before the comparison.
8. An optional **output divider** makes the required final output frequency.

The main signals are:

* **Reference frequency, <i>f<sub>ref</sub></i>:** The frequency applied to the PLL.
* **Comparison frequency, <i>f<sub>PFD</sub></i>:** The frequency at the PFD reference input after reference division.
* **Feedback frequency, <i>f<sub>fb</sub></i>:** The divided oscillator frequency at the other detector input.
* **Output frequency, <i>f<sub>out</sub></i>:** The oscillator or divided output frequency used by the system.
* **Tuning voltage, <i>V<sub>tune</sub></i>:** The loop-filter output that controls an analog oscillator.
* **Phase error, <i>θ<sub>e</sub></i>:** The reference phase minus the feedback phase under the selected sign convention.

The detector compares the reference with the feedback signal. If there is a divider in the feedback path, it sees the divided signal, not the oscillator output directly. The loop adjusts the oscillator until those two detector inputs have the required relationship.

### Phase Detector and Phase-Frequency Detector

A **phase detector** measures phase difference.
An analog multiplier, mixer, or exclusive-OR gate can operate as a phase detector.
Its average output depends on phase while both inputs are in the valid operating range.

When the input frequencies are far apart, a phase-only detector may not give a clear correction direction and may fail to pull the loop into lock. Its output can also contain both sum and difference frequencies, so the loop filter must remove the unwanted terms.

A **phase-frequency detector** checks which signal's edge arrives first and can keep indicating the right correction direction while their frequencies differ. This often lets a PFD-based PLL acquire lock over a wider range than a phase-only detector.

### Charge-Pump Operation

A digital PFD commonly controls a **charge pump**.
The PFD produces an **UP** pulse when the feedback edge is late.
It produces a **DOWN** pulse when the feedback edge is early.

During an UP pulse, the charge pump adds current to the loop filter. During a DOWN pulse, it removes current. The filter accumulates these charge changes into a control voltage that adjusts oscillator frequency.

Near lock, the UP and DOWN pulses become short, and small differences in their widths correct the remaining error. Unequal source and sink currents can leave a fixed phase offset and unwanted reference-related tones, or spurs. Leakage, a detector dead zone, reset delay, and finite pulse widths also affect the result.

### Loop Filter

The **loop filter** determines how the loop responds to error and removes much of the switching ripple from the PFD.

A passive charge-pump filter can use a capacitor to accumulate charge, a resistor to add a stabilizing zero, and extra capacitors to reduce high-frequency pulses. An active filter can add voltage gain or [level translation](<../../04-Digital-Interfaces/DigitalGeneral.md#4-logic-interfacing-guide>), but adds noise and amplifier limitations too.

The loop filter is part of the feedback controller.
It is not only a ripple filter.
The filter's poles and zeros affect how quickly the PLL locks, whether it stays stable, and which timing errors pass through. They also affect how much VCO noise and unwanted discrete tones, called spurs, reach the output.

## 2. How the Loop Acquires Lock

If the oscillator frequency is wrong, its phase keeps moving relative to the reference. The detector turns that changing phase difference into a correction, moving the oscillator toward the required relationship.

### Detailed 100 Hz and 90 Hz Example

Assume these initial conditions:

* The reference input is **100 Hz**.
* The free-running VCO output is **90 Hz**.
* The feedback divider is 1.
* A higher tuning voltage increases the VCO frequency.

#### Step 1: Make a Moving Phase Difference

The 100 Hz reference completes cycles faster than the 90 Hz VCO.
The reference moves ahead by one complete cycle each tenth of a second.
The relative phase moves through 0 degrees to 360 degrees and repeats.

The detector output contains a periodic **beat note**.
The beat-note frequency is the initial frequency difference:

> **f<sub>beat</sub> = |100 Hz - 90 Hz| = 10 Hz**

This 10 Hz result describes the repeated phase sweep.
It does not mean that the PLL output becomes a 10 Hz clock.

#### Step 2: Command a Higher VCO Frequency

The loop filter receives the detector or charge-pump output.
A PFD and charge pump produce a positive average correction while the VCO is too slow.

For an illustrative circuit, the average tuning voltage can move to **+3 V**.
The exact voltage depends on VCO gain, tuning offset, loop-filter state, and supply limits.
The positive correction increases the VCO frequency in this example.

#### Step 3: Reduce the Beat Frequency

The beat note becomes slower as the VCO approaches 100 Hz.
The phase difference changes more slowly.
The detector correction also changes.

The repeated beat pattern stops after the two detector frequencies become equal.
The loop then makes small corrections around the locked operating point.

#### Step 4: Establish a Fixed Phase Relationship

The locked VCO operates at 100 Hz for a divide-by-1 loop.
The input and feedback keep a fixed average phase relationship.
For example, the reference can stay **5 degrees ahead** of the feedback signal.

Some detectors need a nonzero phase difference to maintain the required DC correction. An ideal PFD and charge pump can approach zero static phase error, but current mismatch, leakage, delays, and required tuning current leave some error in practice.

### Capture Range, Hold Range, and Tuning Range

A PLL cannot acquire lock from every starting frequency. **Capture range** describes the initial frequency offsets from which it can reach lock under stated conditions. **Hold range**, or **lock range**, describes how far an already locked loop can track without losing lock. Manufacturers use these names differently, so check the datasheet's definitions and test conditions.

With one signal at 1 MHz and another at 10 Hz, the phase-only detector sees a very large frequency difference. Its beat signal may be too fast or otherwise unsuitable for the loop filter. If filtering leaves almost no useful average correction, the VCO never moves into lock.

A PFD can give a consistent frequency-direction command over a wider range.
Acquisition still needs all of these conditions:

* The controlled oscillator must be able to reach the target frequency.
* The tuning command must stay inside its valid range.
* The PFD and dividers must operate at the applied frequencies.
* The loop must remain stable while its parameters change.
* The reference signal must meet amplitude, slew-rate, and duty-cycle requirements.
* The acquisition time must be shorter than the system timeout.

Loop bandwidth, detector type, oscillator tuning range, divider settings, signal level, initial filter voltage, and frequency step size affect acquisition.

### Settling and Cycle Slips

**Acquisition time** can include a coarse frequency-search interval and a fine phase-settling interval.
**Settling time** is the time required to enter and remain inside a stated frequency or phase-error band after a disturbance.
These two terms do not always use the same limits.

After a large frequency or phase change, the phase error may go through a full cycle before settling. This is a **cycle slip**. Several slips can occur before lock, increasing settling time and making a small-signal linear model inaccurate during acquisition.

The linear model later in this page describes small changes near lock. Large steps, saturation, cycle slips, and digital acquisition logic need a nonlinear or event-driven simulation.

### Lock Detection

A **lock detector** estimates whether lock has been reached. A digital one may count successive comparisons whose phase errors fall inside a chosen window. An analog one may filter the detector's activity.

A lock indication does not prove that output noise, spurs, or frequency error meet your requirements. The indication can also toggle repeatedly near its threshold, so check the actual output as well.

Define these lock conditions:

* The allowed frequency error.
* The allowed phase error.
* The number of consecutive good comparisons.
* The timeout.
* The response to a missing reference.
* The response to a tuning-voltage limit.

## 3. Controlled Oscillator Types

The controlled oscillator supplies the new cycles.
It is the active element that lets a PLL multiply frequency.

### Voltage-Controlled Oscillator

A **voltage-controlled oscillator (VCO)** converts tuning voltage into output frequency.
A local linear approximation is:

> **f<sub>out</sub> ≈ f<sub>0</sub> + K<sub>VCO</sub>V<sub>tune</sub>**

Here, <i>K<sub>VCO</sub></i> is in hertz per volt: how much frequency changes for a small voltage change. This straight-line approximation applies only over the stated tuning region. A real curve is nonlinear, and its slope changes with frequency, temperature, supply, and manufacturing variation.

For one illustrative relationship:

* **1 V produces 100 Hz.**
* **2 V produces 150 Hz.**

The local slope is 50 Hz/V.
A straight line through these two points is:

> **f<sub>out</sub> = 50 Hz + (50 Hz/V)V<sub>tune</sub>**

This equation is only an example.
It is not a universal VCO relationship.

A free-running VCO has frequency error and temperature drift.
The PLL corrects low-frequency error while the target stays inside the tuning range.

The loop gives two useful signals:

1. **VCO output, <i>f<sub>out</sub></i>:** This signal is the synthesized clock or radio-frequency output.
2. **Control voltage, <i>V<sub>tune</sub></i>:** This signal shows the frequency correction and can contain demodulated information.

### VCXO, DCO, and NCO

A **voltage-controlled [crystal oscillator](<./Crystal-oscillators.md#4-the-pierce-oscillator>) (VCXO)** shifts a quartz crystal's frequency using a voltage-controlled pulling circuit. Its tuning range is usually smaller than that of an LC or ring VCO, but its low phase noise and good short-term stability can make it useful for cleaning jitter.

A **digitally controlled oscillator (DCO)** accepts a digital tuning word.
The word can select delay elements, capacitors, current, or another frequency-setting quantity.
A digital PLL can use a DCO without a continuously variable analog tuning voltage.

A **numerically controlled oscillator (NCO)** repeatedly adds a phase increment to a digital accumulator, then maps the phase to a waveform if needed. It produces digital phase or waveform samples rather than using a physical resonator, and can be the controlled source in a software or digital PLL.

The selected oscillator must cover the complete target range with margin.
It must also meet phase-noise, power, startup, output-level, and tuning-resolution requirements.

## 4. Frequency Plan and Multiplication

The PLL locks the divided feedback frequency to the comparison frequency.
Let:

* <i>R</i> be the reference-divider value.
* <i>N</i> be the feedback-divider value.
* <i>D</i> be the output-divider value.

The PFD comparison frequency is:

> **f<sub>PFD</sub> = f<sub>ref</sub> / R**

The feedback frequency is:

> **f<sub>fb</sub> = f<sub>VCO</sub> / N**

At lock:

> **f<sub>fb</sub> = f<sub>PFD</sub>**

The VCO frequency is:

> **f<sub>VCO</sub> = (N/R)f<sub>ref</sub>**

If an output divider is present:

> **f<sub>out</sub> = f<sub>VCO</sub> / D = [N/(RD)]f<sub>ref</sub>**

### Detailed 100 Hz to 500 Hz Example

Assume that the input is 100 Hz and the required output is 500 Hz.
Use <i>R = 1</i>, <i>N = 5</i>, and <i>D = 1</i>.
Put a divide-by-5 counter between the VCO output and the phase detector.

The phase detector compares the 100 Hz input with the divided feedback.
The feedback equals 100 Hz when the VCO operates at 500 Hz:

> **500 Hz / 5 = 100 Hz**

The loop applies this equality:

> **f<sub>fb</sub> = f<sub>in</sub>**

For a divide-by-<i>N</i> feedback counter:

> **f<sub>fb</sub> = f<sub>out</sub> / N**

Substitute this expression into the lock condition:

> **f<sub>out</sub> / N = f<sub>in</sub>**

Solve for output frequency:

> **f<sub>out</sub> = Nf<sub>in</sub>**

A digital [flip-flop](<../../04-Digital-Interfaces/DigitalGeneral.md#storage-at-a-clock-edge>) can divide frequency.
A passive resistor or capacitor cannot insert new cycles to multiply frequency.
The VCO generates the higher-frequency signal.
The feedback loop synchronizes this signal with the input.

### Integer-N Synthesis

An **integer-N PLL** uses an integer feedback divide value for each output setting.
Its channel spacing is related to the PFD frequency and output divider.
A high PFD frequency can permit a lower <i>N</i> value.
This choice can reduce some in-band noise contributions.

Choose the frequencies together: the desired VCO output must work with the divider limits, phase-frequency detector (PFD) limit, reference quality, and required spacing between channels.
Do not select divider values from the output ratio alone.
Check every internal frequency and divider rule in the device datasheet.

### Fractional-N Synthesis

A **fractional-N PLL** alternates between integer divider settings so their long-term average can be noninteger, such as 100.25. This gives fine output-frequency steps while allowing the PFD to run relatively fast.

The fractional-N modulator controls the pattern of divider changes to shape their quantization error. A lower average <i>N</i> can reduce noise close to the carrier, but the pattern can also create fractional spurs and shaped noise. Results depend on the frequency plan, modulator order and seed, added dither, loop bandwidth, and device calibration.

Do not assume that fractional-N operation is always noisier or always quieter than integer-N operation.
Compare the complete phase-noise and spur requirements at the required frequencies.

<PllExplorer />

## 5. Linear Locked-Loop Model

This section averages the switching behavior into a **continuous-time, small-signal model**. It describes small phase changes near stable lock. It leaves out cycle slips, charge-pump saturation, divider changes, rail limits, and the nonlinear process of first acquiring lock.

### Model Quantities and Units

Use one unit convention through the complete calculation.
The following convention uses radians and radians per second:

* <i>θ<sub>ref</sub>(s)</i> is reference phase in radians.
* <i>θ<sub>out</sub>(s)</i> is output phase in radians.
* <i>K<sub>φ</sub></i> is detector and charge-pump gain in amperes per radian.
* <i>Z(s)</i> is loop-filter transimpedance in volts per ampere.
* <i>K<sub>v</sub></i> is VCO angular-frequency gain in radians per second per volt.
* <i>N</i> is the dimensionless feedback divide value.
* <i>s</i> is complex frequency in radians per second.

For an ideal PFD and charge pump with pump-current magnitude <i>I<sub>CP</sub></i>, a common averaged gain convention is:

> **K<sub>φ</sub> = I<sub>CP</sub> / (2π)**

This gain has units of amperes per radian.
Another reference can define detector gain differently.
Convert the units before using its equations.

The VCO turns tuning voltage into angular frequency. Phase then accumulates that frequency over time, so the VCO appears as an integrator when the loop is expressed in phase:

> **θ<sub>out</sub>(s) / V<sub>tune</sub>(s) = K<sub>v</sub> / s**

### Open-Loop and Closed-Loop Functions

The dimensionless open-loop gain around the feedback path is:

> **L(s) = K<sub>φ</sub>Z(s)K<sub>v</sub> / [sN]**

The reference-phase to output-phase transfer function is:

> **H<sub>ref</sub>(s) = θ<sub>out</sub>(s) / θ<sub>ref</sub>(s) = NL(s) / [1 + L(s)]**

At low offset frequencies where <i>|L(s)|</i> is large, <i>H<sub>ref</sub></i> approaches <i>N</i>.
The output phase follows the reference phase multiplied by the feedback ratio.

An additive free-running VCO phase disturbance has this output transfer function:

> **H<sub>VCO</sub>(s) = 1 / [1 + L(s)]**

The loop suppresses slow VCO phase changes when loop gain is high.
Fast VCO phase changes pass to the output when loop gain is low.

These equations cover noise entering at two particular points. Noise from the charge pump, divider, loop filter, reference, or supply needs the transfer function from its own entry point to the output.

### Ideal Type-II Second-Order Example

Consider an ideal series-RC charge-pump filter:

> **Z(s) = R + 1/(sC) = (1 + sRC)/(sC)**

The VCO contributes one phase integrator.
The capacitor contributes a second integrator.
The characteristic equation becomes:

> **s<sup>2</sup> + [K<sub>φ</sub>K<sub>v</sub>R/N]s + K<sub>φ</sub>K<sub>v</sub>/(NC) = 0**

For this specific ideal model:

> **ω<sub>n</sub> = √[K<sub>φ</sub>K<sub>v</sub>/(NC)]**

> **ζ = (R/2)√[K<sub>φ</sub>K<sub>v</sub>C/N]**

Here, <i>ω<sub>n</sub></i> is natural frequency in radians per second.
The dimensionless value <i>ζ</i> is the [damping ratio](<../Filters/Active-filters.md#q-factor-and-damping>).

These formulas do not apply unchanged to every PLL.
An extra filter capacitor, an active filter, a digital delay, a sampled PFD, or an oscillator pole changes the model.
Use the exact loop topology and the relevant vendor design method.

### Loop Type and Loop Order

**Loop type** is the number of pure integrators in the open-loop transfer function.
A type-I loop has one integrator.
A type-II loop has two.

**Loop order** is the order of the closed-loop characteristic polynomial.
The ideal example above is type II and second order.
A practical charge-pump PLL with an additional filter pole can be type II and third order.

Loop type and order describe different things. Type determines how much steady tracking error remains for phase inputs such as a constant, ramp, or higher-order polynomial. Order counts the independent dynamic states in the linear model. Do not use the two terms interchangeably.

### Bandwidth, Damping, and Phase Margin

**Loop bandwidth** describes the frequency range across which the loop strongly follows an input phase change.
The precise definition can be the unity-gain frequency, a closed-loop 3 dB point, or a vendor-specific noise bandwidth.
These values are not identical for all loop shapes.

**Natural frequency** and **damping ratio** describe a standard second-order denominator.
They do not have a universal ratio to loop bandwidth.

**[Phase margin](<../Amplifiers/01-op-amps.md#phase-margin>)** is measured from the open-loop response at its unity-gain crossover.
Extra high-frequency poles reduce phase margin.
Time delay also reduces phase margin.
Low phase margin can cause peaking, ringing, or instability.

A wider loop usually settles faster and follows faster reference changes. A narrower loop rejects more rapid reference jitter and reduces reference spurs, but also leaves more of the VCO's own noise uncorrected at lower offset frequencies.

Select loop bandwidth and phase margin from the full noise, spur, modulation, and settling requirements.
Do not apply one damping ratio or one bandwidth ratio to every PLL.
Simulate component tolerance, VCO-gain range, charge-pump current range, divider settings, and added poles.

## 6. Noise, Jitter, and Spurs

Frequency accuracy describes the long-term or average rate.
**Phase noise** and **jitter** describe short-term timing variation.

### Reference and VCO Noise Shaping

The locked PLL generally passes slow phase changes from the reference like a low-pass filter. For the VCO's own phase noise, it does the opposite: feedback corrects slow changes, leaving faster changes to pass like a high-pass response.

Within the loop bandwidth, output phase tracks the divided reference relationship. Reference, PFD, charge-pump, and divider noise may dominate there. Frequency multiplication also scales the reference's phase-noise contribution.

Outside the effective loop bandwidth, the loop cannot correct the oscillator quickly.
Free-running VCO phase noise commonly dominates this region.

The lowest total jitter often comes from a bandwidth near where the multiplied in-band noise and VCO noise become comparable. Use the actual noise-versus-frequency curves to find that trade-off; neither narrower nor wider is always better.

### Jitter Cleaning and the Flywheel Effect

An input clock can have **jitter**.
Its edges move in time.

A narrow-band PLL averages fast phase changes at the detector.
The controlled oscillator follows the average input frequency but does not follow input changes that are much faster than the loop response.
Its output can have cleaner timing than the input.

This is the **flywheel effect**: the oscillator maintains its short-term timing while the loop corrects slower errors. A narrow loop takes longer to lock and settle, and leaves oscillator quality responsible for more of the offset-frequency range.

### Convert Phase Noise to RMS Jitter

Single-sideband phase noise <i>L(f)</i> describes noise near one side of the carrier, at offset frequency <i>f</i>. The usual unit, dBc/Hz, compares noise power in a 1 Hz bandwidth with carrier power. For small random phase modulation, integrate it to estimate RMS phase variation:

> **σ<sub>φ</sub> = √[2∫<sub>f1</sub><sup>f2</sup>10<sup>L(f)/10</sup>df]**

The result is in radians.
Convert RMS phase to RMS time jitter at output carrier frequency <i>f<sub>0</sub></i>:

> **σ<sub>t</sub> = σ<sub>φ</sub> / (2πf<sub>0</sub>)**

Give <i>f<sub>1</sub></i>, <i>f<sub>2</sub></i>, carrier frequency, and whether spurs are included with every result. The factor of 2 accounts for both sides when using a single-sideband noise value with symmetric sidebands. This approximation applies to small phase noise; it does not by itself convert deterministic jitter or large phase modulation.

Do not compare two RMS-jitter values that use different integration limits.
Do not silently include spurs in one result and exclude them in another.

### Reference Spurs and Fractional Spurs

A PLL output can contain discrete unwanted tones called **spurs**.
Common causes include:

* Charge-pump current mismatch.
* Leakage at the tuning node.
* PFD reset delay and pulse feedthrough.
* Reference coupling through the substrate or supply.
* Fractional-divider patterns.
* VCO supply ripple.
* Digital [crosstalk](<../../05-PCB-Layout/01-Overview.md#53-crosstalk-and-separation>).
* Loop-filter component nonlinearity.

An integer-N PLL often has tones at the PFD frequency and its harmonics.
A fractional-N PLL can have fractional spurs and integer-boundary spurs.
The exact locations depend on divider patterns and mixing paths.

A loop filter can attenuate tuning-node ripple.
It cannot remove a spur that couples directly into the VCO or output buffer.
Use clean supplies, compact layout, isolation, frequency planning, and device-specific spur controls.

### VCO Supply and Tuning-Node Noise

Supply noise can change VCO frequency, adding sidebands and timing jitter. The amount of frequency change caused by supply-voltage change is called **VCO pushing**.

Use enough supply filtering for the VCO's sensitivity. An LC filter can reduce regulator and digital noise, but may also resonate or interact with the regulator. Choose damping and decoupling that suit both devices.

Keep the tuning node away from switching signals.
Use low-leakage filter components when leakage causes a significant tuning error.
Check capacitor dielectric noise, [microphonics](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#b-piezoelectric-effects-and-microphonics>), voltage coefficient, and temperature coefficient for sensitive loops.

## 7. Modulation, Clock Recovery, and Other Applications

### FM Demodulation

**Frequency modulation (FM)** stores information in frequency change.

Assume that an FM input moves from 100 Hz to 101 Hz and then to 99 Hz.
The PLL changes the oscillator tuning command to stay locked to these changes.
The changing control voltage reproduces the slow modulating signal.
In a radio receiver, this voltage can contain recovered audio.

The loop bandwidth must cover the highest required modulation frequency.
The oscillator and tuning range must cover the peak frequency deviation.
Fast FM components outside the loop bandwidth are attenuated.
Noise and detector ripple can appear on the recovered voltage.
Use a post-filter when the demodulated bandwidth permits it.

### Clock and Data Recovery

A **clock and data recovery (CDR)** loop derives timing from transitions in the data. It aligns a recovered clock so the receiver samples where the eye diagram has a reliable opening. A CDR may use a PLL or another timing-recovery design.

Three jitter terms are important:

* **Jitter transfer:** The amount of input jitter that appears on the recovered output.
* **Jitter tolerance:** The input-jitter amplitude and frequency that the receiver can accept while it meets its error requirement.
* **Jitter generation:** The jitter made by the CDR under the defined input conditions.

Jitter transfer describes how much input timing variation the loop follows. Jitter tolerance also depends on the eye opening, detector, [equalization](<../../05-PCB-Layout/03-trace-impedance.md#preemphasis-and-equalization>), bit pattern, and when cycle slips begin. Jitter generation measures timing noise added by the oscillator, detector, supply, and other circuits.

A narrower CDR bandwidth can reduce high-frequency jitter transfer.
It can also reduce tolerance to low-frequency wander or fast frequency offset if the rest of the acquisition system cannot compensate.
Verify all three requirements across the complete data-rate and pattern range.

### Frequency Synthesis

A synthesizer uses reference and feedback dividers to make programmable output frequencies.
Radio systems use PLLs for local oscillators.
Processors and interfaces use PLLs for internal clocks.
Data converters use low-jitter PLL clocks for sampling.

The frequency plan must avoid prohibited divider values, VCO gaps, excessive <i>N</i>, unwanted spurs, and downstream bandwidth limits.
Fast frequency hopping also needs a settling-time limit after each divider change.

### Phase Alignment and Zero Delay

Put the clock distribution path inside the feedback path and the PLL can compensate for its delay, aligning a selected output edge with the reference. This is commonly called **zero-delay** operation.

Physical propagation still takes time. The loop aligns phase only at the selected feedback point; other outputs can still differ because of package, buffer, and trace delays.

### Motor, Grid, and Measurement Loops

A PLL can estimate phase and frequency from a periodic sensor or power waveform.
Motor control can use a tracking loop for rotor position or speed.
Grid-connected equipment can use a PLL to estimate mains phase.
Test equipment can compare two sources or track a slowly changing tone.

These loops can use different detectors and filters from an RF synthesizer.
Harmonics, amplitude changes, and missing crossings can disturb the phase estimate.
Select the architecture for the input waveform and dynamic range.

## 8. Information That a PLL Does Not Preserve

A PLL controls timing and phase. Unlike a linear [op-amp](<../Amplifiers/01-op-amps.md#1-op-amp-fundamentals>) chain, it does not reproduce every property of the input signal.

### Amplitude Is Not Preserved

An op-amp can preserve proportional voltage changes.
If its input changes from 5 V to 2 V, its output can change by the same ratio.

A PLL output amplitude is set mainly by the VCO or output-buffer stage.
The VCO can produce a fixed 3.3 V clock for several valid input amplitudes.
Information stored only in input amplitude is not present in this clock output.

A PLL clock output does not preserve amplitude-modulated radio information or sensor magnitude.
Use an amplitude detector or a complete demodulator when amplitude carries information.

### Response Is Not Instantaneous

An op-amp may respond in nanoseconds if its bandwidth and slew rate allow it. A PLL must change the stored state of its loop filter and correct the oscillator over time.

If an input changes from 100 Hz to 200 Hz, the VCO can sweep to the new frequency over milliseconds in one illustrative design.
The exact time depends on loop parameters and tuning limits.
Fast frequency changes outside the tracking bandwidth are attenuated.
This behavior can remove fast FM content.

### The Next Stage Needs the New Bandwidth

Assume that a PLL multiplies a 1 MHz input to 2 MHz.
The stage after the PLL must operate correctly at 2 MHz.

An amplifier with only 1 MHz bandwidth can attenuate or distort the new signal.
The PLL did not remove the bandwidth requirement.
It made a faster signal that the downstream circuit cannot process correctly.

### PLL and Op-Amp Comparison

| Feature | Op-amp chain | PLL chain |
| --- | --- | --- |
| **Controlled quantity** | Voltage or current | Phase and frequency |
| **Amplitude** | Can preserve proportional amplitude | Output amplitude is usually set by the oscillator buffer |
| **Response** | Can respond in nanoseconds | Needs acquisition and tracking time |
| **Noise behavior** | Adds analog voltage and current noise | Shapes phase noise and can clean timing jitter |
| **Steady state** | Uses a bounded voltage error | Uses a bounded phase error |
| **Next-stage bandwidth** | Must support the signal bandwidth | Must support the multiplied output frequency |

## 9. PLL Design Procedure

Use this sequence for a new design.

1. **Define the output.**
   Specify every frequency, channel step, modulation mode, phase relationship, output level, and load.
2. **Define timing quality.**
   Specify phase-noise masks, RMS-jitter integration limits, deterministic spurs, wander, and reference quality.
3. **Define dynamic behavior.**
   Specify startup, lock time, frequency switching, phase settling, holdover, and missing-reference behavior.
4. **Make the frequency plan.**
   Select reference, <i>R</i>, <i>N</i>, fractional settings, VCO frequency, and output dividers.
5. **Check every internal limit.**
   Check PFD rate, divider range, prescaler rules, VCO range, output divider, and calibration range.
6. **Select the controlled oscillator.**
   Check tuning gain, tuning linearity, phase noise, supply pushing, output power, temperature, and margin at range limits.
7. **Allocate the noise budget.**
   Include reference, PLL in-band noise, divider noise, charge pump, loop filter, VCO, supply, buffer, and distribution.
8. **Select loop bandwidth and stability targets.**
   Use settling, modulation, reference noise, VCO noise, spur, and jitter-transfer requirements.
9. **Design the exact loop filter.**
   Use the device gain conventions and a model that includes all poles, zeros, delays, and loading.
10. **Check nonlinear acquisition.**
    Simulate or test tuning saturation, cycle slips, large frequency steps, calibration, and lock-detect timing.
11. **Design the power network.**
    Separate sensitive VCO and charge-pump supplies as required.
    Check regulator noise and filter resonance.
12. **Make a controlled layout.**
    Keep the tuning node compact.
    Isolate the VCO, reference, loop filter, and output from digital switching.
13. **Build a tolerance model.**
    Vary oscillator gain, filter parts, pump current, temperature, supply, and divider modes.
14. **Validate with the final reference and load.**
    A laboratory source can hide reference-noise and signal-integrity problems.

Do not copy a loop filter from a different VCO or divider setting without recalculation.
The loop gain changes with detector gain, oscillator gain, and divide ratio.

## 10. Measurement and Validation

### Verify Frequency and Tuning Range

Check output frequency for every programmed channel and record tuning voltage at the low, middle, and high ends of the VCO range. Keep room between that voltage and the tuning limits. A loop can indicate lock near a rail yet have almost no remaining correction range.

Test voltage, temperature, and power-cycle limits.
Verify calibration after the fastest and slowest allowed supply ramps.

### Measure Lock and Settling Time

Apply the specified frequency step and time the response from a clearly defined trigger. Settling is complete only when the output enters the required error band and stays there for the stated observation interval.

Record:

* Coarse acquisition time.
* Number of cycle slips.
* Frequency-settling time.
* Phase-settling time.
* Lock-detect assertion time.

The lock-detect edge can occur before the output meets a strict phase-noise or phase-settling requirement.
Measure both events.

### Measure Loop Response

Some PLLs allow a small phase modulation to be added to the reference. Sweep its frequency and measure the output phase response to estimate jitter transfer, loop bandwidth, and peaking.

Keep the modulation small enough for the linear locked model.
A large modulation can cause cycle slips or nonlinear detector operation.
Use a device-vendor method when the PLL has hidden digital loops or adaptive bandwidth.

### Measure Phase Noise, Jitter, and Spurs

Use an analyzer with a noise floor below the device requirement.
Use cross-correlation when the instrument supports it and the measurement needs it.
Record carrier frequency, offset range, resolution bandwidth, averaging, and reference source.

Integrate phase noise only across the specified limits.
Record whether discrete spurs are included.
Measure output spectrum over a span that shows reference and fractional spurs.

For digital clocks, also measure duty cycle, rise time, overshoot, termination, and ground bounce.
Poor output signal integrity can make receiver jitter even when PLL phase noise is acceptable.

### Measure CDR Performance

For a CDR, apply controlled sinusoidal jitter across modulation frequency.
Find the jitter amplitude that reaches the defined error limit.
This test makes the jitter-tolerance curve.

Measure recovered-clock phase modulation to make the jitter-transfer curve.
Measure jitter generation with the specified clean or compliant input.
Use the required data patterns and equalizer settings.

### Avoid Measurement Disturbance

The tuning node can be sensitive to a probe's capacitance, leakage, and picked-up noise. Use a high-impedance, low-capacitance measurement method. Include the parasitics of any large [test pad](<../../05-PCB-Layout/04-Manufacturing-and-Test.md#design-for-access>) left on the final board.

Use a clean instrument reference.
A frequency counter or analyzer with a poor time base can make the PLL appear worse than it is.

## 11. Common Failure Modes

### The PLL Does Not Lock

Check these causes:

* The VCO cannot reach the target.
* The reference or feedback divider is incorrect.
* The PFD polarity is reversed.
* The tuning voltage is at a rail.
* The reference amplitude or slew rate is invalid.
* The loop is unstable.
* The charge pump is disabled or has the wrong current.
* Calibration selected the wrong VCO band.
* The output or feedback path is interrupted.
* A fractional or prescaler rule is violated.

Start with frequency, divider readback, PFD inputs, and tuning voltage.
Do not start by changing random filter components.

### Lock Is Intermittent

Possible causes include low phase margin, insufficient tuning margin, supply noise, a marginal reference, temperature-dependent VCO gain, calibration timing, or a lock-detector threshold that chatters.
Repeat startup at all supply and temperature corners.
Capture tuning voltage and lock indication during the failure.

### Lock Time Is Too Long

Possible causes include a narrow loop, cycle slips, low charge-pump current, a large divider value, slow VCO calibration, tuning-node saturation, or an overly strict lock-detector window.
Separate analog settling from digital calibration time.

Do not widen the loop until the noise, spur, and stability effects are checked.

### Output Jitter Is Too High

Separate the spectrum into offset regions.
Close-in noise can come from the reference, PFD, divider, or [flicker noise](<../../00-Foundations/00-Foundations.md#1f-noise>).
Midband peaking can show poor damping or a bandwidth crossover problem.
Far-out noise can come from the VCO or output buffer.

Check integration limits before comparing the measured result with the requirement.
Check reference multiplication, supply noise, termination, and measurement floor.

### Spurs Are Too High

Record each spur offset from the carrier.
Compare the offset with PFD rate, fractional pattern, power-converter frequencies, and digital clocks.

Check charge-pump mismatch, tuning-node leakage, reference coupling, VCO supply filtering, and output isolation.
A loop-filter change helps only when the spur reaches the oscillator through the filtered tuning path.

### The Loop Rings or Becomes Unstable

Check the actual VCO gain and charge-pump current.
Check filter component placement and values.
Include the active-filter amplifier, tuning-node capacitance, digital delay, and any hidden device pole.

Measure or simulate open-loop phase margin with the correct operating condition.
The worst condition can occur at one edge of the VCO range.

## 12. Verification Checklist

Before schematic release:

* [ ] Every output frequency has a valid <i>R</i>, <i>N</i>, fractional, VCO, and output-divider plan.
* [ ] All PFD, divider, prescaler, and VCO limits are satisfied.
* [ ] The reference meets amplitude, slew-rate, duty-cycle, and phase-noise requirements.
* [ ] The VCO has tuning-range margin at voltage and temperature limits.
* [ ] The loop-filter calculation uses consistent gain units.
* [ ] Loop type, order, bandwidth definition, phase margin, and added poles are identified.
* [ ] The noise budget includes reference, PLL, VCO, power, buffer, and distribution.
* [ ] Jitter integration limits and spur treatment are specified.
* [ ] Lock, settling, holdover, and missing-reference behavior are defined.
* [ ] Downstream circuits support the multiplied frequency.

Before PCB release:

* [ ] VCO, charge-pump, and reference supplies follow the device filtering guidance.
* [ ] The tuning node is short, quiet, and protected from leakage.
* [ ] Reference and output routing have the required impedance and termination.
* [ ] Fast output edges are isolated from the VCO and loop filter.
* [ ] Test access does not add harmful tuning-node capacitance or coupling.

During validation:

* [ ] Every channel locks across voltage, temperature, and repeated power cycles.
* [ ] Tuning voltage has margin from both rails.
* [ ] Frequency and phase settle inside the stated error band.
* [ ] Cycle slips and lock-detect timing meet the requirements.
* [ ] Phase noise and RMS jitter meet the stated offset limits.
* [ ] Reference, fractional, and power-related spurs meet the spectral mask.
* [ ] Loop response has acceptable bandwidth and peaking.
* [ ] CDR jitter transfer, tolerance, and generation pass when CDR operation applies.
* [ ] The final reference, output load, and downstream receiver are used in system testing.

## Related Topics

* [Crystal Oscillators](./Crystal-oscillators.md)
* [Real-Time Clocks](./RTCs.md)
* [Digital Filters](../Filters/Digital-filters.md)
* [Active Filters](../Filters/Active-filters.md)
* [ADCs and DACs](../Data-convertes/DACs.md)
* [Sample and Hold](../Data-convertes/Sample-holding.md)
* [Operational Amplifiers](../Amplifiers/01-op-amps.md)
* [Comparators](../Amplifiers/comparators.md)

## Technical References

These manufacturer references explain PLL architecture, loop behavior, noise, lock detection, and clock recovery:

* [Analog Devices: Phase-Locked Loop Fundamentals](https://www.analog.com/en/resources/analog-dialogue/articles/phase-locked-loop-pll-fundamentals.html)
* [Analog Devices: Phase-Locked Loops for High-Frequency Receivers and Transmitters, Part 1](https://www.analog.com/en/resources/analog-dialogue/articles/pll-for-high-frequency-receivers-and-transmitters-1.html)
* [Analog Devices AN-1067: The Power Spectral Density of Phase Noise and Jitter](https://www.analog.com/en/resources/app-notes/an-1067.html)
* [Analog Devices AN-873: Lock Detect on the ADF4xxx Family](https://www.analog.com/media/en/technical-documentation/application-notes/an-873.pdf)
* [Analog Devices HFTA-09.0: T3/E3/STS-1 Fiber Optic Extension (CDR Jitter Terminology)](https://www.analog.com/en/resources/technical-articles/hfta090-t3e3sts1-fiber-optic-extension.html)
* [Texas Instruments: CDC7005 as a Clock Synthesizer and Jitter Cleaner](https://www.ti.com/lit/an/scaa063a/scaa063a.pdf)
* [Texas Instruments: PLL Fundamentals, Part 1](https://www.ti.com/lit/ml/snap001/snap001.pdf)


## Clock pulse width at the receiver

A clock receiver can require minimum high and low pulse widths in addition to frequency limits. Excessive duty-cycle distortion reduces one of those intervals.

Jitter and ringing can further reduce the usable interval. Check pulse widths, setup and hold margin, and receiver thresholds at the actual receiving pin.

A phase-locked loop that meets its average frequency requirement can still fail these timing requirements. Include the complete clock path in verification.
