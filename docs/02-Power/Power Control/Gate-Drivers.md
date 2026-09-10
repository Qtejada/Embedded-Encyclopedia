# Gate Drivers

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Gate Charge and Switching

A **gate driver** charges and discharges a power transistor gate. A metal-oxide-semiconductor field-effect transistor (**[MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>)**) needs transient gate current during switching.

The average gate-charge current is approximately:

<LearningEquation tex={"I_{avg}=Q_g f_s\\qquad P_{drive}\\approx Q_g V_{drive}f_s"} />

**Qg** is gate charge at the specified operating condition. **fs** is switching frequency. **Vdrive** is the gate-drive voltage swing.

This power estimate describes the gate-drive path. It is not the total MOSFET switching loss.

## 2. Transition Current

For a selected gate-charge interval **ΔQ** and transition time **Δt**:

<LearningEquation tex={"I_g\\approx\\frac{\\Delta Q}{\\Delta t}"} />

Use the Miller charge for an approximate drain-voltage transition calculation. Total gate charge includes other parts of the gate waveform.

Gate resistance, driver resistance, and layout inductance limit the actual current.

## 3. Worked Example

**Assumptions:** Total gate charge is 30 nC. The drive voltage is 10 V. The switching frequency is 200 kHz.

1. Average charge current is **6 mA**.
2. Gate-drive power is approximately **60 mW**.
3. An assumed 10 nC Miller interval completed in 50 ns requires approximately **0.2 A** during that interval.

The driver needs a transient current capability much higher than 6 mA. Check the charge data at the intended drain voltage and current.

## 4. High-Side Drive and Dead Time

A high-side N-channel MOSFET needs gate voltage above its moving source voltage. A **bootstrap supply** can provide that voltage after a recharge interval.

Check bootstrap capacitance, leakage, maximum on-time, and recharge time. A bootstrap circuit does not automatically support continuous high-side conduction.

**Dead time** prevents both transistors in a [half bridge](<./Motor-Drives.md#drive-paths-and-braking>) from conducting together. Excessive dead time can increase [body-diode](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#body-diode>) loss.

## 5. Layout and Tests

Keep the gate loop short. Place driver decoupling near the supply pins. Use a separate source return when the package supports it.

Measure gate-to-source voltage at the device. Check overshoot, false turn-on, driver undervoltage behavior, and switching temperature.

**Reference:** [TI, gate-driver fundamentals](https://www.ti.com/lit/an/slua618a/slua618a.pdf).
