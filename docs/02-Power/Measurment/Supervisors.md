# Supervisors

Notes coming soon...

## 1. Reset Control

A **voltage supervisor** monitors a supply and controls a reset output. It keeps a processor in reset when the supply cannot support reliable operation.

* **Assertion:** The reset signal enters its active state.
* **Release:** The reset signal returns to its inactive state.
* **Hysteresis:** Different falling and rising thresholds prevent repeated transitions near one voltage.

An active-low reset output is low during reset. An open-drain output requires a pull-up to a permitted supply.

## 2. Threshold and Delay

Select the falling threshold above the processor's minimum operating voltage, with sufficient margin for supervisor tolerance and response delay.

After the supply recovers, a **reset delay** gives the system time to stabilize. A brief dip can restart that delay, depending on the device.

[TI, supervisor threshold and delay behavior](https://www.ti.com/document-viewer/lit/html/SSZTAQ7/GUID-CD23080D-D75F-43C5-A90C-6B45DF979F50) shows these separate timing functions.

import RailSequenceExplorer from '@site/src/components/RailSequenceExplorer';

<RailSequenceExplorer mode="reset" />

## 3. Worked Example: Threshold Window

**Assumptions:** A processor requires at least 2.7 V. Its supply remains above 3.1 V during normal operation.

Consider a supervisor with a nominal 2.9 V falling threshold and an assumed ±1% threshold tolerance.

1. The threshold range is **2.871 V to 2.929 V**.
2. The lowest threshold gives **171 mV** above the processor minimum.
3. The highest threshold remains **171 mV** below the normal supply minimum.

Now include the supply fall rate and supervisor propagation delay. The processor voltage must remain valid until reset takes effect.

## 4. Limits and Test Cases

1. Verify the reset output state below the supervisor's minimum supply voltage.
2. Check the processor reset input width and voltage limits.
3. Test slow ramps, rapid interruptions, and repeated brownouts.
4. Check reset release after the clock becomes stable.
5. Check manual reset behavior if the device has that input.

A **watchdog** checks software activity. A voltage supervisor checks supply conditions. One function does not automatically provide the other.
