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

An **operational amplifier (op-amp)** is a basic analog building block.
It is a high-gain, DC-coupled voltage amplifier.
It has a differential input and usually has a single-ended output.

An ideal op-amp amplifies the difference between its two input voltages:

> **V<sub>out</sub> = A<sub>OL</sub>(V<sub>+</sub> - V<sub>-</sub>)**

The **open-loop gain**, <i>A<sub>OL</sub></i>, is frequently more than 100,000 at low frequencies.
As a result, designers rarely use an op-amp without feedback.

**Feedback** controls this large gain.
External resistors, capacitors, and diodes then set the circuit function.
The circuit can do addition, integration, filtering, rectification, or other operations.

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
* **Real gain:** Open-loop gain is finite and decreases as frequency increases.
* **Ideal common-mode gain:** The value is 0.
  The op-amp amplifies only the difference between the inputs.
* **Real common-mode gain:** A small common-mode error remains.
* **Ideal slew rate:** The output changes immediately.
* **Real slew rate:** The output voltage has a maximum rate of change.
* **Ideal noise:** The op-amp adds no noise.
* **Real noise:** Voltage noise and current noise limit small signals.
* **Ideal stability:** Temperature and supply voltage do not change the parameters.
* **Real stability:** Many parameters change with temperature, supply voltage, and time.

### The Golden Rules

Use these rules only when the op-amp has stable **negative feedback**.
The output must also be inside its voltage and current limits.

1. **Voltage rule:** The output moves to make <i>V<sub>+</sub></i> and <i>V<sub>-</sub></i> almost equal.
2. **Current rule:** The ideal input currents are 0 A.

The input voltages are not exactly equal in a real circuit.
A small differential voltage is necessary to produce the output voltage.

---

## 2. Basic Voltage-Amplifier Circuits

### Inverting Amplifier

The **inverting amplifier** applies the input through resistor <i>R<sub>1</sub></i>.
Its output is 180&deg; out of phase with the input.

* The input impedance is approximately <i>R<sub>1</sub></i>.
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
2. Negative feedback keeps point A at approximately 0 V.
3. As a result, the voltage across <i>R<sub>1</sub></i> is approximately <i>V<sub>in</sub></i>.
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

Each input produces a current through its input resistor.
Almost none of this current enters the op-amp.
The currents add at the summing node and flow through the feedback resistor.

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

1. Negative feedback makes point A approximately equal to <i>V<sub>in</sub></i>.
2. If <i>V<sub>in</sub></i> increases, the output increases.
3. The divider applies a fraction of the output to point A.
4. A larger feedback ratio needs less output voltage for the same point-A voltage.
5. A smaller feedback ratio needs more output voltage.
6. The resistor divider attenuates the output before it reaches the inverting input.

For the usual resistor arrangement:

> **Gain = 1 + R<sub>2</sub> / R<sub>1</sub>**

The circuit keeps the output in phase with the input.

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

A **voltage follower**, or **buffer**, is a special non-inverting amplifier.
The feedback connection is a short circuit.
The resistor to ground is open.

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

If the output changes, the returned signal changes the error in the opposite direction.
This action moves the output back toward its target.

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

The op-amp drives the output to approximately 4 V.
This makes the feedback voltage approximately 2 V.

#### Step 2: Error Creation

Assume that a load change moves the output from 4.0 V to 4.1 V.
The divider then moves <i>V<sub>-</sub></i> to 2.05 V.

> **V<sub>error</sub> = V<sub>+</sub> - V<sub>-</sub>**

> **V<sub>error</sub> = 2.00 V - 2.05 V = -0.05 V**

#### Step 3: Op-Amp Reaction

The op-amp multiplies the negative error by its large open-loop gain.
The ideal linear equation requests -5,000 V.

> **-0.05 V &times; 100,000 = -5,000 V**

The op-amp cannot produce -5,000 V.
Instead, its internal circuit drives the output downward as strongly as its limits permit.

#### Step 4: Correction

As the output moves from 4.1 V toward 4.0 V, the feedback voltage moves toward 2.0 V.
The input error becomes smaller.
As a result, the internal drive also becomes smaller.

#### Step 5: Equilibrium

The input error does not become exactly 0 V in a real circuit.
If it were 0 V, the open-loop equation would produce 0 V.

The final values in the original example are:

* **Output:** 4.0 V.
* **Non-inverting input:** 2.00000 V.
* **Inverting input:** 1.99996 V.
* **Residual error:** 40 &mu;V.

> **V<sub>out</sub> = 0.00004 V &times; 100,000 = 4 V**

The loop keeps a small error that is sufficient to hold the necessary output.

### Closed-Loop Gain Stability

Let:

* <i>A</i> be the open-loop amplifier gain.
* <i>&beta;</i> be the feedback factor.
* <i>A<sub>CL</sub></i> be the closed-loop gain.

> **A<sub>CL</sub> = A / (1 + A&beta;)**

Assume that <i>A = 100,000</i> and <i>&beta; = 0.1</i>.
The product <i>A&beta;</i> is much larger than 1.

The equation then becomes approximately:

> **A<sub>CL</sub> &asymp; A / A&beta; = 1 / &beta;**

As a result, accurate external components set most of the closed-loop gain.
The gain changes less when the internal op-amp gain changes.

### Other Feedback Improvements

Negative feedback can also:

* Decrease distortion.
* Decrease some internally generated errors.
* Increase bandwidth.
* Decrease sensitivity to component and temperature changes.
* Change input and output impedances.

For a voltage amplifier, feedback opposes output-voltage movement.
A heavy load can pull the output down.
The loop detects this movement and increases its drive.
As a result, the closed-loop output impedance becomes lower.

The feedback path returns a signal from output to input.
Source and load impedances can still change the loop, depending on the feedback topology.

### Circuit-Analysis Procedure

Use this procedure when an unfamiliar circuit contains op-amps, resistors, and transistors.
It is especially useful for current-source circuits.

#### Step 1: Find the Feedback Path

Trace the path from the op-amp output.
Determine whether it returns to the inverting input.

* **Yes:** The circuit can be a linear amplifier or regulator.
* **No, or it returns to the non-inverting input:** Check for a comparator, Schmitt trigger, or oscillator.

Do not use the linear golden rules before you confirm stable negative feedback.

#### Step 2: Find the Command

Examine the non-inverting input.
Its voltage is usually the target for the inverting input.

* A fixed reference usually commands a static DC value.
* A variable input usually commands a changing output.

#### Step 3: Find the Sense Resistor

Examine the inverting input.
For a current source, it frequently monitors a resistor connected to ground or a supply rail.

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

Real voltage-feedback op-amps usually have a low-pass open-loop response.
They have very high gain at DC.
Their available gain decreases as frequency increases.

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

### Slew Rate

**Slew rate** is the maximum output-voltage change for each unit of time.
Datasheets usually specify it in V/&mu;s.

The value can depend on the internal compensation network.
A high-frequency, high-amplitude signal can exceed the slew-rate limit.
The output then becomes more triangular than sinusoidal.

### Capacitive Loading

A capacitive load interacts with the op-amp output impedance.
This interaction adds a pole and phase lag to the feedback loop.

If the total phase shift approaches 180&deg; while loop gain exceeds 1, oscillation can occur.

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

### Finite Loop-Gain Effects

Closed-loop gain cannot stay accurate after available open-loop gain becomes insufficient.
As a result, gain starts to decrease near the closed-loop bandwidth.

For voltage feedback, loop gain decreases output impedance by approximately <i>1 + A&beta;</i>.
Open-loop gain decreases as frequency increases.
As a result, closed-loop output impedance usually increases with frequency.

This rising impedance can look inductive.
A capacitive load can then make a resonant circuit.

Some current-feedback topologies use feedback to increase output impedance.
Always analyze the applicable feedback type.

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
This condition gives approximately 90&deg; of phase margin.
Real amplifiers have more poles and smaller margins.

### Rate-of-Closure Method

The **rate-of-closure method** compares open-loop and noise-gain slopes.
The slope difference near their intersection gives information about stability.

An RC corner frequency is:

> **f = 1 / (2&pi;RC)**

### Poles

A **pole** changes magnitude slope by -20 dB/decade.
Its total phase contribution approaches -90&deg;.
As a result, a pole can decrease phase margin.

Examples that can add poles include:

* A capacitor from the output to ground.
* Input or source capacitance with resistance.
* A capacitor in series with a signal path.
* Internal amplifier stages.

The exact effect depends on the complete loop.

### Zeros

A **zero** changes magnitude slope by +20 dB/decade.
Its phase contribution can approach +90&deg;.
A correctly placed zero can add phase lead and improve stability.

A capacitor and resistor in the feedback network can create a zero.
Signal-path and feedback-path descriptions can give different gain interpretations.
Analyze loop gain to prevent confusion.

### Phase-Margin Targets

* An intersection near a new pole can give approximately 45&deg; phase margin.
  This gives more bandwidth but more overshoot.
* Moving the crossover below the added pole can give approximately 60&deg; phase margin.
  This is a common robust target.

These values are approximations.
The complete pole and zero locations set the actual margin.

### Transient-Response Check

**Transient response** shows the output response to a step or square-wave input.
Lower phase margin usually causes more overshoot and ringing.
Very low margin causes sustained oscillation.

### Dominant-Pole Compensation

A **dominant pole** makes open-loop gain decrease before higher-frequency poles become important.
The loop then reaches unity gain before total phase shift approaches 180&deg;.

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

A photodiode or other sensor has capacitance.
The capacitance adds phase delay to the feedback loop.
Too much phase delay can cause oscillation.

A small capacitor, such as 10 pF, across <i>R<sub>f</sub></i> changes the noise gain.
Correct selection can restore phase margin.
It also limits high-frequency bandwidth.

The capacitor does not make feedback instantaneous.
Its impedance decreases with frequency.
This provides a controlled high-frequency feedback path.

#### Noise Filter

A capacitor has high impedance at low frequencies and low impedance at high frequencies.
As a result, it decreases the feedback impedance at high frequencies.

* At low frequencies, <i>R<sub>f</sub></i> mainly sets the gain.
* At high frequencies, the capacitor decreases the feedback impedance.
* The closed-loop gain then decreases.

This action makes an active low-pass response.
It can prevent amplification of radio interference and high-frequency noise.

#### Practical Integrator

An ideal **integrator** has only a capacitor in the feedback path.
At DC, the capacitor is open.
As a result, the circuit has no DC negative feedback.

Input offset and bias current then move the output into saturation.
A large resistor in parallel with the capacitor gives a DC feedback path.
It limits DC gain and decreases drift into saturation.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/integratorFigure4.16.png')}
    alt="Practical op-amp integrator with a capacitor and resistor in the feedback path"
    className="invert-on-dark"
    style={{maxWidth: '80%', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Practical integrator. Image source: <i>The Art of Electronics</i>, Figure 4.16.
  </figcaption>
</figure>

#### Component Clues

* A very small capacitor in the pF range frequently controls stability.
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
A **Sallen-Key filter** can make a second-order response.

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
  C1 then acts approximately as a capacitor to ground.
* At low frequencies, the output follows the input.
  The voltage across C1 is then small.
* As a result, C1 has less effect in the low-frequency passband.
* Component ratios and amplifier gain set the **Q factor** near cutoff.

#### Filter Order and Roll-Off

* **First-order passive RC:** The final slope is 20 dB/decade, or 6 dB/octave.
* **Second-order Sallen-Key:** The final slope is 40 dB/decade, or 12 dB/octave.

The Sallen-Key topology can give a sharper transition than a single passive RC section.
Its Q and damping set passband flatness and cutoff peaking.

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
   A direct resistor connection makes an RC time constant and decreases bandwidth.
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

## 8. Output-Current Boosters

### Single-Ended Emitter-Follower Booster

Figure 4.25 uses an external NPN bipolar junction transistor (**BJT**) to increase output-current capability.
The transistor operates as an emitter follower.

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
2. A 2 V input requests approximately 20 V at the load.
3. The NPN base-emitter junction needs approximately 0.7 V.
4. The op-amp output moves to approximately 20.7 V.
5. The emitter output becomes approximately 20 V.
6. The divider returns approximately 2 V to the inverting input.
7. The two op-amp inputs are then almost equal.

The feedback point is after the transistor.
As a result, feedback corrects the approximate 0.7 V base-emitter drop.
It also corrects changes in this drop with current and temperature.

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
The NPN needs approximately +0.7 V base-emitter voltage.
The PNP needs approximately -0.7 V.

The op-amp output must move across approximately 1.4 V when conduction changes between transistors.
Finite slew rate makes this movement take time.
The load output can then briefly fail to follow the input.
This error is **crossover distortion**.

#### Feedback Correction

Assume that the input moves from 0 V to +0.1 V.

1. Both transistors are initially off near the zero crossing.
2. The load output remains near 0 V.
3. The op-amp detects a +0.1 V difference between input and feedback.
4. Large open-loop gain drives the op-amp output toward approximately +0.8 V.
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
* The load voltage stalls while the input passes through the approximately &plusmn;0.7 V dead zone.
* The feedback loop cannot detect distortion after its feedback point.

#### Correct Feedback Point

Now take feedback from the final load output.

* The op-amp controls the voltage that is important to the load.
* It detects output lag during the zero crossing.
* It moves its output rapidly across the transistor dead zone.
* The op-amp output waveform contains sharp correction movements.
* The final load waveform is much more linear.

The feedback loop moves distortion from the load output to the internal op-amp drive.
Dynamic limits prevent perfect correction at all frequencies.

---

## 9. Op-Amp Current Sources

### Basic Current Source

The basic circuit uses feedback to control the voltage across a sense resistor.

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
4. The op-amp output is approximately 0.7 V below the PNP emitter.
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
4. **MOSFET correction:** A MOSFET has almost no DC gate current.
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
3. IC1 drives the base to approximately <i>V<sub>in</sub> + 0.7 V</i>.
4. The emitter then becomes approximately equal to <i>V<sub>in</sub></i>.
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

A **differential amplifier** produces an output from the difference between two input signals.
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

* Closely matched resistor ratios are necessary for high **common-mode rejection ratio (CMRR)**.
* One circuit in the figure has an adjustable reference input.
* The reference input sets the output level for special applications.
* The differential stage frequently has unity gain.
* Other stages can supply additional gain.
* The basic output represents the difference between the two input signals.

### Instrumentation Amplifiers

An **instrumentation amplifier** is a specialized differential amplifier.
One external resistor frequently sets its voltage gain.

Important characteristics include:

* Very high input impedance.
* Very stable gain.
* Very high CMRR.
* Accurate amplification of small differential signals with large common-mode voltage.

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

A **Schmitt trigger** uses positive feedback to make two switching thresholds.
The difference between the thresholds is **hysteresis**.

Hysteresis is useful for a slow or noisy input.
It prevents many output transitions when the input moves near one threshold.
The output depends on the input voltage and the recent output state.

Comparators and Schmitt triggers can turn loads on or off.
Use a driver when the load current exceeds the comparator rating.

The original notes request a Schmitt-trigger circuit image here.
The two supplied archives do not contain this figure.

### Precision Half-Wave Rectifier

Small signals are difficult to rectify with only a diode.
A silicon diode can need approximately 0.6 V before it conducts.
Two junctions can add approximately 1.2 V.

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

## 11. DC Accuracy and Input Limits

### Input Offset Voltage

Internal input devices are not perfectly matched.
As a result, a small differential input voltage can be necessary to make the output 0 V.
This voltage is **input offset voltage**, <i>V<sub>OS</sub></i>.

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

A large resistance can convert a very small bias current to a large voltage error.
As a result, input bias current limits the practical resistance values.

### Input Offset Current

The two input bias currents are not exactly equal.
Their difference is **input offset current**, <i>I<sub>OS</sub></i>.

Equal source resistances can then produce unequal input-voltage drops.
The op-amp sees this error as a differential signal.

### BJT and FET Inputs

* **BJT inputs:** Input current can be in the &mu;A or nA range.
* **JFET or CMOS inputs:** Input current can be in the pA range.
* High-value source resistances frequently need a JFET or CMOS input.
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
* **Chopper or auto-zero op-amp:** The original example gives the LTC1050.
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

The **differential input range** is the permitted voltage difference between the input pins.
It is different from the common-mode range.
Its permitted value can depend on the supply voltages and the internal input protection.

Some bipolar op-amps have antiparallel protection diodes between the inputs.
A difference greater than approximately 0.7 V can cause large input current.
Limit this current to prevent damage.

### Offset and Bias Management

If the signal path does not need DC gain, an input capacitor can make DC gain equal to 1.
This prevents amplification of part of the offset.

Other methods include:

* Use the manufacturer-specified offset-trim network.
* Select an op-amp with a smaller maximum <i>V<sub>OS</sub></i>.
* Match the resistance seen by the two inputs when this decreases bias-current error.
* Select a low-bias-current input type for high source resistance.

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
This node is frequently called a **virtual ground**.

1. Make a stable mid-supply reference.
2. Bias the signal around that reference.
3. Use the reference as the signal return.
4. Bias each applicable stage when the signal passes through multiple stages.

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

The splitter must source and sink the expected return current.
Its current rating and stability limit the connected load.

---

## 13. Driving SAR ADC Inputs

A **successive-approximation-register analog-to-digital converter (SAR ADC)** has a switching input.
It does not always look like a high, constant input impedance.

### Transient Current, or Kickback

A SAR ADC frequently contains an internal sample-and-hold capacitor, <i>C<sub>SH</sub></i>.
An internal switch connects this capacitor to the input during acquisition.

If the capacitor voltage differs from the input voltage, charge flows suddenly.
This transient current causes a voltage glitch at the driver output.

The driver must settle this glitch before acquisition ends.
Insufficient settling causes conversion error.

<SarAdcInputModel />

### Input-Model Components

* **Sampling capacitor, C<sub>SH</sub>:** Acquires the ADC input voltage.
  It can be part of the internal capacitive digital-to-analog converter.
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
* Harmonic distortion appears in a fast Fourier transform (**FFT**).

### Direct Output-Capacitor Problem

A large output capacitor can supply charge to <i>C<sub>SH</sub></i>.
However, a direct capacitive load can make the op-amp unstable.

Open-loop gain decreases as frequency increases.
Closed-loop output impedance then rises.
This output impedance can have an inductive characteristic.

The effective inductance and direct load capacitance make a resonant network.
The result can be ringing or oscillation.

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
* A large capacitor can need a smaller <i>R<sub>iso</sub></i> for sufficient bandwidth.
* A small resistor gives less damping.
* Higher peak currents can increase power dissipation.

#### Op-Amp Bandwidth

A higher-bandwidth op-amp frequently has lower closed-loop output impedance at high frequencies.
This can decrease the effective inductive behavior.

The design can then use a smaller isolation resistor.
A smaller RC time constant can make settling faster.
Noise and power can increase.

### Ratio-Based First Estimate

Use the ADC datasheet requirements first.
The capacitor ratio can give an initial estimate of the charge-sharing glitch.
The original notes warn that some datasheet recommendations can be conservative.

1. Find the internal sampling capacitance, <i>C<sub>SH</sub></i>.
2. Set the permitted settling error, such as less than one-half least-significant bit (**LSB**).
3. Select an initial external capacitance.
4. Simulate or measure the complete acquisition response.

The original ratio examples are:

* **C<sub>ext</sub> = 20C<sub>SH</sub>:** Initial charge-sharing movement is approximately 5%.
* **C<sub>ext</sub> = 100C<sub>SH</sub>:** Initial movement is approximately 1%.

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
* **High resolution, such as 16 bits or more:** Thermal noise can dominate.
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
* **Effective number of bits (ENOB):** A value calculated from SINAD for a sine-wave test.

The original notes group quantization, thermal noise, and distortion under SNR.
Many datasheets use SINAD for that combined measurement.

### Bandwidth Dilemma

A SAR driver needs sufficient bandwidth to settle input kickback.
More bandwidth also passes more noise.

For example, a 100 MHz driver can pass noise far above a 100 kHz signal band.
The design must balance settling time and integrated noise.

### Aliasing

Sampling repeats the input spectrum around multiples of the sampling frequency.
Out-of-band signals and noise can fold into the baseband.

Noise at 50 MHz can affect a 100 kHz measurement if the sampling system aliases it.
After aliasing occurs, a digital filter cannot identify the original out-of-band noise.

The **Nyquist criterion** requires a sampling rate greater than twice the highest retained signal frequency.
Practical systems also need an analog anti-alias filter.

### Oversampling, Filtering, and Decimation

#### Step A: Oversample

Operate the ADC faster than the final output-data rate.
The original example uses 15 MHz sampling for a 100 kHz signal.

Oversampling can:

* Spread uncorrelated quantization noise across a wider frequency range.
* Decrease in-band noise density after filtering.
* Move the first Nyquist boundary farther from the wanted signal.
* Permit a simpler analog anti-alias filter for some specifications.

The analog filter must still attenuate signals that can alias during sampling.

#### Step B: Apply Digital Filtering

Apply a digital low-pass filter to the oversampled data.
Digital filters can have accurate and steep responses.

The filter removes in-band digital noise above the final signal bandwidth.
It cannot remove interference that already aliased into the same baseband frequency.

#### Step C: Decimate

Oversampling produces more data than the final application needs.
After digital filtering, reduce the sample rate.

For example, keep one output for each 100 input samples when the filter permits this ratio.
The result has a lower data rate and a smaller retained noise bandwidth.

### Oversampling Resolution Rule

For suitable uncorrelated quantization noise, doubling the sample rate can improve SNR by approximately 3 dB.
This is approximately one-half bit.

Increasing the oversampling ratio by four can improve resolution by approximately one bit.

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
* Remain stable with its bypass capacitor.
* Supply the necessary dynamic current.
* Keep DC error, temperature drift, and long-term drift within the error budget.
