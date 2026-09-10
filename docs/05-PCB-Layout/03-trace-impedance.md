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
* **[Differential pair](<./01-Overview.md#52-length-matching-skew-control>):** Coupling between the two traces also affects differential impedance.

A single trace width cannot guarantee one impedance on every board. Obtain the approved stackup before assigning widths.

## 3. Reflections

For a resistive load **RL**, the load reflection coefficient is:

<LearningEquation tex={"\\Gamma_L=\\frac{R_L-Z_0}{R_L+Z_0}"} />

Zero means no reflection at that load. A positive value preserves the reflected voltage polarity. A negative value reverses it.

import TraceReflectionExplorer from '@site/src/components/TraceReflectionExplorer';

<TraceReflectionExplorer />

## 4. Worked Example: First Arrival

**Assumptions:** A 1 V ideal step drives a 50 Ω line through a 50 Ω [source resistance](<../00-Foundations/00-Foundations.md#the-ideal-source-and-the-real-source>). The load is 100 Ω.

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


## Distributed loss and termination

A real transmission line has series resistance R and inductance L per unit length. It also has shunt conductance G and capacitance C per unit length.

<LearningEquation tex={"Z_0(\\omega)=\\sqrt{\\frac{R+j\\omega L}{G+j\\omega C}}"} />

The lossless approximation neglects R and G. Microstrip and coaxial lines obey the same distributed principle, but their geometry determines different parameter values.

[Skin effect](<../00-Foundations/04-Fields-and-Materials.md#dielectrics-and-conductor-losses>) raises conductor loss at high frequency. Dielectric loss contributes through G. Dispersion changes propagation delay with frequency and can distort a pulse.

**Characteristic impedance**, **input impedance**, and **insertion loss** describe different properties. Input impedance also depends on line length and termination.

Insertion loss describes reduced transmission between defined reference planes. It generally increases with frequency in a lossy channel, but resonances can add local variation.

| Termination | Placement | Main trade-off |
| --- | --- | --- |
| Series resistor | Close to the source | Low static loss, delayed final level at intermediate taps |
| Parallel resistor | Close to the receiver | Immediate matched arrival, static current for many logic families |
| [Thevenin](<../00-Foundations/00-Foundations.md#circuit-theorems-analysis-tools>) network | Close to the receiver | Sets a bias and impedance, with resistor power loss |
| AC termination | Close to the receiver | Reduces DC loss, but depends on pulse pattern and time constant |

Include driver output resistance when selecting source termination. Keep receiver termination connections short. A long branch between the receiver and resistor creates another discontinuity.

For fixed trace width, increasing the distance to a ground plane usually increases microstrip impedance. Confirm the actual stackup with a field solver or measurement.

If a fabricated board has twice the intended dielectric thickness, a resistor cannot restore its geometry. Revised termination might reduce reflections if timing and drive limits permit.

Otherwise, revise the routing or refabricate the board. Connector transitions, vias, and reference changes also require checking.

## Preemphasis and equalization

**Preemphasis** increases selected fast-changing signal components before transmission. A simple implementation adds a scaled difference between the present and previous symbol.

<LearningEquation tex={"y[n]=(1+a)x[n]-a x[n-1],\\qquad a>0"} />

For a constant symbol sequence, the output equals the input. At a transition, the extra term increases the initial amplitude before it returns to the steady level.

The frequency response has greater gain near the upper end of the symbol band than at DC. This can counter part of a channel's high-frequency loss.

Receiver equalization changes the received spectrum or uses past symbol decisions. Equalization can amplify noise or propagate decision errors. Validate the complete channel and receiver.


See [TI logic design considerations](https://www.ti.com/lit/an/sdya002/sdya002.pdf) for transmission-line and termination examples.
