# FETs

[TOC]

---

## Basic MOSFET ideas

- The MOSFET gate ideally draws no DC current, so the input impedance is very high.
- In reality there is tiny leakage and gate capacitances, so current flows briefly when the gate voltage changes.

For an N-channel enhancement-mode MOSFET:

- If `VGS` is below the threshold voltage `VTH`, no conductive channel forms and (ideally) no drain–source current flows (ignoring subthreshold).
- How much drain–source current flows mainly depends on `VGS` (and also on `VDS`).
  - If `VGS` is higher above `VTH`, the channel is stronger and more current flows for the same `VDS`.
  - A good way to say it: `VGS` controls how much current **can** flow, `VDS` controls how much **actually** does flow, within the device limits.

When the MOSFET is in its **linear (ohmic) region**:

- It behaves more like a resistor than like a current amplifier (like a BJT).
- In this region it has a small on-resistance `RDS(on)`, whose value depends on the device and on `VGS`.

MOSFETs can be used as switches to block or pass signals by setting the gate voltage. For an N-channel device:

- OFF (open switch): `VGS < VTH`
- ON (closed / low-resistance switch): `VGS` is well above `VTH`, so `RDS(on)` is small and the drain and source are nearly shorted.

PFETs:

- PFETs usually have poorer performance than NFETs:
  - Higher `VTH`
  - Higher `RDS(on)`
  - Lower saturation current

---

## JFETs, enhancement and depletion

JFETs:

- JFETs act almost like the “reverse” of enhancement MOSFETs in terms of default state.
- The gate is a diode junction to the channel, so **forward biasing it would cause conduction into the gate and can damage it**.
- At `VGS = 0 V`, with no bias at the gate, **maximum current flows** (`ID ≈ IDSS`).
- As you apply a more negative gate voltage compared to the source (`VGS` becomes more negative), less current flows.
- JFETs are essentially **on by default** and you pinch them off by making `VGS` negative.

Enhancement-mode MOSFETs:

- If `VGS < VTH`, there is no channel and basically no `IDS`.
- Current flow starts when `VGS > VTH`.
- The gate needs some positive bias (for an N-channel enhancement device) to make `VGS > VTH`.

Depletion-mode MOSFETs:

- A depletion-mode N-MOSFET starts off **conducting at `VGS = 0`**.
- It has a negative threshold voltage (`VTH` is negative).
- You need a **negative bias** on `VG` to stop current flow.
- Maximum current flows when `VGS = 0 V`.

Depletion-mode MOSFET vs JFET:

- They both behave similarly:
  - They conduct at `VGS = 0`.
  - Making `VGS` more negative reduces current.
- The main difference: with a JFET you generally **do not go positive on the gate** (to avoid forward-biasing the gate diode), while a depletion-mode MOSFET has an insulated gate and can have `VGS > 0` safely (within its abs max ratings).

---

## Which terminal is source vs drain

For many small-signal MOSFETs the structure is nearly symmetric, so the “source” and “drain” swap roles depending on voltages.

- In practice, for calculations, the **source** is the terminal at the lower potential (for an N-channel device).
- Between the drain and the source, whichever has the lower voltage is effectively the source at that moment. So usually `VD > VS` for an N-channel device when we call the top terminal the drain.

Example: N-MOSFET switching a line to ground

- You have an N-MOSFET switching a line to ground.
- You assume the drain is the high side, and `VG = 0 V` turns it off.
- But then the “drain” goes negative (say `–2 V`) — now it is more negative than the source.
- That terminal is actually acting like the **source** in terms of gate bias.

To keep it off you need `VGS < VTH`.

- If `VG = 0 V` and the source/drain node is at `–2 V`:

  `VGS = VG - VS = 0 - (–2) = +2 V`  → this can **turn it on**.

- To really keep it off, the gate has to go more negative than the most negative signal at that node.

So:

- The terminal (not the gate) with the **lowest voltage** is effectively the source.
- The other terminal is the drain.
- For an N-channel device with `VD > VS`, current (conventional) flows from drain to source (though if you swap labels, the “drain” and “source” names change accordingly).

---

## Device variation and precision

- `VGS` for a MOSFET can vary a lot between parts, sometimes by up to a few volts in `VGS(th)` and in the `ID` vs. `VGS` curves.
- Because of this, MOSFETs are **not great for targeting a precise `ID`** just by setting `VGS` to some value.
- The usual use is more like “turn it on hard” (for switching) or use it inside an IC where the manufacturer trims and controls things.

Comparison to BJTs:

- BJTs have some variation in `VBE`, but the spread needed for a given `IC` is often smaller and more predictable than MOSFET `VGS` spreads.
- For high-precision current drawing or mirrors, BJTs are often preferred.
- MOSFETs have too much spread for accurate discrete current setting purely from gate voltage.

---

## Where FETs shine

Most important FET circuits / use cases:

- **High-impedance / low-current buffers and amplifiers**:
  - Cases where a BJT’s input current draw and finite input impedance are a problem.
  - Because of the large spreads among discrete MOSFETs, you often want **ICs** (op-amps with FET inputs, integrated FET stages) instead of discrete FETs when you care about predictability.
- **Analog switches**:
  - Transmission gates, multiplexers, etc.
  - Again, often implemented as ICs rather than with single discrete MOSFETs.
- **Digital logic**:
  - CMOS logic everywhere.
- **Power switching**:
  - MOSFETs dominate in power converters, motor drivers, etc.
- **Variable resistors / current sources**:
  - In the “linear” region of the drain curves, FETs behave like **voltage-controlled resistors**.
  - In the “saturation” region they behave like **voltage-controlled current sources**.
  - You can exploit this intrinsic behavior in analog circuits.

---

## JFETs for linear applications and current sources

- JFETs are very good for linear applications like current sources, followers, and amplifiers.
- They are often **very low noise**, which is why they show up in low-noise front ends.
- JFETs are commonly used as current sources inside ICs and sometimes discretely.

- A JFET is already conducting at `VGS = 0` and allows a current `ID` to flow.
- The **maximum** drain current with gate at 0 is given as `IDSS` in the datasheet.
- The actual current depends on `IDSS` and the gate bias; `IDSS` itself has a wide tolerance.

Example: using a JFET as a current sink under an emitter follower

- Say you have an emitter follower where you want to draw some fixed current `X` from the emitter.
- You could use a resistor to the negative rail, but that:
  - Requires more power dissipation.
  - Reduces your input impedance.

Using a JFET current sink:

- You can use a JFET as a current sink.
- For example, the gate is tied to `-12 V`, and the source is tied to `-12 V + ID * RS`.
- Then `VGS = VG - VS = -12 - (-12 + ID * RS) = -ID * RS`.
- You select an `RS` such that the `VGS` at the desired current gives you that `ID`. For example:

  `RS = |VGS_required_for_5mA| / 5 mA`

Limitations:

- Because `IDSS` and the `ID` vs. `VGS` curve vary a lot between JFETs, you **cannot really predict `ID` precisely**.
- This is not consistent enough for a tight-tolerance current sink.
- For more accurate and repeatable sinks, you are usually better off using a **BJT current sink or current mirror**.

---

## Current sinks (general idea, BJT vs JFET)

Current sinks:

- Circuits that draw a specified current from a node toward a supply rail, mostly independent of the node voltage, as long as there is enough voltage across the sink to keep it in its active region.

In a common-emitter amplifier:

- You can put a current sink in the emitter to set a nearly constant emitter current.
- The collector current is then approximately the same as that emitter current.
- The DC collector voltage is roughly:

  `VC ≈ VCC - IC * RC`

- You still bias the base so the BJT stays in active region, but the **exact collector current** is set mainly by the sink rather than by `VBE` and transistor `beta`.

To make a current sink:

- You can use the JFET example above, accepting that the current may vary from part to part.
- Or you can use **BJT current sinks**:
  - A single-transistor sink.
  - A **BJT current mirror** for better matching and multiple outputs.

---

## Gain of a MOSFET stage

For a simple common-source MOSFET amplifier:

- You wrote: “Gain of a MOSFET: `-gm / RD` where `gm` is `ID / VGS`, and `ID = k * (VGS - VTH)^2`.”

Key ideas:

- `gm` (transconductance) is:

  `gm = ΔID / ΔVGS` (A/V)

- In the square-law region of a MOSFET, a common approximation is:

  `ID ≈ k * (VGS - VTH)^2` (for `VDS` high enough)

  which implies approximately:

  `gm ≈ 2 * k * (VGS - VTH) ≈ 2 * ID / (VGS - VTH)`

- For a common-source amplifier with a drain resistor `RD`, the small-signal gain magnitude is roughly:

  `|Av| ≈ gm * RD`

  and the sign is negative (output inverted):

  `Av ≈ -gm * RD`

(See “Major things to double-check” below about the `/ RD` vs `* RD` detail.)

---

## Source followers and common source amps

- Source followers and common-source amps follow the same logic as emitter-followers and common-emitter amps, just with FETs instead of BJTs.

Source follower (e.g. JFET source follower):

- Very high input impedance.
- Low output impedance.
- Voltage gain slightly less than 1.
- For a JFET source follower, you can:
  - Run it at roughly `IDSS` so `VGS` is close to 0 (gate near source potential).
  - Use a big gate resistor to limit input current even more.
  - Choose a drain resistor so there is sufficient drain voltage for `IDSS` to occur.
  - You can add a source resistor to run at less than `IDSS`, but that will reduce your gain slightly (still close to 1).

Common source:

- FET analogue of the common-emitter amplifier.
- Provides voltage gain with 180° phase inversion.
- Gain set by `gm` and the drain/load resistance as above.

---

## Series feedback pair

Series feedback pair:

- Combines the benefits of JFETs and BJTs.
- Almost no input current required (thanks to the JFET).
- Very high gain (thanks to the BJT).
- The FET front end gives high input impedance and low noise.
- The BJT provides large current gain and transconductance.

---

## JFET + op-amp idea (transresistance front end)

Using a JFET amplifier with an op-amp instead:

- Q1 is a low-noise JFET (for example 2SK170B / LSK170B).
- The datasheet says: at `IDSS` (drain current with gate at 0 V) the typical transconductance is about `gm ≈ 25 mS`.
- `gm = ΔID / ΔVGS` in A/V, so `25 mS = 0.025 A/V`:
  - A 1 mV change on the gate changes drain current by about 25 µA around that operating point.

“IDSS varies 2:1”:

- The part might be specified as something like `IDSS = 6 mA to 12 mA`.
- That is a 2:1 spread: worst-case max is twice the min.
- Different samples of the same JFET can naturally sit anywhere between 6 and 12 mA with gate at 0 V.

Because of that spread:

- They choose `RD = 1 kΩ` small enough so that even at the worst-case highest `IDSS`, the drain voltage does not get pulled down into saturation.
- The exact DC drain voltage is not very important, since the second stage is AC-coupled via `C1`.

At signal frequencies:

- The JFET drain sees the op-amp’s inverting input with `R1 = 100 kΩ` in the feedback path.
- The op-amp is in current-to-voltage (transresistance) mode:

  - JFET drain current → op-amp input → op-amp output voltage across `R1`.

Open-loop gain from gate voltage to op-amp output:

- Roughly:

  `G_OL ≈ gm * R1 ≈ 25 mS * 100 kΩ ≈ 2500`

Then they add `Rf = 499 Ω` and `Rg = 10 Ω` as a standard non-inverting feedback divider on the op-amp output:

- Closed-loop gain:

  `G_CL = 1 + Rf / Rg ≈ 1 + 499 / 10 ≈ 50`

- Loop gain:

  `Loop gain ≈ G_OL / G_CL ≈ 2500 / 50 ≈ 50`

  → Good linearity and accurate overall gain.

Why `Rg` is small (10 Ω):

- It has to be less than `1 / gm` so it does not significantly reduce `G_OL`:

  `Rg << 1 / gm ≈ 40 Ω`

- Its thermal noise must stay below the JFET’s own ~`1 nV/√Hz`, which also pushes `Rg` to be below roughly a few tens of ohms.
- So 10 Ω is a safe choice; it only trims open-loop gain by around 20% and adds around 8% noise.

The op-amp:

- A very fast, high-current op-amp can:
  - Keep the gain set to about 50 flat out to ~20 MHz.
  - Swing about ±10 V.
  - Deliver up to around 100 mA.

Compared to “JFET source follower → separate voltage amp”:

- This scheme keeps the JFET’s huge input impedance.
- Because it uses the JFET as a low-noise current source into an op-amp, it achieves:
  - Better linearity.
  - Lower overall noise.
  - More controlled gain through feedback.

