---
title: Diodes
sidebar_label: Diodes
---

import DiodeVICurve from '@site/src/components/DiodeVICurve';
import DiodeAnim from '@site/src/components/DiodeAnim';
import FullWaveRectifier from '@site/src/components/FullWaveRectifier';
import DiodeClamping from '@site/src/components/DiodeClamping';
import ESDSteering from '@site/src/components/ESDSteering';
import RCDClamp from '@site/src/components/RCDClamp';
import SchottkySymbol from '@site/src/components/SchottkySymbol';
import TVSSymbol from '@site/src/components/TVSSymbol';
import rectifierImage from '@site/static/img/rectifier.png';

# Diodes and Circuit Protection

## 1. The Basics

### What They Are

Diodes are **nonlinear** devices. They conduct after the voltage reaches a forward threshold.

For a silicon diode, the typical threshold is approximately 0.7 V. The exact threshold depends on the material.

A diode blocks current in the opposite direction during normal operation.

<DiodeVICurve />

A diode is a **two-terminal device**:

* **Anode (+):** Current enters this terminal.
* **Cathode (-):** Current leaves this terminal. A stripe usually identifies the cathode on the package.

<DiodeAnim />

During normal forward-biased operation, current flows from the **anode to the cathode**.

* **PIV (peak inverse voltage):** This is the **maximum reverse-voltage rating** before reverse **breakdown**. If the reverse voltage exceeds the PIV, the diode enters breakdown. Current then flows backward from cathode to anode. This current often destroys the diode unless it is a Zener diode.

## 2. Common Circuit Uses

### A. Rectification

Diodes are the main components in **half-wave** and **full-wave** rectifiers.

These circuits convert alternating current (**AC**) into direct current (**DC**).

<div style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={rectifierImage}
    alt="Full-wave bridge rectifier with diodes D1 through D4 and a load"
    className="invert-on-dark"
    style={{maxWidth: '80%', height: 'auto', borderRadius: '8px'}}
  />
  <p style={{fontSize: '0.9rem', marginTop: '10px', color: 'var(--ifm-color-emphasis-600)'}}>
    <i>Standard full-wave bridge-rectifier configuration.</i>
  </p>
</div>

**How the Current Flows (Full-Wave Bridge):**

A standard bridge rectifier contains four diodes.

1. **Positive half-cycle:** Diodes D2 and D3 become forward biased. Current flows through **D2 &rarr; load &rarr; D3 &rarr; ground**.
2. **Negative half-cycle:** The AC polarity reverses. Diodes D1 and D4 become forward biased. Current flows through **D4 &rarr; load &rarr; D1 &rarr; ground**.
3. **Result:** Current flows through the load in the **same direction** during both halves of the AC cycle.

**Ripple and Filtering**

* **Filter capacitors** connect across the load. They smooth the voltage "bumps," which are the voltage ripple after rectification.
* **Voltage ripple** is the remaining output-voltage variation. The output is not perfectly flat DC yet.

:::info Learn More
For detailed information about conversion from AC to cleaner DC, see the **[Regulation Section](../../02-Power/Regulation/04-LDOs.md)**.
:::

### B. Clamping (Simple Protection)

Diodes can operate as **voltage clamps**.

When you take the output across a diode, the diode can limit a node. The limit is approximately one **forward-voltage drop above** the reference rail.

<DiodeClamping />

**Electrostatic-Discharge (ESD) Steering Diodes:**

You can protect slow control lines with **steering diodes** connected to the rails. Connect one diode to **ground (GND)** and one diode to **VCC**.

* If a high-voltage spike reaches the line, the top diode conducts. It transfers the energy into **VCC**.
* If a negative spike reaches the line, the bottom diode conducts. It pulls current from **GND**.

<ESDSteering />

:::warning Layout Note
The power rails and decoupling capacitors must absorb the event energy. Keep the **traces short** and keep the ground-return path tight.

This arrangement is not ideal for high-speed signals because the diodes add capacitance.
:::

### C. RC Snubbers and RCD Clamps

Fast switching of an inductive load can cause ringing and voltage spikes. Examples of inductive loads are motors and transformers.

**1. RC Snubber (Damping)**

An RC snubber contains a resistor and capacitor in series. It damps the ringing, which is an LC oscillation.

The snubber also decreases the voltage rate of rise, <i>dV/dt</i>.

* **Placement:** Connect the snubber across the switch or across the load. For a metal-oxide-semiconductor field-effect transistor (**MOSFET**), connect it across drain and source.

**2. RCD Clamp (Peak Limiting)**

RCD clamps are common in flyback converters.

The diode operates as a check valve. It routes high-voltage spike energy into the capacitor.

The capacitor holds the voltage. The resistor slowly converts the stored energy into heat.

* **Components:** The diode routes energy. The capacitor holds voltage. The resistor dissipates heat.

<RCDClamp />

:::info Bench Tuning Snubbers
1. Measure the ringing frequency, <i>f<sub>r</sub></i>.
2. Calculate the parasitic values: <i>L &times; C &asymp; 1 / (2&pi; &times; f<sub>r</sub>)<sup>2</sup></i>.
3. Select the snubber capacitor: <i>C<sub>snub</sub> &asymp; 3 &times; C<sub>parasitic</sub></i>.
4. Select the snubber resistor: <i>R<sub>snub</sub> &asymp; &radic;(L / C<sub>snub</sub>)</i>.
:::

## 3. Diode Types

### Schottky Diodes

Schottky diodes use a **metal-semiconductor** junction instead of a P-N junction.

The junction usually contains platinum or tungsten on N-type silicon.

<SchottkySymbol />

**Why Use Them?**

A Schottky diode does not have a P-N junction. Therefore, it does not have minority-carrier injection.

The diode turns off **immediately** and has zero reverse-recovery time. This behavior makes it ideal for high-speed switching regulators.

* **Pros:**
  * **Lower forward drop:** The typical value is 0.2 V to 0.4 V. A silicon diode has a typical value of 0.7 V. The lower voltage causes less heat loss.
  * **Fast switching:** Schottky diodes are ideal for buck and boost converters that operate from kilohertz (kHz) to megahertz (MHz).
* **Cons:**
  * **High reverse leakage:** More current leaks through the diode when it is off. The leakage increases at high temperatures.
  * **Low breakdown voltage:** Schottky diodes with ratings greater than 100 V are difficult to find.

### TVS Diodes (Transient-Voltage Suppressors)

**Transient-voltage-suppressor (TVS) diodes** are special avalanche diodes.

They **turn on quickly** and **absorb short, high-energy events**. These events include ESD, lightning, and inductive kickback.

* **Unidirectional:** This device operates like a Zener diode connected to ground. It blocks positive voltage until the clamp voltage occurs. It conducts freely for negative voltage. It is suitable for DC power lines.
* **Bidirectional:** This device contains two back-to-back diodes. It clamps positive and negative spikes symmetrically. It is suitable for AC or data lines, such as RS-485.

<TVSSymbol />

:::tip High-Speed Design
For USB, HDMI, or Ethernet interfaces, select **low-capacitance** TVS arrays.

Place the array **at the connector**. Use a short ground path and one via directly at the pad. This layout minimizes stub length.
:::
