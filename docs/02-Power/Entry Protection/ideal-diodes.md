# Ideal Diodes

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Low-Loss Reverse Blocking

An **ideal-diode circuit** uses a controller and a metal-oxide-semiconductor field-effect transistor (**MOSFET**) to reduce forward loss.

The controller senses the voltage across the power path. It controls the gate to conduct forward current and limit reverse current.

The circuit is not ideal in every condition. Gate delay, leakage, resistance, and supply limits remain.

## 2. Compare the Losses

For a conventional diode with forward voltage **VF**:

<LearningEquation tex={"P_D\\approx I V_F"} />

For a fully enhanced MOSFET:

<LearningEquation tex={"P_F\\approx I^2R_{DS(on)}"} />

Use the on-resistance at the actual gate voltage and temperature. At small currents, controller consumption can become significant.

## 3. Worked Example: A 3 A Supply

**Assumptions:** A diode has a 0.4 V forward drop. A MOSFET has 15 mΩ on-resistance at the operating temperature.

1. The diode loss is **1.2 W**.
2. The MOSFET conduction loss is **0.135 W**.
3. The MOSFET voltage drop is **45 mV**.

These values exclude controller consumption and switching events. They show why reverse-blocking circuits can reduce heat in a high-current path.

## 4. Body Diode and Off State

A single MOSFET has a body diode. Its orientation controls the passive current path before the gate receives drive.

An ideal-diode function does not necessarily disconnect forward current when disabled. Two opposed MOSFETs can provide blocking in both directions when the controller supports that arrangement.

[TI, reverse-current protection](https://www.ti.com/lit/an/slva730/slva730.pdf) compares these circuit arrangements.

## 5. Design Checks

1. Draw the body-diode direction on the schematic.
2. Check startup with the output already powered.
3. Check reverse input voltage and output-to-input current.
4. Check forward surge current and the MOSFET safe operating area.
5. Check controller supply limits and gate-voltage limits.
6. Add separate inrush control when the load capacitance requires it.

**Device example:** The [TI LM74700-Q1 data sheet](https://www.ti.com/lit/ds/symlink/lm74700-q1.pdf) describes one controller implementation. Its limits do not apply to every ideal-diode circuit.
