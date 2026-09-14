---
title: Operational Amplifiers
sidebar_label: Op-Amps
---

import GainBandwidthGraph from '@site/src/components/GainBandwidthGraph';
import AdcDriverIsolation from '@site/src/components/AdcDriverIsolation';
import SarAdcInputModel from '@site/src/components/SarAdcInputModel';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Operational Amplifiers and Feedback Systems

## 1. Op-Amp Fundamentals

An **operational amplifier (op-amp)** takes the voltage difference between two inputs and amplifies it by a large amount. It can amplify steady DC voltages as well as changing signals; this is what **DC-coupled** means. Most op-amps produce one output voltage measured relative to the circuit reference, called a **single-ended output**.

An ideal op-amp amplifies the difference between its two input voltages:

> **V<sub>out</sub> = A<sub>OL</sub>(V<sub>+</sub> - V<sub>-</sub>)**

Without feedback, the **open-loop gain**, <i>A<sub>OL</sub></i>, is often greater than 100,000 at low frequencies. Even a tiny input difference can then drive the output to a limit. Feedback makes that large gain useful and controllable.

**Feedback** makes this large gain useful and controllable. The external resistors, capacitors, and diodes determine what the circuit does: it can add signals, integrate them, filter them, rectify them, or perform other operations.

### Key Characteristics

* **Active component:** An op-amp needs a power supply.
* **Feedback-dependent function:** External components usually set the closed-loop function.
* A capacitor in the feedback path can make an **integrator** or change the frequency response.
* A diode in the feedback path can make a nonlinear circuit, such as a **precision rectifier**.

### Ideal and Real Behavior

* **Ideal output:** The output is a perfect voltage source with 0 &Omega; output impedance.
  It keeps the necessary voltage for all load currents.
* **Real output:** The output has current, voltage, and power limits.
* **Ideal input:** The input impedance is infinite, and the input current is 0 A.
* **Real input:** Small bias currents flow.
  Their values can be in the &mu;A, nA, or pA range.
* **Ideal gain:** Open-loop voltage gain is infinite.
* **Real gain:** Open-loop gain is finite and falls as frequency rises.
* **Ideal common-mode gain:** The value is 0.
  The op-amp amplifies only the difference between the inputs.
* **Real common-mode gain:** A small common-mode error remains.
* **Ideal slew rate:** The output changes immediately.
* **Real slew rate:** The output voltage has a maximum rate of change.
* **Ideal noise:** The op-amp adds no noise.
* **Real noise:** Voltage noise and current noise limit small signals.
* **Ideal stability:** Temperature and supply voltage do not change the parameters.
* **Real stability:** Many parameters change with temperature, supply voltage, and time.

<div data-ltspice-placement="opamp-clipping">

<details id="circuit-opamp-clipping">
<summary>LTspice: Output clipping</summary>

<CircuitLibrarySimulation circuit="opamp-clipping" />

</details>

</div>

### The Golden Rules

These rules apply only while **negative feedback** is stable and the output stays within its voltage and current limits. They stop being useful when the amplifier clips or loses control of the output.

1. **Voltage rule:** The output moves to make <i>V<sub>+</sub></i> and <i>V<sub>-</sub></i> almost equal.
2. **Current rule:** The ideal input currents are 0 A.

In a real circuit, the input voltages are only almost equal. The op-amp still needs a small difference between them to produce its output voltage.

---

## 2. Basic Voltage-Amplifier Circuits

### Inverting Amplifier

The **inverting amplifier** applies the input through resistor <i>R<sub>1</sub></i>.
Its output is 180&deg; out of phase with the input.

* The input impedance is about <i>R<sub>1</sub></i>.
* A small <i>R<sub>1</sub></i> can give the circuit a low input impedance.
* The non-inverting input is at ground.
* Negative feedback keeps point A near ground.
  Point A is a **virtual ground**.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/InvertingAmplifierFigure4.7.png')}
    alt="Inverting op-amp circuit with input resistor R1 and feedback resistor R2"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Inverting amplifier. Image source: <i>The Art of Electronics</i>, Figure 4.7.
  </figcaption>
</figure>

#### Step-by-Step Derivation

1. The non-inverting input is at ground.
2. Negative feedback keeps point A at about 0 V.
3. As a result, the voltage across <i>R<sub>1</sub></i> is about <i>V<sub>in</sub></i>.
4. The op-amp input takes almost no current.
5. As a result, current through <i>R<sub>1</sub></i> must flow through <i>R<sub>2</sub></i>.
6. The feedback-current direction gives the output a negative polarity.

> **V<sub>in</sub> / R<sub>1</sub> = -V<sub>out</sub> / R<sub>2</sub>**

The result is:

> **Gain = V<sub>out</sub> / V<sub>in</sub> = -R<sub>2</sub> / R<sub>1</sub>**

### Summing Amplifier

A **summing amplifier** connects two or more input resistors to the inverting summing node.
The feedback resistor converts the sum of the input currents to one output voltage.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SummingAmpliferFigure4.24.png')}
    alt="Summing amplifier with three input resistors and one feedback resistor"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Summing-amplifier configuration. Image source: <i>The Art of Electronics</i>, Figure 4.24.
  </figcaption>
</figure>

Each input resistor turns its input voltage into a current. Almost none enters the op-amp, so the currents add at the summing node and flow through the feedback resistor.

<div data-ltspice-placement="opamp-summing">

<details id="circuit-opamp-summing">
<summary>LTspice: Summing amplifier</summary>

<CircuitLibrarySimulation circuit="opamp-summing" />

</details>

</div>

### Non-Inverting Amplifier

The **non-inverting amplifier** applies <i>V<sub>in</sub></i> to the non-inverting input.
A feedback divider connects the output to the inverting input.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/Non-InvertingAmplifierFigure4.6.png')}
    alt="Non-inverting op-amp circuit with a resistive feedback divider"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Non-inverting amplifier. Image source: <i>The Art of Electronics</i>, Figure 4.6.
  </figcaption>
</figure>

#### Step-by-Step Operation

1. Negative feedback makes point A about equal to <i>V<sub>in</sub></i>.
2. If <i>V<sub>in</sub></i> increases, the output increases.
3. The divider applies a fraction of the output to point A.
4. A larger feedback ratio needs less output voltage for the same point-A voltage.
5. A smaller feedback ratio needs more output voltage.
6. The [resistor divider](<../../01-Discrete-Components/01-Passives/01-Resistors.md#3-voltage-divider-and-loading>) attenuates the output before it reaches the inverting input.

For the usual resistor arrangement:

> **Gain = 1 + R<sub>2</sub> / R<sub>1</sub>**

The circuit keeps the output in phase with the input.

<div data-ltspice-placement="opamp-gain-configurations">

<details id="circuit-opamp-gain-configurations">
<summary>LTspice: Inverting and noninverting amplifiers</summary>

<CircuitLibrarySimulation circuit="opamp-gain-configurations" />

</details>

</div>

### Adjustable Inverter or Follower

The next circuits use switches to select inverting or unity-gain operation.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/AdjustableInvertersFigure4.20.png')}
    alt="Switched op-amp circuits that select inverting or unity-gain operation"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Adjustable inverter and follower circuits. Image source: <i>The Art of Electronics</i>, Figure 4.20.
  </figcaption>
</figure>

### Voltage Follower

A **voltage follower**, or **buffer**, connects the output directly to the inverting input. It is the limiting case of a non-inverting amplifier with the feedback resistor replaced by a wire and the resistor to ground removed.

* **Gain:** 1.
* **Relationship:** <i>V<sub>out</sub> = V<sub>in</sub></i>.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/op-ampFollowerFigure4.8.png')}
    alt="Unity-gain voltage follower made with an op-amp"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Op-amp voltage follower. Image source: <i>The Art of Electronics</i>, Figure 4.8.
  </figcaption>
</figure>

The follower has no voltage gain, but it can have large **power gain**.

1. **High input impedance:** It takes almost no current from a weak source.
2. **Low output impedance:** It can supply more current to the load.
3. **Result:** It isolates a sensitive source from a demanding load.

---

<div data-ltspice-placement="opamp-buffer-loading">

<details id="circuit-opamp-buffer-loading">
<summary>LTspice: Buffer and source loading</summary>

<CircuitLibrarySimulation circuit="opamp-buffer-loading" />

</details>

</div>

## 3. Negative-Feedback Theory

**Feedback** returns part of an output voltage or current to the amplifier input.
The returned signal changes the input error.

### Mixing Methods

#### Series Mixing

**Series mixing** subtracts a feedback voltage from the source voltage.

* The source, feedback element, and amplifier input are in one series loop.
* The circuit produces a voltage-error signal.

> **V<sub>error</sub> = V<sub>source</sub> - V<sub>feedback</sub>**

#### Shunt Mixing

**Shunt mixing** connects the feedback path in parallel with the input source.

* Source current, feedback current, and amplifier input current meet at one node.
* The circuit produces a current-error signal.

> **I<sub>error</sub> = I<sub>source</sub> - I<sub>feedback</sub>**

### Negative Feedback

**Negative feedback** opposes a change in the output.
It is also called **degenerative feedback**.

If the output moves away from its target, the returned signal changes the input error in the direction that pushes it back. This is how the loop corrects an unwanted output change.

### Feedback-Correction Cycle

This example uses the non-inverting amplifier from Figure 4.6.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/Non-InvertingAmplifierFigure4.6.png')}
    alt="Non-inverting amplifier used to explain the feedback-correction cycle"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Feedback example. Image source: <i>The Art of Electronics</i>, Figure 4.6.
  </figcaption>
</figure>

The example has these initial conditions:

* **Input:** <i>V<sub>in</sub> = 2 V</i>.
* **Feedback factor:** The divider returns 50% of the output.
* **Target output:** 4 V.
* **Initial feedback voltage:** 2 V.
* **Open-loop gain:** 100,000.

#### Step 1: Steady State

The non-inverting input is fixed at 2.00000 V.
The divider gives this relationship:

> **V<sub>-</sub> = 0.5V<sub>out</sub>**

The op-amp drives the output to about 4 V.
This makes the feedback voltage about 2 V.

#### Step 2: Error Creation

Assume that a load change moves the output from 4.0 V to 4.1 V.
The divider then moves <i>V<sub>-</sub></i> to 2.05 V.

> **V<sub>error</sub> = V<sub>+</sub> - V<sub>-</sub>**

> **V<sub>error</sub> = 2.00 V - 2.05 V = -0.05 V**

#### Step 3: Op-Amp Reaction

The op-amp multiplies the negative error by its large open-loop gain.
The ideal linear equation requests -5,000 V.

> **-0.05 V &times; 100,000 = -5,000 V**

The op-amp cannot produce -5,000 V. That calculated value simply shows that the error strongly calls for a lower output. The internal circuit drives downward as fast and as far as its limits allow.

#### Step 4: Correction

As the output falls from 4.1 V toward 4.0 V, the feedback voltage returns toward 2.0 V. The input difference gets smaller, so the correcting drive becomes smaller too.

#### Step 5: Equilibrium

In the simple real-amplifier model with finite gain, a small input difference remains. If that difference were exactly 0 V, the open-loop equation would give 0 V output.

The final values in the original example are:

* **Output:** 4.0 V.
* **Non-inverting input:** 2.00000 V.
* **Inverting input:** 1.99996 V.
* **Residual error:** 40 &mu;V.

> **V<sub>out</sub> = 0.00004 V &times; 100,000 = 4 V**

The remaining error is just large enough, after amplification, to hold the required output voltage.

### Closed-Loop Gain Stability

Let:

* <i>A</i> be the open-loop amplifier gain.
* <i>&beta;</i> be the feedback factor.
* <i>A<sub>CL</sub></i> be the closed-loop gain.

> **A<sub>CL</sub> = A / (1 + A&beta;)**

Assume that <i>A = 100,000</i> and <i>&beta; = 0.1</i>.
The product <i>A&beta;</i> is much larger than 1.

The equation then becomes about:

> **A<sub>CL</sub> &asymp; A / A&beta; = 1 / &beta;**

This makes the closed-loop gain depend mainly on accurate external components. Changes in the op-amp's internal gain then have much less effect on the result.

### Other Feedback Improvements

Negative feedback can also:

* Decrease distortion.
* Decrease some internally generated errors.
* Increase bandwidth.
* Decrease sensitivity to component and temperature changes.
* Change input and output impedances.

If a heavy load pulls a voltage amplifier's output down, feedback detects the drop and makes the amplifier drive harder. The output therefore changes less with load current, which is what lower closed-loop output impedance means.

The feedback path returns a signal from output to input.
Source and load impedances can still change the loop, depending on the feedback topology.

### Circuit-Analysis Procedure

Use this procedure when an unfamiliar circuit contains op-amps, resistors, and transistors.
It is especially useful for current-source circuits.

#### Step 1: Find the Feedback Path

Trace the path from the op-amp output.
Determine whether it returns to the inverting input.

* **Yes:** The circuit can be a linear amplifier or regulator.
* **No, or it returns to the non-inverting input:** Check for a [comparator](<./comparators.md#1-comparator-decision>), [Schmitt trigger](<./comparators.md#6-schmitt-trigger-and-hysteresis>), or oscillator.

Do not use the linear golden rules before you confirm stable negative feedback.

#### Step 2: Find the Command

Examine the non-inverting input.
Its voltage is usually the target for the inverting input.

* A fixed reference usually commands a static DC value.
* A variable input usually commands a changing output.

#### Step 3: Find the Sense Resistor

Examine the inverting input.
For a current source, it often monitors a resistor connected to ground or a supply rail.

The feedback loop controls the resistor voltage.
This action controls the resistor current.

> **I<sub>locked</sub> = V<sub>command</sub> / R<sub>sense</sub>**

#### Step 4: Find the Actuator

Examine the op-amp output connection.

* A direct feedback connection usually indicates a basic op-amp circuit.
* A transistor base or gate indicates an external current or voltage actuator.
* A direct load connection means that the op-amp drives the load.

---

## 4. Bandwidth and Dynamic Limits

### Bandwidth

**Bandwidth** is the frequency range in which an amplifier keeps its specified gain.
Gain decreases when internal devices cannot respond sufficiently quickly.

A real voltage-feedback op-amp usually behaves like a low-pass amplifier in open loop: it has very high gain at DC, with progressively less gain available as frequency rises.

### Gain-Bandwidth Trade

The original example uses these approximate values:

* **Open loop:** Gain can be 100,000 up to 10 Hz.
* At 10 kHz, available gain can decrease to 100.
* **Closed loop:** Feedback sets the required gain to 10.
* At 10 Hz, the circuit does not use most of the available gain.
* At 10 kHz, a gain of 100 still supports the required gain of 10.
* Near 100 kHz, available open-loop gain can decrease below 10.

As a result, a lower closed-loop gain gives a wider closed-loop bandwidth.
The design trades gain for bandwidth.

<GainBandwidthGraph />

<div data-ltspice-placement="opamp-gain-bandwidth">

<details id="circuit-opamp-gain-bandwidth">
<summary>LTspice: Closed-loop gain and bandwidth</summary>

<CircuitLibrarySimulation circuit="opamp-gain-bandwidth" />

</details>

</div>

### Slew Rate

**Slew rate** is the maximum output-voltage change for each unit of time.
Datasheets usually specify it in V/&mu;s.

Slew rate can depend on the internal compensation circuit. If a signal is both large and fast, the required voltage change may exceed this limit. The output then develops straight ramps and looks more triangular than sinusoidal.

<div data-ltspice-placement="opamp-slew-rate">

<details id="circuit-opamp-slew-rate">
<summary>LTspice: Slew-rate limiting</summary>

<CircuitLibrarySimulation circuit="opamp-slew-rate" />

</details>

</div>

### Capacitive Loading

The load capacitance and op-amp output impedance form an additional time-dependent response, represented by a pole. This adds phase lag to the loop, so the correction arrives later relative to the signal.

If that lag approaches 180&deg; while loop gain is still greater than 1, feedback can reinforce a disturbance instead of correcting it, allowing oscillation.

#### Methods That Can Improve Stability

1. **Isolation resistor:** Add a series output resistor, such as 50 &Omega;.
   The resistor separates the op-amp output from the load capacitance.
2. **Feedback point:** Feedback before the resistor protects stability.
   Feedback after the resistor corrects its voltage drop but can decrease stability.
3. **Closed-loop gain:** Use the gain range that the datasheet specifies.
   Some op-amps are not stable at unity gain.
4. **Datasheet check:** Some devices are stable only within specified load-capacitance ranges.
   One example specification can require <i>C<sub>load</sub> &gt; 1 &mu;F</i>.
5. **In-loop buffer:** A buffer can drive the capacitive load inside the main feedback loop.
   Its phase shift then becomes part of the loop.
6. **Buffer bandwidth:** The buffer usually needs more bandwidth than the main op-amp.

<div data-ltspice-placement="capacitive-load-compensation">

<details id="circuit-capacitive-load-compensation">
<summary>LTspice: Capacitive load and isolation resistor</summary>

<CircuitLibrarySimulation circuit="capacitive-load-compensation" />

</details>

</div>

### Finite Loop-Gain Effects

Closed-loop gain cannot stay accurate after available open-loop gain becomes insufficient.
As a result, gain starts to decrease near the closed-loop bandwidth.

Voltage feedback lowers output impedance by about <i>1 + A&beta;</i>. As open-loop gain falls with frequency, the loop has less ability to correct voltage drop, so closed-loop output impedance usually rises.

This frequency-dependent output impedance can behave like an inductance. Adding a capacitive load can then create a resonance, causing peaking or ringing.

Some current-feedback topologies use feedback to increase output impedance.
Always analyze the relevant feedback type.

---

## 5. Frequency Compensation and Stability

**Frequency compensation** prevents oscillation in a negative-feedback system.
Phase shift can make negative feedback become positive at high frequencies.

### Phase Shift and Loop Gain

* Gain decreases as frequency approaches the stopband.
* Each important pole can increase the response slope.
* Each pole also adds phase lag.
* Oscillation can occur near 180&deg; total phase shift.
* The critical point is where loop gain equals 1.

The total phase shift includes the op-amp and the feedback network.

### Phase Margin

**Phase margin** is the remaining phase before the loop reaches 180&deg; at unity loop gain.
The unity-loop-gain point is the **crossover frequency**.

A one-pole response can approach -90&deg; phase shift.
This condition gives about 90&deg; of phase margin.
Real amplifiers have more poles and smaller margins.

### Rate-of-Closure Method

The **rate-of-closure method** compares the slopes of the open-loop gain and noise-gain curves near where they meet. Noise gain is the closed-loop gain seen by a small voltage error at the op-amp input; it can differ from the signal gain. The slope difference gives a useful clue about stability.

An RC corner frequency is:

> **f = 1 / (2&pi;RC)**

### Poles

A first-order **pole** makes the gain slope fall by 20 dB each time frequency increases by a factor of ten, written -20 dB/decade. Its phase lag approaches -90&deg;, which can reduce phase margin.

Examples that can add poles include:

* A capacitor from the output to ground.
* Input or source capacitance with resistance.
* A capacitor in series with a signal path.
* Internal amplifier stages.

The exact effect depends on the complete loop.

### Zeros

A left-half-plane **zero** adds +20 dB/decade to the gain slope and can add up to +90&deg; of phase lead. Placed correctly, it can counter some lag and improve stability.

A resistor and capacitor in the feedback network can create a zero. Be clear about whether you are looking at signal gain or feedback: the same components can appear differently in those expressions. Loop gain is the quantity to check for stability.

### Phase-Margin Targets

* An intersection near a new pole can give about 45&deg; phase margin.
  This gives more bandwidth but more overshoot.
* Moving the crossover below the added pole can give about 60&deg; phase margin.
  This is a common robust target.

These values are approximations.
The complete pole and zero locations set the actual margin.

### Transient-Response Check

**Transient response** shows the output response to a step or square-wave input.
Lower phase margin usually causes more overshoot and ringing.
Very low margin causes sustained oscillation.

### Dominant-Pole Compensation

A **dominant pole** starts reducing open-loop gain well before the higher-frequency poles have a large effect. This helps loop gain fall to unity before the total phase lag gets close to 180&deg;.

Without sufficient compensation:

* The response can first decrease at 20 dB/decade.
* A second pole can change the slope to 40 dB/decade.
* Phase shift can approach 180&deg; while loop gain remains greater than 1.
* The circuit can oscillate.

With dominant-pole compensation:

* The first roll-off starts at a lower frequency.
* The phase remains nearer -90&deg; through much of the useful loop-gain range.
* The circuit trades open-loop gain and bandwidth for stability.

Do not add an arbitrary load capacitor to make this compensation.
Use the datasheet or a calculated compensation network.
Some op-amps include internal dominant-pole compensation.

The original notes propose sufficient load capacitance to move the unity-gain point near the first corner frequency.
This method can destabilize many op-amps.
Use it only when the datasheet explicitly permits that capacitive load.

High closed-loop gain gives lower loop gain.
As a result, some non-unity-gain circuits cross unity before higher poles cause excessive phase shift.

Useful related topics include:

* **Lead compensation:** Adds phase lead to counter phase lag.
* **Lag compensation:** Decreases high-frequency gain.
* **Bode plots:** Show gain and phase as functions of frequency.

---

## 6. Capacitors and Frequency-Selective Circuits

### Capacitor Across the Feedback Resistor

A capacitor across <i>R<sub>f</sub></i> can have three principal functions.

#### Stability Compensation

A [photodiode](<../../04-Digital-Interfaces/DigitalGeneral.md#iii-detectors>) or other sensor brings capacitance to the input. That capacitance affects the feedback response and can add enough phase lag to cause oscillation.

A small capacitor across <i>R<sub>f</sub></i>, such as 10 pF in a suitable circuit, changes the noise-gain curve. A calculated value can restore phase margin, but also limits high-frequency bandwidth.

The capacitor does not make feedback instantaneous. Its impedance falls with frequency, providing a controlled path for high-frequency feedback.

#### Noise Filter

A capacitor has high impedance at low frequencies and low impedance at high frequencies.
As a result, it decreases the feedback impedance at high frequencies.

* At low frequencies, <i>R<sub>f</sub></i> mainly sets the gain.
* At high frequencies, the capacitor decreases the feedback impedance.
* The closed-loop gain then decreases.

This action makes an active low-pass response.
It can prevent amplification of radio interference and high-frequency noise.

#### Practical Integrator

An ideal **integrator** uses only a capacitor in the feedback path. At DC that capacitor is effectively open, leaving no DC negative feedback to hold the output in range.

Small input offsets and bias currents can then keep charging the capacitor until the output saturates. A large parallel resistor gives a DC feedback path, limits DC gain, and reduces this drift toward saturation.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/integratorFigure4.16.png')}
    alt="Ideal op-amp integrator with an input resistor and capacitor-only feedback"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Ideal capacitor-only feedback integrator. The parallel DC-feedback resistor described above is not shown. Image source: <i>The Art of Electronics</i>, Figure 4.16.
  </figcaption>
</figure>

<div data-ltspice-placement="opamp-integrator">

<details id="circuit-opamp-integrator">
<summary>LTspice: Practical integrator</summary>

<CircuitLibrarySimulation circuit="opamp-integrator" />

</details>

</div>

#### Component Clues

* A very small capacitor in the pF range often controls stability.
* A capacitor in the nF range can make a low-pass filter.
* A very large parallel resistor in the M&Omega; range can limit integrator DC gain.

These are clues, not fixed rules.
Calculate the pole, zero, noise gain, and required bandwidth.

#### Integrator Example

For a constant input:

> **Output slope = -V<sub>in</sub> / RC**

Assume that <i>V<sub>in</sub> = 1 V</i>, <i>R = 1 M&Omega;</i>, and <i>C = 1 &mu;F</i>.
The output decreases at 1 V/s.

A switch can short the capacitor and reset the integrator.
The practical parallel resistor supplies DC feedback when the switch is open.

### AC-Coupled Amplifier

The archived figure contains two AC-amplifier examples.

* **Circuit 1:** A high-pass network drives a non-inverting amplifier.
  The capacitor blocks DC, and the circuit amplifies AC signals.
* **Circuit 2:** DC gain becomes 1 because the capacitor blocks the resistor path.
* At DC, the gain expression approaches <i>1 + R<sub>2</sub>/&infin; = 1</i>.
* At higher frequencies, the capacitor passes the signal.
  The circuit then has its usual AC gain.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/AcAmplifierFigure4.7.png')}
    alt="AC-coupled non-inverting op-amp circuits"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    AC-amplifier circuits. Image source: <i>The Art of Electronics</i>.
  </figcaption>
</figure>

### Sallen-Key Low-Pass Filter

A first-order passive RC filter has a gradual transition between its passband and stopband.
A **[Sallen-Key](<../Filters/Active-filters.md#10-sallen-key-second-order-low-pass-filter>) filter** can make a second-order response.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SallenKeyLowPassFigure4.42.png')}
    alt="Second-order Sallen-Key low-pass filter"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Sallen-Key low-pass filter. Image source: <i>The Art of Electronics</i>, Figure 4.42.
  </figcaption>
</figure>

#### Second-Order Operation

* The circuit is a second-order low-pass filter.
* Capacitor C1 connects to the output and has a bootstrap effect.
* At high frequencies, low-pass action makes the output small.
  C1 then acts about as a capacitor to ground.
* At low frequencies, the output follows the input.
  The voltage across C1 is then small.
* As a result, C1 has less effect in the low-frequency passband.
* Component ratios and amplifier gain set the **Q factor** near cutoff.

#### Filter Order and Roll-Off

* **First-order passive RC:** The final slope is 20 dB/decade, or 6 dB/octave.
* **Second-order Sallen-Key:** The final slope is 40 dB/decade, or 12 dB/octave.

A Sallen-Key filter can transition more sharply than one passive RC section. Its Q describes how strongly it tends to resonate, while damping describes how quickly that behavior dies away. These determine passband flatness and any peak near cutoff.

---

## 7. Transimpedance Amplifier

A **transimpedance amplifier** converts input current to output voltage.
A photodiode is a common current source for this circuit.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/PhotodiodeAmplifierFigure4.22.png')}
    alt="Photodiode transimpedance amplifier with feedback resistor"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Photodiode transimpedance amplifier. Image source: <i>The Art of Electronics</i>, Figure 4.22.
  </figcaption>
</figure>

### Step-by-Step Operation

1. The non-inverting input is grounded.
2. Negative feedback keeps the inverting input near 0 V.
   This node is a **virtual ground**.
3. The op-amp input takes almost no current.
4. As a result, almost all photodiode current flows through <i>R<sub>f</sub></i>.
5. The output supplies the voltage across <i>R<sub>f</sub></i>.
6. The current direction sets the output polarity.

For the usual photodiode-current direction:

> **V<sub>out</sub> = -I<sub>d</sub>R<sub>f</sub>**

### Why the Op-Amp Is Necessary

1. **Photodiode capacitance:** A photodiode has junction capacitance.
   A direct resistor connection makes an [RC time constant](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#4-rc-time-constants>) and decreases bandwidth.
2. **Voltage across the diode:** A changing diode voltage charges and discharges the capacitance.
3. **Virtual ground:** The op-amp keeps the summing node almost constant.
   As a result, signal voltage does not move the diode capacitance as much.
4. **Bandwidth:** Less capacitance charging can give a faster response.
5. **Output impedance:** The op-amp gives the next stage a low-impedance voltage output.

### Stability Correction

Photodiode capacitance adds phase delay to the loop.
This delay can cause peaking or oscillation.
A small capacitor in parallel with <i>R<sub>f</sub></i> can supply the necessary compensation.

Calculate this capacitor from photodiode capacitance, input capacitance, feedback resistance, and op-amp gain bandwidth.

---

<div data-ltspice-placement="transimpedance-amplifier">

<details id="circuit-transimpedance-amplifier">
<summary>LTspice: Transimpedance amplifier</summary>

<CircuitLibrarySimulation circuit="transimpedance-amplifier" />

</details>

</div>

## 8. Output-Current Boosters

### Single-Ended Emitter-Follower Booster

Figure 4.25 uses an external NPN bipolar junction transistor (**BJT**) to increase output-current capability.
The transistor operates as an [emitter follower](<../../01-Discrete-Components/03-Semicondctors/02-BJTs.md#5-amplifier-configurations>).

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/EmitterFollowerFigure4.25.png')}
    alt="Op-amp with an NPN emitter-follower output-current booster"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Single-ended emitter-follower booster. Image source: <i>The Art of Electronics</i>, Figure 4.25.
  </figcaption>
</figure>

The op-amp supplies the transistor base current.
The transistor then supplies a larger emitter current to the load.

#### Feedback-Loop Example

1. The resistor network sets a gain near 10: <i>1 + 10 k&Omega;/1.1 k&Omega;</i>.
2. A 2 V input requests about 20 V at the load.
3. The NPN base-emitter junction needs about 0.7 V.
4. The op-amp output moves to about 20.7 V.
5. The emitter output becomes about 20 V.
6. The divider returns about 2 V to the inverting input.
7. The two op-amp inputs are then almost equal.

Because feedback is taken after the transistor, it also corrects the transistor's roughly 0.7 V base-emitter drop and the way that drop changes with current and temperature.

#### Source-and-Sink Limitation

The Figure 4.25 circuit has one NPN output transistor.

* **Source current:** The NPN can supply current to a grounded or negative-return load.
* **Sink current:** The NPN cannot actively take current from the load.
* The transistor turns off when the load forces current into the output.
* Use this circuit only when its one-direction current capability is sufficient.

### Complementary Push-Pull Output

A complementary **push-pull stage** uses an NPN transistor and a PNP transistor.
One transistor sources current.
The other transistor sinks current.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/PushPullFigure4.26.png')}
    alt="Op-amp with a complementary NPN and PNP push-pull output stage"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Complementary push-pull booster. Image source: <i>The Art of Electronics</i>, Figure 4.26.
  </figcaption>
</figure>

#### Crossover Distortion

A basic push-pull stage has a dead zone near 0 V.
The NPN needs about +0.7 V base-emitter voltage.
The PNP needs about -0.7 V.

To hand over between transistors, the op-amp output must cross about 1.4 V. Its finite slew rate makes this take time, leaving a brief error where the load output does not follow the input. This is **crossover distortion**.

#### Feedback Correction

Assume that the input moves from 0 V to +0.1 V.

1. Both transistors are initially off near the zero crossing.
2. The load output remains near 0 V.
3. The op-amp detects a +0.1 V difference between input and feedback.
4. Large open-loop gain drives the op-amp output toward about +0.8 V.
5. The NPN turns on.
6. Its emitter moves toward +0.1 V.
7. The feedback voltage then becomes almost equal to the input.

This correction is not instantaneous.
Available loop gain, bandwidth, and slew rate set the remaining crossover error.

### Detailed Closed-Loop Linearization

#### Circuit Goal

The op-amp operates as a unity-gain non-inverting follower.
It drives a push-pull stage and a 10 &Omega; load.

The target is a clean copy of the input sine wave across the load.
The transistor dead zone is the nonlinear element.

#### Incorrect Feedback Point

Assume that feedback comes from the op-amp output pin.

* The op-amp output follows the input.
* The load output is after the transistor base-emitter drops.
* The load voltage stalls while the input passes through the about &plusmn;0.7 V dead zone.
* The feedback loop cannot detect distortion after its feedback point.

#### Correct Feedback Point

Now take feedback from the final load output.

* The op-amp controls the voltage that is important to the load.
* It detects output lag during the zero crossing.
* It moves its output rapidly across the transistor dead zone.
* The op-amp output waveform contains sharp correction movements.
* The final load waveform is much more linear.

Feedback makes the op-amp's internal drive waveform compensate for the transistor nonlinearity, leaving a cleaner waveform at the load. Bandwidth and slew-rate limits prevent perfect correction at every frequency.

---

## 9. Op-Amp Current Sources

### Basic Current Source

The basic circuit uses feedback to control the voltage across a [sense resistor](<../../02-Power/Measurment/Current-sense.md#1-convert-current-to-voltage>).

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/BasicCurrentSourceFigure4.10.png')}
    alt="Basic op-amp current source controlled by an input voltage and sense resistor"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Basic op-amp current source. Image source: <i>The Art of Electronics</i>, Figure 4.10.
  </figcaption>
</figure>

#### Step-by-Step Operation

1. <i>V<sub>in</sub></i> is the command voltage.
2. Feedback makes the inverting-input voltage almost equal to <i>V<sub>in</sub></i>.
3. The sense resistor then has <i>V<sub>in</sub></i> across it.
4. As a result, its current is <i>V<sub>in</sub>/R</i>.
5. Load changes initially change the sensed voltage.
6. The op-amp changes its output to restore the commanded current.

> **I = V<sub>in</sub> / R**

The circuit resembles a non-inverting amplifier.
The controlled output quantity is current instead of voltage.

<div data-ltspice-placement="opamp-current-source">

<details id="circuit-opamp-current-source">
<summary>LTspice: Op-amp controlled current sink</summary>

<CircuitLibrarySimulation circuit="opamp-current-source" />

</details>

</div>

### High-Side Current Source

The next circuit uses a PNP transistor for high-side current control.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/CurrentSOurce.png')}
    alt="High-side op-amp current source with a PNP transistor"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    High-side current-source example. Image source: <i>The Art of Electronics</i>.
  </figcaption>
</figure>

#### Step-by-Step Operation

1. <i>R<sub>1</sub></i> and <i>R<sub>2</sub></i> set the non-inverting reference voltage.
2. Feedback makes the inverting input almost equal to this reference.
3. The inverting input monitors the PNP emitter.
4. The op-amp output is about 0.7 V below the PNP emitter.
5. The sense resistor is between <i>V<sub>CC</sub></i> and the controlled emitter voltage.
6. As a result, the resistor current is:

> **I = (V<sub>CC</sub> - V<sub>in</sub>) / R**

#### Error Sources

1. **Base current:** Some sense-resistor current enters the PNP base.
   As a result, the load current is not exactly equal to the calculated current.
2. **Early effect:** Changes in <i>V<sub>CE</sub></i> can change transistor beta.
   This changes base current and its error.
3. **Darlington correction:** A Darlington pair has much higher current gain.
   As a result, base-current changes cause a smaller error.
4. **[MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>) correction:** A MOSFET has almost no DC gate current.
   This removes the BJT base-current error.
5. **MOSFET caution:** Gate capacitance adds delay to the feedback loop.
   This delay can cause instability or oscillation.

The circuit command is referenced to <i>V<sub>CC</sub></i>.
A different circuit is necessary when a ground-referenced external voltage must control the current.

### Two-Stage MOSFET Current Source

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SecondCurrentSource.png')}
    alt="Two-stage op-amp current source with a BJT input stage and P-channel MOSFET output"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Two-stage MOSFET current source. Image source: <i>The Art of Electronics</i>.
  </figcaption>
</figure>

#### Step-by-Step Operation

1. The command voltage goes to IC1.
2. The IC1 inverting input monitors the BJT emitter.
3. IC1 drives the base to about <i>V<sub>in</sub> + 0.7 V</i>.
4. The emitter then becomes about equal to <i>V<sub>in</sub></i>.
5. Current through <i>R<sub>1</sub></i> becomes <i>V<sub>in</sub>/R<sub>1</sub></i>.
6. This current produces a collector voltage of:

> **V<sub>CC</sub> - (V<sub>in</sub>/R<sub>1</sub>)R<sub>2</sub>**

7. This voltage goes to the IC2 non-inverting input.
8. IC2 drives the P-channel MOSFET gate.
9. Output current flows from <i>V<sub>CC</sub></i>, through <i>R<sub>3</sub></i>, and through the MOSFET drain.
10. MOSFET source feedback lets IC2 control the voltage across <i>R<sub>3</sub></i>.

Do not assume that an op-amp input or output can operate near a supply rail.
Use the datasheet limits.

---

## 10. Differential, Instrumentation, and Nonlinear Circuits

### Differential Amplifiers

A **[differential amplifier](<./02-differential-amps.md#3-four-resistor-op-amp-difference-amplifier>)** produces an output from the difference between two input signals.
It rejects voltage that is common to both inputs.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/DifferentialAmplifierFigure4.9.png')}
    alt="Differential op-amp amplifier circuits"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Differential-amplifier circuits. Image source: <i>The Art of Electronics</i>, Figure 4.9.
  </figcaption>
</figure>

* Closely matched resistor ratios are necessary for high **[common-mode rejection ratio](<./02-differential-amps.md#2-common-mode-rejection-ratio>) (CMRR)**.
* One circuit in the figure has an adjustable reference input.
* The reference input sets the output level for special applications.
* The differential stage often has unity gain.
* Other stages can supply additional gain.
* The basic output represents the difference between the two input signals.

### Instrumentation Amplifiers

An **[instrumentation amplifier](<./03-instrumentation-amps.md#2-classic-three-op-amp-architecture>)** is a specialized differential amplifier.
One external resistor often sets its voltage gain.

Important characteristics include:

* Very high input impedance.
* Very stable gain.
* Very high CMRR.
* Accurate amplification of small differential signals with large [common-mode voltage](<./02-differential-amps.md#common-mode-voltage>).

The original notes request an instrumentation-amplifier circuit image here.
The two supplied archives do not contain this figure.

### Voltage-Regulator Error Amplifier

An op-amp can supply gain in a feedback voltage regulator.
It compares part of the output voltage with a Zener reference.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/VoltageRegulatorFigure4.29.png')}
    alt="Series-pass voltage regulator with an op-amp error amplifier"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Op-amp voltage regulator. Image source: <i>The Art of Electronics</i>, Figure 4.29.
  </figcaption>
</figure>

### Comparator

A **comparator** compares two input voltages.
It normally operates without negative feedback.

* A positive differential input drives the output toward one state.
* A negative differential input drives the output toward the other state.
* A basic op-amp used this way can saturate near a positive or negative rail.
* Dedicated comparator ICs usually switch faster and recover from saturation more quickly.
* An external reference can set a comparison threshold independently of the supply rails.

The original notes request an op-amp comparator circuit image here.
The two supplied archives do not contain this figure.

### Schmitt Trigger

A **Schmitt trigger** uses [positive feedback](<./comparators.md#positive-feedback-resistor-network>) to make two switching thresholds.
The difference between the thresholds is **hysteresis**.

For a slow or noisy input, hysteresis stops small movements near one voltage from repeatedly switching the output. The threshold depends on the current output state, so the circuit's recent state matters as well as the input voltage.

Comparators and Schmitt triggers can turn loads on or off.
Use a driver when the load current exceeds the comparator rating.

The original notes request a Schmitt-trigger circuit image here.
The two supplied archives do not contain this figure.

### Precision Half-Wave Rectifier

Small signals are difficult to rectify with only a diode.
A silicon diode can need about 0.6 V before it conducts.
Two junctions can add about 1.2 V.

An op-amp places the diode in a feedback path.
The loop then corrects much of the diode drop.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/HalfWaveRectifierFigure4.38.png')}
    alt="Op-amp precision half-wave rectifier with two diodes"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Precision half-wave rectifier. Image source: <i>The Art of Electronics</i>, Figure 4.38.
  </figcaption>
</figure>

#### Circuit Operation

* D1 makes the circuit a unity-gain inverter for negative input signals.
* For positive input signals, D2 clamps the op-amp output one diode drop below ground.
* D1 is then reverse biased.
* The circuit output stays at ground during this half-cycle.
* A following op-amp buffer can give the output lower impedance.

High-speed operation can cause errors.
The op-amp must move between diode states.
Recovery from saturation can delay this transition.

---

<div data-ltspice-placement="precision-rectifier">

<details id="circuit-precision-rectifier">
<summary>LTspice: Precision half-wave rectifier</summary>

<CircuitLibrarySimulation circuit="precision-rectifier" />

</details>

</div>

## 11. DC Accuracy and Input Limits

### Input Offset Voltage

The input devices never match perfectly. Even with no wanted signal, a small voltage difference may be needed to make the output 0 V. This is **[input offset voltage](<../../00-Foundations/03-Precision-Design.md#input-offset-voltage-and-trim>)**, <i>V<sub>OS</sub></i>.

If the two inputs are connected together, open-loop operation can still drive the output to a rail.

Some op-amps have offset-null pins.
A manufacturer-specified potentiometer network can trim the initial offset.

### Offset-Voltage Drift

Input offset voltage changes with temperature and time.
This drift is important in a precision amplifier.
A low initial offset does not ensure a low error at all temperatures.

### Input Bias Current

Real input transistors need a small input current, <i>I<sub>B</sub></i>.
This current produces voltage across source, bias, and feedback resistances.

> **V<sub>error</sub> = I<sub>B</sub>R**

Even a tiny bias current can make a large voltage error through a large resistance. This is why [input bias current](<../../00-Foundations/03-Precision-Design.md#input-bias-current>) can limit the resistor values you can use.

### Input Offset Current

The two input bias currents are not exactly equal.
Their difference is **input offset current**, <i>I<sub>OS</sub></i>.

Equal source resistances can then produce unequal input-voltage drops.
The op-amp sees this error as a differential signal.

### BJT and FET Inputs

* **BJT inputs:** Input current can be in the &mu;A or nA range.
* **[JFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#3-jfet-and-depletion-mode-operation>) or CMOS inputs:** Input current can be in the pA range.
* High-value source resistances often need a JFET or CMOS input.
* Always include maximum bias current and temperature effects in the error budget.

### Design Example: 10 mV Panel Meter

This example is adapted from <i>The Art of Electronics</i>.
The circuit is a high-impedance DC amplifier for a sensitive voltmeter.

* **Measurement range:** &plusmn;10 mV full scale.
* **Gain:** 100.
* **Input impedance:** 10 M&Omega;.

#### Standard Op-Amp Example

The original example uses an LF411.

1. **Offset error:** Short the inputs to calibrate zero.
   The input-referred meter reading is 2 mV.
   This is 20% of the 10 mV range.
2. **Cause:** The op-amp has 2 mV input offset voltage.
3. **Drift error:** Trim the offset to 0 V.
   Then increase temperature by 10&deg;C.
   The indicated input changes by -0.2 mV.
4. **Cause:** The offset temperature coefficient is 20 &mu;V/&deg;C.
5. **Bias-current error:** Disconnect the test leads.
   The indicated input changes to +2 mV.
6. **Cause:** A 200 pA bias current flows through the 10 M&Omega; input resistance.

> **200 pA &times; 10 M&Omega; = 2,000 &mu;V = 2 mV**

#### Lower-Error Devices

* **Precision FET op-amp:** The original example gives the OPA336.
  It lists 10 pA bias current and 125 &mu;V input offset.
* **Chopper or [auto-zero](<../../00-Foundations/03-Precision-Design.md#auto-zero-and-chopper-stabilized-amplifiers>) op-amp:** The original example gives the LTC1050.
  It periodically measures and corrects its offset.
  The original value is less than 5 &mu;V.

Use current datasheets for guaranteed limits.

### Common-Mode Input Range

Both op-amp inputs must stay within the specified **common-mode input range (CMIR)**.

An input above the positive supply or below the negative supply can saturate internal devices.
Some older devices can have **phase reversal**.
Their output can move toward the incorrect rail.

Rail-to-rail input does not always include both rails for all supply voltages.
Read the datasheet conditions.

### Differential Input Range

The **differential input range** limits the voltage difference between the two input pins. The common-mode range instead concerns where the inputs sit relative to the supply rails. The allowed difference can depend on the supply and the amplifier's input-protection circuit.

Some bipolar op-amps have antiparallel protection diodes between the inputs.
A difference greater than about 0.7 V can cause large input current.
Limit this current to prevent damage.

### Offset and Bias Management

If the signal path does not need DC gain, an input capacitor can make DC gain equal to 1.
This prevents amplification of part of the offset.

Other methods include:

* Use the manufacturer-specified offset-trim network.
* Select an op-amp with a smaller maximum <i>V<sub>OS</sub></i>.
* Match the resistance seen by the two inputs when this decreases bias-current error.
* Select a low-bias-current input type for high [source resistance](<../../00-Foundations/00-Foundations.md#the-ideal-source-and-the-real-source>).

Offset trimming does not remove input-bias-current error.

---

## 12. Single-Supply Operation

Some op-amps operate from one supply, such as +5 V and ground.
The negative supply rail is then ground.

This can make a design smaller because it does not need a negative supply.
Input common-mode range and output swing remain important.

### Mid-Supply Reference

An AC signal centered on 0 V would need a negative output swing.
A single-supply circuit cannot usually produce this swing.

Use a DC reference, such as <i>V<sub>CC</sub>/2</i>, as a signal reference.
This node is often called a **virtual ground**.

1. Make a stable mid-supply reference.
2. Bias the signal around that reference.
3. Use the reference as the signal return.
4. Bias each relevant stage when the signal passes through multiple stages.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SingleSupplyFigure4.71.png')}
    alt="Single-supply op-amp circuits biased from a mid-supply reference"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Single-supply op-amp circuits. Image source: <i>The Art of Electronics</i>, Figure 4.71.
  </figcaption>
</figure>

### Supply Splitter

A **supply splitter** makes a low-impedance center reference from a single supply.
If the center reference becomes circuit ground, the two rails appear positive and negative.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SplitSupllyGeneratorFigure4.73.png')}
    alt="Op-amp supply splitter that makes positive and negative rails relative to a center reference"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Split-supply generator. Image source: <i>The Art of Electronics</i>, Figure 4.73.
  </figcaption>
</figure>

The splitter must source and sink the expected [return current](<../../05-PCB-Layout/02-Return-Paths.md#1-a-signal-needs-a-return>).
Its current rating and stability limit the connected load.

---

## 13. Driving SAR ADC Inputs

A **successive-approximation-register [analog-to-digital converter](<../Data-convertes/DACs.md#3-sampling-and-resolution>) ([SAR ADC](<../Data-convertes/DACs.md#successive-approximation-adc>))** has a switching input.
It does not always look like a high, constant input impedance.

### Transient Current, or Kickback

A SAR ADC often contains an internal [sample-and-hold](<../Data-convertes/Sample-holding.md#1-basic-circuit>) capacitor, <i>C<sub>SH</sub></i>.
An internal switch connects this capacitor to the input during acquisition.

If the sampling capacitor starts at a different voltage from the input, charge moves suddenly when the switch closes. This brief current pulse produces a voltage glitch at the driver output.

The driver must bring the input back within the allowed error before acquisition ends. If it has not settled in time, the ADC converts the wrong voltage.

<SarAdcInputModel />

### Input-Model Components

* **Sampling capacitor, C<sub>SH</sub>:** Acquires the ADC input voltage.
  It can be part of the internal capacitive [digital-to-analog converter](<../Data-convertes/DACs.md#1-dac-fundamentals>).
* **Sample-and-hold switch, SW<sub>SH</sub>:** Selects track or hold operation.
* **Reset switch, SW<sub>RST</sub>:** Some ADC architectures reset the capacitor between phases.
* **Reset voltage, V<sub>RST</sub>:** Sets the starting capacitor voltage in those architectures.
* SW<sub>SH</sub> and SW<sub>RST</sub> must not close together in this model.

### Step-by-Step Glitch Sequence

1. **Hold or reset phase:** The model connects <i>C<sub>SH</sub></i> to <i>V<sub>RST</sub></i>.
2. **Voltage difference:** A difference exists between <i>V<sub>RST</sub></i> and <i>V<sub>ADCIN</sub></i>.
3. **Track phase:** SW<sub>SH</sub> closes.
4. **Charge transfer:** Current flows to equalize the internal and external capacitances.
5. **Input glitch:** The ADC pin and driver output move temporarily.
6. **Acquisition:** The driver and RC network move the voltage toward its final value.
7. **Sampling:** The ADC stores the value at the next sampling edge.

Actual internal switching sequences differ.
Use the ADC datasheet input model.

If the analog front end does not settle:

* Conversion errors occur.
* Repeated errors can accumulate in a signal chain.
* Accuracy decreases.
* Harmonic distortion appears in a [fast Fourier transform](<../Filters/Digital-filters.md#17-discrete-fourier-transform-and-fast-fourier-transform>) (**FFT**).

### Direct Output-Capacitor Problem

A large output capacitor can supply charge to <i>C<sub>SH</sub></i>.
However, a direct capacitive load can make the op-amp unstable.

Open-loop gain falls as frequency rises.
Closed-loop output impedance then rises.
This output impedance can have an inductive characteristic.

Together, this effective inductance and the directly connected load capacitor can resonate. The output may ring or even oscillate.

### RC Isolation

Put a series isolation resistor, <i>R<sub>iso</sub></i>, between the op-amp and the external capacitor.

* The resistor damps the resonance.
* It separates the op-amp output from the direct capacitive load.
* The external capacitor supplies much of the sampling transient.
* The op-amp restores the capacitor voltage through the resistor.

<AdcDriverIsolation />

### Component Trade-Offs

#### External Capacitor

* **Too small, such as 100 pF:** The capacitor supplies insufficient charge.
  The op-amp supplies more transient current.
  Settling and ringing can become worse.
* **Too large, such as 1 &mu;F:** Transient charge storage improves.
  However, the RC time constant can become too long.
* A large capacitor can need a smaller <i>R<sub>iso</sub></i> for enough bandwidth.
* A small resistor gives less damping.
* Higher peak currents can increase power dissipation.

#### Op-Amp Bandwidth

An op-amp with more bandwidth often keeps its closed-loop output impedance low to a higher frequency. That can reduce the effective inductive behavior seen by the load.

The design can then use a smaller isolation resistor.
A smaller RC time constant can make settling faster.
Noise and power can increase.

### Ratio-Based First Estimate

Start with the ADC datasheet's requirements. The ratio between the external and internal capacitances gives an initial estimate of the voltage glitch when they share charge. The original notes point out that some datasheet recommendations include conservative margins.

1. Find the internal sampling capacitance, <i>C<sub>SH</sub></i>.
2. Set the allowed settling error, such as less than one-half least-significant bit (**LSB**).
3. Select an initial external capacitance.
4. Simulate or measure the complete acquisition response.

The original ratio examples are:

* **C<sub>ext</sub> = 20C<sub>SH</sub>:** Initial charge-sharing movement is about 5%.
* **C<sub>ext</sub> = 100C<sub>SH</sub>:** Initial movement is about 1%.

The original target keeps the kickback glitch below 100 mV.
This can keep the op-amp in its small-signal response region.
It can then settle faster than during slew-rate limiting.

Datasheet recommendations can include margins for switch resistance, nonlinear capacitance, source impedance, and worst-case operation.
Do not discard these requirements without analysis and measurement.

---

## 14. Signal-Chain Noise and Converter Design

### Quantization Noise

An ADC has a finite number of output codes.
It rounds an analog voltage to the nearest available code.

**Quantization error** is the difference between the analog input and the represented code.
For a suitable signal, this error contributes to the converter noise floor.

* **Low resolution, such as 12 to 14 bits:** Quantization noise can dominate.
* **High resolution, such as 16 bits or more:** [Thermal noise](<../../00-Foundations/00-Foundations.md#thermal-noise>) can dominate.
* Temperature can then have a larger effect on performance.

### Clock Jitter

**Clock jitter** is sampling-time error.
The actual sampling instant differs from the intended instant.

A changing input has a different voltage at each instant.
As a result, timing error becomes amplitude error.

High-frequency input signals are more sensitive to jitter.
Their signal-to-noise ratio (**SNR**) can be limited by the external clock instead of the ADC.

### SNR and ENOB

* **SNR:** Compares signal power with noise power.
  Check whether a datasheet value includes distortion.
* **SINAD:** Includes noise and distortion.
* **[Effective number of bits](<../Data-convertes/DACs.md#effective-number-of-bits>) (ENOB):** A value calculated from SINAD for a sine-wave test.

The original notes group quantization, thermal noise, and distortion under SNR.
Many datasheets use SINAD for that combined measurement.

### Bandwidth Dilemma

A SAR driver needs enough bandwidth to settle input kickback.
More bandwidth also passes more noise.

For example, a 100 MHz driver can pass noise far above a 100 kHz signal band.
The design must balance settling time and integrated noise.

### Aliasing

Sampling creates copies of the input's frequency content around multiples of the sample rate. Unwanted signals or noise at higher frequencies can then appear inside the frequency range you are measuring.

Noise at 50 MHz can affect a 100 kHz measurement if the sampling system aliases it.
After [aliasing](<../Filters/Digital-filters.md#18-aliasing-at-the-initial-adc>) happens, a digital filter cannot identify the original out-of-band noise.

The **[Nyquist criterion](<../Data-convertes/DACs.md#nyquist-criterion>)** needs a sampling rate greater than twice the highest retained signal frequency.
Practical systems also need an analog [anti-alias filter](<../Filters/Active-filters.md#18-anti-alias-filters-for-adcs>).

### Oversampling, Filtering, and Decimation

#### Step A: Oversample

Operate the ADC faster than the final output-data rate.
The original example uses 15 MHz sampling for a 100 kHz signal.

[Oversampling](<../Filters/Digital-filters.md#23-oversampling>) can:

* Spread uncorrelated quantization noise across a wider frequency range.
* Decrease in-band noise density after filtering.
* Move the first Nyquist boundary farther from the wanted signal.
* Permit a simpler analog anti-alias filter for some specifications.

The analog filter must still attenuate signals that can alias during sampling.

#### Step B: Apply Digital Filtering

Apply a digital low-pass filter to the oversampled data.
Digital filters can have accurate and steep responses.

The digital filter removes noise that lies above the final wanted bandwidth but is still represented in the sampled data. It cannot separate out interference that has already aliased onto a wanted frequency.

#### Step C: Decimate

Oversampling produces more data than the final application needs.
After digital filtering, reduce the sample rate.

For example, keep one output for each 100 input samples when the filter permits this ratio.
The result has a lower data rate and a smaller retained noise bandwidth.

### Oversampling Resolution Rule

If quantization noise is sufficiently uncorrelated between samples, doubling the sample rate and keeping the same final bandwidth can improve SNR by about 3 dB, equivalent to about one-half bit.

Increasing the oversampling ratio by four can improve resolution by about one bit.

The original equation is:

> **SNR<sub>improvement</sub> = 10 log<sub>10</sub>[f<sub>sample</sub> / (2f<sub>signal</sub>)]**

This relationship uses ideal assumptions.
Clock jitter, distortion, correlated error, and analog noise can prevent the theoretical improvement.

### Voltage-Reference Noise

A low-noise ADC cannot correct a noisy voltage reference.
Reference noise and drift can become the dominant measurement error.

The ideal reference is constant DC.
A strong low-pass filter at the reference pin can decrease broadband noise.

The reference circuit must also:

* Settle after ADC charge transients.
* Remain stable with its [bypass capacitor](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#bypass--decoupling>).
* Supply the necessary dynamic current.
* Keep DC error, temperature drift, and long-term drift within the error budget.


## Supplemental Circuit Views

The original figure requests above remain as source pointers. The following original and existing site diagrams illustrate the associated circuit functions.

### Instrumentation-Amplifier Topology

import InAmpTopologyDiagram from '@site/src/components/InAmpTopologyDiagram';
import ComparatorHysteresisExplorer from '@site/src/components/ComparatorHysteresisExplorer';

<InAmpTopologyDiagram />

The two input amplifiers provide high input impedance. Their gain resistor controls differential gain before the final subtraction stage.

### Threshold and Hysteresis

<ComparatorHysteresisExplorer />

Use the threshold controls to observe the different rising and falling transition levels. Positive feedback produces this hysteresis.

Use a comparator intended for the required input and output conditions. An op-amp used open-loop can have slow recovery or an unsuitable output interface.

See the [comparator page](./comparators.md) for output types, propagation delay, and threshold design.


import CircuitLibrarySimulation from '@site/src/components/learning/CircuitLibrarySimulation';

## More LTspice circuits {#ltspice-circuits}

These examples show component behavior and reusable circuit blocks. Each example includes three parameter settings.

[Browse all LTspice circuits](/ltspice-circuits).

### Op-amp controlled current sink {#ltspice-opamp-current-source}

An op-amp drives a MOSFET until the sense-resistor voltage equals the command voltage.

The sense resistor converts current to voltage. Negative feedback forces this voltage toward the command voltage.

For a 100-ohm sense resistor, a 0.5 V command sets about 5 mA.

The drain supply must provide the sense voltage and transistor headroom. The circuit cannot maintain current below this compliance voltage.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-current-source>).

### Inverting and noninverting amplifiers {#ltspice-opamp-gain-configurations}

Two feedback networks demonstrate the sign and magnitude of closed-loop voltage gain.

The inverting stage has gain equal to the negative feedback-resistor ratio. Its input resistor carries signal current.

The noninverting stage has gain equal to one plus the resistor ratio. Its input connects directly to the high-resistance op-amp input.

Both stages lose closed-loop gain at high frequency. Their noise gains determine the approximate bandwidth.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-gain-configurations>).

### Buffer and source loading {#ltspice-opamp-buffer-loading}

A voltage follower separates a high-resistance source from its load.

The direct path forms a voltage divider between the source resistance and load.

The buffered path draws little current from the source. The op-amp supplies the load current instead.

The buffer still has output-current and bandwidth limits. This frequency sweep examines its small-signal response.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-buffer-loading>).

### Summing amplifier {#ltspice-opamp-summing}

Two input resistors feed a common summing node.

Negative feedback holds the summing node near ground. Each input therefore produces a current through its resistor.

The feedback resistor converts the sum of those currents to output voltage.

Equal input and feedback resistors give the negative sum of the two input voltages. Here one input supplies a DC offset.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-summing>).

### Practical integrator {#ltspice-opamp-integrator}

A feedback capacitor converts input current into a changing output voltage.

The input resistor sets capacitor current. Output slope is about the negative input voltage divided by resistance and capacitance.

A large resistor across the capacitor gives a DC feedback path. It prevents unlimited DC gain.

Above the resistor-capacitor corner, gain falls by about 20 dB per decade. The phase approaches positive 90 degrees.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-integrator>).

### Band-limited differentiator {#ltspice-opamp-differentiator}

An input capacitor converts changes in input voltage into current.

The feedback resistor converts capacitor current to output voltage. In the differentiating band, output is proportional to input slope.

The series input resistor limits high-frequency gain. The feedback capacitor gives a second high-frequency limit.

An unlimited differentiator strongly amplifies high-frequency noise. The extra components make the response practical.

[Open this circuit beside its topic](</docs/Signal-Modulation/Filters/Active-filters#circuit-opamp-differentiator>).

### Transimpedance amplifier {#ltspice-transimpedance-amplifier}

An op-amp converts input current to output voltage through a feedback resistor.

Negative feedback holds the input node near ground. Most input current flows through the feedback resistor.

The low-frequency transimpedance is about the negative feedback resistance. Here its magnitude is 100 kilohms.

Input capacitance affects loop stability. The feedback capacitor reduces high-frequency gain and improves phase margin.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-transimpedance-amplifier>).

### Closed-loop gain and bandwidth {#ltspice-opamp-gain-bandwidth}

Higher closed-loop gain reduces the bandwidth of a dominant-pole op-amp.

The op-amp gain-bandwidth product is set to 1 MHz. The resistor choices produce nominal gains of 2, 10, and 100.

The approximate bandwidth is gain-bandwidth product divided by noise gain.

This relation applies to the dominant-pole response. Additional poles and loading can change the result.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-gain-bandwidth>).

### Slew-rate limiting {#ltspice-opamp-slew-rate}

A limited output slope prevents a fast, large signal from following the input.

The input is a 5 V peak sine wave at 100 kHz. Its maximum slope is about 3.14 V per microsecond.

The three slew-rate settings lie below and above this requirement.

A low slew rate produces an almost triangular output with reduced amplitude. This is a large-signal limit, not only a bandwidth limit.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-slew-rate>).

### Output clipping {#ltspice-opamp-clipping}

An amplifier cannot produce output voltage beyond its available supply range.

The feedback network requests a gain of negative two. The input amplitude increases between runs.

Once the requested output exceeds the available swing, the waveform clips near the output limits.

Feedback no longer holds the input difference near zero during clipping. Recovery also depends on the amplifier dynamics.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-opamp-clipping>).

### Capacitive load and isolation resistor {#ltspice-capacitive-load-compensation}

A series output resistor separates a capacitive load from the amplifier feedback node.

The load capacitance adds phase lag through the amplifier output impedance. This can cause overshoot and ringing.

The feedback connects before the isolation resistor. The resistor reduces the capacitive loading seen inside the loop.

A larger isolation resistor can reduce ringing, but it also slows the load voltage and creates a load-dependent voltage drop.

[Open this circuit beside its topic](</docs/Signal-Modulation/Amplifiers/op-amps#circuit-capacitive-load-compensation>).
