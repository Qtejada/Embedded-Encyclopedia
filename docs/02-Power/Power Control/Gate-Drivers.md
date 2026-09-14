# Gate Drivers


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Gate Charge and Switching

A **gate driver** charges and discharges a power transistor gate. A metal-oxide-semiconductor field-effect transistor (**[MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>)**) needs transient gate current during switching.

The average gate-charge current is about:

<LearningEquation tex={"I_{avg}=Q_g f_s\\qquad P_{drive}\\approx Q_g V_{drive}f_s"} />

**Qg** is gate charge at the specified operating condition. **fs** is switching frequency. **Vdrive** is the gate-drive voltage swing.

This power estimate describes the gate-drive path. It is not the total MOSFET switching loss.

## 2. Transition Current

For a selected gate-charge interval **ΔQ** and transition time **Δt**:

<LearningEquation tex={"I_g\\approx\\frac{\\Delta Q}{\\Delta t}"} />

To estimate how long the drain voltage takes to change, use the Miller charge, which is associated with that part of the transition. Total gate charge also includes charge moved before and after it.

Gate resistance, driver resistance, and layout inductance limit the actual current.

## 3. Worked Example

**Assumptions:** Total gate charge is 30 nC. The drive voltage is 10 V. The switching frequency is 200 kHz.

1. Average charge current is **6 mA**.
2. Gate-drive power is about **60 mW**.
3. An assumed 10 nC Miller interval completed in 50 ns needs about **0.2 A** during that interval.

Although the average is 6 mA, the driver must deliver much larger, brief pulses of current to switch the gate quickly. Check the gate-charge data at the drain voltage and current your circuit will use.

## 4. High-Side Drive and Dead Time

A high-side N-channel MOSFET needs its gate above its source, even as that source moves with the switching node. A **bootstrap supply** stores charge during a recharge interval and uses it to provide this higher gate voltage.

Check bootstrap capacitance, leakage, maximum on-time, and recharge time. A bootstrap circuit does not automatically support continuous high-side conduction.

**Dead time** prevents both transistors in a [half bridge](<./Motor-Drives.md#drive-paths-and-braking>) from conducting together. Excessive dead time can increase [body-diode](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#body-diode>) loss.

## 5. Layout and Tests

Keep the gate loop short. Place driver decoupling near the supply pins. Use a separate source return when the package supports it.

Measure gate-to-source voltage at the device. Check overshoot, false turn-on, driver undervoltage behavior, and switching temperature.

**Reference:** [TI, gate-driver fundamentals](https://www.ti.com/lit/an/slua618a/slua618a.pdf).
