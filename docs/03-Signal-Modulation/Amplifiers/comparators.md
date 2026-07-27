---
title: Comparators
sidebar_label: Comparators
---

import ComparatorHysteresisExplorer from '@site/src/components/ComparatorHysteresisExplorer';

# Comparators

A **comparator** compares two input voltages.
It changes its output state when one input becomes larger than the other input.

The two inputs are:

* The **non-inverting input**, <i>V<sub>+</sub></i>.
* The **inverting input**, <i>V<sub>-</sub></i>.

A comparator converts an analog voltage difference into a HIGH or LOW state.
It is an interface between analog signals and digital logic.

Common applications include:

* Threshold and level detection.
* Zero-crossing detection.
* Conversion of a slow or noisy signal into a clean digital signal.
* Window detection.
* Pulse-width modulation (**PWM**).
* Analog-to-digital conversion.
* Power-supply and protection control.
* Relaxation oscillators.
* Load control.

---

## 1. Comparator Decision

The **differential input voltage** is:

> **V<sub>d</sub> = V<sub>+</sub> - V<sub>-</sub>**

For a non-inverting decision:

* If <i>V<sub>+</sub> &gt; V<sub>-</sub></i>, the output changes to its HIGH state.
* If <i>V<sub>+</sub> &lt; V<sub>-</sub></i>, the output changes to its LOW state.

The output polarity reverses if the signal and reference connections are reversed.

An ideal comparator has infinite gain.
An actual comparator has a large open-loop gain.
A very small input difference can cause a full output-state change.

### Step-by-Step Operation

1. The two input pins receive the signal voltage and the reference voltage.
2. A matched-transistor **differential pair** senses the voltage difference.
3. The internal gain stages amplify the difference.
4. The output stage changes state when the difference changes polarity.
5. The output sends the decision to logic or to a load driver.

A matched transistor differential pair is also the input stage in many op-amps.
The later stages and output stage make a dedicated comparator suitable for switching.

### Equal Input Voltages

The ideal decision is undefined when both inputs have exactly the same voltage.
An actual comparator has input offset voltage and noise.
These errors decide the exact switching point.

Do not expect repeatable switching at one exact voltage without an error allowance.

---

## 2. Threshold and Reference Voltage

A **threshold** is the input voltage that causes an output-state change.
A reference voltage sets this threshold.

For a basic level detector:

* Connect the signal to one input.
* Connect <i>V<sub>ref</sub></i> to the other input.
* The output state shows which voltage is larger.

An external reference sets the threshold independently of the supply rails.
The reference can come from:

* A resistor divider.
* A precision voltage reference.
* A digital-to-analog converter (**DAC**).
* A filtered PWM signal.
* Another sensor or signal.

### Resistor-Divider Reference

For a divider with <i>R<sub>TOP</sub></i> connected to <i>V<sub>S</sub></i> and <i>R<sub>BOTTOM</sub></i> connected to ground:

> **V<sub>ref</sub> = V<sub>S</sub> R<sub>BOTTOM</sub> / (R<sub>TOP</sub> + R<sub>BOTTOM</sub>)**

The input bias current and other loads can change the divider voltage.
Use a sufficiently low divider impedance.
Add a bypass capacitor when the reference must have low noise.

### Threshold-Error Budget

Include these errors in the threshold calculation:

* **Reference tolerance:** The reference voltage is not exact.
* **Resistor tolerance:** A divider ratio has an error.
* **Input offset voltage:** The comparator changes state at a small nonzero differential voltage.
* **Input bias current:** Bias current produces voltage across source resistance.
* **Input noise:** Noise changes the instantaneous switching point.
* **Ground difference:** The signal source and reference can use different local ground voltages.
* **Temperature drift:** Offset, reference voltage, and resistor values change with temperature.

The worst-case threshold error is more useful than a typical error for a protection circuit.

### Zero-Crossing Detector

A **zero-crossing detector** uses 0 V as the reference.
The output changes state when the input changes polarity.

Check the input common-mode range before you use this circuit.
A single-supply comparator does not always accept an input near or below ground.

---

## 3. Comparator and Op-Amp Differences

The simplest comparator model is a differential amplifier without negative feedback.
An op-amp and a comparator can use similar input stages, but they are not interchangeable in all circuits.

| Characteristic | Linear op-amp | Dedicated comparator |
| --- | --- | --- |
| **Normal feedback** | Negative feedback | No feedback or positive feedback |
| **Normal output** | Continuous analog voltage | Two output states |
| **Primary purpose** | Accurate linear amplification | Fast voltage decision |
| **Saturation recovery** | Can be slow | Usually faster |
| **Output options** | Usually push-pull analog output | Push-pull, open-collector, or open-drain |
| **Timing data** | Slew rate and settling time | Propagation delay and overdrive data |

### Do Not Apply the Linear Golden Rules

For a linear op-amp circuit with negative feedback, the two input voltages can be almost equal.
That rule does not apply to a comparator.

Use this circuit-analysis check:

* If the output returns to the inverting input, first check for negative feedback.
* If the output does not return to the inverting input, check for comparator operation.
* If the output returns to the non-inverting input, check for a **Schmitt trigger** or an oscillator.

### Use of an Op-Amp as a Comparator

A basic op-amp can drive its output near a positive or negative rail when it operates without negative feedback.
This saturation can cause a long recovery time.

Before you use an op-amp as a comparator, check:

* The input common-mode range.
* The maximum differential input voltage.
* Phase-reversal behavior.
* Saturation-recovery time.
* Output swing and output current.
* The permitted input voltage when the supply is off.
* The datasheet statement that permits comparator operation.

A dedicated comparator usually switches faster.
It also usually recovers from saturation faster.
Use a dedicated comparator when timing or reliable logic levels are important.

---

## 4. Output Types and Load Interface

The output circuit determines how the comparator connects to logic and loads.

### Push-Pull Output

A **push-pull output** actively drives HIGH and LOW.
It usually gives faster rising and falling edges than a passive pull-up.

Check:

* The HIGH output voltage at the required source current.
* The LOW output voltage at the required sink current.
* Logic-level compatibility with the next device.
* Short-circuit and output-current limits.

### Open-Collector and Open-Drain Outputs

An **open-collector output** or **open-drain output** has two conditions:

* The output transistor turns on and pulls the node LOW.
* The output transistor turns off and leaves the node at high impedance.

An external **pull-up resistor** makes the HIGH level.
The pull-up voltage can be different from the comparator supply when the datasheet permits this connection.

The pull-up resistor must limit the LOW-state current:

> **R<sub>PU</sub> &ge; (V<sub>PU</sub> - V<sub>OL</sub>) / I<sub>SINK,design</sub>**

Select <i>I<sub>SINK,design</sub></i> from a datasheet condition that guarantees the required <i>V<sub>OL</sub></i>.
Do not use the absolute-maximum sink-current rating as a guaranteed operating value.

The pull-up resistor and total load capacitance set the rising-edge time:

> **t<sub>r,10-90%</sub> &asymp; 2.2 R<sub>PU</sub>C<sub>LOAD</sub>**

A smaller pull-up resistor gives a faster rising edge.
It also increases LOW-state current and power.
A large pull-up resistor decreases current but makes the rising edge slower and more sensitive to coupled noise.

Open outputs permit wired logic when all connected devices permit the connection.
Check the required logic polarity before you use this feature.

### Load Driver

Comparators and Schmitt triggers can turn loads on and off.
Do not connect a load directly if its current exceeds the comparator output rating.

Use a transistor, MOSFET, or driver IC for:

* Relays.
* Motors.
* Lamps.
* Solenoids.
* High-current LEDs.
* Other capacitive or inductive loads.

Add the correct suppression component across an inductive load.
The load driver must not send an unsafe voltage back into the comparator.

---

## 5. Slow or Noisy Inputs

A basic comparator can change state many times when a slow or noisy signal is near the threshold.
This unwanted sequence is **output chatter**.

### How Chatter Occurs

1. The input approaches the threshold slowly.
2. Noise moves the instantaneous input above the threshold.
3. The comparator changes state.
4. Noise moves the input below the threshold.
5. The comparator changes state again.
6. The sequence continues until the input moves sufficiently far from the threshold.

A digital circuit can interpret each transition as a separate event.
A clock input can count false pulses.
A power switch can turn on and off rapidly.

Do not drive a clock directly from a slow op-amp interface.
Use a comparator with hysteresis or a Schmitt-trigger logic gate.

Filtering can decrease high-frequency noise.
Filtering alone does not always stop repeated threshold crossings.
Use **hysteresis** when the input can move slowly through the threshold.

---

## 6. Schmitt Trigger and Hysteresis

A **Schmitt trigger** is a comparator circuit with positive feedback.
Positive feedback makes two switching thresholds:

* The **upper threshold**, <i>V<sub>T+</sub></i>.
* The **lower threshold**, <i>V<sub>T-</sub></i>.

The difference between the thresholds is **hysteresis**:

> **V<sub>H</sub> = V<sub>T+</sub> - V<sub>T-</sub>**

The center of the hysteresis band is:

> **V<sub>CENTER</sub> = (V<sub>T+</sub> + V<sub>T-</sub>) / 2**

For a symmetrical band:

> **V<sub>T+</sub> = V<sub>CENTER</sub> + V<sub>H</sub>/2**

> **V<sub>T-</sub> = V<sub>CENTER</sub> - V<sub>H</sub>/2**

For the non-inverting convention used in the explorer:

* An input above <i>V<sub>T+</sub></i> makes the output HIGH.
* An input below <i>V<sub>T-</sub></i> makes the output LOW.
* An input between the thresholds does not change the output.

The output in the hysteresis band depends on the recent output state.
This state dependence prevents repeated transitions near one threshold.

<ComparatorHysteresisExplorer />

### Step-by-Step Noise Rejection

Assume that the lower threshold is 2.4 V and the upper threshold is 2.6 V.

1. The input starts below 2.4 V, and the output is LOW.
2. The input rises into the hysteresis band.
3. Noise can move the input inside the band, but the output stays LOW.
4. The input rises above 2.6 V, and the output changes to HIGH.
5. The input falls into the band, but the output stays HIGH.
6. The input falls below 2.4 V, and the output changes to LOW.

The input must move through the complete 0.2 V band before it can make another output transition.

### Positive-Feedback Resistor Network

For one inverting Schmitt-trigger circuit:

* Connect the signal to the inverting input.
* Connect <i>R<sub>REF</sub></i> from the non-inverting input to <i>V<sub>ref</sub></i>.
* Connect <i>R<sub>FB</sub></i> from the output to the non-inverting input.

If input current is negligible, the active threshold is:

> **V<sub>T</sub> = (R<sub>FB</sub>V<sub>ref</sub> + R<sub>REF</sub>V<sub>out</sub>) / (R<sub>REF</sub> + R<sub>FB</sub>)**

The HIGH and LOW output voltages produce different thresholds:

> **V<sub>T+</sub> = (R<sub>FB</sub>V<sub>ref</sub> + R<sub>REF</sub>V<sub>OH</sub>) / (R<sub>REF</sub> + R<sub>FB</sub>)**

> **V<sub>T-</sub> = (R<sub>FB</sub>V<sub>ref</sub> + R<sub>REF</sub>V<sub>OL</sub>) / (R<sub>REF</sub> + R<sub>FB</sub>)**

The hysteresis width is:

> **V<sub>H</sub> = [R<sub>REF</sub> / (R<sub>REF</sub> + R<sub>FB</sub>)](V<sub>OH</sub> - V<sub>OL</sub>)**

These equations use the actual output HIGH and LOW voltages.
Do not replace them with the supply voltages unless the output reaches those voltages under the specified load.

The switching polarity for this inverting circuit is opposite to the explorer:

* A rising input that crosses the upper threshold makes the output LOW.
* A falling input that crosses the lower threshold makes the output HIGH.

### Resistor Example

Assume:

* <i>V<sub>ref</sub> = 2.5 V</i>.
* <i>V<sub>OH</sub> = 5.0 V</i>.
* <i>V<sub>OL</sub> = 0 V</i>.
* Required hysteresis is 0.2 V.

The required feedback fraction is:

> **0.2 V / 5.0 V = 0.04**

Select <i>R<sub>REF</sub> = 10 k&ohm;</i> and <i>R<sub>FB</sub> = 240 k&ohm;</i>.
The feedback fraction is 10 / (10 + 240), or 0.04.

The thresholds are approximately:

* **Upper threshold:** 2.6 V.
* **Lower threshold:** 2.4 V.

Include resistor tolerance, input offset, bias current, and actual output levels in the final error budget.

---

## 7. Dynamic Performance

A comparator does not switch instantaneously.
The datasheet gives timing limits for specified test conditions.

### Propagation Delay

**Propagation delay** is the time from the input threshold crossing to the specified output transition.
Datasheets can give different values for LOW-to-HIGH and HIGH-to-LOW transitions.

### Input Overdrive

**Input overdrive** is the voltage by which the input goes beyond the switching threshold.
A larger overdrive usually gives a shorter propagation delay.

**Overdrive dispersion** is the change in propagation delay when overdrive changes.
This error is important when the input amplitude changes.

### Input Slew Rate

The **input slew rate** is the rate at which the input crosses the threshold.
A very slow crossing gives noise more time to affect the switching instant.
Use hysteresis when the input slew rate is low.

### Output Edge Time

The output rise and fall times depend on:

* Output type.
* Pull-up resistance.
* Load capacitance.
* Output current.
* Logic voltage.

Do not calculate the maximum pulse rate from propagation delay alone.
Include both propagation delays, output edge times, required pulse width, and recovery behavior.

---

## 8. Input Range, Accuracy, and Protection

The input pins are analog pins.
Logic-compatible output levels do not make all input voltages safe.

Check these datasheet limits:

* **Supply-voltage range.**
* **Input common-mode range.**
* **Absolute maximum input voltage.**
* **Maximum differential input voltage.**
* **Input offset voltage and drift.**
* **Input bias current and drift.**
* **Input noise.**
* **Propagation delay.**
* **Output type and output-current limit.**

### Common-Mode Input Range

Both input voltages must stay inside the permitted common-mode range.
The range can exclude one or both supply rails.
Some devices specify a different range for correct operation and for survival.

### Source Resistance

Input bias current flows through the source resistance.
Different source resistances at the two inputs can make an additional differential error.

The approximate error from bias current is:

> **V<sub>error</sub> &asymp; I<sub>B</sub> &Delta;R<sub>SOURCE</sub>**

Use low and balanced source resistances when threshold accuracy is important.

### Input Protection

Limit the input current during overvoltage.
Use a series resistor and suitable clamp components when necessary.

The protection network must not:

* Move the normal threshold by too much.
* Add excessive leakage current.
* Add too much capacitance.
* Violate the comparator input-current limit.
* Feed current into an unpowered supply rail.

---

## 9. Common Comparator Circuits

### Level Detector

A level detector compares one signal with one reference.
It reports whether the signal is above or below the threshold.

Examples include:

* Battery-voltage monitors.
* Temperature alarms.
* Light-level switches.
* Current-limit detectors.

### Window Comparator

A **window comparator** uses two comparators.
One comparator checks the lower limit.
The other comparator checks the upper limit.

The logic reports one of these conditions:

* The input is below the window.
* The input is inside the window.
* The input is above the window.

Include the offset and hysteresis of both comparators in the window-width calculation.

### Clock and Logic Cleanup

A comparator with hysteresis can convert a slow analog waveform into a fast logic transition.
A Schmitt-trigger inverter can perform the same function for a compatible input range.

Use this circuit for:

* Slow sensor edges.
* RC timing waveforms.
* Noisy digital signals.
* Clock restoration.

Debounce a mechanical switch when one physical operation can make multiple electrical transitions.
Hysteresis and switch debouncing solve different problems.

### Load and Power Control

Traditional power supplies use analog op-amps and comparators.
An error amplifier measures the difference between the output and a reference.
A comparator can detect a limit and turn a switch off.

Applications include:

* Overvoltage protection.
* Undervoltage lockout.
* Cycle-by-cycle current limiting.
* Battery-charge termination.
* Thermal shutdown.
* Power-good signals.

Use a driver when the controlled load needs more current than the comparator can supply.

### Relaxation Oscillator

A relaxation oscillator combines a Schmitt trigger with an RC network.
The capacitor charges toward one output state.
The output changes when the capacitor reaches one threshold.
The capacitor then charges toward the other output state.
The sequence repeats.

The two thresholds and the RC time constant set the frequency.

---

## 10. Comparators in Data Conversion and PWM

Comparators are decision elements in many data-conversion circuits.

### Flash ADC

A **flash ADC** compares the analog input with many fixed reference voltages at the same time.
A resistor ladder supplies the reference voltages.
A comparator bank produces a **thermometer code**.
A priority encoder converts the thermometer code into a binary result.

An ideal <i>n</i>-bit flash ADC uses <i>2<sup>n</sup> - 1</i> decision levels.
The comparator count grows approximately as <i>2<sup>n</sup></i>.
This fast increase in component count usually limits practical flash resolution to approximately 8 bits.

Half-flash, pipelined, and folding architectures reduce the number of comparators.
They divide the conversion into coarse and fine decisions or reuse intermediate information.

### Successive-Approximation ADC

A **successive-approximation register (SAR) ADC** makes one comparator decision for each trial code.
An internal DAC converts the trial code to a voltage.
The comparator reports whether the input is above or below the DAC voltage.
The logic keeps or clears each bit.

### Ramp and Integrating Converters

A ramp converter compares the input with a changing ramp voltage.
It measures the time at which the ramp crosses the input.

This ramp-and-comparator method is also a basic PWM method.
The threshold-crossing time sets the pulse width.

Dual-slope conversion uses the same integrator components for the up and down slopes.
This operation cancels errors from the integrator resistor and capacitor.
An auto-zero phase can measure and compensate amplifier and comparator offset.
Multislope conversion uses additional integration cycles to increase speed or resolution.

### 555 Timer

A 555 timer contains internal comparators.
The comparators use thresholds near one-third and two-thirds of the supply voltage.
They set and reset an internal latch.
Because both thresholds track the supply, the timing action can stay proportional to the supply voltage.

---

## 11. Design Example: Noisy Sensor Alarm

Assume that a sensor output must turn an alarm on near 2.5 V.
The sensor has 40 mV peak-to-peak noise.
The alarm driver must not chatter.

### Step 1: Define the Required States

Select a non-inverting response for this example.
The output must go HIGH when the sensor rises above the upper threshold.
Use a comparator with internal hysteresis or a non-inverting external-hysteresis circuit.
Do not use the inverting resistor equations in Section 6 without a polarity change.

### Step 2: Select the Center Threshold

Use a 2.5 V reference.
Include its tolerance and temperature drift.

### Step 3: Select Hysteresis

Select hysteresis larger than the normal noise amplitude.
A 0.2 V band gives thresholds near 2.4 V and 2.6 V.

### Step 4: Calculate the Feedback Network

For internal hysteresis, check the minimum and maximum thresholds in the datasheet.
For external hysteresis, derive the feedback network for the selected non-inverting topology.
Use the actual output HIGH and LOW voltages.
Check the resistor-tolerance error.

### Step 5: Check the Input

Make sure that 2.4 V and 2.6 V are inside the input common-mode range.
Check the maximum sensor voltage and source resistance.

### Step 6: Design the Output Interface

Add a pull-up resistor for an open-collector or open-drain output.
Make sure that the HIGH and LOW levels are compatible with the alarm driver.

### Step 7: Add a Load Driver

Use a transistor or MOSFET if the alarm current exceeds the comparator rating.
Add suppression if the load is inductive.

### Step 8: Verify Worst-Case Operation

Test at:

* Minimum and maximum supply voltage.
* Minimum and maximum temperature.
* Both threshold directions.
* Minimum and maximum sensor source resistance.
* Maximum noise.
* Power-up and power-down.

---

## 12. Comparator Selection Checklist

Before you select a comparator, specify:

* **Supply voltage:** Include supply tolerance.
* **Input range:** Include both input pins and all operating conditions.
* **Threshold accuracy:** Include offset, drift, bias current, and reference error.
* **Hysteresis:** Specify internal or external hysteresis.
* **Propagation delay:** Specify the applicable overdrive.
* **Input slew rate:** Check operation for the slowest crossing.
* **Output type:** Select push-pull, open-collector, or open-drain.
* **Logic levels:** Check the next device at worst-case current.
* **Load current and capacitance:** Include the pull-up and wiring.
* **Power-up state:** Check whether the output state is defined.
* **Input protection:** Check powered and unpowered conditions.
* **Package and temperature range:** Use the limits for the application.

---

## 13. Common Design Mistakes

### No Hysteresis on a Slow Input

The output can chatter near the threshold.
Add sufficient hysteresis or use a device with internal hysteresis.

### Use of Any Op-Amp as a Comparator

The op-amp can recover slowly from saturation.
It can also violate its input limits.
Use a dedicated comparator or confirm operation in the op-amp datasheet.

### Missing Pull-Up Resistor

An open-collector or open-drain output cannot make a HIGH level without a pull-up path.

### Incorrect Pull-Up Value

A resistor that is too large gives a slow and noise-sensitive rising edge.
A resistor that is too small can exceed the output sink-current limit.

### Assumption of Rail-to-Rail Inputs

The supply rails do not define the guaranteed input common-mode range.
Use the datasheet limits.

### Direct Connection to a Large Load

The comparator output can be damaged or can fail to reach a valid logic level.
Use a load driver.

### Threshold Calculation with Ideal Output Levels

External hysteresis depends on actual <i>V<sub>OH</sub></i> and <i>V<sub>OL</sub></i>.
Use worst-case values at the required load current.

### Omission of Source-Impedance Error

Input bias current and unequal source resistances can move the threshold.
Include this error in the budget.

---

## Summary

A **comparator** changes an analog voltage comparison into a two-state output.
A reference sets the nominal threshold.
A dedicated comparator usually switches and recovers faster than an op-amp used without negative feedback.

Use a **Schmitt trigger** when a signal is slow or noisy.
Its positive feedback makes an upper threshold and a lower threshold.
The hysteresis band prevents repeated output transitions near one voltage.

Always check the input range, threshold error, propagation delay, output type, pull-up network, and load current.
