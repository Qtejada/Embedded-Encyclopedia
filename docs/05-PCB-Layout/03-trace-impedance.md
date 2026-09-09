# Trace Impedance

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Characteristic Impedance

A trace and its reference form a **transmission line**. Its **characteristic impedance Z0** relates voltage and current in a traveling wave.

Characteristic impedance differs from the trace's direct-current resistance. For a low-loss line:

<LearningEquation tex={"Z_0\\approx\\sqrt{\\frac{L'}{C'}}\\qquad v\\approx\\frac{1}{\\sqrt{L'C'}}"} />

**L′** and **C′** are inductance and capacitance per unit length. **v** is propagation velocity.

## 2. Geometry and Stackup

Trace width, copper thickness, plane spacing, and dielectric properties affect impedance.

* **Microstrip:** An outer-layer trace references a plane through the board dielectric.
* **Stripline:** An internal trace lies between reference planes.
* **Differential pair:** Coupling between the two traces also affects differential impedance.

A single trace width cannot guarantee one impedance on every board. Obtain the approved stackup before assigning widths.

## 3. Reflections

For a resistive load **RL**, the load reflection coefficient is:

<LearningEquation tex={"\\Gamma_L=\\frac{R_L-Z_0}{R_L+Z_0}"} />

Zero means no reflection at that load. A positive value preserves the reflected voltage polarity. A negative value reverses it.

import TraceReflectionExplorer from '@site/src/components/TraceReflectionExplorer';

<TraceReflectionExplorer />

## 4. Worked Example: First Arrival

**Assumptions:** A 1 V ideal step drives a 50 Ω line through a 50 Ω source resistance. The load is 100 Ω.

1. The launched wave is **0.5 V**.
2. The load reflection coefficient is **1/3**.
3. The reflected wave is approximately **0.167 V**.
4. The first load voltage is approximately **0.667 V**.

The matched source absorbs the returning wave. These results exclude line loss, load capacitance, and finite edge time.

## 5. From Target to Fabrication

1. Select the line structure and target impedance.
2. Enter the fabricator's dielectric and copper dimensions in a suitable calculator.
3. Obtain fabricator confirmation of width, spacing, and tolerance.
4. Apply those dimensions to routing rules.
5. Specify an impedance coupon when the build requires verification.

A **time-domain reflectometer (TDR)** can locate impedance changes. Measure the actual structure when the interface margin requires it.

**References:** [TI, transmission-line guidance](https://www.ti.com/lit/an/sdya018/sdya018.pdf), [KiCad, transmission-line calculator](https://docs.kicad.org/9.0/en/pcb_calculator/pcb_calculator.html#transline).
