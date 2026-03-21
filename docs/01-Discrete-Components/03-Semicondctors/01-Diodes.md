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

# Diodes & Circuit Protection

## 1. The Basics

### What they are
Diodes are **non-linear** devices. They conduct once a forward threshold is reached (≈0.7V for silicon. Material dependent) and block current from the other direction.

<DiodeVICurve />

They are a **2-terminal device**:
* **Anode (+):** Current enters here.
* **Cathode (-):** Current leaves here (usually marked with a stripe on the package).

<DiodeAnim />

Current flows from **Anode to Cathode** under normal forward-biased operation.

* **PIV (Peak Inverse Voltage):** The **maximum reverse voltage rating** before reverse **breakdown**. If you apply a voltage greater than the diode's PIV onto the cathode with respect to the anode, the diode enters the breakdown region, and current forces its way backwards from Cathode to Anode (often destroying the diode unless it's a Zener).



## 2. Common Circuit Uses

### A. Rectification
Diodes are the core of **half-wave** and **full-wave** rectifiers, converting AC (Alternating Current) into DC (Direct Current).


<div style={{textAlign: 'center', margin: '20px 0'}}>
  <img 
    src="/img/rectifier.png" 
    alt="Full-Wave Bridge Rectifier Circuit" 
    className="invert-on-dark" 
    style={{maxWidth: '80%', height: 'auto', borderRadius: '8px'}}
  />
  <p style={{fontSize: '0.9rem', marginTop: '10px', color: 'var(--ifm-color-emphasis-600)'}}>
    *Standard Full-Wave Bridge Rectifier configuration.*
  </p>
</div>




**How the Current Flows (Full-Wave Bridge):**
In a standard 4-diode bridge rectifier:
1.  **Positive Half-Cycle:** Diodes D2 and D3 become forward biased. Current flows through **D2 → Load → D3 → Ground**.
2.  **Negative Half-Cycle:** The AC polarity flips. Diodes D1 and D4 become forward biased. Current flows through **D4 → Load → D1 → Ground**.
3.  **Result:** The load sees current flowing in the **same direction** during both halves of the AC cycle.

**Ripple & Filtering**
* **Filter capacitors** are placed across the load to smooth out the "bumps" (voltage ripple) after rectification.
* **Voltage ripple** is the leftover variation—the output isn’t perfectly flat DC yet.

:::info Learn More
For in-depth detail on converting AC to cleaner DC, check out the **[Regulation Section](../../02-Power/02-Regulation/01-ldos.md)**.
:::

### B. Clamping (Simple Protection)
Diodes can act as **voltage clamps**. Taking the output across a diode can limit a node to roughly the **forward voltage drop above** the reference rail.

<DiodeClamping />

**ESD Steering Diodes:**
You can protect slow control lines with **steering diodes** to the rails: one diode to **GND**, one to **VCC**.
* If a high-voltage spike hits the line, the top diode conducts and dumps the energy into **VCC**.
* If a negative spike hits, the bottom diode conducts and pulls current from **GND**.

<ESDSteering />

:::warning Layout Note
This assumes your rails + decoupling capacitors can absorb the energy hit! Keep the **traces short** and the return to ground tight. Not ideal for high-speed signals as diodes add capacitance.
:::

### C. RC Snubbers & RCD Clamps
When you switch inductive loads (motors, transformers) quickly, you get ringing and voltage spikes.

**1. RC Snubber (Damping)**
An RC snubber (Resistor + Capacitor in series) damps the ringing (LC oscillation) and reduces the speed of the voltage rise (dV/dt).
* **Placement:** Across the switch (Mosfet D-S) or across the Load.

**2. RCD Clamp (Peak Limiting)**
Common in Flyback converters. It uses a Diode to act as a "check valve," allowing high-voltage spikes to bleed into a capacitor and burn off slowly through a resistor.
* **Components:** Diode (routes energy), Capacitor (holds voltage), Resistor (dissipates heat).

<RCDClamp />

:::info Bench Tuning Snubbers
1.  Measure Ringing Frequency (f<sub>r</sub>).
2.  Calculate Parasitics: L × C ≈ 1 / (2π × f<sub>r</sub>)²
3.  Pick Snubber Cap: C<sub>snub</sub> ≈ 3 × C<sub>parasitic</sub>
4.  Pick Snubber Resistor: R<sub>snub</sub> ≈ √(L / C<sub>snub</sub>)
:::



## 3. Diode Types

### Schottky Diodes
Schottky diodes use a **Metal-Semiconductor** junction (usually platinum or tungsten on N-type silicon) rather than a P-N junction.

<SchottkySymbol />

**Why use them?**
Because they don't have a P-N junction, they don't have "minority carrier injection." This means they turn off **instantly** (zero reverse recovery time), making them perfect for high-speed switching regulators.

* **Pros:**
    * **Lower Forward Drop:** Typically 0.2V – 0.4V (vs 0.7V for Silicon). Less power lost as heat.
    * **Fast Switching:** Ideal for Buck/Boost converters operating at high frequencies (kHz to MHz).
* **Cons:**
    * **High Reverse Leakage:** They leak more current when off, especially at high temps.
    * **Low Breakdown:** Hard to find high-voltage (>100V) Schottkys.

### TVS Diodes (Transient Voltage Suppressors)
**TVS diodes** are specialized avalanche diodes built to **turn on fast** and **absorb high-energy, short events** (ESD, Lightning, inductive kickback).

* **Unidirectional:** Behaves like a Zener to ground. Blocks positive voltage, clamps if it gets too high. Conducts freely for negative voltage. (Good for DC power lines).
* **Bidirectional:** Two diodes back-to-back. Clamps symmetrically for positive or negative spikes. (Good for AC or Data lines like RS-485).

<TVSSymbol />
:::tip High-Speed Design
For interfaces like USB, HDMI, or Ethernet, look for **"Low Capacitance"** TVS arrays. Place them **at the connector** with a short path to ground (single via right at the pad) to minimize stub length.
:::