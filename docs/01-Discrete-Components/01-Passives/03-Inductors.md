---
title: Inductors
sidebar_label: Inductors
---

import InductorFlybackAnim from '@site/src/components/InductorFlybackAnim';
import InductorPhaseDiagram from '@site/src/components/InductorPhaseDiagram';
import InductorBuckCycleDiagram from '@site/src/components/InductorBuckCycleDiagram';

# Inductors

## 1. Core Relationships

<div className="grid-2">

  <div className="tech-panel">

  * **Voltage:** <i>v(t) = L &middot; (di/dt)</i>
  * **Stored energy:** <i>E = &frac12; &middot; L &middot; I<sup>2</sup></i>
  * **Impedance:** <i>Z = j&omega;L</i>

  </div>

  <div className="tech-panel">

  :::note Inertia for Current
  Think of an inductor as a **heavy flywheel** in a water pipe.

  * Pressure (**voltage**) starts the flywheel. This action starts the flow (**current**).
  * After the flywheel turns, it does not stop easily.
* If the flow stops suddenly, momentum causes a very large pressure spike. This spike represents **flyback**.
  :::

  </div>

</div>

## 2. Physics and Operation

**Current in an inductor cannot change instantaneously.**

When current flows, the inductor stores energy in its magnetic field.

If you remove the drive voltage, the magnetic field starts to collapse. The inductor then becomes a voltage source.

The inductor generates **whatever voltage is necessary** to keep current flowing. This voltage can be thousands of volts.

The current can flow across the opening switch gap. This effect is the **flyback kick**.

### Interactive: The Inductive Kick

Hold the control to energize the coil. Release the control to see the voltage spike.

<div className="component-wrapper">
  <InductorFlybackAnim />
</div>

## 3. Frequency and Phase Behavior

<div className="grid-2">

  <div className="tech-panel">

  **Rules of thumb:**

  * **DC (<i>f</i> = 0):** Impedance is zero. The inductor acts like a **short circuit** or wire.
  * **High frequency:** Impedance is high. The inductor acts like an **open circuit**.

  *This behavior is the exact opposite of capacitor behavior.*

  </div>

  <div className="tech-panel">
    <span className="panel-header">Phase Relationship</span>

    <InductorPhaseDiagram />

    **ELI the ICE man**

  * **Voltage (E) leads current (I)** by 90&deg;.
  * You must apply voltage before current can start to increase.

  </div>

</div>

## 4. RL Time Constants

Like an RC circuit, an RL circuit has a time constant. The circuit contains an inductor and a resistor.

* **Time constant:** <i>&tau; = L / R</i>
* **Current rise:** <i>I(t) = (V / R) &middot; (1 - e<sup>-t/&tau;</sup>)</i>

**Key takeaway:**

Current takes time to increase. Lower resistance gives a larger time constant and a slower exponential rise.

* **Contrast with capacitors:** Higher resistance makes a capacitor charge more slowly.
* **Contrast with inductors:** Lower resistance makes an inductor current rise more slowly because <i>&tau; = L/R</i>.

## 5. Common Uses

### Switching Regulators (Buck and Boost)

Engineers use inductors very often in modern power systems.

The inductor stores energy during the **ON cycle**. It releases energy to the load during the **OFF cycle**.

### Filtering (Chokes)

* **Series choke:** It blocks high-frequency noise from entering a circuit.
* **Ferrite bead:** It is a lossy inductor. It converts radio-frequency (**RF**) noise into heat.

### Transformers

A transformer contains two coupled inductors.

It can increase or decrease voltage. It can also isolate grounds.

## 6. Core Types and Selection

The coil-core material determines how much energy the inductor can store before it **saturates**. At saturation, the core stops operating correctly.

| Type | Material | Advantages and Disadvantages | Best Application |
| :--- | :--- | :--- | :--- |
| **Ferrite** | MnZn or NiZn | **High permeability** and low losses.<br/>**Disadvantage:** Hard saturation. The inductance decreases abruptly. | Switch-mode power in discontinuous mode and signal filtering. |
| **Powder** | Iron or alloy | **Soft saturation.** The inductance decreases gradually.<br/>**Disadvantage:** Higher core losses. | High-current power in continuous mode. |
| **Air core** | Air or plastic | **No saturation** and ideal linearity.<br/>**Disadvantage:** A low-inductance part has a very large physical size. | RF circuits and tuned radios. |

## 7. Switch-Mode Basics (The Integrator)

Capacitors smooth **voltage**. Inductors smooth **current**.

### The Buck Converter (Step-Down)

This circuit is the primary inductor application in digital hardware.

1. **Switch ON:** The circuit applies voltage to the inductor. Current increases linearly according to <i>V = L &middot; di/dt</i>. The magnetic field stores energy.
2. **Switch OFF:** The magnetic field collapses. The inductor becomes a source and pushes current through the diode to the load.
3. **Result:** The output receives a smooth average DC voltage. The input voltage consists of chopped pulses.

<InductorBuckCycleDiagram />

:::info Design Choice
* **Ferrite drum:** It is better for high ripple or discontinuous mode.
* **Powder core:** It is better for low ripple or continuous mode. It also handles DC bias better.
:::

## 8. Real-World Parasitics

<div className="grid-2">

  <div className="tech-panel">
    <span className="panel-header">DCR (DC Resistance)</span>

  Real wire has resistance.

  * **Effect:** The resistance causes <i>I<sup>2</sup>R</i> heating.
  * **Trade-off:** Thicker wire gives lower **DCR**, but it increases the part size.

  </div>

  <div className="tech-panel">
    <span className="panel-header">SRF (Self-Resonant Frequency)</span>

  Adjacent windings create a small **interwinding capacitance**.

  * **Above SRF:** The inductor stops blocking noise. It acts like a capacitor and passes high-frequency signals.
  * **Rule:** Always operate the inductor well below its **SRF**.

  </div>

</div>

## 9. Nonideal Properties (The Gotchas)

### A. Saturation Current (I<sub>sat</sub>)

**Saturation current** is the most dangerous inductor specification.

* **Concept:** The magnetic core can hold only a limited magnetic flux. When the core is full, it acts like an air core.
* **Danger:** Inductance decreases to almost zero immediately. A very large current spike can destroy the metal-oxide-semiconductor field-effect transistor (**MOSFET**).
* **Rule:** Never exceed <i>I<sub>sat</sub></i>, even for one microsecond.

### B. Audible Noise (Coil Whine)

* **Magnetostriction:** The magnetic field physically compresses the core material.
* At frequencies from 2 kHz to 20 kHz, the core can vibrate like a speaker. This vibration causes an audible whine.
* **Fix:** Use a molded inductor, which is a solid block. You can also increase the switching frequency above 20 kHz.

### C. EMI (Electromagnetic Interference)

* **Shielded inductors:** A magnetic housing keeps the magnetic field inside the component.
* **Unshielded inductors:** These parts cost less, but they do not contain the magnetic field. The field induces noise in nearby traces.

:::danger Layout Tip
Never route a sensitive signal trace under an inductor. The inductor acts like a transformer primary and injects noise into the signal.
:::
