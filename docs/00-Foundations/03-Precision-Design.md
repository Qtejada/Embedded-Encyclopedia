---
title: Precision Design
sidebar_label: Precision Design
---

import AutonullingAmplifierDiagram from '@site/src/components/AutonullingAmplifierDiagram';
import PrecisionVoltmeterDiagram from '@site/src/components/PrecisionVoltmeterDiagram';

# Precision Design and Instrumentation Amplifiers

Precision design requires a complete error budget. It also requires the correct amplifier technology for the signal source and operating conditions.

## 1. Precision Design Method

Do not use only typical error values for a precision design. Use maximum values when the datasheet supplies them.

* **Accumulation problem:** A 1% error in one stage can be acceptable.
  * Errors from the input buffer, gain stage, filter, and ADC driver add together.
  * These combined errors can cause the system to fail its specification.
* **Error budget:** The error budget gives the maximum total error, *V<sub>err</sub>*.
  * The basic budget includes input-offset voltage and the voltage caused by input-bias current.

    > **Formula:** *V<sub>err</sub> = V<sub>os</sub> + (I<sub>b</sub> &times; R<sub>source</sub>)*

* **Example limits:** The design can require 100 &micro;V maximum input offset and 10 pA combined bias current.
  * The combined contribution from these errors must be less than 1%.
  * **Selected-part example:** A precision chopper amplifier can have 50 &micro;V offset and 1 pA bias current.
  * These values give only 0.6% total error in the example design.

## 2. BJT and FET Input Trade-Offs

The primary amplifier-selection decision is the input technology. The main options are bipolar junction transistor (BJT), JFET, and CMOS inputs.

### BJT Inputs

* **Primary advantage:** BJT inputs have very low voltage noise, *e<sub>n</sub>*.
  * This property is important for audio circuits and low-impedance sensors.
* **Primary disadvantage:** BJT inputs have more current noise, *i<sub>n</sub>*, and input-bias current, *I<sub>B</sub>*.
  * A BJT requires base current and takes current from the signal source.
* **Temperature behavior:** The bias current is relatively stable with temperature.
  * The bias current can decrease slightly when the temperature increases.
* **Offset voltage:** BJT inputs usually have less offset voltage than JFET or CMOS inputs.

### JFET and CMOS Inputs

* **Primary advantage:** FET inputs have very low bias current and current noise.
  * This property is important for photodiodes, pH probes, ECG electrodes, and other high-impedance sources.
* **Primary disadvantage:** FET inputs usually have more voltage noise and offset voltage.
  * Modern trim methods continue to decrease the offset voltage.
* **Temperature behavior:** The room-temperature bias current can be very low.
  * However, the bias current doubles for each 10&deg;C temperature increase.
* **Speed:** FET inputs usually give a higher slew rate for a specified bandwidth.

### Temperature Drift Example

<div className="definition-list">

* **Condition:** A FET operational amplifier has 1 pA bias current at room temperature.
* **Environment:** The circuit operates in a vehicle at 85&deg;C.
* **Calculation:** The bias current doubles for each 10&deg;C increase. At 85&deg;C, the bias current becomes **64 pA**.
* **Result:** The precision circuit can have a large drift.
* **Alternative:** A BJT input can be better when the source impedance is sufficiently low.
  * The BJT bias current is more stable across temperature.

</div>

### ECG Selection Example

A BJT operational amplifier can have excellent low-voltage-noise specifications. However, an ECG electrode has high skin impedance.

The BJT bias current flows through the skin resistance. This current produces a large DC offset from *V = IR*.

The BJT current noise can also be larger than the ECG signal. Thus, a FET input usually removes BJT parts from the first selection list.

### Input-Technology Selection Guide

* **High-impedance source:** For light sensors, pH probes, and ECG electrodes, start with a **JFET or CMOS input**.
* **Low-impedance source:** For audio, strain gauges, and power circuits, start with a **BJT input**.
* **High slew-rate requirement:** Start with a **FET input**. Section 5 gives more information about slew rate.

## 3. Amplifier Input Errors

### Input-Bias Current

<div className="definition-list">

* **Source-impedance interaction:** Input-bias current produces a voltage error when it flows through source resistance.
  * **Example:** A 1 k&Omega; source and a nanoampere bias current produce a microvolt-level error.
* **FET amplifiers:** FET inputs take very little current, but they can have more voltage offset.
* **Bipolar super-beta amplifiers:** These BJT amplifiers can also be applicable to low-bias-current designs.
* **Common-mode variation:** The input current of some amplifiers changes with input common-mode voltage.
  * Compare the input-current specification across the required input-voltage range.

</div>

### Input-Offset Voltage and Trim

* **Maximum specification:** Do not design a precision instrument with only the typical input-offset specification.
  * Typical offset can be less than 10 &micro;V. Use the maximum specified value for the error budget.
* **Temperature drift:** Temperature drift is important for stability, but manufacturers rarely test each production part for this parameter.
* **Time drift:** Modern datasheets frequently do not specify time drift.
  * A specified drift can behave like a random walk in nV/&radic;month.
  * This behavior is different from a predictable linear drift in nV/month.
* **Internal trim:** The manufacturer usually trims the amplifier accurately.
  * Additional external trim can be difficult and can give only a small improvement.
* **External trim network:** Some amplifiers include connections for an external trim network.
  * Use this network when more input-offset adjustment is necessary.

### Rejection Ratios and Gain

* **Common-mode rejection ratio (CMRR):** Insufficient CMRR produces an offset that changes with the DC input level.
  * **RRIO risk:** An RRIO amplifier can have a large offset change when its input common-mode voltage changes.
  * This behavior acts like poor CMRR.
  * An internal charge pump can prevent this problem. The OPA364 is an example.
* **Power-supply rejection ratio (PSRR):** A supply-voltage change produces a small operational-amplifier error.
  * Use the PSRR specification to estimate this error.
  * PSRR decreases when frequency increases.
* **Gain across frequency:** Amplifier gain changes with frequency.
  * Check the gain at the applicable signal frequency.

## 4. Noise Characteristics

**Voltage noise** is the in-band change of input-offset voltage that cannot be distinguished from the signal.

### Voltage-Noise Density

The **voltage-noise density**, *e<sub>n</sub>*, is the noise in a 1 Hz bandwidth. Its unit is nV/&radic;Hz.

The noise-density curve has two important regions:

* **High-frequency region:** The density is usually flat and is called white noise.
  * Datasheets frequently give this value at 1 kHz.
* **Low-frequency region:** The density increases when frequency decreases.
  * This region contains 1/f noise, which is also called pink noise.
  * Standard operational amplifiers become noisy near DC.
  * Auto-zero amplifiers keep a flat density near DC.

### Integrated Noise

A small density value can produce a large total noise across a wide bandwidth. The listener or measurement system receives the integrated noise.

> **Formula:** *V<sub>total</sub> = e<sub>n</sub> &times; &radic;BW*

For example, use a 100 kHz circuit bandwidth and a 10 nV/&radic;Hz operational amplifier:

> *10 nV &times; &radic;100,000 = 10 nV &times; 316 &asymp; 3.16 &micro;V*

The bandwidth multiplies the density value by more than 300. A 10 &micro;V EEG signal can be below this noise level.

### Transimpedance-Amplifier Risk

This effect is important for photodiode and other transimpedance amplifiers.

At high frequencies, voltage noise interacts with the sensor input capacitance, *C<sub>in</sub>*. This interaction produces a large equivalent current noise:

> *i<sub>n</sub> = e<sub>n</sub> 2&pi;f C<sub>in</sub>*

In a high-speed photodiode circuit, operational-amplifier voltage noise can become the primary error source. It can exceed the feedback-resistor noise.

Noise density is not important for a simple LED blink circuit. It is critical for these applications:

* **ECG measurements:** Low-frequency 1/f noise is important.
* **Photodiode measurements:** High-frequency voltage noise is important.

The selected noise parameter can determine if the device measures a signal or produces only noise.

### 1/f Noise

Noise spectral density increases below the **1/f corner frequency**. Calculate the total RMS noise by integrating the density squared across the applicable band:

> *v<sub>n</sub><sup>2</sup> = &int; e<sub>n</sub><sup>2</sup> df*

* **Bandwidth factor:** Low-frequency noise density is high, but the low-frequency span is frequently small.
  * Thus, the total low-frequency noise can remain acceptable.
* **Corner frequency:** The 1 kHz white-noise value can give an incorrect comparison for low-frequency applications.
  * The LT1012 has 14 nV/&radic;Hz white noise and a 2.5 Hz corner.
  * The OPA277 has 8 nV/&radic;Hz white noise and a 20 Hz corner.
  * Thus, the LT1012 can have less low-frequency noise than the OPA277.
* **Auto-zero exception:** Auto-zero and chopper amplifiers do not have 1/f noise.
  * Their noise density stays flat to DC.
  * This behavior is useful for very-low-frequency measurements.
* **Peak-to-peak noise:** *V<sub>npp</sub>* is the primary low-frequency noise specification.
  * This value measures noise from 0.1 Hz to 10 Hz.
  * This value is a proxy for DC noise and indicates long-term drift stability.
* **Scaling rule:** For a lower start frequency, multiply *V<sub>npp</sub>* by the square root of the additional frequency decades.
  * Equal noise power occurs in each decade. Therefore, the total noise increases with &radic;decades.
* **ECG relevance:** Diagnostic ECG bandwidth extends to 0.05 Hz.
  * The 0.1 Hz to 10 Hz *V<sub>npp</sub>* value is the primary noise value for baseline stability.
  * A high 1/f corner causes the ECG baseline to move.

### Noise Impedance and Source Matching

**Noise impedance**, *Z<sub>n</sub>*, shows whether voltage noise or current noise is more important:

> *Z<sub>n</sub> = e<sub>n</sub> / i<sub>n</sub>*

Compare *Z<sub>n</sub>* with the signal-source impedance, *Z<sub>s</sub>*:

* **Z<sub>s</sub> &ll; Z<sub>n</sub>:** Operational-amplifier voltage noise is dominant.
  * Typical applications include audio circuits, power supplies, and strain gauges.
* **Z<sub>s</sub> &gg; Z<sub>n</sub>:** Operational-amplifier current noise is dominant.
  * Typical applications include ECG electrodes, pH probes, and photodiodes.
* **Selection rule:** A high-impedance sensor requires low current noise.
  * A FET input can be necessary even when its voltage-noise value is higher.

### Current Noise and Bias Cancellation

* **Standard relation:** Current noise in a standard operational amplifier follows the shot noise of its bias current.
  > *i<sub>n</sub> = &radic;(2qI<sub>B</sub>)*
* **Bias-cancellation exception:** Many precision BJT amplifiers use an internal circuit to cancel DC input-bias current.
  * This circuit decreases DC drift but can increase AC current noise.
* **Practical result:** Do not calculate AC noise only from the DC input-bias-current specification.
  * Find the *i<sub>n</sub>* specification in the datasheet.
  * The specified current noise can be 10 times the theoretical shot-noise value.

### Medical Application Map

#### ECG: 1/f Noise and Bias Current

* **Signal:** Approximately 1 mV, from 0.05 Hz to 100 Hz.
  * Skin source impedance is approximately 500 k&Omega;.
* **1/f-noise risk:** The signal band is in the low-frequency noise region.
  * A high 1/f corner causes baseline movement that can look like a breathing artifact.
* **Bias-current risk:** A 100 nA BJT bias current through 500 k&Omega; produces a **50 mV offset**.
  * This offset can saturate the amplifier before signal gain is applied.
* **Selection:** Use a low-bias JFET or CMOS input with low 1/f noise.
  * Chopper and auto-zero amplifiers are frequent choices.

#### Gating: Slew Rate

* **Signal:** The R-wave starts an MRI or CT scan.
  * The R-wave is the sharpest and fastest part of the cardiac cycle.
* **Pacemaker spike:** A pacemaker spike can be shorter than 2 ms and can have a high voltage.
* **Slew-rate risk:** A slow amplifier changes the sharp spike into a wide pulse.
  * The pulse can look like a QRS complex.
  * The gating algorithm can start the scan on the pacemaker spike instead of the heartbeat.
* **Selection:** Use sufficient slew rate to keep the sharp pulse edges for digital trigger logic.

#### Pleth and SpO2: Voltage Noise

* **Signal:** A transimpedance amplifier changes photodiode current into voltage.
* **Capacitance:** A photodiode has capacitance.
* **Noise-gain risk:** Operational-amplifier voltage noise interacts with this capacitance.
  * The interaction produces large high-frequency noise from *i<sub>n</sub> = e<sub>n</sub> &omega; C*.
* **Selection:** Use low operational-amplifier voltage noise to decrease this multiplication effect.
  * This rule applies although the photodiode is a current source.

#### Respiration: Dynamic Range

* **Signal:** Impedance pneumography injects a carrier sine wave.
  * It measures an amplitude change of approximately 1% when the chest expands.
* **Dynamic-range risk:** The baseline impedance is approximately 500 &Omega;.
  * The breath-related change is approximately 1 &Omega;.
* **Offset risk:** A large offset uses gain and output range for the 500 &Omega; baseline error.
  * Less dynamic range remains for the 1 &Omega; respiration signal.

## 5. Dynamic Performance

### Gain-Bandwidth Product

* **Loop gain:** A high gain-bandwidth product (GBW) gives spare loop gain at lower frequencies.
  * More loop gain improves linearity and decreases distortion.
* **Decompensated amplifiers:** Some high-speed amplifiers are not stable at a closed-loop gain of one.
  * These amplifiers require a minimum closed-loop gain.
  * For example, an amplifier can require *A<sub>V</sub> &ge; 10* to prevent oscillation.

### Slew Rate

Most operational amplifiers use the Widlar topology. The input stage drives a second stage that contains a compensation capacitor, *C*.

The input stage has a fixed maximum current, *I<sub>E</sub>*. This current must charge or discharge the compensation capacitor.

When all available current flows into the capacitor, the output cannot change faster. This limit is the **slew rate**:

> *dV/dt = I/C*

### Precision Effects of Slew-Rate Limiting

When an operational amplifier reaches its slew-rate limit, two precision problems occur:

1. **Frequency and amplitude limit:** The output cannot have high frequency and high voltage at the same time.
   > *V<sub>pp</sub> = S / &pi;f*
2. **Input-error pulse:** The differential input voltage is normally almost zero.
   * A fast output change requires a large differential input voltage.
   * During a pacemaker spike, the feedback loop can temporarily stop its normal operation.

### Slew-Rate Enhancement

A standard BJT amplifier has this approximate relation:

> **Slew rate &asymp; 0.3 &times; bandwidth**

Different input-stage designs increase slew rate without a very large bandwidth and its related power:

* **JFET inputs:** Lower transconductance gives more slew rate for a specified bandwidth.
  * The LF411 has an enhancement factor of approximately *m = 12*.
* **Emitter degeneration:** Input-transistor resistance decreases gain but increases speed.
* **Cross-coupled or Butler stages:** These designs increase the current available to the compensation capacitor.
  * The TLE2142 and OP275 are examples.
* **Current-feedback amplifiers:** This topology can give very high slew rates.
  * The LT1210 has an enhancement factor greater than *m = 55*.
  * Current-feedback amplifiers are more difficult to use in precision DC circuits.

### Distortion and Datasheet Limits

Loop gain decreases when signal frequency increases. Less loop gain decreases error correction and causes output distortion to increase.

Manufacturers do not use one standardized distortion test. Thus, do not directly compare all distortion graphs.

#### Distortion-Measurement Traps

1. **Noise-floor mask:** A distortion plot can look flat at low frequencies.
   * The amplifier can perform better than the graph shows.
   * The measurement equipment noise floor can hide the actual performance.

2. **Input-capacitance distortion:** This problem occurs with a high-impedance source and some JFET amplifiers.
   * **Example part:** The OPA1641 can show this effect.
   * **Cause:** JFET input capacitance, *C<sub>in</sub>*, changes with common-mode voltage, *V<sub>cm</sub>*.
   * **Result:** The changing capacitance changes the filter cutoff and signal phase.
   * Distortion can increase from 20 ppm to 100 ppm.
   * **Design risk:** Input-capacitance modulation is a major risk for sensors and ECG circuits.
   * **Correction:** Use an inverting configuration with constant common-mode voltage, or accurately match the source impedances.

3. **Gain-of-101 test:** A manufacturer can use a noise gain of 101 to make a very small error measurable.
   * The manufacturer then divides the measured result by 100.
   * This test gives a very low source impedance that can be different from the application circuit.

### Phase Error

For good phase accuracy, select an amplifier bandwidth 50 to 100 times higher than the signal frequency. Video circuits frequently require this accuracy.

For amplitude accuracy without strict phase accuracy, a bandwidth 10 times higher than the signal frequency can be sufficient.

## 6. Output Characteristics

### Crossover Distortion

Older or low-power operational amplifiers can use a Class-B output stage. The LM324 and LM358 are examples.

* **Cause:** The output transistors do not have a continuous bias current.
  * Approximately 1.2 V separates the NPN source-current action from the PNP sink-current action.
  * This voltage is two base-emitter voltage drops, *2V<sub>BE</sub>*.
* **Zero-crossing effect:** The output stage changes from source current to sink current when the signal crosses zero.
  * For a short time, the output is disconnected and stays at zero.
  * The internal circuit slews until the other transistor starts to conduct.
* **Result:** The output has a large distortion pulse near the zero crossing.
  * The effect is worse at high frequencies because the amplifier has less loop gain.
  * The amplifier cannot correct the pulse as quickly.
  * This effect is associated with the harsh transistor sound of early solid-state audio equipment.
* **Correction:** Use a Class-AB operational amplifier, such as the LT1013.
  * A small bias current keeps both output transistors partially on.
  * This condition removes the dead zone and its distortion.

### Output Impedance

An ideal operational amplifier has zero output impedance. A real open-loop output impedance, *R<sub>o</sub>*, can be hundreds of ohms.

* **Variation with output voltage:** *R<sub>o</sub>* is frequently highest when the output is near ground.
  * The internal transistors operate at low current in this condition.
* **Variation with frequency:** *R<sub>o</sub>* increases at high frequencies because transistor gain decreases.
* **Capacitive-load risk:** *R<sub>o</sub>* reacts with an output load capacitor, *C<sub>load</sub>*.
  * The resistance and capacitance make a low-pass filter inside the feedback loop.
* **Result:** The filter adds phase lag.
  * Excessive lag changes negative feedback into positive feedback.
  * The operational amplifier then becomes unstable and oscillates.

:::tip Design Summary

* Do not use an old LM358 for high-quality audio because its output stage has a dead zone.
* Do not assume that an operational amplifier can drive a capacitor directly.
  * The internal output resistance can cause oscillation.

:::

## 7. Rail-to-Rail Operation

Rail-to-rail operation is useful in low-voltage systems, but it introduces additional errors.

### Definitions

* **Rail-to-rail input (RRI):** The input common-mode range extends to both supply rails.
* **Rail-to-rail output (RRO):** The output voltage can move close to both supply rails.
* **Rail-to-rail input/output (RRIO):** The amplifier has RRI and RRO operation.

### RRI Input Crossover

* **Input pairs:** An RRI amplifier usually has a PMOS pair and an NMOS pair.
* **Crossover:** The amplifier changes from one input pair to the other when the input voltage changes.
* **Error change:** This transfer causes a sudden change in input-bias current and offset voltage.
  * The change produces a crossover-distortion pulse.
  * The change also decreases effective CMRR and linearity.
* **Technology:** Most RRI amplifiers use CMOS input stages.
  * BJT operational amplifiers rarely have a true rail-to-rail input.
* **Mitigation:** If RRI operation is not necessary, use an RRO amplifier without RRI.
  * An inverting configuration can also prevent input crossover.
  * The inputs stay at virtual ground in this configuration.

### RRO Output Impedance

* **Output stage:** An RRO amplifier frequently uses a common-source output instead of a complementary push-pull output.
* **Output impedance:** This stage has high output impedance that changes with load resistance.
* **Capacitive load:** A load capacitor can cause a large phase shift.
* **Distortion:** Rail-to-rail output amplifiers frequently have more distortion than standard output stages.

## 8. Amplifier Topologies

### Auto-Zero and Chopper-Stabilized Amplifiers

* **Operation:** An internal circuit monitors the inputs and corrects *V<sub>os</sub>* toward zero.
* **Performance:** This topology gives the best input-offset performance.
  * It corrects input-offset voltage, offset drift, and 1/f noise.
* **Supply limit:** These amplifiers frequently have a low maximum supply voltage.
  * A typical maximum value is 6 V.
* **Clock feedthrough:** Internal switching can add noise and cause small output changes.
  * A low-pass filter can decrease this clock feedthrough.
* **Application:** Use this topology for slow, accurate transducer measurements and normal-bandwidth applications.

### Difference Amplifiers

* **Function:** A difference amplifier receives two signals and produces their amplified difference.
  > *V<sub>out</sub> = G &times; (V<sub>in+</sub> - V<sub>in-</sub>)*
* **Characteristics:**
  * High CMRR.
  * Low but accurate gain.
  * Relatively low input impedance.
  * An input range that can extend beyond the supply rails.
* **Application:** Drive a difference amplifier with a low-impedance source.

### Instrumentation Amplifiers

* **Function:** An instrumentation amplifier receives a differential input and gives a single-ended output.
* **Input impedance:** Buffered inputs give very high input impedance and prevent source loading.
* **Gain:** The user can set the gain across a wide range.
* **CMRR:** Very high CMRR rejects common-mode noise.
* **CMRR example:**
  * The circuit must amplify a millivolt differential signal on a common-mode voltage of approximately 2.5 V.
  * The maximum error is 0.1% of full scale.
  * This limit equals &plusmn;0.01 mV of error on 2500 mV of common-mode voltage.
  * The required CMRR is 250,000:1, or **108 dB**.
* **Application:** Use an instrumentation amplifier for very small signals that require high precision.

### Differential-Output Amplifiers

* **Function:** This amplifier accepts a differential or single-ended input and gives a differential output.
* **Application:** This topology frequently drives a differential ADC.

## 9. Design Example: High-Precision Voltmeter

This example applies a complete precision-design method to a high-performance analog voltmeter.

<PrecisionVoltmeterDiagram />

<div style={{fontSize: '0.9rem', color: 'var(--hw-text-secondary)', textAlign: 'center'}}>
  Source design: Adapted from <em>The Art of Electronics</em>, Figure 5.1. This diagram shows the functional paths described in these notes.
</div>

### Design Requirements

1. **Low-voltage range:** The meter measures from 0 mV to 10 mV full scale.
2. **High input impedance:** The input resistance is 10 M&Omega; to prevent loading of the measured circuit.
3. **Low-voltage single supply:** One lithium or alkaline battery supplies the circuit.
   * The circuit operates with a supply as low as +1.8 V.
   * The operational amplifier must operate near 0 V and must support rail-to-rail operation.
4. **Zero error:** The meter reads exactly 0 mV when the input is disconnected.
   * The design does not require a manual zero adjustment.

### Component Functions

<div className="definition-list">

* **R4 (100 &Omega;, 0.1%): Current-sense resistor**
  * **Role:** Precision scaling.
  * **Operation:** Operational-amplifier feedback forces the input voltage across R4.
  * Ohm's law changes the input voltage into an accurate current for the meter movement.
  * R4 sets the accuracy of the complete meter.

* **R3 (10 k&Omega;): Meter-protection resistor**
  * **Role:** Current limit for the physical meter coil.
  * **Operation:** R3 limits current if the amplifier output moves to the full battery voltage during startup or saturation.
  * The limited current is approximately 0.3 mA.

* **R2 (10 k&Omega;): Input-current limiter**
  * **Role:** Input-protection current limit.
  * **Operation:** R2 protects the clamp diodes during a high-voltage input overload.
  * For example, R2 limits current if a 9 V battery is accidentally connected to the input.

* **PN4117 diodes: Input-voltage clamps**
  * **Role:** Input overvoltage protection.
  * **Operation:** The diodes clamp a dangerous input to approximately 0.6 V.
  * This action prevents damage to the sensitive operational-amplifier inputs during an incorrect connection.

* **R1 (10 M&Omega;): Input-impedance and bias-return resistor**
  * **Role:** Input-resistance setting and DC bias path.
  * **Operation:** R1 sets the required 10 M&Omega; input resistance.
  * R1 also supplies a DC path for the small input-bias currents.

* **C1 (10 nF) and R5 (100 k&Omega;): Frequency-compensation network**
  * **Role:** Split-path feedback for stability.
  * **R5 path:** R5 supplies the DC feedback path through the meter.
  * **C1 path:** C1 supplies the high-frequency feedback path.
  * **Reason:** The physical meter is an inductive coil that blocks high frequencies.
  * Without C1, the amplifier loses high-frequency feedback and can oscillate.
  * C1 bypasses the slow meter and sends high-frequency signals directly to the amplifier feedback input.
  * This path keeps the feedback loop stable.

</div>

## 10. Design Example: Autonulling DC Laboratory Amplifier

This circuit stores an input value. It then amplifies subsequent input changes with selectable gains of 1, 10, or 100.

<AutonullingAmplifierDiagram />

<div style={{fontSize: '0.9rem', color: 'var(--hw-text-secondary)', textAlign: 'center'}}>
  Source design: Adapted from <em>The Art of Electronics</em>, Figure 5.3. This diagram shows the signal and nulling paths described in these notes.
</div>

### Circuit Architecture

* **U1:** An instrumentation amplifier with a configurable gain that starts at 1&times;.
* **U2:** A non-inverting stage with a fixed gain of 10.
* **Total system gain:** The maximum system gain is 1000.
* **Output range:** The output range is &plusmn;10 V.
* **U3, U4, and U5:** These devices form the nulling circuit.
  * The nulling circuit stores the input value and subtracts it from subsequent samples.

### Drift Requirements

1. **Input drift:** The input drift must be less than 10 &micro;V.
2. **Null drift:** The null drift must be less than 1 &micro;V/min.
   * Discharge of the hold capacitor causes most of the null drift.

### Component-Selection Method

* **Gain-setting resistors R1 through R4:** Use 0.1% tolerance to get accurate gain steps.
* **Noncritical resistors R5 through R13:** Use 1% tolerance.
  * These resistors are used for bias and logic functions.
  * Their tolerance does not control the precision performance.
* **Hold-capacitor material:** Use a material with the lowest possible leakage.
  * Polypropylene and Teflon are examples of applicable low-leakage materials.
* **Leakage example:** The capacitor leakage resistance is 100 G&Omega;, and the output is 10 V.
  * The leakage current produces **3 mV/min** of drift.
  * This value is not acceptable for the 1 &micro;V/min null-drift requirement.
* **Dielectric absorption:** A capacitor can return toward a previous charge state after discharge.
  * This effect is also called the memory effect.
  * In a sample-and-hold circuit, the switch opens after the capacitor discharges.
  * The capacitor voltage can then move toward its previous value before it becomes stable.
  * This voltage change adds an error.

## 11. Precision-Design Checklist

* **High-impedance source such as ECG or pH:** Give current noise priority over voltage noise.
  * Minimize *i<sub>n</sub>* and use a FET input.
* **Low-impedance source such as a strain gauge or power circuit:** Give voltage noise priority over current noise.
  * Minimize *e<sub>n</sub>* and start with a BJT input.
* **Precision BJT amplifier:** Find if the part uses bias cancellation.
  * If it does, the current noise can be much higher than the DC bias current suggests.
* **High-frequency respiration or gating signal:** Check CMRR at the signal frequency, not only at DC.
* **High-speed or audio signal:** Examine the applicable THD+N graphs.
  * A flat low-frequency line can show the measurement-system noise floor instead of the amplifier limit.
