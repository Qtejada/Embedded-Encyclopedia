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

  This relationship applies about when the transistor conducts. It applies in active mode and saturation. Otherwise, the transistor is in cutoff.

* More base current causes more collector current. Sufficient base drive makes the collector-emitter path operate like a short circuit. This condition is saturation.
* With no base current, the collector-emitter path operates like an open circuit. This condition is cutoff.

</div>

### Modes of Operation

<div className="definition-list">

**Active Mode**

Active mode happens when:

* <i>V<sub>B</sub></i> is about 0.7 V higher than <i>V<sub>E</sub></i>.
* <i>V<sub>C</sub> &gt; V<sub>B</sub></i>.

Biasing sets the transistor's current and voltage before a signal is applied. This resting condition is its **quiescent point (Q-point)**.

The circuit operates around the Q-point.

**Saturation**

Saturation happens when the base drive requests more collector current than the circuit can supply:

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

Cutoff happens when <i>V<sub>BE</sub></i> is not forward biased or <i>I<sub>B</sub> &asymp; 0</i>.

For an NPN transistor, ground the base or make <i>V<sub>E</sub> &gt; V<sub>B</sub></i> to get cutoff.

**What Cutoff Means:**

* Collector current does not flow. This statement ignores the small leakage current.
* The terminals are effectively separate. The collector-emitter path is an open circuit.
* The transistor operates like an **open switch**.

</div>

<div data-ltspice-placement="bjt-switch">

<details id="circuit-bjt-switch">
<summary>LTspice: BJT switch and base drive</summary>

<CircuitLibrarySimulation circuit="bjt-switch" />

</details>

</div>

## 2. Ebers-Moll (Exponential Behavior)

<div className="definition-list">

**Important Ebers-Moll Formula:**

* <i>I<sub>C</sub> = I<sub>S</sub> &times; exp(V<sub>BE</sub> / V<sub>T</sub>)</i>

  In this formula:

  * <i>I<sub>S</sub></i> is the saturation current. It is very temperature dependent.
  * <i>V<sub>T</sub> = kT/q</i> is the thermal voltage. It is about 25 mV at room temperature.

This formula shows the exponential relationship between **V<sub>BE</sub> and I<sub>C</sub>**. The familiar current-gain model is useful, but the device does not fundamentally set collector current by multiplying an independently fixed base current.

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

An external emitter resistor, <i>R<sub>E</sub></i>, supplies **[negative feedback](<../../03-Signal-Modulation/Amplifiers/01-op-amps.md#negative-feedback>)**:

* <i>I<sub>C</sub></i> increases &rarr; <i>I<sub>E</sub></i> increases &rarr; the voltage across <i>R<sub>E</sub></i> increases.
* <i>V<sub>E</sub></i> increases &rarr; <i>V<sub>BE</sub></i> decreases &rarr; <i>I<sub>C</sub></i> is pushed down.

<BJTFeedbackLoopDiagram />

This feedback helps prevent **thermal runaway**.

During thermal runaway, temperature increases collector current. The higher current increases power dissipation, which causes a further temperature increase.

**[Bypass Capacitor](<../01-Passives/02-Capacitors.md#bypass--decoupling>) Idea:**

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

**Dual-Supply Biasing and [Voltage-Divider](<../01-Passives/01-Resistors.md#3-voltage-divider-and-loading>) Biasing**

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
* You can calculate the circuit so that the base settles about 0.7 V above the emitter. This action keeps <i>I<sub>C</sub></i> about constant.
* Select the 10 k&Omega; resistor so that its current supplies the necessary base current for Q1.
* Matched transistors with the same <i>V<sub>BE</sub></i> operate similarly at the same bias.

For example, a collector voltage can put 0.8 V across a 10 k&Omega; resistor. This voltage sets base current.

In the current-gain model, this base current sets <i>I<sub>C</sub></i>. That collector current changes <i>V<sub>C</sub></i>, which changes the base drive again and closes the feedback loop.

</div>

**[KVL](<../../00-Foundations/00-Foundations.md#circuit-theorems-analysis-tools>) with BJTs**

Include the base-emitter voltage when calculating the bias. About 0.7 V is a useful first estimate.

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

<div data-ltspice-placement="common-emitter-amplifier">

<details id="circuit-common-emitter-amplifier">
<summary>LTspice: Common-emitter amplifier</summary>

<SpiceBatchSimulation circuit="common-emitter-amplifier" />

</details>

</div>

**Emitter Follower (Common Collector)**

The emitter follower has **high input impedance** and **low output impedance**.

This lets a source that cannot supply much current drive a load that needs more current, without the load pulling the source voltage down as much.

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
* The AC voltage at one resistor terminal moves with the output. Very little AC voltage then happens across the resistor.
* As a result, the effective AC resistance becomes very large.

<div data-ltspice-placement="emitter-follower">

<details id="circuit-emitter-follower">
<summary>LTspice: BJT emitter follower</summary>

<CircuitLibrarySimulation circuit="emitter-follower" />

</details>

</div>

**Unity Phase Splitter (Transconductance-Amplifier Idea)**

* In some topologies, the transistor operates as a **transconductance amplifier**.
* The small-signal current-to-voltage ratio is <i>g<sub>m</sub> = &Delta;I<sub>C</sub> / &Delta;V<sub>BE</sub> &asymp; 1 / r<sub>e</sub></i>.
* A base-current or base-voltage change causes a collector-current change.
* The collector-current change causes a collector-voltage change through <i>R<sub>C</sub></i>.
* Without <i>R<sub>E</sub></i>, the emitter connects directly to ground. The general 0.7 V model can be inaccurate for small-signal operation.
* Use the **Ebers-Moll model** and the small-signal parameters <i>g<sub>m</sub></i>, <i>r<sub>&pi;</sub></i>, and <i>r<sub>o</sub></i>.

**Differential Amplifiers and [CMRR](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#2-common-mode-rejection-ratio>)**

**[Differential Amplifier](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#3-four-resistor-op-amp-difference-amplifier>):**

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

Circuit transconductance answers a practical question: how much does the output current change when the input voltage changes?

For a BJT in the active region:

* <i>g<sub>m</sub> &asymp; I<sub>C</sub> / V<sub>T</sub></i>

</div>

<div data-ltspice-placement="common-base-amplifier">

<details id="circuit-common-base-amplifier">
<summary>LTspice: Common-base amplifier</summary>

<CircuitLibrarySimulation circuit="common-base-amplifier" />

</details>

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

The current stays fairly constant as the load changes, provided the transistor still has enough voltage across it to stay in active mode.

You can supply <i>V<sub>B</sub></i> with a voltage divider. Make the divider impedance much less than <i>&beta; &times; R<sub>E</sub></i>.

Changing <i>V<sub>B</sub></i> produces a **voltage-controlled current source**.

**Conceptual Resistive Current Source:**

* Apply a voltage through a very large [source resistance](<../../00-Foundations/00-Foundations.md#the-ideal-source-and-the-real-source>).
* If <i>R<sub>source</sub> &gt;&gt; R<sub>load</sub></i>, load-current change is small when the load changes.
* Resistive current sources waste power. BJTs can supply current with less power loss.

**Current Mirror**

* A **current mirror** receives an input current and supplies a copy of that current.
* You can use this circuit to replicate current into multiple loads.
* It has **high output impedance**. This impedance keeps output current almost constant when output voltage changes.

**Basic BJT Current-Mirror Example:**

* Q1 has its emitter at <i>+15 V</i>. Its base is about 14.4 V, depending on the circuit.
* Adjust the collector of Q1 to make its collector current the reference current. An example reference current is 1 mA.
* Connect the bases and emitters of Q1 and Q2 together. The transistors then have the same <i>V<sub>BE</sub></i>.
* If Q1 and Q2 are matched, Q2 conducts about the same collector current. It supplies about 1 mA to its load.

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

<div data-ltspice-placement="bjt-current-mirror">

<details id="circuit-bjt-current-mirror">
<summary>LTspice: NPN current mirror</summary>

<CurrentMirrorSimulation />

</details>

</div>

<div data-ltspice-placement="pnp-current-mirror">

<details id="circuit-pnp-current-mirror">
<summary>LTspice: PNP current mirror</summary>

<CircuitLibrarySimulation circuit="pnp-current-mirror" />

</details>

</div>

<div data-ltspice-placement="degenerated-current-mirror">

<details id="circuit-degenerated-current-mirror">
<summary>LTspice: Current mirror with emitter resistors</summary>

<CircuitLibrarySimulation circuit="degenerated-current-mirror" />

</details>

</div>

<div data-ltspice-placement="wilson-current-mirror">

<details id="circuit-wilson-current-mirror">
<summary>LTspice: Wilson current mirror</summary>

<CircuitLibrarySimulation circuit="wilson-current-mirror" />

</details>

</div>

<div data-ltspice-placement="cascode-current-mirror">

<details id="circuit-cascode-current-mirror">
<summary>LTspice: Cascode current mirror</summary>

<CircuitLibrarySimulation circuit="cascode-current-mirror" />

</details>

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
* The base-emitter voltage is about twice the normal value. It is about 1.2 V to 1.4 V.
* **Disadvantage:** The configuration operates **slowly**. Q1 must turn off Q2, and stored charge can be large.
* A resistor from the base of Q2 to its emitter can increase turn-off speed.

**[Push-Pull](<../../03-Signal-Modulation/Amplifiers/01-op-amps.md#complementary-push-pull-output>), Crossover Distortion, and Amplifier Classes**

**Push-Pull Output Stage:**

This stage gives an output swing near the full positive-to-negative supply range.

* **Positive half-cycle:** The NPN transistor, Q1, turns on. It supplies current to the load, such as a speaker.
* **Negative half-cycle:** The PNP transistor, Q2, turns on. Its base is about 0.7 V below its emitter.
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

* Near 0 V, **both transistors are off**. Each transistor needs about 0.7 V of <i>V<sub>BE</sub></i> to turn on.
* This dead zone causes crossover distortion in the output waveform.

**Correction for Crossover Distortion (Class AB):**

* Add diodes D1 and D2 between the bases. Keep the diodes forward biased.
* Each diode supplies about 0.6 V to 0.7 V.
* This voltage pre-biases the transistors. At least one transistor is always slightly on.
* This is a **Class AB amplifier** because both transistors conduct during a significant part of the cycle.
* **Trade-off:** The transistors dissipate more power at idle because they are always partially on.
* In this condition, the transistors operate like a type of voltage divider between the rails.

<div data-ltspice-placement="complementary-output-stage">

<details id="circuit-complementary-output-stage">
<summary>LTspice: Complementary output stage and class AB bias</summary>

<CircuitLibrarySimulation circuit="complementary-output-stage" />

</details>

</div>

**Class D Amplifiers:**

* These **switching amplifiers** drive the output with high-frequency pulses.
* Efficiency is very high because the transistors are usually fully on or fully off.
* High-frequency switching causes more electromagnetic-interference (**[EMI](<../../05-PCB-Layout/High-Speed.md#eye-diagrams-and-interference>)**) emissions and needs filtering.

</div>

<div data-ltspice-placement="bjt-cascode-amplifier">

<details id="circuit-bjt-cascode-amplifier">
<summary>LTspice: BJT cascode amplifier</summary>

<CircuitLibrarySimulation circuit="bjt-cascode-amplifier" />

</details>

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
* The small input voltage needs very little current. As a result, **input impedance increases**.
* The increase is often about the product of gain and feedback.

**Current Feedback:**

* Return part of the **output current** to the input so that it opposes the input.
* The input voltage changes very little and remains almost constant.
* The input can then accept more current. As a result, **input impedance decreases**.

</div>

<div data-ltspice-placement="emitter-degeneration">

<details id="circuit-emitter-degeneration">
<summary>LTspice: Emitter degeneration and current gain</summary>

<CircuitLibrarySimulation circuit="emitter-degeneration" />

</details>

</div>

<div data-ltspice-placement="discrete-feedback-amplifier">

<details id="circuit-discrete-feedback-amplifier">
<summary>LTspice: Discrete amplifier with negative feedback</summary>

<CircuitLibrarySimulation circuit="discrete-feedback-amplifier" />

</details>

</div>

## 9. BJTs Compared with FETs

* Field-effect transistors (**FETs**) are very popular.
* Metal-oxide-semiconductor field-effect transistors (**[MOSFETs](<./03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>)**) dominate digital circuits and power switching.
* BJTs can perform better than FETs in some analog applications:
  * **Accuracy:** An example is the predictable relationship between <i>V<sub>BE</sub></i> and current.
  * **Low noise:** BJTs have low noise in some configurations.
  * **Higher transconductance:** At a specified current, a BJT has higher <i>g<sub>m</sub></i> than a MOSFET.


## Output characteristic family

import TransistorCurves from '@site/src/components/learning/TransistorCurves';

<TransistorCurves kind="bjt" />

These illustrative curves show collector current versus collector-to-emitter voltage at three base currents. The active-region slopes represent finite output resistance.

The low-voltage knee marks the approach to saturation. This drawing does not model breakdown or specify a real transistor's current rating.


## Worked example: loaded small-signal gain

A small-signal model describes changes around a valid bias point. First establish the direct-current operating point and verify forward-active operation.

Assume collector current Ic = 1 mA, thermal voltage Vt = 25.9 mV, and current gain beta = 100. Ignore the Early effect for this example.

The transconductance is gm = Ic / Vt = 38.6 mS. The base-emitter resistance is rπ = beta / gm = 2.59 kΩ.

Assume a 2 kΩ collector resistor and a 2 kΩ load. Their parallel resistance is 1 kΩ.

With the emitter at signal ground, the gain from base voltage to collector voltage is about −gm × 1 kΩ = −38.6.

A source resistance changes the voltage that reaches the base. Assume 1 kΩ source resistance and a bias network with negligible additional loading.

The input divider gives 2.59 / (1 + 2.59) = 0.721. The gain from source voltage to output is about −27.9.

### Add emitter degeneration

Now assume a 100 Ω emitter resistor remains unbypassed at the signal frequency. Keep the same collector current for comparison by adjusting the bias network.

The resistance seen at the base becomes about rπ + (beta + 1) × Re = 12.69 kΩ. The collector load remains 1 kΩ.

The base-to-output gain becomes about −beta × 1 kΩ / 12.69 kΩ = −7.88. Including the source resistance gives about −7.30.

Degeneration reduces gain and increases input resistance. It also reduces sensitivity to transistor parameters within the model's valid range.

These estimates exclude finite output resistance and high-frequency capacitance. Coupling and bypass capacitors must have suitable impedance at the operating frequency.

Check output swing separately. A mathematically large gain does not prevent cutoff or saturation when the input amplitude increases.

The distinction between bias and signal changes also appears in [state-space linearization](<../../03-Signal-Modulation/State-Space.md#7-equilibrium-and-local-linearization>).


## LTspice example: a basic BJT current mirror

import CurrentMirrorSimulation from '@site/src/components/learning/CurrentMirrorSimulation';

This example expands the [current-mirror explanation](#6-current-sources-and-mirrors) with an NPN current sink. Its two emitters connect to ground.

The reference resistor feeds Q1's joined collector and base. Q2 shares the base voltage, so matched transistors produce similar collector currents.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-bjt-current-mirror>).

### What the curves show

The reference current supplies Q1's collector current and both base currents. Q2 therefore does not copy the complete reference current exactly.

With a 4.3 kΩ reference resistor, the simulated output current is about 0.9941 mA at 1 V. It rises to 1.0337 mA at 5 V.

This rise illustrates the **Early effect**. The transistor's collector current depends on collector voltage as well as base-emitter voltage.

At low output voltage, Q2 leaves forward-active operation. Its base-collector junction conducts, and the collector current can reverse near zero output voltage.

The plot retains this negative current. The test voltage source can absorb current that arrives through the base-collector junction.

### Model and verification

Both transistors use the same model: IS = 10 fA, BF = 100, and VAF = 100 V. The temperature is 27 °C.

IS sets the transport saturation-current scale. BF sets the ideal maximum forward current gain. VAF is the forward Early voltage.

This DC sweep shows how collector voltage affects the mirrored current.

The simulation passed connectivity, current-balance, and first-order calculation checks. A second run used half the voltage increment and tighter solver tolerances.

The download includes the numerical results and validation record. See the [LTspice reference](https://analogdevicesinc.github.io/ltspice-reference/ai_ref/LTSPICE-QUICKSTART.html) for schematic and simulation file types.


## LTspice example: common-emitter amplifier

import SpiceBatchSimulation from '@site/src/components/learning/SpiceBatchSimulation';

This circuit extends the [loaded small-signal gain example](#worked-example-loaded-small-signal-gain). A resistor divider sets the base bias from a 12 V supply.

The input is a 10 mV peak sine wave at 1 kHz. Coupling capacitors separate the signal source and load from the transistor's DC bias.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-common-emitter-amplifier>).

### Separate bias from signal gain

The emitter has a 100-ohm resistor in series with a 900-ohm resistor. Both resistors carry the DC emitter current.

The bypass capacitor connects across only the 900-ohm resistor. It changes the alternating-current path while the total DC emitter resistance stays at 1 kilohm.

With a 1 pF bypass, the capacitor has negligible effect at 1 kHz. The gain magnitude is about 3.00 V/V.

With a 100-microfarad bypass, the capacitor bypasses most of the 900-ohm resistance at 1 kHz. The gain magnitude increases to about 25.53 V/V.

The 100-ohm resistor remains in the signal path. This remaining [emitter degeneration](#add-emitter-degeneration) limits gain and reduces sensitivity to transistor parameters.

### Understand the intermediate case

The 1-microfarad capacitor does not provide a complete bypass at 1 kHz. Its impedance changes both gain and phase.

The simulated gain magnitude is about 14.35 V/V. The output phase is about −133.56 degrees relative to the input.

For the large capacitor, output phase is about −179.12 degrees. The result is close to the familiar inverted output of a common-emitter stage.

### Check the operating point

The mean collector voltage remains about 7.57 V for all three capacitor values. The transistor remains in its forward-active region throughout these runs.

A larger input can cause clipping, but these runs use a small signal. They isolate the effect of emitter bypass on gain and phase.

The embedded model includes finite current gain, output resistance, and junction capacitance.

The results table uses the final ten signal periods. The downloaded CSV preserves the original simulation samples and restores the simulator's time offset.


import CircuitLibrarySimulation from '@site/src/components/learning/CircuitLibrarySimulation';

## More LTspice circuits {#ltspice-circuits}

These examples show component behavior and reusable circuit blocks. Each example includes three parameter settings.

[Browse all LTspice circuits](/ltspice-circuits).

### BJT switch and base drive {#ltspice-bjt-switch}

A base resistor controls a transistor that switches a resistor load.

A high input drives base current and lowers the collector voltage. The load connects between the supply and collector.

Insufficient base current prevents a low collector voltage. The forced current gain is collector current divided by base current.

Compare all base resistors at the same load. A small resistor increases base current and drives the transistor farther into saturation.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-bjt-switch>).

### BJT emitter follower {#ltspice-emitter-follower}

The emitter follows the base voltage with a base to emitter voltage difference.

The collector connects to the supply. The emitter supplies current to the load.

The voltage gain is slightly below one. The transistor gives current gain, which reduces loading at the input.

The base to emitter voltage changes with current. It is not a fixed voltage drop for every load.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-emitter-follower>).

### Common-base amplifier {#ltspice-common-base-amplifier}

A signal enters the emitter while the base stays at a fixed voltage.

An increase in emitter voltage reduces base to emitter voltage and collector current. The collector voltage then increases.

The voltage gain is positive. The emitter presents a low input resistance, which can suit a low-impedance source.

The input source includes the emitter bias. The output capacitor removes the collector DC voltage from the load.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-common-base-amplifier>).

### Emitter degeneration and current gain {#ltspice-emitter-degeneration}

Two amplifier paths compare complete emitter bypass with partial emitter bypass.

Both paths use the same DC emitter resistance and bias network. The partially bypassed path retains 100 ohms in the signal path.

The stepped forward current gain changes the transistor parameters in both paths.

Emitter degeneration trades some signal gain for more predictable behavior. The emitter resistor gives feedback, making the gain and bias less sensitive to the transistor and bias network.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-emitter-degeneration>).

### PNP current mirror {#ltspice-pnp-current-mirror}

A PNP mirror supplies current from the positive rail into a load.

The reference resistor draws current from a diode-connected PNP transistor. Both transistor bases share this voltage.

The output transistor supplies current while its collector stays sufficiently below its emitter.

Collector current uses the SPICE sign convention. The plot reverses that sign to show supplied load current as positive.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-pnp-current-mirror>).

### Current mirror with emitter resistors {#ltspice-degenerated-current-mirror}

Equal emitter resistors add local feedback to the two mirror transistors.

A transistor with more current develops a larger emitter voltage. This reduces its base to emitter voltage and opposes the increase.

The resistors reduce sensitivity to transistor differences. They also consume voltage headroom.

The reference uses a current source so the resistor comparison does not change the commanded reference current.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-degenerated-current-mirror>).

### Wilson current mirror {#ltspice-wilson-current-mirror}

A third transistor feeds current back into the mirror base node.

The reference current enters the collector of Q2 and the base of Q3. Q3 supplies the diode-connected Q1 and the mirror base currents.

This feedback reduces base-current error and increases output resistance.

The additional transistor needs more output voltage than a basic two-transistor mirror. Examine the low-voltage portion of the sweep.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-wilson-current-mirror>).

### Cascode current mirror {#ltspice-cascode-current-mirror}

A second transistor above each mirror branch holds the lower collector voltage nearly constant.

The reference branch establishes two base voltage levels. The upper output transistor uses the higher level.

Changes in output voltage then cause less change at the lower transistor's collector. This reduces the current variation caused by the Early effect.

The stacked transistors need additional voltage headroom. High output resistance does not remove this requirement.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-cascode-current-mirror>).

### BJT cascode amplifier {#ltspice-bjt-cascode-amplifier}

A common-base transistor sits above a common-emitter transistor.

The upper base stays at 3 V. Its emitter holds the lower collector near a fixed voltage.

Keeping this collector voltage nearly fixed reduces the signal fed back through the lower transistor's collector junction capacitance. That limits the Miller effect.

The collector resistor converts current to output voltage. Both transistors still require suitable DC voltage headroom.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-bjt-cascode-amplifier>).

### Complementary output stage and class AB bias {#ltspice-complementary-output-stage}

An NPN and a PNP transistor supply opposite halves of the load current.

Without base bias, neither transistor conducts near zero input. This produces crossover distortion.

A voltage between the bases reduces the dead zone. More bias also increases quiescent current.

Emitter resistors limit current imbalance. A physical bias network must track temperature to control idle current.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-complementary-output-stage>).

### Transistor Schmitt trigger {#ltspice-transistor-schmitt-trigger}

Two transistors share an emitter resistor that creates positive feedback.

When Q1 takes more current, its collector voltage falls and Q2 takes less current.

The shared emitter voltage then changes in the direction that reinforces the transition.

The emitter resistor changes the separation between switching thresholds. Base current and transistor gain also affect the thresholds.

The low collector voltage includes the shared emitter voltage. A larger emitter resistor raises this low output level.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/comparators#circuit-transistor-schmitt-trigger>).

### Short pulse from an input step {#ltspice-short-pulse-generator}

A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse.

A rising input turns Q1 on and lowers its collector voltage. The capacitor transfers this falling edge to the base of Q2.

The base resistor then restores Q2 conduction as the capacitor charges. Resistance and capacitance set the approximate pulse duration.

This version needs an input step that lasts longer than the desired output pulse.

The coupling pulse drives the second base below ground. Check reverse base to emitter voltage when changing the supply.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/comparators#circuit-short-pulse-generator>).

### Transistor pulse extension {#ltspice-pulse-extension}

A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse.

A rising input turns Q1 on and lowers its collector voltage. The capacitor transfers this falling edge to the base of Q2.

The base resistor then restores Q2 conduction as the capacitor charges. Resistance and capacitance set the approximate pulse duration.

Q3 holds the first collector low after a short input pulse ends. It releases that node when Q2 returns to conduction.

The coupling pulse drives the second base below ground. Check reverse base to emitter voltage when changing the supply.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/comparators#circuit-pulse-extension>).

### Discrete amplifier with negative feedback {#ltspice-discrete-feedback-amplifier}

A differential pair, voltage-gain transistor, and emitter follower form a feedback amplifier.

Q1 and Q2 compare the input with a divided output voltage. Their shared current source fixes the available tail current.

Q3 adds voltage gain. Q4 supplies output current while its emitter follows the previous stage.

The output divider requests a gain of ten. The compensation capacitor controls high-frequency loop behavior.

Identify the input, gain, and output blocks before tracing the full feedback path. The AC sweep shows how small signals behave around the DC bias point.

[Open this circuit beside its topic](</docs/Discrete-Components/Semicondctors/BJTs#circuit-discrete-feedback-amplifier>).
