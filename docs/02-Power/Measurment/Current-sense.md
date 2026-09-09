# Current Sense

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Convert Current to Voltage

A **current shunt** is a low-value resistor in the current path. A **current-sense amplifier** measures its voltage.

<LearningEquation tex={"V_{shunt}=I R_{shunt}\\qquad P_{shunt}=I^2R_{shunt}"} />

For gain **G** and a reference input **Vref**, an ideal amplifier gives:

<LearningEquation tex={"V_{out}=V_{ref}+G I R_{shunt}"} />

Check that the selected device supports this reference arrangement.

## 2. High-Side and Low-Side Measurement

* **High-side measurement:** The shunt is between the positive supply and load. The amplifier must support the supply common-mode voltage.
* **Low-side measurement:** The shunt is between the load and return. Its voltage raises the load ground above the supply ground.

Check the common-mode range during startup and faults, not only during normal operation.

## 3. Kelvin Connections

Use separate **Kelvin sense traces** from the shunt terminals. Keep load current out of these sense traces.

Otherwise, copper resistance becomes part of the measured resistance. Input filters must also preserve the differential measurement.

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
