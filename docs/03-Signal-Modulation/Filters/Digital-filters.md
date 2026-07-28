---
title: Digital Filters
sidebar_label: Digital Filters
---

import DigitalFilterExplorer from '@site/src/components/DigitalFilterExplorer';

# Digital Filters

A **digital filter** calculates a new sample sequence from an input sample sequence.
The calculation changes magnitude, phase, noise bandwidth, or sample rate.

Digital filters operate after an analog-to-digital converter (**ADC**) or inside a digital system.
They can also prepare samples for a digital-to-analog converter (**DAC**).

A digital filter does not replace all analog filtering.
An analog anti-alias filter must act before the ADC.
An analog reconstruction filter must remove unwanted DAC output images and switching content.

This page explains sampled signals, finite impulse response filters, infinite impulse response filters, frequency response, multirate processing, numerical limits, and converter applications.

## Foundations

### 1. Sampled Signals

An ADC measures an analog input at discrete times.
The result is a sequence of numbers.

Let the **sample rate** be <i>f<sub>sample</sub></i>.
The interval between samples is:

> **T<sub>s</sub> = 1 / f<sub>sample</sub>**

For an analog signal <i>x(t)</i>, the sampled sequence is:

> **x[n] = x(nT<sub>s</sub>)**

The integer <i>n</i> is the **sample index**.
It does not have a unit.

#### Time and Amplitude

Digitization has two separate operations.
**Sampling** discretizes time.
**Quantization** discretizes amplitude.

* **Sample rate:** Sets the time interval between samples.
* **Bit depth:** Sets the number of available amplitude codes.

These operations create different errors.
A low sample rate can cause aliasing.
A small bit depth increases quantization error.

#### Sample Rate, Throughput, and Latency

These terms do not have the same meaning.

* **Sample rate:** Number of sampling instants for each second.
* **Throughput:** Number of completed results for each second.
* **Latency:** Delay from an input sample to its available output result.

A pipeline can accept one new sample during each clock interval.
The first result can still arrive many clock intervals later.

One converter example has a pipeline latency of approximately 10 sample intervals.
This delay does not decrease its steady-state throughput.

### 2. Digital Frequency

A digital filter uses frequency relative to the sample rate.
The normalized angular frequency is:

> **&Omega; = 2&pi;f / f<sub>sample</sub>**

Its unit is radians per sample.

Important values are:

* **Direct current (DC):** <i>&Omega; = 0</i>.
* **Nyquist frequency:** <i>&Omega; = &pi;</i>, or <i>f = f<sub>sample</sub>/2</i>.
* **One complete digital-frequency period:** <i>2&pi;</i> radians per sample.

Digital frequency repeats every <i>2&pi;</i>.
Do not use an analog angular frequency in rad/s as if it were a digital frequency in rad/sample.

#### Nyquist Terms

The **Nyquist frequency** is one-half of the sample rate.
The **Nyquist rate** is twice the highest frequency in an ideal band-limited baseband signal.

For baseband sampling:

> **f<sub>sample</sub> &gt; 2f<sub>max</sub>**

A practical design also needs a transition band.
For this reason, the sample rate is usually higher than the theoretical minimum.

### 3. Discrete-Time Linear Systems

A linear time-invariant (**LTI**) digital filter has the same response at every sample index.
Its output obeys superposition.

An LTI filter can be described in four related ways:

1. An **impulse response**.
2. A **convolution sum**.
3. A **difference equation**.
4. A **transfer function**.

#### Unit Impulse and Impulse Response

The discrete unit impulse, <i>&delta;[n]</i>, has these values:

* <i>&delta;[0] = 1</i>.
* <i>&delta;[n] = 0</i> for all other sample indices.

The output caused by this impulse is the **impulse response**, <i>h[n]</i>.
The impulse response completely describes an LTI filter.

#### Convolution

The output of an LTI filter is the convolution of the input and impulse response:

> **y[n] = &Sigma;<sub>k=-&infin;</sub><sup>&infin;</sup> h[k]x[n-k]**

In the general convolution sum, each output sample is a weighted sum of shifted input samples.
For a causal filter, this sum uses only present and past input samples.
A causal filter does not use future input samples.

#### Difference Equation

A general causal digital filter can use input samples and prior output samples:

> **y[n] = &Sigma;<sub>k=0</sub><sup>M</sup> b<sub>k</sub>x[n-k] - &Sigma;<sub>k=1</sub><sup>N</sup> a<sub>k</sub>y[n-k]**

This page uses a denominator leading coefficient of 1.
It also uses the minus sign shown before the feedback sum.

Some software libraries store the feedback coefficients with the opposite sign.
Always check the coefficient convention before implementation.

### 4. Z-Transform and Frequency Response

The **z-transform** describes a discrete-time sequence:

> **X(z) = &Sigma;<sub>n=-&infin;</sub><sup>&infin;</sup> x[n]z<sup>-n</sup>**

For zero initial conditions, the digital transfer function is:

> **H(z) = Y(z) / X(z)**

For the general difference equation:

> **H(z) = [&Sigma;<sub>k=0</sub><sup>M</sup> b<sub>k</sub>z<sup>-k</sup>] / [1 + &Sigma;<sub>k=1</sub><sup>N</sup> a<sub>k</sub>z<sup>-k</sup>]**

Evaluate the transfer function on the unit circle to get the frequency response:

> **H(e<sup>j&Omega;</sup>) = H(z)|<sub>z=e<sup>j&Omega;</sup></sub>**

The magnitude is <i>|H(e<sup>j&Omega;</sup>)|</i>.
The phase is the angle of <i>H(e<sup>j&Omega;</sup>)</i>.

#### Poles and Zeros

The numerator roots are **zeros**.
The denominator roots are **poles**.

Pole and zero locations control magnitude and phase.
They also control stability and transient response.

For a causal rational filter, all implemented poles must be strictly inside the unit circle for bounded-input, bounded-output stability.
Do not rely on an exact cancellation of an unstable pole.

## Filter Structures

### 5. Finite Impulse Response Filters

A **finite impulse response (FIR) filter** uses a finite set of coefficients.
It normally uses no prior output samples.

For a filter with <i>L</i> coefficients:

> **y[n] = &Sigma;<sub>k=0</sub><sup>L-1</sup> h[k]x[n-k]**

Each coefficient is also called a **tap**.
An <i>L</i>-tap FIR filter normally has order <i>L - 1</i>.

#### FIR Properties

* A finite-coefficient FIR filter is bounded-input, bounded-output stable.
* An FIR filter can have exactly linear phase.
* Linear phase requires the applicable coefficient symmetry or antisymmetry.
* A general FIR filter does not automatically have linear phase.
* A narrow transition band can require many taps.
* More taps require more memory and multiply-accumulate operations.

For a causal symmetric FIR filter with length <i>L</i>, the group delay is:

> **Group delay = (L - 1) / 2 samples**

The delay in seconds is:

> **Delay = (L - 1) / (2f<sub>sample</sub>)**

An even tap count can give a half-sample group delay.
This result is valid for the linear-phase passband.

### 6. Moving-Average FIR Filter

A length-<i>L</i> moving average uses equal coefficients:

> **h[k] = 1/L for 0 &le; k &lt; L**

Its output is:

> **y[n] = (1/L)&Sigma;<sub>k=0</sub><sup>L-1</sup>x[n-k]**

Its frequency response is:

> **H(e<sup>j&Omega;</sup>) = (1/L)e<sup>-j&Omega;(L-1)/2</sup> &times; sin(L&Omega;/2) / sin(&Omega;/2)**

At DC, use the limiting value <i>H(e<sup>j0</sup>) = 1</i>.

The first response null occurs at:

> **f<sub>null,1</sub> = f<sub>sample</sub> / L**

This null is not the -3 dB cutoff.

For independent white-noise samples, the output noise variance is:

> **&sigma;<sub>out</sub><sup>2</sup> = &sigma;<sub>in</sub><sup>2</sup> / L**

The output **root-mean-square (RMS)** noise is:

> **&sigma;<sub>out</sub> = &sigma;<sub>in</sub> / &radic;L**

This relation does not apply unchanged to correlated noise or periodic interference.

#### Worked Example: Five-Tap Moving Average

Assume:

* Sample rate: <i>f<sub>sample</sub> = 1 kHz</i>.
* Tap count: <i>L = 5</i>.
* Input step: 0 to 10.
* Initial stored samples: 0.

Step 1: Calculate each coefficient.

> **h[k] = 1/5 = 0.2**

Step 2: Write the difference equation.

> **y[n] = 0.2[x[n] + x[n-1] + x[n-2] + x[n-3] + x[n-4]]**

Step 3: Calculate the first five output samples.

* <i>y[0] = 0.2(10) = 2</i>.
* <i>y[1] = 0.2(10 + 10) = 4</i>.
* <i>y[2] = 0.2(10 + 10 + 10) = 6</i>.
* <i>y[3] = 0.2(10 + 10 + 10 + 10) = 8</i>.
* <i>y[4] = 0.2(10 + 10 + 10 + 10 + 10) = 10</i>.

The step reaches its final value after the five-sample window fills.

Step 4: Calculate the first frequency-response null.

> **f<sub>null,1</sub> = 1000 Hz / 5 = 200 Hz**

Step 5: Calculate the group delay.

> **Group delay = (5 - 1)/2 = 2 samples**

> **Delay = 2 / 1000 Hz = 2 ms**

Step 6: Calculate the ideal white-noise change.

> **&sigma;<sub>out</sub> / &sigma;<sub>in</sub> = 1/&radic;5 &asymp; 0.447**

The filter decreases independent white-noise RMS amplitude by approximately 55.3%.
It does not give the same attenuation for all noise spectra.

### 7. Infinite Impulse Response Filters

An **infinite impulse response (IIR) filter** uses feedback.
Its output depends on one or more prior output samples.

The feedback makes its theoretical impulse response continue without a finite end.
Finite arithmetic can also cause residual limit cycles.

#### IIR Properties

* An IIR filter can meet a magnitude requirement with fewer coefficients than an FIR filter.
* A general IIR filter has nonlinear phase.
* Pole locations determine stability.
* Coefficient quantization can move the poles.
* Feedback can magnify rounding and overflow errors.
* A high-order direct implementation can have poor numerical behavior.

Use cascaded **second-order sections (SOS)** for a high-order IIR filter.
Scale each section to prevent internal overflow.

### 8. One-Pole IIR Low-Pass Filter

A common one-pole smoother is:

> **y[n] = (1 - &alpha;)x[n] + &alpha;y[n-1]**

Its transfer function is:

> **H(z) = (1 - &alpha;) / (1 - &alpha;z<sup>-1</sup>)**

The pole is at <i>z = &alpha;</i>.
For <i>0 &le; &alpha; &lt; 1</i>, the filter is stable.

The DC gain is 1.
A value of <i>&alpha;</i> near 1 gives a slower response and a smaller bandwidth.

Its magnitude-squared response is:

> **|H(e<sup>j&Omega;</sup>)|<sup>2</sup> = (1 - &alpha;)<sup>2</sup> / [1 + &alpha;<sup>2</sup> - 2&alpha;cos(&Omega;)]**

Do not use an analog resistor-capacitor (**RC**) cutoff approximation as an exact digital result.
Use the exact magnitude equation at the selected sample rate.

For <i>0 &lt; &alpha; &lt; 1</i>, the discrete exponential time constant is:

> **&tau; = -T<sub>s</sub> / ln(&alpha;)**

#### Worked Example: One-Pole IIR

Assume:

* Sample rate: <i>f<sub>sample</sub> = 1 kHz</i>.
* Coefficient: <i>&alpha; = 0.8</i>.
* Input step: 0 to 10.
* Initial state: <i>y[-1] = 0</i>.

Step 1: Write the equation.

> **y[n] = 0.2x[n] + 0.8y[n-1]**

Step 2: Calculate the first output sample.

> **y[0] = 0.2(10) + 0.8(0) = 2**

Step 3: Continue the recursion.

* <i>y[1] = 0.2(10) + 0.8(2) = 3.6</i>.
* <i>y[2] = 0.2(10) + 0.8(3.6) = 4.88</i>.
* <i>y[3] = 0.2(10) + 0.8(4.88) = 5.904</i>.
* <i>y[4] = 0.2(10) + 0.8(5.904) = 6.7232</i>.

The output approaches 10 without reaching it in a finite number of ideal calculations.

Step 4: Calculate the time constant.

> **&tau; = -(1 ms) / ln(0.8) &asymp; 4.48 ms**

Step 5: Find the exact -3 dB frequency.

Set the magnitude-squared response to one-half.
For <i>&alpha; = 0.8</i>:

> **cos(&Omega;<sub>c</sub>) = [4&alpha; - &alpha;<sup>2</sup> - 1] / (2&alpha;) = 0.975**

> **&Omega;<sub>c</sub> &asymp; 0.2241 rad/sample**

> **f<sub>c</sub> = &Omega;<sub>c</sub>f<sub>sample</sub> / (2&pi;) &asymp; 35.7 Hz**

This exact result uses the discrete-time response.

### 9. Biquad Filters

A **biquad** is a second-order IIR section.
Its transfer function is:

> **H(z) = [b<sub>0</sub> + b<sub>1</sub>z<sup>-1</sup> + b<sub>2</sub>z<sup>-2</sup>] / [1 + a<sub>1</sub>z<sup>-1</sup> + a<sub>2</sub>z<sup>-2</sup>]**

The corresponding difference equation is:

> **y[n] = b<sub>0</sub>x[n] + b<sub>1</sub>x[n-1] + b<sub>2</sub>x[n-2] - a<sub>1</sub>y[n-1] - a<sub>2</sub>y[n-2]**

A biquad can make a low-pass, high-pass, band-pass, notch, peaking, or all-pass response.
The coefficient calculation must use the actual sample rate.

For a higher-order response, cascade multiple biquads.
Verify pole locations after coefficient quantization.

### 10. FIR and IIR Comparison

| Property | FIR | IIR |
| --- | --- | --- |
| **Feedback** | Normally no output feedback | Uses output feedback |
| **Impulse response** | Finite | Theoretically infinite |
| **Stability** | Stable for finite coefficients | Depends on implemented poles |
| **Linear phase** | Possible with coefficient symmetry | Generally not available |
| **Narrow transition band** | Can require many taps | Can require fewer coefficients |
| **Numerical risk** | Accumulator and coefficient error | Pole movement, overflow, and limit cycles |
| **Typical structure** | Direct convolution or polyphase | Cascaded second-order sections |

Select the structure from the complete magnitude, phase, latency, memory, and arithmetic requirements.

### 11. Interactive Filter Explorer

<DigitalFilterExplorer />

The explorer compares ideal digital-filter models.
It shows time response, magnitude response, coefficients, and filter parameters.

The explorer does not model every fixed-point effect.
It also does not replace an analog anti-alias filter.

## Response and Design

### 12. Filter Types

Digital filters can make these common responses:

* **Low-pass:** Passes low frequencies and attenuates high frequencies.
* **High-pass:** Attenuates DC and low frequencies.
* **Band-pass:** Passes one selected frequency range.
* **Band-stop:** Attenuates one selected frequency range.
* **Notch:** Makes a narrow band-stop response.
* **All-pass:** Changes phase while keeping ideal magnitude constant.

A filter type does not fully define a design.
The design also needs numeric limits.

### 13. Filter Specifications

Specify these values before coefficient calculation:

1. **Sample rate**, <i>f<sub>sample</sub></i>.
2. **Passband edge**, <i>f<sub>pass</sub></i>.
3. **Stopband edge**, <i>f<sub>stop</sub></i>.
4. **Passband ripple**, <i>A<sub>pass</sub></i>.
5. **Stopband attenuation**, <i>A<sub>stop</sub></i>.
6. **Phase or group-delay limit**.
7. **Maximum latency**.
8. **Coefficient and data word lengths**.

Use different symbols for sample rate and stopband edge.
The symbol <i>f<sub>s</sub></i> can otherwise have two meanings.

#### Cutoff Definition

A digital-filter cutoff is not always a -3 dB point.
Use the definition from the applicable requirement.

Possible definitions include:

* The -3 dB frequency.
* The passband edge.
* The stopband edge.
* The center of the transition band.
* The first response null.

State the selected definition with every cutoff value.

#### Transition Width

The transition width is the distance between passband and stopband edges:

> **&Delta;f = |f<sub>stop</sub> - f<sub>pass</sub>|**

A narrow transition usually requires a higher order or more FIR taps.
It can also increase delay, arithmetic load, and coefficient sensitivity.

### 14. Phase and Group Delay

The phase response is:

> **&phi;(&Omega;) = angle[H(e<sup>j&Omega;</sup>)]**

The group delay is:

> **&tau;<sub>g</sub>(&Omega;) = -d&phi;(&Omega;) / d&Omega;**

This result is in samples.
Divide it by <i>f<sub>sample</sub></i> to get seconds.

A constant group delay preserves the relative timing of frequency components.
A varying group delay can change pulse shape and modulation timing.

#### Zero-Phase Processing

Some offline software filters data once forward and once backward.
This method can cancel phase shift.

The method is noncausal.
It needs future samples and cannot operate as a live streaming filter.

The second pass also squares the magnitude response.
Account for this change during design.

### 15. FIR Design Methods

#### Windowed-Sinc Design

An ideal frequency-selective response has an impulse response of infinite length.
It is also centered around zero and is not causal.

A windowed-sinc design performs these operations:

1. Calculate the ideal impulse response.
2. Keep a finite number of samples.
3. Multiply the samples by a window.
4. Shift the coefficients to make the filter causal.
5. Normalize the required gain.

The window changes transition width and stopband sidelobes.

* A rectangular window gives a narrow main lobe and high sidelobes.
* A Hann or Hamming window decreases sidelobes and widens the transition.
* A Blackman-family window can give more sidelobe attenuation and a wider transition.

Do not assign one universal attenuation value to a window.
The tap count and exact window definition also affect the result.

#### Equiripple Design

An **equiripple FIR filter** minimizes the largest weighted error across specified bands.
It can meet a narrow-transition specification with fewer taps than some windowed designs.

Its passband and stopband errors have controlled ripple.
The design still has a finite transition band.

### 16. IIR Design Methods

Many IIR filters start from an analog prototype.
A transform maps the analog poles and zeros into the z-plane.

Common response families include:

| Family | Main characteristic |
| --- | --- |
| **Butterworth** | Monotonic and maximally flat magnitude near DC |
| **Chebyshev type I** | Passband ripple and monotonic stopband |
| **Chebyshev type II** | Monotonic passband and stopband ripple |
| **Elliptic** | Ripple in both bands and a narrow transition for a specified order |
| **Bessel or Thomson** | Smooth group delay in its applicable design form |

These names describe mathematical response families.
They do not identify one circuit or software structure.

#### Bilinear Transform

The bilinear transform is:

> **s = (2/T<sub>s</sub>)(1 - z<sup>-1</sup>) / (1 + z<sup>-1</sup>)**

It maps the analog left half-plane inside the digital unit circle.
It does not create frequency-domain aliasing.

The mapping warps frequency.
Prewarp critical frequencies before the transform when the design requires an exact match.

#### Impulse Invariance

Impulse invariance samples an analog impulse response.
It can preserve part of the analog time response.

The sampled analog spectrum can alias.
Do not use this method without an aliasing analysis.

### 17. Discrete Fourier Transform and Fast Fourier Transform

The **discrete Fourier transform (DFT)** converts a finite sample record into frequency bins:

> **X[k] = &Sigma;<sub>n=0</sub><sup>N-1</sup>x[n]e<sup>-j2&pi;kn/N</sup>**

The bin spacing is:

> **&Delta;f<sub>bin</sub> = f<sub>sample</sub> / N**

The record duration is:

> **T<sub>record</sub> = N / f<sub>sample</sub>**

A **fast Fourier transform (FFT)** is an efficient DFT algorithm.
An FFT is not a filter by itself.

#### Spectral Leakage

A finite record is equivalent to multiplication by a time window.
This operation spreads energy when a tone does not fit the record coherently.

An analysis window can decrease distant sidelobes.
It also widens the main lobe.

Correct the window coherent gain when amplitude accuracy is necessary.
Use the window equivalent noise bandwidth for noise measurements.

#### Zero Padding

Zero padding gives more displayed frequency samples.
It interpolates the existing DFT result.

Zero padding does not increase record duration.
It does not add frequency-resolution information.

#### FFT Convolution

Frequency-domain multiplication can implement long convolution efficiently.
The DFT performs circular convolution for an unpadded block.

Use zero padding with **overlap-add** or **overlap-save** processing.
These methods prevent one block end from wrapping into the next block.

Block processing adds buffer latency.
Include this latency in the system timing budget.

## Sampling and Multirate Processing

### 18. Aliasing at the Initial ADC

Sampling repeats the analog spectrum around multiples of the sample rate.
Different analog frequencies can then produce the same digital sequence.

For one analog input tone with frequency <i>f<sub>signal</sub></i>:

> **f<sub>alias</sub> = |f<sub>signal</sub> - kf<sub>sample</sub>|**

Select integer <i>k</i> so the result is in the first Nyquist zone.

:::caution Analog Anti-Alias Boundary
An analog anti-alias filter must attenuate unwanted content before the initial ADC sampling instant.

A digital filter cannot identify the original frequency after two analog frequencies become the same sampled sequence.
It cannot repair an alias that already exists in the ADC data.
:::

Noise at 50 MHz can affect a 100 kHz measurement when the sampling frequency maps that noise into the required band.
The exact alias frequency depends on the sample rate.

#### Guard Band

A real analog filter has a finite transition band.
Do not put its corner at the Nyquist frequency and assume complete rejection above that point.

One source example runs the sample clock 25% faster than the theoretical minimum.
This value is an example and not a universal rule.

A -3 dB corner at the required band edge gives 3.01 dB of loss at that edge.
Use that location only when the passband requirement permits the loss.

Select the sample rate and analog filter from the required passband and stopband attenuation.

### 19. Bandpass Sampling

**Bandpass sampling**, or **undersampling**, intentionally maps a selected analog band to a lower digital band.
The sample rate can be less than twice the carrier frequency.

A valid design must meet two requirements:

1. An analog bandpass filter must limit the input spectrum.
2. The complete wanted band must map into one Nyquist zone without overlap.

A sample rate greater than twice the information bandwidth is not sufficient by itself.

#### Frequency-Plan Example

Assume an analog band from 495 MHz to 505 MHz.
Its information bandwidth is 10 MHz.

* A 120 Msps sample rate maps the complete band to 15 MHz through 25 MHz.
* A 200 Msps sample rate puts the 500 MHz carrier at 100 MHz.
* At 200 Msps, the band crosses a Nyquist-zone boundary.
* The two band halves overlap after sampling.

Do not use the 200 Msps plan for this exact band.

The ADC track-and-hold must still acquire the original carrier.
The source example uses an ADC08200 with a 200 Msps sample rate and approximately 500 MHz analog input bandwidth.

Analog input bandwidth does not guarantee the specified resolution, distortion, or **signal-to-noise ratio (SNR)** at every input frequency.

### 20. Downsampling and Decimation

**Downsampling by M** retains every <i>M</i>th sample:

> **y[n] = x[nM]**

The new sample rate is:

> **f<sub>sample,out</sub> = f<sub>sample,in</sub> / M**

Downsampling alone can cause aliasing.
Frequencies above the new Nyquist limit can map into the retained band.

**Decimation** includes two operations:

1. Apply a digital low-pass filter.
2. Retain every <i>M</i>th filtered sample.

The decimation filter must attenuate every spectral band that can alias after downsampling.

#### Keep-One-in-100 Example

Assume an input rate of 1 MS/s.
Retaining one sample in 100 gives:

> **f<sub>out</sub> = 1 MS/s / 100 = 10 kS/s**

The new Nyquist frequency is 5 kHz.
The decimation filter must keep the required signal below this limit.

It must also provide a practical transition band before each folding region.
Do not retain one arbitrary sample in 100 without this filter.

### 21. Interpolation

**Upsampling by L** inserts <i>L - 1</i> zero samples between each original sample.
This operation increases the sample rate:

> **f<sub>sample,out</sub> = Lf<sub>sample,in</sub>**

Zero insertion creates spectral images.
An interpolation low-pass filter removes these images.

Some coefficient conventions use a passband gain of <i>L</i> after zero insertion.
Apply the gain convention required by the implementation.

For a rational rate change by <i>L/M</i>:

1. Upsample by <i>L</i>.
2. Apply one low-pass rate-conversion filter.
3. Downsample by <i>M</i>.

A **polyphase** structure avoids calculations for samples that will be zero or discarded.

### 22. Efficient Multirate Filters

#### Half-Band Filters

A half-band low-pass filter is useful for a factor-of-two rate change.
Many coefficients are zero in an applicable linear-phase design.

This property decreases the operation count.
The transition is centered around one-quarter of the input sample rate.

#### Cascaded Integrator-Comb Filters

A **cascaded integrator-comb (CIC) filter** supports a large integer rate change.
It uses adders, subtractors, and delays.

A CIC filter has these limits:

* Passband droop.
* A wide transition band.
* Large internal word growth.
* Null locations set by the rate change and differential delay.

Use a compensation FIR filter when the passband droop exceeds the requirement.
Calculate register growth before fixed-point implementation.

### 23. Oversampling

The **oversampling ratio (OSR)** for a baseband width <i>B</i> is:

> **OSR = f<sub>sample</sub> / (2B)**

Oversampling helps for four related reasons:

1. For the same quantizer step, a sufficiently uncorrelated quantization-noise model distributes the noise across a wider Nyquist interval.
   The quantization-noise density decreases.
2. A digital low-pass filter keeps the required baseband and rejects more of this out-of-band noise.
   The retained in-band quantization-noise power decreases.
3. The higher sample rate moves the first Nyquist boundary to a higher frequency.
   This change gives more frequency separation between the wanted baseband and the first alias boundary.
4. The larger transition range can permit a less complex analog anti-alias filter for some magnitude specifications.

Oversampling does not remove the need for the analog anti-alias filter.

For suitable uncorrelated white quantization error:

> **SNR improvement = 10 log<sub>10</sub>(OSR)**

The equivalent ideal bit improvement is:

> **Bit improvement = (1/2)log<sub>2</sub>(OSR)**

These equations need these conditions:

* The retained signal bandwidth stays constant.
* The quantization error is sufficiently uncorrelated.
* A digital low-pass filter removes out-of-band quantization noise.
* The system decimates only after the filter.

Clock jitter, distortion, correlated quantization error, analog noise, and reference noise can prevent the ideal improvement.
Dither can decorrelate quantization error, but it also adds noise.

#### 15 MHz and 100 kHz Example

Assume:

* Sample rate: 15 MHz.
* Required baseband: 100 kHz.

The OSR is:

> **OSR = 15 MHz / (2 &times; 100 kHz) = 75**

The ideal SNR improvement is:

> **10 log<sub>10</sub>(75) &asymp; 18.75 dB**

The ideal bit improvement is:

> **(1/2)log<sub>2</sub>(75) &asymp; 3.11 bits**

These values are theoretical limits under the stated assumptions.

Do not combine this example with decimation by 100.
A 15 MHz rate divided by 100 is 150 kS/s.
This output rate cannot retain a 100 kHz baseband.

A practical decimation ratio must leave a transition band above 100 kHz and below the new Nyquist frequency.

### 24. Delta-Sigma Conversion

#### Delta-Sigma ADC

A delta-sigma ADC contains a high-rate modulator and a digital filter.

A basic first-order 1-bit modulator loop operates as follows:

1. A subtractor calculates the analog input minus the 1-bit feedback level.
2. An integrator accumulates this difference.
3. A 1-bit quantizer selects the high or low output state from the integrator output.
4. The feedback path sends this 1-bit state through an internal 1-bit digital-to-analog converter.
5. The converter output becomes the feedback level for the next input-minus-feedback operation.

This closed feedback path makes the average state density follow the analog input.
It also shapes much quantization noise toward high frequency.
Higher-order and multibit modulators use more complex loop structures.

The complete ADC conversion sequence continues as follows:

1. The modulator produces a high-rate 1-bit or multibit wordstream.
2. A digital low-pass filter attenuates the out-of-band shaped quantization noise.
3. A decimator decreases the sample rate.
4. The converter supplies the final multibit output.

The digital filter adds latency and settling time.
A channel change can require multiple output periods before valid settled data appears.

Higher-order noise shaping does not follow the basic 3 dB-per-doubling rule.
Use the converter datasheet response and output-data-rate tables.

#### Delta-Sigma DAC

A delta-sigma DAC performs a related sequence in the opposite direction.

For a simplified 1-bit delta-sigma DAC, the conversion sequence is:

1. Digital interpolation raises the sample rate.
2. A noise-shaping modulator selects a code-controlled high or low state for each equal-duration high-rate interval.
3. The input code controls the long-term proportion of the high and low states.
4. The same high or low state can occur in consecutive intervals and make a repeated-state run.
5. The analog output elements convert the digital states into analog levels.
6. An analog reconstruction filter averages the sequence and attenuates high-frequency shaped noise, images, and switching content.

The modulator shapes quantization noise toward high frequency.

An analog reconstruction filter must still attenuate output images and switching content.
A digital filter cannot remove content produced after the digital-to-analog conversion.

The Analog Devices AD1955 is a multibit delta-sigma DAC example.
It supports 24-bit pulse-code modulation at sample rates as high as 192 kHz.
Its specified stereo dynamic range is 120 dB for the applicable test conditions.

Do not call its multibit output stage a 1-bit DAC.

## Numerical and Timing Limits

### 25. Quantization

An <i>N</i>-bit converter has:

> **Number of codes = 2<sup>N</sup>**

One least-significant bit (**LSB**) is:

> **1 LSB = V<sub>span</sub> / 2<sup>N</sup>**

For ideal rounding between endpoint saturation regions:

> **Maximum quantization error = &plusmn;1/2 LSB**

When the uniform independent-noise model applies, quantization-noise variance is:

> **&sigma;<sub>q</sub><sup>2</sup> = &Delta;<sup>2</sup> / 12**

Here, <i>&Delta;</i> is one LSB.

For an ideal full-scale sine wave:

> **SNR<sub>ideal</sub> &asymp; 6.02N + 1.76 dB**

The common 6 dB-per-bit rule is an engineering approximation.
A 16-bit code span is approximately 96 dB from full scale to one LSB.
The ideal full-scale-sine quantization SNR is approximately 98.1 dB.

In many 12-bit through 14-bit converter systems, quantization noise can be a major part of the total noise.
In many converters with 16 bits or more, thermal noise from the converter and analog front end can exceed the ideal quantization noise.
Thermal-noise power increases with absolute temperature and measurement bandwidth.
At these higher resolutions, a temperature change can have a larger effect on total noise than the ideal LSB calculation suggests.
These statements are common design tendencies and not universal limits.
Use the converter noise specifications at the applicable temperature and bandwidth.

#### Noise, Distortion, and Effective Resolution

* **Signal-to-noise ratio (SNR):** Compares signal power with noise power.
* **Signal-to-noise-and-distortion ratio (SINAD):** Includes noise and harmonic distortion.
* **Effective number of bits (ENOB):** Converts measured SINAD into an equivalent ideal bit count.

For the applicable full-scale sine-wave convention:

> **ENOB = (SINAD - 1.76 dB) / 6.02**

Do not calculate ENOB from an SNR value that excludes distortion.

### 26. Noise Through a Digital Filter

For white input-noise variance <i>&sigma;<sub>x</sub><sup>2</sup></i> and an FIR impulse response <i>h[k]</i>:

> **&sigma;<sub>y</sub><sup>2</sup> = &sigma;<sub>x</sub><sup>2</sup>&Sigma;<sub>k</sub>h<sup>2</sup>[k]**

For colored noise, integrate the input noise spectrum through the squared filter magnitude over one Nyquist interval:

> **P<sub>out</sub> = &int;<sub>-f&#x209B;/2</sub><sup>f&#x209B;/2</sup> S<sub>x,2</sub>(f)|H(e<sup>j2&pi;f/f&#x209B;</sup>)|<sup>2</sup>df**

Here, <i>f&#x209B;</i> is the sample rate, and <i>S<sub>x,2</sub>(f)</i> is the two-sided input power spectral density.
For a one-sided power spectral density, integrate from 0 through <i>f<sub>sample</sub>/2</i> and use the matching one-sided normalization.

A digital filter attenuates noise only according to its transfer function.
It does not remove in-band noise that overlaps the wanted signal.

It also cannot correct:

* Analog clipping or saturation.
* Aliasing at the initial ADC.
* Aperture-jitter error.
* Converter differential nonlinearity (**DNL**) or integral nonlinearity (**INL**).
* Uncalibrated offset or gain error.
* Reference drift.

Calibration can correct some repeatable offset and gain errors.
Calibration is a separate operation from filtering.

### 27. Fixed-Point Arithmetic

A mathematical filter uses exact numbers.
A fixed-point implementation uses limited word lengths.

Check these effects:

1. **Input quantization:** The ADC or input format limits amplitude resolution.
2. **Coefficient quantization:** Rounded coefficients move poles and zeros.
3. **Product width:** Multiplication creates more result bits.
4. **Accumulator width:** Multiple products can overflow their sum.
5. **Rounding:** Rounding adds noise but usually has less bias than truncation.
6. **Overflow mode:** Wraparound and saturation produce different nonlinear errors.
7. **State scaling:** IIR internal states can exceed input and output amplitudes.
8. **Limit cycles:** IIR feedback can produce a nonzero repeating output with zero input.

Use guard bits in accumulators.
Scale cascaded second-order sections.
Test maximum and minimum input sequences.

Quantize the final coefficients before pole analysis.
Do not verify stability only with the unquantized design coefficients.

Floating-point arithmetic also has finite precision.
It usually decreases scaling risk but does not remove all numerical error.

### 28. Clock Jitter and Aperture Error

**Aperture jitter** is uncertainty in the effective sample instant.
A changing input converts timing error into voltage error:

> **&Delta;V<sub>jitter</sub> &asymp; |dV<sub>in</sub>/dt| &times; &Delta;t**

For the small-error sine-wave model, let <i>&sigma;<sub>t</sub></i> be the total RMS timing jitter.
The jitter must be sufficiently random and uncorrelated with the input signal for this approximation:

> **SNR<sub>jitter</sub> &asymp; 20 log<sub>10</sub>[1 / (2&pi;f<sub>signal</sub>&sigma;<sub>t</sub>)]**

Here, <i>f<sub>signal</sub></i> is the analog sine-wave frequency.
A higher analog signal frequency gives a lower jitter-limited SNR for the same timing jitter.
Deterministic or correlated timing modulation can produce spurs.
Do not treat this modulation as ordinary random noise.

Include:

* ADC aperture jitter.
* Clock-source jitter.
* Clock-distribution jitter.

Combine statistically independent RMS jitter sources by root sum square.

Do not use **aperture time**, **aperture delay**, **aperture jitter**, and **aperture skew** as interchangeable terms.

* **Aperture time:** Finite track-to-hold transition interval.
* **Aperture delay:** Fixed command-to-sample delay.
* **Aperture jitter:** Sample-to-sample timing uncertainty.
* **Aperture skew:** Sampling-time difference between channels.

A known fixed delay can frequently be compensated.
Random jitter cannot be removed by an ordinary post-conversion filter.

### 29. Real-Time Processing

A real-time filter must finish each required calculation before its deadline.

For a serial sample-by-sample implementation, the nominal throughput budget is:

> **Nominal computation budget for each input sample = 1 / f<sub>sample</sub>**

This value is a throughput budget and not a universal latency limit.
A pipelined or parallel system can have a latency longer than one sample interval and still keep the required throughput.

Check:

* Worst-case multiply-accumulate time.
* Interrupt and task-switch time.
* Memory-transfer time.
* Block-buffer fill time.
* Filter group delay.
* Converter latency.
* Communication latency.

Block processing can improve computational efficiency.
It also adds a buffer delay.

#### Multiplexed and Simultaneous Samples

A multiplexed ADC samples channels at different times.
Do not process these channels as simultaneous measurements when phase relation is important.

A simultaneous-sampling system has a specified aperture skew.
Include this skew in phase and timing calculations.

Digital filters normally assume a uniform sample interval for each sequence.
Use time stamps or resampling when samples are not uniform.

## Applications

### 30. ADC Signal Chain

Use this sequence for a baseband measurement:

1. Apply analog signal conditioning.
2. Apply an analog anti-alias filter.
3. Sample with the ADC.
4. Apply a digital filter.
5. Decimate when a lower output rate is required.
6. Scale, calibrate, or analyze the result.

The digital filter can give a steep transition before decimation.
It cannot correct content that aliased during Step 3.

An 80 Msps ADC has a 40 MHz Nyquist frequency.
Its analog input circuit can still have 700 MHz bandwidth.

Wide analog bandwidth can admit noise that aliases into baseband.
Use an analog input filter and the specified ADC drive network.

### 31. DAC and Pulse-Width Modulation Output

#### Digital Interpolation and Analog Reconstruction

A DAC system can use a digital interpolation filter before conversion.
This filter raises the sample rate and decreases images near the original sample rate.

The DAC still produces analog images, steps, glitches, or switching energy.
An analog reconstruction filter must meet the physical output requirement.

#### Pulse-Width Modulation (PWM)

A digital timer can make a PWM output.
For <i>N</i> timing steps and clock frequency <i>f<sub>clk</sub></i>:

> **f<sub>PWM</sub> = f<sub>clk</sub> / N**

For an ideal output that switches between 0 V and <i>V<sub>HIGH</sub></i>:

> **V<sub>average</sub> = D &times; V<sub>HIGH</sub>**

Here, <i>D</i> is duty cycle from 0 through 1.

More timing steps increase nominal duty-cycle resolution.
They also decrease the PWM carrier frequency for a fixed timer clock.

A lower analog smoothing-filter cutoff decreases carrier ripple.
It also increases output settling time.

A digital prefilter can shape the duty-cycle command.
It cannot remove the physical PWM carrier from the output pin.

### 32. Modulation and Demodulation

A digital channel filter can select one modulated band.
A demodulator can move the selected band to baseband.
A digital low-pass filter can then remove the unwanted sum-frequency term.

Complex in-phase and quadrature (**I/Q**) samples preserve positive and negative frequency information.
A complex filter can select one spectral side without the symmetry required for a real filter.

A **matched filter** is designed for a known pulse shape.
Under its stated noise model, it maximizes the sample-time SNR.

Pulse-shaping and matched-filter responses also control intersymbol interference.
Include their combined group delay in link timing.

### 33. Phase-Locked-Loop Timing Filters

A phase-locked loop (**PLL**) can use an analog or digital loop filter.
This filter operates inside a feedback loop.

Its bandwidth creates a timing trade:

* **Wide loop bandwidth:** Faster lock and better tracking of fast frequency changes.
* **Narrow loop bandwidth:** Slower lock and more rejection of fast input jitter.

A narrow loop does not remove all output jitter.
The voltage-controlled oscillator and other PLL stages also add noise.

Filter delay changes PLL phase margin.
Analyze the complete loop and not only the standalone filter response.

### 34. Digital Power Control

A **proportional-integral-derivative (PID)** processor can be one part of this digital power-control chain:

> **ADC &rarr; PID processor &rarr; digital PWM generator**

The ADC can sample output voltage millions of times for each second.
A digital signal processor (**DSP**) calculates the commanded pulse width.

The source example uses nonlinear control.
It ignores the first 2 &micro;s of a 100% load step.
It then increases gain by a factor of 10.

This operation is time-dependent control logic.
It is not an LTI FIR or IIR filter.

Software can also calibrate for capacitor aging across 10 years.
Calibration is not the same operation as filtering.

Every digital filter adds delay to a feedback loop.
Include computation, sampling, PWM update, and zero-order-hold delay in the stability analysis.

### 35. Threshold and Event Processing

A digital low-pass filter can decrease measurement noise before a threshold decision.
It does not guarantee one clean transition for a slow input.

Noise near a threshold can still make repeated output events.
Use hysteresis, a state machine, or a qualified debounce interval when the application requires one event.

Do not drive a clock decision from an unqualified slow signal.

## Design and Verification

### 36. Digital-Filter Design Procedure

Use this sequence.

1. **Define the signal.**
   Specify sample rate, signal bands, amplitude, noise, and timing.
2. **Define the analog boundary.**
   Specify anti-alias and reconstruction requirements.
3. **Define magnitude limits.**
   Specify passband ripple, transition width, and stopband attenuation.
4. **Define phase and timing limits.**
   Specify group delay, latency, skew, and settling time.
5. **Select FIR or IIR.**
   Use the required phase, order, memory, and arithmetic limits.
6. **Select a design method.**
   Use a windowed FIR, equiripple FIR, transformed IIR, or another verified method.
7. **Calculate floating-point coefficients.**
   Verify magnitude, phase, poles, zeros, and transient response.
8. **Select arithmetic formats.**
   Specify input, coefficient, product, accumulator, state, and output widths.
9. **Quantize and scale.**
   Recheck poles, zeros, gain, noise, and internal levels.
10. **Add rate changes.**
    Verify every decimation folding band and interpolation image.
11. **Calculate computation time.**
    Include worst-case processor and buffer latency.
12. **Test converter limits.**
    Include initial aliasing, jitter, clipping, reference error, and analog settling.
13. **Test startup and reset.**
    Define initial states and valid-output time.
14. **Measure the implementation.**
    Compare hardware or target-code results with the numeric model.

### 37. Verification Signals

Use more than one test signal.

* **Impulse:** Reveals the implemented impulse response.
* **Step:** Reveals settling, overshoot, state, and latency.
* **Single sine wave:** Measures gain and phase at one frequency.
* **Frequency sweep:** Measures passband, transition, and stopband.
* **Two tones:** Reveals overflow and nonlinear intermodulation.
* **White noise:** Estimates noise gain and equivalent noise bandwidth.
* **Maximum alternating code:** Stresses high-frequency arithmetic.
* **Full-scale DC:** Stresses accumulator and state scaling.

Test the floating-point model and the final arithmetic implementation.

### 38. Verification Checklist

Before release, confirm:

* The sample rate and normalized frequency use the same units.
* The transfer function matches the difference equation.
* The coefficient-sign convention matches the software library.
* FIR tap count and filter order are not confused.
* All IIR poles remain inside the unit circle after quantization.
* Magnitude, phase, group delay, and latency meet the requirements.
* The analog anti-alias filter acts before the initial ADC sample.
* The decimation filter attenuates every folding band.
* The interpolation filter attenuates digital images.
* Fixed-point calculations do not overflow for the test set.
* IIR limit cycles meet the zero-input requirement.
* Startup transients do not enter valid output data.
* Clock jitter meets the target input-frequency SNR.
* Converter throughput and latency meet the timing budget.
* FFT processing uses the required window and overlap method.
* DAC and PWM outputs have the required analog reconstruction filter.
* Measured results agree with the analysis.

## Related Pages

* [Active Filters](./Active-filters.md)
* [ADCs and DACs](../Data-convertes/DACs.md)
* [Sample and Hold](../Data-convertes/Sample-holding.md)
