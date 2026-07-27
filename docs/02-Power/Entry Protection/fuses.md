---
title: Power Regulation
sidebar_label: Power Regulation
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Chapter 9: Power Regulation and Supply Design

## 1. Linear Regulator Fundamentals

### Zener-Regulator Limitations

A simple **Zener regulator** has important limitations.

* You cannot easily select or adjust its output voltage with high precision.
* Zener voltage changes with Zener current.
* As a result, source-voltage changes and load-current changes can move the output voltage.

### Development of the Series-Pass Regulator

1. **Emitter follower:** Add an NPN emitter follower to increase output current.
   This adds an approximately 0.6 V base-emitter drop.
   The drop changes with current and temperature.
2. **Op-amp control:** Use an operational amplifier (**op-amp**) to set the voltage with feedback gain.
   The op-amp output-current capability still limits load current.
3. **Series-pass regulator:** Put the pass transistor **inside the feedback loop**.
   The transistor supplies high current.
   The op-amp corrects the transistor's variable base-emitter drop.

The original notes request Figure 9.2 at this point.
The available archive figure below shows the same series-pass concept.

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/VoltageRegulatorFigure4.29.png')}
    alt="Series-pass linear voltage regulator with an LT1637 op-amp, a 2N6044 Darlington transistor, frequency compensation, and an adjustable output divider"
    className="invert-on-dark"
    style={{width: '600px', maxWidth: '100%', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    Series-pass linear voltage regulator. Image source: <i>The Art of Electronics</i>, Figure 4.29.
  </figcaption>
</figure>

### Frequency Compensation

Power supplies frequently use large bypass capacitors from a supply node to ground.
These capacitors keep supply impedance low across a wide frequency range.

The regulator then drives a large capacitive load.
The added phase shift can make the feedback loop unstable.

* **Correction:** Add a **Miller feedback capacitor** to the op-amp.
* The capacitor provides frequency compensation and maintains loop stability.
* Always use the compensation method specified for the selected regulator design.

### Overcurrent Protection

Assume that an accidental short circuit connects the output to ground.
The feedback loop then increases pass-transistor drive in an attempt to restore voltage.
This action can destroy the pass transistor.

* A sense resistor, <i>R<sub>cl</sub></i>, measures output current.
* Transistor Q2 monitors the voltage across the resistor.
* Q2 turns on when the resistor voltage is approximately 0.6 V.
* Q2 then removes base drive from the pass transistor.
* This action limits current to approximately <i>0.6 V / R<sub>cl</sub></i>.

---

## 2. The Series-Pass Transistor

A **pass transistor** is the active regulating device.
It is in series between the unregulated input and the load.

### Active-Region Operation

A switching transistor is usually fully on or fully off.
A pass transistor operates in the **linear, or active, region**.

The device controls its collector-emitter voltage.
In this sense, it operates as a controlled series resistance.

> **V<sub>out</sub> = V<sub>in</sub> - V<sub>CE</sub>**

The error amplifier controls the transistor base.

* **Input voltage increases:** Feedback decreases base drive.
  The effective series resistance and <i>V<sub>CE</sub></i> increase.
  The transistor blocks the excess voltage.
* **Load current increases:** Feedback increases base drive.
  The effective series resistance decreases.
  The transistor supplies more current.

### Power Dissipation and Dropout

The pass transistor carries load current while it holds a voltage difference.
It converts this electrical power to heat.

> **P<sub>D</sub> = (V<sub>in</sub> - V<sub>out</sub>) &times; I<sub>load</sub>**

* **Dropout voltage:** This is the minimum input-to-output voltage difference that maintains regulation.
* **Low-dropout regulator (LDO):** This regulator operates with a comparatively small input-to-output voltage difference.

---

## 3. Protection and Circuit Refinements

### Reference-Ripple Filtering

Input ripple can enter a basic Zener reference.
This ripple can then appear at the regulated output.

* Split Zener bias resistor R1 into R1a and R1b.
* Connect capacitor C1 from their midpoint to ground.
* The parts form a **low-pass resistor-capacitor (RC) filter**.

The filter time constant is:

> **&tau; = (R1a || R1b) &times; C1**

Make this time constant much longer than the ripple period.
For example, the period is approximately 8.3 ms at 120 Hz.
The Zener then receives a cleaner direct-current (**DC**) bias.

### Crowbar Overvoltage Protection

A pass-transistor short can connect the full unregulated input to the load.
A **crowbar circuit** protects the load from this failure.
The original notes compare it to an emergency brake.

* **Device:** Use a silicon-controlled rectifier (**SCR**).
* **Normal state:** The SCR is open.
* **Trigger:** A monitoring Zener supplies gate current when <i>V<sub>out</sub></i> exceeds the limit.
* **Action:** The SCR latches on and makes a low-resistance path across the output.
* **Result:** Output voltage decreases quickly toward zero.
* **Consequence:** Fault current increases greatly.

The design must include an upstream fuse or another suitable interrupting device.
The crowbar intentionally causes that device to open.
Verify the fuse interrupt rating and the available fault current.

### Reverse-Voltage Protection

It is common to connect **Schottky protection diodes** in reverse across regulator outputs.
These diodes can conduct when an inductive load or charged output drives the regulator backward.

:::info Dual-Supply Hazard
A positive and a negative regulator can start at different times.
A fuse can also open on only one rail.
The active rail can then pull the inactive regulator to the wrong polarity.
The original example is a &plusmn;15 V op-amp supply.

Connect reverse-biased Schottky diodes across the outputs.
The diodes limit reverse voltage to approximately 0.3 V.
:::

---

## 4. Integrated-Circuit Regulators

Modern regulators have two main arrangements.

1. **Regulator controller, such as the 723:** The device contains a reference and an error amplifier.
   A high-current design uses an external pass transistor.
   This arrangement is flexible but more complex.
2. **Three-terminal regulator, such as the 7805:** The package contains the reference, amplifier, pass device, and protection.
   The original notes call this a "black box" or "plug-and-play" regulator.

### Adjustable Regulators, Such as the LM317

#### Floating Architecture

An LM317-type regulator has an adjustment (**ADJ**) pin instead of a ground pin.
The device maintains an internal reference voltage between OUT and ADJ.
This voltage is usually approximately 1.25 V.

The reference voltage appears across resistor R1.
Almost the same current then flows through R2.

The simplified relationship is:

> **V<sub>out</sub> = V<sub>ref</sub> &times; (1 + R<sub>2</sub> / R<sub>1</sub>)**

The more complete relationship includes adjustment-pin current:

> **V<sub>out</sub> = V<sub>ref</sub> &times; (1 + R<sub>2</sub> / R<sub>1</sub>) + I<sub>adj</sub> &times; R<sub>2</sub>**

#### Design Constraints

* **Minimum load:** Internal circuits need operating current.
  Because there is no ground pin, this current flows through the external load path.
* Use suitable divider values, such as 120 &Omega; to 240 &Omega; for R1.
  A typical minimum-load range is 5 mA to 10 mA.
  Use the selected device datasheet for the exact value.
* **Adjustment current:** Approximately 50 &mu;A to 100 &mu;A can flow from ADJ.
  This current produces the <i>I<sub>adj</sub> &times; R2</i> error term.
* **Capacitors:** An output capacitor improves transient response.
  Some LM317 variants do not require one for stability.
  Follow the applicable datasheet.

### Fixed Three-Terminal Regulators, Such as the 7805

Internal feedback resistors are factory trimmed for a specified output.
A typical accuracy range is &plusmn;3% to &plusmn;5%.

Positive and negative regulators are different parts.
Do not connect one type as if it were the other.

#### Integrated Protection

1. **Thermal shutdown:** A typical device shuts down when die temperature exceeds approximately 150&deg;C.
2. **Current limiting:** The internal circuit limits current during an output short circuit.
3. **Safe-operating-area (SOA) protection:** The circuit monitors input-to-output voltage and load current.
   It decreases maximum current when transistor stress becomes excessive.

#### Distributed Power

Instead of one central regulated supply, a system can distribute unregulated DC.
Each circuit board then uses a local fixed regulator.

This arrangement decreases noise pickup on long conductors.
It can also decrease some ground-loop problems.
It does not remove the need for correct grounding and distribution design.

---

## 5. Transient Response and Stability

### Feedback-Loop Speed

A regulator is a feedback system.
Large output capacitors and stability requirements limit its loop bandwidth.
A typical range in the original notes is 10 kHz to 100 kHz.

A central-processing-unit (**CPU**) load can change in nanoseconds.
The regulator loop cannot respond immediately.

### Output Capacitor as the First Responder

The original notes call the output capacitor the "first responder."

* **For <i>t</i> &lt; 10 &mu;s:** The capacitor supplies the initial current difference.
* **For <i>t</i> &gt; 10 &mu;s:** The regulator loop increasingly supplies the load.

These times are approximate.
They depend on the regulator, capacitor, layout, and load step.

### Capacitor Parasitics

* **Equivalent series resistance (ESR):** ESR causes an immediate voltage change.

  > **V<sub>drop</sub> = I<sub>load</sub> &times; ESR**

* **Equivalent series inductance (ESL):** ESL opposes a rapid current change.
* Ceramic capacitors have low high-frequency impedance.
* Larger electrolytic capacitors supply stored energy.
* Electrolytic ESR can also provide useful damping.

### Physical Layout

Long leads and long traces add **stray inductance**.

In the original experiment, a loose protoboard layout produced a 40 mV transient dip.
A compact surface-mount printed circuit board (**PCB**) produced a 4 mV dip.
The compact layout improved the result by a factor of 10.

### Input Transients and Load Dump

* **Feedthrough:** A fast input spike can reach the output before feedback corrects it.
* **Automotive load dump:** Battery disconnection during charging can produce a line transient above 50 V.
* This transient can exceed a standard regulator's absolute maximum rating.
* Use a transient-voltage suppressor (**TVS**) or an automotive-rated regulator as necessary.

---

## 6. Linear Regulators as Constant-Current Sources

A voltage regulator can operate as a **constant-current source**.
This method can provide a robust current source with one integrated circuit and a small number of resistors.

### Floating-Regulator Principle

Disconnect the regulator ground or adjustment pin from circuit ground.
Connect that pin to the load-side current-setting network.

The regulator maintains <i>V<sub>reg</sub></i> between OUT and GND or ADJ.
Connect resistor R between these pins.

> **I = V<sub>reg</sub> / R**

The current through R also flows through the load, apart from specified bias-current errors.

### Method A: Fixed 7805 Regulator

The original notes call this the "crude" method.
It has two main disadvantages.

1. **High voltage loss:** The sense resistor must drop 5 V.
   This voltage loss wastes power.
2. **Quiescent-current error:** The regulator needs operating current.
   The original example uses approximately 3 mA.
   This ground-pin current joins the load current after the sense resistor.

> **I<sub>load</sub> = 5 V / R + 3 mA**

The actual quiescent current changes with device type and operating conditions.
Use the datasheet value.

### Method B: Adjustable LM317 Regulator

The original notes call this the standard general-purpose method.

1. **Lower voltage loss:** The sense resistor drops approximately 1.25 V instead of 5 V.
2. **Better precision:** Most regulator operating current flows through the sense resistor.
   As a result, it is part of the regulated path.
3. **Remaining error:** Adjustment-pin current is approximately 50 &mu;A.

> **I<sub>load</sub> = 1.25 V / R + 50 &mu;A**

The original operating range is 5 mA to 1.5 A.
The usable range also depends on dropout voltage, package temperature, and the selected LM317 variant.

### Method C: LT3080 and LT3092 Devices

These devices provide a modern low-voltage method.

* They use a precise 10 &mu;A reference current instead of a fixed 1.25 V reference.
* The designer can generate a setting voltage much lower than 1.25 V.
* The original example uses 0.2 V.
* The lower voltage permits operation with less input headroom.
* The LT3092 is a two-terminal programmable current source.
* It can operate on the high side, low side, or in series with a signal path.
* It is stable without input and output capacitors.
* The LT3092 uses two setting resistors, not one resistor.
* Its specified current range is 0.5 mA to 200 mA.

### Current-Source Comparison

<div className="responsive-table">

| Feature | 7805 Fixed Regulator | LM317 Adjustable Regulator | LT3092 Specialized Source |
| :--- | :--- | :--- | :--- |
| **Voltage loss** | High, 5 V | Medium, 1.25 V | Very low; less than 1 V is possible |
| **Accuracy** | Poorer; original example adds approximately 3 mA | High; original example adds approximately 50 &mu;A | High; uses a 10 &mu;A reference and a resistor ratio |
| **Complexity** | Low | Low | Low; no stability capacitors are required |
| **Main use** | Quick, low-precision source | General-purpose source | Low-voltage or precision source |

</div>

---

## 7. Thermal Management

### Thermal-Electrical Analogy

The original notes call this analogy **thermal Ohm's law**.
It applies to steady-state thermal calculations.

* **Heat flow, or power P:** This is analogous to electrical current.
* **Temperature difference:** This is analogous to voltage difference.
* **Thermal resistance, R<sub>&theta;</sub>:** This is analogous to electrical resistance.
* The thermal-resistance unit is &deg;C/W.

### Thermal-Resistance Chain

Heat moves through three thermal resistances in series.

> **R<sub>&theta;total</sub> = R<sub>&theta;JC</sub> + R<sub>&theta;CS</sub> + R<sub>&theta;SA</sub>**

* **R<sub>&theta;JC</sub>, junction-to-case:** This path is inside the device.
  The datasheet specifies it.
* **R<sub>&theta;CS</sub>, case-to-sink:** This is the mounting interface.
  Grease, pads, insulators, and washers affect it.
* **R<sub>&theta;SA</sub>, sink-to-ambient:** This is the heatsink-to-air path.
  Larger fins or forced airflow can decrease it.

### Junction-Temperature Equation

> **T<sub>J</sub> = T<sub>ambient</sub> + P &times; (R<sub>&theta;JC</sub> + R<sub>&theta;CS</sub> + R<sub>&theta;SA</sub>)**

#### Example

Assume that a regulator dissipates 5 W.
The ambient temperature is 50&deg;C.
The maximum necessary junction temperature is 100&deg;C.

1. **Permitted temperature rise:** 100&deg;C - 50&deg;C = **50&deg;C**.
2. **Maximum total resistance:** 50&deg;C / 5 W = **10&deg;C/W**.
3. **Required heatsink:** Subtract <i>R<sub>&theta;JC</sub></i> and <i>R<sub>&theta;CS</sub></i> from 10&deg;C/W.
   The remaining value is the maximum <i>R<sub>&theta;SA</sub></i>.

### Mounting and Cooling

* **Mica and grease:** This older method is messy but performs well.
  The original typical value is approximately 0.5&deg;C/W.
* **Silicone pads:** These clean, grease-free pads are easier to use.
  The original range is 1&deg;C/W to 4&deg;C/W.
* **Heatsink orientation:** Put fins vertically for natural convection.
  Obstructed airflow decreases cooling.
* **PCB heatsinking:** Copper area removes heat from surface-mount devices such as DPAK packages.
* **Internal limit:** At high power, <i>R<sub>&theta;JC</sub></i> can become the limiting path.
  A larger heatsink cannot remove that internal resistance.
* Multiple transistors can share power when the circuit includes correct current sharing and thermal design.

### Temperature Measurement

The original notes mention a wet-finger "sizzle test" for temperatures above 100&deg;C.
**Do not use this test.**
It can cause a burn or an electric shock.

Use a thermocouple probe or an infrared temperature instrument.
Observe the instrument's voltage, emissivity, and isolation limits.

---

## 8. Alternating-Current Line to Unregulated DC

The original notes request an AC-entry and rectifier figure here.
The supplied archives do not contain a matching figure.

The first power-supply stage converts high-voltage alternating current (**AC**) to unregulated DC.
This stage includes safety, filtering, transformation, rectification, and energy storage.

:::danger Mains-Voltage Safety
Mains circuits can cause fatal electric shock, fire, and arc hazards.
Use applicable safety standards, rated components, protective equipment, and qualified procedures.
An isolation transformer does not make primary-side nodes safe to touch.
:::

### Power Entry and Safety

* **Protective earth:** Connect an accessible conductive enclosure to protective earth when the equipment class requires it.
* Use a three-wire, three-prong connection for equipment that needs protective earth.
* A correctly designed double-insulated product can use a two-wire connection.
* **Power-entry module:** This module can combine the fuse holder, switch, and low-pass filter.
* Its construction must prevent contact with live conductors during fuse replacement.
* **Fuse:** A mains-powered supply requires correctly rated overcurrent protection.
* A time-delay, or slow-blow, fuse can tolerate capacitor inrush current.
* **Galvanic isolation:** An isolation transformer separates the secondary circuit from mains conductors.
* Protective earth and isolated circuit ground are different nodes unless the design intentionally connects them.

### Electromagnetic-Interference Filtering

A low-pass filter, frequently a pi filter, has two functions.
It limits radio-frequency interference entering the equipment.
It also limits noise that the equipment sends to the power line.

* **Safety-rated capacitors:** Use capacitors approved for direct connection to the mains.
* **X-class capacitor, such as X1 or X2:** Connect it from line to neutral.
  Its failure is not a direct line-to-chassis shock path.
  Fire and component-failure risks still require the correct class and rating.
* **Y-class capacitor, such as Y1 or Y2:** Connect it from line to protective earth or across an isolation barrier.
  Its failure can create a shock path.
  As a result, it has stringent safety requirements.
* **Transient suppressor:** A metal-oxide varistor (**MOV**) or bidirectional Zener or TVS diode can shunt a high surge current.
  Some correctly selected devices can conduct hundreds of amperes during a short surge.
  Select it from the expected surge waveform and energy.

### Rectification and DC Components

* **Rectifier:** Converts AC to pulsating DC.
* **Storage capacitor:** Smooths the pulsating voltage and supplies energy between peaks.
* A larger capacitor decreases ripple.
* An excessively large capacitor decreases rectifier conduction angle.
  This increases transformer heating and rectifier stress.
* **Bleeder resistor:** Provides a minimum load and discharges the capacitor after switch-off.
* **Snubber:** A series RC network across the transformer secondary can limit ringing and voltage spikes.

### Transformer Voltage Selection

Balance regulator power loss against dropout margin.

* Keep unregulated DC as low as practical to decrease heat.
* The lowest ripple-trough voltage must stay above the regulator dropout requirement.
* The original design estimate is <i>V<sub>out</sub> + 2 V</i>.
* Check the worst case at low line voltage, full load, and maximum ripple.

The first estimate is:

> **V<sub>peak</sub> &asymp; 1.41 &times; V<sub>rms</sub> - 1.4 V**

Transformer winding resistance and leakage cause additional voltage sag.
Confirm the design with safe bench measurements and specified tolerances.

### Transformer Current Rating

Do not set transformer root-mean-square (**RMS**) current equal to DC load current.

* A capacitor-input rectifier draws short, high-current pulses near each AC peak.
* These pulses produce more <i>I<sup>2</sup>R</i> heating than steady DC current.
* The original rule is an RMS rating 1.8 to 2 times the required DC output current.
* For a 2 A DC output, the original example selects a 4 A RMS transformer.

This ratio is an estimate.
Verify it for the transformer, rectifier, capacitor, line frequency, and thermal limits.

---

## 9. Switching-Regulator Fundamentals

The original notes request a linear-versus-switching figure here.
The supplied archives do not contain a matching figure.

A linear regulator carries full load current while it drops excess voltage.

> **P = I &times; V<sub>drop</sub>**

A switching regulator connects and disconnects the input at high frequency.
An inductor stores energy in its magnetic field and transfers energy to the output.

### Advantages

* **High efficiency:** The switch is usually either fully enhanced or off.
  Conduction and switching losses remain, but they are much lower than linear loss in many applications.
* **Voltage conversion:** A buck converter decreases voltage.
  A boost converter increases voltage.
  A buck-boost converter can invert or increase and decrease voltage.
* **Size:** High-frequency magnetic components can make the supply compact.

### Disadvantages

* **Noise:** Switching produces output ripple.
* Pulsed current can also conduct or radiate electromagnetic interference (**EMI**).

### Charge-Pump Converters

A **charge pump** uses switched capacitors instead of an inductor.

* **Advantages:** It can be small and can produce less magnetic-field radiation than an inductor converter.
* It is useful for low-current outputs, such as a negative op-amp rail.
* **Disadvantages:** An unregulated charge-pump output decreases under load.
* Regulated charge-pump devices are also available.
* A charge pump still switches and can produce conducted noise.

### Switching-Noise Paths

The original notes identify four noise paths.

1. **Output ripple:** A typical original range is 10 mV to 100 mV peak-to-peak at the switching frequency.
2. **Common-mode ripple:** Switching current appears on ground or common conductors.
3. **Input ripple:** Pulsed current appears on the input supply rail.
4. **Radiated EMI:** High-frequency current loops and the inductor radiate fields.

### Noise Reduction

* Add an LDO after the switcher when its headroom and frequency-dependent rejection are sufficient.
* Add a suitable inductor-capacitor (**LC**) output filter.
* Use **zero-voltage switching (ZVS)** or **zero-current switching (ZCS)** when the topology permits it.
* ZVS changes switch state near zero voltage.
* ZCS changes switch state near zero current.

### Conduction Modes

* **Continuous conduction mode (CCM):** Inductor current does not reach zero in each cycle.
  It is common at high power and can be easier to filter.
* **Discontinuous conduction mode (DCM):** Inductor current reaches zero during each cycle.

### Voltage-Mode and Current-Mode Control

The controller compares <i>V<sub>out</sub></i> with <i>V<sub>ref</sub></i>.
The difference produces an error signal.
The controller architecture determines how this signal changes switching.

#### Voltage-Mode Control

The original notes call this the timer method.

* The controller compares the error signal with a fixed sawtooth ramp.
* The voltage loop does not directly measure the inductor-current ramp.
* Separate current-limit circuits can still protect against overload.
* The LC output filter produces a second-order, or double-pole, response.
* Its phase shift can approach 180&deg;.
* Many designs need Type III compensation, but requirements depend on the converter.

#### Current-Mode Control

The original notes call this the threshold method.

* The controller measures the rising inductor current.
* It turns the switch off when current reaches the error-signal threshold.
* **Input feedforward effect:** Higher <i>V<sub>in</sub></i> makes current rise faster.
  The threshold is then reached sooner.
  This action limits movement at <i>V<sub>out</sub></i>.
* The inner current loop makes the inductor act approximately as a controlled current source.
* The outer voltage loop then has a mainly first-order capacitor response.
* This response is easier to compensate than the LC double pole.
* **Slope compensation:** Peak current-mode control usually needs it above 50% duty cycle.
  It prevents subharmonic oscillation.

### Isolated Switching Topologies

A transformer can provide galvanic isolation and multiple outputs.

* **Flyback:** A simple low-to-medium-power topology.
  The original approximate upper range is 200 W.
  Input and output currents are strongly pulsed.
* **Forward converter:** Used at higher power.
* **Half-bridge and full-bridge converters:** Used for high-power applications.

---

## 10. Offline Switching Architectures

### Offline Conversion Sequence

An offline supply rectifies the mains before high-frequency conversion.
It does not use a large 60 Hz input transformer.

> **120 V AC &rarr; rectifier &rarr; approximately 160 V DC &rarr; high-frequency converter &rarr; low-voltage DC**

The exact unloaded peak from 120 V RMS is closer to 170 V before diode losses.
The original 160 V value represents an approximate operating rail.

The rectified primary rail is **not isolated** from the mains.
Contact with primary-side conductors can be fatal.

Use an isolated converter topology, such as a flyback, when the output must be safety isolated.
An optocoupler can transfer the feedback signal across the isolation barrier.

### Dual-Voltage and Universal Inputs

The original notes describe this arrangement as a 110/220 V input selector.

* **Universal input:** Many low-power supplies use a switch rated for approximately 85 V to 265 V AC.
* **Voltage-doubler input:** A higher-power design can use a selector to reconfigure the bridge.
* **Selector open at 230 V:** The circuit operates as a full-wave bridge.
  Its output is approximately 320 V DC.
* **Selector closed at 115 V:** The circuit operates as a voltage doubler.
  Alternate cycles charge the two capacitors.
  Its output is also approximately 320 V DC.

Incorrect selector position can destroy the supply.
Use a universal-input design when practical.

### Inrush Current

At initial connection, an empty bulk capacitor has very low effective impedance.
It can draw a large inrush current.

* **Negative-temperature-coefficient (NTC) thermistor:** It has higher resistance when cold.
  Its resistance decreases as it heats.
* **Soft-start resistor and relay:** The resistor initially limits current.
  A relay bypasses it after approximately one second.

### Power-Factor Correction

A bridge rectifier with a bulk capacitor draws current near the AC-voltage peaks.
This produces harmonic current and poor power factor.

* **Active power-factor correction (PFC):** Put a boost converter between the rectifier and bulk capacitor.
* The controller makes input current follow the input-voltage sine-wave shape.
* The supply then behaves more like a resistive load.
* The original notes use more than 100 W as a rule for mandatory PFC.
* Actual requirements depend on equipment class, market, and the applicable harmonic-current standard.

---

## 11. Offline-Supply Design Challenges

### High Voltage and Component Stress

The rectified DC rail is approximately 160 V to 300 V in the original examples.

* **MOSFET voltage rating:** Inductive overshoot and reset behavior can require a 600 V or 800 V MOSFET on a 300 V rail.
* **Leakage-inductance spikes:** These spikes can exceed the ideal maximum voltage.
* Use a correctly designed clamp or snubber.

### Capacitive Switching Loss

High-voltage MOSFETs use thicker silicon.
They can have higher <i>R<sub>DS(on)</sub></i>.
Their output capacitance also causes switching loss.

The energy stored in output capacitance is:

> **E = 0.5 &times; C &times; V<sup>2</sup>**

One discharge of this energy in each cycle gives:

> **P = 0.5 &times; C &times; V<sup>2</sup> &times; f**

For 100 pF, 300 V, and 150 kHz, this term is approximately 0.675 W.
The original notes give 1.35 W.
That larger value represents comparable loss during both charging and discharging.

* **Correction:** ZVS uses circuit inductance to move switch voltage near 0 V before turn-on.

### Feedback Across the Isolation Barrier

An isolated output cannot use a direct conductive feedback wire.

* **Optocoupler method:** A secondary-side light-emitting diode (**LED**) sends light to a primary-side phototransistor.
* **Primary-side regulation:** The controller regulates an auxiliary transformer winding.
  It assumes that the main output follows this winding.
* Primary-side regulation is less expensive but usually less accurate.

### Isolation-Barrier Safety

Underwriters Laboratories (**UL**), International Electrotechnical Commission (**IEC**), and other standards specify insulation requirements.

* **Clearance:** This is the shortest distance through air.
  The original notes use more than 2 mm as a simple example.
* **Creepage:** This is the shortest distance along an insulating surface.
  Dust and moisture can create a tracking path.
* Slots in the PCB can increase creepage.
* Removing unused optocoupler pins can also increase the path.

There is no universal 2 mm rule.
Required distances depend on voltage, insulation type, pollution degree, material group, altitude, and the applicable standard.

---

## 12. Example: 15 W Flyback Supply

The original notes request a flyback schematic here.
The supplied archives do not contain a matching figure.

### Architecture

The example converts 100 V to 240 V AC to an isolated 5 V DC output.
The primary and secondary grounds are galvanically isolated.

### Circuit Walkthrough

* **Input stage:** AC enters through a fuse and EMI filter L1 and X1.
* Bridge rectifier D1 charges a 47 &mu;F high-voltage capacitor.
* **Switch U1:** TOP201 combines a pulse-width-modulation (**PWM**) controller with a high-voltage MOSFET.
* It switches at 100 kHz.
* **Transformer T1:** In a flyback, this magnetic component operates as a coupled inductor.
* **Leakage energy:** Primary leakage inductance produces a voltage spike when the switch turns off.
* **Snubber:** TVS D2 and diode D3 clamp the spike and protect the MOSFET.
* **Secondary side:** Schottky diode D5 rectifies the output.
* Inductor L2 smooths the 100 kHz ripple.
* **Feedback:** TL431 U2 monitors the 5 V output.
* At the regulation point, U2 drives the LED in optocoupler U3.
* U3 tells primary controller U1 to decrease transferred power.

### Practical Lessons

* **DCM:** Transformer current reaches 0 A before the next cycle.
  The resulting dead interval can contain ringing.
* **Hard switching:** The MOSFET dissipates energy associated with <i>C<sub>OSS</sub></i> at approximately 320 V.
* **Measurement safety:** Do not connect a standard earth-referenced oscilloscope ground clip to a live primary node.
* Use a correctly rated differential probe, isolated-input instrument, or approved isolation measurement system.
* Do not defeat an oscilloscope protective-earth connection.

:::tip Selecting a Regulator Type
* **Digital systems, such as +3.3 V or +5 V at high current:** Use a line-powered switcher when its noise is acceptable.
* **Small-signal analog circuits:** A linear regulator or post-regulator can give lower noise.
* A correctly designed switcher can also supply analog circuits.
* **High power:** A line-powered switcher is usually smaller, lighter, and cooler.
* **Offline design:** This work is dangerous and difficult.
  Buy a certified supply when a custom offline design is not necessary.
:::

---

## 13. Inverters and Voltage References

### Inverters

An **inverter** converts DC to AC.

Applications include:

* Multiphase motor drives.
* Class D audio amplifiers.
* Uninterruptible power supplies (**UPSs**).

### Voltage References

A power regulator such as the 7805 is not a precision reference.
The original notes give a 1% to 3% change with temperature and operating conditions.

A high-precision instrument, such as a six-digit multimeter, needs a dedicated **voltage reference**.

* **Reference, or "brain":** A low-power device supplies a very stable voltage.
  The original example is 2 ppm/&deg;C.
* **Pass stage, or "muscle":** An external circuit uses the reference voltage to supply load power.

#### Reference Types

1. **Zener reference:** This is the simplest type.
   It can have high noise and poor initial tolerance.
   A Zener near 6 V can have a small first-order temperature coefficient.
   A buried-Zener reference is a separate precision IC structure.
2. **Bandgap reference:** It combines transistor voltage terms to cancel much of their first-order temperature change.
   The approximately 0.6 V base-emitter voltage is one part of this method.
   Residual temperature error remains.
3. **JFET pinch-off reference:** It uses a junction field-effect transistor pinch-off characteristic.
4. **Two-terminal shunt reference:** It operates like a precise Zener.
   Applied current makes it clamp to a specified voltage.
5. **Three-terminal series reference:** It operates like a small linear regulator and controls its own bias.

---

## 14. Battery-Management Systems

A **battery-management system (BMS)** controls stored electrical energy.
It protects battery safety and service life.
A power supply provides energy.
A BMS manages the storage of that energy.

### Lithium-Ion Constant-Current and Constant-Voltage Charging

Lead-acid and nickel-cadmium batteries can use some controlled maintenance-charge methods.
Lithium-ion and lithium-polymer cells must not use uncontrolled trickle charging.
Overcharge can cause metallic-lithium plating, internal short circuits, and thermal runaway or fire.

The original notes describe the **constant-current/constant-voltage (CC/CV)** algorithm.
A complete charger can also include precharge, temperature checks, and fault checks.

#### Phase 1: Constant Current

* **State:** The original empty-cell example is 3.0 V.
* **Action:** The charger operates as a current source.
* The original examples are 1 A and 0.5 C.
* **Result:** Cell voltage increases.
* **Purpose:** Transfer most of the energy to the cell.

#### Phase 2: Constant Voltage

* **State:** The cell reaches its specified maximum voltage.
* The original typical value is 4.20 V per cell.
* **Action:** The charger clamps voltage at 4.20 V.
* **Result:** Charge current decreases as the cell approaches full charge.
* The original notes describe this decrease as exponential and relate it to changing internal resistance.
* The electrochemical cell behavior and the voltage-control loop cause this taper.
* **Purpose:** Complete the charge without excessive cell voltage.

#### Phase 3: Termination

* The charger monitors decreasing current.
* The original termination threshold is C/10.
* For a 1000 mAh cell, the example threshold is 100 mA.
* The charger stops continuous charging at the termination threshold.
* It can then monitor the cell and restart according to its specified algorithm.
* Do not continuously trickle-charge a lithium-ion cell.

### Cell Balancing

Series-connected cells are not perfectly identical.
For example, a 4S pack has a nominal voltage of 14.8 V.
One cell can age faster and lose capacity.

#### Imbalance During Charge

* The lower-capacity cell can reach 4.2 V while the other cells remain at 4.0 V.
* Continued pack charging can push that cell toward the original 4.4 V danger example.
* Alternatively, the charger can stop early and leave the other cells undercharged.

#### Imbalance During Discharge

* The weak cell can reach 3.0 V before the other cells.
* Continued discharge can reverse its voltage and destroy it.

#### Passive Balancing

* A resistor and MOSFET connect in parallel with each cell.
* When one cell reaches 4.2 V first, the BMS turns on that cell's MOSFET.
* The resistor converts excess energy to heat.
* This action holds the cell voltage while other cells continue charging.
* This method is inexpensive and simple.
* It is slow and wastes energy.

#### Active Balancing

* Capacitors or inductors transfer energy between cells.
* The circuit takes energy from the highest-voltage cell.
* It transfers that energy to the lowest-voltage cell.
* This method is efficient but complex and expensive.
* Electric vehicles and high-end energy-storage systems use it.

---

## 15. Switching-Power PCB Layout

The schematic is only one part of a switching-supply design.
Physical layout strongly affects function and EMI.
Poor layout can make the supply operate like an unwanted radio transmitter and fail EMI tests.

### Identify the Hot Loop

The **hot loop** carries discontinuous current.
Its current changes rapidly from zero to a high value.
This high <i>di/dt</i> produces strong magnetic fields.

Any current loop can operate as an antenna.
The original notes use this qualitative relationship:

> **Radiated tendency &propto; loop area &times; frequency<sup>2</sup> &times; current**

This is not a complete radiation equation.
It shows that loop area, frequency, and current are important.
Decrease hot-loop area to decrease EMI.

#### Buck-Converter Hot Loop

> **Input capacitor &rarr; high-side MOSFET &rarr; low-side diode or MOSFET &rarr; ground &rarr; input capacitor**

The high-side switch chops input current.
Current flows when the switch is on and stops when it is off.
Inductor output current is continuous, so that path is not the main hot loop.

#### Boost-Converter Hot Loop

> **Output capacitor &rarr; diode &rarr; low-side switch &rarr; ground &rarr; output capacitor**

Boost input current flows continuously through the inductor.
The diode makes output current discontinuous.

### Layout Rules

1. **Component placement:** Put the buck input capacitor or boost output capacitor very close to the switch and diode pins.
2. **Conductors:** Use wide copper polygons or pours.
   Do not use thin traces in the hot loop.
3. **Ground plane:** Put a solid ground plane on the layer below the loop when the design permits it.
   This plane decreases loop inductance and provides shielding.
4. **Vias:** Avoid vias in the hot loop.
   Vias add inductance.
   If vias are necessary, use multiple vias in parallel.

:::info Ground Bounce
Hot-loop inductance produces voltage when current changes:

**V = L &times; di/dt**

These voltage spikes can move the local ground potential.
This **ground bounce** can reset the controller or cause timing jitter.
:::

---

## 16. Digital Power Control

Traditional supplies use analog op-amps and comparators.
Many server and automotive systems also use digital power functions.

### Digital Management and Digital Control

These terms describe different functions.

#### Digital Management

The fast regulation loop remains analog.
Digital circuits perform communication, reporting, and configuration.
The original notes call these functions "housekeeping."

* **Communication:** The regulator uses an inter-integrated circuit (**I2C**) or PMBus interface.
* **Reporting:** It sends input voltage, output voltage, output current, and die temperature to a microcontroller.
* **Configuration:** Software can change settings without resistor replacement.
* Example command: "Set output to 1.2 V for sleep mode."
* Example command: "Set output to 3.3 V for active mode."
* Example command: "Decrease the overcurrent limit."

#### Digital Control

A fully digital loop removes the analog error amplifier.

> **Analog-to-digital converter (ADC) &rarr; proportional-integral-derivative (PID) processor &rarr; digital PWM generator**

* The ADC samples output voltage millions of times each second.
* A digital signal processor (**DSP**) calculates the necessary pulse width.
* **Nonlinear control:** Software can implement complex responses.
* The original example ignores the first 2 &mu;s of a 100% load step.
  It then increases gain by a factor of 10.
* **Component aging:** Software can calibrate for capacitor changes over 10 years.

### PMBus

The **Power Management Bus (PMBus)** is an industry-standard I2C-based protocol for power supplies.

Common commands include:

* `VOUT_COMMAND`: Set the target output voltage.
* `READ_VOUT`: Read the output voltage.
* `READ_TEMPERATURE_1`: Read device temperature.
* `STATUS_BYTE`: Read overvoltage, overtemperature, and other fault states.

### Server Example

A motherboard microcontroller unit (**MCU**) reads PMBus data in a high-end CPU server.
If processor temperature increases, the controller can increase fan speed.
It can also command a small decrease in core voltage.
These software actions decrease heat generation.
