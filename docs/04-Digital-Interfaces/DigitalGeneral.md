---
title: Digital Logic & Interfacing
sidebar_label: Digital Logic
---

# Digital Logic & Interfacing

## 1. Digital Fundamentals

**Digital Transmission (PCM):**
Digital transmission like PCM is used because it doesn't pick up noise on the transmission line. As long as the 0s and 1s are differentiable, we are good.

**Noise Immunity:**
Noise immunity is how well a circuit can handle noise without the logic levels getting messed up and staying error-free.
* **TTL:** Struggled with this since its noise immunity was about **0.4V**.
* **CMOS:** Has much higher noise immunity (typically ~1.5V).

**Logic Levels:**
* **CMOS (5V):** Low is considered **1.5V and below**. High is **3.5V and above**.
* **TTL (5V):** Low is **0.8V and below**. High is **2.0V and above**.
* **Comparison:**
    * *Supply:* CMOS can operate over a range; TTL requires strict +5V.
    * *Input Current:* CMOS inputs draw no steady current (voltage controlled); TTL inputs require current.
    * *Output:* CMOS outputs are rail-to-rail; TTL cannot reach V+ (usually stops at ~3.5V).
    * *Power:* CMOS has only dynamic power consumption (proportional to frequency), whereas TTL has substantial quiescent power.



**"T" Variant Families:**
Many CMOS families have “TTL threshold” variants, often specified with a “T” in the family name: HC→**HCT**, VHC→**VHCT**.
* These families specify a maximum LOW threshold of +0.8V and a minimum HIGH threshold of +2.0V.
* These duplicate the bipolar-TTL specification, where the input logic threshold is about two diode drops above ground (about 1.3V).

---

## 2. Number Systems & Codes

* **BCD (Binary Coded Decimal):** Converting each digit of decimal into 4 digit binary.
* **Binary:** Converting a decimal to power of 2s. It's different from BCD.
* **Hexadecimal:** Base 16. Convert from decimal to binary, and then every 4 bits of binary represent a digit in hex.
* **Negative Numbers:**
    * *Sign/Magnitude:* MSB is sign bit, the rest are magnitude. Is awkward when doing addition/subtraction.
    * **2s Complement:** The most used kind. Get it by taking the absolute value in binary, **inverting all the digits**, then **add 1**. Adding and subtracting is now easy.
* **Gray Code:** Binary sequence where only one bit changes at a time. Used for encoders to prevent glitches.

---

## 3. Logic Gates & Output Types

**Propagation Delay:**
Time it takes for a gate to switch states. (MOSFETs are used nowadays over BJTs because less current draw etc).

### Output Architectures
So when you have a system of devices speaking to each other, it'd be bad to have a wire from every device connected to every other device. Instead, we use a **Data Bus**. The idea is that only 1 device can write to the bus, but all others can listen. There has to be a system in place that can dictate who has what responsibility at a given time.

1.  **Push-Pull (Totem Pole):**
    * *Pros:* Faster and has higher noise immunity.
    * *Cons:* It's always either On or OFF. It can't "listen in" (High-Z).
2.  **Open Collector:**
    * *Mechanism:* Output pulls LOW or floats.
    * *Cons:* Reduced speed and noise immunity (requires pull-up resistor).
3.  **Tri-State Logic:**
    * *Mechanism:* Outputs can be one of 3 states: High, Low, **Open (High-Z)**.
    * *Usage:* Uses an **Enable** pin to do this. Behaves like normal push-pull when enabled.
4.  **Transmission Gates:**
    * *Mechanism:* Either connect directly the output with low resistance, or they are open-circuited. They are bidirectional so they don't care which end is considered input and output. Used a lot in CMOS stuff.

:::info Future Study: Sequential Logic Refresher
You mentioned needing a refresher on these topics for future designs:
* **Flip Flops:**
    * **D-Type:** Data latch. Output follows Input on clock edge.
    * **JK-Type:** Configurable (Toggle, Set, Reset, Hold).
* **State Machines:**
    * **Moore:** Output depends *only* on the current state.
    * **Mealy:** Output depends on current state *and* current inputs (can react faster, but glitches possible).
* **Programmable Logic:** PALs (Programmable Array Logic) &rarr; CPLDs &rarr; FPGAs (Field Programmable Gate Arrays).
:::

---

## 4. Logic Interfacing Guide
*Source: Adapted from The Art of Electronics*

The 3 things that can prevent you from connecting digital stuff is **input logic level incompatibility**, **output drive capability**, and **supply voltage**.

**General Rules:**
* CMOS logic devices can always connect as long as they are running from the same supply.
* CMOS on 5V supply connected to 5V tolerant devices can always be connected.

### Interfacing Scenarios
**C. Lower-voltage CMOS driving 5V logic**
You can drive “TTL input” (reduced-threshold) 5V logic directly from CMOS outputs that swing at least to 2.5V. In addition to true bipolar-TTL parts, some 5V CMOS families (such as 74HC, 74AC, 74AHC, 74VHC) include TTL threshold variants (74HCT, 74ACT, 74AHCT, 74VHCT). There’s also the 74LV1T level-translating family.

**D. CMOS at 2.5V driving CMOS at 3.3V**
Nearly all CMOS families that can operate at 3.3V supply voltage have TTL-compatible input levels (&lt;0.8V LOW, &gt;2.0V HIGH), so it’s safe to drive them from the full-swing output of CMOS powered from 2.5V.

**E. 5V “TTL outputs” driving reduced-threshold 5V logic**
To drive logic powered from 5V, those outputs – LOW close to 0V, but HIGH only ~3.5V (and only guaranteed to be &gt;2.4 V) – must be paired with TTL-compatible inputs; that limits you to true 5V bipolar TTL (e.g., 74F), or to 5V CMOS logic families with TTL-compatible inputs (74ACT, 74HCT, 74AHCT).

**F. 5V “TTL outputs” driving incompatible 5V logic**
If you’re stuck with normal threshold 5V logic (i.e., threshold at VDD/2, or ~2.5 V), you can use a CMOS buffer or inverter with TTL thresholds (74HCT, etc) to convert the TTL swing to a 5V full-swing signal. Note also that you can use instead a special level translator part like the 74LVC1T45.

**G. Dual-supply level translator: 1.8–5V**
The dual-supply **74LVC1T45** lets you translate between logic levels powered from 1.8V to 5V on either side (bidirectional, controlled by DIR pin). The lower-voltage **74AVC1T45** operates from 1.2V to 3.6V. Note that the LVC part, when operated at 5V on its input side, has a “mid-supply” input threshold (guaranteed LOW &lt;1.5V, HIGH &gt;3.5 V) and cannot be driven from a TTL output level.

**H, I, J. Open-drain and open-collector**
You can translate up or down in voltage level with an open-drain buffer, though you pay a price in speed.
* **74LVC07:** Translation between 1.8–5V.
* **74LS07:** High-voltage open-collector (pull up to +15V).
* **74AUC1G07:** Works down to very low logic levels (0.8V).

**K. Low-voltage CMOS driving 2.5–5V logic (TXB0101)**
The TXB0101 is another dual-supply translator, but it has a couple of quirks. It is bidirectional but has no DIR control input; instead, it senses transitions on either side, responding by switching on the opposite port’s CMOS drivers briefly, then maintaining that state weakly (~4k series output resistor).

**L. Very low voltage CMOS to 3.3V or 5V logic (LVDS Trick)**
Here’s a nice trick: an **LVDS receiver** accepts a differential digital signal pair, within a common-mode range from 0V to +2.4V, and with guaranteed switching down to an input amplitude of 200mV. You can trick it into working as a level translator by supplying a reference DC level halfway between logic states to the unused input. Works down to inputs as little as 0.5V (propagation delay &lt;2ns).

**M. Configurable Logic Translators**
"Universal" gates can be used to perform some logic while translating across logic voltage domains. These gates have Schmitt-trigger inputs.

:::tip Signal Warnings
* **Slow Inputs:** When you have a very low slew rate input signal, the input chip will flicker states a lot of times before properly switching. Use a **Schmitt trigger** to get faster edges.
* **Debounce:** Remember that when using a mechanical switch, always debounce it.
* **Clocking:** Don't try to drive clock inputs from op-amp interfaces – the transition times are too long. Use a comparator with hysteresis or a Schmitt-trigger inverter.
:::

---

## 5. Signal Integrity & Long Wires

**The Issues:**
Issues come up when sending digital signals through cables like capacitive loading of fast signals, common-mode interference, and transmission line effects like reflection because of no impedance matching.

**Transients (Ground Bounce):**
To reduce output transients (push-pull switching causing current spikes):
* **Grounding:** Use big ground lines or ground plane (lower inductance).
* **Bypass Caps:** Use liberally throughout the PCB. Bigger caps around ICs for energy storage.
* **Pin Spacing:** Reducing the distance between the pins reduces inductance.

**The Capacitance Problem:**
A digital output will see the stray wiring capacitance and input capacitance of the chip it drives as part of its overall load. To overcome that capacitance you have to sink or source a large amount of current.
* *Verdict:* Because of these noise problems, **don't use logic families at speeds faster than what you need.**

**Transmission Lines:**
You can't just send digital signals through a conductor at a long distance. You will encounter transmission effects.
* **The Fix:** Terminate the cable with its characteristic impedance (usually 50 ohms for coaxial). This stops all reflections and distortions.

:::info Deep Dive: Termination Types
You asked about Double Ended Termination. Here is the breakdown:

1.  **Series Termination (Source):** A resistor (e.g., 50&Omega;) in series at the *driver*. It absorbs the reflection coming back from the load. Good for point-to-point, low power.
2.  **Parallel Termination (Load):** A resistor to ground at the *receiver*. Kills reflection immediately but burns DC power.
3.  **Thevenin Termination:** Two resistors (one to VCC, one to GND) at the receiver. Matches impedance and sets a DC bias, but burns power.
4.  **Double Termination:** Resistors at *both* Source and Load. Highest signal quality, but cuts signal amplitude in half. Used in video/RF/PCIe.
:::

---

## 6. Optoelectronics

### I. Emitters
* **LEDs:** Visible and IR. VF ranges from ~1–3.5V depending on color.
* **Laser Diodes:** IR, red, and blue. Fiber-optic transmitters, laser pointers, CD/DVD players.
* **Electroluminescent:** Night lights, "Indiglo" low-power backlight.

### II. Displays
* **LED-based:** 7-segment (numeric), dot-matrix.
* **LCD:** Liquid Crystal. Reflective or Backlit.
* **VFD (Vacuum-Fluorescent):** Smart LCD emulation, superior readability.
* **OLED:** Organic LED. Inexpensive, self-emissive.
* **Electronic Paper:** E-Ink (Kindle). Image retention at zero power.

### III. Detectors
* **Photodiode:** PN or PIN junction. Photovoltaic mode (short circuit) or Photoconductive mode (back-biased).
* **Phototransistor:** Transistor with base-emitter photodiode. Higher current (Gain &beta;) but **slower**.
* **Photoresistor:** Light-sensitive resistor (CdS). Slow response.
* **Bolometric:** Pyroelectric material (PIR). Motion detectors.
* **APD (Avalanche Photodiode):** High back-bias (~100V). Multiplies charge.
* **PMT (Photomultiplier):** Vacuum tube. Massive gain ($10^6$). Detects single photons.

### IV. Couplers (Optocouplers)
Optocouplers let you send digital and sometimes analog signals between circuits with separate grounds (Isolate Analog Front End from Digital).

**The 7 Types:**
1.  Phototransistor output.
2.  Logic output.
3.  Gate driver output.
4.  Analog-oriented.
5.  Solid-state relay with transistor output.
6.  Solid-state relay with triac/SCR output.
7.  AC-input optocouplers.