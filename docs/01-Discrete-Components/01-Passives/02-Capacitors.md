---
title: Capacitors
sidebar_label: Capacitors
---

import CapacitorBlockingAnim from '@site/src/components/CapacitorBlockingAnim';
import RCHighPass from '@site/src/components/RCHighPass';
import RCLowPass from '@site/src/components/RCLowPass';
import PhaseDiagram from '@site/src/components/PhaseDiagram';

# Capacitors

## 1. Core Relations

* **Charge:** *Q = C · V*
* **Current–voltage relationship:** *i(t) = C · (dv/dt)*
* **Energy stored:** *E = ½ · C · V²*

:::note The Intuition
A capacitor opposes changes in **Voltage** (just like an Inductor opposes changes in Current).
Ideally, it acts like a frequency-dependent resistor.
:::

## 2. Physics & Operation
Charge builds up on the plates, creating an Electric Field.
1.  The capacitor charges until the voltage across its plates equals the source voltage.
2.  **Once fully charged** (no difference in potential), electrons stop moving. Current = 0.

Energy is stored in its electric field, so ideally no power loss. In a real world application there is some power from the ESR and dielectric loss.

### Interactive: DC Block vs AC Pass
See how the potential difference drives current flow.

<div className="component-wrapper">
  <CapacitorBlockingAnim />
</div>



## 3. Frequency Behavior
In the frequency domain, a capacitor is an **Impedance**.

* **Impedance Formula:** *Z = 1 / (jωC)*
* **Magnitude:** *|Z| = 1 / (2π · f · C)*

**The Rules of Thumb:**
* **DC (f=0):** Z is Infinite. Acts like an **Open Circuit**.
* **High Freq:** Z approaches 0. Acts like a **Short Circuit** (Wire).

:::warning Parasitics (ESL)
Real capacitors have "Parasitic Inductance" (ESL) from their leads and internal construction.
At very high frequencies, the ESL takes over and the capacitor starts looking like an **Inductor**, effectively stopping it from acting as a short circuit.
:::

### Phase Relationship ("ICE")
Unlike a resistor (where Voltage and Current happen instantly together), a capacitor takes time to charge.
* **Current flows First:** You have to push current into the capacitor *before* the voltage can rise.
* **Voltage Lags:** The voltage reaction is delayed by 90° (¼ of a cycle).

:::tip Mnemonic: "ELI the ICE man"
* **E** = Voltage (EMF)
* **I** = Current
* **L** (Inductor): **E** leads **I** (ELI)
* **C** (Capacitor): **I** leads **E** (**ICE**) -> *Current comes before Voltage*
:::

<div className="component-wrapper">
  <PhaseDiagram />
</div>

**Why this matters:**
This 90° phase shift is why capacitors are used to stabilize feedback loops (compensation) and why they determine the "Phase Margin" in power supplies.


## 4. Common Uses

### AC Coupling (Blocking)
A series capacitor placed between two stages.
* **Goal:** Pass the AC signal (Audio/RF) but **block** the DC bias voltage.
* Allows a 3.3V microcontroller to talk to a 5V amplifier without blowing up the DC bias points.

### Bypass / Decoupling
A capacitor placed from a Supply Pin to Ground.
* Filters out any unwanted AC signal from the power supply to ground.
* **Goal:** Act as a bridge for AC only.
* **Layout:** Place small ceramics **as close to the pin as possible**. Minimize loop area.

### Bulk Capacitance
Large capacitors (usually Electrolytic) on the main power rail.
* When the IC switches and demands a sudden gulp of current, the capacitor provides it immediately (since the main power supply is too far away and has trace inductance).
* **Goal:** Handle large, slow power surges and smooth out low-frequency ripple.



## 5. Dielectric Types

| Type | Dielectric | Best For | Notes |
| :--- | :--- | :--- | :--- |
| **Ceramic** | **C0G / NP0** | Filters, Timing, RF | **The Gold Standard.** Temp stable, no piezo noise, but low capacitance values. |
| **Ceramic** | **X7R / X5R** | Decoupling, Bulk | High capacitance density. **Warning:** Capacitance drops with DC bias. |
| **Film** | **PP / PET** | Audio, High Voltage | Very low ESR, linear, handles high voltage spikes well. Large physical size. |
| **Electrolytic** | **Aluminum** | Bulk Energy Storage | High Capacitance per dollar. High ESR, dries out over time. |



## 6. RC Time Constants
When you charge a capacitor through a resistor, it doesn't happen instantly. It follows a curve.

* **Time Constant:** *τ (tau) = R · C*
* **Charge Equation:** *v<sub>C</sub>(t) = V<sub>S</sub> · (1 - e<sup>-t/τ</sup>)*

**Key Milestones:**
* **1τ:** 63% Charged
* **3τ:** 95% Charged
* **5τ:** ~99% Charged (Considered "Full" in engineering)



## 7. Differentiators & Integrators
By arranging the C and R, we can perform calculus on signals.

**How it works**
* At high frequencies, Reactance is low, Capacitor acts more like a wire, and at low frequencies, the capacitor is acting more like an open, blocking DC.
* As the frequency of the input increases, the output looks more and more like the input. Basically like a high pass filter.
* The voltage of the resistor is dependent on the current released by the capacitor. The current released by the capacitor is determined by *I<sub>C</sub> = C · (dV / dt)*, so *V<sub>out</sub> = R · C · (dV<sub>in</sub> / dt)*, which means the output voltage is the derivative of the input.

### Differentiator (High-Pass Filter)
Output is proportional to the **rate of change** of the input.

<div className="component-wrapper">
  <RCHighPass />
</div>

* **Function:** Blocks DC, passes fast edges.
* **Use Case:** Rising Edge Detector. A square wave input becomes sharp spikes at the output.
* **Math:** *V<sub>out</sub> ≈ RC · (dV<sub>in</sub>/dt)*

### Integrator (Low-Pass Filter)
Output is proportional to the **accumulation** of the input.

**Similarly**
* Integrator acts similarly. Acts as a low pass filter for a sinewave.
* Acts as an integrator for other waves.
* *I<sub>C</sub> = C · (dV / dt) → V<sub>OUT</sub> = ∫ I<sub>C</sub> dt × (1/C)*.
* *I<sub>C</sub> = I<sub>R</sub> = V<sub>IN</sub> / R → (1 / RC)* times the integral of *V<sub>IN</sub>* is your output.

<div className="component-wrapper">
  <RCLowPass />
</div>

* **Function:** Smooths out fast signals, passes DC.
* **Use Case:** Averaging a PWM signal to create a DC voltage (DAC).
* **Math:** *V<sub>out</sub> ∝ ∫ V<sub>in</sub> dt*.



## 8. Real-World Parasitics (ESR & ESL)
An ideal capacitor is purely capacitive. A **real** capacitor is actually a resistor, inductor, and capacitor in series. This changes how we design power supplies and high-speed circuits.

### ESR (Equivalent Series Resistance)
The internal resistance of the plates, leads, and dielectric losses.
* **Heat Generation:** Ripple current flowing through the ESR creates heat (*P = I² · ESR*). High ESR caps (like Electrolytics) can overheat and pop if the ripple current is too high.
* **Voltage Ripple:** In power supplies, output ripple is often determined by *V<sub>ripple</sub> = I<sub>load</sub> × ESR*. Lower ESR = Cleaner Power.
* **Stability:** Some older LDO regulators *rely* on a tiny bit of ESR to stay stable. If you replace an old Tantalum cap with a modern Ceramic (near-zero ESR), the LDO might oscillate.

### ESL (Equivalent Series Inductance)
The inductance of the leads and internal structure.
* **Frequency Limit:** Inductance opposes high-frequency changes.
* **Package Size Matters:** A large 1206 capacitor has higher ESL than a tiny 0402 capacitor. This is why we place small 0402/0201 caps closest to the IC pins—they respond faster.

### The Impedance "V" Curve (Self-Resonance)
Because of ESL, a capacitor only acts like a capacitor up to a certain frequency called the **SRF (Self Resonant Frequency)**.

1.  **Down Slope (Capacitive):** Impedance drops as frequency rises. This is normal behavior.
2.  **The Bottom (Resistive):** The impedance hits its lowest point. This value is the **ESR**.
3.  **Up Slope (Inductive):** Above the SRF, the ESL takes over. The impedance starts **rising** again. The capacitor is now effectively an Inductor and blocks high-frequency noise less effectively.

:::tip Design Tip: Parallel Caps
This is why we place a **10µF** (Bulk) and **0.1µF** (Ceramic) in parallel.
* The large cap handles low frequencies.
* The small cap handles high frequencies (because it has lower ESL/higher SRF).
Together, they cover a wider frequency range than either could alone.
:::



## 10. Non-Ideal Properties 

Real capacitors are not just "C". They are complex devices with leakage, memory, and physical sensitivity. Ignoring these will break precision circuits.

### A. Dielectric Absorption ("Soakage")
If you fully charge a capacitor, then short it out to 0V for a second, then open the circuit... the voltage will **creep back up**!
* **The Physics:** Charge gets "trapped" deep inside the dielectric material and takes time to release.
* **The Consequence:** This ruins precision **Sample-and-Hold** circuits and long-period **Integrators**. The capacitor "remembers" its previous voltage history.
* **The Fix:** Never use Electrolytic or High-K Ceramic (X7R) for precision timing. Use **Polypropylene (PP)** or **Polystyrene** film capacitors.

### B. Piezoelectric Effects ("Microphonics")
Multi-layer Ceramic Capacitors (MLCCs) using High-K dielectrics (**X7R, Z5U, Y5V**) are piezoelectric.
1.  **Microphone Effect:** If you tap the PCB, the capacitor generates a voltage spike. (Bad for high-gain audio preamps or vibration-sensitive sensor circuits).
2.  **Speaker Effect:** If you apply an AC signal (audio frequency), the capacitor physically vibrates. This causes "Singing Capacitors" (audible whining) in power supplies.
* **The Fix:** Use **C0G / NP0** (Class 1) ceramics or Film capacitors in sensitive signal paths. They are not piezoelectric.

### C. Leakage (Insulation Resistance)
Every capacitor has a parallel resistor (*R<sub>leak</sub>*) that slowly discharges it.
* **Electrolytics:** Very leaky. You cannot use them for timers longer than a few seconds.
* **Ceramics/Film:** Extremely low leakage (pico-Amps). Good for minutes or hours of hold time.

### D. Detailed Film Capacitor Selection
"Film" is too broad. *The Art of Electronics* distinguishes them carefully:

| Dielectric | Symbol | Properties | Best Application |
| :--- | :--- | :--- | :--- |
| **Polyester** | **PET / Mylar** | Cheap, generic. High soakage. | General coupling/decoupling where precision doesn't matter. |
| **Polypropylene** | **PP** | Low loss, Low soakage. | Precision timing, high-power pulses, high-end audio. |
| **Polystyrene** | **PS** | The old "King of Precision." | Extremely stable. Hard to find now (replaced by C0G/PP). Melts easily when soldering! |
| **Polycarbonate** | **PC** | Good temp stability. | Mostly obsolete/rare now. |

### E. The "Parallel Caps" Logic
Why do engineers place a **10µF** Tantalum and a **0.1µF** Ceramic in parallel? Why not just use one 10.1µF?

**Reason:** ESL (Equivalent Series Inductance).
* The **10µF** cap has high ESL. Above ~1MHz, it stops being a capacitor and becomes an inductor (Open circuit to high freq noise).
* The **0.1µF** cap has low ESL. It stays capacitive up to ~100MHz, filtering the noise the big cap missed.

:::tip Design Rule
In high-speed digital circuits, **Physical Size** matters more than value. A small **0402** 0.1µF capacitor has lower inductance (and filters better at high GHz) than a large **1206** 0.1µF capacitor.
:::