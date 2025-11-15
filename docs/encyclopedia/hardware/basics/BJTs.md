# BJTs, Amplifiers, and Feedback

[TOC]

---

## Basic BJT idea

- A small base current is used to control a large current flowing from collector to emitter.
- The base–emitter and base–collector junctions behave like diodes.

Rules of operation (NPN, general rule):

- If \(V_C > V_B\) and \(V_{BE} \approx 0.7\text{ V}\), you are in **active mode**.
- If \(V_{BE} > 0.7\text{ V}\) and \(V_B > V_C\), you are in **saturation**.
- If \(V_{BE} < 0.7\text{ V}\), you are in **cutoff**.

When looking at transistors, you have 2 methods:

- **General rule**: quick hand analysis, assumes \(V_{BE} \approx 0.7\text{ V}\), etc.
- **Ebers–Moll**: exponential model for more accurate analysis.

Use the general rule most of the time for simple analysis.

Under general analysis:

- \(I_C = \beta I_B\)  
  Your circuit designs should **not** rely on \(\beta\). It can vary wildly. Do not design a circuit that needs an accurate \(\beta\).

- \(V_B \approx V_E + 0.7\text{ V}\)  
  This will hold whenever the transistor is conducting (in active or saturation, roughly).  
  If this is not true, the transistor is in cutoff.

- As base current increases, collector current increases. With enough base drive, the transistor ends up like a short between collector and emitter (saturation). With no base current, it acts like an open between collector and emitter (cutoff).

---

## Modes of operation

### Active mode

- Occurs when:
  - \(V_B > V_E\) by about \(0.7\text{ V}\), and
  - \(V_C > V_B\)

- You can bias your transistor at a certain point. The point you choose is the **quiescent point (Q-point)** that your circuit operates around.

### Saturation

- Occurs when \(I_B \cdot \beta\) is greater than the possible collector current:  
  \(I_B \cdot \beta > I_C(\text{max allowed by circuit})\)

- Because \(I_C = \beta I_B\) (in the model), the collector *tries* to pull more current than the circuit can supply.

- More and more voltage drops across the collector resistor, leaving almost no voltage left for the collector–emitter. So the collector voltage goes near the emitter voltage (for NPN with emitter at ground, \(V_C \approx 0\)).

- The base–collector junction becomes forward biased (base–collector diode conducts).

What it means:

- \(V_{CE}\) goes as close to 0 as it can.
- The transistor effectively acts like a **closed switch** (from collector to emitter).
- All possible current from the supply through the load flows through the transistor.

Uses:

- You can use a transistor as a **switch** by saturating it.
- To guarantee saturation, you make \(I_B\) large enough that even with a low \(\beta\) you still get \(I_B \cdot \beta > I_C\).  
  Do **not** rely on the exact value of \(\beta\); overdrive the base.

### Cutoff

- Occurs when \(V_{BE}\) is not forward biased, or \(I_B \approx 0\).
- Achieved by grounding the base (for NPN) or making \(V_E > V_B\).

What it means:

- Collector current does not flow (neglecting leakage).
- All terminals are basically “for themselves” (open circuit between collector and emitter).
- The transistor acts like an **open switch**.

---

## Ebers–Moll, exponential behavior, and \(r_e\)

Important formula (Ebers–Moll):

- \(I_C = I_S e^{\frac{V_{BE}}{V_T}}\)  
  where:
  - \(I_S\) is the saturation current (very temperature dependent),
  - \(V_T = \frac{kT}{q}\) is the thermal voltage (\(\approx 25\text{ mV}\) at room temp).

- This shows that **\(I_C\) is fundamentally set by \(V_{BE}\)**, not by base current. The relationship \(I_C = \beta I_B\) is a consequence of this exponential behavior.

- Inverse:
  \[
  V_{BE} = V_T \ln\left(\frac{I_C}{I_S}\right)
  \]
  So \(V_{BE}\) is affected by temperature through both \(V_T\) and \(I_S\).

- Relationship between two operating points:
  \[
  \frac{I_{C2}}{I_{C1}} = e^{\frac{\Delta V_{BE}}{V_T}} \quad\Rightarrow\quad
  \Delta V_{BE} = V_T \ln\left(\frac{I_{C2}}{I_{C1}}\right)
  \]

**Internal emitter resistance \(r_e\):**

- Small-signal emitter resistance:
  \[
  r_e = \frac{V_T}{I_C} \approx \frac{25\text{ mV}}{I_C} \quad(\text{at room temperature})
  \]
- If \(I_C\) changes (with temperature or bias), \(r_e\) changes.
- If your circuit relies **only** on \(r_e\) for its emitter resistance, then small changes in \(I_C\) cause **non-linear** changes in gain/impedance.

---

## Emitter degeneration and temperature stability

**Emitter degeneration**: having an explicit resistor \(R_E\) in the emitter.

- Usually you want \(R_E \gg r_e\).  
  Then most of the emitter “resistance” is a fixed resistor, not the temperature-dependent \(r_e\).

- If your circuit relies solely on \(r_e\):
  - Linear changes in \(V_{BE}\) do **not** give linear changes in collector current because of the exponential relationship.
  - As \(I_C\) varies, \(r_e\) varies → impedance and gain vary.

- Adding an external emitter resistor \(R_E\) acts as **negative feedback**:
  - If \(I_C\) increases → \(I_E\) increases → voltage across \(R_E\) increases → \(V_E\) goes up → \(V_{BE}\) goes down → \(I_C\) is pushed back down.
  - This helps prevent **thermal runaway**, where increased temperature causes increased \(I_C\), causing more power dissipation and even more temperature.

**Bypass capacitor idea:**

- You can use a large \(R_E\) for DC stability, and **bypass** it with a capacitor for AC.
- DC: \(R_E\) is seen, stabilizing bias and fighting thermal runaway.
- AC: capacitor shorts \(R_E\), so the AC gain is mostly set by \(R_C/r_e\).  
  “Your AC signal has a straight path to ground, so your gain is \(R_C/r_e\), but now you have \(R_E\) to maintain your stuff (bias stability).”

**Temperature parts:**

- Both \(V_T = kT/q\) and \(I_S\) change with temperature.
- The temperature dependence of \(I_S\) is generally stronger and dominates.

---

## Biasing BJTs

### Dual supply biasing vs. voltage divider biasing

- **Voltage divider biasing**:
  - You use a resistor divider from a single supply to set the base DC voltage.
  - A coupling capacitor lets the AC signal “ride” on top of this DC bias.
  - The signal can swing around a mid-rail bias point toward the supply rails.

- **Dual supply biasing**:
  - You have \(+V_{CC}\) and \(-V_{EE}\).
  - Both base and input signal can be biased at 0 V.
  - The signal can swing from \(+V_{CC}\) to \(-V_{EE}\) symmetrically.  
  - LTspice examples help visualize this.

### Using 2 resistors for high-gain applications

- Using a simple base bias resistor alone might need a very low base voltage for a high gain target, which makes \(V_{BE}\) very unstable there.
- Using two resistors can give you:
  - A more stable base bias (voltage divider or feedback).
  - A way to set gain while keeping the transistor in a more comfortable region.
- For some circuits, the gain is related to the ratio of the unbypassed emitter resistor voltage to the collector voltage (think of a “\(r_e\) voltage divider” idea).

### Collector-to-base (feedback) bias

Another way to bias:

- \(V_{BE}\) is set by the current pulled by the collector node \(V_C\).
- The collector is connected back to the base through a resistor (e.g. 10 kΩ), providing **DC feedback**.
- It can be set up mathematically so that the base settles to about 0.7 V above the emitter (for NPN), keeping \(I_C\) roughly constant.

- The 10 kΩ is chosen so that the current flowing through it provides the required base current for Q1.
- Since the transistors are matched and share the same \(V_{BE}\), they behave similarly at the same bias.

You can think of:
- Collector voltage (say 0.8 V across 10 kΩ) sets a base current, and this base current defines \(I_C\), which then defines \(V_C\), closing the loop.

---

## Using a PNP

- If you want a load to start off at ground and then be switched to a **positive supply**, you’d often use a PNP high-side transistor.
  - Otherwise, with an NPN on the high side, the emitter would need to be at the supply, and \(V_{BE}\) can’t be > 0.7 V without exceeding the supply.

- You can also use a PNP cascaded with an NPN emitter follower to remove the 0.7 V offset that a single NPN emitter follower introduces.

---

## KVL with BJTs

- When you’re solving for voltages and currents, remember that the base and emitter are “tied” by about 0.7 V (for a conducting transistor).
- For NPN: \(V_B \approx V_E + 0.7\text{ V}\).
- For PNP: \(V_E \approx V_B + 0.7\text{ V}\).
- Include this drop correctly in your KVL loops.

---

## Emitter follower (common collector)

Another use for transistors:

- The emitter follower has **high input impedance** and **low output impedance**.
- This means you can drive a relatively low-impedance load from a high-impedance source without loading the source too much.

Key relationships:

- \(R_{in} \approx (\beta + 1) R_L\) where \(R_L\) is the load (seen at the emitter).
- There’s usually no collector resistor in a simple emitter follower, because you don’t want to saturate the transistor.

Biasing and bootstrapping:

- When biasing an emitter follower with a divider, the divider should not be extremely high impedance compared to the base input impedance, otherwise the bias becomes unstable.
- **Bootstrapping**: by feeding a portion of the output back to the bias network, you can greatly increase the **AC input impedance** without loading down your signal. The AC voltage at the top of a resistor moves with the output, so there is very little AC across that resistor, making its effective AC resistance huge.

---

## Current sources and current mirrors

### Simple transistor current source

- Transistors can act as current sources by adding a load to the collector and using an emitter resistor.

Example:

- \(V_E = V_B - 0.7\text{ V}\)
- \(I_E = V_E / R_E = (V_B - 0.7)/R_E\)
- For large \(\beta\), \(I_E \approx I_C\), so:
  \[
  I_C \approx \frac{V_B - 0.7}{R_E}
  \]
- As long as the transistor stays in active region (not saturated), this current is fairly constant even if the load changes (within limits).

- You can provide \(V_B\) with a voltage divider, as long as the divider impedance is \(\ll \beta \cdot R_E\).

- By varying \(V_B\), you get a **voltage-controlled current source**.

Also:

- A simple conceptual current source: a voltage applied through a very large source resistance. As long as \(R_{source} \gg R_{load}\), the load current doesn’t change much when the load changes.
- Real resistive current sources waste power; BJTs can do a better job with less loss.

### Current mirror

- A **current mirror** takes some input current and outputs a copy of that current, so you can “replicate” current to multiple loads.
- It has a **high output impedance** to keep its output current nearly constant over changes in output voltage.

Basic BJT current mirror example:

- Q1 has its emitter at +15 V and its base at about 14.4 V (assuming some reference setup).
- Q1’s collector is adjusted so that its collector current is the reference current (say 1 mA).
- Bases and emitters of Q1 and Q2 are tied together, so they share the same \(V_{BE}\).
- Because they have the same \(V_{BE}\) and are matched devices, Q2 will also conduct about the same collector current (1 mA) into its load.

Reality:

- Because output impedance is not infinite, the mirrored current \(I_C\) can vary if the load severely changes the output voltage or draws too much current.

---

## Common emitter amplifier

Another use: the **common emitter amplifier**.

- DC output voltage:
  \[
  V_{out} = V_{CC} - I_C R_C
  \]
- Small-signal gain (with unbypassed emitter resistor \(R_E\)) is roughly:
  \[
  A_v \approx -\frac{R_C}{R_E}
  \]
  (More accurately, it should include \(r_e\) and any bypassing details.)

- The output is **180° out of phase** with the input.

You should be able to perform basic DC and AC analysis to see why:

- Increase in base/emitter current → increase in \(I_C\) → larger drop across \(R_C\) → \(V_{out}\) goes down.

---

## Unity phase splitter (transconductance amplifier idea)

- In a certain topology, the transistor can act like a **transconductance amplifier**.
- The ratio of small-signal changes is current/voltage:
  \[
  g_m = \frac{\Delta I_C}{\Delta V_{BE}} = \frac{1}{r_e}
  \]
- A change in base current (or base voltage) results in a change in collector current, which through \(R_C\) results in a change in collector voltage.

- If \(R_E\) is not present (pure emitter at ground), general 0.7 V analysis may no longer be accurate for small-signal behavior; you use the **Ebers–Moll model** and small-signal parameters (\(g_m, r_\pi, r_o\)).

---

## Differential amplifiers and CMRR

**Differential amplifier**:

- Used to amplify the **voltage difference** between two points.
- Think of measuring across a component or between two nodes on an IC.
- For ECG:
  - You have LL, LA, RL, RA electrodes.
  - The differential outputs of these give you lead I, lead II, lead III, etc.
- A differential amplifier **removes the common noise** that appears on both inputs and outputs mostly the difference.

**CMRR (Common Mode Rejection Ratio)**:

- A measure of how well the amplifier rejects signals that are **common** to both inputs.
- Usually expressed in dB.
- High CMRR means the amplifier is very good at rejecting noise that appears on both inputs (e.g. 60 Hz hum on both ECG leads).

---

## Transconductance (general idea)

- **Transconductance**: change in output current per change in input voltage.
- \(g_m = \Delta I / \Delta V\).
- To describe the transconductance of a circuit, ask yourself: “How does the current change with respect to the input voltage?”

For BJTs specifically (in active region):

- \(g_m \approx I_C / V_T\).

---

## Push–pull, crossover distortion, and amplifier classes

**Push–pull output stage**:

- Allows you to get a swing near the full range of the positive and negative supplies.
- During the positive half of the signal:
  - The NPN (Q1) turns on and sources current into the load (e.g. speaker).
- During the negative half of the signal:
  - The PNP (Q2) turns on when \(V_B\) is about 0.7 V below the emitter (for PNP), allowing current to flow in the opposite direction.

**Crossover distortion**:

- There is a region around 0 V where **both transistors are off**, because each one needs about 0.7 V of \(V_{BE}\) to turn on.
- This dead zone causes crossover distortion in the output waveform.

**Fixing crossover distortion (Class AB)**:

- Add diodes D1 and D2 between the bases so they are always forward-biased and provide about 0.6–0.7 V drop each.
- This pre-biases the transistors so that at least one is always slightly on.
- This is a **Class AB amplifier** since both transistors conduct for a significant portion of the cycle.
- Tradeoff: they dissipate more power at idle because they are always somewhat on, acting like a kind of “voltage divider” between the rails.

**Class D amplifiers**:

- **Switching amplifiers** that drive the output with high-frequency pulses.
- Very high efficiency (transistors mostly fully on or fully off).
- But high-frequency switching causes more EMI emissions and requires filtering.

---

## Darlington configuration

- Two transistors cascaded so that the overall behaves like a single transistor with **very high \(\beta\)** (\(\beta_{total} \approx \beta_1 \cdot \beta_2\)).
- The base–emitter drop is about twice normal (~1.2–1.4 V).
- Disadvantage: it acts **slow** because Q1 must turn Q2 off, and charge storage can be large.
- This can be helped with a resistor from Q2’s base to emitter to speed up turn-off.

---

## BJTs vs FETs

- FETs are very popular (MOSFETs dominate digital and power switching).
- BJTs can outperform FETs in some analog areas:
  - Accuracy (e.g. predictable VBE vs current relationships).
  - Low noise in certain configurations.
  - Higher transconductance \(g_m\) at a given current (compared to MOSFETs).

---

## Negative feedback and stability

**Negative feedback**:

- A technique where a portion of a circuit’s output is fed back into the input in a way that **opposes** the original signal.
- Example: emitter resistor \(R_E\) in a common emitter amplifier:
  - If \(I_C\) increases, \(I_E\) increases → \(V_E\) increases → \(V_{BE}\) decreases → \(I_C\) is reduced.
  - This stabilizes the circuit against changes in temperature, transistor \(\beta\), supply variations, etc.

**Stabilized operation / thermal runaway**:

- Negative feedback helps prevent **thermal runaway**:
  - Temperature ↑ → \(I_C ↑\) → power ↑ → temperature ↑ (positive feedback)  
  - With emitter degeneration, the feedback loop opposes this, making the circuit more stable.

**Lower output impedance**:

- Negative feedback generally **lowers the output impedance** of an amplifier, making the output voltage less sensitive to load changes.

**Gain stability example**:

- If an amplifier has open-loop gain \(A\) and feedback factor \(B\), then the closed-loop gain (you wrote) is:
  - \(A / (A B)\), which simplifies to \(1 / B\).  
  - Idea: if \(A B\) is large, the closed-loop gain is mostly set by \(B\), not by the exact value of \(A\).
- If \(B\) is made of stable parts like resistors (instead of temperature-sensitive transistors), then the gain is very stable.

---

## Voltage feedback and current feedback

**Voltage feedback**:

- You subtract a portion of the **output voltage** from the input.
- This makes the voltage across the actual input of the amplifier very small.
- Because the input voltage is small, very little current needs to flow, so the **input impedance increases** by roughly a factor of (gain × feedback).

**Current feedback**:

- You feed back a portion of the **output current** into the input node in such a way that it opposes the input.
- The input voltage barely moves (it is held nearly constant).
- Since the voltage doesn’t move much, the input can accept more current → **input impedance is reduced**.

---

