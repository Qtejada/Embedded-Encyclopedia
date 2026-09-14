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

Current takes time to rise. A lower resistance increases the time constant, so reaching the same fraction of the final current takes longer.

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

A [transformer](<../02-Magnetics/01-Transformers.md#1-magnetic-coupling>) contains two coupled inductors.

It can increase or decrease voltage. It can also isolate grounds.

## 6. Core Types and Selection

The core material affects how much magnetic field the coil can support before it **saturates**. As the core saturates, inductance falls and current can rise faster than the circuit was designed to allow.

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

  Adjacent windings create a small **[interwinding capacitance](<../02-Magnetics/01-Transformers.md#3-real-transformer-limits>)**.

  * **Above SRF:** The inductor stops blocking noise. It acts like a capacitor and passes high-frequency signals.
  * **Rule:** Always operate the inductor well below its **SRF**.

  </div>

</div>

## 9. Nonideal Properties (The Gotchas)

### A. Saturation Current (I<sub>sat</sub>)

**Saturation current** is the most dangerous inductor specification.

* **Concept:** The magnetic core can hold only a limited magnetic flux. When the core is full, it acts like an air core.
* **Overcurrent risk:** Saturation can sharply reduce inductance, allowing current to rise much faster. The resulting peak can destroy the metal-oxide-semiconductor field-effect transistor (**[MOSFET](<../03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>)**). The drop depends on the core; it is not always an instantaneous fall to zero.
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


## Data-Sheet Qualification: Saturation Is a Curve

Check how the manufacturer defines saturation current. **Isat** usually means the current at which inductance has dropped by a stated percentage, rather than one exact point where every inductor suddenly saturates.

It is not a universal point at which inductance instantly becomes zero. Different cores have different saturation curves.

Check the complete inductance-versus-current curve at temperature. Also check the separate root-mean-square current rating for heating.

**Original example assumptions:** An inductor starts at 10 µH. The manufacturer defines Isat at a 20% inductance decrease.

At that [test point](<../../05-PCB-Layout/04-Manufacturing-and-Test.md#design-for-access>), inductance is **8 µH**. Under the same voltage, current slope is **25% higher** than it was at 10 µH.

This faster slope can increase peak current further. Include minimum inductance and the controller's protection delay in the current calculation.

**Reference:** [Coilcraft, current and temperature ratings](https://www.coilcraft.com/en-us/resources/application-notes/current-and-temperature-ratings/).


## Winding losses and a practical model

import PassiveModels from '@site/src/components/learning/PassiveModels';

<PassiveModels kind="inductor" />

**Alternating-current resistance (ACR)** includes frequency-dependent winding loss. [Skin effect](<../../00-Foundations/04-Fields-and-Materials.md#dielectrics-and-conductor-losses>) and proximity effect redistribute current and increase this loss.

The core loses energy as its magnetization repeatedly changes (hysteresis) and as circulating currents form within it (eddy currents). These losses depend on material, frequency, flux swing, and temperature. Keep them separate from losses in the winding's AC resistance, or ACR.

Insulation damage can short turns. Overheating can damage wire or terminations. A cracked core can change inductance and loss.

An ideal inductor's impedance keeps rising with frequency. A real one eventually reaches self resonance, where its inductance and [parasitic capacitance](<../../00-Foundations/00-Foundations.md#5-parasitic-effects>) interact. Above that region, the capacitance can dominate its behavior.

For a series resistor and inductor, output across the resistor gives a low-pass response. Output across the inductor gives a high-pass response.

Both ideal first-order forms have a corner frequency of R divided by 2 pi L. Source and load resistance change the effective R.


See [Coilcraft winding and core losses](https://www.coilcraft.com/en-us/resources/application-notes/choosing-inductors-for-energy-efficient-power-appl/) for loss-model limits.
