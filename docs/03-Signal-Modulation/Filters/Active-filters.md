---
title: Active Filters
sidebar_label: Active Filters
---

import ActiveFilterResponseExplorer from '@site/src/components/ActiveFilterResponseExplorer';
import RCLowPass from '@site/src/components/RCLowPass';
import RCHighPass from '@site/src/components/RCHighPass';
import GainBandwidthGraph from '@site/src/components/GainBandwidthGraph';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Active Filters

An **active filter** uses an active device, usually an operational amplifier, with resistors and capacitors.
The circuit changes signal magnitude and phase as a function of frequency.
It can also provide gain, buffering, a low output impedance, or a controlled filter response.

A passive RC section can make a basic low-pass or high-pass response.
An active circuit can isolate RC sections from a load and can make a higher-order response without an inductor.
The operational amplifier also introduces bandwidth, slew-rate, noise, output-current, and stability limits.

The page has five ordered parts: foundations, active-filter topologies, amplifier and component limits, converter applications, and design verification.
The explanations include passive RC building blocks, active first-order circuits, practical integrators, Sallen-Key filters, amplifier limits, noise control, converter filters, and a complete design procedure.

## Foundations

### 1. Frequency-Response Fundamentals

#### Why Sine Waves Are Useful

A linear circuit gives a sine-wave output for a sine-wave input.
The output has the same frequency as the input.
The circuit changes only the amplitude and phase.

For this reason, a set of sine-wave tests can describe a linear filter.
Apply one frequency at a time.
Measure the output-to-input amplitude ratio and the phase difference.
Repeat the measurement across the frequency range.

#### Frequency Response

The **frequency response** shows how circuit gain and phase change with frequency.
It has two parts:

* **Magnitude response:** The ratio of output amplitude to input amplitude.
* **Phase response:** The time or angular displacement between output and input.

A filter specification is incomplete if it gives only magnitude.
Phase affects waveform shape, feedback stability, channel matching, and time-domain settling.

#### Transfer Function

The **transfer function**, <i>H(s)</i>, is the output-to-input ratio in the frequency domain:

> **H(s) = Output(s) / Input(s)**

For a steady sine-wave analysis, set:

> **s = j&omega;**

Here, <i>j</i> is the imaginary operator and <i>&omega;</i> is angular frequency:

> **&omega; = 2&pi;f**

The magnitude is <i>|H(j&omega;)|</i>.
The phase is the angle of <i>H(j&omega;)</i>.

#### Decibels

The **decibel (dB)** is a logarithmic unit.
It makes large gain and attenuation ratios easier to compare.

For a power ratio:

> **dB = 10 log<sub>10</sub>(P<sub>2</sub> / P<sub>1</sub>)**

For an amplitude ratio, such as voltage when the impedances are equal:

> **dB = 20 log<sub>10</sub>(A<sub>2</sub> / A<sub>1</sub>)**

Useful values are:

* **+3 dB:** Approximately twice the power.
* **+6 dB:** Approximately twice the voltage amplitude.
* **-3 dB:** One-half the power and approximately 0.707 times the voltage amplitude.
* **+20 dB:** Ten times the voltage amplitude.
* **-20 dB:** One-tenth the voltage amplitude.

The nominal cutoff of many low-pass and high-pass filters is the **-3 dB frequency**.
This point is not an abrupt boundary.
Frequencies immediately beyond it still pass through the circuit with increasing attenuation.

#### Phase

**Phase** identifies a time difference between periodic signals.
A 90-degree phase difference is one-quarter of a cycle.
At this displacement, one sine wave can be at its maximum while the other crosses zero.

Use this relation to calculate the magnitude of phase difference from time delay:

> **|&phi;| = 360&deg; &times; f &times; t<sub>delay</sub>**

A constant time delay produces more phase shift when frequency increases.
For an output that lags the input, the signed output-to-input phase is negative.

### 2. Poles, Zeros, and Filter Order

#### Poles

A **pole** changes the asymptotic magnitude slope by -20 dB/decade.
It also adds phase lag.
The phase contribution of one well-separated pole approaches -90 degrees.

Poles can come from:

* A deliberate RC filter section.
* An operational-amplifier internal stage.
* Source resistance with input capacitance.
* Output resistance with load capacitance.
* Sensor capacitance.
* PCB and package parasitics.

A filter pole shapes the wanted response.
A pole inside a feedback loop can also decrease phase margin and cause oscillation.
Always distinguish the signal transfer function from the loop-gain transfer function.

#### Zeros

A **zero** changes the asymptotic magnitude slope by +20 dB/decade.
It can add phase lead.
The phase contribution of one well-separated left-half-plane zero approaches +90 degrees.

A resistor and capacitor in a feedback network can make a zero.
A correctly placed zero can improve phase margin.
A zero can also make a notch or cancel part of another response.
Do not cancel an uncertain pole with a precise theoretical zero without a tolerance analysis.

#### Filter Order

The **filter order** is the highest power of <i>s</i> in the transfer-function denominator after common pole-zero factors are canceled.
It is also the number of poles in that reduced denominator, counting multiplicity.
In a usual lumped filter, the order is frequently equal to the number of independent energy-storage elements.

For all-pole low-pass and high-pass responses:

* **First-order low-pass:** -20 dB/decade above the transition.
* **First-order high-pass:** +20 dB/decade below the transition as frequency increases.
* **Second-order low-pass:** -40 dB/decade above the transition.
* **Second-order high-pass:** +40 dB/decade below the transition as frequency increases.
* **Nth-order low-pass:** -20<i>N</i> dB/decade above the transition.
* **Nth-order high-pass:** +20<i>N</i> dB/decade below the transition as frequency increases.

A magnitude change of 20 dB/decade is approximately 6 dB/octave.

A higher order gives a sharper transition between passband and stopband.
It also increases component sensitivity, phase shift, settling complexity, and stability risk.

#### Q Factor and Damping

The **Q factor** controls damping in a second-order section.
Component ratios and amplifier gain set Q in a Sallen-Key circuit.

* A low Q gives a heavily damped response.
* A moderate Q can give a flat passband.
* A high Q can produce peaking near the natural frequency.

Do not select Q only from the desired magnitude plot.
Check overshoot, ringing, component tolerance, and operational-amplifier bandwidth.

### 3. Capacitor and RC Foundations

#### Core Capacitor Relations

A capacitor stores charge and energy in an electric field.
Use these ideal relations:

> **Q = CV**

> **i(t) = C &times; dV/dt**

> **E = (1/2)CV<sup>2</sup>**

A capacitor opposes a change in voltage.
Current must flow before the capacitor voltage can change.

#### Capacitor Impedance

The complex impedance of an ideal capacitor is:

> **Z<sub>C</sub> = 1 / (j&omega;C)**

Its magnitude is:

> **|Z<sub>C</sub>| = 1 / (2&pi;fC)**

At DC, ideal capacitor impedance is infinite.
The capacitor acts as an open circuit.
As frequency increases, impedance decreases.
At a sufficiently high frequency in the ideal model, the capacitor acts approximately as a short circuit.

A real capacitor stops following this ideal trend above its self-resonant frequency.

#### Capacitor Phase

For an ideal capacitor, current leads voltage by 90 degrees.
Voltage lags current by 90 degrees.

This phase relation lets capacitors make frequency-selective networks.
It also means that a capacitor in a feedback loop changes phase margin.

#### RC Time Constant

A capacitor does not charge instantly through a resistor.
The time constant is:

> **&tau; = RC**

For an initially discharged capacitor connected to a DC source through a resistor:

> **v<sub>C</sub>(t) = V<sub>S</sub>[1 - e<sup>-t/&tau;</sup>]**

Useful first-order milestones are:

* **1&tau;:** Approximately 63% of the final value.
* **3&tau;:** Approximately 95% of the final value.
* **5&tau;:** Approximately 99% of the final value.

These values also help estimate filter step response and settling.
A high-accuracy system can require more than five time constants.

#### RC Corner Frequency

The corner frequency of a first-order RC network is:

> **f<sub>c</sub> = 1 / (2&pi;RC)**

At <i>f<sub>c</sub></i>, the magnitude is -3 dB from the passband value.
The phase shift of a first-order low-pass filter is -45 degrees at this frequency.
The phase shift of a first-order high-pass filter is +45 degrees at this frequency.

### 4. Passive Low-Pass and High-Pass Building Blocks

#### RC Low-Pass Filter

An RC low-pass filter puts the resistor in series with the input and the capacitor from the output node to ground.
The output is across the capacitor.

Its transfer function is:

> **H<sub>LP</sub>(s) = 1 / (1 + sRC)**

Its magnitude is:

> **|H<sub>LP</sub>(j&omega;)| = 1 / &radic;[1 + (&omega;RC)<sup>2</sup>]**

Its phase is:

> **&phi;<sub>LP</sub> = -tan<sup>-1</sup>(&omega;RC)**

The operation changes with frequency:

1. At DC, the capacitor is open and the output follows the input.
2. Near the corner, the capacitor and resistor impedances are comparable.
3. Above the corner, capacitor impedance decreases.
4. High-frequency signal current goes through the capacitor.
5. The output amplitude decreases at 20 dB/decade.

The circuit smooths fast signals and passes DC.
It can average a **pulse-width modulation (PWM)** waveform.

<div className="component-wrapper">
  <RCLowPass />
</div>

#### RC High-Pass Filter

An RC high-pass filter puts the capacitor in series with the input and the resistor from the output node to ground.
The output is across the resistor.

Its transfer function is:

> **H<sub>HP</sub>(s) = sRC / (1 + sRC)**

Its magnitude is:

> **|H<sub>HP</sub>(j&omega;)| = &omega;RC / &radic;[1 + (&omega;RC)<sup>2</sup>]**

Its phase is:

> **&phi;<sub>HP</sub> = 90&deg; - tan<sup>-1</sup>(&omega;RC)**

The operation changes with frequency:

1. At DC, the series capacitor is open and the output is zero.
2. At low frequency, capacitor reactance is large and attenuation is high.
3. As frequency increases, capacitor reactance decreases.
4. More of the input appears across the resistor.
5. The output approaches the input at high frequency in the ideal unloaded model.

The circuit blocks DC and passes fast changes.

<div className="component-wrapper">
  <RCHighPass />
</div>

#### Loading Error

The simple transfer functions assume that the source impedance is small and the load impedance is large.
A real source resistance adds to the filter resistance.
A real load resistance changes the effective resistance at the output.

An active buffer can isolate the RC section from the source or load.
The buffer must have sufficient input impedance, output current, bandwidth, and stability.

### 5. Differentiators and Integrators

#### RC High-Pass as a Differentiator

At low frequency relative to its corner, the RC high-pass output is approximately proportional to input rate of change:

> **V<sub>out</sub> &asymp; RC &times; dV<sub>in</sub>/dt**

The step-by-step relation is:

1. A change in input voltage forces current through the series capacitor.
2. Capacitor current is <i>I<sub>C</sub> = C(dV<sub>in</sub>/dt)</i> for the approximation.
3. The same current flows through the output resistor.
4. The resistor voltage is <i>V<sub>out</sub> = RI<sub>C</sub></i>.
5. The output is proportional to the input derivative.

A rising edge makes a positive output pulse.
A falling edge makes a negative output pulse.
A high-pass differentiator changes a square wave into narrow spikes when the time constant is short relative to the pulse width.

#### RC Low-Pass as an Integrator

At high frequency relative to its corner, the RC low-pass output changes slowly compared with the input.
It can approximate an integrator:

> **V<sub>out</sub> &asymp; (1/RC) &int; V<sub>in</sub> dt**

The step-by-step relation is:

1. The resistor converts input voltage difference into current.
2. The capacitor receives approximately this current when the output is small relative to the input.
3. Capacitor voltage is the time integral of capacitor current divided by capacitance.
4. The output becomes the accumulated input.

For a sine wave, the circuit is a low-pass filter.
For a square wave in its integration range, the output approaches a triangle or ramp.

#### Approximation Limits

The differentiator and integrator equations apply only when the frequency and loading conditions support the approximation.
Near the corner, use the complete transfer function.

An ideal differentiator amplifies high-frequency noise without limit.
An ideal integrator has infinite DC gain and saturates from very small DC errors.
Practical circuits limit both behaviors.

## Active-Filter Topologies

### 6. Active First-Order Filters

#### Why Add an Operational Amplifier

An operational amplifier can:

* Buffer a passive RC section.
* Add passband gain.
* Give a low output impedance.
* Isolate cascaded filter sections.
* Make an inverting low-pass or high-pass response.
* Make a practical integrator or differentiator.

The amplifier does not remove loading and bandwidth constraints.
It replaces them with active-device limits that must be included in the design.

#### Feedback Capacitor as a Low-Pass Filter

Put a **feedback capacitor**, <i>C<sub>f</sub></i>, in parallel with the **feedback resistor**, <i>R<sub>f</sub></i>, of an inverting amplifier.
The feedback impedance is:

> **Z<sub>f</sub> = R<sub>f</sub> / (1 + sR<sub>f</sub>C<sub>f</sub>)**

With input resistor <i>R<sub>in</sub></i>, the transfer function is:

> **H(s) = -[R<sub>f</sub>/R<sub>in</sub>] / (1 + sR<sub>f</sub>C<sub>f</sub>)**

The pole is:

> **f<sub>p</sub> = 1 / (2&pi;R<sub>f</sub>C<sub>f</sub>)**

The circuit operates in this sequence:

1. At low frequency, the capacitor impedance is high.
2. The resistor mainly sets the feedback impedance and closed-loop gain.
3. At high frequency, capacitor impedance decreases.
4. The feedback impedance decreases.
5. The magnitude of closed-loop gain decreases.

This action prevents amplification of high-frequency noise and radio interference.

#### Three Different Jobs for a Feedback Capacitor

A capacitor across <i>R<sub>f</sub></i> can do three different jobs.

##### Noise Filtering

A capacitor in the nF range can deliberately make an active low-pass response.
It reduces high-frequency closed-loop gain.

##### Stability Compensation

A sensor, such as a photodiode, can add input capacitance and phase delay.
A small capacitor, such as 10 pF, can change noise gain and restore phase margin when correctly selected.
It also limits high-frequency bandwidth.

The capacitor does not make feedback instantaneous.
Its decreasing impedance makes a controlled high-frequency feedback path.

##### Practical Integration

A feedback capacitor can make an integrator.
A large parallel resistor, frequently in the M&Omega; range, gives a DC feedback path.

Component value gives a preliminary indication of function:

* A pF capacitor frequently controls stability.
* An nF capacitor can make a low-pass filter.
* A large parallel resistor can limit integrator DC gain.

Calculate the pole, zero, noise gain, and required bandwidth.
Do not identify a component function only from its value.

### 7. AC-Amplifier Low-Frequency Responses

The archived figure contains two AC-amplifier examples.
Circuit A uses an input coupling capacitor.
Circuit B changes gain with frequency but does not block input DC.

#### Circuit 1: High-Pass Input

A high-pass RC network drives a non-inverting amplifier.
The capacitor blocks DC.
The circuit amplifies signals above the input corner frequency.

The source resistance, bias-return resistance, and amplifier input impedance set the actual corner.
Include all three in the calculation.

In the archived circuit, <i>C<sub>1</sub> = 0.1 &micro;F</i> and <i>R<sub>1</sub> = 100 k&Omega;</i>.
These values give a nominal corner near 15.9 Hz.
The 18 k&Omega; and 2 k&Omega; gain resistors give a high-frequency gain of 10.

#### Circuit 2: Unity DC Gain and Higher AC Gain

The second circuit makes the gain frequency dependent.
At DC, the capacitor blocks the resistor path.
The gain approaches:

> **1 + R<sub>2</sub>/&infin; = 1**

At higher frequency, the capacitor passes the signal through the gain-setting path.
The circuit then approaches its usual AC gain.

The archived circuit uses <i>R<sub>1</sub> = 2 k&Omega;</i>, <i>R<sub>2</sub> = 18 k&Omega;</i>, and <i>C<sub>1</sub> = 4.7 &micro;F</i>.
Its gain starts at 1 at DC and approaches 10 at high frequency.
The gain transition has a zero near 1.69 Hz and a pole near 16.9 Hz.
This circuit is a shelving high-pass amplifier.
It does not block DC at its signal input.

Its transfer function is:

> **H(s) = [1 + sC<sub>1</sub>(R<sub>1</sub> + R<sub>2</sub>)] / (1 + sR<sub>1</sub>C<sub>1</sub>)**

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/AcAmplifierFigure4.7.png')}
    alt="Two non-inverting AC-amplifier circuits with different low-frequency responses"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '700px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Two AC-amplifier circuits that use capacitors to set their low-frequency response. Circuit A blocks input DC. Circuit B keeps a signal gain of 1 at DC and increases the gain toward 10 at high frequency. Image source: <i>The Art of Electronics</i>, Figure 4.7.
  </figcaption>
</figure>

#### Bias-Current Path for an AC-Coupled Input

An AC-coupled op-amp input still needs a DC bias-current path.
Without this path, input bias current can move the input and output into saturation.
Make sure that the bias-return resistance does not make an unwanted corner or excessive noise.

### 8. Practical Active Integrator

#### Ideal Integrator

An ideal inverting integrator has an input resistor and only a capacitor in the feedback path.
Its transfer function is:

> **H(s) = -1 / (sRC)**

For a constant input:

> **dV<sub>out</sub>/dt = -V<sub>in</sub> / RC**

At DC, the ideal feedback capacitor is open.
The circuit has no DC negative feedback.
Input offset voltage and bias current then move the output into saturation.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/integratorFigure4.16.png')}
    alt="Ideal operational-amplifier integrator with an input resistor and a capacitor-only feedback path"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '420px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Ideal capacitor-only feedback integrator. Image source: <i>The Art of Electronics</i>, Figure 4.16. The image shows no parallel feedback resistor and no reset switch.
  </figcaption>
</figure>

#### Add a Parallel Feedback Resistor

Put a large resistor in parallel with the feedback capacitor.
The resistor gives the circuit a DC feedback path.
It limits DC gain and decreases drift into saturation.

The practical integrator behaves as:

* An inverting amplifier at very low frequency.
* A transition response near the feedback pole.
* An approximate integrator above that pole and below the amplifier limits.

The archive image above does not show this parallel resistor.
Add the resistor as a separate practical modification.
With input resistor <i>R<sub>in</sub></i> and parallel feedback resistor <i>R<sub>f</sub></i>, the transfer function is:

> **H(s) = -[R<sub>f</sub>/R<sub>in</sub>] / (1 + sR<sub>f</sub>C)**

The lower transition frequency is:

> **f<sub>L</sub> = 1 / (2&pi;R<sub>f</sub>C)**

Above <i>f<sub>L</sub></i> and below the amplifier limits, the response approaches <i>-1/(sR<sub>in</sub>C)</i>.

#### Integrator Numeric Example

Assume:

* <i>V<sub>in</sub> = 1 V</i>.
* <i>R = 1 M&Omega;</i>.
* <i>C = 1 &micro;F</i>.

The output slope is:

> **dV<sub>out</sub>/dt = -(1 V) / [(1 M&Omega;)(1 &micro;F)] = -1 V/s**

For the ideal capacitor-only circuit, the output decreases at 1 V/s until a supply or circuit limit stops it.
For a practical <i>R<sub>f</sub> || C</i> feedback network, this slope is the initial approximation when <i>t &ll; R<sub>f</sub>C</i>.
For zero initial output and a constant input, the response approaches:

> **V<sub>out</sub>(t) = -[R<sub>f</sub>/R<sub>in</sub>]V<sub>in</sub>[1 - e<sup>-t/(R<sub>f</sub>C)</sup>]**

A switch can short the capacitor and reset the integrator.
The parallel resistor supplies DC feedback when the reset switch is open.

#### Inductive-Load Compensation

An inductive load, such as an MRI coil, adds a pole to a feedback loop.
The additional pole can cause oscillation.
One compensation method makes the amplifier behave as an integrator at low frequency.
Verify stability across the complete load and operating range.

### 9. Practical Active Differentiator

An ideal inverting differentiator puts a capacitor at the input and a resistor in the feedback path.
Its ideal transfer function is:

> **H(s) = -sR<sub>f</sub>C<sub>in</sub>**

The magnitude increases with frequency.
This behavior also amplifies wideband noise, switching edges, and parasitic coupling.

A practical differentiator limits its low-frequency and high-frequency gain.
Use a resistor in series with the input capacitor and a capacitor across the feedback resistor.
These parts make a finite band in which differentiation is approximately valid.

Check:

* Input and feedback corner frequencies.
* Noise gain.
* Operational-amplifier gain-bandwidth product.
* Slew rate.
* Source impedance.
* Input capacitance.
* Output noise and stability.

Use the complete transfer function near either corner.

### 10. Sallen-Key Second-Order Low-Pass Filter

A first-order passive RC filter has a gradual transition between passband and stopband.
A **Sallen-Key low-pass filter** makes a second-order response with an operational amplifier, two resistors, and two capacitors.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SallenKeyLowPassFigure4.42.png')}
    alt="Unity-gain Sallen-Key active low-pass filter and comparison response curves"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '590px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    The upper diagram is the exact unity-gain Sallen-Key low-pass topology. The lower plot compares example Sallen-Key responses with two cascaded passive RC sections. The figure does not specify component values or Q. Image source: <i>The Art of Electronics</i>, Figure 4.42.
  </figcaption>
</figure>

#### Step-by-Step Second-Order Operation

1. At low frequency, C2 has high impedance and draws little current to ground.
2. The amplifier output follows the filtered input node at the selected passband gain.
3. C1 connects the intermediate node to that output.
4. The voltage across C1 is small in the low-frequency passband, so the bootstrap action decreases its loading effect.
5. As frequency increases, C2 impedance decreases and the output amplitude decreases.
6. The voltage across C1 then increases, and C1 carries more current from the intermediate node.
7. The two capacitor currents produce the second-order denominator and the 40 dB/decade final attenuation slope.

The resistor-capacitor products set the natural frequency.
Component ratios and, in non-unity-gain variants, amplifier gain set Q.
Q controls passband flatness, cutoff peaking, overshoot, and ringing.

#### Natural Frequency

For a common Sallen-Key low-pass arrangement, the natural frequency is:

> **f<sub>0</sub> = 1 / [2&pi;&radic;(R<sub>1</sub>R<sub>2</sub>C<sub>1</sub>C<sub>2</sub>)]**

For the unity-gain follower circuit in Figure 4.42:

> **H(s) = 1 / [1 + sC<sub>2</sub>(R<sub>1</sub> + R<sub>2</sub>) + s<sup>2</sup>R<sub>1</sub>R<sub>2</sub>C<sub>1</sub>C<sub>2</sub>]**

> **Q = &radic;(R<sub>1</sub>R<sub>2</sub>C<sub>1</sub>C<sub>2</sub>) / [C<sub>2</sub>(R<sub>1</sub> + R<sub>2</sub>)]**

Equal resistor and capacitor values give <i>Q = 0.5</i> in this pictured unity-gain circuit.
With equal resistors, <i>C<sub>1</sub> = 2C<sub>2</sub></i> gives the Butterworth value <i>Q = 1/&radic;2</i>.

The exact Q expression changes when the component arrangement or amplifier gain changes.
Use the equation for the selected topology.
Do not apply an equal-component Q equation to a different circuit.

#### General Second-Order Form

A standard second-order low-pass denominator is:

> **H(s) = K&omega;<sub>0</sub><sup>2</sup> / [s<sup>2</sup> + (&omega;<sub>0</sub>/Q)s + &omega;<sub>0</sub><sup>2</sup>]**

A standard second-order high-pass response is:

> **H(s) = Ks<sup>2</sup> / [s<sup>2</sup> + (&omega;<sub>0</sub>/Q)s + &omega;<sub>0</sub><sup>2</sup>]**

Here:

* <i>K</i> is passband gain.
* <i>&omega;<sub>0</sub></i> is natural angular frequency.
* <i>Q</i> is quality factor.

The damping ratio is:

> **&zeta; = 1 / (2Q)**

At <i>&omega; = &omega;<sub>0</sub></i>, both standard responses have magnitude <i>KQ</i>.
The natural frequency <i>f<sub>0</sub></i> is the -3 dB cutoff only when <i>Q = 1/&radic;2</i>.
For other Q values, <i>f<sub>0</sub></i> and the -3 dB cutoff are different.

* **Q &lt; 0.5:** The response is overdamped.
* **Q = 0.5:** The response is critically damped.
* **Q &gt; 0.5:** The response is underdamped.
* **Q &gt; 1/&radic;2:** The magnitude has a peak above the passband gain.

The second-order low-pass slope approaches -40 dB/decade above the transition.
The second-order high-pass slope approaches +40 dB/decade below the transition as frequency increases.
The magnitude change is approximately 12 dB/octave.

#### Operational-Amplifier Requirements

The amplifier must have:

* Gain-bandwidth product well above the filter frequency.
* Sufficient phase margin at the selected noise gain.
* Sufficient slew rate for the largest output.
* Input and output range that includes the signal.
* Output current for the connected network and load.
* Noise low enough for the signal band.

An ideal RC calculation does not include operational-amplifier gain and phase error.
Verify the response with the amplifier open-loop model.

### 11. Interactive Response Comparison

<ActiveFilterResponseExplorer />

The explorer shows the exact ideal response for the selected first-order or second-order model.
It identifies magnitude, phase, cutoff frequency, natural frequency, Q, damping, and peaking.
The component and operational-amplifier limitations in the next sections still apply.

## Amplifier and Component Limits

### 12. Operational-Amplifier Gain and Bandwidth

#### Open-Loop Response

A real voltage-feedback operational amplifier usually has a low-pass open-loop response.
Its **open-loop gain** is high at DC and decreases as frequency increases.

Example teaching values:

* Open-loop gain can be 100,000 up to 10 Hz.
* Available gain can decrease to 100 at 10 kHz.
* Feedback sets a closed-loop gain of 10.
* Near 100 kHz, available open-loop gain can decrease below 10.

A lower closed-loop gain usually permits a wider closed-loop bandwidth.
Increasing the closed-loop gain usually decreases the available closed-loop bandwidth.

<GainBandwidthGraph />

The graph uses a first-order teaching model.
Use the selected amplifier datasheet for the real open-loop magnitude and phase.

#### Gain-Bandwidth Estimate

For a single-pole voltage-feedback amplifier, the **gain-bandwidth product (GBW)** gives this estimate:

> **Closed-loop bandwidth &asymp; GBW / noise gain**

Use **noise gain**, not signal gain, when the two values differ.
A filter capacitor can make noise gain change with frequency.

High gain-bandwidth product is also useful at low signal frequency.
Spare loop gain improves gain accuracy, linearity, and distortion.

#### Decompensated Amplifiers

Some high-speed amplifiers are not stable at a closed-loop gain of one.
They require a minimum noise gain.
Example minimum-gain requirement:

> **A<sub>V</sub> &ge; 10**

Do not use a decompensated amplifier as a unity-gain Sallen-Key buffer unless the datasheet permits it.

#### Phase-Accuracy Rules

For good phase accuracy, select an amplifier bandwidth 50 to 100 times higher than the signal frequency.
Video circuits frequently require this accuracy.

For amplitude accuracy without strict phase accuracy, a bandwidth 10 times higher than the signal frequency can be sufficient.
These are selection rules, not guarantees.
Verify closed-loop gain and phase at the required frequency.

### 13. Slew Rate and Full-Power Bandwidth

**Slew rate** is the maximum output-voltage change for each unit of time.
Datasheets usually specify it in V/&micro;s.

A high-frequency, high-amplitude signal can exceed this limit.
The output then becomes more triangular than sinusoidal.

For a sine-wave output:

> **Maximum |dV/dt| = 2&pi;fV<sub>PK</sub>**

The required slew rate is:

> **SR &ge; 2&pi;fV<sub>PK</sub>**

The equivalent peak-to-peak limit in the precision notes is:

> **V<sub>PP</sub> = SR / (&pi;f)**

#### Internal Cause

In many voltage-feedback amplifiers, the input stage charges or discharges an internal compensation capacitor.
The available current limits the rate:

> **dV/dt = I/C**

A rough rule for one conventional bipolar-junction-transistor (**BJT**) input architecture is:

> **Slew rate [V/&micro;s] &asymp; 0.3 &times; bandwidth [MHz]**

The exact coefficient depends on the amplifier model.
Use the datasheet slew-rate specification for the design.

#### Slew-Rate Enhancement Examples

Examples of slew-enhancement designs:

* **LF411:** A junction-field-effect-transistor (**JFET**) input design with an enhancement factor of approximately 12.
* **TLE2142 and OP275:** Cross-coupled or Butler stages that increase current available to the compensation capacitor.
* **LT1210:** A current-feedback amplifier with an enhancement factor greater than 55.

Current-feedback amplifiers can support large-signal slew rates that exceed many voltage-feedback devices.
For precision DC use, check input bias current, offset, drift, required feedback resistance, gain dependence, and noise.

### 14. Feedback Stability and Phase Margin

#### Loop-Gain Condition

**Frequency compensation** changes loop gain and phase to improve stability and reduce oscillation risk.
Phase shift can change negative feedback into positive feedback at high frequency.

Oscillation can occur when:

* Total loop phase shift approaches 180 degrees.
* Loop gain remains greater than one.

The critical crossover is where loop gain equals one.
The total phase includes the operational amplifier and the external filter network.

#### Phase Margin

**Phase margin** is the remaining phase before the loop reaches 180 degrees at unity loop gain.

A one-pole response can approach -90 degrees and can give approximately 90 degrees of phase margin.
Real amplifiers have more poles and smaller margins.

Common approximate design targets are:

* **45 degrees:** More bandwidth, but more overshoot and ringing.
* **60 degrees:** A common robust target with less overshoot.

The complete pole and zero locations set the actual margin.

#### Rate of Closure

The **rate-of-closure method** compares open-loop gain and noise-gain slopes near their intersection.
A larger slope difference usually indicates less phase margin.

Use:

> **f = 1 / (2&pi;RC)**

to calculate the RC corners in the noise-gain plot.

#### Dominant-Pole Compensation

A **dominant pole** makes open-loop gain decrease before higher poles become important.
The loop reaches unity gain before total phase approaches 180 degrees.

Without sufficient compensation:

1. Gain can first decrease at 20 dB/decade.
2. A second pole can change the slope to 40 dB/decade.
3. Phase can approach 180 degrees while loop gain is greater than one.
4. The circuit can oscillate.

With dominant-pole compensation:

1. The first roll-off starts at a lower frequency.
2. Phase remains nearer -90 degrees through much of the useful loop-gain range.
3. The lower roll-off frequency decreases available high-frequency gain and bandwidth but increases phase margin.

Do not add an arbitrary output capacitor as compensation.
Some operational amplifiers include internal dominant-pole compensation.
Use a calculated network or a datasheet-approved load.

Do not add load capacitance to force the unity-gain crossover near the first corner.
This method can destabilize many operational amplifiers.
Use it only when the applicable datasheet explicitly permits the load.

#### Lead and Lag Compensation

**Lead compensation** adds phase lead to oppose phase lag.
**Lag compensation** decreases high-frequency gain.
A Bode plot shows whether the network changes the intended signal response, the noise gain, or both.

### 15. Capacitive-Load Stability

A capacitive load reacts with operational-amplifier output impedance.
The interaction adds a pole and phase lag.

Open-loop output impedance can be hundreds of ohms.
Closed-loop output impedance usually rises as loop gain decreases at high frequency.
The rising output impedance can look inductive.
With a load capacitor, it can make a resonant circuit.

#### Stability Methods

1. **Isolation resistor:** Put a series resistor, such as 50 &Omega;, between the amplifier output and load capacitor.
2. **Feedback point:** Feedback before the resistor usually protects stability.
   Feedback after the resistor corrects voltage drop but can decrease stability.
3. **Closed-loop gain:** Use the stable gain range in the datasheet.
4. **Load range:** Check the specified load-capacitance range.
   A device-specific example in the notes specifies <i>C<sub>load</sub> &gt; 1 &micro;F</i>.
   Do not apply this value to a different amplifier.
5. **In-loop buffer:** A buffer can drive the capacitive load inside the main loop.
   Its phase shift becomes part of the loop.
6. **Buffer bandwidth:** The buffer usually needs more bandwidth than the main amplifier.

Feedback does not decrease output impedance in every circuit.
A current-source topology can use feedback to increase output impedance.
Analyze the closed-loop transfer and load interaction for the selected topology.

#### Transient Check

Apply a small square wave.
Look for overshoot, ringing, slow settling, or sustained oscillation.

Small positive phase margin usually gives more overshoot and ringing.
Zero or negative phase margin can cause sustained oscillation.
Repeat the test across supply, load, gain, and temperature limits.

### 16. Filter Noise and Bandwidth

#### Integrated White Noise

The **voltage-noise density**, <i>e<sub>n</sub></i>, is noise in a 1 Hz bandwidth.
Its unit is nV/&radic;Hz.

For flat white-noise density across bandwidth <i>BW</i>:

> **V<sub>total</sub> = e<sub>n</sub>&radic;BW**

Example calculation:

* Circuit bandwidth: 100 kHz.
* Amplifier noise density: 10 nV/&radic;Hz.

The total is:

> **10 nV &times; &radic;100,000 = 10 nV &times; 316 &asymp; 3.16 &micro;V**

The bandwidth multiplies the density value by more than 300.
The 3.16 &micro;V result is a substantial fraction of a 10 &micro;V EEG signal.
Other noise sources can make the signal difficult to measure.

An active low-pass filter reduces integrated noise by reducing noise bandwidth.
Do not assume that its -3 dB bandwidth equals its exact equivalent noise bandwidth.
The relation depends on filter shape and order.

#### General Noise Integration

If <i>e<sub>n,out</sub>(f)</i> is the total output-referred, frequency-dependent noise density:

> **V<sub>n,out,rms</sub> = &radic;[&int;<sub>f1</sub><sup>f2</sup> e<sub>n,out</sub><sup>2</sup>(f) df]**

Calculate 1/f and broadband noise.
Combine independent RMS results by root sum square.

#### Resistor and Current Noise

Every resistor has **thermal-noise voltage density**:

> **e<sub>R</sub> = &radic;(4kTR)**

Here, <i>k</i> is Boltzmann's constant, <i>T</i> is absolute temperature, and <i>R</i> is resistance.
Operational-amplifier **current-noise density**, <i>i<sub>n</sub></i>, produces voltage noise across the source and filter impedance.
For a simple resistive source <i>R<sub>S</sub></i>, an input-referred approximation is:

> **e<sub>total</sub><sup>2</sup>(f) = e<sub>n</sub><sup>2</sup>(f) + [i<sub>n</sub>(f)R<sub>S</sub>]<sup>2</sup> + 4kTR<sub>S</sub>**

A reactive filter network has a frequency-dependent impedance.
Calculate the noise from each resistor and amplifier-noise source separately.
Apply the applicable noise transfer function to each source, integrate across frequency, and combine the independent RMS results by root sum square.

#### 1/f Noise and Named Devices

Noise density increases below the **1/f corner**.
The 1 kHz white-noise value can give an incorrect result for a low-frequency filter.

Example device data:

* **LT1012:** 14 nV/&radic;Hz white noise and a 2.5 Hz corner.
* **OPA277:** 8 nV/&radic;Hz white noise and a 20 Hz corner.

The LT1012 can have less low-frequency noise even though its white-noise density is higher.

Auto-zero and chopper amplifiers can suppress the conventional low-frequency 1/f rise.
Some devices keep an approximately flat noise density toward DC.
Use the applicable datasheet curve because the exact response depends on the device.
Their internal switching can add clock feedthrough.
A low-pass filter can decrease this feedthrough when the signal bandwidth permits it.

#### Photodiode and Transimpedance Noise

At high frequency, amplifier voltage noise interacts with sensor input capacitance and produces an equivalent current-noise density:

> **i<sub>eq</sub> = e<sub>n</sub> &times; 2&pi;fC<sub>in</sub>**

This equivalent current noise can exceed feedback-resistor noise in a high-speed photodiode circuit.
A correctly selected feedback capacitor can limit high-frequency noise gain and restore phase margin.
Calculate the value from photodiode capacitance, amplifier input capacitance, feedback resistance, and gain-bandwidth product.

#### Settling-Time and Noise-Bandwidth Trade-Off

A successive-approximation-register analog-to-digital converter (**SAR ADC**) driver needs enough bandwidth to settle input kickback.
More bandwidth also passes more noise.

For example, a 100 MHz driver can pass noise far above a 100 kHz signal band.
Balance settling time and integrated noise.

### 17. Component Nonidealities and Parasitics

#### Equivalent Series Resistance

**Equivalent series resistance (ESR)** represents conductor resistance and dielectric loss.
It produces heat and changes damping.

For ripple current:

> **P = I<sub>RMS</sub><sup>2</sup>ESR**

In a signal filter, ESR can reduce Q.
It can also add a zero or change attenuation.

Some older low-dropout regulators need a minimum ESR for stability.
Replacing their tantalum capacitor with a near-zero-ESR ceramic can cause oscillation.

#### Equivalent Series Inductance

**Equivalent series inductance (ESL)** comes from leads and internal geometry.
It limits high-frequency capacitor performance.

Below self-resonance, the device is capacitive.
At self-resonance, its impedance reaches a minimum that is approximately ESR in the simple series model.
Above self-resonance, the device behaves as an inductor and filters high-frequency noise less effectively.

#### Package and Placement

A 1206 capacitor usually has more ESL than a 0402 or 0201 capacitor.
Use a small package near a high-frequency current path.

Example parallel-capacitor set:

* A 10 &micro;F bulk capacitor for lower-frequency current changes.
* A 0.1 &micro;F ceramic capacitor for higher-frequency current changes.

In this example, the 0.1 &micro;F part can stay capacitive to approximately 100 MHz.
A small 0402 part can filter better than a large 1206 part in a GHz design because layout inductance is lower.

#### Voltage Coefficient and Input Capacitance

High-K ceramic capacitance changes with DC bias.
This change moves filter cutoff and Q as signal voltage changes.

The **OPA1641** is an example of this effect.
Its JFET input capacitance can change with common-mode voltage when the source impedance is high.
The changing capacitance changes filter cutoff and signal phase.
Distortion can increase from 20 ppm to 100 ppm.

Use an inverting configuration with nearly constant common-mode voltage or match source impedances closely when this effect is important.

#### Tolerance and Temperature

Resistor and capacitor tolerance move pole and zero frequencies.
Temperature coefficient moves them as temperature changes.
Second-order Q can be more sensitive than the natural frequency.

Run a worst-case or Monte Carlo analysis.
Include operational-amplifier gain, phase, bias current, offset, input capacitance, and output impedance.

#### Leakage and Dielectric Absorption

A real capacitor has leakage current and finite insulation resistance.
Leakage changes long RC time constants and makes an integrator drift.

**Dielectric absorption** stores part of the charge in slow dielectric processes.
After discharge, some voltage can return.
This memory effect causes errors in long-period integrators and sample-and-hold circuits.

Use low-leakage parts and include board-surface leakage in high-impedance designs.
Use a dielectric with low absorption when the stored voltage must remain accurate.

#### Piezoelectric and Microphonic Noise

High-K ceramic capacitors, including X7R, Z5U, and Y5V types, can be piezoelectric.
Mechanical vibration can produce an electrical signal.
An applied AC voltage can also make the capacitor move.

Use **C0G/NP0 ceramic** or a suitable **film capacitor** in precision filter and timing paths when the required value and size permit it.

## Converter Applications

### 18. Anti-Alias Filters for ADCs

#### Nyquist and Aliasing

For a baseband signal:

> **f<sub>s</sub> &gt; 2f<sub>max</sub>**

If the analog input contains energy above the permitted limit, sampling can create a false lower-frequency signal.
This false signal is an **alias**.

Noise at 50 MHz can affect a 100 kHz measurement if the sampling system aliases it.
After aliasing occurs, a digital filter cannot identify the original out-of-band signal.
Install an analog **anti-alias filter** before the ADC.

#### Guard Band

A real filter changes gradually from passband to stopband.
Do not put its corner at <i>f<sub>s</sub>/2</i> and assume that all higher frequencies stop.

The nominal corner is usually the -3 dB point.
Frequencies immediately above the corner still pass.
Even a six-pole Butterworth filter has a finite transition band.

Use **oversampling** to make a guard band.
Example: Run the sample clock 25% faster than the theoretical minimum.
Putting a -3 dB corner at the edge of the required signal band gives 3.01 dB of loss at that edge.
Use this location only when the passband specification permits the loss.
Select the passband edge, stopband edge, order, and corner from the actual attenuation requirements.
The guard band must let the filter reach the necessary stopband attenuation before aliasing can enter the required band.

The Sallen-Key circuit in this page is one active low-pass building block.
It is not a complete guarantee that an ADC alias specification is met.

#### Bandpass Sampling Requires a Selective Filter

**Undersampling**, or **bandpass sampling**, intentionally maps a selected high-frequency band to a lower digital band.
It does not remove the analog-filter requirement.
Install a selective bandpass filter before the ADC so that unwanted bands and noise cannot map into the same digital frequencies.

For example, a 495 MHz to 505 MHz signal has a 10 MHz information bandwidth.
A 120 Msps sample rate maps the complete band to 15 MHz to 25 MHz.
A 200 Msps rate maps the 500 MHz carrier to 100 MHz, but the complete 495 MHz to 505 MHz band crosses a Nyquist-zone boundary and overlaps itself.
Do not use the 200 Msps plan for this exact band.

The ADC track-and-hold bandwidth must also include the original carrier frequency.
The **ADC08200** samples at 200 Msps and has approximately 500 MHz of analog input bandwidth.
This bandwidth lets its track-and-hold circuit respond near 500 MHz, but the selected sample rate and input filter must still prevent spectral overlap.

#### Oversampling, Digital Filtering, and Decimation

Example oversampling ratio: Use a 15 MHz sample rate for a 100 kHz signal.
Oversampling can:

* Spread uncorrelated quantization noise across a wider range.
* Reduce in-band noise density after filtering.
* Move the first Nyquist boundary farther from the signal.
* Permit a simpler analog anti-alias filter for some requirements.

The sequence is:

1. **Oversample:** Operate the ADC faster than the final data rate.
2. **Analog filter:** Attenuate signals that could alias during sampling.
3. **Digital low-pass filter:** Remove digital noise above the final signal band.
4. **Decimate:** Reduce the output sample rate after filtering.

Example decimation: Keep one output for each 100 input samples when the digital filter permits this ratio.
A digital filter cannot remove interference that already aliased into the same baseband frequency.

For suitable uncorrelated quantization noise and signal bandwidth <i>B<sub>signal</sub></i>:

> **Signal-to-noise-ratio (SNR) improvement = 10 log<sub>10</sub>[f<sub>sample</sub> / (2B<sub>signal</sub>)]**

Doubling the sample rate can improve SNR by approximately 3 dB, or one-half bit.
Increasing the oversampling ratio by four can improve resolution by approximately one bit.

Clock jitter, distortion, correlated error, and analog noise can prevent the theoretical improvement.

### 19. High-Speed ADC Driver Filters

A modern high-speed ADC has dynamic input impedance.
Do not connect it directly to an arbitrary operational-amplifier output.

#### Differential 2R + C Network

A common differential interface uses two resistors and one capacitor.
This **2R + C low-pass filter** has three functions:

1. **Limit noise bandwidth:** It attenuates noise before that noise can alias into the signal band.
2. **Supply local charge:** The capacitor supplies part of the current pulse when the ADC sample switch closes.
3. **Isolate the driver:** The resistors separate the amplifier outputs from the capacitor and switched ADC input.

Example converter conditions:

* Sample rate: 80 Msps.
* Nyquist frequency: 40 MHz.
* ADC analog input bandwidth: 700 MHz.

Without a filter, noise across much of the 700 MHz input bandwidth can fold into baseband and reduce the SNR.
Do not interpret this example as a requirement to put the corner exactly at 40 MHz.
Include a guard band and required stopband attenuation.

#### Driver Stability

An operational amplifier with approximately 1000 MHz bandwidth can still be unstable with a capacitive load.
The load capacitor and open-loop output impedance add a pole and decrease phase margin.

Install an isolation resistor.
Take ordinary feedback before that resistor when this is the specified topology.
Feedback after the resistor can put the capacitor inside the loop and can cause oscillation without a method such as dual feedback.

#### Differential Drive

Use a differential driver for a high-performance differential ADC unless the datasheet permits the required single-ended performance.
Single-ended drive can:

* Prevent cancellation of even-order distortion.
* Reduce the full-scale differential input range by one-half.

### 20. Digital-to-Analog Converter (DAC) Reconstruction and PWM Smoothing

#### Delta-Sigma Reconstruction

A delta-sigma DAC uses oversampling and noise shaping.
A 1-bit output variant produces a high-rate sequence with two amplitude states.

The reconstruction sequence is:

1. The converter operates at a high clock rate.
2. Each output bit interval has the same duration.
3. The input code controls the output state in each interval.
4. Consecutive intervals with the same state can form a longer high or low run.
5. A low-pass **reconstruction filter** removes high-frequency switching content.
6. The filter produces a smooth analog output.

Set the filter cutoff well below the clock frequency.
Keep the required signal band inside the passband.

The **ADI AD1955** is a multibit delta-sigma DAC.
It supports 24-bit pulse-code-modulation (PCM) audio at sample rates as high as 192 kHz.
Its specified stereo dynamic range is 120 dB for the applicable test conditions.
The term **1-bit DAC** does not apply to its multibit output stage.

#### Delta-Sigma Noise Warning

Delta-sigma devices can have excellent linearity in audio-band applications.
Check broadband noise and clock noise.

The **TI DAC1220** example has a noise density of approximately 1000 nV/&radic;Hz.
An example resistor-ladder DAC has approximately 10 nV/&radic;Hz.
A reconstruction filter cannot correct unsuitable DC drift, differential nonlinearity (**DNL**), or in-band noise.

#### PWM as a DAC

A low-pass filter can average a PWM waveform into an analog value.
For a PWM output that switches between 0 V and <i>V<sub>HIGH</sub></i>, the ideal average is:

> **V<sub>AVG</sub> = D &times; V<sub>HIGH</sub>**

Here, <i>D</i> is duty cycle from 0 to 1.

PWM is widely used in Class D amplifiers.
Digital counters can generate PWM.
The PWM signal can command MOSFET power switches.

For <i>N</i> timer steps and clock frequency <i>f<sub>clk</sub></i>:

> **f<sub>PWM</sub> = f<sub>clk</sub> / N**

An increase in <i>N</i> increases resolution.
It decreases PWM cycle frequency and available signal bandwidth.

The smoothing-filter trade is:

* A lower cutoff gives less switching ripple.
* A lower cutoff gives a slower response.
* A higher cutoff gives faster response.
* A higher cutoff passes more carrier ripple and harmonics.

If PWM is inside a feedback loop, a lower PWM cycle rate reduces possible loop bandwidth and loop gain.

### 21. Precision Reference and Noise Filters

The voltage reference can be the largest noise and drift source in a precision converter.
Example reference-noise budget:

* Reference low-frequency noise: approximately 2 &micro;V.
* Buffer-amplifier contribution: approximately 0.1 &micro;V.

Use an RC filter to reduce reference broadband noise.
For very low noise, multiple references can operate in parallel to average uncorrelated noise.
Verify that the selected references permit parallel operation.

The **LTC2656** includes a reference and output amplifiers.
In the retained comparison, its noise is approximately four times higher than a selected discrete design.

#### Reference-Filter Constraints

The reference filter must:

* Settle after ADC or DAC charge transients.
* Remain stable with the bypass capacitor.
* Supply required dynamic current.
* Keep DC error, drift, and long-term drift within the budget.

A large filter capacitor can have leakage current.
In a precision reference circuit, bootstrap the lower capacitor terminal when the topology permits it.
Approximately zero DC voltage across the capacitor gives approximately zero DC leakage current.

For a quasi-static application, limit bandwidth deliberately.
Example: Use a 1 kHz roll-off to reduce high-frequency reference noise and DAC glitches.

An auto-zero or chopper amplifier can add clock feedthrough.
A low-pass filter can reduce this feedthrough when the required signal band is slow.

## Design and Verification

### 22. Select the Operational Amplifier

Check these parameters:

1. **Gain-bandwidth product:** Include filter noise gain and required loop gain.
2. **Slew rate:** Use the maximum signal amplitude and frequency.
3. **Stability:** Check minimum stable gain and capacitive-load range.
4. **Input range:** Include common-mode voltage and supply limits.
5. **Output range:** Include load current and output swing.
6. **Voltage and current noise:** Integrate them through the actual noise-gain response.
7. **Input bias current:** Calculate resistor-related offset.
8. **Input capacitance:** Include it in pole, Q, and distortion calculations.
9. **Output impedance:** Include its frequency dependence and load interaction.
10. **Distortion:** Check the required amplitude, frequency, source impedance, and gain.
11. **Power-supply rejection:** The power-supply rejection ratio (**PSRR**) usually decreases as frequency increases.
12. **Temperature and tolerance:** Verify the complete operating range.

Do not select an amplifier only from GBW.
A filter can fail from phase error, insufficient slew rate, unstable noise gain, common-mode limits, or excessive noise.

### 23. Active-Filter Design Procedure

Use this sequence.

1. **Define the signal band.**
   Specify passband edge, stopband edge, source impedance, load, amplitude, and DC content.
2. **Define magnitude limits.**
   Specify passband gain, ripple, cutoff definition, stopband attenuation, and allowed peaking.
3. **Define phase and time limits.**
   Specify phase error, group delay, overshoot, ringing, and settling time.
4. **Define the noise limit.**
   Integrate all noise sources across the required band.
5. **Select filter order and topology.**
   Use passive RC, buffered RC, inverting active RC, practical integrator, Sallen-Key, or another calculated topology.
6. **Calculate poles, zeros, and Q.**
   Use the exact equations for the selected circuit.
7. **Select practical R and C values.**
   Check loading, bias-current error, thermal noise, leakage, ESR, ESL, self-resonant frequency (**SRF**), voltage coefficient, and package.
8. **Select the amplifier.**
   Check GBW, noise gain, slew rate, phase margin, input/output range, current, noise, and distortion.
9. **Add converter constraints when applicable.**
   Check anti-alias transition band, reconstruction images, PWM carrier, ADC kickback, and reference settling.
10. **Analyze tolerance and temperature.**
    Use worst-case and Monte Carlo analysis.
11. **Simulate frequency response.**
    Plot magnitude, phase, loop gain, and noise gain.
12. **Simulate transient response.**
    Apply a step or square wave and inspect overshoot, ringing, slew limiting, and settling.
13. **Build and measure.**
    Measure gain, phase, noise, distortion, and stability across the operating range.
14. **Compare with the specification.**
    Do not accept a circuit only because its nominal cutoff is correct.

### 24. Worked Buffered-RC Active-Filter Example

Put a unity-gain voltage follower after a passive RC section.
This arrangement is the simplest active-filter form.
The buffer isolates the RC output from the load when its input impedance is high and its output impedance is low.

Assume:

* <i>R = 10 k&Omega;</i>.
* <i>C = 10 nF</i>.

The time constant is:

> **&tau; = (10 k&Omega;)(10 nF) = 100 &micro;s**

The corner is:

> **f<sub>c</sub> = 1 / (2&pi; &times; 100 &micro;s) &asymp; 1.59 kHz**

For the low-pass circuit:

* DC gain is approximately 1 when the load is high impedance.
* Magnitude is approximately -3 dB at 1.59 kHz.
* The final slope approaches -20 dB/decade.
* Phase is approximately -45 degrees at the corner.

For the high-pass circuit:

* DC output is zero.
* Magnitude is approximately -3 dB at 1.59 kHz.
* The output approaches the input above the corner.
* Phase is approximately +45 degrees at the corner.

Include source and load resistance before use in hardware.
Select a unity-gain-stable amplifier.
Check its gain-bandwidth product, slew rate, input and output ranges, noise, load current, and capacitive-load stability.

### 25. Verification Checklist

Before release, confirm:

* The transfer function matches the circuit.
* All poles and zeros have identified physical causes.
* The -3 dB point is not mistaken for complete rejection.
* Filter order and final roll-off meet the stopband limit.
* Q, peaking, overshoot, and settling meet the requirement.
* Operational-amplifier GBW and noise gain give sufficient loop gain.
* Slew rate supports the largest high-frequency signal.
* Phase margin is adequate across tolerance and load.
* The amplifier is stable with all filter and load capacitance.
* Component tolerance and temperature do not move cutoff or Q outside limits.
* ESR, ESL, self-resonance, and PCB parasitics are included.
* Integrated noise meets the signal-to-noise target.
* The analog anti-alias filter attenuates all possible aliases.
* The DAC reconstruction filter removes clock or image content as required.
* The PWM filter meets ripple and response-time limits.
* The voltage-reference filter settles and remains stable.
* Measured frequency and transient responses agree with the analysis.

Use the datasheets and the exact circuit equations.
Do not replace verification with one corner-frequency calculation.
