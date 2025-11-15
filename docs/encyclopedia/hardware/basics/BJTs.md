# BJTs, Amplifiers, and Feedback

[TOC]

---

## Basic BJT idea

- A small base current is used to control a large current flowing from collector to emitter.
- The base–emitter and base–collector junctions behave like diodes.

Rules of operation (NPN, general rule):

- If `VC > VB` and `VBE ≈ 0.7 V`, you are in **active mode**.
- If `VBE > 0.7 V` and `VB > VC`, you are in **saturation**.
- If `VBE < 0.7 V`, you are in **cutoff**.

When looking at transistors, you have 2 methods:

- **General rule**: quick hand analysis, assumes `VBE ≈ 0.7 V`, etc.
- **Ebers–Moll**: exponential model for more accurate analysis.

Use the general rule most of the time for simple analysis.

Under general analysis:

- `IC = beta * IB`  
  Your circuit designs should **not** rely on `beta`. It can vary wildly. Do not design a circuit that needs an accurate `beta`.

- `VB ≈ VE + 0.7 V`  
  This will hold whenever the transistor is conducting (in active or saturation, roughly).  
  If this is not true, the transistor is in cutoff.

- As base current increases, collector current increases. With enough base drive, the transistor ends up like a short between collector and emitter (saturation). With no base current, it acts like an open between collector and emitter (cutoff).

---

## Modes of operation

### Active mode

- Occurs when:
  - `VB > VE` by about `0.7 V`, and
  - `VC > VB`

- You can bias your transistor at a certain point. The point you choose is the **quiescent point (Q-point)** that your circuit operates around.

### Saturation

- Occurs when the base drive would like to force more collector current than the circuit can supply:

  `IB * beta > IC(max allowed by circuit)`

- Because (in the simple model) `IC = beta * IB`, the collector *tries* to pull more current than the circuit can give it.

- More and more voltage drops across the collector resistor, leaving almost no voltage left between collector and emitter. So the collector voltage goes very close to the emitter voltage (for NPN with emitter at ground, `VC ≈ 0 V`).

- The base–collector junction becomes forward biased (base–collector diode conducts).

What it means:

- `VCE` goes as close to 0 as it can.
- The transistor effectively acts like a **closed switch** (from collector to emitter).
- All possible current from the supply through the load flows through the transistor.

Uses:

- You can use a transistor as a **switch** by saturating it.
- To guarantee saturation, you make `IB` large enough that even with a low `beta` you still get `IB * beta > IC`.  
  Do **not** rely on the exact value of `beta`; overdrive the base.

### Cutoff

- Occurs when `VBE` is not forward biased, or `IB ≈ 0`.
- Achieved by grounding the base (for NPN) or making `VE > VB`.

What it means:

- Collector current does not flow (ignoring tiny leakage).
- All terminals are basically “for themselves” (open circuit between collector and emitter).
- The transistor acts like an **open switch**.

---

## Ebers–Moll, exponential behavior, and re

Important formula (Ebers–Moll):

- `IC = IS * exp(VBE / VT)`

  where:

  - `IS` is the saturation current (very temperature dependent),
  - `VT = kT/q` is the thermal voltage (about `25 mV` at room temperature).

- This shows that **IC is fundamentally set by VBE**, not by base current. The relationship `IC = beta * IB` is a consequence of this exponential behavior.

Inverse relation:

- `VBE = VT * ln(IC / IS)`

So `VBE` is affected by temperature through both `VT` and `IS`.

Relationship between two operating points:

- `IC2 / IC1 = exp(ΔVBE / VT)`  
  so  
  `ΔVBE = VT * ln(IC2 / IC1)`

**Internal emitter resistance re:**

- Small-signal emitter resistance:

  `re = VT / IC ≈ 25 mV / IC` (IC in amperes, room temperature)

- If `IC` changes (with temperature or bias), `re` changes.
- If your circuit relies **only** on `re` for its emitter resistance, then small changes in `IC` cause **non-linear** changes in gain/impedance.

---

## Emitter degeneration and temperature stability

**Emitter degeneration**: having an explicit resistor `RE` in the emitter.

- Usually you want `RE >> re`.  
  Then most of the emitter “resistance” is a fixed resistor, not the temperature-dependent `re`.

- If your circuit relies solely on `re`:
  - Linear changes in `VBE` do **not** give linear changes in collector current because of the exponential relationship.
  - As `IC` varies, `re` varies → impedance and gain vary.

- Adding an external emitter resistor `RE` acts as **negative feedback**:
  - `IC` increases → `IE` increases → voltage across `RE` increases → `VE` goes up → `VBE` goes down → `IC` is pushed back down.
  - This helps prevent **thermal runaway**, where increased temperature causes increased `IC`, causing more power dissipation and even more temperature.

**Bypass capacitor idea:**

- You can use a large `RE` for DC stability, and **bypass** it with a capacitor for AC.
- DC: `RE` is seen, stabilizing bias and fighting thermal runaway.
- AC: the capacitor shorts `RE`, so the AC gain is mostly set by `RC / re`.  
  “Your AC signal has a straight path to ground, so your gain is `RC / re`, but now you have `RE` to maintain your bias stability.”

**Temperature parts:**

- Both `VT = kT/q` and `IS` change with temperature.
- The temperature dependence of `IS` is generally stronger and tends to dominate.

---

## Biasing BJTs

### Dual supply biasing vs. voltage divider biasing

- **Voltage divider biasing**:
  - You use a resistor divider from a single supply to set the base DC voltage.
  - A coupling capacitor lets the AC signal ride on top of this DC bias.
  - The signal can swing around a mid-rail bias point toward the supply rails.

- **Dual supply biasing**:
  - You have `+VCC` and `-VEE`.
  - Both base and input signal can be biased at `0 V`.
  - The signal can swing from `+VCC` to `-VEE` symmetrically.  
  - LTspice examples help visualize this.

### Using 2 resistors for high-gain applications

- Using a simple base bias resistor alone might need a very low base voltage for a high gain target, which makes `VBE` very unstable there.
- Using two resistors can give you:
  - A more stable base bias (voltage divider or feedback).
  - A way to set gain while keeping the transistor in a more comfortable region.
- For some circuits, the gain is related to the ratio of the unbypassed emitter resistor voltage to the collector voltage (think of a “re voltage divider” idea).

### Collector-to-base (feedback) bias

Another way to bias:

- `VBE` is set by the current pulled by the collector node `VC`.
- The collector is connected back to the base through a resistor (for example 10 kΩ), providing **DC feedback**.
- It can be set up mathematically so that the base settles to about `0.7 V` above the emitter (for NPN), keeping `IC` roughly constant.

- The 10 kΩ is chosen so that the current flowing through it provides the required base current for Q1.
- Since the transistors are matched and share the same `VBE`, they behave similarly at the same bias.

You can think of something like:

- Collector voltage (say `0.8 V` across a 10 kΩ resistor) sets a base current, and this base current defines `IC`, which then defines `VC`, closing the loop.

---

## Using a PNP

- If you want a load to start off at ground and then be switched to a **positive supply**, you’d often use a PNP high-side transistor.
  - Otherwise, with an NPN on the high side, the emitter would need to be at the supply, and `VBE` can’t be > `0.7 V` without exceeding the supply.

- You can also use a PNP cascaded with an NPN emitter follower to remove the `0.7 V` offset that a single NPN emitter follower introduces.

---

## KVL with BJTs

- When you’re solving for voltages and currents, remember that the base and emitter are “tied” by about `0.7 V` (for a conducting transistor).
- For NPN: `VB ≈ VE + 0.7 V`.
- For PNP: `VE ≈ VB + 0.7 V`.
- Include this drop correctly in your KVL loops.

---

## Emitter follower (common collector)

Another use for transistors:

- The emitter follower has **high input impedance** and **low output impedance**.
- This means you can drive a relatively low-impedance load from a high-impedance source without loading the source too much.

Key relationships:

- `Rin ≈ (beta + 1) * RL` where `RL` is the load (seen at the emitter).
- There’s usually no collector resistor in a simple emitter follower, because you don’t want to saturate the transistor.

Biasing and bootstrapping:

- When biasing an emitter follower with a divider, the divider should not be extremely high impedance compared to the base input impedance, otherwise the bias becomes unstable.
- **Bootstrapping**: by feeding a portion of the output back to the bias network, you can greatly increase the **AC input impedance** without loading down your signal.  
  The AC voltage at one end of a resistor moves with the output, so there is very little AC across that resistor, making its effective AC resistance huge.

---

## Current sources and current mirrors

### Simple transistor current source

- Transistors can act as current sources by adding a load to the collector and using an emitter resistor.

Example:

- `VE = VB - 0.7 V`
- `IE = VE / RE = (VB - 0.7 V) / RE`
- For large `beta`, `IE ≈ IC`, so:

  `IC ≈ (VB - 0.7 V) / RE`

- As long as the transistor stays in active region (not saturated), this current is fairly constant even if the load changes (within limits).

- You can provide `VB` with a voltage divider, as long as the divider impedance is much less than `beta * RE`.

- By varying `VB`, you get a **voltage-controlled current source**.

Also:

- A simple conceptual current source: a voltage applied through a very large source resistance. As long as `Rsource >> Rload`, the load current doesn’t change much when the load changes.
- Real resistive current sources waste power; BJTs can do a better job with less loss.

### Current mirror

- A **current mirror** takes some input current and outputs a copy of that current, so you can “replicate” current to multiple loads.
- It has a **high output impedance** to keep its output current nearly constant over changes in output voltage.

Basic BJT current mirror example (conceptually):

- Q1 has its emitter at `+15 V` and its base at about `14.4 V` (depending on the setup).
- Q1’s collector is adjusted so that its collector current is the reference current (say `1 mA`).
- Bases and emitters of Q1 and Q2 are tied together, so they share the same `VBE`.
- Because they have the same `VBE` and are matched devices, Q2 will also conduct about the same collector current (around `1 mA`) into its load.

Reality:

- Because output impedance is not infinite, the mirrored current `IC` can vary if the load severely changes the output voltage or draws too much current.

---

## Common emitter amplifier

Another use: the **common emitter amplifier**.

- DC output voltage:

  `Vout = VCC - IC * RC`

- Small-signal gain (with an unbypassed emitter resistor `RE`) is roughly:

  `Av ≈ -RC / RE`

  (More accurately, it should include `re` and any bypassing details.)

- The output is **180° out of phase** with the input.

You should be able to perform basic DC and AC analysis to see why:

- Increase in base/emitter current → increase in `IC` → larger drop across `RC` → `Vout` goes down.

---

## Unity phase splitter (transconductance amplifier idea)

- In a certain topology, the transistor can act like a **transconductance amplifier**.
- The ratio of small-signal changes is current/voltage:

  `gm = ΔIC / ΔVBE ≈ 1 / re`

- A change in base current (or base voltage) results in a change in collector current, which through `RC` results in a change in collector voltage.

- If `RE` is not present (pure emitter at ground), general 0.7 V analysis may no longer be accurate for small-signal behavior; you use the **Ebers–Moll model** and small-signal parameters (`gm`, `rpi`, `ro`).

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
- High CMRR means the amplifier is very good at rejecting noise that appears on both inputs (for example 60 Hz hum on both ECG leads).

---

## Transconductance (general idea)

- **Transconductance**: change in output current per change in input voltage.
- `gm = ΔI / ΔV`.

To describe the transconductance of a circuit, ask yourself: “How does the current change with respect to the input voltage?”

For BJTs specifically (in active region):

- `gm ≈ IC / VT`.

---

## Push–pull, crossover distortion, and amplifier classes

**Push–pull output stage**:

- Allows you to get a swing near the full range of the positive and negative supplies.
- During the positive half of the signal:
  - The NPN (Q1) turns on and sources current into the load (for example a speaker).
- During the negative half of the signal:
  - The PNP (Q2) turns on when its base is about `0.7 V` below its emitter (for PNP), allowing current to flow in the opposite direction.

**Crossover distortion**:

- There is a region around `0 V` where **both transistors are off**, because each one needs about `0.7 V` of `VBE` to turn on.
- This dead zone causes crossover distortion in the output waveform.

**Fixing crossover distortion (Class AB)**:

- Add diodes D1 and D2 between the bases so they are always forward-biased and provide about `0.6–0.7 V` drop each.
- This pre-biases the transistors so that at least one is always slightly on.
- This is a **Class AB amplifier** since both transistors conduct for a significant portion of the cycle.
- Tradeoff: they dissipate more power at idle because they are always somewhat on, acting like a kind of “voltage divider” between the rails.

**Class D amplifiers**:

- **Switching amplifiers** that drive the output with high-frequency pulses.
- Very high efficiency (transistors mostly fully on or fully off).
- But high-frequency switching causes more EMI emissions and requires filtering.

---

## Darlington configuration

- Two transistors cascaded so that the overall behaves like a single transistor with **very high beta**:

  `beta_total ≈ beta1 * beta2`

- The base–emitter drop is about twice normal (around `1.2–1.4 V`).
- Disadvantage: it acts **slow** because Q1 must turn Q2 off, and charge storage can be large.
- This can be helped with a resistor from Q2’s base to emitter to speed up turn-off.

---

## BJTs vs FETs

- FETs are very popular (MOSFETs dominate digital and power switching).
- BJTs can outperform FETs in some analog areas:
  - Accuracy (for example predictable VBE vs current relationships).
  - Low noise in certain configurations.
  - Higher transconductance `gm` at a given current (compared to MOSFETs).

---

## Negative feedback and stability

**Negative feedback**:

- A technique where a portion of a circuit’s output is fed back into the input in a way that **opposes** the original signal.
- Example: emitter resistor `RE` in a common emitter amplifier:
  - If `IC` increases, `IE` increases → `VE` increases → `VBE` decreases → `IC` is reduced.
  - This stabilizes the circuit against changes in temperature, transistor `beta`, supply variations, etc.

**Stabilized operation / thermal runaway**:

- Negative feedback helps prevent **thermal runaway**:
  - Temperature ↑ → `IC` ↑ → power ↑ → temperature ↑ (positive feedback)  
  - With emitter degeneration, the feedback loop opposes this, making the circuit more stable.

**Lower output impedance**:

- Negative feedback generally **lowers the output impedance** of an amplifier, making the output voltage less sensitive to load changes.

**Gain stability example**:

- If an amplifier has open-loop gain `A` and feedback factor `B`, then the closed-loop gain is:

  `Acl = A / (1 + A*B)`

- When `A*B` is large, this is approximately:

  `Acl ≈ 1 / B`

- So `B` (set by resistors) is what really controls the gain.  
  If `B` is made of stable parts like resistors (instead of temperature-sensitive transistors), then the gain is very stable.

---

## Voltage feedback and current feedback

**Voltage feedback**:

- You subtract a portion of the **output voltage** from the input.
- This makes the voltage across the actual input of the amplifier very small.
- Because the input voltage is small, very little current needs to flow, so the **input impedance increases**, often by a factor on the order of `gain * feedback`.

**Current feedback**:

- You feed back a portion of the **output current** into the input node in such a way that it opposes the input.
- The input voltage barely moves (it is held nearly constant).
- Since the voltage doesn’t move much, the input can accept more current → **input impedance is reduced**.

