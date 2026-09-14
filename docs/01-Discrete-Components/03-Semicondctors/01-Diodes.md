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

Diodes are **nonlinear**: current does not increase in direct proportion to voltage. In forward bias, it rises steeply as voltage increases, rather than switching on at one exact threshold.

About 0.7 V is a useful first estimate for a silicon diode's forward drop. The actual voltage depends on the material, current, and temperature.

A diode blocks current in the opposite direction during normal operation.

<DiodeVICurve />

A diode is a **two-terminal device**:

* **Anode (+):** Current enters this terminal.
* **Cathode (-):** Current leaves this terminal. A stripe usually identifies the cathode on the package.

<DiodeAnim />

During normal forward-biased operation, current flows from the **anode to the cathode**.

* **PIV (peak inverse voltage):** This is the **maximum reverse-voltage rating** before reverse **breakdown**. If the reverse voltage exceeds the PIV, the diode enters breakdown. Current then flows backward from cathode to anode. This current often destroys the diode unless it is a Zener diode.

<div data-ltspice-placement="zener-regulator">

<details id="circuit-zener-regulator">
<summary>LTspice: Zener shunt regulator</summary>

<CircuitLibrarySimulation circuit="zener-regulator" />

</details>

</div>

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

<div data-ltspice-placement="bridge-rectifier">

<details id="circuit-bridge-rectifier">
<summary>LTspice: Full-wave bridge rectifier</summary>

<SpiceBatchSimulation circuit="bridge-rectifier" />

</details>

</div>

<div data-ltspice-placement="half-wave-rectifier">

<details id="circuit-half-wave-rectifier">
<summary>LTspice: Half-wave rectifier</summary>

<SpiceBatchSimulation circuit="half-wave-rectifier" />

</details>

</div>

### B. Clamping (Simple Protection)

Diodes can operate as **voltage clamps**.

When you take the output across a diode, the diode can limit a node. The limit is about one **forward-voltage drop above** the reference rail.

<DiodeClamping />

**Electrostatic-Discharge (ESD) Steering Diodes:**

You can protect slow control lines with **steering diodes** connected to the rails. Connect one diode to **ground (GND)** and one diode to **VCC**.

* If a high-voltage spike reaches the line, the top diode conducts. It transfers the energy into **VCC**.
* If a negative spike reaches the line, the bottom diode conducts. It pulls current from **GND**.

<ESDSteering />

:::warning Layout Note
The power rails and [decoupling capacitors](<../01-Passives/02-Capacitors.md#bypass--decoupling>) must absorb the event energy. Keep the **traces short** and keep the ground-[return path](<../../05-PCB-Layout/02-Return-Paths.md#1-a-signal-needs-a-return>) tight.

This arrangement is not ideal for high-speed signals because the diodes add capacitance.
:::

<div data-ltspice-placement="diode-limiter-clamp">

<details id="circuit-diode-limiter-clamp">
<summary>LTspice: Diode limiter and DC clamp</summary>

<CircuitLibrarySimulation circuit="diode-limiter-clamp" />

</details>

</div>

### C. RC Snubbers and RCD Clamps

Fast switching of an inductive load can cause ringing and voltage spikes. Examples of inductive loads are motors and [transformers](<../02-Magnetics/01-Transformers.md#1-magnetic-coupling>).

**1. RC Snubber (Damping)**

An RC snubber contains a resistor and capacitor in series. It damps the ringing, which is an LC oscillation.

The snubber also decreases the voltage rate of rise, <i>dV/dt</i>.

* **Placement:** Connect the snubber across the switch or across the load. For a metal-oxide-semiconductor field-effect transistor (**[MOSFET](<./03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>)**), connect it across drain and source.

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

A Schottky diode does not have a P-N junction. As a result, it does not have minority-carrier injection.

A Schottky diode has no minority-carrier reverse-recovery delay, which makes it useful in high-speed switching regulators. Turn-off is still affected by charging and discharging its capacitance, so it is not literally instantaneous.

* **Pros:**
  * **Lower forward drop:** The typical value is 0.2 V to 0.4 V. A silicon diode has a typical value of 0.7 V. The lower voltage causes less heat loss.
  * **Fast switching:** Schottky diodes are ideal for buck and [boost converters](<../../02-Power/Regulation/02-Boost%20Converter.md#1-step-up-conversion>) that operate from kilohertz (kHz) to megahertz (MHz).
* **Cons:**
  * **High reverse leakage:** More current leaks through the diode when it is off. The leakage increases at high temperatures.
  * **Low breakdown voltage:** Schottky diodes with ratings greater than 100 V are difficult to find.

### TVS Diodes (Transient-Voltage Suppressors)

**Transient-voltage-suppressor (TVS) diodes** are special avalanche diodes.

They **turn on quickly** and **absorb short, high-energy events**. These events include ESD, lightning, and [inductive kickback](<../01-Passives/03-Inductors.md#interactive-the-inductive-kick>).

* **Unidirectional:** This device operates like a Zener diode connected to ground. It blocks positive voltage until the clamp voltage happens. It conducts freely for negative voltage. It is suitable for DC power lines.
* **Bidirectional:** This device contains two back-to-back diodes. It clamps positive and negative spikes symmetrically. It is suitable for AC or data lines, such as [RS-485](<../../04-Digital-Interfaces/Serial-Buses/rs232-rs485.md#1-electrical-interfaces>).

<TVSSymbol />

:::tip High-Speed Design
For USB, HDMI, or [Ethernet](<../../04-Digital-Interfaces/Ethernet.md#1-mac-phy-and-cable>) interfaces, select **low-capacitance** TVS arrays.

Place the array **at the connector**. Use a short ground path and one via directly at the pad. This layout minimizes stub length.
:::


## Worked example: solve the diode operating point

A constant forward drop is useful for an initial estimate. An exponential model can refine the operating point when its parameters are known.

Assume a 1 V source, a 1 kΩ series resistor, and a forward-biased diode to ground. Use n = 1, thermal voltage 25.9 mV, and saturation current 1 fA.

The resistor gives I = (1 V − Vd) / 1 kΩ. The diode model gives I = Is × [exp(Vd / 25.9 mV) − 1].

Both equations must give the same current. One way to find the intersection is to alternate resistor-current and diode-voltage estimates.

| Step | Assumed diode voltage | Resistor current | Updated diode voltage |
| --- | --- | --- | --- |
| 1 | 0 V | 1 mA | 0.71564 V |
| 2 | 0.71564 V | 284.36 µA | 0.68307 V |
| 3 | 0.68307 V | 316.93 µA | 0.68588 V |
| Converged | About 0.68567 V | About 314.33 µA | About 0.68567 V |

The converged values satisfy the resistor and diode equations together. Extra decimal places describe the assumed model, not guaranteed device accuracy.

Repeatedly substituting one estimate into the other equation does not work for every circuit. A bracketing method is more reliable when you can find two values with opposite signs of a continuous equation error, then narrow the interval containing the solution.

Temperature, series resistance, and the chosen diode parameters can change the result. Compare the final model with the device data before using it for a design.


## LTspice example: half-wave rectifier

import SpiceBatchSimulation from '@site/src/components/learning/SpiceBatchSimulation';

This example extends [rectification](#a-rectification) with an editable circuit and verified waveforms. The source supplies 12 V peak at 50 Hz.

The source resistance is 10 ohms. The load resistance is 1 kilohm. The circuit uses a silicon diode.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/Diodes#circuit-half-wave-rectifier>).

### Reservoir charge and ripple

Select the smallest capacitor to examine the rectified waveform. Its 1 pF value approximates a circuit without a reservoir capacitor.

Select 47 or 220 microfarads to examine charge storage. The capacitor supplies the load when the source voltage cannot forward bias the diode.

The output then falls until the next charging interval. A larger capacitor reduces this voltage change, which is called **ripple**.

For a short charging interval, the approximate ripple is:

**Ripple voltage = load current / (source frequency × capacitance).**

This estimate assumes nearly constant load current. The resistor load and finite charging interval make the simulation result different from this estimate.

Select the current plot to examine charging pulses. The diode supplies both the load current and the capacitor current during each charging interval.

The peak diode current can exceed the average load current by a large factor. Source resistance limits this current in the example.

### Model scope

The model includes forward voltage, series resistance, junction capacitance, and charge storage.

Use the startup view to examine capacitor charging. Mean output and ripple use the final source cycle in the results table.

## LTspice example: full-wave bridge rectifier

The bridge uses the same source, series resistance, load, and capacitor choices as the half-wave example. This makes the waveforms easy to compare.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/Diodes#circuit-bridge-rectifier>).

### Follow both current paths

The source floats between RAW and B. The series resistor connects RAW to A. The bridge output return is node 0.

When A is positive relative to B, current flows through D1, the load, and D4. D2 and D3 block the other path.

When B is positive relative to A, current flows through D2, the load, and D3. The load current keeps the same direction.

Each conducting path contains two diode drops. Do not connect B to the output return in this circuit.

### Compare recharge frequency

The reservoir capacitor receives charge on both input half cycles. A 50 Hz source produces a 100 Hz recharge frequency.

The approximate ripple relation becomes:

**Ripple voltage = load current / (2 × source frequency × capacitance).**

At 47 microfarads, this example gives about 1.51 V peak-to-peak ripple. The half-wave example gives about 3.31 V with the same capacitor.

The output averages differ because diode drops, load current, and charging intervals also differ. The bridge does not simply double the output voltage.

Select the diode current plot to identify the alternating current paths. Compare [capacitor charge storage](#reservoir-charge-and-ripple) before examining a complete power supply.

### Simulation reference

Both circuits use documented [LTspice device models](https://analogdevicesinc.github.io/ltspice-reference/ai_ref/CIRCUIT-ELEMENTS-REFERENCE.html).

The downloadable validation records include current balance checks and a second simulation with smaller time steps. These checks verify numerical consistency, not physical component ratings.


import CircuitLibrarySimulation from '@site/src/components/learning/CircuitLibrarySimulation';

## More LTspice circuits {#ltspice-circuits}

These examples show component behavior and reusable circuit blocks. Each example includes three parameter settings.

[Browse all LTspice circuits](/ltspice-circuits).

### Zener shunt regulator {#ltspice-zener-regulator}

A series resistor supplies a Zener diode and a parallel load.

The source must supply both load current and Zener current. At low input voltage, the diode leaves breakdown and the output falls.

A heavier load takes more current from the series resistor. This reduces the current available to maintain Zener breakdown.

The series resistor also dissipates power. Compare its voltage drop with the current before selecting its power rating.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/Diodes#circuit-zener-regulator>).

### Diode limiter and DC clamp {#ltspice-diode-limiter-clamp}

One path limits voltage. A separate capacitor and diode path shifts the waveform level.

The two limiter diodes conduct on opposite polarities. The series resistor limits their current.

The clamp capacitor stores charge. Its diode holds the negative excursion near one forward diode drop below ground.

The clamp load discharges the capacitor between cycles. A shorter time constant causes more waveform tilt.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/Diodes#circuit-diode-limiter-clamp>).

### Precision half-wave rectifier {#ltspice-precision-rectifier}

An op-amp and two diodes rectify small signals without losing a full diode drop at the output.

Negative input voltage produces a positive output. The feedback resistor sets the magnitude of the inverting gain.

The second diode maintains a feedback path while the output diode blocks. This avoids driving the op-amp deeply into saturation.

Finite bandwidth and diode charge still affect the transition near zero input. Compare the smallest input with the larger inputs.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-precision-rectifier>).
