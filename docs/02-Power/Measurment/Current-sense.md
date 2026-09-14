# Current Sense


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Convert Current to Voltage

A **current shunt** is a low-value resistor in the current path. A **current-sense amplifier** measures its voltage.

<LearningEquation tex={"V_{shunt}=I R_{shunt}\\qquad P_{shunt}=I^2R_{shunt}"} />

For gain **G** and a reference input **Vref**, an ideal amplifier gives:

<LearningEquation tex={"V_{out}=V_{ref}+G I R_{shunt}"} />

Check that the selected device supports this reference arrangement.

## 2. High-Side and Low-Side Measurement

* **High-side measurement:** The shunt is between the positive supply and load. The amplifier must support the supply [common-mode voltage](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#common-mode-voltage>).
* **Low-side measurement:** The shunt is between the load and return. Its voltage raises the load ground above the supply ground.

Check the common-mode range during startup and faults, not only during normal operation.

## 3. Kelvin Connections

Run separate **Kelvin sense traces** from the shunt terminals to the amplifier. These traces measure voltage; the load current must use a different path.

Otherwise, the voltage drop in the copper gets added to the shunt's voltage and becomes a measurement error. Any input filter must preserve the difference between the two sense voltages too.

import ShuntExplorer from '@site/src/components/ShuntExplorer';

<ShuntExplorer />

[TI, current-sense layout guidance](https://www.ti.com/document-viewer/lit/html/SSZT805) explains why the sense connection affects gain accuracy.

## 4. Worked Example: Range and Offset

**Assumptions:** The maximum current is 5 A. Use a 10 mΩ shunt, gain 50, and a zero-volt reference.

1. The maximum shunt voltage is **50 mV**.
2. The ideal amplifier output is **2.5 V**.
3. Shunt dissipation is **0.25 W**.
4. An assumed 20 µV input offset gives **2 mA** of current error.

At 5 A, that offset is 0.04% of the reading. At 10 mA, it is 20% of the reading.

Shunt tolerance, temperature drift, and amplifier gain error add separate errors. A zero calibration does not remove gain error.

## 5. Verification

Check output swing, input offset, bandwidth, bidirectional range, and transient recovery. Compare the measured current with a reference at low and high current.

For switching loads, distinguish the instantaneous waveform from its average. Set the filter bandwidth to match the measurement requirement.


## Other sensing methods

| Method | Useful property | Main limitation |
| --- | --- | --- |
| Hall sensor | Can measure direct and alternating current with isolation | Offset, bandwidth, and external magnetic fields |
| Current [transformer](<../../01-Discrete-Components/02-Magnetics/01-Transformers.md#1-magnetic-coupling>) | Isolated alternating-current measurement | Does not measure steady DC and can saturate |
| Rogowski coil | Measures changing current without a magnetic core | Needs integration and cannot measure steady DC |
| [MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>) voltage | Uses the conducting switch as a sense element | On-resistance varies with gate drive and temperature |
| Inductor [winding resistance](<../../01-Discrete-Components/01-Passives/03-Inductors.md#winding-losses-and-a-practical-model>) | Avoids another series power resistor | Needs a matched sensing network and temperature correction |

A **current-sense amplifier (CSA)** amplifies the small voltage difference across a shunt. Some can do this even when both shunt terminals sit at a voltage outside the amplifier's own supply rails. That shared voltage is the common-mode voltage.

An ordinary op amp might not tolerate those inputs. Check common-mode range, input offset, gain error, bandwidth, [PWM](<../../03-Signal-Modulation/Filters/Digital-filters.md#pulse-width-modulation-pwm>) rejection, and recovery after switching edges.

For an assumed 10 A maximum current and 10 milliohm shunt, full-scale sense voltage is 100 mV. A gain of 20 produces 2 V.

That choice leaves 0.5 V headroom in an assumed 2.5 V [ADC](<../../03-Signal-Modulation/Data-convertes/DACs.md#3-sampling-and-resolution>) range. Check offset and output swing at both ends before accepting it.

For bidirectional current, add an output reference or use a bipolar measurement path. Include reference error in the current error budget.

A [comparator](<../../03-Signal-Modulation/Amplifiers/comparators.md#1-comparator-decision>) can compare the sense output with an overcurrent threshold. A latch can retain the fault until a controlled reset.

The protection response must fit the allowable fault energy. Software monitoring alone might be too slow for a short circuit.


See [TI current-sensing methods](https://www.ti.com/technologies/current-sensing-solutions.html) and [PWM common-mode rejection](https://www.ti.com/document-viewer/lit/html/SSZTAN8/GUID-CD67DF11-4215-47AE-A24F-FE2470933275).
