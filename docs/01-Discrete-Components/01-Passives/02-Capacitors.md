---
title: Capacitors
sidebar_label: Capacitors
---

import CapacitorBlockingAnim from '@site/src/components/CapacitorBlockingAnim';
import CapacitorChargeCurve from '@site/src/components/CapacitorChargeCurve';
import CapacitorImpedanceDiagram from '@site/src/components/CapacitorImpedanceDiagram';
import RCHighPass from '@site/src/components/RCHighPass';
import RCLowPass from '@site/src/components/RCLowPass';
import PhaseDiagram from '@site/src/components/PhaseDiagram';

# Capacitors

A **capacitor** stores energy in an electric field. Its behavior depends on voltage, time, frequency, construction, and circuit layout.

## 1. Core Relationships

* **Charge:** *Q = C · V*
* **Current-voltage relationship:** *i(t) = C · (dv/dt)*
* **Stored energy:** *E = ½ · C · V²*

:::note Intuition

A capacitor opposes a change in **voltage**. An inductor opposes a change in **current**.

Ideally, a capacitor acts like a frequency-dependent resistor.

The precise AC term for this frequency-dependent opposition is **impedance**.

:::

## 2. Physical Operation

Charge accumulates on the capacitor plates. This charge produces an **electric field** between the plates.

1. Current charges the capacitor until its voltage equals the source voltage.
2. **Once fully charged**, the capacitor voltage equals the source voltage. The voltage across the series charging resistance is zero. Electrons stop moving, and current is zero.

An ideal capacitor stores energy without power loss. A real capacitor loses power through **equivalent series resistance (ESR)** and dielectric loss.

### Interactive: DC Block and AC Pass

The animation shows how the potential difference drives current flow.

<div className="component-wrapper">
  <CapacitorBlockingAnim />
</div>

## 3. Frequency and Phase Behavior

In the frequency domain, a capacitor has **impedance**.

* **Complex impedance:** *Z<sub>C</sub> = 1 / (jωC)*
* **Impedance magnitude:** *|Z<sub>C</sub>| = 1 / (2π · f · C)*

These rules apply to an ideal capacitor:

**Rules of thumb**

* **DC, where f = 0:** Impedance is infinite. The capacitor acts as an **open circuit**.
* **High frequency:** Impedance approaches zero. The capacitor acts like a **short circuit**, or wire.

:::warning Parasitic Inductance

A real capacitor has **equivalent series inductance (ESL)** from its leads and internal construction.

At sufficiently high frequencies, ESL controls the impedance. The capacitor then behaves like an **inductor** instead of a short circuit.

:::

### Phase Relationship: ICE

Unlike a resistor, a capacitor takes time to charge. Resistor voltage and current change together.

* **Current flows first:** Current must flow into the capacitor before its voltage can increase.
* **Voltage lags:** For an ideal capacitor, voltage lags current by 90 degrees, or one-quarter cycle.

:::tip Mnemonic: ELI the ICE Man

* **E** means voltage, or electromotive force (EMF).
* **I** means current.
* **L** means inductor. In an inductor, **E** leads **I**. This relation gives **ELI**.
* **C** means capacitor. In a capacitor, **I** leads **E**. This relation gives **ICE**. **Current comes before voltage.**

:::

<div className="component-wrapper">
  <PhaseDiagram />
</div>

**Why this matters**

This 90-degree phase shift is why capacitors stabilize feedback loops through compensation.

Compensation capacitors also determine the **phase margin** of a power supply.

## 4. RC Time Constants

A capacitor does not charge instantly through a resistor. The capacitor voltage follows an exponential curve.

* **Time constant:** *τ (tau) = R · C*
* **Charge equation:** *v<sub>C</sub>(t) = V<sub>S</sub> · (1 - e<sup>-t/τ</sup>)*

**Key milestones**

* **1τ:** The capacitor is 63% charged.
* **3τ:** The capacitor is 95% charged.
* **5τ:** The capacitor is approximately 99% charged. Engineers usually treat this condition as fully charged.

<CapacitorChargeCurve />

## 5. Common Uses

### AC Coupling (Blocking)

Place a coupling capacitor in series between two circuit stages.

* **Goal:** Pass the AC signal, such as audio or radio frequency (RF), and **block** the DC bias voltage.
* **Example:** A coupling capacitor lets a 3.3 V microcontroller communicate with a 5 V amplifier. It prevents disturbance of their DC bias points.

### Bypass / Decoupling

Connect a bypass capacitor between a supply pin and ground.

* The capacitor sends any unwanted AC signal on the supply to ground.
* **Goal:** Provide a low-impedance bridge for AC only.
* **Layout:** Put small ceramic capacitors **as close to the pin as possible**. Keep the current-loop area small.

### Bulk Capacitance

Put large capacitors, usually electrolytic capacitors, on the main power rail.

* A bulk capacitor supplies immediate current when an integrated circuit (IC) switches and has a sudden current demand. The distant main supply has trace inductance and cannot respond immediately.
* **Goal:** Handle large, slow power surges and reduce low-frequency ripple.

## 6. Differentiators and Integrators

By arranging the capacitor and resistor, we can perform calculus operations on signals.

**How it works**

* At high frequencies, capacitor reactance is low, and the capacitor behaves more like a wire. At low frequencies, it acts like an open circuit and blocks DC.
* As input frequency increases, the output becomes more similar to the input. This response is the behavior of a **high-pass filter**.
* The resistor voltage depends on capacitor current. The relation is *I<sub>C</sub> = C · (dV/dt)*. Therefore, *V<sub>out</sub> = R · C · (dV<sub>in</sub>/dt)*. The output is the input derivative.

### Differentiator: RC High-Pass Filter

The output is proportional to the **rate of change** of the input.

<div className="component-wrapper">
  <RCHighPass />
</div>

* **Function:** Blocks DC and passes fast edges.
* **Use case:** A rising-edge detector changes a square wave into sharp output spikes.
* **Math:** *V<sub>out</sub> ≈ R · C · (dV<sub>in</sub>/dt)*

### Integrator: RC Low-Pass Filter

The output is proportional to the **accumulation** of the input.

**Similarly**

* An RC integrator acts as a low-pass filter for a sine wave.
* It acts as an integrator for other waveforms.
* The capacitor relation gives *V<sub>OUT</sub> = (1/C) · ∫ I<sub>C</sub> dt*.
* Because *I<sub>C</sub> = I<sub>R</sub> = V<sub>IN</sub>/R*, the result is *V<sub>OUT</sub> = (1/RC) · ∫ V<sub>IN</sub> dt*.

<div className="component-wrapper">
  <RCLowPass />
</div>

* **Function:** Smooths fast signals and passes DC.
* **Use case:** A low-pass filter averages a pulse-width-modulated (PWM) signal to produce a DC voltage. This circuit acts as a simple digital-to-analog converter (DAC).
* **Math:** *V<sub>out</sub> ∝ ∫ V<sub>in</sub> dt*

## 7. Dielectric Types

The dielectric material controls capacitance, stability, loss, physical size, and voltage performance.

<div className="capacitor-table">

| Type | Dielectric | Best use | Important properties |
| :--- | :--- | :--- | :--- |
| **Ceramic** | **C0G / NP0** | Filters, timing, and radio frequency | **The gold standard.** Excellent temperature stability and no piezoelectric noise. Available capacitance values are comparatively low. |
| **Ceramic** | **X7R / X5R** | Decoupling and bulk capacitance | High capacitance density. **Warning:** Capacitance decreases when DC bias increases. |
| **Film** | **PP / PET** | Audio and high voltage | Very low ESR and good linearity. Handles high-voltage spikes well. Physical size is large. |
| **Electrolytic** | **Aluminum** | Bulk energy storage | High capacitance for its cost. ESR is high, and the capacitor dries out over time. |

</div>

## 8. Real-World Parasitics

An ideal capacitor is purely capacitive. A **real** capacitor is a resistor, inductor, and capacitor in series.

The series model contains capacitance, **ESR**, and **ESL**.

These parasitic properties change power-supply design and high-speed circuit design.

<CapacitorImpedanceDiagram />

### Equivalent Series Resistance

**Equivalent series resistance (ESR)** includes resistance in the plates and leads. It also represents dielectric losses.

* **Heat generation:** Ripple current through ESR produces heat. The relation is *P = I² · ESR*. Excessive ripple current can overheat a high-ESR electrolytic capacitor and make it rupture or pop.
* **Voltage ripple:** ESR frequently determines power-supply output ripple. The relation is *V<sub>ripple</sub> = I<sub>load</sub> × ESR*. Lower ESR gives cleaner power.
* **Regulator stability:** Some older low-dropout (LDO) regulators require a small ESR value for stable operation. Replacing their tantalum capacitor with a near-zero-ESR ceramic can cause oscillation.

### Equivalent Series Inductance

**Equivalent series inductance (ESL)** comes from leads and internal conductor geometry.

* **Frequency limit:** Inductance opposes high-frequency current changes.
* **Package Size Matters:** A 1206 capacitor has more ESL than a smaller 0402 capacitor. Small 0402 or 0201 capacitors go closest to IC supply pins because they respond faster.

### Impedance V-Curve and Self-Resonance

Because of ESL, a capacitor remains capacitive only below its **self-resonant frequency (SRF)**.

1. **Down Slope (Capacitive):** Impedance decreases as frequency increases. This is normal capacitor behavior.
2. **The Bottom (Resistive):** Impedance reaches its minimum at self-resonance. In the simple series model, this minimum equals **ESR**.
3. **Up Slope (Inductive):** Above SRF, ESL controls the impedance, and impedance is **rising**. The capacitor is effectively an **inductor** and filters high-frequency noise less effectively.

:::tip Design Tip: Parallel Capacitors

Engineers frequently connect a **10 µF bulk capacitor** and a **0.1 µF ceramic capacitor** in parallel.

* The large capacitor handles low-frequency current changes.
* The small capacitor handles high-frequency current changes because it has lower ESL and a higher SRF.

The combination covers a wider frequency range than one capacitor.

:::

## 9. Other Nonideal Properties

Real capacitors are not only capacitance, or **C**. They also have leakage, dielectric memory, and physical sensitivity.

If you ignore these properties, the precision circuit will not operate correctly.

### A. Dielectric Absorption

**Dielectric absorption**, also called **soakage**, causes a discharged capacitor voltage to return slowly.

For example, fully charge a capacitor. Short it to 0 V for one second, and then open the circuit.

The capacitor voltage then **creeps back up**.

* **The Physics:** Some charge remains trapped deep inside the dielectric and releases slowly.
* **The Consequence:** This effect prevents precision **sample-and-hold circuits** and long-period **integrators** from operating correctly. The capacitor retains its previous voltage history.
* **The Fix:** Do not use electrolytic or high-K X7R ceramic capacitors for precision timing. Use **polypropylene (PP)** or **polystyrene (PS)** film capacitors.

### B. Piezoelectric Effects and Microphonics

Multilayer ceramic capacitors (MLCCs) with high-K dielectrics are piezoelectric. Examples include **X7R**, **Z5U**, and **Y5V**.

1. **Microphone effect:** If you tap the PCB, the capacitor generates a voltage spike. This effect causes problems in high-gain audio preamplifiers and vibration-sensitive sensor circuits.
2. **Speaker effect:** An audio-frequency voltage makes the capacitor vibrate. This effect causes audible whining, or a singing capacitor, in power supplies.

* **The Fix:** Use **C0G / NP0 Class 1 ceramic** or film capacitors in sensitive signal paths. These dielectrics are not piezoelectric.

### C. Leakage and Insulation Resistance

Every capacitor has an effective parallel leakage resistance, *R<sub>leak</sub>*. Leakage current slowly discharges the capacitor.

* **Electrolytic capacitors:** These capacitors are very leaky. Do not use them for timers that must operate for more than a few seconds.
* **Ceramic and film capacitors:** These capacitors have extremely low leakage in the picoampere range. They can support hold times of minutes or hours.

### D. Detailed Film-Capacitor Selection

The term **film capacitor** is too broad because it includes different dielectric materials. *The Art of Electronics* distinguishes these materials carefully.

<div className="capacitor-table">

| Dielectric | Symbol | Properties | Best application |
| :--- | :--- | :--- | :--- |
| **Polyester** | **PET / Mylar** | Low cost, generic performance, and high dielectric absorption. | General coupling and decoupling when precision is not necessary. |
| **Polypropylene** | **PP** | Low loss and low dielectric absorption. | Precision timing, high-power pulses, and high-quality audio. |
| **Polystyrene** | **PS** | The former **king of precision** is extremely stable but difficult to obtain. It melts easily during soldering. | Traditional precision circuits. C0G and PP now frequently replace it. |
| **Polycarbonate** | **PC** | Good temperature stability. | Mostly obsolete and difficult to obtain. |

</div>

### E. Detailed Parallel-Capacitor Logic

Why do engineers connect a **10 µF tantalum capacitor** and a **0.1 µF ceramic capacitor** in parallel?

Why do they not use one 10.1 µF capacitor?

**Reason:** The two capacitors have different **ESL** values.

* The **10 µF** capacitor has high ESL. Above approximately 1 MHz, it becomes inductive and acts like an open circuit to high-frequency noise.
* The **0.1 µF** capacitor has low ESL. It stays capacitive to approximately 100 MHz and filters noise that the large capacitor does not remove.

:::tip Design Rule

In high-speed digital circuits, **physical size** matters more than capacitance value. A small **0402** 0.1 µF capacitor has less inductance and filters better than a large **1206** 0.1 µF capacitor in GHz designs.

:::
