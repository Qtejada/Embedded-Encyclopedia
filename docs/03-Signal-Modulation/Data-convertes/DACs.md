---
title: Digital-to-Analog & Analog-to-Digital Conversion
sidebar_label: ADCs and DACs
---

import AdcDacResolutionExplorer from '@site/src/components/AdcDacResolutionExplorer';
import SarAdcInputModel from '@site/src/components/SarAdcInputModel';
import AdcDriverIsolation from '@site/src/components/AdcDriverIsolation';
import useBaseUrl from '@docusaurus/useBaseUrl';

# ADCs and DACs

A **digital-to-analog converter (DAC)** changes a digital code into a proportional analog voltage or current.
An **analog-to-digital converter (ADC)** samples an analog input and reports it as a digital code.
This page explains the shared conversion limits, the principal DAC and ADC architectures, and the circuits that connect converters to real systems.

:::note Source-note references
The original notes refer to Figure 13.9, Table 13.4, Section 13.9 (&sect;13.9), and Figure 13.29. The supplied image archives do not contain those exact items. This page keeps these references as source-note pointers and does not replace them with unrelated images.
:::

## Digital-to-Analog Converters (DACs)

A **digital-to-analog converter (DAC)** converts a binary or binary-coded decimal (**BCD**) number into an analog voltage or current.
The analog output is proportional to the digital input value.

DACs differ in resolution, accuracy, speed, reference type, output structure, and digital interface.
Select the architecture and the device from the requirements of the application.

---

### 1. DAC Fundamentals

#### Resolution and Step Size

**Resolution** is the number of input bits.
An <i>n</i>-bit DAC has 2<sup>n</sup> possible input codes.
The resolution determines the smallest ideal output step.

Let <i>V<sub>span</sub></i> be the nominal reference or code span.
For a unipolar converter, this span extends from 0 V to the nominal positive endpoint.
The digital code has 2<sup><i>n</i></sup> possible values from 0 through 2<sup><i>n</i></sup> - 1.

The ideal value of one least significant bit (**LSB**) is:

> **1 LSB = V<sub>span</sub> / 2<sup>n</sup>**

The largest ideal DAC output is one LSB below <i>V<sub>span</sub></i>.

For example, a 12-bit DAC with a 5 V span has this ideal step:

> **1 LSB = 5 V / 2<sup>12</sup> = 1.2207 mV**

The actual increase between adjacent codes can differ slightly from the ideal step.

#### Monotonicity

A DAC is **monotonic** when its output does not decrease as the input code increases.
For example, the outputs for codes 100, 101, and 102 must occur in increasing order or remain equal.

A statement such as **monotonic to 16 bits** means that the output does not decrease through the complete 16-bit input-code range.
Monotonicity does not require each step to have the ideal size.

#### Linearity

**Linearity** specifies how closely the DAC transfer function follows a straight line.
Datasheets usually specify integral non-linearity (**INL**) in LSB or as a fraction of full scale.

For a 12-bit DAC with a 5 V span, an INL limit of &plusmn;0.5 LSB is:

> **INL = &plusmn;0.5 &times; 1.2207 mV = &plusmn;0.610 mV**

**Differential non-linearity (DNL)** specifies the error in each code-to-code step.
The later precision section gives more information about INL and DNL.

#### DC Stability

**DC stability** specifies how the output changes with time and temperature.
Include reference drift, gain drift, offset drift, and output-amplifier drift in a precision error budget.

---

### 2. Primary DAC Parameters

Review these parameters before you select a DAC.

#### Reference

A DAC can use an **internal reference** or an **external reference**.
The reference sets the output scale and can be a major source of noise and drift.

A **multiplying DAC (MDAC)** accepts a variable external reference.
Its output is proportional to both the reference signal and the digital code.

#### Output Type

A DAC can have a **voltage output** or a **current output**.
A voltage-output DAC usually includes an output amplifier.
A current-output DAC usually requires an external resistor or a current-to-voltage amplifier.

#### Output Scaling

The output range can be:

* **Unipolar**, such as 0 V to a positive full-scale voltage.
* **Bipolar**, such as a range from a negative voltage to a positive voltage.

For a voltage-output DAC, check the permitted <i>V<sub>out</sub></i> range.
For a current-output DAC, check the output-current range and the **compliance-voltage** limit.

#### Speed

**Settling time** is the time that the output requires to enter and remain in a specified error band after a code change.

**Update rate** is the maximum rate at which the DAC can accept or apply new codes.
The update rate and the settling time are different specifications.

#### Digital Input

The digital interface can be:

* **Serial**, such as I<sup>2</sup>C or SPI.
* **Parallel**, which can be faster but requires more pins.

Check whether the input is latched.
Also check compatibility with CMOS, TTL, or ECL logic when these logic families apply.

#### Other Important Parameters

Check these device behaviors:

* **Glitch energy:** Output spikes can occur during code transitions.
* **Power-on state:** The output can start at 0 V, midscale, or another defined state.
* **Programmable internal scaling:** Some devices can change the output scale internally.
* **Channel density:** A package can contain one DAC or multiple DACs.
* **Supply requirements:** Check all supply voltages and the total power dissipation.
* **Package style:** Select a through-hole package, a surface-mount package, or a module as required.

---

### 3. Resistor-String DACs

A **resistor-string DAC**, also called a **Kelvin-divider DAC**, connects 2<sup>n</sup> equal-value resistors between a stable voltage reference and ground.
The resistor string makes a sequence of voltage taps.
MOSFET switches connect the selected tap to an output buffer.

#### Advantages

* **Monotonic operation:** Each successive code selects the next physical tap on one resistor string.
  The output cannot move to a lower tap when the code increases.
* **Low glitch energy:** The topology produces small output spikes during code transitions.
* **Accuracy and stability:** The simple divider structure can give good accuracy and good stability.

#### Limitations

* **Large area:** The resistor count increases as 2<sup>n</sup>.
  A high-resolution design, such as a 16-bit resistor string, is usually impractical.
* **Lower speed:** The large switch network has an RC time constant that increases settling time.
* **Cumulative mismatch:** Resistor mismatch accumulates along the string and limits absolute accuracy.

---

### 4. R-2R Ladder DACs

An **R-2R ladder DAC** uses a repeating network of resistors with values <i>R</i> and 2<i>R</i>.
The architecture requires approximately 2<i>n</i> resistors for an <i>n</i>-bit DAC.
A resistor-string DAC requires 2<sup>n</sup> resistors.

The R-2R architecture greatly reduces the component count.
Its accuracy depends on a precise 2:1 resistor ratio.

R-2R and linear-resistor ladders are common choices for medium-speed, high-accuracy conversion.

---

### 5. Current-Output and Current-Steering DACs

A **current-output DAC** commonly uses an array of transistor current sources with scaled emitter resistors.
The switches steer the currents to make the output value.

Current-steering architectures are common in very-high-speed DACs.

#### Advantages

1. **Speed and price:** Current-output devices are usually faster and can cost less than comparable voltage-output devices.
2. **Output-amplifier selection:** The designer can select the external current-to-voltage op-amp.
   This choice can reduce noise or produce a larger output swing than the DAC can produce by itself.
3. **Current summing:** Several current outputs can connect to one summing node.
   It is easier to sum currents directly than to sum voltage outputs directly.
4. **Multiplying operation:** Many current-output devices are available as MDACs.
   Their output current is proportional to the digital code and to the analog signal at <i>V<sub>ref</sub></i>.

---

### 6. Multiplying DACs

A standard voltage-output DAC can use a fixed internal reference, such as 2.5 V.
An **MDAC** uses an external reference input.
The external reference can change while the DAC operates.

For an ideal unipolar <i>n</i>-bit MDAC, the magnitude of the output is proportional to:

> **Output &prop; V<sub>ref</sub> &times; D / 2<sup>n</sup>**

In this formula, <i>D</i> is the numerical value of the digital code.
The exact polarity and scale depend on the DAC circuit.

#### Digitally Controlled Amplifier

Apply an audio signal to the reference input.
Change the digital code to change the output amplitude.
The MDAC operates as a digital volume control.

#### Four-Quadrant Operation

A suitable bipolar MDAC circuit can accept a positive or negative reference signal.
A signed or offset digital-code arrangement can also represent positive and negative scale factors.
This configuration permits positive and negative input and output values.
Standard unipolar DAC connections do not provide four-quadrant operation by themselves.

#### Reference Bandwidth

The **reference bandwidth** specifies how fast the signal at the reference input can change.
For example, a 10 MHz reference bandwidth permits the DAC to scale a 10 MHz sine wave when the other operating limits are satisfied.
Insufficient reference bandwidth causes amplitude error or distortion.

---

### 7. Ratiometric Operation

**Ratiometric operation** measures or generates a ratio instead of an absolute voltage.
It can reduce errors from a supply that changes.

#### Error with Separate References

Consider a sensor, such as a thermistor circuit, that operates from a 5 V supply.

1. The 5 V supply increases to 5.1 V.
2. This change is an increase of approximately 2%.
3. The sensor output also increases by 2%.
4. A measuring converter with a separate, stable 5.0 V reference sees the higher sensor voltage.
5. The converter can incorrectly indicate that the measured condition changed.

#### Shared-Reference Solution

Use the same 5 V source for the sensor excitation and for the converter reference when the circuit and datasheets permit this connection.

If the supply increases to 5.1 V:

* The sensor output increases by 2%.
* The converter reference scale also increases by 2%.
* The input-to-reference ratio remains constant.
* The two supply-related changes cancel in the conversion result.

This method is most direct in an ADC measurement.
The same ratio principle also applies to DAC systems that share a reference with the circuit that uses or measures the DAC output.

#### Examples

* A **Wheatstone bridge** measures the ratio of two voltage dividers.
  The ratio makes the result insensitive to common supply-voltage changes.
* A **555 timer** uses internal thresholds at 1/3 <i>V<sub>CC</sub></i> and 2/3 <i>V<sub>CC</sub></i>.
  The two thresholds change with the supply voltage.
  This behavior lets the timer maintain its threshold ratios when <i>V<sub>CC</sub></i> changes.

---

### 8. Interfacing a Current-Output DAC

A current-output DAC usually requires a circuit that converts current into a usable voltage.

#### Passive Resistor to Ground

Use a resistor when the load capacitance is low and the required voltage swing is small.
Ohm's law gives the output voltage:

> **V = I &times; R**

The resistor value sets the current-to-voltage scale.
The DAC output must remain inside its compliance-voltage range.

#### Transimpedance Amplifier

Use an op-amp **transimpedance amplifier (TIA)** for a large load capacitance or a large output-voltage swing.
The op-amp operates in a transresistance configuration and converts the DAC current into voltage.

#### Phase Lag and Settling

An external op-amp adds phase shift and settling time between the DAC current output and the final voltage output.
This behavior can make the complete signal path slower.

Select a fast op-amp that is stable in the required gain configuration.
Prefer a device that does not require an external phase-compensation capacitor when the circuit permits this choice.
This selection helps keep the phase lag small.

#### Full-Scale Gain Error

Some current-output DACs have poor initial accuracy and stability in their full-scale output current, <i>I<sub>out</sub></i>.
The full-scale current can differ by as much as 2:1 between individual devices.

Many current-output DACs include a **feedback resistor** that is closely matched to the internal R-2R resistors.
Use this resistor as the feedback element for the external op-amp when the datasheet specifies this connection.
This is the feedback-resistor connection identified as Figure 13.9 in the source notes.

An unmatched external discrete resistor can produce a gain error as large as &plusmn;25%.
Trimming can remove the initial gain error.
It does not remove the temperature-coefficient mismatch.
The residual gain drift can be approximately 100 times worse than the drift obtained with the matched internal resistor.

---

### 9. Delta-Sigma DACs

A **delta-sigma DAC** uses oversampling and noise shaping.
The modulator can use a 1-bit output or a multibit output.

For a 1-bit variant, the conversion occurs in these steps:

1. The converter operates at a high clock rate.
2. Each output pulse has the same width.
3. The digital input code controls whether a pulse is present or absent in each clock interval.
4. A low-pass filter removes the high-frequency pulse content.
5. The filter produces a smooth analog output.

Set the filter cutoff frequency well below the clock frequency.

Delta-sigma DACs are widely used in professional audio.
Multibit variants use more than two internal output levels.
The **ADI AD1955** is a multibit delta-sigma DAC.
It supports 24-bit PCM audio with sample rates as high as 192 kHz.
Its specified stereo dynamic range is 120 dB for the applicable test conditions.

#### The "1-Bit DAC" Name

Some delta-sigma DACs are called **1-bit DACs** because their output stage has only HIGH and LOW states.
This name does not describe the effective output resolution.
The delta-sigma process can produce a highly linear output with a large effective resolution and a dynamic range of approximately 120 dB.
The name does not apply to a multibit delta-sigma output stage.

---

### 10. PWM as a DAC

**Pulse-width modulation (PWM)** can operate as a simple DAC.
A low-pass filter or another averaging load converts the pulse duty cycle into an average analog value.

PWM is widely used in **Class D amplifiers**.
It also connects naturally to digital counters and power switches such as MOSFETs.

#### Resolution and Bandwidth Trade-Off

A high-resolution PWM output requires a large number of timing steps, <i>N</i>.
The timer has a maximum clock frequency, <i>f<sub>clk</sub></i>.
The PWM cycle frequency is:

> **f<sub>c</sub> = f<sub>clk</sub> / N**

An increase in <i>N</i> increases resolution.
It also decreases the PWM cycle frequency and the available signal bandwidth.

If the PWM DAC operates in a feedback loop, the lower cycle frequency reduces the possible loop bandwidth and loop gain.

---

### 11. DAC Precision and Linearity

#### The Voltage Reference as a Limiting Part

In a high-precision system, the DAC IC is not always the largest source of error.
The external **voltage reference** is often the largest source of noise and drift.

A high-quality reference can have approximately 2 &micro;V of low-frequency noise.
The op-amps that buffer it can contribute only approximately 0.1 &micro;V.

Use an RC filter to reduce reference noise.
For very low noise, multiple references can operate in parallel to average their uncorrelated noise.
Verify that the selected references permit parallel operation.

#### Integrated and Discrete Designs

An integrated DAC, such as the **LTC2656**, includes the voltage reference and output amplifiers in one package.

Advantages include:

* One supply can operate the complete device.
* The design requires few or no external parts.
* The circuit and PCB layout are simpler.

Limitations include:

* The noise can be approximately four times higher than the noise of a custom discrete design.
* The drift can be worse than the drift of a design that uses selected external parts.

A discrete precision design can use an MDAC, an external ultra-low-noise reference, and precision op-amps.
This design can give lower noise and better stability.
It requires more PCB area and more design work.

#### Bootstrapping and Guarding

A large filter capacitor can have leakage current.
This leakage can cause an error in a precision reference circuit.

Bootstrap the lower terminal of the capacitor to make the DC voltage across the capacitor approximately 0 V.
Zero DC voltage produces approximately zero DC leakage current through the capacitor.

#### Kelvin Connections

Use a **Kelvin connection**, also called a **4-wire connection**, on a current-sense resistor when the current is high.
Separate the high-current path from the voltage-sense path.
This connection prevents PCB trace resistance from adding to the measured resistor voltage.

#### Double Buffering

A multi-channel DAC can use **double buffering**.
Load the new data into all channels one channel at a time.
Apply all channel changes at the same time with a common update command.
This operation prevents timing skew between the outputs.

#### Inductive Loads and Loop Stability

An inductive load, such as an MRI coil, adds a pole to the feedback loop.
The additional pole can cause oscillation.

Compensate the loop for the inductive load.
One method makes the amplifier operate as an integrator at low frequencies.
Verify stability across the complete load and operating range.

#### Bandwidth Limiting

A **quasi-static** application changes slowly.
Intentionally limit its bandwidth when fast response is not necessary.
For example, a 1 kHz roll-off can reduce high-frequency reference noise and DAC glitches.

---

### 12. DNL and INL

When a DAC must produce a specified voltage with minimum error, **INL** and **gain error** usually dominate the accuracy result.

#### Differential Non-Linearity

**DNL** measures the error in each code-to-code step.

For an ideal DAC:

* An increase of one input code increases the output by exactly 1 LSB.
* Each step has the same size.

With high DNL, some steps are too small and other steps are too large.
The DAC is non-monotonic if an input-code increase causes the output to decrease.
This condition occurs when DNL is less than -1 LSB.

##### Effect in a Control Loop

DNL is important in a **control loop**.
Consider a heater-control loop:

1. The controller increases the DAC code to request more heat.
2. A non-monotonic DAC step decreases the control voltage.
3. The controller senses that more correction is necessary.
4. The controller increases the code again.
5. A later large DAC step can cause a large output change or an oscillation.

This repeated behavior is a **limit cycle**.

#### Integral Non-Linearity

**INL** measures the deviation of the complete transfer function from a straight line.
INL is important when the DAC must produce an accurate absolute voltage.

All individual steps can have nearly equal size while the complete transfer curve is bowed.
The accumulated error can be large near midscale.
This bowed transfer curve is sometimes called the **banana effect**.

INL is important in **set-and-forget applications**, such as calibration references.
These applications require accurate absolute output voltage.

#### Staircase Analogy

Use these two checks on a staircase:

* **DNL:** Measure each stair.
  Check whether every step has a height of exactly 8 inches.
* **INL:** Stretch a chalk line from the bottom to the top.
  Check whether the complete staircase deviates from the line in the middle.

#### Warning: Audio DACs in Non-Audio Applications

Do not assume that an audio DAC is suitable for a precision DC or control application.

* A missing DNL specification can indicate that the DNL is large.
* Audio operation can tolerate DNL that is unacceptable in a precision DC system.
* A control loop or precision voltage-setting circuit requires guaranteed monotonic behavior.
* High DNL can cause control-loop instability.
* A missing DNL specification is a reason to reject the device for these applications.
* Audio DAC gain drift can also be too large for accurate DC output.

---

### 13. DAC Technology Selection Guide

The principal competing technologies are:

* R-2R ladders.
* Linear-resistor ladders.
* Current-steering DACs.
* Delta-sigma DACs.

#### Highest Linearity at Audio Speeds

**Delta-sigma DACs** can give the best accuracy and linearity at audio speeds.
Some devices provide as much as 20-bit resolution.
Some devices also have good DC specifications.
The **TI DAC1220** is an example.

Check broadband noise and clock noise.
The DAC1220 has a noise density of approximately 1000 nV/&radic;Hz.
A resistor-ladder DAC can have a noise density of approximately 10 nV/&radic;Hz.

#### Medium Speed and High Accuracy

Use an **R-2R ladder** or a **linear-resistor ladder** when the design requires medium speed and high accuracy.

Examples include:

| Device | Structure and important specifications |
| --- | --- |
| **TI DAC8552** | Dual 16-bit voltage-output DAC with very low glitch energy |
| **ADI AD5544** | Quad 16-bit current-output MDAC with 0.5 &micro;s settling time |
| **LTC1668** | 16-bit differential-current DAC with 50 &Omega; drive and 20 ns settling time |
| **TI DAC9881** | 18-bit rail-to-rail precision DAC with low noise |

#### Highest Speed

Use a **current-steering DAC** for the highest conversion speeds.

Examples include:

| Device | Important specifications |
| --- | --- |
| **TI DAC5681** | 16-bit DAC with a 1 Gsps update rate |
| **ADI AD9739** | 14-bit DAC with a 2.5 Gsps update rate |

---

### 14. Ten-Point DAC Selection Checklist

Use this checklist to make sure that the selected component meets all design constraints.

1. **Resolution:** Select the required number of bits, such as 8, 10, 12, 16, or 24 bits.
2. **Speed:** Check the settling time and update rate.
3. **Accuracy:** Check INL, DNL, monotonicity, gain error, offset error, and the need for external trimming.
4. **Input structure:** Select a parallel or serial format.
   Check whether the input is latched.
   Check CMOS, TTL, or ECL logic compatibility when applicable.
5. **Reference:** Select an internal or external reference.
   Determine whether the design requires MDAC operation.
6. **Output structure:** Select a current or voltage output.
   Check the output range and the compliance-voltage limit.
7. **Power:** Check the required supply voltages and the total power dissipation.
8. **Density:** Select one DAC or multiple DACs in each package.
9. **Package style:** Select a through-hole package, a surface-mount package, or a module.
10. **Price:** Make sure that the device meets the cost limit.

---

### 15. Related Frequency-to-Voltage Conversion

A **frequency-to-voltage converter** changes pulse frequency into an output voltage.
It is often the functional inverse of a **voltage-to-frequency (V-to-F) converter**.

Use frequency-to-voltage conversion when information is encoded in pulse rate instead of amplitude.
Applications include:

* Tachometers for motor-speed measurement.
* Demodulation of frequency-modulated (**FM**) signals.

---

## Analog-to-Digital Converters (ADCs)

### 1. ADC Selection

An **analog-to-digital converter (ADC)** converts an analog signal into a digital code. In most designs, you will use a commercial ADC. You will not build the ADC from discrete components. However, knowledge of the internal architecture helps you prevent architecture-specific problems.

Start the selection process with the ADC as a **black box**. Use this checklist:

- **Performance:** Examine speed, accuracy, and resolution.
- **Resolution:** Specify the required number of bits.
- **Accuracy:** Examine monotonicity, missing codes, linearity, and DC stability.
- **Reference:** Decide if the design requires an internal reference or an external reference.
- **Input scaling:** Select a unipolar input range or a bipolar input range.
- **Speed:** Examine conversion time, throughput, and latency. Throughput is the completed-sample rate. Latency is the delay from an input sample to its digital result.
- **Digital output interface:** Select a parallel interface, a serial interface such as I2C or SPI, or a high-speed interface such as LVDS.
- **Integration:** Select a stand-alone ADC or an ADC that is integrated into a microcontroller.
- **Additional features:** Examine features such as an internal **programmable-gain amplifier (PGA)** and the specified **spur-free dynamic range (SFDR)**.

### 2. ADC Selection by Speed

The required sample rate and resolution narrow the architecture choices.

#### Low Speed: Approximately 10 Samples per Second

At voltmeter speed, compare **multislope integrating ADCs** with **delta-sigma ADCs**. Multislope integration is the traditional choice. Delta-sigma conversion is the modern alternative.

Examples:

- **LTC2412:** 24-bit converter
- **AD7732:** 24-bit converter with a &plusmn;10 V input range

#### Medium Speed: Hundreds of Kilosamples per Second

For resolutions greater than 16 bits, **delta-sigma ADCs** are the common choice.

The **AKM AK5384** is an example. It is a 24-bit audio ADC with a 96 ksps sample rate.

Audio ADCs can have excellent dynamic range. However, they can have poor DC specifications or no guaranteed DC specifications. Do not select an audio ADC for a DC measurement only from its bit depth or dynamic-range specification.

For resolutions of 16 bits or less, **successive-approximation register (SAR) ADCs** are highly usable.

#### Medium-High Speed: Up to a Few Megasamples per Second

In this range, compare **delta-sigma ADCs** with **switched-capacitor SAR ADCs**. The two architectures can give comparable accuracy. A SAR ADC is usually faster.

The **ADI AD7690** is an 18-bit SAR ADC with a 400 ksps sample rate. This sample rate is below the nominal few-Msps upper part of the category, but the device illustrates the high-resolution SAR choice.

#### High Speed: Hundreds of Megasamples per Second

Use a **pipelined flash-derived ADC** or another multistage subranging architecture, such as a half-flash design. This architecture gives high throughput. A typical pipeline can add latency of approximately 10 sample intervals.

Examples:

- **ADI AD9626:** 12-bit converter at 250 Msps
- **TI ADS6149:** 14-bit converter at 250 Msps

#### Very High Speed: More than 250 Msps

Use high-speed **flash variants**, such as folding or interpolating architectures. These devices commonly have a modest resolution of 6 to 10 bits.

Applications include:

- Oscilloscope front ends
- Digital radio

Examples:

- **National Semiconductor ADC08D1520:** 3000 Msps
- **National Semiconductor ADC12D1800:** 3600 Msps
- **Fujitsu 8-bit converter:** 56 Gsps

### 3. Sampling and Resolution

The conversion process divides a waveform in two dimensions:

- **Time** is the horizontal dimension. The sample rate divides this dimension.
- **Amplitude** is the vertical dimension. The bit depth divides this dimension.

#### Bit Depth

The **bit depth** specifies the number of available output codes. It determines the voltage resolution of each sample.

An <em>n</em>-bit ADC has:

> **Number of codes:** 2<sup><em>n</em></sup>

Examples:

- An **8-bit ADC** has 256 codes.
- A **16-bit ADC** has 65,536 codes.

#### The 6 dB Rule

Use this engineering rule of thumb:

> **Each additional bit increases the ideal dynamic range by approximately 6 dB.**

The approximate relation is:

> **Dynamic range:** <em>DR</em> &approx; 6<em>n</em> dB

A 16-bit **CD audio** system has an ideal dynamic range of approximately:

> 16 &times; 6 = 96 dB

This range extends from the largest possible signal at **0 dBFS** to the smallest signal that is above the ideal quantization-noise floor.

#### Quantization Error

The analog input can have any value in a continuous range. The ADC must round that value to one of its available codes. This rounding produces **quantization error**.

For an ideal <em>n</em>-bit ADC:

> **One least-significant bit:** 1 LSB = full-scale span / 2<sup><em>n</em></sup>

The ideal rounding error is not more than one-half LSB:

> **Maximum ideal quantization error:** &plusmn;1/2 LSB = &plusmn;full-scale span / 2<sup>(<em>n</em> + 1)</sup>

This half-LSB limit applies between the endpoint saturation regions.
At the positive full-scale endpoint, the largest code is 2<sup><em>n</em></sup> - 1.
In the ideal explorer model, this code reconstructs to one LSB below the nominal full-scale span.

For a 16-bit ADC, one code step is:

> 1 / 65,536 &approx; 0.0015% of the full-scale span

The maximum ideal rounding error is one-half of this value. Quantization also produces an ideal noise or distortion limit. The exact result depends on the input waveform and the measurement method.

The interactive explorer below applies the same resolution and quantization relations to both conversion directions.

<AdcDacResolutionExplorer />

#### Effective Number of Bits

The marked resolution does not specify the number of useful bits. Noise and nonlinearity can corrupt the least-significant bits.

**Effective number of bits (ENOB)** gives a more useful measure of real converter performance. For example, a device that is sold as a 16-bit ADC can have an ENOB of only 14 bits. In this case, random noise dominates the two least-significant bits.

### 4. Sampling Theory and Aliasing

#### Nyquist criterion

A band-limited waveform can be reconstructed correctly only when the sample rate is greater than twice the highest frequency component in the input:

> <em>f</em><sub>s</sub> &gt; 2<em>f</em><sub>max</sub>

Here, <em>f</em><sub>s</sub> is the sample rate and <em>f</em><sub>max</sub> is the highest input frequency.

#### Aliasing

If the input contains frequencies above the permitted limit, the sampled points can represent a false lower-frequency signal. This false signal is an **alias**. The false frequency did not exist at the analog input.

Install an **anti-aliasing low-pass filter** before a baseband ADC. The filter must attenuate frequencies that can fold into the required signal band.

#### Guard band

Do not put the filter corner exactly at <em>f</em><sub>s</sub>/2 and assume that the filter will stop all higher frequencies. A real filter has a gradual transition from its passband to its stopband. This limitation applies to a simple RC filter and to a higher-order filter, such as a six-pole Butterworth filter.

The nominal corner is commonly the **-3 dB point**. Frequencies immediately above this point still pass through the filter. These frequencies can alias into the sampled data.

Use **oversampling** to make a guard band. For example, run the sample clock 25% faster than the theoretical minimum. The additional frequency range separates the required signal band from the Nyquist limit.

Put the filter's -3 dB point at the edge of the required signal band. The guard band then gives the filter sufficient frequency range to reach the necessary stopband attenuation before a frequency can alias into the required band.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/SallenKeyLowPassFigure4.42.png')}
    alt="Second-order Sallen-Key low-pass filter used as an active-filter building block"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '530px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    A Sallen-Key low-pass circuit is an active low-pass building block. It is not a guaranteed anti-alias solution for every ADC. Image source: <i>The Art of Electronics</i>, Figure 4.42.
  </figcaption>
</figure>

### 5. ADC Architectures

ADC architectures range from fast and expensive types to slow and precise types. The architecture affects speed, resolution, latency, input-drive requirements, and power consumption.

#### Flash ADC

A **flash ADC**, also called a **parallel ADC**, is the fastest basic ADC architecture. The analog input connects to all comparators at the same time. A resistor reference ladder supplies equally spaced threshold voltages to the other comparator inputs.

An ideal <em>n</em>-bit flash ADC uses 2<sup><em>n</em></sup>-1 comparators. For example, an 8-bit flash ADC uses 255 comparators.

The active comparator outputs form a **thermometer code**, such as `0000111`. This code identifies the highest threshold that the input crossed. A priority encoder converts the thermometer code to a standard binary output. The source notes refer to this operation in Table 13.4.

A flash ADC has a short **aperture interval**. The input changes very little during the conversion interval. For this reason, some flash ADC applications do not require the external sample-and-hold circuit that a slower ADC can require.

The comparator count increases exponentially with resolution. The practical resolution limit for a pure flash ADC is usually approximately 8 bits.

High-speed converters can use **pipelined**, **subranging**, or **folding** techniques to reduce the comparator count. These techniques divide the conversion into smaller operations. Some of them convert and amplify the residue from an earlier operation.

#### Half-flash ADC

A **half-flash ADC** uses two conversion steps. This architecture is the simplest subranging modification of a flash ADC.

For an 8-bit conversion, the sequence is:

1. A small flash ADC makes a **coarse conversion** and estimates the four most-significant bits.
2. An internal DAC converts the coarse code back to an analog voltage.
3. A subtraction circuit subtracts this DAC voltage from the input.
4. A residue amplifier increases the remaining voltage to the range of the next stage.
5. A second small flash ADC makes a **fine conversion** and determines the four least-significant bits.

Two 4-bit flash stages use approximately 30 comparators. A pure 8-bit flash ADC uses 255 comparators. The half-flash method reduces the comparator count substantially.

The **TLC0820** is an example of this type of converter.

#### Pipelined flash ADC

A **pipelined ADC** extends the half-flash method into many stages. For example, the **AD9244** can use a pipeline with approximately 10 stages.

The central circuit is a switched-capacitor **multiplying DAC (MDAC)**. The MDAC performs three analog operations:

1. It converts a stage's digital estimate back to an analog voltage.
2. It subtracts that estimate from the sampled input.
3. It amplifies the residue to fill the input range of the next stage.

A capacitor stores the residue. After a stage transfers its residue to the next stage, it starts work on the next sample. Different samples move through different stages at the same time. This pipeline gives high throughput.

Example sample rates range from 65 Msps to 250 Msps. The conversion also has high **latency**. Data can require 8 to 14 clock cycles to move through the pipeline.

Latency is the delay from a given analog sample to its digital result. Throughput is the rate at which completed results leave the converter. A pipeline can have high latency and high throughput at the same time.

#### Folding ADC

A **folding ADC** supports very high sample rates, such as 3.6 Gsps. It is useful when a long pipeline is too slow or too complex.

Cross-connected differential pairs transform a linear input ramp into a repeating triangular waveform. Each repetition is a **fold**.

The conversion uses two measurements:

1. A **coarse ADC** identifies the fold that contains the input. This result supplies the most-significant bits.
2. A **fine ADC** measures the waveform height inside that fold. This result supplies the least-significant bits.

The folding method approaches flash-converter speed with fewer comparators.

#### Successive-approximation ADC

A **successive-approximation register (SAR) ADC** is a common choice for medium-speed and medium-resolution applications.

The conversion uses a binary-search sequence:

1. Internal logic generates a trial code.
2. An internal DAC converts the trial code to an analog voltage.
3. A comparator compares this voltage with the input.
4. The logic keeps or clears the tested bit.
5. The logic repeats the process for the next bit.

An <em>n</em>-bit SAR ADC needs approximately <em>n</em> comparison steps for one conversion.

The internal DAC can use one of these structures:

- A conventional <em>n</em>-stage **R-2R resistor ladder**
- A **charge-redistribution capacitor array**

A binary-weighted capacitor DAC contains approximately <em>n</em> switched capacitor elements. Its total capacitance is equivalent to approximately 2<sup><em>n</em></sup> unit capacitors.

Some SAR ADCs use internal track, hold, and reset switches.
The simplified model below shows input acquisition, charge transfer, and an optional reset phase.
It does not show the SAR binary-search core.
Not all SAR ADCs reset the sampling capacitor in this manner.

<SarAdcInputModel />

#### Voltage-to-frequency converter

A **voltage-to-frequency (V/F) converter** generates a pulse train. The pulse frequency is accurately proportional to the analog input voltage.

An **asynchronous V/F converter** contains a free-running internal oscillator.

A **synchronous V/F converter** requires an external clock. It passes a controlled fraction of the clock pulses. The average output frequency represents the analog input.

#### Single-slope integrating ADC

A **single-slope integrating ADC** uses a current source to charge a capacitor. The capacitor voltage forms a linear ramp.

The conversion sequence is:

1. The ramp starts at 0 V.
2. A comparator monitors the ramp and the input voltage.
3. A fixed-frequency clock runs while the ramp moves toward the input voltage.
4. The comparator stops the count when the ramp reaches the input voltage.
5. The clock-pulse count represents the input voltage.

This ramp-and-comparator method is also used to generate **pulse-width modulation (PWM)**.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/integratorFigure4.16.png')}
    alt="Ideal operational-amplifier integrator building block with capacitor-only feedback"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '360px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    This ideal capacitor-only feedback integrator is a basic building block for integrating conversion methods. It is not a complete ADC and does not show practical DC feedback or reset control. Image source: <i>The Art of Electronics</i>, Figure 4.16.
  </figcaption>
</figure>

#### Dual-slope, quad-slope, and multislope ADCs

**Dual-slope** and **multislope integrating ADCs** reduce selected conversion errors.

A dual-slope conversion has two phases:

1. During **run-up**, an input-proportional current ramps the integrator for a fixed time.
2. During **run-down**, a fixed reference current ramps the integrator in the opposite direction.
3. The converter measures the run-down time until the integrator returns to zero.
4. The measured run-down time is proportional to the input.

The same integrator resistor and capacitor affect both slopes.
The ratio measurement cancels much of their common scale error.
This two-slope operation does not automatically remove comparator offset.

A **quad-slope ADC** adds an **auto-zero cycle**. The converter holds the input at zero, measures the offset, and subtracts the offset from later conversions.

A **multislope ADC** uses a complex sequence of fast dual-slope operations. It integrates continuously and corrects the result with the residues from partial cycles. This method is closely related to the **delta-sigma** architecture.

#### Delta-sigma ADC

A **delta-sigma ADC** is common in high-resolution applications. Its mathematical analysis is complex. The source notes identify Section 13.9 as the location for the detailed analysis.

The converter has two primary parts:

1. The **modulator** converts the analog input into a high-speed serial bitstream. An integrator processes the difference between the input and a 1-bit feedback signal.
2. The **digital filter** low-pass filters the bitstream. It then decimates the data and produces the final <em>n</em>-bit output.

Higher-order modulators use multiple or weighted integrators. Some delta-sigma converters use multi-bit wordstreams instead of a 1-bit stream.

### 6. Driving High-Speed ADCs

Do not connect a modern high-speed ADC directly to an arbitrary op-amp output. Flash, folding, pipelined, and RF ADCs can have high bandwidth and a dynamic input impedance. These inputs require a specified drive network.

#### The 2R + C interface

A common differential interface uses two resistors and one capacitor. This circuit is a **2R + C low-pass filter**.

The network has three functions.

<AdcDriverIsolation />

The figure shows the isolation and charge-reservoir principle for one signal path.
It is not the complete differential 2R + C network.

##### 1. Limit noise bandwidth

The filter limits the input bandwidth to the required signal band and supplies the necessary attenuation before frequencies can alias into that band.

For example, an 80 Msps ADC has a Nyquist frequency of 40 MHz. The ADC input circuit can still have 700 MHz of analog bandwidth. Without an external filter, noise from this wide analog bandwidth can fold into the baseband and reduce the **signal-to-noise ratio (SNR)**.

Do not interpret the 40 MHz example as a requirement to put a real filter corner exactly at <em>f</em><sub>s</sub>/2. Include a guard band and meet the required stopband attenuation.

##### 2. Supply local charge

The capacitor is a local **charge reservoir**. The internal sample-and-hold switch draws a short current pulse when it closes. The capacitor supplies much of this charge locally. The driver does not have to supply the complete current pulse through its full output path.

##### 3. Isolate the driver

The two resistors isolate the op-amp outputs from the filter capacitor and the switched ADC input.

#### Op-amp stability with capacitive loads

A high-bandwidth op-amp, including a device with approximately 1000 MHz bandwidth, can become unstable with a capacitive load. The capacitor interacts with the op-amp's open-loop output impedance, <em>R</em><sub>o</sub>. This interaction adds a pole to the loop response. The pole reduces phase margin and can cause oscillation.

Install an external **isolation resistor**, <em>R</em><sub>ext</sub> or <em>R</em><sub>s</sub>, between the amplifier output and the capacitor.

Take the feedback signal **before the isolation resistor**, directly from the op-amp output pin. In this arrangement, the capacitor's additional phase shift stays outside the feedback loop. The resistor can isolate the capacitive load.

Do not take ordinary feedback **after the isolation resistor** at the capacitor node only to correct the resistor's voltage drop. This connection puts the capacitor inside the feedback loop. The op-amp can oscillate unless the design uses a suitable compensation method, such as **dual feedback**.

#### Differential drive

Some devices with differential inputs permit single-ended drive. In this arrangement, one input is fixed and the other input receives the signal.

Single-ended drive usually has two costs in a high-performance ADC:

- Even-order harmonic distortion does not cancel.
- The available full-scale differential input range is reduced by one-half.

Use a **differential driver** for a high-performance ADC unless the datasheet gives acceptable performance for the required single-ended connection.

#### Clock jitter

The sample clock can limit the SNR of a high-speed ADC.

**Clock jitter** is uncertainty in the sample time. A fast-changing input has a high slew rate. A small timing error, &Delta;<em>t</em>, then produces a large voltage error, &Delta;<em>V</em>.

Use the ADC datasheet's **aperture-jitter** specification. Make sure that the complete clock path meets the jitter limit for the target input frequency and SNR.

### 7. Undersampling

**Undersampling**, also called **bandpass sampling** or **harmonic sampling**, digitizes a high-frequency band with a sample rate that is lower than twice the carrier frequency.

#### Information bandwidth and sample-rate selection

For ordinary baseband sampling, use:

> <em>f</em><sub>s</sub> &gt; 2<em>f</em><sub>max</sub>

For a correctly band-limited bandpass signal, the theoretical minimum sample rate can be greater than twice the **information bandwidth** instead of twice the carrier frequency. However, not every sample rate above 2<em>B</em> is valid. The selected sample rate must put the complete band into one Nyquist zone without overlap from another spectral image.

Consider a radio signal from 495 MHz to 505 MHz. Its carrier is 500 MHz and its information bandwidth, <em>B</em>, is 10 MHz.

- A carrier-frequency estimate for a 500 MHz signal gives a sample rate above 1000 Msps. The complete 495 MHz to 505 MHz band gives a baseband sample rate above 1010 Msps because its highest frequency is 505 MHz.
- The theoretical bandpass-sampling limit is greater than 20 Msps because the occupied bandwidth is 10 MHz.
- The actual sample rate must also satisfy the Nyquist-zone placement conditions.

For example, a 120 Msps sample rate maps the complete 495 MHz to 505 MHz band to a 15 MHz to 25 MHz digital band.
A 200 Msps sample rate maps the 500 MHz carrier to 100 MHz.
For this sample rate, the exact 495 MHz to 505 MHz band crosses a Nyquist-zone boundary.
Its two halves would overlap after sampling.
Do not use that rate for this exact band without a different frequency plan.

Undersampling can reduce converter speed, cost, and power. It does not remove the need for a high-bandwidth analog front end.

#### Two required conditions

An undersampling design must meet two conditions.

##### 1. Limit the input band

Pass the input through a selective **bandpass filter**. Only the required frequency band can reach the ADC with significant amplitude. Out-of-band signals and noise can alias into the same digital band and corrupt the result.

##### 2. Use sufficient analog input bandwidth

The ADC sample rate can be lower than the carrier frequency. However, the internal **track-and-hold** circuit must acquire the high-frequency carrier accurately.

For example, the **ADC08200** samples at 200 Msps and has approximately 500 MHz of analog input bandwidth. This bandwidth lets the track-and-hold circuit respond to inputs near 500 MHz. The frequency plan must still use a sample rate and input band that do not produce spectral overlap.

#### Intentional aliasing

Ordinary aliasing folds unwanted high-frequency energy into the baseband. An undersampling system uses a selected alias as the valid signal.

The sampling operation acts as a **mixer**. It translates an RF band to a lower digital frequency. For example, a 500 MHz tone aliases to 100 MHz with a 200 Msps sample rate. A valid bandpass design selects the sample rate so that the complete modulated band falls inside the selected Nyquist zone without overlap.

This method can remove a separate analog down-conversion stage.

#### Example input circuit

The circuit in Figure 13.29 includes these features:

- **Termination:** Two 100 &Omega; resistors form a 50 &Omega; load when they are in parallel. This load matches standard RF impedance.
- **AC coupling and bias:** The ADC uses a single supply. It cannot accept an input that moves below its permitted input range. A coupling capacitor removes the source's DC component. The circuit then biases the ADC input near +0.6 V, which is the required common-mode level in this example. The +0.6 V value is not the midpoint of a 0 V to +3 V supply.
- **Supply filtering:** A 100 &mu;H choke isolates the sensitive analog supply pin from noise on the digital supply pin.

### 8. Multiplexed Data-Acquisition Systems

A **multiplexed data-acquisition system (DAQ)** uses one high-quality ADC to measure many sensor channels. A multiplexer connects each low-cost sensor to the shared signal chain in sequence.

#### Universal design principles

##### Break-before-make switching

Use a multiplexer with **break-before-make** operation. The switch disconnects Channel 1 before it connects Channel 2.

This operation prevents a short circuit between two sensors. For example, Channel 1 can be at +10 V while Channel 2 is at -10 V. A make-before-break switch would connect the two sources for a short interval. The connection could cause a large inrush current and crosstalk.

Break-before-make operation adds **dead time**. An example dead time is 80 ns. Include this interval in the acquisition timing.

##### Input protection

A standard CMOS multiplexer can be damaged when the input exceeds its supply rails. Treat a user-accessible sensor input as a possible overvoltage source.

Use a robust **high-voltage multiplexer** or external **MOSFET clamps** when the source can exceed the normal input range.

##### On-resistance, capacitance, and charge injection

Do not select a switch only because it has the lowest on-resistance, <em>R</em><sub>on</sub>. For example, a 0.5 &Omega; switch can require large internal transistors. Large transistors have high capacitance.

When the switch changes state, this capacitance transfers a charge pulse to the signal. This effect is **charge injection**.

For a high-impedance sensor, select a switch with **low leakage** and **low capacitance**. An on-resistance of 80 &Omega; can be acceptable when the next amplifier has a very high input impedance.

<figure style={{textAlign: 'center', margin: '20px 0'}}>
  <img
    src={useBaseUrl('/img/AoE1.png')}
    alt="MOSFET analog signal switch building block"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '420px', height: 'auto', borderRadius: '8px'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    A MOSFET analog switch is a building block for multiplexing and sampling. It is not a complete sample-and-hold circuit or ADC. Image source: <i>The Art of Electronics</i>, Figure 3.4.
  </figcaption>
</figure>

##### Error budget: RTI compared with one LSB

Compare each signal-chain error with the ADC's **least-significant bit (LSB)**.

For a 16-bit ADC with a &plusmn;10 V input range, the full-scale span is 20 V:

> 1 LSB = 20 V / 65,536 &approx; 305 &mu;V

The approximate value is 300 &mu;V.

If an amplifier has a 5.5 mV input-referred offset:

> 5.5 mV / 305 &mu;V &approx; 18

The amplifier offset is approximately 18 times larger than one LSB. The system cannot use the ADC's 16-bit resolution without offset correction.

Use a **nulling circuit** to calibrate the offset. A low-cost DAC can inject the correction voltage.

##### Temperature drift

Calibration at room temperature does not remove temperature-dependent error. Components drift when their temperature changes.

Consider an amplifier with a gain drift of 40 ppm/&deg;C. One LSB of a 16-bit full-scale measurement is approximately 15 ppm. At or near full scale, a 1 &deg;C change can cause more than one LSB of gain error.

In a system with 16 bits or more, **temperature drift** can limit accuracy before the nominal ADC resolution does.

##### Timing stack-up

Do not use only the ADC conversion-rate specification to calculate channel time. Include the multiplexer and amplifier delays.

Use this conservative timing relation:

> <em>T</em><sub>total</sub> = <em>T</em><sub>MuxSwitch</sub> + <em>T</em><sub>AmpSettling</sub> + <em>T</em><sub>ADC Acquisition</sub> + <em>T</em><sub>Conversion</sub> + <em>T</em><sub>Readout</sub>

Acquisition, conversion, and readout can overlap only when the ADC timing permits this operation.

If the controller switches channels too quickly, the amplifier does not settle to the required accuracy. The next conversion can contain a **ghost** of the previous channel.

#### Case study: 16-channel multiplexed DAQ

The design goal is to digitize 16 differential inputs with one ADC and one microcontroller.

##### Signal-chain components

1. **Input multiplexer: MPC506**
   - A dielectrically isolated process gives the device robust high-voltage input behavior.
   - The inputs can accept a 20 V signal without latch-up, even when this voltage is beyond the normal supply rails, as specified for this application.
   - The on-resistance is 1.5 k&Omega;.
   - The high on-resistance is acceptable because the next amplifier has very high input impedance.

2. **Mode-select switches: IH5043**
   - The selection gives priority to low charge injection.
   - Low charge injection reduces switching spikes.
   - Low on-resistance is less important in this position.

3. **Programmable-gain amplifier: PGA202**
   - The input impedance is 10 G&Omega;.
   - This high impedance makes the multiplexer resistance negligible.
   - An external 10-bit DAC injects a nulling voltage.
   - The nulling voltage cancels the 5.5 mV amplifier offset.

4. **ADC: LTC1609**
   - This device is a 16-bit SAR ADC.
   - Its maximum sample rate is 200 ksps.
   - The design replaces the internal reference with an external **precision reference**.
   - The external reference has a drift of 1 ppm/&deg;C.
   - This change corrects the poor drift of the internal reference.

##### Operating sequence

At startup:

1. The microcontroller measures the signal-chain offset.
2. The microcontroller programs the nulling DAC.
3. The DAC correction reduces the measured offset to zero.

During operation:

1. The microcontroller reads the required gain setting from a lookup table.
2. It selects the input channel and gain.
3. It waits more than 2 &mu;s for the signal chain to settle.
4. It starts the ADC conversion.

### 9. Simultaneous-Sampling Data-Acquisition Systems

A multiplexed system measures Channel 1 and then Channel 2. The samples occur at different times.

A **simultaneous-sampling DAQ** acquires all channels at a common sampling instant. The channels sample within the specified aperture skew, which can be much less than one nanosecond.

Use simultaneous sampling when the phase relation between channels is important. Applications include:

- **Three-phase power monitoring**
- **Vibration analysis**

#### Architectures

##### Discrete daisy-chain architecture

Use one ADC for each channel. Connect the ADCs in a daisy chain so that they share one serial interface. This architecture is useful in a modular system.

The **AD7685** is an example of a discrete ADC that can use a serial interface in this type of system.

##### Integrated architecture

Use one integrated device that contains multiple independent ADCs or track-and-hold channels.

Examples include:

- **MAX11046**
- **AD7608**

These devices contain eight conversion channels in one package.

#### Design challenges

##### Bipolar-to-unipolar level translation

Industrial sensors often produce a &plusmn;10 V signal. A high-speed ADC can use a unipolar 0 V to 5 V input range.

Use a **level-translating driver**, such as the **AD8275**. This device attenuates the input with a gain of 0.2 and shifts its center voltage.

Read offset specifications carefully. A driver specification can be **referred to output (RTO)**.

If the output-referred offset is 0.5 mV and the gain is 0.2, the equivalent input-referred error is:

> Offset<sub>RTI</sub> = 0.5 mV / 0.2 = 2.5 mV

##### Digital isolation and the echo clock

A digital isolator, such as the **ADuM1402**, can have approximately 27 ns of propagation delay. At a data rate of 50 Mbps, the returned data can arrive too late for the processor to capture it with the original transmit clock.

Use an **echo clock** to correct this timing problem:

1. The processor sends the conversion or serial clock across the isolation barrier.
2. The ADC side returns a copy of the clock with the data.
3. The processor uses the returned clock to capture the returned data.

The clock and data experience similar path delay. This arrangement keeps them synchronized across the isolation barrier.

##### Serial and parallel interfaces

The **serial SPI interface** is suitable for a discrete ADC such as the AD7685.

Advantages:

- The connection is compact.
- Isolation is low cost.
- The interface needs approximately four isolated wires.

The **parallel interface** is suitable for a device such as the MAX11046.

Advantages:

- The interface gives very fast readout.

Disadvantages:

- The interface needs at least 16 data and control lines.
- An isolated implementation can require 21 isolation channels.
- The isolation circuit is large and expensive.

#### Architecture comparison

| Feature | Multiplexed | Simultaneous, discrete | Simultaneous, integrated |
| :--- | :--- | :--- | :--- |
| **Timing** | Time delay between channels | Common sampling instant within specified device skew | Common sampling instant with less than 0.1 ns skew in the source example |
| **Component count** | Low: one ADC and one multiplexer | High: one ADC for each channel | Low: one integrated device |
| **Cost** | Lowest | High | Moderate |
| **Best application** | Temperature and battery monitoring | Modular and isolated systems | Motor-control loops |

---

## Appendix: Phase-Locked Loops

A **phase-locked loop (PLL)** is a feedback system.
It combines analog and digital functions.

A basic PLL contains:

* A **phase detector** or **phase-frequency detector**.
* An amplifier and **loop filter**.
* A **voltage-controlled oscillator (VCO)**.

The phase detector compares the input with the feedback signal.
The loop filter converts the detector output into a control voltage.
The control voltage changes the VCO frequency.

This subject relates voltage, frequency, conversion, and sampling-clock generation.
See [Phase-Locked Loops](../Timing/PLL.md) for the dedicated topic page.

### Capture Process

A phase detector can correct a frequency error because frequency difference produces a changing phase difference.

#### Step 1: Produce a Moving Phase Difference

Assume that:

* The input frequency is 100 Hz.
* The VCO frequency is 90 Hz.

The input completes cycles faster than the VCO.
The input continuously moves ahead of the VCO.
The phase difference moves from 0 degrees through 360 degrees and repeats.

The phase-detector output contains a periodic **beat note**.
For this example, the beat-note frequency is 10 Hz.

#### Step 2: Push the VCO Toward the Input Frequency

The loop filter receives the beat note.
A phase-frequency detector can produce a nonzero average voltage when the frequencies are different.

For example, the average control voltage can be +3 V when the VCO is too slow.
This voltage increases the VCO frequency.

#### Step 3: Establish Lock

The beat note becomes slower as the VCO approaches 100 Hz.
The periodic beat note stops when the frequencies lock.

The detector then produces the steady DC control voltage that holds the VCO at 100 Hz.
The input and VCO keep a fixed phase relationship.
For example, the input can stay 5 degrees ahead of the VCO.

#### Step 4: Check the Capture Range

The loop cannot lock from every initial frequency difference.
The input and VCO frequencies must be inside the **capture range**.

Assume that one frequency is 1 MHz and the other frequency is 10 Hz.
The beat note can be too fast for the loop filter.
The filter can average the detector signal to almost zero.
The VCO then receives insufficient correction and does not lock.

Loop bandwidth, detector type, VCO tuning range, and signal level affect the capture range.

### Voltage-Controlled Oscillator

A **VCO** converts a control voltage into an output frequency.

For one illustrative tuning relationship:

* 1 V can produce 100 Hz.
* 2 V can produce 150 Hz.

A free-running VCO has frequency error and temperature drift.
The PLL continuously corrects this error.

The loop gives two useful signals:

1. **VCO output, <i>f<sub>out</sub></i>:** This is the synthesized clock or radio-frequency signal.
2. **Control voltage, <i>V<sub>tune</sub></i>:** This is the frequency-error signal and can contain demodulated information.

### Frequency Multiplication

A feedback divider makes the VCO operate at a multiple of the input frequency.

Assume that the input is 100 Hz and the required output is 500 Hz.
Put a divide-by-5 counter between the VCO output and the phase detector.

The phase detector compares the 100 Hz input with the divided feedback.
For the feedback to equal 100 Hz, the VCO must operate at 500 Hz:

> **500 Hz / 5 = 100 Hz**

The loop applies this equality:

> **f<sub>fb</sub> = f<sub>in</sub>**

For a divide-by-<i>N</i> feedback counter:

> **f<sub>fb</sub> = f<sub>out</sub> / N**

Substitution gives:

> **f<sub>out</sub> / N = f<sub>in</sub>**

The output frequency is:

> **f<sub>out</sub> = Nf<sub>in</sub>**

A digital flip-flop can divide frequency.
A passive resistor or capacitor cannot insert new cycles to multiply frequency.
A PLL multiplier uses the VCO to generate the higher-frequency signal.
The feedback loop synchronizes this signal with the input.

### Jitter Cleaning

An input clock can have **jitter**.
Jitter causes its edges to move in time.

A narrow loop bandwidth averages fast timing errors from the phase detector.
The VCO follows the average input frequency and rejects faster input jitter.
The VCO output can then have cleaner timing than the input.

This operation is sometimes called a **flywheel effect**.
The narrow bandwidth also increases lock time.

### FM Demodulation

Frequency modulation (**FM**) stores information in frequency changes.

For example, an FM signal can move from 100 Hz to 101 Hz and then to 99 Hz.
The PLL changes the VCO control voltage to stay locked to these changes.
The changing control voltage reproduces the modulating signal.
For radio, this voltage can contain the recovered audio waveform.

### Loop-Filter Trade-Off

External resistors and capacitors frequently set the loop bandwidth.

* **Wide loop bandwidth:** The PLL locks quickly and can follow frequency hopping.
  It also transfers more input jitter to the output.
* **Narrow loop bandwidth:** The PLL locks slowly.
  It rejects more fast input jitter.

Select the bandwidth from the required lock time, modulation bandwidth, and jitter rejection.

### VCO Supply Filtering

Noise on the VCO supply can modulate its frequency.
This modulation produces sidebands and jitter.

Use strong supply filtering when the VCO sensitivity requires it.
An LC filter can isolate the VCO supply from regulator and digital noise.
Follow the VCO datasheet stability and decoupling requirements.

### Information That a PLL Does Not Preserve

A PLL does not behave like a linear op-amp chain.

#### Amplitude Information

An op-amp can preserve proportional voltage changes.
If its input changes from 5 V to 2 V, its output can change by the same ratio.

A PLL output has an amplitude set mainly by the VCO output stage.
The VCO can produce a fixed 3.3 V clock for different valid input amplitudes.
Information stored only in amplitude is not present in this clock output.

As a result, a PLL clock output does not preserve amplitude-modulated radio information or sensor magnitude.

#### Instantaneous Response

An op-amp can respond in nanoseconds when its bandwidth permits this response.
A PLL has loop-filter inertia.

If an input changes from 100 Hz to 200 Hz, the VCO can sweep to the new frequency over milliseconds.
Fast frequency changes outside the loop bandwidth are attenuated.

This effect can remove fast FM content.

#### Downstream Bandwidth

Assume that a PLL multiplies a 1 MHz input to 2 MHz.
The stage after the PLL must operate correctly at 2 MHz.

An amplifier with only 1 MHz bandwidth can attenuate or distort the new signal.
The PLL did not remove bandwidth.
It created a faster signal that the downstream circuit cannot process.

### PLL and Op-Amp Comparison

| Feature | Op-amp chain | PLL chain |
| --- | --- | --- |
| **Amplitude** | Can preserve proportional amplitude | VCO output amplitude is usually fixed |
| **Response** | Can respond in nanoseconds | Requires lock and tracking time |
| **Noise behavior** | Adds analog wideband noise | Can clean timing jitter |
| **Next-stage bandwidth** | Must support the signal bandwidth | Must support the multiplied output frequency |
