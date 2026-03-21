---
title: Power Regulation
sidebar_label: Power Regulation
---

# Chapter 9: Power Regulation

## 1. Linear Regulator Fundamentals

**The Zener Limitation:**
Using a simple Zener diode as a voltage regulator has significant drawbacks. You cannot easily change or precisely pick the output voltage. Furthermore, the Zener voltage varies with Zener current, meaning the output drifts with variations in load current or source voltage.

**The Evolution of the Solution:**
1.  **Emitter Follower:** We can attach an NPN emitter follower to the Zener to boost current, but this introduces a variable 0.6V output voltage drop, and the output becomes temperature-dependent.
2.  **Op-Amp Control:** Using an op-amp allows us to tune the voltage via gain, but the output current is limited by the op-amp's drive capability.
3.  **The Series Pass Regulator:** We cannot simply add a transistor to the op-amp output (due to the voltage drop). Instead, we place the transistor **inside the feedback loop**. The op-amp compensates for the 0.6V V<sub>BE</sub> drop while the transistor handles the high current.

insert Figure 9.2: Series Pass Linear Voltage Regulator

**Frequency Compensation:**
Power supplies typically use large bypass capacitors from source to ground to ensure low impedance at all frequencies. However, this presents a large capacitive load to the regulation circuit, causing phase shift.
* **The Fix:** A **Miller feedback capacitor** is added to the op-amp for frequency compensation to maintain stability.

**Over-Current Protection:**
If the output is accidentally grounded, the feedback loop will drive the pass transistor harder to maintain voltage, potentially destroying it.
* **The Fix:** A current-limiting circuit (typically a sense resistor R<sub>cl</sub> and a transistor Q2) monitors the current. If the drop across R<sub>cl</sub> exceeds ~0.6V, Q2 turns on and steals base drive from the pass transistor, capping the current.

---

## 2. Circuit Refinements & Protection

### Ripple Filtering (Cleaning the Reference)
A basic Zener voltage reference is vulnerable to ripple from the input supply line (V<sub>in</sub>), which leaks into the regulated output.
* **The Fix:** Split the Zener bias resistor (R1) into two parts (R1a, R1b) and add a capacitor (C1) to ground at the midpoint.
* **Mechanism:** This forms a **Low-Pass RC Filter**. By setting the time constant &tau; = (R1a || R1b)C1 to be much longer than the ripple period (e.g., 8.3ms at 120Hz), the Zener sees a clean DC current, even if the input rail is noisy.

### The "Crowbar" Circuit (Catastrophic Protection)
This acts as an emergency brake for the power supply. If the Pass Transistor shorts out, the full unregulated input voltage would hit your load, destroying expensive electronics.
* **The Component:** Uses an **SCR** (Silicon-Controlled Rectifier). This is a "latching switch" that is normally open but snaps permanently closed when triggered.
* **The Trigger:** A monitoring Zener diode connects to the SCR gate. If V<sub>out</sub> exceeds the safety limit, current flows into the gate.
* **The Action:** The SCR fires, effectively shorting the output to Ground. This forces the voltage to zero immediately.
* **The Consequence:** This creates a massive short circuit current. You **must** include a fuse in the design; the Crowbar intentionally blows the fuse to save the load.

### Reverse Protection
It is standard practice to include **Schottky diodes** in reverse orientation across the regulator output to protect against reverse polarity events (e.g., if the load is inductive or holds a charge when the supply is turned off).

---

## 3. The Pass Transistor
A Pass Transistor is the active regulating component placed in series between the unregulated input and the load.

**Mode of Operation (Active Region):**
Unlike digital circuits where transistors switch fully On or Off, a pass transistor operates in the **Linear (Active) Region**. It acts as a variable resistor, maintaining a specific voltage drop (V<sub>CE</sub>) to regulate the output.

**The Control Mechanism:**
The transistor's base is driven by the Error Amplifier.
> **V<sub>out</sub> = V<sub>in</sub> - V<sub>CE</sub>**

* **Input Rises:** The feedback loop reduces base drive, increasing the transistor's effective resistance (increasing V<sub>CE</sub>) to block excess voltage.
* **Load Increases:** The feedback loop increases base drive, decreasing effective resistance to allow more current.

**Power Dissipation:**
Because the transistor conducts load current while holding a voltage difference, it dissipates power purely as heat:
> **P<sub>D</sub> = (V<sub>in</sub> - V<sub>out</sub>) &times; I<sub>load</sub>**

* **Dropout Voltage:** The minimum amount by which the input voltage must exceed the regulated output voltage for the device to function.
* **LDO (Low Dropout):** Regulators capable of operating with a very small difference between input and output voltage.

---

## 4. Integrated Circuit (IC) Regulators

Modern regulators are categorized into two families:
1.  **Regulator Controllers (e.g., 723):** Contain the reference and error amp but require an external pass transistor. Flexible but complex.
2.  **3-Terminal Regulators (e.g., 7805):** "Black Boxes" containing the reference, amplifier, pass transistor, and protection. Simple "plug-and-play" operation.

### Adjustable Regulators (e.g., LM317)
**The Floating Architecture:**
These regulators have no Ground pin; they use an Adjustment (ADJ) pin. The chip maintains a fixed **Internal Reference Voltage (V<sub>ref</sub>)** (usually &approx; 1.25V) between the Output Pin and the Adjustment Pin.

**The Formula:**
Since V<sub>ref</sub> is forced across the top resistor (R1), a constant current flows through it and the bottom resistor (R2).
> **V<sub>out</sub> = V<sub>ref</sub> (1 + R<sub>2</sub> / R<sub>1</sub>)**

**Critical Design Constraints:**
* **Minimum Load Requirement:** The internal circuitry needs bias current to remain active. Since there is no ground pin, this current must flow through the load. You must choose resistor divider values low enough (e.g., 120&Omega; – 240&Omega;) to draw this minimum current (typically 5mA – 10mA).
* **Adjustment Pin Current:** A tiny current flows out of the ADJ pin (50&mu;A – 100&mu;A). This creates a small error term (I<sub>adj</sub> &times; R2).
* **Capacitors:** Generally require an Output Capacitor to improve transient response.

### Fixed 3-Terminal Regulators (e.g., 7805)
**The "Factory Trimmed" Architecture:**
Feedback resistors are etched internally and laser-trimmed to specific voltages (accuracy &plusmn;3% to &plusmn;5%). Note that you must buy specific Positive or Negative versions; you cannot wire them backwards.

**Integrated "Survival" Features:**
1.  **Thermal Shutdown:** Turns off if die temperature >150°C.
2.  **Current Limiting:** Chokes internal transistor if output is shorted.
3.  **SOA Protection:** Monitors (V<sub>in</sub> - V<sub>out</sub>) and reduces max current if the voltage differential is too high to prevent transistor stress.

**The "Local Regulation" Philosophy:**
Instead of one massive central supply, systems often use **Distributed Power**. Raw unregulated DC is run around the chassis, and cheap fixed regulators are placed locally on every circuit board. This eliminates noise pickup on long cables and prevents ground loops.

:::info The "Dual Supply" Hazard
If using a Positive and Negative regulator together (e.g., &plusmn;15V for Op-Amps):
If one rail starts slower or a fuse blows, the load can pull the dead regulator to the wrong polarity. **Fix:** Place Protection Diodes (Schottky) in reverse across the outputs to clamp any reverse voltage to ~0.3V.
:::

---

## 5. Transient Response & Stability

**The "Speed Limit" (Bandwidth vs. Stability):**
A regulator is a feedback loop. To ensure stability with large capacitors, engineers limit the loop bandwidth (typically 10kHz to 100kHz).
* **The Consequence:** If a load (like a CPU) changes demand in nanoseconds, the regulator is too slow to react.

**The Capacitor as "First Responder":**
Since the regulator is slow, the Output Capacitor handles the immediate load change.
* **t < 10&mu;s:** The Capacitor discharges to fill the gap.
* **t > 10&mu;s:** The Regulator loop wakes up and takes over.

**Parasitics (ESR and ESL):**
The quality of the capacitor matters.
* **ESR (Equivalent Series Resistance):** Causes an immediate voltage drop (V<sub>drop</sub> = I<sub>load</sub> &times; ESR).
* **ESL (Equivalent Series Inductance):** Resists the rate of change of current.
* *Note:* Ceramic capacitors provide low impedance at high frequencies, while larger electrolytics provide energy storage and damping (via their ESR).

**Physical Layout Importance:**
Long component legs and traces add **Stray Inductance**. In an experiment, a sloppy protoboard had a 40mV transient dip, while a tight Surface Mount PCB had only a 4mV dip (10x improvement).

**Input Transients & "Load Dump":**
* **Feedthrough:** Fast input spikes can sneak through to the output before the loop corrects them.
* **Load Dump (Automotive):** If a car battery disconnects while charging, the line can spike to 50V+. This can exceed the absolute maximum ratings of standard regulators, requiring TVS protection or automotive-rated chips.

---

## 6. Constant Current Sources
This section explains how to re-purpose a standard voltage regulator into a **Constant Current Source**. This is a popular technique because it creates a high-power, robust current source using a single cheap IC and one resistor.

**The Concept (Floating the Regulator):**
Normally, a regulator is connected to Ground. To make it a current source, you disconnect the Ground/Adjust pin from the actual ground and instead connect it to the load.
* **Mechanism:** The regulator tries to maintain a fixed voltage (V<sub>reg</sub>) between its Output pin and its Ground/Adjust pin.
* **Result:** By placing a resistor (R) between these two pins, the regulator forces a constant current to flow through that resistor: `I = Vreg / R`. Since this current has nowhere else to go, it flows into your load.

### Method A: The Fixed Regulator (7805) - "The Crude Way"
You can use a standard 5V regulator (like a 7805), but it has two major flaws:
1.  **High "Tax":** You lose 5V across the sensing resistor just to set the current. This is inefficient power waste.
2.  **The Error Term (I<sub>Q</sub>):** The chip needs power to run (Quiescent Current, &approx;3mA). In a 7805, this current flows out of the Ground pin and joins the output after the sensing resistor.
    * **Formula:** `Iload = 5V/R + 3mA (Error)`
    * *Result:* The load receives the calculated current plus the messy, fluctuating 3mA quiescent current.

### Method B: The Adjustable Regulator (LM317) - "The Standard Way"
This is the preferred method for general electronics.
1.  **Lower "Tax":** The LM317 reference is only 1.25V, so you waste much less power across the resistor than the 7805.
2.  **Precision:** The LM317's internal electronics are powered by current that flows out of the Output pin. This means the operating current flows through the sense resistor (R) and is part of the regulation loop. It does not appear as an extra error.
3.  **The Only Error:** The tiny current flowing out of the ADJ pin (&approx; 50&mu;A).
    * **Formula:** `Iload = 1.25V/R + 50μA`
    * *Range:* Works well for currents from 5mA to 1.5A.

### Method C: The Modern Current Source (LT3080/LT3092)
These are newer chips designed specifically for this task.
* **Mechanism:** Instead of a 1.25V reference, they use a precise 10&mu;A Current Reference.
* **Benefit 1 (Low Drop):** You can use a very small resistor to set a voltage drop much lower than 1.25V (e.g., 0.2V), allowing the circuit to work with lower input voltages.
* **Benefit 2 (2-Terminal):** The LT3092 is a specialized version that acts as a true 2-terminal component. You can place it anywhere in a circuit (High-side or Low-side), and it requires no external capacitors to be stable.

**Summary Comparison:**

| Feature | 7805 (Fixed) | LM317 (Adjustable) | LT3092 (Specialized) |
| :--- | :--- | :--- | :--- |
| **Voltage Drop (Loss)** | High (5V) | Medium (1.25V) | Very Low (< 1V possible) |
| **Accuracy** | Poor (Error &approx; 3mA) | High (Error &approx; 50&mu;A) | High (Error &approx; 10&mu;A) |
| **Complexity** | Low | Low | Low (No capacitors needed) |
| **Main Use Case** | Quick & Dirty | General Purpose | Low Voltage / Precision |

---

## 7. Thermal Management

### 1. The Core Concept: "Thermal Ohm's Law"
Thermal design is treated exactly like a simple DC electrical circuit.
* **Heat (Power, P):** Acts like **Current (I)**. It flows from the hot chip to the cool air.
* **Temperature (T):** Acts like **Voltage (V)**. You calculate the temperature "drop" across barriers.
* **Thermal Resistance (R<sub>&theta;</sub>):** Acts like **Electrical Resistance (R)**. It measures how hard it is for heat to move through a material (Units: &deg;C/W).

### 2. The Thermal Chain
Heat must travel through three specific "resistors" in series to escape the chip. To find the total resistance, you simply add them up:
> **R<sub>&theta;Total</sub> = R<sub>&theta;JC</sub> + R<sub>&theta;CS</sub> + R<sub>&theta;SA</sub>**

* **R<sub>&theta;JC</sub> (Junction-to-Case):** Internal to the chip. You cannot change this; it is in the datasheet.
* **R<sub>&theta;CS</sub> (Case-to-Sink):** The interface between the chip and the heatsink. This depends on your mounting method (thermal grease, silicone pads, washers).
* **R<sub>&theta;SA</sub> (Sink-to-Ambient):** The heatsink itself. A big fan or large fins reduces this number.

### 3. The Master Equation
To find the actual temperature of the silicon chip (T<sub>J</sub>), use this formula:
> **T<sub>J</sub> = T<sub>Ambient</sub> + P &times; (R<sub>&theta;JC</sub> + R<sub>&theta;CS</sub> + R<sub>&theta;SA</sub>)**

**Practical Calculation Example:**
If your regulator burns 5 Watts and you need to keep the chip under 100&deg;C in a 50&deg;C room:
1.  **Allowed Rise:** 100&deg;C - 50&deg;C = **50&deg;C**.
2.  **Total Resistance Needed:** 50&deg;C / 5W = **10&deg;C/W**.
3.  **Result:** Subtract the fixed resistances (R<sub>&theta;JC</sub> and R<sub>&theta;CS</sub>) from 10&deg;C/W to see what specification of heatsink (R<sub>&theta;SA</sub>) you need to buy.

### 4. Hardware Realities & Tips
* **Mounting Interfaces:**
    * *Mica + Grease:* Old school, messy, but good performance (&approx; 0.5&deg;C/W).
    * *Sil-Pads:* "Greaseless" silicone pads. Clean and easy, but slightly higher resistance (1-4&deg;C/W).
* **Heatsink Orientation:** Fins must be vertical to allow natural convection (hot air rising). Obstructing airflow ruins the rating.
* **PCB Heatsinking:** For Surface Mount power devices (DPAK), the copper foil on the PCB acts as the heatsink. The area of the copper determines the cooling power.
* **The "Limit":** If you need to dissipate massive power, eventually the chip's internal resistance (R<sub>&theta;JC</sub>) becomes the bottleneck. No heatsink can fix that; you must use multiple transistors in parallel.

### 5. Testing Temperature
* **The "Sizzle Test":** Touch it with a wet finger. If it hisses, it is too hot (>100&deg;C). *Warning: Hazardous near high voltage.*
* **Professional Tools:** Use a thermocouple probe or an IR Temperature Gun for accurate, non-contact readings.

---

## 8. AC Line to Unregulated Supply

Insert ac module and rectifier here

The first stage of a power supply is converting the high-voltage AC wall power into a raw, unregulated DC voltage. This involves safety, filtering, and rectification.

### Power Entry & Safety
* **3-Wire Connection:** Always use a 3-prong plug to ensure the equipment casing is grounded for safety.
* **Power Entry Module:** Often combines the fuse holder, switch, and low-pass filter into one unit. Good design ensures you cannot touch live lines while changing a fuse.
* **Fuses:** Mandatory. "Slow blow" fuses are best for power supplies to handle the initial inrush current of the large capacitors.
* **Galvanic Isolation:** An isolating transformer should generally be used when running off the power line to separate your circuit ground from the mains earth.

### Filtering (EMI & Safety)
Low-pass filters (often Pi filters) prevent RF interference from entering the instrument and stop the instrument from polluting the power line with noise.
* **Line Voltage Capacitors:** Special safety-rated capacitors are required here.
    * **X-Class (X1, X2):** Connects Line-to-Neutral. Failure does not cause a shock hazard (fires only).
    * **Y-Class (Y1, Y2):** Connects Line-to-Ground. Failure puts live voltage on the chassis, so these must be high reliability to prevent shock.
* **Transient Suppressors:** Devices (like MOVs or bidirectional Zeners) that shunt hundreds of amps if the voltage spikes, protecting the circuit.

### DC Components & Rectification
* **Rectifier:** Converts AC to pulsing DC.
* **Storage Capacitor (Filter Cap):** Smoothes the pulses. It must be large enough to provide low ripple.
    * *Trade-off:* An overly large cap reduces the conduction angle, which increases heating in the transformer and stress on the rectifier.
* **Bleeder Resistors:** Resistors across the output capacitors provide a minimum load and discharge the capacitors for safety when the unit is turned off.
* **Snubber:** A series RC network across the transformer secondary is often omitted but recommended to tame random voltage spikes.

### Transformer Selection Strategy
**1. Voltage Selection**
You need to select a secondary voltage that balances Power Dissipation against Dropout Voltage.
* **The Goal:** Keep unregulated DC low to minimize heat.
* **The Constraint:** The voltage at the bottom of the ripple trough must never drop below the regulator's dropout voltage (typically V<sub>out</sub> + 2V).
* **Worst Case:** You must design for **Low Line Voltage** (Brownout) and **Full Load** (Max Ripple).
* **Warning:** Do not rely solely on math (V<sub>peak</sub> &approx; 1.41 &times; V<sub>rms</sub> - 1.4V). Transformer resistance and leakage cause voltage sag. **Bench measurement is mandatory.**

**2. Current Rating (The Trap)**
You cannot simply match the transformer RMS rating to your DC load current.
* **The Phenomenon:** Rectifiers draw current in short, high-intensity pulses at the AC peak.
* **The Consequence:** These spikes generate significantly more I<sup>2</sup>R heating than steady DC.
* **Rule of Thumb:** Select a transformer with an RMS current rating **1.8x to 2x larger** than your required DC output current. (e.g., for 2A DC, use a 4A RMS transformer).

---

## 9. Switching Regulators

insert linear vs switching image here

Linear regulators are inherently inefficient because the pass transistor carries full load current while dropping the excess voltage (P = I &times; V<sub>drop</sub>). Switching regulators fix this by using a switch to periodically apply full voltage to an inductor, storing energy in the magnetic field, and then transferring it to the output.

**Advantages:**
* **High Efficiency:** Very little power dissipation because the switch is either fully ON (low V) or fully OFF (zero I).
* **Flexibility:** Can output voltages higher (Boost), lower (Buck), or inverted (Buck-Boost) relative to the input.
* **Compact:** Ideal for small designs.

**Disadvantages:**
* **Noise:** Switching produces significant ripple at the output and EMI radiated on the input lines.

### Charge Pump Converters
These are **inductorless** converters that use capacitors to shift voltage.
* **Pros:** Smaller, electrically quieter than switchers. Good for low-current needs (e.g., generating a negative rail for an op-amp).
* **Cons:** Unregulated output drops significantly under load (though regulated versions exist).

### Noise Management
Switching noise appears in four ways:
1.  **Output Ripple:** Typical 10-100mV peak-to-peak at switching frequency.
2.  **Common Mode Ripple:** Ground-line ripple current.
3.  **Input Ripple:** Impressed onto the supply rail.
4.  **Radiated EMI:** From the switched currents in the inductor.

**Mitigation:**
* Use a Low-Dropout (LDO) regulator after the switcher to clean the output.
* Use simple LC output filters.
* **ZVS/ZCS (Zero-Voltage/Current Switching):** Topologies that switch when voltage or current is zero to minimize noise.

### Conduction Modes
* **CCM (Continuous Conduction Mode):** Inductor current never drops to zero. Preferred for high power; easier to filter.
* **DCM (Discontinuous Conduction Mode):** Inductor current drops to zero during every cycle.

### Control Architectures: Voltage Mode vs. Current Mode
To regulate voltage, the controller compares V<sub>out</sub> to V<sub>ref</sub> to create an Error Signal. How it uses that signal defines the mode.

**1. Voltage Mode (The Timer Method)**
* **Logic:** Compares the Error Signal against a fixed internal sawtooth ramp.
* **Issue:** The loop doesn't know how much current is flowing until it's too late (overload).
* **Stability (The 2-Pole Problem):** The LC output filter acts as a **2nd Order System** (Double Pole), causing rapid 180&deg; phase shift. This is hard to compensate (requires Type III compensation).

**2. Current Mode (The Threshold Method)**
* **Logic:** The controller measures the actual current ramping up in the inductor. When the current hits the threshold set by the Error Signal, the switch turns off.
* **Input Feedforward:** If V<sub>in</sub> spikes, current ramps faster, hitting the limit sooner, and turning the switch off instantly. V<sub>out</sub> barely moves.
* **Stability (The 1-Pole Solution):** Since the loop forces a specific current, the Inductor acts like a Current Source. The "Inductor Pole" disappears from the math, leaving only the Capacitor (1st Order), which is much easier to stabilize.
* *Fixes:* Requires **Slope Compensation** to prevent instability (Subharmonic Oscillation) at >50% duty cycles.

### Galvanic Isolation Topologies
Switching converters can use transformers for isolation (essential for AC-line powered devices) and to provide multiple output rails.
* **Flyback:** Simple, low-to-medium power (~200W). Full pulsations of input and output current.
* **Forward Converter:** Used for higher power levels.
* **Bridge Converters (Half/Full):** Used for very high power applications.

---

## 10. Offline Switching Architectures

### 1. The "Offline" Architecture
Instead of using a heavy 60Hz iron transformer to step 120V AC down before rectifying, modern supplies rectify the mains immediately.
* **The Process:** 120V AC &rightarrow; Rectifier &rightarrow; High Voltage DC (&approx;160V) &rightarrow; High Frequency Switcher &rightarrow; Low Voltage DC.
* **Safety Hazard:** Because there is no input transformer, the High Voltage DC rail is **not isolated** from the wall. Touching any part of the primary side is lethal.
* **Requirement:** You must use a switching topology with a transformer (like Flyback) to provide isolation. Feedback is handled via an Optocoupler.

### 2. Dual-Voltage Inputs (110/220V)
* **Universal Input:** Modern low-power devices just use a switching transistor rated for the full range (85V–265V AC).
* **The Voltage Doubler Trick:** For higher power, a jumper switch reconfigures the input bridge.
    * *Switch Open (230V):* Standard full-wave bridge. Output &approx; 320V DC.
    * *Switch Closed (115V):* Voltage Doubler mode. Uses half the bridge to charge caps on alternating cycles. Output &approx; 320V DC.

### 3. Inrush Current
When first plugged in, the empty bulk capacitor acts as a short circuit.
* **The Fix (NTC):** An NTC Thermistor has high resistance when cold (limiting current) but drops to low resistance as it heats up.
* **The Fix (Soft-Start Relay):** A resistor limits current initially, then a relay bypasses it after ~1 second.

### 4. Power Factor Correction (PFC)
Standard rectifiers draw current only at the voltage peaks, causing poor power factor.
* **Active PFC:** Mandatory for >100W supplies. Places a **Boost Converter** between the rectifier and the capacitor.
* **Function:** Forces input current to match the sine wave shape of the input voltage, making the supply look like a resistive load to the grid.

---

## 11. Offline Design Challenges

### 1. High Voltage & Component Stress
Even after rectification, the DC rail is 160V–300V.
* **MOSFET Rating:** Due to inductive kickback and voltage doubling in resets, you often need a 600V or 800V rated MOSFET to survive a 300V line.
* **Spikes:** Leakage inductance causes voltage spikes above the theoretical max, requiring snubbers.

### 2. Switching Losses (CV<sup>2</sup>f)
High-voltage MOSFETs are inefficient due to thicker silicon (High R<sub>DS(on)</sub>) and capacitive losses.
* **The Killer:** Every time the switch turns on, it discharges its own parasitic capacitance (C<sub>oss</sub>).
    * **Formula:** `P = 0.5 * C * V^2 * f`
    * *Example:* A 100pF cap at 300V switching at 150kHz burns 1.35W just by toggling.
* **The Fix:** **Soft Switching (ZVS)** uses inductance to swing voltage to 0V before turning the switch on.

### 3. Feedback Across the Barrier
Since the output is isolated, the feedback loop cannot be a simple wire.
* **Method A (Optocoupler):** An LED on the secondary shines across a gap to a phototransistor on the primary.
* **Method B (Primary Side Regulation):** Regulates an auxiliary coil on the transformer, assuming the main output follows it. Cheaper but less accurate.

### 4. The Isolation Barrier (Safety)
Strict standards (UL/IEC) govern how to prevent high voltage from jumping to the user.
* **Clearance (Arcing):** Shortest distance through air. Keep components >2mm apart.
* **Creepage (Tracking):** Shortest distance along a surface. Dust/moisture can create a path.
    * *Fixes:* Cut slots in the PCB or remove pins from the optocoupler to increase path length.

---

## 12. Real-World Example: 15W Flyback Supply

Insert flyback here

**1. The Core Architecture:**
This is a Flyback Converter converting 100-240V AC to a safe, isolated 5V DC output. The primary and secondary grounds are completely isolated.

**2. Circuit Walkthrough:**
* **Input Stage:** AC enters through a fuse and EMI filter (L1, X1). The bridge (D1) creates high-voltage DC stored in the 47&mu;F capacitor.
* **The Switch (U1):** The TOP201 is a monolithic chip combining the PWM controller and High-Voltage MOSFET. It switches at 100kHz.
* **Transformer (T1) & Snubber:** The transformer acts as an inductor.
    * *Leakage:* Energy stuck in the primary (leakage inductance) causes spikes when the switch turns off.
    * *Snubber:* D2 (TVS) and D3 (Diode) clamp this spike to protect the MOSFET.
* **Secondary Side:** Schottky diode D5 rectifies the output. L2 smooths the 100kHz ripple.
* **Feedback:** The TL431 (U2) monitors the 5V output. When it hits 5V, it lights the LED in the Optocoupler (U3), signaling the primary controller (U1) to reduce power.

**3. Practical Lessons:**
* **DCM (Discontinuous Conduction Mode):** The transformer fully empties energy (I=0) before the next cycle, causing "Dead Time" ringing.
* **Hard Switching:** The MOSFET burns energy shorting its C<sub>OSS</sub> at 320V.
* **Safety:** Never probe the primary side with a standard scope probe unless you use an isolation transformer.

:::tip When to use Switchers?
* **Digital Systems (+3.3V, +5V @ High Current):** Use a line-powered switcher.
* **Analog Circuits (Small Signal):** Use a Linear Regulator. Switchers are too noisy.
* **High Power:** Use a line-powered switcher (smaller, lighter, cooler).
* **Advice:** Designing offline switchers is dangerous and difficult. **Buy off-the-shelf** supplies whenever possible.
:::

---

## 13. Inverters & Voltage References

### Inverters
Inverters are DC to AC converters.
* **Applications:** Motor driving (multiphase), Audio (Class D Amplifiers), Uninterruptible Power Supplies (UPS).

### Voltage References
Standard regulators (like the 7805) are designed for **Power**, not precision. They may drift 1-3% with heat. For high precision (e.g., 6-digit multimeters), you need a dedicated **Voltage Reference**.

**Architecture:**
* **The Brain (Reference):** A dedicated chip that handles negligible power but is incredibly stable (e.g., 2ppm/&deg;C).
* **The Muscle (Pass Transistor):** An external circuit that takes the precise command from the reference to drive the load.

**Types of References:**
1.  **Zener Diodes:** The simplest form. Noisy and poor tolerance unless operated at specific "buried" voltages (~6V).
2.  **Bandgap Reference:** Uses the predictable 0.6V V<sub>BE</sub> drop of a transistor. Not affected by temperature coefficient.
3.  **JFET Pinch-off:** Uses the pinch-off voltage of a JFET.
4.  **2-Terminal (Shunt):** Acts like a perfect Zener. You force current through it, and it clamps to a precise voltage.
5.  **3-Terminal (Series):** Acts like a tiny linear regulator. Handles its own biasing.


---
## 14. Battery Management Systems (BMS)

Battery Management Systems are critical when moving from wall power to portable electronics. While a power supply *provides* energy, a BMS *manages* the storage of that energy, specifically focusing on safety and longevity.

### 1. Lithium-Ion Charging Topology (CC/CV)
Unlike Lead-Acid or NiCad batteries which can often be trickle charged, Lithium-Ion (Li-Ion) and Lithium-Polymer (LiPo) batteries are volatile. Overcharging them leads to plating of metallic lithium, internal shorts, and potential thermal runaway (fire).

To charge them safely, we use the **CC/CV Algorithm** (Constant Current / Constant Voltage).



**Phase 1: Constant Current (CC)**
* **State:** The battery is empty (e.g., 3.0V).
* **Action:** The charger acts as a **Current Source**. It forces a fixed current (e.g., 1A or 0.5C) into the battery.
* **Result:** The battery voltage slowly rises.
* **Goal:** Bulk energy transfer.

**Phase 2: Constant Voltage (CV)**
* **State:** The battery reaches its maximum rated voltage (typically 4.20V per cell).
* **Action:** The charger switches modes to act as a **Voltage Source**. It clamps the voltage at exactly 4.20V.
* **Result:** To maintain 4.2V without exceeding it, the current naturally begins to taper off (decay) exponentially as the battery's internal resistance changes.
* **Goal:** To "top off" the capacity without over-stressing the chemistry.

**Phase 3: Termination**
* **Action:** The charger monitors the tapering current.
* **Trigger:** When the current drops below a preset threshold (typically C/10, e.g., 100mA for a 1000mAh battery), the charge is considered complete.
* **Stop:** The charger **must** completely cut off current. You *cannot* trickle charge Li-Ion batteries; doing so will cause plating and failure.

### 2. Cell Balancing
When multiple cells are connected in series (e.g., a 4S pack at 14.8V), they are rarely perfectly identical. One cell might age faster and have slightly lower capacity.

**The Problem:**
* **During Charge:** The "weak" cell fills up faster. It hits 4.2V while the others are still at 4.0V. If you keep charging the pack, the weak cell goes to 4.4V (Danger!) or the charger stops early, leaving the rest of the pack undercharged.
* **During Discharge:** The weak cell hits empty (3.0V) first. If you keep drawing power, it can reverse polarity and be destroyed.

**The Solution: Balancing**
A BMS monitors individual cell voltages and intervenes.

**A. Passive Balancing (Bleeding)**
* **Mechanism:** Resistors are placed in parallel with each cell, controlled by a MOSFET switch.
* **Action:** When a cell hits 4.2V before its neighbors, the BMS turns on the MOSFET for *that specific cell*.
* **Result:** The excess energy is burned off as heat through the resistor, preventing the voltage from rising further. This allows the other cells to catch up.
* **Pros/Cons:** Cheap and simple, but wasteful (heat) and slow.

**B. Active Balancing (Shuffling)**
* **Mechanism:** Uses capacitors or inductors to shuttle energy.
* **Action:** Takes energy *from* the highest voltage cell and pumps it *into* the lowest voltage cell.
* **Pros/Cons:** Highly efficient (no waste heat), but complex and expensive. Used in EVs and high-end storage.

---

## 15. PCB Layout Strategy: The "Hot Loop"

In switching power supplies, the schematic is only half the design. The physical layout determines whether the supply works or whether it becomes a radio transmitter that fails EMI testing.

### 1. Identifying the "Hot Loop"
The "Hot Loop" is the physical path on the PCB where the current is **discontinuous** (switching from zero to full current rapidly). This high *di/dt* (change in current over time) creates massive magnetic fields.

**The Physics:**
Any loop of wire carrying current acts as an antenna.
> **Radiated Power &propto; Loop Area &times; Frequency<sup>2</sup> &times; Current**

To stop EMI, you must minimize the **Loop Area**.



**Buck Converter Hot Loop:**
* **The Path:** Input Capacitor &rarr; High-Side Switch (MOSFET) &rarr; Low-Side Switch (Diode/MOSFET) &rarr; Ground &rarr; Input Capacitor.
* **Why:** The input current is chopped. When the high-side switch is ON, current flows. When OFF, it stops instantly. The output side (Inductor) has continuous current, so it is *not* the critical hot loop.

**Boost Converter Hot Loop:**
* **The Path:** Output Capacitor &rarr; Diode &rarr; Low-Side Switch &rarr; Ground &rarr; Output Capacitor.
* **Why:** The input current (through the inductor) is continuous. The *output* current is pulsed (diode commutating).

### 2. Layout Rules for Minimization
1.  **Placement:** The Input Capacitor (for Buck) or Output Capacitor (for Boost) is the most critical component. It must be placed as close as mechanically possible to the switch/diode pins.
2.  **Traces:** Do not use thin traces. Use wide polygons or copper pours to connect these components.
3.  **Ground Plane:** A solid ground plane on the layer directly underneath the Hot Loop acts as a shield and reduces inductance.
4.  **Via Placement:** Do not route the Hot Loop through vias if possible. Vias add inductance. If you must use vias, use multiple in parallel.

:::info The "Ground Bounce"
If your Hot Loop layout is sloppy (high inductance), the rapid switching current will cause voltage spikes on your Ground line (`V = L * di/dt`). This "Ground Bounce" can confuse the controller chip, causing it to reset or jitter.
:::

---

## 16. Digital Power Control

Traditionally, power supplies were purely analog (Op-Amps and comparators). Modern systems, especially in servers and automotive, use "Digital Power."

### 1. Digital Management vs. Digital Control
There is a distinction between managing a supply and controlling the loop.

**A. Digital Management (Telemetry)**
The control loop is still Analog (fast, familiar), but the "Housekeeping" is Digital.
* **Communication:** The regulator has an I2C or PMBus interface.
* **Reporting:** It sends real-time data to a main microcontroller:
    * Input/Output Voltage
    * Output Current (Amps)
    * Die Temperature
* **Configurability:** You can change settings on the fly without soldering new resistors:
    * "Set Output to 1.2V for Sleep Mode."
    * "Set Output to 3.3V for Active Mode."
    * "Lower the Over-Current Limit."

**B. Digital Control (Digital Loop)**
The Analog Error Amplifier is completely removed.
* **Architecture:** ADC &rarr; PID Processor &rarr; Digital PWM Generator.
* **The ADC:** Samples the output voltage millions of times a second.
* **The PID:** A DSP core calculates the required pulse width using math algorithms.
* **Advantages:**
    * **Non-Linear Control:** You can program complex responses that analog circuits can't do (e.g., "If load spikes 100%, ignore the first 2µs, then ramp up gain 10x").
    * **Component Aging:** The software can self-calibrate to account for capacitors aging over 10 years.

### 2. PMBus (Power Management Bus)
PMBus is the industry standard protocol (based on I2C) for talking to power supplies.

**Common Commands:**
* `VOUT_COMMAND`: Set the target voltage.
* `READ_VOUT`: Read actual voltage.
* `READ_TEMPERATURE_1`: Read chip temperature.
* `STATUS_BYTE`: Check for faults (Overvoltage, Overtemperature, etc.).

**Use Case:**
In a high-end CPU server, the motherboard MCU reads the PMBus. If the CPU temperature rises, the MCU can command the fan speed to increase AND command the voltage regulator to slightly lower the core voltage to reduce heat generation, all via software.