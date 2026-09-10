---
title: Measurement and Debug
sidebar_position: 5
---

import LearningEquation from '@site/src/components/LearningEquation';

# Measurement and Debug

## Select the measurement

Define the quantity, range, bandwidth, uncertainty, and connection before selecting an instrument. The instrument becomes part of the circuit during measurement.

| Instrument | Main use | Important limit |
| --- | --- | --- |
| Digital multimeter (DMM) | Steady voltage, current, and resistance | Integration time can hide short events |
| Oscilloscope | Voltage changes versus time | Probe loading and bandwidth affect the waveform |
| Logic analyzer | Digital states and bus timing | [Logic thresholds](<../04-Digital-Interfaces/DigitalGeneral.md#logic-levels>) hide analog margin |
| LCR meter | Inductance, capacitance, and resistance | Results depend on test frequency and bias |
| Vector network analyzer (VNA) | Complex reflection and transmission | Calibration and fixture reference planes matter |
| Source measure unit (SMU) | Controlled voltage or current with simultaneous measurement | Compliance limits and quadrant capability vary |

A four-quadrant SMU can source or absorb power with either polarity within its ratings. An ordinary bench supply might not absorb returned energy.

## Multimeter measurements

A DMM converts an input into a numerical value. Its integration and display rates differ. A slow display does not describe all internal sampling behavior.

Long integration can reduce noise and reject power-line interference. It also hides short disturbances. Use an oscilloscope for startup pulses and transient faults.

Measure voltage across two nodes. Measure current through a suitable series path or a current sensor. A current input has low impedance and can short a voltage source.

An ammeter's **burden voltage** changes the circuit. A shunt also adds loss. Use a suitable current probe when interruption is unacceptable.

Measure resistance with the circuit unpowered and stored energy discharged. Parallel circuit paths can corrupt the reading. Four-wire sensing reduces lead resistance error.

For capacitance and inductance, specify test frequency, amplitude, and equivalent circuit model. A component can behave differently near self resonance.

## Oscilloscope bandwidth and sampling

An oscilloscope samples a conditioned input and displays stored samples against time. A **trigger** selects a defined event for acquisition or display alignment.

Edge triggers suit repetitive transitions. Pulse-width and protocol triggers can isolate rare faults. Use pretrigger memory to see events before the fault.

**Bandwidth** describes the analog frequency response. **Sample rate** describes the number of samples acquired per second. Neither replaces the other.

For a roughly Gaussian response, rise time is approximately 0.35 divided by bandwidth. This approximation depends on response shape.

For an assumed 10 ns edge, a 35 MHz scope has a comparable rise time and causes substantial measurement error. More bandwidth reduces that error.

Use enough samples to describe the relevant waveform and acquisition interval. Nyquist is a reconstruction limit for band-limited signals, not a complete scope selection rule.

Check record length, active channel count, interpolation, and [aliasing](<../03-Signal-Modulation/Filters/Digital-filters.md#18-aliasing-at-the-initial-adc>). See [Tektronix oscilloscope evaluation](https://www.tek.com/en/documents/primer/evaluating-oscilloscopes).

## Probe selection

A passive **10× probe** attenuates the signal by ten at the scope input. It usually reduces input capacitance relative to a direct cable connection.

Set the scope's probe factor correctly. Adjust compensation with the calibration waveform. The probe and scope input form one measurement system.

A high input resistance helps at low frequency. Probe capacitance can dominate at high frequency. Short ground connections reduce inductive ringing.

An **active probe** uses an amplifier near the tip. It can provide low capacitance but has limited voltage range and requires power.

A **differential probe** measures the difference between two nodes. Check differential range, common-mode range, bandwidth, and [common-mode rejection](<../03-Signal-Modulation/Amplifiers/02-differential-amps.md#2-common-mode-rejection-ratio>).

Do not move a grounded scope reference onto a switching node. Select a rated differential or isolated measurement method for floating voltages.

A 50 ohm input provides a controlled termination for a matching source. It can severely load a high-impedance circuit. Verify its voltage and power limits.

See [Tektronix probe principles](https://www.tek.com/en/documents/whitepaper/abcs-probes-primer) for loading and compensation examples.

Use multiple channels to compare cause and effect. For power, measure voltage and current at the same time. Correct probe delay before multiplying fast waveforms.

## Network measurements

A VNA measures amplitude and phase ratios for reflected and transmitted waves. **S11** describes input reflection. **S21** describes forward transmission under the specified port conditions.

The reference impedance is commonly 50 ohms. It is not necessarily the circuit's input impedance. Calibrate at the intended connection plane.

Open, short, load, and through standards can characterize systematic errors. Fixture removal requires an appropriate de-embedding model.

See [Keysight VNA basics](https://www.keysight.com/au/en/learn/course.vector-network-analyzer-basics.html) for network measurement methods.

## Fault isolation and validation

1. Inspect assembly, polarity, connectors, and component values.
2. Measure resistance on unpowered rails and compare with an expected range.
3. Apply a current-limited supply with the correct voltage.
4. Check rails, reset, clocks, and communication in dependency order.
5. Compare measured behavior with a known-good unit or a predicted result.
6. Change one controlled condition and record its effect.

A low rail resistance can be normal for a large processor. A suspected short needs comparison with the circuit and device behavior.

Use a bounded injection voltage only on a suitable isolated rail. Thermal imaging or voltage-drop mapping can locate loss without exceeding component ratings.

For validation, define pass limits before testing. Sweep input voltage, load, temperature, and relevant timing. Include startup, shutdown, and fault recovery.

Record instrument settings, fixture revision, software version, and calibration status. Repeat selected measurements to estimate variation and detect setup errors.

For long tests, log timestamps and health signals. Use recoverable files, storage limits, watchdogs, and explicit restart behavior.

An uninterruptible power supply can bridge a defined outage. Verify its runtime with the complete test load. Mark interrupted measurements instead of treating them as continuous data.
