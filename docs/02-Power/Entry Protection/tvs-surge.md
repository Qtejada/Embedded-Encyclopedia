# TVS Surge

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Transient Protection

A **transient-voltage suppressor (TVS)** diverts transient current away from a protected input. It does not regulate a continuous overvoltage.

Three voltage specifications have different meanings:

* **Working standoff voltage:** The voltage range in which leakage remains within its specified limit.
* **Breakdown voltage:** The voltage measured at the specified breakdown test current.
* **Clamping voltage:** The voltage across the device at a specified pulse current and waveform.

Do not select a TVS from its breakdown voltage alone. Check clamping voltage against the protected input limit.

## 2. Protection Path

Place the TVS near the entry point. Keep the path from the connector through the TVS to the return short.

Parasitic inductance adds voltage during a fast current change:

<LearningEquation tex={"V_L=L\\frac{di}{dt}"} />

A low clamping voltage at the component does not guarantee the same voltage at a distant input.

import ProtectionPathDiagram from '@site/src/components/ProtectionPathDiagram';

<ProtectionPathDiagram />

## 3. Worked Example: Clamping Margin

**Assumptions:** A supply can reach 14 V normally. The protected input permits 30 V. A candidate clamps at 24 V for the required pulse.

Assume 10 nH of shared path inductance and a current rise of 100 A/µs.

1. The inductive voltage is **1 V**.
2. The estimated input peak is **25 V** if the voltages add.
3. The remaining voltage margin is **5 V**.

This arithmetic does not include tolerance, ringing, or a different pulse current. Include those effects before selecting the component.

## 4. Coordination and Verification

1. Define the expected transient waveform and source impedance.
2. Check standoff voltage against the highest normal voltage.
3. Check pulse power, pulse duration, repetition, and temperature derating.
4. Check leakage and capacitance for the protected signal.
5. Coordinate a series fuse or current limiter with sustained faults.
6. Measure the protected pin during the specified transient test.

Use a unidirectional or bidirectional device that suits the signal polarity. The required fault path also depends on reverse-polarity conditions.

**References:** [TI, surge diode selection](https://www.ti.com/lit/an/slvae37/slvae37.pdf), [TI, ESD protection layout](https://www.ti.com/lit/an/slva680a/slva680a.pdf).
