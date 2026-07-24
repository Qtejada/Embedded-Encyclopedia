---
title: Digital-to-Analog & Analog-to-Digital Conversion
sidebar_label: Selecting a Converter
---

# Chapter 13: Digital-to-Analog & Analog-to-Digital Conversion

## 1. Converter Selection Criteria & Checklist

### Digital-to-Analog Converters (DACs)
**Primary Parameters:**
* **Resolution:** Number of bits (determines the smallest output step size).
* **How to Determine Accuracy:**
    * *Monotonicity:* Does the output always increase as the input code increases? i.e does 100 and 101 and 102 always increase the voltage?
         The increase can vary slightly, and not by the expected voltage 5v/2^12 bits is your typical steps for a 5v DAC
         "Monotonic to 16 bits" would mean that for 16 bits of code input, the output will alway increase.
    * *Linearity:* How close is the transfer function to a straight line? i.e the INL (integran non-linearity) DAC spec usually specififed in dBs. For a
         12-bit DAC, it can say +/- 0.5 LSB which equals 2.44mv.
    * *DC Stability:* Drift over time/temperature.
* **Reference:** Can be Internal or External.
    * *Multiplying DAC (MDAC):* A specific type where V<sub>ref</sub> can vary, allowing the output to be the product of the reference signal and the digital code.
* **Output Type:** Voltage Output vs. Current Output.
* **Output Scaling:** Unipolar (0V to +V) or Bipolar (&plusmn;V). Includes V<sub>out</sub> ranges and I<sub>out</sub> compliance voltage.
* **Speed:**
    * *Settling Time:* How long to reach the final value within a specific error band.
    * *Update Rate:* Maximum frequency of code changes.
* **Digital Input Format:** Serial (I2C, SPI) or Parallel (faster, but high pin count).
* **Other:** Glitch energy (spikes during transitions), Power-on state (does it wake up at 0V or mid-scale?), and programmable internal scaling.

### Analog-to-Digital Converters (ADCs)
* **Resolution:** Number of bits.
* **Accuracy:** Monotonicity (no missing codes), linearity, and DC stability.
* **Reference:** Internal or External.
* **Input Scaling:** Unipolar vs. Bipolar input ranges.
* **Speed:** Conversion time (throughput) and Latency (delay).
* **Digital Output Format:** Serial (I2C, SPI) or Parallel.
* **Other:** Features like Internal Programmable Gain Amplifiers (PGA) and Spur-Free Dynamic Range (SFDR).

---

### ADC Selection Guide (By Speed)
* **Low Speed ("Voltmeter Speed", ~10/sec):**
    * *The Battle:* **Multislope Integrating** (perennial favorite) vs. **Delta-Sigma** (modern challenger).
    * *Examples:* LTC2412 (24-bit), AD7732 (24-bit, &plusmn;10V range).
* **Medium Speed (~100s ksps):**
    * *Resolution > 16 bits:* **Delta-Sigma** ICs dominate.
        * *Examples:* Cirrus AKM AK5384 (24-bit, 96ksps).
        * *Warning:* Audio ADCs have excellent dynamic range but poor (or nonexistent) DC specs.
    * *Resolution &le; 16 bits:* **Successive Approximation (SAR)** converters are highly usable.
* **Medium-High Speed (Few Msps):**
    * *The Battle:* A "fierce battle" between **Delta-Sigma** and **Switch-Capacitor SAR**.
    * *Verdict:* Comparable accuracy, but **SAR is faster**.
    * *Example:* ADI AD7690 (18-bit, 400ksps).
* **High Speed (100s Msps):**
    * *Winner:* **Pipelined Flash** (Half-Flash).
    * *Trade-off:* High throughput but with latency of ~10 sample intervals.
    * *Examples:* ADI AD9626 (12-bit, 250 Msps), TI ADS6149 (14-bit, 250 Msps).
* **Breakneck Speed (>250 Msps):**
    * *Winner:* **Flash Variants** (Folding/Interpolating).
    * *Trade-off:* Modest resolution (6–10 bits).
    * *Applications:* Oscilloscope front-ends, Digital Radio.
    * *Examples:* National ADC08D1520 (3000 Msps), ADC12D1800 (3600 Msps). Fujitsu features a 56 Gsps 8-bit converter!

### DAC Selection Guide (By Technology)
**Competing Technologies:** R–2R Ladder, Linear Resistor Ladder, Current-Steering.

* **Highest Linearity:**
    * *Winner:* **Delta-Sigma DACs**.
    * *Specs:* Best accuracy/linearity up to 20 bits at audio speeds; some have excellent DC specs (e.g., TI DAC1220).
    * *Warning:* Watch out for **Broadband & Clock Noise**. (e.g., DAC1220 has ~1000 nV/&radic;Hz noise vs. ~10 nV/&radic;Hz for resistor ladders).
* **Medium Speed, High Accuracy:**
    * *Winner:* **R–2R and Linear Ladder**.
    * *Examples:*
        * *Voltage Out:* TI DAC8552 (Dual 16-bit, very low glitch).
        * *MDAC:* ADI AD5544 (Quad 16-bit, Current Out, 0.5&mu;s settling).
        * *Diff Current:* LTC1668 (16-bit, 50&Omega; drive, 20ns settling).
        * *Precision:* TI DAC9881 (18-bit, Rail-to-rail, Low Noise).
* **Highest Speed:**
    * *Winner:* **Current-Steering Converters**.
    * *Examples:* TI DAC5681 (16-bit, 1 Gsps), ADI AD9739 (14-bit, 2.5 Gsps).

---

### The 10-Point DAC Selection Checklist
When selecting a specific component for a design, use this checklist to ensure no constraints are missed:
1.  **Resolution:** Number of bits (8, 10, 12, 16, 24?).
2.  **Speed:** Settling time and Update rate.
3.  **Accuracy:** Linearity, Monotonicity, and whether external trimming is required.
4.  **Input Structure:**
    * *Format:* Parallel vs. Serial.
    * *Logic:* Is it latched? Is it CMOS/TTL/ECL compatible?
5.  **Reference:** Internal vs. External (and is MDAC capability needed?).
6.  **Output Structure:** Current vs. Voltage output (check compliance and range).
7.  **Power:** Required supply voltages and total power dissipation.
8.  **Density:** Single or Multiple DACs per package.
9.  **Package Style:** Through-hole, Surface Mount, or Module.
10. **Price:** Cost constraints.

---
## 2. Digital-to-Analog Converters (DACs)
**Goal:** To convert a quantity specified as a binary or BCD number into a voltage or current proportional to the value of the digital input.

### Resistor-String DACs (Kelvin Divider)
A string of 2<sup>n</sup> equal value resistors is connected between a stable voltage reference and ground, creating a massive voltage divider. A set of MOSFET switches routes the voltage from the selected tap to an output voltage buffer.



**Pros & Cons:**
* **Monotonicity:** These excel in monotonicity because the architecture is physically a single string of resistors; it is impossible for step N+1 to be lower voltage than step N.
* **Glitch Energy:** Very low. Glitches are spikes that appear at the output during code transitions; this topology minimizes them.
* **Accuracy:** Excellent accuracy and stability.
* **Disadvantages:**
    * **Area:** Massive exponential increase in component count (2<sup>n</sup> resistors). High resolution (e.g., 16-bit) is impractical.
    * **Speed:** Slower conversion speeds due to the RC time constant of the large switch network.
    * **Mismatch:** Lower absolute accuracy due to cumulative resistor mismatch.

### R-2R Ladder DACs
This topology solves the size problem. It requires only 2n resistors for an n-bit DAC, rather than 2<sup>n</sup>. It relies on a repeating network of resistors with a perfect 2:1 ratio.



### Current-Output DACs (Current Steering)
DACs with current outputs are typically generated by an array of transistor current sources with scaled emitter resistors.

**Advantages:**
1.  **Speed:** Usually faster and lower priced than voltage-output types.
2.  **Flexibility:** Allows the user to choose the Current-to-Voltage (I-to-V) op-amp. You can select an op-amp specifically to minimize noise or to produce a larger output swing than the DAC chip could handle alone.
3.  **Combinability:** You can combine several DAC outputs directly (summing currents is easier than summing voltages).
4.  **Multiplying Capability:** Many are available as Multiplying DACs (MDACs), where the output current is the product of the digital input code and an analog signal applied to the V<sub>ref</sub> input.

---

## 3. Special DAC Configurations & Concepts

### 1. Multiplying DAC (MDAC)
A standard DAC takes a digital number and outputs a voltage based on a fixed internal reference (e.g., always 2.5V). An MDAC is different because it requires an **external reference voltage**, and that reference is allowed to change dynamically.

**The Math:**
The output is literally the multiplication of the two inputs:
> **V<sub>out</sub> = V<sub>ref(analog)</sub> &times; Digital Code**

**Why is this useful?**
* **Digitally Controlled Amplifier:** If you feed an audio signal (AC) into the V<sub>ref</sub> pin and change the Digital Code, you are controlling the volume. The DAC acts like a digital volume knob.
* **Four-Quadrant Operation:** Since V<sub>ref</sub> can be positive or negative, and the Digital Code can be effectively positive or negative, the output can be anywhere (positive or negative). This is rare in standard regulators but standard for MDACs.
* **Bandwidth:** These chips are fast. The "reference bandwidth" (e.g., 10 MHz) means you can feed a 10 MHz sine wave into the reference pin, and the DAC will successfully scale it without distortion.

### 2. The "Ratiometric" Concept (The Engineer's Cheat Code)
This explains how to get high precision using cheap, unstable power supplies.

**The Problem:**
Imagine you have a sensor (like a thermistor) powered by a 5V supply.
* If the 5V supply drifts up to 5.1V (+2%), the sensor output also rises by 2%.
* If your measuring device (ADC or DAC) has a perfect, separate 5.0V reference, it will read this higher sensor voltage and think the temperature changed. This is an error.

**The Ratiometric Solution:**
You use the same messy 5V supply to power **both** the sensor AND the reference input of your ADC/DAC.
* **Scenario:** The supply drifts to 5.1V (+2%).
* **Sensor:** Outputs 2% higher voltage.
* **ADC/DAC:** Its reference scale also grows by 2%.
* **Result:** The two errors cancel each other out perfectly. The ADC reads the ratio of the input to the reference, which remains constant.

**Real World Examples:**
* **Wheatstone Bridge:** A classic circuit where the measurement is based on the ratio of two voltage dividers, making it immune to power supply fluctuations.
* **555 Timer:** It generates accurate timing even if V<sub>CC</sub> changes because its internal thresholds (1/3 V<sub>CC</sub> and 2/3 V<sub>CC</sub>) shift in lockstep with the supply voltage.

---

## 4. Interfacing Current-Output DACs

When using a current-output DAC, you typically need to transform that current into a usable voltage output.

### Methods of Conversion
1.  **Passive Resistor to Ground:**
    * *Use Case:* Acceptable if load capacitance is low and you do not need large voltage swings.
    * *Mechanism:* Ohm's law (V = I &times; R).
2.  **Op-Amp Transimpedance Amplifier (TIA):**
    * *Use Case:* Necessary for large load capacitance or large voltage swings.
    * *Mechanism:* An op-amp in the transresistance configuration actively converts current to voltage.

**Dynamic Issues (Phase Lag):**
Using an external op-amp introduces phase shift between the DAC output and the final op-amp output, making the system slower.
* *The Fix:* Use a fast op-amp that requires no capacitor phase compensation for stability to keep the phase lag down.

### The "Gain Error" Trap
Current-output DACs often suffer from poor initial accuracy and stability regarding their Full-Scale Current (I<sub>out</sub>).
* **The Problem:** It is not uncommon to see a spread of as much as **2:1** in the full-scale current between chips.
* **The Fix:** Most current-output DACs include a **Built-In Feedback Resistor** that is closely matched to the internal R–2R resistors.
* **Implementation:** This resistor is intended to be used as the feedback element for your external op-amp (see Figure 13.9).
* **Warning:** If you ignore this internal resistor and use your own external discrete resistor, you may see gain errors of &plusmn;25%. Even if you trim that error out, the **residual gain drift** (tempco) will typically be 100 times worse than if you used the matched internal resistor.


---
## 5. Other DAC Architectures

### Delta-Sigma DACs
This technique (detailed in &sect;13.9) is complex but widely used in professional audio (e.g., ADI AD1955, 20-bit audio at 12 MHz).

**Mechanism:**
It generates a train of fixed-amplitude pulses at a very high clock rate on a single output line.
* The pulses are all the same width.
* The digital input code determines whether a pulse is **present or absent** at each clock interval.
* **Filtering:** This pulse train is passed through a low-pass filter (cutoff well below clock frequency) to generate the smooth analog output.

**The "1-bit" Misnomer:**
These are often called "1-bit DACs" because the output stage only has two states (High/Low). However, this is misleading because the **Delta-Sigma process** delivers stunningly linear output signals with very high effective resolution and dynamic range (e.g., 120 dB).

### PWM (Pulse-Width Modulation) as DAC
PWM can be used as a simple DAC by taking the average of the pulse width to generate an analog signal.

**Applications:**
* Widely used in **Class D Amplifiers**.
* Ideal for interfacing with counters and power-driving switches (MOSFETs) due to natural digital compatibility.

**Trade-offs:**
To get high resolution, you need a large number of steps (N).
* **The Conflict:** The timer has a maximum clock rate (f<sub>clk</sub>). The effective cycle rate of your PWM is f<sub>c</sub> = f<sub>clk</sub> / N.
* **Result:** High resolution requires a very slow PWM frequency (reduced bandwidth). If used in a feedback loop, this implies reduced loop bandwidth and gain.

---

## 6. Frequency-to-Voltage Converters
There are also dedicated circuits for converting frequency to voltage. These are often the functional inverse of Voltage-to-Frequency (V-to-F) converters. They are useful for applications like tachometers (motor speed sensing) or demodulating FM signals, where the information is encoded in the rate of pulses rather than the amplitude.

---

## 7. DAC Precision & Linearity

### 1. The "Weakest Link"
In high-precision applications, the DAC chip itself is often not the limiting factor for accuracy.
* **The Real Villain:** The external Voltage Reference is usually the "biggest troublemaker" regarding noise and drift.
* **Noise Specs:** A high-quality reference might have ~2&mu;V of low-frequency noise, while the op-amps buffering it might only contribute 0.1&mu;V.
* **The Fix:** Reduce reference noise by RC filtering it, or in extreme cases, by paralleling multiple references together to average out the noise.

### 2. Integrated vs. Discrete Trade-offs
* **Integrated DACs (e.g., LTC2656):** Include the voltage reference and output amplifiers inside the package.
    * *Pros:* Simple (single supply, no external parts).
    * *Cons:* Higher noise (e.g., 4x higher) and worse drift than a custom design.
* **Discrete Designs:** Using a "Multiplying DAC" with an external, ultra-low-noise reference and precision op-amps.
    * *Pros:* Better stability and lower noise.
    * *Cons:* Requires more board space and design effort.

### 3. Critical Precision Techniques
* **Bootstrapping/Guarding:** To filter a reference voltage using a large capacitor without leakage errors, you bootstrap the bottom of the capacitor so there is **0V DC across it**. Zero voltage means zero leakage current.
* **Kelvin Connections:** Use a "4-wire" connection on sense resistors for high currents. This separates the high-current path from the voltage-measurement path, preventing PCB trace resistance from causing errors.
* **Double Buffering:** For multi-channel DACs, this allows you to load data into all channels sequentially but apply the changes **simultaneously**. This prevents timing skew between outputs.

### 4. Circuit Stability
* **Inductive Loads:** Driving a coil (like in MRI machines) adds a pole to the feedback loop, potentially causing oscillation. You must compensate the loop (often by making the amplifier an integrator at low frequencies).
* **Bandwidth Limiting:** If an application is "quasi-static" (doesn't change fast), intentionally roll off the bandwidth (e.g., at 1 kHz) to filter out high-frequency reference noise and DAC glitches.

### 5. Linearity Deep Dive (INL vs. DNL)
If you need a DAC to hit a desired voltage with minimal error, the INL and gain error terms will dominate.

**A. DNL (Differential Non-Linearity) - "The Step Size"**
Measures the consistency of the step size.
* **Ideal:** Increasing code by 1 increases output by exactly 1 LSB.
* **High Error:** Steps vary wildly (some too small, some too big).
* **Non-Monotonic:** The worst case. Increasing the code causes the voltage to **drop**. (DNL < -1 LSB).
* **Why it matters:** Critical for **Control Loops**.
    * *Scenario:* A heater control loop tries to increase temp by increasing the DAC code. If the DAC is non-monotonic (voltage drops), the loop thinks it needs *more* heat and increases the code further, potentially causing a massive jump or oscillation (Limit Cycle).

**B. INL (Integral Non-Linearity) - "The Straightness"**
Measures the deviation of the overall transfer function from a straight line.
* **The "Banana" Effect:** Even if every single step is consistent (Perfect DNL), if they are all slightly "angled" wrong, the total error accumulates. By mid-scale, the output might be "bowed" significantly off-target.
* **Why it matters:** Critical for **Set-and-Forget** applications (e.g., calibration references) where absolute voltage accuracy is the priority.

**Analogy:**
* **DNL:** Checking each stair with a ruler. "Is this step exactly 8 inches?"
* **INL:** Stretching a chalk line from bottom to top. "Does the staircase sag in the middle?"

:::info Warning: Audio DACs in Non-Audio Apps
**Beware using audio DACs in non-audio applications.**
* **DNL Specs:** If a DAC datasheet does not provide a DNL specification, it is often because it is embarrassingly large.
* **Audio Tolerance:** In audio, monotonicity is nice but not strictly required (the ear is forgiving).
* **Control Loop Danger:** For control loops or precision voltage setting, a missing DNL spec is a dealbreaker. High DNL can cause instability.
* **Drift:** Gain-drift specs for audio DACs are also often too large for precise DC applications.
:::

---

## 8. Analog-to-Digital Converters (ADCs)

### 1. Fundamentals of A/D Conversion
At the top level, detailed knowledge of *how* the conversion happens (architecture) is often less important than the "Black Box" parameters:
* **Performance:** Speed, Accuracy, Resolution.
* **Interface:** Parallel, Serial (I2C/SPI), LVDS.
* **Integration:** Stand-alone module vs. Integrated (inside a microcontroller).
* *Note:* You will almost always use commercial chips rather than building discrete ADCs, but understanding the inner workings helps avoid specific pitfalls.

### 2. Sampling & Resolution (The Dimensions)
Converting a waveform involves slicing it in two dimensions: **Time** (Horizontal) and **Amplitude** (Vertical).

**Bit Depth (Vertical Slicing):**
Determines the precision of the voltage measurement for each sample.
* **Formula:** n bits = 2<sup>n</sup> levels.
* **Examples:**
    * 8-bit = 256 steps.
    * 16-bit = 65,536 steps.



**The "6dB Rule" (Dynamic Range):**
A crucial engineering rule of thumb: **Every 1 bit adds 6dB of Dynamic Range.**
* **Formula:** Dynamic Range &approx; 6n dB.
* **Example:** CD Audio (16-bit) has a dynamic range of 16 &times; 6 = **96 dB**. This represents the difference between the loudest possible sound (0 dBFS) and the quietest sound above the noise floor.

**Quantization Error (Distortion):**
Rounding real-world infinite voltages to the nearest "step" creates inherent error.
* **The Limit:** Accuracy cannot exceed 1/2<sup>n</sup>.
* **Example:** For 16-bit, the best possible distortion is 1/65536 &approx; 0.0015%.

**Real vs. Ideal (ENOB):**
Just because a chip is sold as "16-bit" does not mean you get 16 useful bits. Noise and nonlinearity often ruin the bottom bits.
* **ENOB (Effective Number of Bits):** The real engineering metric. A "16-bit" ADC might have an ENOB of only 14 bits because the last 2 bits are dominated by random noise.

### 3. Sampling Theory & Aliasing

**The Nyquist Criterion:**
A waveform is perfectly preserved **only** if sampled at a rate at least twice that of the highest frequency component present (f<sub>s</sub> > 2f<sub>max</sub>).

**Aliasing:**
If you sample below this frequency, the sampled points trace a **false signal** (an alias) that does not exist in the real world.
* *Fix:* You must use a **Low Pass Filter** (Anti-Aliasing Filter) before the ADC to remove any frequencies above the Nyquist limit.



**The "Guard Band" Strategy:**
A simple RC filter or even a 6-pole Butterworth filter is **not enough** if you place the corner frequency exactly at the Nyquist limit (f<sub>s</sub>/2).
* **The Problem:** Real filters have a gradual drop-off (e.g., -3dB point). Frequencies just above the cutoff will still pass through and cause aliasing.
* **The Solution (Oversampling):** Run the sample clock faster than the theoretical minimum (e.g., 25% oversampling).
    * This creates a **Guard Band** between the passband and the stopband.
    * You can then place the filter's -3dB point at the edge of your required signal band, giving the filter room to roll off before hitting the Nyquist frequency.

### 4. ADC Architectures
The text details the internal workings of common ADC types, ranging from "fast and expensive" to "slow and precise."

**A. Flash ADC ("Parallel")**
The fastest architecture available.
* **Mechanism:** The analog input voltage is compared simultaneously against a set of fixed reference voltages.
* **Implementation:** Requires driving an array of 2<sup>n</sup> analog comparators to generate an n-bit result instantly.
* **Variations:** **Pipelined** or **Folded** architectures break the conversion into steps, converting the "residue" of the previous step to save on component count.



**B. Successive Approximation (SAR)**
The standard for medium-speed, medium-resolution applications.
* **Mechanism:** Internal logic generates successive "trial codes" (binary search). These codes are converted back to voltages by an internal DAC and compared with the input.
* **Efficiency:** It requires just *n* steps to do an *n*-bit conversion.
* **Internal DAC Types:**
    * *Resistor Ladder:* Conventional n-stage R-2R.
    * *Charge-Redistribution:* Uses a set of 2<sup>n</sup> binary-scaled capacitors.



**C. Voltage-to-Frequency (V/F)**
* **Mechanism:** The output is a pulse train whose frequency is accurately proportional to the analog input voltage.
* **Asynchronous:** Oscillator is internal and free-running.
* **Synchronous:** Requires an external clock source. It gates a fraction of the clock pulses such that the *average* output frequency represents the input.

**D. Single-Slope Integration**
* **Mechanism:** An internal capacitor is charged by a current source to create a linear ramp (from 0V to Input Voltage).
* **Measurement:** The time required to reach the input voltage is measured by gating a fast, fixed-frequency clock and counting the pulses.
* **Note:** This ramp-comparator scheme is effectively the same method used in PWM (Pulse Width Modulation) generation.

**E. Dual-Slope & Multislope Integration**
These are variations on single-slope designed to eliminate errors from comparator offsets and component instability.
* **Dual-Slope:**
    * *Phase 1 (Run-up):* Capacitor ramps **up** for a fixed time with current proportional to the *input signal*.
    * *Phase 2 (Run-down):* Capacitor ramps **down** with a fixed reference current. The time taken to reach zero is proportional to the input.
    * *Benefit:* Component drifts cancel out because they affect both slopes equally.
* **Quad-Slope:** Adds an "Auto-Zero" cycle where the input is held at zero to measure and subtract offsets.
* **Multislope:** A complex succession of fast dual-slope cycles. It integrates continuously and applies corrections based on partial-cycle residues. It is a close cousin of the **Delta-Sigma** architecture.


---

## 9. Advanced ADC Architectures

### 1. Flash ADC ("Parallel Encoding")
The simplest and fastest concept (see Table 13.4).
* **Mechanism:** The analog input is fed simultaneously to *n* comparators. The other input of each comparator is connected to a reference ladder with *n* equally spaced voltages.
* **Thermometer Code:** The output is a "thermometer code" (e.g., 0000111), which represents the highest comparator activated. A priority encoder converts this into a standard binary output.
* **Advantage:** Short aperture sampling interval. The high speed ensures the signal effectively doesn't change during conversion, often eliminating the need for an external Sample-and-Hold circuit (unlike slower ADCs).
* **Disadvantage:** Exponential component growth (2<sup>n</sup> comparators). Practical limit is usually ~8 bits.



### 2. Flash Variants & Subranging
To improve resolution without thousands of comparators, we use multi-stage architectures. These introduce **Latency** (delay from input to output) but maintain or even increase **Throughput**.

**A. Half-Flash (The "Two-Step" Method)**
The "simplest" modification. Instead of guessing 8 bits at once (255 comparators), it breaks the job into two steps:
1.  **Coarse Guess:** A small Flash ADC estimates the top 4 bits.
2.  **Residue Generation:** An internal DAC converts that guess back to voltage, subtracts it from the input, and amplifies the remainder.
3.  **Fine Guess:** A second small Flash ADC measures the "Residue" to get the bottom 4 bits.
* *Benefit:* Reduces comparator count drastically (e.g., ~30 instead of 255).
* *Example:* TLC0820.

**B. Pipelined Flash (The "Capacitor Assembly Line")**
A more sophisticated version (e.g., AD9244) that stretches the Half-Flash concept into many stages (e.g., 10 stages).
* **The Switched-Capacitor MDAC:** The core component. It uses capacitors to perform three analog math operations simultaneously:
    1.  **DAC:** Convert digital guess to analog.
    2.  **Subtraction:** Subtract guess from input.
    3.  **Amplification:** Magnify the residue to fill the next stage's range.
* **The Pipeline Effect:** Because the residue is stored on a capacitor, Stage 1 passes it to Stage 2 and immediately starts processing the *next* sample.
* *Result:* Massive throughput (e.g., 65 Msps to 250 Msps) but with high latency (data takes 8-14 clocks to exit the pipe).



**C. Folding Architecture (The "Map Folding" Trick)**
Used for extreme speeds (e.g., 3.6 Gsps) where Pipelining is too slow or complex.
* **The Circuit:** Uses cross-connected differential pairs to turn a linear input ramp into a repeating triangle wave ("folds").
* **Operation:**
    * *Coarse ADC:* Determines which "Fold" (wave cycle) the input is in (MSBs).
    * *Fine ADC:* Measures the height of the wave within that fold (LSBs).
* *Benefit:* Incredibly fast like pure Flash but with far fewer comparators.

### 3. Delta-Sigma ADC (Intro)
*Note: Detailed analysis in &sect;13.9.*
Delta-Sigma converters are popular but mathematically complex.
* **Mechanism:** Two parts:
    1.  **Modulator:** Converts the analog input into a high-speed serial bitstream. The modulator consists of an integrator acting on the difference between the input and the 1-bit feedback output.
    2.  **Digital Filter:** A low-pass filter accepts the bitstream and decimates it to produce the final *n*-bit digital output.
* **Variations:** Higher-order modulators (weighted integrators) or multi-bit wordstreams.

---
## 10. Driving High-Speed ADCs (Flash, Folding, RF)

Modern high-speed ADCs cannot simply be connected directly to an op-amp output. They demand specific drive circuitry to handle their high bandwidth and dynamic input impedance.

### 1. The RC Interface (2R + C)
A common method to couple the driving op-amp to the ADC is a **2R + C Low Pass Filter**.
* **Role 1 (Nyquist Limiting):** It sets the bandwidth to the Nyquist limit (e.g., 40MHz). Even if you sample at 80 Msps, the ADC's input bandwidth might be **700 MHz**. Without this filter, the ADC will fold wideband noise (up to 700 MHz) down into the baseband, ruining SNR.
* **Role 2 (Charge Reservoir):** The capacitor acts as a local charge bucket. When the ADC's internal Sample-and-Hold switch closes, it draws a sudden gulp of current. The capacitor provides this charge instantly, so the op-amp doesn't have to slew.
* **Role 3 (Isolation):** The two resistors isolate the op-amp from the capacitor.

### 2. Op-Amp Stability with Capacitors
**The Problem:**
1000 MHz op-amps generally do not tolerate capacitive loads. The capacitor interacts with the op-amp's open-loop output impedance (R<sub>o</sub>) to create a pole in the transfer function, eating up phase margin and causing oscillation.

**The Fix (Isolation Resistor):**
The external resistor (R<sub>ext</sub> or R<sub>s</sub>) isolates the amplifier's output from the capacitor.
* **Critical Check:** You must ensure the feedback loop is taken **before** the resistor (directly at the op-amp output pin).
* *Feedback BEFORE Resistor:* The op-amp does not "see" the capacitor's phase shift in its feedback loop. It remains stable.
* *Feedback AFTER Resistor:* If you connect the feedback trace to the capacitor (to correct for the voltage drop), the capacitor is now **inside** the loop. The resistor cannot isolate it, and the op-amp will likely oscillate without complex compensation (like "Dual Feedback").

### 3. Differential Driving
Why use a differential amp?
* **Grounding Penalty:** Generally, when driving a device with differential inputs, you *can* ground one side and feed the other (single-ended).
* **The Cost:** However, doing so usually incurs a massive **distortion penalty** (even harmonics don't cancel) and cuts the **Full Scale Input Range** in half.
* **Verdict:** Always drive high-performance ADCs differentially.

### 4. Clock Jitter
For high-speed ADCs, the quality of the sample clock is often the limiting factor for Signal-to-Noise Ratio (SNR).
* **Mechanism:** Jitter is uncertainty in *when* the sample is taken. If the input signal is changing rapidly (high slew rate), a tiny timing error (&Delta;t) results in a large voltage amplitude error (&Delta;V).
* **Specs:** Review the ADC datasheet for maximum allowable aperture jitter to meet your SNR target.

---

## 11. Undersampling (Harmonic Sampling)

Undersampling (or Bandpass Sampling) is a technique where you digitize a high-frequency signal using a sampling rate much slower than the signal's carrier frequency.

### 1. The Core Concept: Redefining Nyquist
The standard Nyquist-Shannon theorem states that sampling frequency (f<sub>s</sub>) must be at least twice the maximum frequency component (f<sub>max</sub>).
* **Standard Approach:** To sample a 500 MHz radio signal, you normally need >1000 Msps. This is expensive and power-hungry.
* **Undersampling Approach:** Nyquist actually requires f<sub>s</sub> to be twice the **Information Bandwidth**, not the carrier frequency.
* **Example:** If a 500 MHz signal only carries 10 MHz of data (bandwidth is 495–505 MHz), you don't need 1000 Msps. You only need >20 Msps.

### 2. The Two Critical Conditions
To make this work without destroying data, two strict requirements must be met:
1.  **Strict Bandwidth Limiting:** The input signal must be passed through a **Bandpass Filter**. You must ensure that *only* the specific signal of interest is present. Any noise or signals at lower frequencies will mix (alias) with your signal and corrupt it.
2.  **High Analog Input Bandwidth:** This is the most common pitfall. Even if the ADC samples slowly (e.g., 200 Msps), its internal **Track-and-Hold** amplifier must be fast enough to latch onto a 500 MHz signal accurately.
    * *Example:* The ADC08200 is designed for this; it samples at 200 Msps but has a 500 MHz analog bandwidth.

### 3. Exploiting Aliasing
Undersampling intentionally uses Aliasing as a tool.
* **Normal Aliasing:** High frequencies fold down into baseband as noise.
* **Undersampling:** You treat the alias as the valid signal. The ADC acts like a **Mixer**, down-converting the 500 MHz carrier to a lower frequency (e.g., 100 MHz) that fits within the Nyquist zone of the 200 Msps sampler. This eliminates the need for a separate analog down-conversion stage.

### 4. Circuit Implementation Details
Based on the example circuit (Figure 13.29):
* **Termination:** The input signal sees a pair of 100&Omega; resistors. In parallel, these create a **50&Omega; load** to match standard RF impedance.
* **DC Biasing:** Since the ADC runs on a single supply (0V to +3V), it cannot handle negative AC swings. The input is AC-coupled and biased to the midpoint of the conversion range (approx. +0.6V).
* **Power Filtering:** A 100&mu;H choke is used to isolate the sensitive analog supply pin from the noisy digital supply pin.

---
## 15. Data Acquisition System Design (DAQ)

This section details the design of a **Multiplexed Signal Chain**. This is one of the most common architectures in electrical engineering: using one expensive, high-quality ADC to read many cheap sensors by switching between them.



### 1. Universal Design Principles
Here are the extracted engineering principles applicable to almost any ADC design.

#### A. The Multiplexer Trade-Off: Safety vs. Speed
* **"Break-Before-Make":** A critical feature. The switch disconnects Channel 1 *before* touching Channel 2.
    * *Why:* Prevents shorting two sensors together. If Ch1 is +10V and Ch2 is -10V, "Make-Before-Break" would cause massive current inrush and "Crosstalk."
    * *Cost:* You must wait for the "Dead Time" (e.g., 80ns).
* **Input Protection:** Standard CMOS muxes die if V<sub>in</sub> exceeds the supply rails.
    * *Rule:* If a sensor is user-accessible, assume they will plug in the wrong voltage. Use robust High-Voltage Muxes or external MOSFET clamps.

#### B. The Switch Trade-Off: Resistance (R<sub>on</sub>) vs. Noise
* **The Trap:** You might assume you want the lowest resistance switch (e.g., 0.5&Omega;).
* **The Physics:** Low resistance requires large transistors &rarr; High Capacitance.
* **The Consequence:** High capacitance causes **Charge Injection**. Flipping the switch dumps a charge spike into your signal.
* **The Lesson:** For high-impedance sensors, choose **Low Leakage / Low Capacitance** switches (even if R<sub>on</sub> is 80&Omega;). The resistance is negligible if the next stage is a high-impedance amplifier.

#### C. The "Error Budget": RTI vs. LSB
You must determine if your amplifier is accurate enough for your ADC.
1.  **Calculate LSB:** For a &plusmn;10V range (20V span) at 16-bit:
    > LSB = 20V / 65536 &approx; 300 &mu;V
2.  **Check Amp Offset (RTI):** If the amp has a 5.5mV offset (5500 &mu;V), the error is **18x larger** than the LSB.
3.  **Conclusion:** The 16-bit ADC is wasted precision unless you use a **Nulling Circuit** (a cheap DAC) to calibrate out the offset.

#### D. The "Drift" Trap
Even with perfect calibration at room temp, chips drift when hot.
* **Calculation:** If Amp Gain Drift = 40 ppm/&deg;C and ADC Resolution = 16-bit (~15 ppm): A **1&deg;C change** causes >1 LSB error.
* **Rule:** For 16+ bit systems, **Temperature** is usually the limiting factor, not bits.

#### E. Timing Stack-Up
You cannot rely solely on the ADC datasheet speed. Total sample time is:
> T<sub>total</sub> = T<sub>MuxSwitch</sub> + T<sub>AmpSettling</sub> + T<sub>ADC Acquisition</sub>

* **Lesson:** If you switch too fast, the amplifier won't settle, and you will measure a "ghost" of the previous channel.

---

### 2. Case Study: 16-Channel Multiplexed DAQ
**Goal:** Digitize 16 differential inputs using a single ADC, controlled by a microcontroller.

#### Signal Chain Components:
1.  **Input Multiplexer (MPC506):**
    * *Choice:* Dielectrically isolated process allows inputs to swing to **20V** (beyond supply rails) without latch-up.
    * *Trade-off:* High R<sub>on</sub> (1.5 k&Omega;), but acceptable due to downstream high-Z amp.
2.  **Mode Select Switches (IH5043):**
    * *Choice:* Prioritized **Low Charge Injection** over low resistance to minimize noise spikes.
3.  **Programmable Gain Amp (PGA202):**
    * *Impedance:* 10 G&Omega; input renders the Mux resistance negligible.
    * *Calibration:* An external 10-bit DAC injects a nulling voltage to cancel the 5.5mV offset.
4.  **ADC (LTC1609):**
    * *Specs:* 16-bit SAR, 200 ksps.
    * *Reference:* Internal reference replaced with an external **Precision Reference** (1 ppm/&deg;C) to fix poor internal drift.

**Operation:**
* **Startup:** MCU measures offset and zeroes it via the DAC.
* **Runtime:** MCU looks up gain settings, switches Mux/Gain, waits >2&mu;s for settling, then triggers conversion.

---

## 16. Simultaneous Sampling DAQ

**Concept:** Instead of measuring Channel 1, then Channel 2 (Multiplexed), Simultaneous Sampling measures **all channels at the exact same nanosecond**.
* **Applications:** 3-Phase Power Monitoring, Vibration Analysis (where phase relationship matters).

### 1. Architectures
* **Discrete (Daisy Chain):** One separate ADC chip per channel. Connected in a chain so they share one serial interface. Good for modular systems.
* **Integrated (SoC):** A single chip (e.g., **MAX11046**, **AD7608**) containing 8 separate ADCs/Track-and-Holds.

### 2. Design Challenges
#### A. Level Translation (Bipolar to Unipolar)
Industrial sensors often output &plusmn;10V, but high-speed ADCs run on 0-5V.
* **Solution:** **Level Translating Driver** (e.g., AD8275). It shrinks the input (Gain = 0.2) and shifts the center point.
* **Gotcha (RTO):** Driver specs are often "Referred to Output." If offset is 0.5mV RTO and Gain is 0.2, the actual input error is **2.5mV**.

#### B. Digital Isolation (The Clock Echo)
* **Problem:** Digital isolators (e.g., ADuM1402) have propagation delay (~27ns). At high speeds (50 Mbps), the data returns too late for the processor to catch it.
* **Solution:** **Echo Clock**. The ADC sends the clock *back* alongside the data. The processor uses this echoed clock to read data, ensuring perfect sync regardless of delay.

#### C. Serial vs. Parallel Interface
* **Serial (SPI):** (Discrete, AD7685).
    * *Pros:* Elegant, cheap isolation (4 wires).
* **Parallel:** (MAX11046).
    * *Pros:* Extremely fast readout.
    * *Cons:* Requires 16+ control lines. Isolation is massive and expensive (21 channels needed).

### 3. Summary Comparison Table

| Feature | Multiplexed | Simultaneous (Discrete) | Simultaneous (Integrated) |
| :--- | :--- | :--- | :--- |
| **Timing** | Time delay between channels | Perfect Sync | Perfect Sync (&lt;0.1ns skew) |
| **Component Count** | Low (1 ADC + Mux) | High (1 ADC/channel) | Low (1 Chip) |
| **Cost** | Lowest | High | Moderate |
| **Best For** | Temperature, Battery Mon. | Modular, Isolated Systems | Motor Control Loops |
---
## 17. Phase Locked Loops (PLLs)

A Phase Locked Loop (PLL) is a feedback system that is a mix of analog and digital techniques. It contains three main components: a **Phase Detector**, an **Amplifier (Loop Filter)**, and a **Voltage Controlled Oscillator (VCO)**.



### 1. The Capture Process ("Pull-In")
How can a device that only measures phase (timing) correct an error in frequency (speed)?

**A. The Core Concept: Frequency Difference = Moving Phase**
* **Concept:** Frequency is simply the speed at which phase changes.
* **Scenario:** If Input (f<sub>in</sub>) is 100 Hz and the VCO (f<sub>VCO</sub>) is 90 Hz, the Input is "lapping" the VCO.
* **The Output:** The phase difference is not constant; it loops continuously (0&deg; &rarr; 360&deg;). This creates a periodic waveform at the Phase Detector output called the **Beat Note** (at the difference frequency, e.g., 10 Hz).

**B. The "Push" (Deviating towards f<sub>in</sub>)**
* **Mechanism:** The 10 Hz "Beat Note" is fed into the Loop Filter.
* **The DC Component:** If the Phase Detector is designed correctly (e.g., Phase-Frequency type), this beat note has a non-zero average DC voltage (e.g., +3V if VCO is too slow).
* **Effect:** This DC voltage pushes the VCO frequency up towards the Input frequency.

**C. The "Lock" (Fixed Phase Relationship)**
* **Action:** As f<sub>VCO</sub> approaches f<sub>in</sub>, the Beat Note slows down.
* **Final Snap:** Eventually, the beat note stops. The Phase Detector output becomes a **Steady DC Voltage**—exactly the voltage required to hold the VCO at 100 Hz.
* **Result:** The phase relationship is now fixed (e.g., Input is locked 5&deg; ahead of VCO).

**D. "If Conditions Are Right" (Capture Range)**
* **The Failure Mode:** If the frequency difference is too large (e.g., 1 MHz vs 10 Hz), the Beat Note is too fast for the Loop Filter. The filter smooths it to zero, the VCO sees no signal, and it never locks.
* **Constraint:** The frequencies must be close enough to fall within the **Capture Range** (Bandwidth) of the loop filter.

### 2. The VCO (Voltage Controlled Oscillator)
* **Definition:** A "dumb" component that turns Voltage into Frequency (e.g., 1V = 100Hz, 2V = 150Hz).
* **The Problem:** On its own, a VCO is inaccurate and drifts with temperature. It *needs* the PLL loop to constantly correct it.

**The Two Outputs:**
1.  **VCO Output (f<sub>out</sub>):** The clean, synthesized oscillation (used in computers/radio).
2.  **Control Voltage (V<sub>tune</sub>):** The error signal itself (used in FM demodulation).

### 3. The 3 Real Applications ("Why build this?")



**A. Frequency Multiplication (The "Magic" Trick)**
* **Use Case:** Your MCU has a 100 Hz crystal, but you need a 500 Hz CPU clock.
* **The Trick:** Place a **Divide-by-5 Counter** in the feedback path (between VCO and Phase Detector).
* **Logic:** The Phase Detector compares Input (100 Hz) to Feedback. For Feedback to be 100 Hz, the VCO *must* run at 500 Hz (500 / 5 = 100).
* **Result:** Perfect frequency multiplication.

**B. Jitter Cleaning (The Filter)**
* **Use Case:** The input clock is "jittery" (edges shake due to noise).
* **Setup:** Configure the Loop Filter to be very "slow" (Low Bandwidth).
* **Action:** The slow filter averages out the rapid jitter errors from the Phase Detector. It refuses to pass the noise to the VCO.
* **Result:** The VCO runs at the exact average frequency of the input but produces a clean, steady sine wave.

**C. FM Demodulation (Radio)**
* **Use Case:** FM Radio encodes music by wiggling the frequency (100Hz &rarr; 101Hz &rarr; 99Hz).
* **Action:** The PLL locks to the radio signal. To stay locked, it must wildly change the **Control Voltage** to chase the wiggling frequency.
* **Result:** That changing Control Voltage *is* the music. You have recovered the audio waveform.

---
## 18. PLL Design Principles & Limitations

### 1. The Math of Frequency Multiplication
The PLL works on a strict equality rule: The Loop forces the Feedback Frequency (f<sub>fb</sub>) to equal the Input Frequency (f<sub>in</sub>). By placing a digital divider in the feedback path, you force the VCO to run faster to satisfy this equality.



**The Signal Flow Analysis:**
1.  **The Constraint:** The Phase Detector drives the VCO until:
    > f<sub>fb</sub> = f<sub>in</sub>
2.  **The Feedback Component:** A "Divide by N" counter in the feedback loop means:
    > f<sub>fb</sub> = f<sub>out</sub> / N
3.  **The Result:** Substituting (2) into (1):
    > f<sub>out</sub> / N = f<sub>in</sub>
4.  **Solving for Output:**
    > f<sub>out</sub> = f<sub>in</sub> &times; N

**Why passive components fail:**
* *Dividing Frequency:* Easy. A simple digital flip-flop can divide.
* *Multiplying Frequency:* Impossible passively. There is no resistor or capacitor that takes a 100 Hz signal and "inserts" extra cycles to make it 200 Hz. You **must** generate a new 200 Hz signal (via VCO) and use the PLL feedback mechanism to synchronize it.

### 2. Design Trade-Offs
**The Loop Filter:**
This is usually external (R's and C's). Your component selection sets the Loop Bandwidth, creating a fundamental trade-off:
* **Wide Bandwidth:** Fast lock time (good for frequency hopping), but passes input jitter to the output.
* **Narrow Bandwidth:** Slow lock time, but excellent jitter cleaning (flywheel effect).

**The VCO Power Supply:**
As discussed in power regulation, noise entering the VCO supply pin directly modulates the frequency, creating sidebands and jitter. **LC filtering** on the VCO supply pin is mandatory.

### 3. What is "Lost" with a PLL?
When you replace a simple wire or Op-Amp with a PLL, you lose three major characteristics.

**A. You Lose Amplitude (Volume)**
* **Op-Amp:** Preserves voltage levels. If input drops from 5V to 2V, output drops proportionally.
* **PLL:** Ignores amplitude completely. The VCO outputs a constant voltage (e.g., fixed 3.3V square wave) regardless of whether the input is a whisper or a scream.
* *Result:* Any data encoded in amplitude (AM Radio, sensor height) is destroyed. Only frequency (timing) is preserved.

**B. You Lose "Instant" Reaction (Inertia)**
* **Op-Amp:** Nanosecond response.
* **PLL:** Has "Inertia" due to the Loop Filter. If input jumps from 100Hz to 200Hz, the PLL "sweeps" up to the new frequency over milliseconds.
* *Result:* Fast Frequency Modulation (FM) is filtered out. The sharp edges of frequency changes are lost.

**C. The Bandwidth Mismatch**
* **The Scenario:** You use a PLL to multiply a 1 MHz input to 2 MHz.
* **The Problem:** The stage *after* the PLL (Op-Amp B) must now handle 2 MHz.
* **The Reality:** If Op-Amp B is a cheap part that only handles 1 MHz, it will fail (attenuate or distort). You didn't "lose" bandwidth in the PLL; you created a faster signal that your downstream hardware is too slow to catch.

**Summary: PLL vs. Op-Amp**

| Feature | Op-Amp Chain | PLL Chain |
| :--- | :--- | :--- |
| **Amplitude** | Preserved (Input 2V &rarr; Output 2V) | **Lost** (Input 2V &rarr; Output Fixed 3.3V) |
| **Response** | Instant (Nanoseconds) | Sluggish (Milliseconds to Lock) |
| **Noise** | Adds wideband noise | Cleans jitter (Acts as a flywheel) |
| **Next Stage** | Needs same bandwidth as input | Needs **N&times;** bandwidth (if multiplying) |
