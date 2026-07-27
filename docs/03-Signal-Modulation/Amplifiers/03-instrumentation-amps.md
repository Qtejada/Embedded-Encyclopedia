---
title: Instrumentation Amplifiers
sidebar_label: Instrumentation Amps
---

import InstrumentationAmpErrorExplorer from '@site/src/components/InstrumentationAmpErrorExplorer';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Instrumentation Amplifiers

An **instrumentation amplifier**, or **in-amp**, amplifies a small differential voltage.
It rejects a much larger voltage that is common to both inputs.

An in-amp usually gives a single-ended output.
Buffered inputs give it very high input impedance.
One external resistor frequently sets its gain.

Use an in-amp for:

* Bridge sensors and strain gauges.
* Load cells and pressure sensors.
* Electrocardiogram (**ECG**) electrodes.
* pH probes and other high-impedance sensors.
* Current-shunt measurements.
* Data-acquisition (**DAQ**) inputs.
* Small signals on high common-mode voltages.

---

## 1. Why Use an Instrumentation Amplifier?

A four-resistor difference amplifier can reject common-mode voltage.
Its input resistors can load the signal source.
Its CMRR also depends directly on resistor-ratio matching.

An instrumentation amplifier adds input buffers and a precision difference stage.

The main advantages are:

* **Very high input impedance:** The input buffers take very little current from the source.
* **High common-mode rejection ratio (CMRR):** Matched internal resistors reject common-mode voltage.
* **Simple gain control:** One resistor can set gain across a wide range.
* **Low source loading:** Weak sensors keep their original signal voltage.
* **Accurate differential gain:** Factory-trimmed components give better ratio accuracy.
* **Reference control:** A reference pin sets the output DC level.

Use a basic difference amplifier when source impedance is low and moderate CMRR is sufficient.
Use an in-amp when source loading, gain accuracy, or CMRR is more important.

---

## 2. Classic Three-Op-Amp Architecture

A classic instrumentation amplifier contains three op-amps.
Two op-amps make the input stage.
The third op-amp makes the output difference stage.

### Input Buffer and Gain Stage

The first two op-amps receive the differential inputs.
They operate as non-inverting amplifiers.

* Each input has very high impedance.
* The two op-amps buffer the signal sources.
* A gain resistor, <i>R<sub>G</sub></i>, connects the two feedback networks.
* Differential voltage produces current through <i>R<sub>G</sub></i>.
* Common-mode voltage produces little voltage across <i>R<sub>G</sub></i>.
* The first stage amplifies the differential signal before subtraction.

For one common symmetrical circuit, first-stage gain is:

> **G<sub>1</sub> = 1 + 2R/R<sub>G</sub>**

The exact equation depends on the internal circuit.
For an integrated in-amp, use the datasheet equation.

A common integrated form is:

> **G = 1 + K/R<sub>G</sub>**

The manufacturer specifies constant <i>K</i>.

### Output Difference Stage

The third op-amp subtracts the two first-stage outputs.
It also converts the differential signal to a single-ended output.

The supplied archives do not contain a complete instrumentation-amplifier schematic.
The figure below shows the difference-amplifier stage used at the output of the classic architecture.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/DifferentialAmplifierFigure4.9.png')}
    alt="Four-resistor op-amp difference stage used at the output of a classic instrumentation amplifier"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Difference-amplifier output stage. This is not the complete three-op-amp in-amp. Image source: <i>The Art of Electronics</i>, Figure 4.9.
  </figcaption>
</figure>

Matched resistor ratios in this stage are necessary for high CMRR.
Integrated in-amps use trimmed internal resistor networks.

### Reference Pin

The **reference pin** sets the output voltage for zero differential input.

The ideal relationship is:

> **V<sub>out</sub> = V<sub>ref</sub> + G(V<sub>+</sub> - V<sub>-</sub>)**

For a dual-supply circuit, <i>V<sub>ref</sub></i> can be 0 V.
For a single-supply circuit, it can be mid-supply.

Drive this pin from a low-impedance source.
Reference impedance can decrease CMRR and add gain error.

---

## 3. Step-by-Step Signal Operation

Assume that both inputs are near 2.5 V.
Input 1 is 1 mV higher than input 2.
The selected gain is 100.

### Step 1: Receive the Inputs

The two input buffers receive the sensor voltages.
Their high impedance prevents significant source loading.

### Step 2: Separate Differential and Common-Mode Content

The common-mode voltage is approximately 2.5 V:

> **V<sub>cm</sub> = (V<sub>+</sub> + V<sub>-</sub>)/2**

The differential voltage is 1 mV:

> **V<sub>d</sub> = V<sub>+</sub> - V<sub>-</sub> = 1 mV**

### Step 3: Apply Differential Gain

The gain network amplifies the 1 mV difference by 100:

> **100 &times; 1 mV = 100 mV**

The common-mode signal ideally has no gain.

### Step 4: Subtract the Buffered Signals

The output difference stage subtracts the two amplified signals.
Matched internal resistors remove most of their common voltage.

### Step 5: Add the Reference Voltage

If <i>V<sub>ref</sub> = 0 V</i>, the ideal output is 100 mV.
If <i>V<sub>ref</sub> = 2.5 V</i>, the ideal output is 2.6 V.

### Step 6: Check Physical Limits

The inputs must stay inside the common-mode range.
The output must stay inside the output-swing range.
The amplifier must also have sufficient bandwidth and settling time.

---

## 4. Common-Mode Rejection

**CMRR** shows how well the amplifier rejects voltage that is equal at both inputs.

> **CMRR = A<sub>d</sub> / A<sub>cm</sub>**

> **CMRR<sub>dB</sub> = 20 log<sub>10</sub>(A<sub>d</sub> / A<sub>cm</sub>)**

High CMRR is necessary when a small signal is on a large common-mode voltage.

### 108 dB Example

The existing precision notes give this example:

* The differential signal is in the millivolt range.
* The common-mode voltage is approximately 2.5 V, or 2500 mV.
* The maximum common-mode error is &plusmn;0.01 mV.
* The required rejection ratio is 2500 mV / 0.01 mV.
* This ratio is 250,000:1.
* The required CMRR is approximately **108 dB**.

### CMRR Is Not Constant

CMRR usually decreases as frequency increases.
Check the datasheet graph at each important interference frequency.

For an ECG circuit, check:

* DC CMRR.
* 50 Hz or 60 Hz power-line rejection.
* Respiration-signal frequency.
* Pacing or gating frequencies when applicable.

Input-source imbalance also decreases system CMRR.
The amplifier specification alone does not include all external imbalance.

---

## 5. Error Budget

Small input errors become important at high gain.
Calculate each error at the input or at the output.
Do not add values that use different reference points.

### Input Offset Voltage

**Input offset voltage**, <i>V<sub>OS</sub></i>, acts like an unwanted differential input.

> **V<sub>out,error</sub> = G &times; V<sub>OS</sub>**

A 100 &mu;V offset becomes 10 mV at a gain of 100.

### Offset Drift

Offset changes with temperature and time.
Initial calibration does not remove later drift.

Include:

* Maximum offset-drift coefficient.
* Full operating-temperature range.
* Long-term drift when the application needs it.

### Input Bias Current

Input bias current flows through source resistance.
It produces an input voltage error.

> **V<sub>error</sub> = I<sub>B</sub>R<sub>source</sub>**

Equal bias currents through equal source resistances make mostly common-mode voltage.
Resistance mismatch makes a differential error.

### Input Offset Current

The two bias currents are not exactly equal.
Their difference is **input offset current**.
This difference produces error even when the two source resistances are equal.

### Finite CMRR

Finite CMRR converts part of the common-mode voltage to output error.

> **A<sub>cm</sub> = G / 10<sup>(CMRR<sub>dB</sub>/20)</sup>**

> **V<sub>out,cm</sub> = A<sub>cm</sub>V<sub>cm</sub>**

### Gain Error and Gain Drift

Gain-setting resistance has tolerance and temperature drift.
The in-amp also has internal gain error.

Include:

* Initial gain error.
* Gain nonlinearity.
* Gain drift.
* External <i>R<sub>G</sub></i> tolerance.
* External <i>R<sub>G</sub></i> temperature coefficient.

### Noise

Total input noise includes:

* Input-voltage noise.
* Input-current noise multiplied by source impedance.
* Source-resistance thermal noise.
* Gain-resistor thermal noise.
* Reference-pin noise.
* Low-frequency 1/f noise.
* Broadband noise integrated across measurement bandwidth.

<InstrumentationAmpErrorExplorer />

---

## 6. Select the Input Type from Source Impedance

Do not select an amplifier from voltage-noise density alone.
Source impedance determines whether voltage noise or current noise is more important.

### High-Impedance Sources

Examples include:

* ECG electrodes.
* pH probes.
* Photodiodes.
* Other weak transducers.

Start with a **JFET-input** or **CMOS-input** amplifier.
These input types usually have lower bias current and current noise.

The existing ECG example uses skin source impedance near 500 k&Omega;.
A low-voltage-noise BJT input can still produce too much current-noise error at this impedance.

### Low-Impedance Sources

Examples include:

* Strain gauges.
* Low-resistance bridges.
* Current shunts.
* Power circuits.

A **BJT-input** amplifier can be better.
Its low voltage noise can be more important than its higher current noise.

### Noise-Impedance Check

Compare source impedance, <i>Z<sub>s</sub></i>, with amplifier noise impedance:

> **Z<sub>n</sub> = e<sub>n</sub> / i<sub>n</sub>**

* If <i>Z<sub>s</sub> &lt;&lt; Z<sub>n</sub></i>, voltage noise usually dominates.
* If <i>Z<sub>s</sub> &gt;&gt; Z<sub>n</sub></i>, current noise usually dominates.

Include both noise sources in the final calculation.

---

## 7. Input and Output Operating Range

### Common-Mode Input Range

Both inputs must stay inside the specified common-mode range.
The permitted range can change with gain, supply voltage, and temperature.

Some in-amps permit common-mode voltage near a supply rail.
Some devices do not.
Use the datasheet range graph or equation.

### Differential Input Range

High gain decreases the permitted differential input before output saturation.

For example, a 5 V output range and gain of 100 allow less than 50 mV of ideal differential input.
Offset and reference voltage use part of the available output range.

### Output Swing

The output cannot usually reach either supply rail.
Load resistance can further decrease output swing.

Check:

* Minimum output voltage.
* Maximum output voltage.
* Output current.
* Load resistance.
* Load capacitance.

### Input Overvoltage

A sensor cable can apply voltage when the in-amp has no power.
Fault voltage can also exceed the normal input range.

Use:

* Series input resistance.
* Low-leakage clamp devices.
* Current limits from the datasheet.
* Protection that does not unbalance the input impedances.

Unequal protection resistance can decrease CMRR.

---

## 8. Single-Supply and ADC Interfaces

### Set the Output Reference

A single-supply ADC cannot usually accept a negative voltage.
Set the in-amp reference pin to the ADC midpoint.

For a 0 V to 5 V ADC:

* Set <i>V<sub>ref</sub></i> near 2.5 V.
* A zero differential input then gives approximately 2.5 V output.
* Positive differential input moves the output upward.
* Negative differential input moves it downward.

The reference source must be quiet and have low impedance.
Buffer a high-impedance divider.

### ADC Resolution Check

For a &plusmn;10 V input range, total span is 20 V.
A 16-bit ADC has this ideal code size:

> **LSB = 20 V / 65,536 &asymp; 300 &mu;V**

An amplifier with 5.5 mV input-referred offset has an error approximately 18 times larger than this LSB.
Calibration or a lower-offset amplifier is necessary.

### Temperature-Drift Check

The existing DAQ notes give this example:

* Amplifier gain drift is 40 ppm/&deg;C.
* A 16-bit code is approximately 15 ppm of full scale.
* A 1&deg;C change produces more than one LSB of gain error.

High resolution does not correct analog temperature drift.

### Multiplexer Settling

For a multiplexed DAQ, total sample time includes:

> **T<sub>total</sub> = T<sub>mux</sub> + T<sub>amp settling</sub> + T<sub>ADC acquisition</sub>**

If the system switches too quickly, the new channel does not settle.
The result contains part of the previous channel signal.

---

## 9. Gain Selection and Bandwidth

Higher closed-loop gain usually gives lower signal bandwidth.
It can also increase settling time.

### External Gain Resistor

Use a low-drift resistor for <i>R<sub>G</sub></i>.
Its resistance directly controls gain in many in-amps.

Check:

* Tolerance.
* Temperature coefficient.
* Voltage coefficient.
* Noise.
* Parasitic capacitance.
* Connection resistance.

Put <i>R<sub>G</sub></i> near the amplifier pins.

### Programmable-Gain Amplifier

A **programmable-gain amplifier (PGA)** changes gain under digital control.
It is useful when one ADC measures signals with different amplitudes.

One existing DAQ example uses:

* A high-impedance PGA input near 10 G&Omega;.
* An external DAC to cancel 5.5 mV offset.
* Stored gain settings for each input channel.
* More than 2 &mu;s of settling before conversion.

Use current datasheets for exact limits and timing.

---

## 10. Application Examples

### ECG Front End

An ECG measures small differential electrode voltages.
The body can also carry a much larger common-mode power-line signal.

The input stage needs:

* Very high input impedance.
* Very low bias current.
* Low current noise.
* High CMRR at 50 Hz or 60 Hz.
* Low 1/f noise.
* Patient-protection components.
* Input protection that preserves impedance balance.

### Strain-Gauge Bridge

A strain gauge frequently uses a Wheatstone bridge.
The bridge produces a small differential voltage.
Its common-mode voltage is frequently near half the excitation voltage.

The in-amp supplies:

* High differential gain.
* Common-mode rejection.
* Low loading of the bridge.
* A single-ended output for the ADC.

For a low-resistance bridge, low voltage noise is usually important.

### Current-Shunt Measurement

A shunt resistor produces a differential voltage proportional to current.
Its two terminals can be far from ground.

Check:

* Common-mode range.
* Input protection.
* Gain accuracy.
* Shunt self-heating.
* Kelvin connections.
* Required bidirectional output reference.

### Autonulling Laboratory Amplifier

The existing precision-design page includes an autonulling amplifier.
Its first stage is an instrumentation amplifier with selectable gain.

The complete system:

* Stores an input value.
* Subtracts this stored value from later samples.
* Selects gains of 1, 10, or 100 in its main signal path.
* Uses a second stage with fixed gain of 10.
* Gives a maximum system gain of 1000.
* Gives an output range of &plusmn;10 V.

Its input-drift limit is 10 &mu;V.
Its null-drift limit is 1 &mu;V/min.

---

## 11. PCB Layout and Wiring

High CMRR needs symmetrical external wiring.

### Input Pair

* Route both inputs together.
* Keep their lengths similar.
* Keep them away from clocks and switching nodes.
* Use a twisted pair for a remote sensor.
* Use shielding when the environment requires it.

### Impedance Balance

* Use equal input-filter resistors.
* Use matched input capacitors.
* Use equal protection components.
* Keep leakage paths similar.

A tolerance difference in an input filter can convert common-mode interference to a differential error.

### Ground and Reference

* Connect the reference source to a quiet analog ground.
* Do not share its path with high current.
* Decouple each supply pin near the device.
* Follow the manufacturer layout example.

### Guarding

Use a guard conductor for very high-impedance inputs.
Drive the guard near the input common-mode voltage.
This decreases leakage through the PCB surface.

---

## 12. Selection and Verification Checklist

### Select the Device

1. Set the differential input range.
2. Set the common-mode input range.
3. Calculate the necessary gain.
4. Set the output reference and output range.
5. Select CMRR at the applicable frequency.
6. Set maximum offset and drift.
7. Compare source impedance with voltage and current noise.
8. Check bias-current error.
9. Check bandwidth and settling time.
10. Check supply voltage and current.
11. Check input protection.
12. Check output load requirements.

### Verify the Design

1. Short the two inputs together at the source.
2. Sweep the common-mode voltage through its full range.
3. Measure the remaining output error.
4. Apply common-mode interference at each important frequency.
5. Apply a known differential signal.
6. Verify gain, polarity, output reference, and settling.
7. Repeat the measurements across temperature.

:::warning Datasheet Limits
Do not assume that an instrumentation amplifier works near its input or output supply rails.
Check common-mode range, gain, reference voltage, and output swing together.
:::
