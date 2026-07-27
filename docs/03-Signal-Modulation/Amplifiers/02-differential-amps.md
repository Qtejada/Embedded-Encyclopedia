---
title: Differential Amplifiers
sidebar_label: Differential Amps
---

import DifferentialSignalExplorer from '@site/src/components/DifferentialSignalExplorer';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Differential Amplifiers

A **differential amplifier** responds to the voltage difference between two inputs.
It rejects voltage that is common to both inputs.

This function lets a circuit measure voltage between two points.
The measurement does not need either point to be at ground.

Applications include:

* Measuring voltage across a component.
* Measuring voltage between two integrated-circuit (**IC**) nodes.
* Rejecting interference on a balanced sensor cable.
* Measuring electrocardiogram (**ECG**) electrode signals.
* Converting a differential signal to a single-ended signal.
* Driving an analog-to-digital converter (**ADC**).

---

## 1. Differential and Common-Mode Signals

Two input voltages contain two types of information.

### Differential Voltage

The **differential voltage** is the difference between the inputs:

> **V<sub>d</sub> = V<sub>1</sub> - V<sub>2</sub>**

This is the wanted signal for a differential amplifier.

### Common-Mode Voltage

The **common-mode voltage** is the average input voltage:

> **V<sub>cm</sub> = (V<sub>1</sub> + V<sub>2</sub>) / 2**

This voltage is common to both inputs.
An ideal differential amplifier does not amplify it.

You can reconstruct the two input voltages from these quantities:

> **V<sub>1</sub> = V<sub>cm</sub> + V<sub>d</sub>/2**

> **V<sub>2</sub> = V<sub>cm</sub> - V<sub>d</sub>/2**

### Real-Amplifier Output

A real amplifier has **differential gain**, <i>A<sub>d</sub></i>, and a small **common-mode gain**, <i>A<sub>cm</sub></i>.

> **V<sub>out</sub> = A<sub>d</sub>V<sub>d</sub> + A<sub>cm</sub>V<sub>cm</sub>**

The second term is an error.
A good differential amplifier makes <i>A<sub>cm</sub></i> very small.

<DifferentialSignalExplorer />

---

## 2. Common-Mode Rejection Ratio

The **common-mode rejection ratio (CMRR)** compares differential gain with common-mode gain.

> **CMRR = A<sub>d</sub> / A<sub>cm</sub>**

Datasheets usually specify CMRR in decibels:

> **CMRR<sub>dB</sub> = 20 log<sub>10</sub>(A<sub>d</sub> / A<sub>cm</sub>)**

A high CMRR means that the amplifier rejects more common-mode voltage.

### Noise-Rejection Example

Assume that equal 60 Hz interference appears on both signal wires.
The interference can come from nearby power wiring.

* The wanted sensor signal is different at the two inputs.
* The 60 Hz interference is approximately equal at both inputs.
* The differential amplifier amplifies the wanted difference.
* A high CMRR decreases the common 60 Hz signal at the output.

An ECG system uses electrodes such as LL, LA, RL, and RA.
Differential electrode combinations produce lead I, lead II, lead III, and other leads.
High CMRR helps reject hum that appears on both measurement inputs.

### Precision Example

Assume that a circuit must amplify a millivolt signal on a 2.5 V common-mode voltage.

* **Common-mode voltage:** 2500 mV.
* **Maximum common-mode error:** &plusmn;0.01 mV.
* **Required rejection ratio:** 2500 mV / 0.01 mV = 250,000:1.
* **Required CMRR:** Approximately **108 dB**.

This example uses an error limit equal to 0.1% of a 10 mV full-scale input.

### CMRR Changes with Frequency

CMRR usually decreases as frequency increases.
A datasheet can show an excellent DC value and a lower value at 60 Hz or 1 kHz.

Check CMRR at the interference frequency.
For an ECG, also check it at respiration, pacing, or other applicable signal frequencies.

---

## 3. Four-Resistor Op-Amp Difference Amplifier

A four-resistor **difference amplifier** uses one op-amp.
Two resistor pairs set its gain and common-mode rejection.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/DifferentialAmplifierFigure4.9.png')}
    alt="Op-amp difference-amplifier circuits with matched resistor ratios and a reference input"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Difference-amplifier circuits. Image source: <i>The Art of Electronics</i>, Figure 4.9.
  </figcaption>
</figure>

### Resistor-Ratio Condition

The two resistor ratios must be equal:

> **R<sub>2</sub> / R<sub>1</sub> = R<sub>4</sub> / R<sub>3</sub>**

When both ratios equal <i>G</i>, the ideal relationship is:

> **V<sub>out</sub> = V<sub>ref</sub> + G(V<sub>2</sub> - V<sub>1</sub>)**

The sign depends on which signal connects to each input.

### Step-by-Step Operation

1. The non-inverting resistor network applies a fraction of <i>V<sub>2</sub></i> to the positive input.
2. Negative feedback makes the inverting input almost equal to the non-inverting input.
3. Input <i>V<sub>1</sub></i> produces current through its input resistor.
4. Almost none of this current enters the op-amp input.
5. The current flows through the feedback resistor.
6. The op-amp output moves until both input-node equations are satisfied.
7. Equal resistor ratios cancel the common part of <i>V<sub>1</sub></i> and <i>V<sub>2</sub></i>.
8. The remaining output is proportional to their difference.

### Reference Input

The reference input adds a DC output level.
It does not change the differential signal when the circuit operates correctly.

This function is useful when:

* A bipolar input must drive a unipolar ADC.
* The output must be centered on mid-supply.
* A later stage needs a specified common-mode level.

Drive the reference node from a sufficiently low impedance.
Reference impedance can change the resistor ratio and decrease CMRR.

### Gain and Input Impedance

The four-resistor topology frequently uses a low but accurate gain.
Other stages can supply more gain.

Its input impedance is set mainly by its input resistors.
The two source impedances can also become part of the resistor network.

Drive this topology from low-impedance sources when possible.
Use an instrumentation amplifier when the source cannot supply this current.

### Inputs Beyond the Supply Rails

The external input voltages can sometimes extend beyond the op-amp supply rails.
The resistor network attenuates these voltages before they reach the input pins.

This operation is permitted only when:

* Both op-amp pins stay inside the common-mode input range.
* Input current stays inside its limit.
* Resistor voltage and power ratings are sufficient.
* External voltages stay inside the difference-amplifier specifications.

Do not apply an out-of-range voltage directly to an op-amp input.

---

## 4. Why Resistor Matching Controls CMRR

Common-mode cancellation depends on resistor **ratios**, not only individual resistor values.

Assume that both inputs increase by 1 V.
An ideal network applies equal effects to the two op-amp inputs.
The output does not change.

If one ratio is different:

1. The common input change produces unequal input-node voltages.
2. The op-amp sees a small differential error.
3. Closed-loop gain amplifies this error.
4. Part of the common-mode signal appears at the output.

### Practical Matching Rules

* Use a matched resistor network for high CMRR.
* Select ratio tolerance, not only absolute resistance tolerance.
* Include resistor temperature-coefficient tracking.
* Keep the two source impedances matched.
* Include input-protection resistance in the ratio calculation.
* Keep PCB leakage and contamination small for high-value resistors.

Four separate 1% resistors do not make a precision difference amplifier.
A monolithic network can keep the ratios much closer over temperature.

---

## 5. Transistor Differential Pair

A transistor **differential pair** is the input stage inside many op-amps and comparators.
Two matched transistors share a fixed tail current.

### Current Steering

Assume that a tail current source sets the total emitter or source current.

1. Equal input voltages make the two devices share current approximately equally.
2. If input 1 increases, transistor 1 conducts more current.
3. The fixed tail current does not increase by the same amount.
4. Transistor 2 must conduct less current.
5. One collector or drain voltage moves down.
6. The other collector or drain voltage moves up.
7. The circuit produces a differential output from the input difference.

A common increase at both inputs ideally does not change the current split.
This is the physical basis of common-mode rejection.

### BJT Pair

For a BJT in the active region:

> **g<sub>m</sub> &asymp; I<sub>C</sub> / V<sub>T</sub>**

**Transconductance**, <i>g<sub>m</sub></i>, is the output-current change for an input-voltage change:

> **g<sub>m</sub> = &Delta;I / &Delta;V**

Collector resistors convert the two current changes to voltage changes.
A current-source tail improves common-mode rejection because it keeps total pair current nearly constant.

Device matching, tail-source output resistance, and collector-load matching limit CMRR.

---

## 6. JFET Differential Pair

JFET inputs give very high input impedance.
They are useful when source current must be very small.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/AoE6.png')}
    alt="JFET differential pairs with resistive and active loads"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    JFET differential amplifiers. Image source: <i>The Art of Electronics</i>, Figure 3.36.
  </figcaption>
</figure>

### Circuit A: Resistive Load

* A current sink sets the total current for the pair.
* If <i>V<sub>Q1</sub> &gt; V<sub>Q2</sub></i>, Q1 draws more current.
* Because total current is fixed, Q2 draws less current.
* Drain D1 moves down, and drain D2 moves up.
* The circuit amplifies the difference between the inputs.
* An equal 1 V increase at both ideal inputs causes no differential-output change.
* Low gain and part-to-part <i>g<sub>m</sub></i> variation are limitations.

### Circuit B: Active Load

The second circuit replaces drain resistors with BJT current mirror Q3 and Q4.
The mirror operates as a high-resistance active load.

> **A<sub>v</sub> &asymp; g<sub>m</sub>R<sub>load</sub>**

A larger load resistance gives more voltage gain.
The current mirror also converts the differential current to a single-ended output.

### JFET Pair with Feedback

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/AoE7.png')}
    alt="JFET differential amplifier with an op-amp feedback loop"
    className="invert-on-dark"
    style={{width: 'auto', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    JFET differential amplifier with feedback. Image source: <i>The Art of Electronics</i>, Figure 3.37.
  </figcaption>
</figure>

1. A 10 mA current sink sets the total pair current.
2. At <i>V<sub>in</sub> = 0 V</i>, Q1 and Q2 each conduct approximately 5 mA.
3. The initial differential output is 0 V.
4. An increase at the Q1 input makes Q1 conduct more current.
5. Q2 then conducts less current.
6. The circuit amplifies the current difference.
7. Negative feedback limits this difference to the selected gain.
8. Feedback also decreases sensitivity to <i>g<sub>m</sub></i> variation.

---

## 7. Instrumentation and Differential-Output Amplifiers

### Instrumentation Amplifier

An **instrumentation amplifier** receives a differential input and gives a single-ended output.
It is a specialized differential amplifier.

Important characteristics include:

* Buffered inputs with very high input impedance.
* Small source loading.
* User-selectable gain across a wide range.
* Very high CMRR.
* Accurate gain for small differential signals on large common-mode voltages.

Use an instrumentation amplifier when a four-resistor difference amplifier has insufficient input impedance or CMRR.

### Differential-Output Amplifier

A **differential-output amplifier** accepts a single-ended or differential input.
It gives two output signals with opposite polarity.

This topology frequently drives a differential ADC.
The ADC then receives the wanted differential signal and a controlled output common-mode voltage.

---

## 8. Error Sources and Operating Limits

### Input Common-Mode Range

The average input voltage must stay inside the amplifier common-mode input range.
A valid differential voltage does not make an invalid common-mode voltage safe.

Some rail-to-rail amplifiers change internal input stages near a supply rail.
Offset, noise, distortion, and CMRR can change during this transition.

### Differential Input Range

The difference between the inputs must stay inside its specified range.
Some bipolar inputs have protection diodes between the pins.
Large differential voltage can cause damaging input current.

### Input Offset Voltage

Input offset appears like a small unwanted differential signal.
Differential gain amplifies this error.

Include:

* Initial offset.
* Offset drift with temperature.
* Long-term drift.
* Offset change with common-mode voltage.

### Input Bias Current

Bias currents flow through source resistance.
Unequal voltage drops then make a differential error.

Match the resistance seen by both inputs when this method decreases error.
Use a FET-input or CMOS-input amplifier for very high source impedance.

### Output Swing

The calculated output must stay inside the amplifier output-voltage range.
A large common-mode error or excessive differential gain can cause saturation.

### Bandwidth and Slew Rate

Differential gain and CMRR decrease with frequency.
The output must also stay inside the slew-rate limit.

A high DC CMRR does not ensure good rejection of a fast common-mode signal.

### Noise

Include:

* Input-voltage noise.
* Input-current noise multiplied by source impedance.
* Resistor thermal noise.
* Reference-input noise.
* Common-mode noise that finite CMRR converts to output error.

---

## 9. Differential-Amplifier Analysis Procedure

Use this procedure for an unfamiliar differential circuit.

### Step 1: Identify the Inputs and Output

Mark <i>V<sub>1</sub></i>, <i>V<sub>2</sub></i>, the output node, and the reference node.
Confirm the polarity of the requested output difference.

### Step 2: Calculate the Input Components

Calculate:

> **V<sub>d</sub> = V<sub>1</sub> - V<sub>2</sub>**

> **V<sub>cm</sub> = (V<sub>1</sub> + V<sub>2</sub>) / 2**

### Step 3: Find the Differential Gain

For a four-resistor difference amplifier, check both resistor ratios.
For a transistor pair, find <i>g<sub>m</sub></i> and the effective load resistance.

### Step 4: Check Common-Mode Rejection

Use the minimum CMRR at the applicable frequency.
Convert it to a common-mode gain when you need an output-error value.

> **A<sub>cm</sub> = A<sub>d</sub> / 10<sup>(CMRR<sub>dB</sub>/20)</sup>**

### Step 5: Add the Reference Level

Include the reference-input voltage for a single-ended output.
Include output common-mode control for a differential output.

### Step 6: Check All Limits

Check:

* Input common-mode range.
* Differential input range.
* Output swing.
* Source impedance.
* Bias-current error.
* Offset and drift.
* Bandwidth and slew rate.
* Resistor-ratio tolerance.
* Noise.

### Step 7: Verify on the Bench

Apply equal signals to both inputs and measure the remaining output.
Repeat the test at each important interference frequency.
Then apply a known differential signal and verify gain and polarity.

:::tip Topology Selection
Use a **difference amplifier** for low-impedance sources and moderate gain.

Use an **instrumentation amplifier** for high source impedance, small signals, or very high CMRR.

Use a **differential-output amplifier** when the next stage needs a balanced signal.
:::
