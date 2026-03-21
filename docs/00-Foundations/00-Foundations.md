---
title: Foundations & Laws
sidebar_label: Foundations
---

import VoltageDivider from '@site/src/components/VoltageDivider';
import PhaseDiagram from '@site/src/components/PhaseDiagram';

# Foundations & Laws

## 1. Basic Quantities

<div className="grid-2">

  <div className="tech-panel def-box">
    <span className="panel-header">Definitions</span>
    
    * **Voltage (V):** Difference in potential. The "force" or "pressure" that moves charges.
      * *Sign:* Positive *V<sub>ab</sub>* means point *a* is higher potential than *b*.
    
    * **Current (I):** Rate of flow of charge (*I = dQ / dt*).
      * *Direction:* Conventional Flow (Positive to Negative). Electron flow is opposite, but we ignore that in design.
    
    * **Conductance (G):** Inverse of resistance (*G = 1 / R*).
      * *Math:* Measured in Siemens (S).
  </div>

  <div className="tech-panel def-box">
    <span className="panel-header">Conservation Laws</span>
    
    * **KCL (Kirchhoff's Current Law):** The sum of currents entering and leaving a node is **Zero**.
      * *Why:* Charge conservation (matter isn't created/destroyed).
    
    * **KVL (Kirchhoff's Voltage Law):** The sum of voltage drops around any closed loop is **Zero**.
      * *Why:* Energy conservation (you can't gain energy by walking in a circle).
  </div>

</div>



## 2. AC & Signals

**Why Sinusoids?**
We use sine waves (*V = Asin(2πft)*) because:
1.  It's what comes out of the wall (generators rotate).
2.  **Linearity:** A linear circuit with a sinusoidal input will *always* output a sinusoid (just scaled/shifted). This is unique.

<div className="grid-2">

  <div className="tech-panel def-box">
    <span className="panel-header">AC Power Quantities</span>
    
    * **RMS (Root Mean Square):** The "DC Equivalent" for power heating.
      * *Sine:* *V<sub>rms</sub> = V<sub>peak</sub> / √2 ≈ 0.707 V<sub>peak</sub>*.
    
    * **Power Types:**
      * **Average Power (P):** Real work done. *P = V<sub>rms</sub> · I<sub>rms</sub> · cos(φ)*.
      * **Apparent Power (S):** Total energy moving. *S = V<sub>rms</sub> · I<sub>rms</sub>*.
      * **Power Factor (PF):** Efficiency ratio. *PF = P / S = cos(φ)*.
  </div>

  <div className="tech-panel def-box">
    <span className="panel-header">Decibels (dB)</span>
    
    A logarithmic scale to compare huge differences in magnitude.
    
    **Formulas**
    * **Power:** *dB = 10 · log<sub>10</sub>(P2 / P1)*
    * **Amplitude (Volts):** *dB = 20 · log<sub>10</sub>(A2 / A1)*
    
    **Cheatsheet**
    * **+3 dB:** 2x Power
    * **+6 dB:** 2x Voltage
    * **-3 dB:** Half Power
    * **+20 dB:** 10x Voltage
  </div>

</div>

<div className="definition-list">

**Phase:** A time delay between signals.
* "90° out of phase" means when one signal peaks, the other is crossing zero.

</div>

<PhaseDiagram />



## 3. Circuit Theorems (Analysis Tools)

These theorems allow us to simplify complex "black box" circuits into two components.

<div className="definition-list">

| Theorem | Equivalent Model | How to Calculate |
| :--- | :--- | :--- |
| **Thevenin** | **Voltage Source + Series Resistor** | **V<sub>th</sub>:** Open circuit voltage at the port.<br/>**R<sub>th</sub>:** Resistance looking into the port. |
| **Norton** | **Current Source + Parallel Resistor** | **I<sub>n</sub>:** Short circuit current at the port.<br/>**R<sub>n</sub>:** Same as R<sub>th</sub>. |

</div>



## 4. Impedance & Loading (Design Philosophy)

This is the practical application of Thevenin. Every real-world source (Sensor, Battery, Output Pin) has an internal **Source Resistance**.

<VoltageDivider />

<div className="definition-list">

### The "Ideal" vs "Real"
1.  **Source Resistance (R<sub>s</sub>):** You want this **LOW**.
    * High R<sub>s</sub> causes internal voltage drop when current is drawn.
    * Low R<sub>s</sub> means the source is "stiff" (voltage doesn't sag under load).
    
2.  **Load Resistance (R<sub>L</sub>):** You usually want this **HIGH**.
    * "Bridging": High R<sub>L</sub> draws minimal current, preventing voltage sag on the source.
    * *Example:* Multimeters have 10MΩ input impedance so they don't disturb the circuit they measure.

### Max Power Transfer
If you care about efficiency (battery life), keep R<sub>L</sub> High.
If you care about **raw power** (RF antenna, Audio amp), you match them:
* **DC:** *R<sub>load</sub> = R<sub>source</sub>*
* **AC:** *Z<sub>load</sub> = Z<sub>source</sub>\** (Complex Conjugate)

</div>



## 5. Frequency Domain

<div className="definition-list">

**Frequency Response**
How a circuit's gain/phase changes as frequency changes.

**Transfer Functions (H(s))**
* Definition: The ratio of Output to Input in the frequency domain.
* *H(s) = Output(s) / Input(s)*
* Used to map Poles (instability) and Zeros (blocking).

</div>



## 6. Real World Noise & Parasitics

<div className="definition-list">

### Noise
Random electrical fluctuations.
* **Thermal (Johnson):** Noise generated by electrons bouncing around in a resistor. Depends on Temp and Resistance.
* **Shot Noise:** Noise from electrons crossing a barrier (PN junction).
* **1/f (Flicker):** Low-frequency noise, dominant in MOSFETs/active devices.

### Parasitics
Every component is actually an R, L, and C combined.

1.  **Everything is an Inductor:** All wires/traces have length, therefore they have inductance.
    * *Result:* High frequency signals face higher impedance than expected.
2.  **Everything is a Capacitor:** Any two conductors near each other form a capacitor.
    * *Result:* PCB traces can cross-talk; Inductors have self-capacitance.
3.  **Skin Effect:** At high AC frequencies, current crowds to the outside edge of a wire, effectively reducing the cross-section and **increasing Resistance**.

</div>



## 7. Noise in Electronics

Noise is random in nature and typically follows a Gaussian distribution. It is a fundamental limit to system resolution.

## 1. Noise Types

### Thermal Noise (Johnson Noise)
Thermal noise is associated with the random motion of thermally excited electrons in a conductor. It is present in all resistive elements regardless of current flow.
* **Characteristics:** It has a flat power spectral density (White Noise).
* **Dependency:** Directly proportional to absolute temperature (Kelvin) and resistance.
* **Magnitude:** At room temperature, a 1k&Omega; resistor has a noise voltage density of approximately **4 nV/&radic;Hz**.



### Shot Noise
Shot noise is associated with DC current flow across potential barriers, such as PN junctions in diodes and BJTs.
* **Mechanism:** Caused by the discrete nature of charge carriers (electrons/holes) crossing the barrier.
* **Dependency:** Proportional to the square root of the DC current.

### 1/f Noise (Flicker Noise)
1/f noise is associated with DC current flow and is related to carrier traps and crystal imperfections in semiconductor devices.
* **Behavior:** The noise energy is inversely proportional to frequency. As frequency decreases, the noise amplitude increases.
* **1/f Corner:** The frequency at which 1/f noise amplitude equals the broadband thermal noise. Below this frequency, 1/f noise dominates.



### Popcorn Noise (Burst Noise)
A low-frequency noise typically associated with heavy metal ion contamination or defects in silicon lattice. It appears as step-function shifts in voltage (random telegraph signals).

---

## 2. Noise Spectral Density (NSD)

Noise is described statistically using Spectral Density, representing noise amplitude per unit of bandwidth.
* **Voltage NSD Units:** nV/&radic;Hz
* **Current NSD Units:** fA/&radic;Hz or pA/&radic;Hz

### Calculating Total RMS Noise
To determine the total RMS noise voltage in a circuit, you must integrate the Noise Power Spectral Density curve over the frequency range of interest.
* **Concept:** Total noise corresponds to the area under the density curve.
* **Bandwidth:** A wider system bandwidth results in a larger area under the curve, increasing total noise.
* **Calculation:** 1/f noise and broadband noise are estimated separately and combined using the square root of the sum of the squares (Root Sum Square):
    > Total Noise = &radic;( (Noise<sub>1/f</sub>)<sup>2</sup> + (Noise<sub>broadband</sub>)<sup>2</sup> )

---

## 3. Amplifier Noise Model

Amplifiers (constructed from transistors, resistors, and capacitors) have internal noise sources. These are modeled as equivalent **Voltage Noise (e<sub>n</sub>)** and **Current Noise (i<sub>n</sub>)** generators placed at the amplifier inputs.



### Specifications
Datasheets typically specify noise in two formats:
1.  **Low Frequency (0.1 Hz to 10 Hz):** Expressed as a Peak-to-Peak voltage (&mu;V<sub>pp</sub>). This characterizes the 1/f noise contribution.
2.  **Broadband (1 kHz or 10 kHz):** Expressed as Spectral Density (nV/&radic;Hz).

### Current Noise Variation
Current noise varies significantly by transistor technology:
* **JFET/CMOS Op-Amps:** Very low current noise (fA/&radic;Hz range).
* **Bipolar Op-Amps:** Higher current noise (pA/&radic;Hz range).

---

## 4. Power vs. Noise Relationship

There is generally an inverse relationship between noise performance and power consumption.
* **Mechanism:** In bipolar transistors, voltage noise is inversely proportional to the square root of the collector current (I<sub>C</sub>).
* **Trade-off:** Reducing voltage noise requires increasing the bias current of the input transistors. Consequently, low-noise amplifiers typically consume more power.