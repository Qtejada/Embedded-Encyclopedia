---
title: Digital Logic & Interfacing
sidebar_label: Digital Logic
---

import useBaseUrl from '@docusaurus/useBaseUrl'
import LogicLevelExplorer from '@site/src/components/LogicLevelExplorer'

# Digital Logic & Interfacing

## 1. Digital Fundamentals

### Digital transmission

**Pulse-code modulation (PCM)** represents information with digital values. A digital receiver does not have to reproduce each small change in the transmitted waveform. It must identify each received value as a logic **0** or a logic **1**.

This property gives digital transmission good resistance to noise. The receiver can recover the data if the two logic states remain different and each signal stays inside its permitted input range. Digital transmission is not immune to noise. Sufficient noise can move a signal across a logic threshold and cause a bit error.

Noise, attenuation, jitter, crosstalk, and intersymbol interference can all cause errors. Regeneration restores logic levels only while voltage and timing margins remain valid. PCM also introduces sampling and quantization effects.

### Noise immunity

**Noise immunity** is the ability of a circuit to tolerate unwanted voltage without a logic error. The available **noise margin** is the difference between a guaranteed output level and the related input threshold.

* Classic **transistor-transistor logic (TTL)** has a worst-case DC noise margin of approximately **0.4 V**.
* A typical **5 V complementary metal-oxide-semiconductor (CMOS)** interface has a much larger noise margin, often approximately **1.5 V**. The exact value depends on the logic family and load.

Calculate the two margins from guaranteed datasheet limits:

> **High-level noise margin:** N<sub>MH</sub> = V<sub>OH(min)</sub> - V<sub>IH(min)</sub>

> **Low-level noise margin:** N<sub>ML</sub> = V<sub>IL(max)</sub> - V<sub>OL(max)</sub>

Use the output limits for the actual load and the input limits for the actual supply voltage and temperature. The V<sub>IL(max)</sub> and V<sub>IH(min)</sub> values are guaranteed input limits. They are not the exact internal switching thresholds.

The logic-level notation is as follows:

* **V<sub>OH(min)</sub>** and **V<sub>OL(max)</sub>** are the guaranteed HIGH and LOW output-voltage limits.
* **V<sub>IH(min)</sub>** and **V<sub>IL(max)</sub>** are the guaranteed HIGH and LOW input-voltage limits.
* **I<sub>OH</sub>** and **I<sub>OL</sub>** are the HIGH-state source and LOW-state sink currents of an output.
* **I<sub>IH</sub>** and **I<sub>IL</sub>** are the HIGH-state and LOW-state currents of an input.

### Logic levels

A voltage between the guaranteed LOW and HIGH input limits is not a valid steady logic level. Do not design a circuit to operate in this undefined region.

* **5 V CMOS:** A common specification identifies **1.5 V and less** as LOW and **3.5 V and more** as HIGH. These guaranteed input limits equal approximately 0.3 and 0.7 times the supply voltage. Always use the limits in the applicable datasheet.
* **5 V TTL:** An input of **0.8 V and less** is LOW. An input of **2.0 V and more** is HIGH.

The principal differences between CMOS and TTL are as follows:

* **Supply voltage:** Many CMOS families can operate across a specified supply range. Classic TTL normally requires a regulated **+5 V** supply.
* **Input current:** A CMOS input is voltage-controlled and draws almost no steady input current. Leakage current still flows. A bipolar-TTL input requires input current.
* **Output swing:** A CMOS output usually goes close to both supply rails when the load is light. A classic TTL output does not go to the positive rail. Its HIGH output is commonly approximately **3.5 V**.
* **Power:** CMOS power is principally dynamic and increases with switching frequency. CMOS also has leakage and short-circuit current. TTL has substantial quiescent power consumption.

Use these first-order power relations when the required parameters are available:

> **Static power:** P<sub>static</sub> = V<sub>CC</sub> × I<sub>CC</sub>

> **Capacitive-load switching power:** P ≈ αC<sub>L</sub>V<sub>CC</sub><sup>2</sup>f

Here, α is the switching activity, C<sub>L</sub> is the load capacitance, and <i>f</i> is the switching frequency. A datasheet can use an internal power-dissipation capacitance, C<sub>pd</sub>, to specify additional internal switching power.

### “T” variant families

Many CMOS families have **TTL-threshold** variants. The letter **T** commonly identifies this input option:

* HC becomes **HCT**.
* VHC becomes **VHCT**.

These variants specify a maximum LOW input threshold of **+0.8 V** and a minimum HIGH input threshold of **+2.0 V**. These limits reproduce the bipolar-TTL input specification. The switching threshold of a bipolar-TTL input is approximately two diode drops above ground, or approximately **1.3 V**.

The **1.3 V** value is an illustrative internal switching point. Do not use it as a compatibility limit. Use the guaranteed **0.8 V** and **2.0 V** input limits and the applicable output limits.

<LogicLevelExplorer />

---

## 2. Number Systems and Codes

### Binary-coded decimal

**Binary-coded decimal (BCD)** represents each decimal digit separately with four binary bits. For example, encode each digit of a multidigit decimal number as its own 4-bit value. BCD is not the same as the binary representation of the complete number.

In ordinary 8421 BCD, the codes from **1010** through **1111** do not represent decimal digits.

### Binary

**Binary** is a base-2 number system. Each bit position represents a power of 2. To convert a decimal number to binary, express the complete number as a sum of powers of 2.

### Hexadecimal

**Hexadecimal** is a base-16 number system. One hexadecimal digit represents four binary bits. One conversion method is to convert the decimal value to binary and then divide the binary value into groups of four bits.

### Negative numbers

* **Sign-and-magnitude:** The most significant bit (**MSB**) is the sign bit. The remaining bits contain the magnitude. This representation makes addition and subtraction awkward.
* **Two’s complement:** This is the most frequently used signed-integer representation. Use a fixed bit width. To form the negative value, write the absolute value in binary, **invert all bits**, and then **add 1**. This representation makes binary addition and subtraction easier.

For an <i>n</i>-bit two’s-complement number, the range is:

> **-2<sup>n-1</sup> through 2<sup>n-1</sup> - 1**

### Gray code

In a **Gray-code** sequence, only one bit changes between adjacent values. Position encoders use Gray code to reduce transition glitches.

Gray code reduces ambiguity when several binary bits would otherwise change together. It does not remove electrical noise, synchronization errors, or metastability by itself.

---

## 3. Logic Gates, Buses, and Output Types

### Propagation delay

**Propagation delay** is the time from a change at a gate input to the related change at its output. Modern logic commonly uses MOSFETs instead of BJTs because CMOS gates can have much lower static current consumption.

Datasheets commonly specify two delays:

* **t<sub>PLH</sub>:** Delay for an output transition from LOW to HIGH.
* **t<sub>PHL</sub>:** Delay for an output transition from HIGH to LOW.

The manufacturer measures these delays between specified input and output waveform reference points. Supply voltage, load capacitance, temperature, and input edge rate affect the result. Most modern standard logic uses CMOS MOSFET circuits and usually has lower quiescent power than bipolar TTL. The device technology alone does not set propagation delay.

### Datasheet checks, fan-out, and unused inputs

Use this procedure before you connect two logic devices:

1. Use **Recommended Operating Conditions** for the permitted design range. **Absolute Maximum Ratings** are damage limits, not operating targets.
2. Use minimum and maximum **Electrical Characteristics** for guaranteed behavior. Use typical values only for estimates.
3. Keep each test condition with its value. Check supply voltage, temperature, output current, load capacitance, and input transition time.
4. Check input clamp current, powered-off behavior, I<sub>off</sub>, enable and disable delay, setup time, hold time, clock-to-output delay, and thermal limits when they apply.

For DC fan-out, the total receiver input current must stay inside the driver rating:

> **HIGH state:** Sum of |I<sub>IH</sub>| must not exceed |I<sub>OH</sub>|

> **LOW state:** Sum of |I<sub>IL</sub>| must not exceed I<sub>OL</sub>

Modern CMOS systems are frequently limited first by total input, trace, connector, and probe capacitance. This capacitance affects rise time, fall time, delay, and transient current even when DC leakage is small.

Do not leave an ordinary CMOS input floating. Connect an unused input to a valid logic rail directly or through a resistor as the datasheet permits. A specified internal bias or bus-hold circuit is an exception. Use a pull resistor or keeper when a bus can otherwise leave a receiver input undriven. An unused push-pull output can usually remain open. Do not connect it directly to a supply rail.

### Shared data buses

A system can contain many devices that communicate with each other. A separate wire from every device to every other device is not practical. A **data bus** lets multiple devices use a common set of conductors.

A tri-state push-pull bus permits only one enabled writer at a time. Other devices can read the bus. An open-drain bus can permit several devices to pull the signal LOW at the same time. The system must control or define which devices can affect each shared signal during each interval. If two push-pull outputs drive opposite levels at the same time, **bus contention** occurs and a large current can flow.

### Output architectures

1. **Push-pull (totem-pole) output**

   * **Operation:** One transistor drives the output HIGH and another transistor drives it LOW.
   * **Advantages:** The output has fast rising and falling edges. Its low output impedance helps it hold the specified output voltage under load.
   * **Noise margin:** Compared with a weak resistor pull-up, the low output impedance of a push-pull output can give a larger loaded noise margin. Calculate the actual margin from guaranteed limits.
   * **Limitations:** A basic push-pull output always drives HIGH or LOW. It cannot enter **high impedance (High-Z)** to release a shared bus.

2. **Open-collector or open-drain output**

   * **Operation:** The output transistor pulls the signal LOW or turns off and lets the signal float. An external pull-up resistor produces the HIGH level.
   * **Limitations:** The pull-up resistor and bus capacitance make the rising edge slower. The output consumes current while it is LOW. A weak pull-up and the connected load can reduce noise margin. Calculate the actual margin from the resulting V<sub>OH</sub>, V<sub>OL</sub>, V<sub>IH</sub>, and V<sub>IL</sub> limits.

3. **Tri-state logic**

   * **Operation:** The output has three states: HIGH, LOW, and **open (High-Z)**.
   * **Control:** An **enable** pin selects whether the output drives the bus. When enabled, it operates like a push-pull output. When disabled, it releases the bus so that another device can drive it.

4. **Transmission gate**

   * **Operation:** A transmission gate connects two nodes through a low resistance or disconnects them with an open circuit.
   * **Direction:** It is bidirectional. Either terminal can operate as the input or the output.
   * **Use:** Transmission gates are common in CMOS multiplexers, switches, and internal logic.
   * **Limits:** On-resistance changes with signal voltage and supply voltage. Check permitted signal range, leakage, resistance, and capacitance.

:::info Future Study: Sequential Logic Refresher

The following topics are useful for future designs:

* **Flip-flops**
  * **D-type:** A data-storage element. The output accepts the input value at the applicable clock edge.
  * **JK-type:** A configurable element with hold, set, reset, and toggle operations.
* **State machines**
  * **Moore machine:** The output depends only on the current state.
  * **Mealy machine:** The output depends on the current state and the current inputs. A Mealy output can respond to an input change without waiting for the next state transition. This behavior does not guarantee a higher clock frequency, and an input change can cause an output glitch.
* **Programmable logic:** The progression from **programmable array logic devices (PALs)** to **complex programmable logic devices (CPLDs)** and then to **field-programmable gate arrays (FPGAs)** gives progressively larger and more configurable logic resources. The exact capability depends on the selected device.

:::

---

## 4. Logic Interfacing Guide

*Source: Adapted from The Art of Electronics*

Before you connect two digital devices, examine these three possible incompatibilities:

1. **Input logic levels**
2. **Output-drive capability**
3. **Supply voltage**

For each interface, compare the guaranteed output limits of the driver with the guaranteed input limits of the receiver. Also compare the current limits, voltage tolerance, edge rate, and power-sequencing requirements.

### General rules

* **CMOS devices on the same supply:** CMOS devices on the same supply can usually connect directly when their guaranteed input and output levels are compatible. Do not assume compatibility from the supply voltage alone.
* **5 V CMOS and 5 V-tolerant devices:** A 5 V CMOS output can connect directly to a 5 V-tolerant input when the receiver accepts the driver’s LOW and HIGH levels and the driver supplies the required current.

The term **5 V tolerant** only describes pin stress capability under specified conditions. It does not guarantee logic recognition, timing, current drive, or safe behavior while one device is powered off.

### Interfacing scenarios

#### C. Lower-voltage CMOS drives 5 V logic

A lower-voltage CMOS output can directly drive a reduced-threshold **TTL-compatible input** on a 5 V logic device when its loaded V<sub>OH(min)</sub> is at least **2.0 V** and its V<sub>OL(max)</sub> is not more than **0.8 V**. These inequalities are the first compatibility check. The resulting HIGH and LOW noise margins must also meet the design requirement. A **2.5 V** output-swing guideline gives additional HIGH-level margin, but the guaranteed datasheet comparison is the required test.

This method applies to true bipolar-TTL parts. It also applies to the TTL-threshold variants of some 5 V CMOS families:

* 74HC becomes **74HCT**.
* 74AC becomes **74ACT**.
* 74AHC becomes **74AHCT**.
* 74VHC becomes **74VHCT**.

The **74LV1T** family also provides level translation.

#### D. 2.5 V CMOS drives 3.3 V CMOS

Many **3.3 V low-voltage TTL (LVTTL)-compatible** receivers identify less than **0.8 V** as LOW and more than **2.0 V** as HIGH. Other 3.3 V CMOS inputs can require a HIGH level near 0.7 times their supply voltage. A full-swing CMOS output powered from **2.5 V** can often drive an LVTTL-compatible receiver, but it does not safely drive every 3.3 V CMOS input. Confirm the limits in both datasheets.

#### E. 5 V TTL outputs drive reduced-threshold 5 V logic

A 5 V TTL output has a LOW level close to **0 V**. Its HIGH level is commonly approximately **3.4 V to 3.5 V**, but the guaranteed minimum can be only **2.4 V to 2.5 V**, depending on the family and load.

Pair this output with a TTL-compatible input. Suitable receivers include true 5 V bipolar TTL, such as **74F**, and 5 V CMOS families with TTL-compatible inputs, such as **74ACT**, **74HCT**, and **74AHCT**.

#### F. 5 V TTL outputs drive incompatible 5 V logic

The actual switching point of normal-threshold 5 V CMOS can be near one-half of V<sub>DD</sub>, or approximately **2.5 V**. This midpoint is not a guaranteed interface limit. A representative 5 V HC input can specify V<sub>IL(max)</sub> = **1.5 V** and V<sub>IH(min)</sub> = **3.5 V**. A TTL output might not give sufficient HIGH-level margin for this input.

Use a CMOS buffer or inverter with TTL thresholds, such as **74HCT**, to convert the TTL swing to a full-swing 5 V signal. A dedicated level translator, such as the **74LVC1T45**, is another option.

#### G. Dual-supply level translation from 1.8 V to 5 V

The dual-supply **74LVC1T45** translates between logic domains in the **1.8 V to 5 V** example. The specified supply range extends from **1.65 V to 5.5 V** on each port. Translation is bidirectional, and the **DIR** pin controls the direction. The DIR input is referenced to V<sub>CCA</sub>. Keep both ports at defined input levels and follow the power-sequencing requirements.

The lower-voltage **74AVC1T45** operates from **1.2 V to 3.6 V**. When the LVC part operates with **5 V** on its input side, it uses a mid-supply input threshold. Its guaranteed limits are less than **1.5 V** for LOW and more than **3.5 V** for HIGH. A TTL output cannot reliably drive this input.

#### H, I, and J. Open-drain and open-collector translation

An open-drain or open-collector buffer can translate a logic level up or down. The pull-up resistor sets the output HIGH voltage. This method reduces speed because the resistor charges the load capacitance.

Example devices include:

* **74LVC07A:** Operation from **1.65 V to 5.5 V** with an open-drain output. It can translate between the **1.8 V and 5 V** example domains when all input, output, clamp-current, and powered-off limits are satisfied.
* **74LS07:** A high-voltage open-collector device. In this example, the pull-up connects to **+15 V**. The output has a **30 V** off-state rating, but current, power, and absolute-maximum limits still apply.
* **74AUC1G07:** Operation with very low supply levels, down to **0.8 V** and up to **2.7 V**. It is optimized near **1.8 V**. Do not assume that it permits an arbitrary 5 V pull-up.

Every connected pin must permit the selected pull-up voltage. Use these relations to select the pull-up resistor:

> **Minimum pull-up resistance:** R<sub>PU(min)</sub> ≥ [V<sub>PU</sub> - V<sub>OL(max)</sub>] / I<sub>OL, allowed</sub>

> **Approximate 10% to 90% rise time:** t<sub>r</sub> ≈ 2.2 R<sub>PU</sub>C<sub>bus</sub>

Use the permitted sink current for which the datasheet guarantees V<sub>OL(max)</sub>. Include all other LOW-state currents. Do not use the absolute-maximum pin current as the design current. The required rise time, total capacitance, leakage current, and receiver V<sub>IH</sub> set the maximum useful pull-up resistance.

#### K. Low-voltage CMOS drives 2.5 V to 5 V logic with TXB0101

The **TXB0101** is a dual-supply, bidirectional translator. It does not have a DIR input. It senses a transition on either port and briefly turns on the CMOS driver at the opposite port. It then holds the state weakly, with an output structure that behaves approximately like a **4 kΩ series resistance**.

This automatic-direction operation has restrictions. It is intended for push-pull CMOS signals. It does not support open-drain buses. An external driver must have sufficient current capability, and TI specifies at least **±2 mA** for the connected driver. External pull-up or pull-down resistors should be more than **50 kΩ**. Bus capacitance and slow edges can interfere with direction sensing. V<sub>CCA</sub> is **1.2 V to 3.6 V**, V<sub>CCB</sub> is **1.65 V to 5.5 V**, and V<sub>CCA</sub> must not exceed V<sub>CCB</sub> for this device.

#### L. Very-low-voltage CMOS drives 3.3 V or 5 V logic with an LVDS receiver

A **low-voltage differential signaling (LVDS) receiver** can operate as a special-purpose level translator when the selected part permits this use. Apply a stable DC voltage halfway between the two logic states to the reference input. Apply the low-voltage logic signal to the other input. The differential input voltage is V<sub>ID</sub> = V<sub>IN+</sub> - V<sub>IN-</sub>.

The **DS90LV012A** gives a traceable example. At V<sub>DD</sub> = 3.0 V to 3.6 V, its specified common-mode range extends from **0.05 V** to V<sub>DD</sub> - 0.3 V for V<sub>ID</sub> = 100 mV. Its application guidance gives **0 V to 2.4 V** as the recommended input-pin range for AC performance. Its receiver threshold region is **-100 mV to 0 V**, and TI tests propagation delay with a **200 mV** differential input. A **0.5 V** logic swing around a midpoint reference gives differential states of +0.25 V and -0.25 V, which exceed this threshold region.

At the datasheet test conditions, the propagation delay is approximately **1.7 ns to 1.8 ns typical**, which is less than the **2 ns** value in this example. The guaranteed maximum is **3.5 ns**. Confirm common-mode range, differential threshold, absolute-maximum limits, reference noise, fail-safe behavior, and maximum delay for the selected receiver.

#### M. Configurable logic translators

Some **universal or configurable translator gates** can perform a logic function while they translate between logic-voltage domains. Some products include **Schmitt-trigger inputs**. Do not assume that every universal gate has both features. Verify the selected part.

:::tip Signal Warnings

* **Slow inputs:** A signal with a very low slew rate can remain near an input threshold for a long time. Noise can then cause many false state changes, oscillation, or excess supply current before the input completes its transition. A **Schmitt trigger** adds hysteresis and makes a clean output transition. It does not make the physical input edge faster. Check the permitted input transition time.
* **Switch debounce:** A mechanical switch can make and break contact many times during one operation. Debounce the input when one mechanical operation must produce one logic event. A downstream circuit can provide the debounce function.
* **Clock inputs:** Do not normally drive a clock input directly from an ordinary op-amp interface. Slew rate, saturation recovery, output levels, and jitter can be unsuitable and can cause false clock events. Use a comparator with hysteresis or a **Schmitt-trigger inverter** unless a selected amplifier is proven to meet every clock requirement.

:::

---

## 5. Signal Integrity and Long Wires

### Principal problems

Digital signals can have problems when they travel through long conductors or cables. The principal problems are:

* **Capacitive loading** of fast signals
* **Common-mode interference**
* **Transmission-line reflections** caused by an impedance mismatch

The electrical length of an interconnection depends on signal rise time, not only on clock frequency. A low-frequency signal with a fast edge can require transmission-line treatment.

### Switching transients and ground bounce

Push-pull outputs produce short current pulses when they change state. Package and connection inductance convert these current changes into voltage transients. These transients can cause **ground bounce** and supply noise.

The approximate transient voltage is proportional to inductance and current-change rate:

> **V<sub>transient</sub> = L × di/dt**

Use these methods to reduce the transients:

* **Grounding:** Use a continuous, low-inductance return plane where the design permits it. Keep each signal return path intact. A low-inductance return path reduces the transient voltage.
* **Bypass capacitors:** Put the device-specified high-frequency ceramic capacitor close to each IC supply and ground pin pair with a small current loop. Use larger capacitors near groups of ICs for lower-frequency energy storage.
* **Short connections:** Reduce the distance between the supply and ground pins, their bypass capacitor, and the related current-return path. Shorter connections have less inductance.
* **Edge and output control:** When timing permits, use a slower edge, add validated source damping, or select a driver and package with lower simultaneous-switching noise.

### Capacitive loading

A digital output sees stray wiring capacitance and the input capacitance of each connected device as part of its load. The driver must source or sink current to charge or discharge this capacitance. Faster edges and larger capacitance require more current and can cause more ringing, crosstalk, and supply noise.

The transient current follows this relation:

> **i = C × dv/dt**

Include receiver inputs, traces, connectors, cables, and measurement probes in the capacitance estimate.

**Design rule:** Use an output edge rate no faster than necessary. Make sure that propagation delay and maximum frequency still meet the timing requirements.

### Transmission lines

Do not treat a long conductor as an ideal wire when the signal transition time is short compared with the propagation delay of the conductor. As a practical test, analyze transmission-line behavior when the interconnection round-trip delay is comparable to or longer than the driver rise or fall time. The interconnection then behaves as a **transmission line**, and an impedance discontinuity causes a reflection.

For a point-to-point link, a termination can match the source or load to the line’s characteristic impedance, Z<sub>0</sub>. A typical coaxial cable or single-ended PCB trace can be approximately **50 Ω**, but **75 Ω** coaxial cables and **90 Ω or 100 Ω** differential links are also common. Use the actual specified impedance. Correct termination reduces reflections. It does not remove all loss, crosstalk, or waveform distortion.

:::info Deep Dive: Termination Types

The principal termination arrangements are as follows:

1. **Series termination at the source:** Put a resistor in series with the driver. Use R<sub>series</sub> ≈ Z<sub>0</sub> - R<sub>driver</sub>. For a **50 Ω** line, the resistor is less than 50 Ω when the driver already has output resistance. The first wave travels to the high-impedance load, the load reflection completes the voltage step, and the source termination absorbs the returning reflection. This method is useful for a point-to-point connection with the receiver at the end of the line and has low DC power consumption.
2. **Parallel termination at the load:** Put a resistor equal to the line impedance at the receiver. Connect it to ground or to the applicable termination voltage. This arrangement absorbs the incident wave at the load, but it can consume continuous DC power.
3. **Thevenin termination:** Put one resistor from the receiver node to V<sub>CC</sub> and another resistor from the node to ground. Their parallel value matches the line impedance, and their ratio sets a DC bias. This arrangement also consumes DC power.
4. **Double termination:** Use designed impedances at both the source and the load. A correctly designed double termination can give high signal quality. If equal source and load resistances form a voltage divider, the received amplitude is one-half of the unloaded source amplitude. Double-ended termination is common in some video and RF systems. High-speed serial physical layers, including PCIe, use controlled source and receiver impedances by design. Follow the applicable interface standard instead of adding two arbitrary resistors.

:::

### Electrostatic discharge and exposed connections

Logic-device **human-body model (HBM)** and **charged-device model (CDM)** electrostatic-discharge (**ESD**) ratings describe component-handling tests. They do not prove system-level immunity to an IEC 61000-4-2 discharge at an exposed connector.

An exposed interface can require a low-capacitance **transient-voltage-suppression (TVS)** device or another protection network. Verify clamping voltage, capacitance, leakage, surge current, and the target product standard. Put the protection close to the entry point and provide a short discharge path to the intended chassis or ground node. Do not rely on internal input-clamp diodes or exceed their specified current.

---

## 6. Optoelectronics

### I. Emitters

* **LEDs:** LEDs emit visible or infrared (**IR**) light. A common illustrative forward-voltage V<sub>F</sub> range is approximately **1 V to 3.5 V**. The actual value depends on color, construction, current, and temperature, and some devices are outside this range.
* **Laser diodes:** Laser diodes can emit IR, red, or blue light. Applications include fiber-optic transmitters, laser pointers, and CD or DVD players.
* **Electroluminescent devices:** Applications include night lights and low-power backlights such as **Indiglo**.

### II. Displays

* **LED-based displays:** Examples include numeric 7-segment displays and dot-matrix displays.
* **LCD:** A **liquid-crystal display** can be reflective or backlit.
* **VFD:** A **vacuum-fluorescent display** is self-emissive and commonly gives high luminance and a wide viewing angle. These properties can make it easy to read. Some smart VFD modules emulate an LCD interface.
* **OLED:** An **organic light-emitting-diode display** is self-emissive. It can be a low-cost choice in some sizes and production volumes. Cost also depends on construction and lifetime requirements.
* **Electronic paper:** A bistable **E-Ink** display, such as a Kindle display, can retain an image without continuous pixel-drive power. The controller and complete system can still consume power.

### III. Detectors

* **Photodiode:** A photodiode uses a PN or PIN junction. In **photovoltaic mode**, it operates with zero applied bias and can feed a short-circuit or virtual-ground current input. In **photoconductive mode**, it operates with reverse bias. Reverse bias commonly reduces junction capacitance and increases speed, but it also increases dark current.
* **Phototransistor:** Incident light produces base drive, principally through the light-sensitive collector-base junction. Transistor gain β gives more output current than a photodiode, but the device is **slower**.
* **Photoresistor:** A photoresistor is a light-sensitive resistor. Cadmium-sulfide (**CdS**) is a common material. Its response is slow.
* **Bolometric detector:** A bolometer senses radiation through a temperature-dependent electrical property.
* **Pyroelectric detector:** A pyroelectric material responds to a change in incident thermal radiation. A **PIR motion detector** commonly uses this effect.
* **APD:** An **avalanche photodiode** operates with reverse bias near avalanche breakdown to multiply charge internally. A bias of approximately **100 V** is a useful example. Device requirements range from tens to hundreds of volts.
* **PMT:** A **photomultiplier tube** is a vacuum-tube detector. It commonly has a gain from approximately 10<sup>5</sup> to **10<sup>6</sup>** and can detect single photons when the tube, readout, and noise conditions permit it.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/PhotodiodeAmplifierFigure4.22.png')}
    alt="Photodiode connected to the virtual-ground input of an op-amp transimpedance amplifier with a one-megohm feedback resistor"
    className="invert-on-dark"
    style={{width: '520px', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    A photodiode transimpedance amplifier converts detector current into voltage. Image source: <i>The Art of Electronics</i>, Figure 4.22.
  </figcaption>
</figure>

### IV. Couplers

**Optocouplers** send digital signals, and sometimes analog signals, between circuits that have separate grounds. For example, an optocoupler can isolate an analog front end from digital circuitry.

These seven types are useful representative categories. They are not a formal exhaustive taxonomy:

1. **Phototransistor-output optocoupler**
2. **Logic-output optocoupler**
3. **Gate-driver-output optocoupler**
4. **Analog-oriented optocoupler**
5. **Solid-state relay with a transistor output**
6. **Solid-state relay with a triac or silicon-controlled-rectifier (SCR) output**
7. **AC-input optocoupler**

Isolation also requires the correct working-voltage rating, transient rating, creepage, clearance, insulation class, and safety standard. Current-transfer ratio and analog transfer accuracy change with device, current, temperature, and age. Many solid-state relays use MOSFET outputs. AC-output versions can use triacs or SCRs.

---

## Related Pages

* [Level Shifters](./level-shifters.md)
* [UART](./Serial-Buses/01-UART.md)
* [SPI](./Serial-Buses/02-SPI.md)
* [I²C](./Serial-Buses/03-I2C.md)
* [PCB Layout Overview](../05-PCB-Layout/01-Overview.md)

## Technical References

* [Texas Instruments: Logic Guide](https://www.ti.com/lit/sg/sdyu001ac/sdyu001ac.pdf)
* [Nexperia: Logic Application Handbook](https://www.nexperia.com/dam/jcr%3A851f7c27-b0e9-4627-84b9-13b132388708/Nexperia_LOGIC_Handbook.pdf)
* [Texas Instruments: Understanding and Interpreting Standard-Logic Data Sheets](https://www.ti.com/lit/an/szza036c/szza036c.pdf)
* [Texas Instruments: Implications of Slow or Floating CMOS Inputs](https://www.ti.com/lit/an/scba004e/scba004e.pdf)
* [Texas Instruments: SN74LVC1T45 Data Sheet](https://www.ti.com/lit/ds/symlink/sn74lvc1t45.pdf)
* [Texas Instruments: TXB0101 Data Sheet](https://www.ti.com/lit/ds/symlink/txb0101.pdf)
* [Texas Instruments: SN74LS07 Data Sheet](https://www.ti.com/lit/ds/symlink/sn74ls07.pdf)
* [Texas Instruments: DS90LV012A Data Sheet](https://www.ti.com/lit/ds/symlink/ds90lv012a.pdf)
* [Texas Instruments: Transmission-Line and Termination Guidance](https://www.ti.com/lit/an/sdya018/sdya018.pdf)
* [Analog Devices: Practical Photodiode Design Techniques](https://www.analog.com/media/en/training-seminars/design-handbooks/Practical-Design-Techniques-Sensor-Signal/Section5.PDF)
