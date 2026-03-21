---
title: Inductors
sidebar_label: Inductors
---

import InductorFlybackAnim from '@site/src/components/InductorFlybackAnim';
import InductorPhaseDiagram from '@site/src/components/InductorPhaseDiagram';

# Inductors

## 1. Core Relations

<div className="grid-2">

  <div className="tech-panel">
    
    
    * **Voltage:** *v(t) = L · (di / dt)*
    * **Energy stored:** *E = ½ · L · I²*
    * **Impedance:** *Z = jωL*
    
 
  </div>

  <div className="tech-panel">
    
    :::note Inertia for Current
    Think of an Inductor like a **Heavy Flywheel** inside a water pipe.
    * It takes pressure (Voltage) to get it spinning (Current).
    * Once spinning, it doesn't want to stop.
    * If you cut the flow instantly, the momentum creates a massive pressure spike (**Flyback**).
    :::
  </div>

</div>



## 2. Physics & Operation

**Current in an inductor cannot change instantaneously.**
If the drive (voltage) is removed, the inductor will generate **whatever voltage is needed** (even thousands of volts) to keep the current flowing across the gap. This is the **Flyback Kick**.

### Interactive: The Inductive Kick
*Charge the coil and release to see the voltage spike.*

<div className="component-wrapper">
  <InductorFlybackAnim />
</div>



## 3. Frequency Behavior

<div className="grid-2">

  <div className="tech-panel">

    
    **The Rules of Thumb:**
    * **DC (f=0):** Z is Zero. Acts like a **Short Circuit** (Wire).
    * **High Freq:** Z is High. Acts like an **Open Circuit**.
    
    *This is the exact opposite of a Capacitor.*
  </div>

  <div className="tech-panel">
    <span className="panel-header">04. Phase Relationship</span>
    
    <InductorPhaseDiagram />
    
    **"ELI the ICE man"**
    * **Voltage (E) leads Current (I)** by 90°.
    * You must apply Voltage *before* Current can start ramping up.
  </div>

</div>



## 4. Common Uses

### Switching Regulators (Buck/Boost)
Used very often in modern power systems. The inductor stores energy during the "On" cycle and releases it to the load during the "Off" cycle.

### Filtering (Chokes)
* **Series Choke:** Blocks high-frequency noise from entering a circuit.
* **Ferrite Bead:** A lossy inductor that turns RF noise into heat.

### Transformers
Two coupled inductors. Used to step voltage up/down or isolate grounds.



## 5. Core Types & Selection

The material inside the coil determines how much energy it can hold before it "saturates" (stops working).

| Type | Material | Pros/Cons | Best Application |
| :--- | :--- | :--- | :--- |
| **Ferrite** | MnZn / NiZn | **High Permeability.** Low losses. <br/>*Con:* Hard Saturation (Inductance falls off a cliff). | Switch-Mode Power (Discontinuous), Signal Filtering. |
| **Powder** | Iron / Alloy | **Soft Saturation.** Inductance drops gracefully. <br/>*Con:* Higher core losses. | High-Current Power (Continuous Mode). |
| **Air Core** | Air / Plastic | **No Saturation.** Perfect linearity. <br/>*Con:* Huge physical size for low inductance. | RF Circuits, Tuned Radios. |



## 6. RL Time Constants

Just like RC circuits, Inductors have a time constant when paired with a resistor.

* **Time Constant:** *τ = L / R*
* **Current Rise:** *I(t) = (V / R) · (1 - e<sup>-t/τ</sup>)*

**Key Takeaway:**
Current takes time to ramp up. Lower Resistance = Slower Ramp (Higher τ).
* *Contrast with Caps:* Capacitors charge slower with *Higher* resistance. Inductors charge slower with *Lower* resistance (because L/R).



## 7. Switch-Mode Basics (The "Integrator")

While Capacitors smooth out Voltage, Inductors smooth out **Current**.

### The Buck Converter (Step-Down)
This is the primary use case for inductors in digital hardware.

1.  **Switch ON:** Voltage is applied. Current ramps up linearly (*V = L·di/dt*). Energy is stored in the magnetic field.
2.  **Switch OFF:** Field collapses. The Inductor acts as a source, pushing current through the diode to the load.
3.  **Result:** The output sees a smooth average DC voltage, even though the input was chopped pulses.

:::info Design Choice
* **Ferrite Drum:** Better for High Ripple / Discontinuous mode.
* **Powder Core:** Better for Low Ripple / Continuous mode (handles DC bias better).
:::



## 8. Real-World Parasitics

<div className="grid-2">

  <div className="tech-panel">
    <span className="panel-header">DCR (DC Resistance)</span>
    
    Real wire has resistance.
    * **Effect:** Simple *I²R* heating.
    * **Trade-off:** Thicker wire = Lower DCR but larger size.
  </div>

  <div className="tech-panel">
    <span className="panel-header">SRF (Self-Resonance)</span>
    
    Windings are close together, creating tiny **Inter-winding Capacitance**.
    * **Above SRF:** The inductor stops blocking noise and acts like a Capacitor (passes high freq!).
    * **Rule:** Always operate well below the SRF.
  </div>

</div>



## 9. Non-Ideal Properties (The "Gotchas")

### A. Saturation Current (I<sub>sat</sub>)
The most dangerous spec.
* **Concept:** The magnetic core can only hold so much flux. Once full, it acts like Air.
* **The Danger:** Inductance drops to near zero instantly. Current spikes massively, potentially blowing up your MOSFET.
* **Rule:** Never exceed *I<sub>sat</sub>*, even for a microsecond.


### B. Audible Noise ("Coil Whine")
* **Magnetostriction:** The magnetic field physically squeezes the core material.
* At certain frequencies (2kHz - 20kHz), the core vibrates like a speaker, creating an audible whine.
* **Fix:** Use molded inductors (solid block) or shift switching frequency above 20kHz.

### C. EMI (Electromagnetic Interference)
* **Shielded Inductors:** Have a magnetic housing to keep the field inside.
* **Unshielded:** Cheaper, but spew magnetic field lines everywhere, inducing noise in nearby traces.
:::danger Layout Tip
Never route sensitive signal traces under an inductor! It acts like a transformer primary and will inject noise into your signal.
:::