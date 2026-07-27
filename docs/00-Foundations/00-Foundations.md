---
title: Electrical Foundations
sidebar_label: Electrical Foundations
---

import CircuitEquivalents from '@site/src/components/CircuitEquivalents';
import PhaseDiagram from '@site/src/components/PhaseDiagram';
import VoltageDivider from '@site/src/components/VoltageDivider';

# Electrical Foundations

This page gives the basic quantities, analysis tools, and nonideal effects that apply to electrical circuits.

## 1. Electrical Quantities and Conservation Laws

<div className="grid-2">

  <div className="tech-panel def-box">
    <span className="panel-header">Electrical quantities</span>

    * **Voltage (V)** is the electric-potential difference between two points. It is analogous to the force or pressure that moves electric charge.
      * **Sign:** A positive *V<sub>ab</sub>* means that point *a* has a higher potential than point *b*.

    * **Current (I)** is the rate of charge flow. The applicable formula is *I = dQ / dt*.
      * **Direction:** Conventional current flows from positive potential to negative potential.
      * Electron flow has the opposite direction. Circuit design normally uses conventional current.

    * **Conductance (G)** is the inverse of resistance. The applicable formula is *G = 1 / R*.
      * **Math:** The unit of conductance is the siemens (S).
  </div>

  <div className="tech-panel def-box">
    <span className="panel-header">Conservation laws</span>

    * **Kirchhoff's current law (KCL)** states that the algebraic sum of currents entering and leaving a node is zero.
      * Equivalently, the total current entering the node equals the total current leaving the node.
      * **Why:** This law comes from the conservation of electric charge. Electric charge cannot be created or destroyed.

    * **Kirchhoff's voltage law (KVL)** states that the sum of all voltage changes in a closed loop is zero.
      * **Why:** This law comes from the conservation of energy. A closed path cannot give a net energy increase.
  </div>

</div>

## 2. Equivalent Circuits and Loading

### Circuit Theorems (Analysis Tools)

<div className="definition-list">

The Thevenin and Norton theorems are **analysis tools**. They replace a complex linear black-box circuit with a two-component model.

| Theorem | Equivalent model | Calculation |
| :--- | :--- | :--- |
| **Thevenin** | **Voltage source and series resistor** | **V<sub>th</sub>:** The open-circuit voltage at the port.<br/>**R<sub>th</sub>:** The resistance looking into the port. |
| **Norton** | **Current source and parallel resistor** | **I<sub>n</sub>:** The short-circuit current at the port.<br/>**R<sub>n</sub>:** A resistance equal to *R<sub>th</sub>*. |

</div>

<CircuitEquivalents />

### Impedance and Loading (Design Philosophy)

Loading is a practical application of the Thevenin theorem. Every real source has internal **source resistance**.

Examples of real sources include sensors, batteries, and output pins.

<VoltageDivider />

<div className="definition-list">

### The "Ideal" Source and the Real Source

1. **Source resistance (R<sub>s</sub>)** must usually be low.
   * A high *R<sub>s</sub>* causes an internal voltage decrease when the load takes current.
   * A low *R<sub>s</sub>* keeps the source voltage stable under load. Engineers call this a **stiff source**.

2. **Load resistance (R<sub>L</sub>)** must usually be high.
   * A high *R<sub>L</sub>* takes a small current and limits the voltage decrease caused by source resistance.
   * This connection method is called **bridging**.
   * **Example:** A typical multimeter has an input impedance of 10 M&Omega; to limit circuit disturbance.

### Maximum Power Transfer

For high efficiency, use a load resistance much higher than the source resistance.

This condition improves efficiency and can increase battery life in a battery-powered circuit.

For maximum load power, match the load to the source. RF antenna systems and audio amplifiers frequently use this condition.

* **DC circuit:** *R<sub>load</sub> = R<sub>source</sub>*.
* **AC circuit:** <em>Z<sub>load</sub> = Z<sub>source</sub><sup>∗</sup></em>. The asterisk identifies the complex conjugate.

</div>

## 3. AC Signals and Power

**Why Sinusoids?** Electrical systems frequently use sine waves. The applicable formula is *V = A sin(2&pi;ft)*.

Electrical systems use sine waves for two reasons:

1. **AC power:** Rotating generators produce sinusoidal voltage.
   * AC power systems supply this voltage at wall outlets.
2. **Linearity:** A linear circuit gives a sine-wave output for a sine-wave input.
   * The circuit can change only the amplitude and phase. This property is unique to sine-wave signals in a linear circuit.

<div className="grid-2">

  <div className="tech-panel def-box">
    <span className="panel-header">AC Power Quantities</span>

    * **Root mean square (RMS)** gives the DC-equivalent value for resistor heating.
      * **Sine wave:** *V<sub>rms</sub> = V<sub>peak</sub> / &radic;2 &asymp; 0.707 V<sub>peak</sub>*.

    * **Power types**
      * **Average power (P):** The power that does real work. *P = V<sub>rms</sub> I<sub>rms</sub> cos(&phi;)*.
      * **Apparent power (S):** The total RMS voltage-current product. *S = V<sub>rms</sub> I<sub>rms</sub>*.
        * Average power equals apparent power multiplied by power factor. *P = S PF*.
      * **Power factor (PF):** The ratio of average power to apparent power. *PF = P / S = cos(&phi;)*.
        * This efficiency ratio shows how effectively apparent power produces real work.
  </div>

  <div className="tech-panel def-box">
    <span className="panel-header">Decibels (dB)</span>

    The **decibel (dB)** is a logarithmic unit. It makes large ratios easier to compare.

    **Formulas**
    * **Power ratio:** *dB = 10 log<sub>10</sub>(P<sub>2</sub> / P<sub>1</sub>)*.
    * **Amplitude ratio, for example voltage:** *dB = 20 log<sub>10</sub>(A<sub>2</sub> / A<sub>1</sub>)*.

    **Useful values**
    * **+3 dB:** This change doubles the power.
    * **+6 dB:** This change doubles the voltage.
    * **-3 dB:** This change halves the power.
    * **+20 dB:** This change multiplies the voltage by 10.
  </div>

</div>

<div className="definition-list">

**Phase** identifies a time difference between periodic signals.

* A 90&deg; phase difference occurs when one signal has its maximum value while the other signal crosses zero.

</div>

<PhaseDiagram />

## 4. Frequency-Domain Response

<div className="definition-list">

**Frequency response**

The **frequency response** shows how circuit gain and phase change with frequency.

**Transfer function (H(s))**

The **transfer function** gives the ratio of output to input in the frequency domain.

* **Formula:** *H(s) = Output(s) / Input(s)*.
* **Poles:** Poles can identify an unstable response.
* **Zeros:** Zeros can identify frequencies that the circuit blocks.

</div>

## 5. Parasitic Effects

<div className="definition-list">

Each real component includes resistance, inductance, and capacitance. These unwanted properties are **parasitic effects**.

* **Everything is an inductor — parasitic inductance:** Each wire and PCB trace has inductance because it has length.
  * **Result:** High-frequency signals can have more impedance than the designer expects.

* **Everything is a capacitor — parasitic capacitance:** Two conductors near each other have capacitance.
  * **Result:** This capacitance can cause crosstalk between PCB traces.
  * **Result:** This capacitance also causes self-capacitance in an inductor.

* **Skin effect:** High-frequency AC moves near the outer surface of a conductor.
  * **Result:** This effect decreases the effective conductor area and increases resistance.

</div>

## 6. Noise

Electrical noise consists of random electrical changes. The changes usually have a Gaussian distribution.

Noise sets a fundamental limit on system resolution.

### Noise Types

#### Thermal Noise

**Thermal noise** is also called Johnson noise. Random motion of thermally excited electrons causes this noise in a conductor.

* **Presence:** Thermal noise is present in all resistive elements. Current flow is not necessary.
* **Characteristics:** Thermal noise has a flat power spectral density. It is a type of white noise.
* **Dependency:** Thermal-noise power is proportional to absolute temperature, measured in kelvins, and to resistance.
* **Magnitude:** At room temperature, a 1 k&Omega; resistor has approximately **4 nV/&radic;Hz** of voltage-noise density.

#### Shot Noise

**Shot noise** occurs when DC current flows across a potential barrier. PN junctions in diodes and bipolar junction transistors contain these barriers.

* **Mechanism:** The discrete movement of charge carriers causes shot noise. The carriers are electrons and holes.
* **Dependency:** The shot-noise amplitude is proportional to the square root of the DC current.

#### 1/f Noise

**1/f noise** is associated with DC current flow. Carrier traps and crystal defects in semiconductor devices contribute to this noise.

This noise is also called flicker noise. It is frequently dominant in MOSFETs and other active devices at low frequencies.

* **Behavior:** The noise energy is inversely proportional to frequency. As a result, the noise amplitude increases when the frequency decreases.
* **1/f corner:** The 1/f corner is the frequency where 1/f noise-amplitude density equals broadband noise-amplitude density.
  * The 1/f noise is dominant below this frequency.

#### Popcorn Noise

**Popcorn noise** is also called burst noise. Heavy-metal ion contamination or defects in the silicon lattice usually cause this low-frequency noise.

Popcorn noise appears as step changes in voltage. These changes are random telegraph signals.

### Noise Spectral Density

Noise is described statistically with **noise spectral density (NSD)**.

Noise-amplitude spectral density gives noise amplitude per square root of bandwidth.

* **Voltage NSD units:** nV/&radic;Hz.
* **Current NSD units:** fA/&radic;Hz or pA/&radic;Hz.

### Total RMS Noise

Calculate the total RMS noise voltage in three steps:

1. **Noise-power density:** If the curve gives voltage-noise density, square the density value.
2. **Integration:** Integrate the noise-power spectral-density curve across the applicable frequency range.
   * The integral is the mean-square noise voltage. It is the area below the power-density curve.
3. **RMS conversion:** Take the square root of the integrated value to get the total RMS noise voltage.

> *V<sub>n,rms</sub> = &radic;(&int;<sub>f1</sub><sup>f2</sup> e<sub>n</sub><sup>2</sup>(f) df)*

* **Bandwidth:** A wider bandwidth increases the integrated area and increases the total noise.

Calculate the 1/f noise and the broadband noise separately. Then, combine the values with the root-sum-square method:

> Total noise = &radic;((Noise<sub>1/f</sub>)<sup>2</sup> + (Noise<sub>broadband</sub>)<sup>2</sup>)

### Amplifier Noise

Amplifiers contain transistors, resistors, and capacitors. These components produce internal noise.

An amplifier noise model puts an equivalent **voltage-noise source (e<sub>n</sub>)** and **current-noise source (i<sub>n</sub>)** at the amplifier inputs.

Amplifier datasheets usually give two noise specifications:

1. **Low-frequency specification:** This specification covers 0.1 Hz to 10 Hz. It gives peak-to-peak voltage in &micro;V<sub>pp</sub>.
2. **Broadband specification:** This specification applies at 1 kHz or 10 kHz. It gives spectral density in nV/&radic;Hz.

The low-frequency specification characterizes the 1/f noise contribution.

#### Current Noise Variation

Current noise varies significantly with transistor technology.

* **JFET and CMOS operational amplifiers:** These amplifiers have very low current noise. Typical values are in the fA/&radic;Hz range.
* **Bipolar operational amplifiers:** These amplifiers have more current noise. Typical values are in the pA/&radic;Hz range.

### Power and Noise

Noise performance and power consumption usually have an inverse relation.

* **Mechanism:** In a bipolar transistor, voltage noise is inversely proportional to the square root of collector current (*I<sub>C</sub>*).
* **Trade-off:** More input-transistor bias current decreases voltage noise. As a result, low-noise amplifiers usually use more power.
