---
title: BJTs and Amplifiers
sidebar_label: BJTs
---

import BJTBasicActive from '@site/src/components/BJTBasicActive';
import BJTFeedbackLoopDiagram from '@site/src/components/BJTFeedbackLoopDiagram';
import useBaseUrl from '@docusaurus/useBaseUrl';

# BJTs, Amplifiers, and Feedback

## 1. Basic BJT Idea

<BJTBasicActive />

<div className="definition-list">

* A small **base current** controls a larger current from collector to emitter.
* The base-emitter and base-collector junctions operate like diodes.

**General NPN operating rules:**

* If <i>V<sub>C</sub> &gt; V<sub>B</sub></i> and <i>V<sub>BE</sub> &asymp; 0.7 V</i>, the transistor is in **active mode**.
* If <i>V<sub>BE</sub> &gt; 0.7 V</i> and <i>V<sub>B</sub> &gt; V<sub>C</sub></i>, the transistor is in **saturation**.
* If <i>V<sub>BE</sub> &lt; 0.7 V</i>, the transistor is in **cutoff**.

You can use two analysis methods:

* **General rule:** This method gives a quick hand analysis. It assumes values such as <i>V<sub>BE</sub> &asymp; 0.7 V</i>.
* **Ebers-Moll:** This exponential model gives a more accurate analysis.

Use the general rule for most simple analyses.

**General-analysis relationships:**

* <i>I<sub>C</sub> = &beta; &times; I<sub>B</sub></i>

  Do **not** make a circuit depend on an exact value of <i>&beta;</i>. The value can change by a very large amount.

* <i>V<sub>B</sub> &asymp; V<sub>E</sub> + 0.7 V</i>

  This relationship applies approximately when the transistor conducts. It applies in active mode and saturation. Otherwise, the transistor is in cutoff.

* More base current causes more collector current. Sufficient base drive makes the collector-emitter path operate like a short circuit. This condition is saturation.
* With no base current, the collector-emitter path operates like an open circuit. This condition is cutoff.

</div>

### Modes of Operation

<div className="definition-list">

**Active Mode**

Active mode occurs when:

* <i>V<sub>B</sub></i> is approximately 0.7 V higher than <i>V<sub>E</sub></i>.
* <i>V<sub>C</sub> &gt; V<sub>B</sub></i>.

You can bias the transistor at a selected operating point. This point is the **quiescent point (Q-point)**.

The circuit operates around the Q-point.

**Saturation**

Saturation occurs when the base drive requests more collector current than the circuit can supply:

<i>I<sub>B</sub> &times; &beta; &gt; I<sub>C(maximum allowed by the circuit)</sub></i>

In the simple model, <i>I<sub>C</sub> = &beta; &times; I<sub>B</sub></i>. The collector tries to draw more current than the circuit can supply.

The voltage across the collector resistor continues to increase. Almost no voltage remains between collector and emitter.

As a result, the collector voltage becomes very close to the emitter voltage. For an NPN transistor with a grounded emitter, <i>V<sub>C</sub> &asymp; 0 V</i>.

The base-collector junction becomes forward biased. The base-collector diode then conducts.

**What Saturation Means:**

* <i>V<sub>CE</sub></i> becomes as close to 0 V as possible.
* The transistor operates like a **closed switch** from collector to emitter.
* All available current flows from the supply, through the load, and through the transistor.

**Uses:**

* You can use a saturated transistor as a **switch**.
* To guarantee saturation, use sufficient <i>I<sub>B</sub></i>. The condition <i>I<sub>B</sub> &times; &beta; &gt; I<sub>C</sub></i> must remain true when <i>&beta;</i> is low.
* Do **not** use the exact value of <i>&beta;</i>. Overdrive the base.

**Cutoff**

Cutoff occurs when <i>V<sub>BE</sub></i> is not forward biased or <i>I<sub>B</sub> &asymp; 0</i>.

For an NPN transistor, ground the base or make <i>V<sub>E</sub> &gt; V<sub>B</sub></i> to get cutoff.

**What Cutoff Means:**

* Collector current does not flow. This statement ignores the small leakage current.
* The terminals are effectively separate. The collector-emitter path is an open circuit.
* The transistor operates like an **open switch**.

</div>

## 2. Ebers-Moll (Exponential Behavior)

<div className="definition-list">

**Important Ebers-Moll Formula:**

* <i>I<sub>C</sub> = I<sub>S</sub> &times; exp(V<sub>BE</sub> / V<sub>T</sub>)</i>

  In this formula:

  * <i>I<sub>S</sub></i> is the saturation current. It is very temperature dependent.
  * <i>V<sub>T</sub> = kT/q</i> is the thermal voltage. It is approximately 25 mV at room temperature.

This formula shows that **V<sub>BE</sub> fundamentally sets I<sub>C</sub>**. Base current does not fundamentally set it.

The relationship <i>I<sub>C</sub> = &beta; &times; I<sub>B</sub></i> is a result of this exponential behavior.

**Inverse Relationship:**

* <i>V<sub>BE</sub> = V<sub>T</sub> &times; ln(I<sub>C</sub> / I<sub>S</sub>)</i>

Temperature affects <i>V<sub>BE</sub></i> through both <i>V<sub>T</sub></i> and <i>I<sub>S</sub></i>.

**Relationship Between Two Operating Points:**

* <i>I<sub>C2</sub> / I<sub>C1</sub> = exp(&Delta;V<sub>BE</sub> / V<sub>T</sub>)</i>
* As a result, <i>&Delta;V<sub>BE</sub> = V<sub>T</sub> &times; ln(I<sub>C2</sub> / I<sub>C1</sub>)</i>.

**Internal Emitter Resistance, r<sub>e</sub>:**

* The small-signal emitter resistance is <i>r<sub>e</sub> = V<sub>T</sub> / I<sub>C</sub></i>.
* At room temperature, <i>r<sub>e</sub> &asymp; 25 mV / I<sub>C</sub></i>. Use amperes for <i>I<sub>C</sub></i>.
* If temperature or bias changes <i>I<sub>C</sub></i>, then <i>r<sub>e</sub></i> also changes.
* If the circuit uses only <i>r<sub>e</sub></i> for emitter resistance, small changes in <i>I<sub>C</sub></i> cause **nonlinear** changes in gain and impedance.

</div>

## 3. Stability and Temperature

<div className="definition-list">

**Emitter Degeneration:** Add an explicit resistor, <i>R<sub>E</sub></i>, in the emitter path.

* Usually, make <i>R<sub>E</sub> &gt;&gt; r<sub>e</sub></i>.
* Most emitter resistance then comes from a fixed resistor instead of the temperature-dependent <i>r<sub>e</sub></i>.

If the circuit uses only <i>r<sub>e</sub></i>:

* Linear changes in <i>V<sub>BE</sub></i> do **not** cause linear changes in collector current. The relationship is exponential.
* Changes in <i>I<sub>C</sub></i> change <i>r<sub>e</sub></i>. As a result, impedance and gain also change.

An external emitter resistor, <i>R<sub>E</sub></i>, supplies **negative feedback**:

* <i>I<sub>C</sub></i> increases &rarr; <i>I<sub>E</sub></i> increases &rarr; the voltage across <i>R<sub>E</sub></i> increases.
* <i>V<sub>E</sub></i> increases &rarr; <i>V<sub>BE</sub></i> decreases &rarr; <i>I<sub>C</sub></i> is pushed down.

<BJTFeedbackLoopDiagram />

This feedback helps prevent **thermal runaway**.

During thermal runaway, temperature increases collector current. The higher current increases power dissipation, which causes a further temperature increase.

**Bypass Capacitor Idea:**

* Use a large <i>R<sub>E</sub></i> for DC stability. **Bypass** the resistor with a capacitor for AC operation.
* **DC:** The circuit sees <i>R<sub>E</sub></i>. The resistor stabilizes the bias and opposes thermal runaway.
* **AC:** The capacitor shorts <i>R<sub>E</sub></i>. The AC gain is then set primarily by <i>R<sub>C</sub> / r<sub>e</sub></i>.
* The AC signal has a direct path to ground. The circuit still uses <i>R<sub>E</sub></i> to maintain stable DC bias.

**Temperature-Dependent Parts:**

* Temperature changes both <i>V<sub>T</sub> = kT/q</i> and <i>I<sub>S</sub></i>.
* The temperature dependence of <i>I<sub>S</sub></i> is generally stronger and usually dominates.

</div>

## 4. Biasing Techniques

<div className="definition-list">

**Dual-Supply Biasing and Voltage-Divider Biasing**

**Voltage-Divider Biasing:**

* A resistor divider from one supply sets the base DC voltage.
* A coupling capacitor lets the AC signal operate on top of this DC bias.
* The signal can move around a mid-rail bias point and toward the supply rails.

**Dual-Supply Biasing:**

* The circuit has <i>+V<sub>CC</sub></i> and <i>-V<sub>EE</sub></i>.
* You can bias the base and input signal at 0 V.
* The signal can move symmetrically from <i>+V<sub>CC</sub></i> to <i>-V<sub>EE</sub></i>.
* LTspice examples help you see this operation.

**Using Two Resistors for High-Gain Applications**

A single base-bias resistor can require a very low base voltage for a high-gain target. At this voltage, <i>V<sub>BE</sub></i> can be very unstable.

Two resistors can provide:

* A more stable base bias through a voltage divider or feedback.
* A method to set gain while the transistor stays in a better operating region.

In some circuits, gain is related to a voltage ratio. The ratio uses the unbypassed emitter-resistor voltage and the collector voltage.

You can think of this relationship as an **r<sub>e</sub> voltage-divider idea**.

**Collector-to-Base (Feedback) Bias**

This is another bias method:

* The current from the collector node, <i>V<sub>C</sub></i>, sets <i>V<sub>BE</sub></i>.
* A resistor connects the collector to the base and supplies **DC feedback**. An example resistor value is 10 k&Omega;.
* You can calculate the circuit so that the base settles approximately 0.7 V above the emitter. This action keeps <i>I<sub>C</sub></i> approximately constant.
* Select the 10 k&Omega; resistor so that its current supplies the necessary base current for Q1.
* Matched transistors with the same <i>V<sub>BE</sub></i> operate similarly at the same bias.

For example, a collector voltage can put 0.8 V across a 10 k&Omega; resistor. This voltage sets base current.

The base current sets <i>I<sub>C</sub></i>. The collector current then sets <i>V<sub>C</sub></i> and closes the feedback loop.

</div>

**KVL with BJTs**

When you calculate voltages and currents, include the approximate 0.7 V connection between base and emitter.

* **NPN:** <i>V<sub>B</sub> &asymp; V<sub>E</sub> + 0.7 V</i>.
* **PNP:** <i>V<sub>E</sub> &asymp; V<sub>B</sub> + 0.7 V</i>.
* Include this voltage drop correctly in Kirchhoff's voltage-law (**KVL**) loops.

## 5. Amplifier Configurations

<div className="definition-list">

**Common-Emitter Amplifier**

The **common-emitter amplifier** is another transistor application.

* **DC output voltage:** <i>V<sub>out</sub> = V<sub>CC</sub> - I<sub>C</sub> &times; R<sub>C</sub></i>
* **Approximate small-signal gain with an unbypassed R<sub>E</sub>:** <i>A<sub>v</sub> &asymp; -R<sub>C</sub> / R<sub>E</sub></i>
* A more accurate gain calculation includes <i>r<sub>e</sub></i> and the bypass details.
* The output is **180&deg; out of phase** with the input.

Basic DC and AC analysis shows the cause:

* Base or emitter current increases &rarr; <i>I<sub>C</sub></i> increases.
* The voltage drop across <i>R<sub>C</sub></i> increases &rarr; <i>V<sub>out</sub></i> decreases.

**Emitter Follower (Common Collector)**

The emitter follower has **high input impedance** and **low output impedance**.

As a result, it can drive a relatively low-impedance load from a high-impedance source. It does not load the source excessively.

**Key Relationships:**

* <i>R<sub>in</sub> &asymp; (&beta; + 1) &times; R<sub>L</sub></i>. The load, <i>R<sub>L</sub></i>, is connected at the emitter.
* A simple emitter follower usually has no collector resistor. A collector resistor can cause transistor saturation.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/EmitterFollowerFigure4.25.png')}
    alt="Single-ended emitter-follower output-current booster"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Single-ended emitter-follower output-current booster. Image source: <i>The Art of Electronics</i>, Figure 4.25.
  </figcaption>
</figure>

**Biasing and Bootstrapping:**

* When a divider biases an emitter follower, do not use an extremely high divider impedance.
* If divider impedance is too high relative to base input impedance, the bias becomes unstable.
* **Bootstrapping** feeds part of the output back to the bias network. It can greatly increase **AC input impedance** without loading the signal.
* The AC voltage at one resistor terminal moves with the output. Very little AC voltage then occurs across the resistor.
* As a result, the effective AC resistance becomes very large.

**Unity Phase Splitter (Transconductance-Amplifier Idea)**

* In some topologies, the transistor operates as a **transconductance amplifier**.
* The small-signal current-to-voltage ratio is <i>g<sub>m</sub> = &Delta;I<sub>C</sub> / &Delta;V<sub>BE</sub> &asymp; 1 / r<sub>e</sub></i>.
* A base-current or base-voltage change causes a collector-current change.
* The collector-current change causes a collector-voltage change through <i>R<sub>C</sub></i>.
* Without <i>R<sub>E</sub></i>, the emitter connects directly to ground. The general 0.7 V model can be inaccurate for small-signal operation.
* Use the **Ebers-Moll model** and the small-signal parameters <i>g<sub>m</sub></i>, <i>r<sub>&pi;</sub></i>, and <i>r<sub>o</sub></i>.

**Differential Amplifiers and CMRR**

**Differential Amplifier:**

* It amplifies the **voltage difference** between two points.
* You can use it to measure across a component or between two integrated-circuit (**IC**) nodes.
* An electrocardiogram (**ECG**) system uses LL, LA, RL, and RA electrodes.
* Differential electrode outputs produce lead I, lead II, lead III, and other leads.
* A differential amplifier removes noise that is common to both inputs. It primarily outputs the difference.

**CMRR (Common-Mode Rejection Ratio):**

* **CMRR** measures how well the amplifier rejects a signal that is **common** to both inputs.
* CMRR is usually specified in decibels (**dB**).
* High CMRR gives strong rejection of common noise. An example is 60 Hz hum on both ECG leads.

**Transconductance (General Idea)**

* **Transconductance** is the output-current change for an input-voltage change.
* <i>g<sub>m</sub> = &Delta;I / &Delta;V</i>

To describe circuit transconductance, ask: "How does the current change with respect to the input voltage?"

For a BJT in the active region:

* <i>g<sub>m</sub> &asymp; I<sub>C</sub> / V<sub>T</sub></i>

</div>

## 6. Current Sources and Mirrors

<div className="definition-list">

**Simple Transistor Current Source**

Add a collector load and an emitter resistor to make a transistor current source.

**Example:**

* <i>V<sub>E</sub> = V<sub>B</sub> - 0.7 V</i>
* <i>I<sub>E</sub> = V<sub>E</sub> / R<sub>E</sub> = (V<sub>B</sub> - 0.7 V) / R<sub>E</sub></i>
* For large <i>&beta;</i>, <i>I<sub>E</sub> &asymp; I<sub>C</sub></i>.
* As a result, <i>I<sub>C</sub> &asymp; (V<sub>B</sub> - 0.7 V) / R<sub>E</sub></i>.

The current remains relatively constant while the transistor stays in active mode. This statement applies within the load limits.

You can supply <i>V<sub>B</sub></i> with a voltage divider. Make the divider impedance much less than <i>&beta; &times; R<sub>E</sub></i>.

Changing <i>V<sub>B</sub></i> produces a **voltage-controlled current source**.

**Conceptual Resistive Current Source:**

* Apply a voltage through a very large source resistance.
* If <i>R<sub>source</sub> &gt;&gt; R<sub>load</sub></i>, load-current change is small when the load changes.
* Resistive current sources waste power. BJTs can supply current with less power loss.

**Current Mirror**

* A **current mirror** receives an input current and supplies a copy of that current.
* You can use this circuit to replicate current into multiple loads.
* It has **high output impedance**. This impedance keeps output current almost constant when output voltage changes.

**Basic BJT Current-Mirror Example:**

* Q1 has its emitter at <i>+15 V</i>. Its base is approximately 14.4 V, depending on the circuit.
* Adjust the collector of Q1 to make its collector current the reference current. An example reference current is 1 mA.
* Connect the bases and emitters of Q1 and Q2 together. The transistors then have the same <i>V<sub>BE</sub></i>.
* If Q1 and Q2 are matched, Q2 conducts approximately the same collector current. It supplies approximately 1 mA to its load.

**Real Behavior:**

Output impedance is not infinite. The mirrored <i>I<sub>C</sub></i> can change if the load causes a very large output-voltage change.

The current can also change if the load tries to draw too much current.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/AoE3.png')}
    alt="BJT current-sink and current-mirror circuit alternatives"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    BJT current-sink and current-mirror alternatives. Image source: <i>The Art of Electronics</i>, Figure 3.26.
  </figcaption>
</figure>

</div>

## 7. Advanced Configurations and Power

<div className="definition-list">

**Using a PNP Transistor**

* Use a PNP high-side transistor when a grounded load must connect to a **positive supply**.
* An NPN transistor is difficult to use in this high-side position. Its emitter must be at the supply.
* The NPN base would have to be more than 0.7 V above the emitter. This voltage would exceed the supply.
* You can cascade a PNP transistor with an NPN emitter follower. This arrangement removes the 0.7 V offset from one NPN emitter follower.

**Darlington Configuration**

* Two cascaded transistors operate like one transistor with **very high beta**.
* <i>&beta;<sub>total</sub> &asymp; &beta;<sub>1</sub> &times; &beta;<sub>2</sub></i>
* The base-emitter voltage is approximately twice the normal value. It is approximately 1.2 V to 1.4 V.
* **Disadvantage:** The configuration operates **slowly**. Q1 must turn off Q2, and stored charge can be large.
* A resistor from the base of Q2 to its emitter can increase turn-off speed.

**Push-Pull, Crossover Distortion, and Amplifier Classes**

**Push-Pull Output Stage:**

This stage gives an output swing near the full positive-to-negative supply range.

* **Positive half-cycle:** The NPN transistor, Q1, turns on. It supplies current to the load, such as a speaker.
* **Negative half-cycle:** The PNP transistor, Q2, turns on. Its base is approximately 0.7 V below its emitter.
* The PNP transistor lets current flow through the load in the opposite direction.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/PushPullFigure4.26.png')}
    alt="Push-pull emitter-follower output-current booster"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Push-pull emitter-follower output stage. Image source: <i>The Art of Electronics</i>, Figure 4.26.
  </figcaption>
</figure>

**Crossover Distortion:**

* Near 0 V, **both transistors are off**. Each transistor needs approximately 0.7 V of <i>V<sub>BE</sub></i> to turn on.
* This dead zone causes crossover distortion in the output waveform.

**Correction for Crossover Distortion (Class AB):**

* Add diodes D1 and D2 between the bases. Keep the diodes forward biased.
* Each diode supplies approximately 0.6 V to 0.7 V.
* This voltage pre-biases the transistors. At least one transistor is always slightly on.
* This is a **Class AB amplifier** because both transistors conduct during a significant part of the cycle.
* **Trade-off:** The transistors dissipate more power at idle because they are always partially on.
* In this condition, the transistors operate like a type of voltage divider between the rails.

**Class D Amplifiers:**

* These **switching amplifiers** drive the output with high-frequency pulses.
* Efficiency is very high because the transistors are usually fully on or fully off.
* High-frequency switching causes more electromagnetic-interference (**EMI**) emissions and requires filtering.

</div>

## 8. Negative Feedback and Stability

<div className="definition-list">

**Negative Feedback:**

Negative feedback returns part of the circuit output to the input. The returned signal **opposes** the original signal.

**Emitter-Resistor Example:**

* <i>I<sub>C</sub></i> increases &rarr; <i>I<sub>E</sub></i> increases &rarr; <i>V<sub>E</sub></i> increases.
* <i>V<sub>BE</sub></i> decreases &rarr; <i>I<sub>C</sub></i> decreases.
* This process stabilizes the circuit against temperature, transistor <i>&beta;</i>, supply changes, and other variations.

**Stabilized Operation and Thermal Runaway:**

Negative feedback helps prevent **thermal runaway**.

* Without stabilization: temperature increases &rarr; <i>I<sub>C</sub></i> increases &rarr; power increases &rarr; temperature increases again.
* With emitter degeneration, the feedback loop opposes this process and makes the circuit more stable.

**Lower Output Impedance:**

Negative feedback generally **decreases amplifier output impedance**. The output voltage then becomes less sensitive to load changes.

**Gain-Stability Example:**

If open-loop gain is <i>A</i> and feedback factor is <i>B</i>, closed-loop gain is:

* <i>A<sub>CL</sub> = A / (1 + A &times; B)</i>

When <i>A &times; B</i> is large:

* <i>A<sub>CL</sub> &asymp; 1 / B</i>

As a result, <i>B</i> controls the gain. Resistors usually set <i>B</i>.

Stable resistors produce more stable gain than temperature-sensitive transistors.

**Voltage Feedback and Current Feedback**

**Voltage Feedback:**

* Subtract part of the **output voltage** from the input.
* This action makes the voltage across the actual amplifier input very small.
* The small input voltage requires very little current. As a result, **input impedance increases**.
* The increase is often approximately the product of gain and feedback.

**Current Feedback:**

* Return part of the **output current** to the input so that it opposes the input.
* The input voltage changes very little and remains almost constant.
* The input can then accept more current. As a result, **input impedance decreases**.

</div>

## 9. BJTs Compared with FETs

* Field-effect transistors (**FETs**) are very popular.
* Metal-oxide-semiconductor field-effect transistors (**MOSFETs**) dominate digital circuits and power switching.
* BJTs can perform better than FETs in some analog applications:
  * **Accuracy:** An example is the predictable relationship between <i>V<sub>BE</sub></i> and current.
  * **Low noise:** BJTs have low noise in some configurations.
  * **Higher transconductance:** At a specified current, a BJT has higher <i>g<sub>m</sub></i> than a MOSFET.
