# Power Good Sequencing

Notes coming soon...

## 1. Rail Dependencies

**Power good (PG)** indicates that a monitored rail meets a defined condition. Its threshold and delay depend on the regulator or supervisor.

**Power sequencing** controls the order in which rails start and stop. A device can require core power before its input/output supply.

Read the device power requirements before defining the order. A valid startup order does not establish a valid shutdown order.

## 2. Sequence by Condition

An enable chain can use one rail's PG output to enable the next regulator. Check the PG pull-up supply and enable threshold.

A fixed delay starts the next rail after a time interval. It does not prove that the first rail reached its target.

For a critical dependency, combine the required voltage condition with a delay.

import RailSequenceExplorer from '@site/src/components/RailSequenceExplorer';

<RailSequenceExplorer mode="sequence" />

## 3. Worked Example: Three Rails

**Assumptions:** Rail A reaches its valid range at 2 ms. Its PG delay is 1 ms.

Rail B needs 3 ms to rise after its enable signal. Rail B then has a 2 ms PG delay.

1. Rail A releases PG at **3 ms**.
2. Rail B starts at **3 ms** and becomes valid at **6 ms**.
3. Rail B releases PG at **8 ms**.
4. Rail C can start at **8 ms** if its other requirements are satisfied.

These times are illustrative. Use maximum rise times and delay tolerances for a timing limit.

## 4. Fault and Shutdown Behavior

Check what happens when an earlier rail fails after all rails start. A chain must produce a defined response to that fault.

* Prevent powered outputs from forcing current into an unpowered device.
* Check output discharge and residual capacitor charge.
* Keep reset active until all required rails and clocks are valid.
* Check startup with external interfaces already powered.

## 5. Verification Record

Record each rail's voltage, ramp limit, dependencies, PG condition, and shutdown requirement. Measure the rail voltages and control signals together.

**Reference:** [TI, a sequencing supervisor circuit](https://www.ti.com/tw/lit/pdf/snva844). This circuit illustrates sequencing functions, but the load device determines the required order.
