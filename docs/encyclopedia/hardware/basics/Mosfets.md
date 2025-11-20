# FETs

[TOC]

---

## Basic MOSFET ideas

- The MOSFET gate ideally draws no DC current, so the input impedance is very high.
- There is a very small amount of current that flows and there are small gate capacitances IRL


VGS (Gate-Source Voltage): The "Valve." It controls how wide the channel opens.

VDS (Drain-Source Voltage): The "Pressure." It pushes current through the channel.

Vth  (Threshold / Pinch-off Voltage): The specific VGS where the channel shuts off completely.

IDSS (Saturation Current at VGS=0: The maximum current a JFET (or Depletion MOSFET) can pass when the gate is chemically "neutral" (0V).


N-channel enhancement-mode MOSFET Rules:

*Cutoff*
- If `VGS` < `VTH`, IDS = 0 because no conduction channel can form. The MOSFET is in cutoff


Ohmic (linear)
- If VGS > VTH and VDS < VGS, then the MOSFET will act like a resistor. As VDS increases, ID increases
- In this region it has a small on-resistance `RDS(on)`, whose value depends on the device and on `VGS`.
- What this means is that As VDS is < VGS, and VDS inreases, ID increases like if it were a resistor getting more voltage applied to it.

  
Active (saturation)
- If VGS > VTH and VDS >= VGS, then the MOSFET will act as a current source and current is steady.
- Amount of current is now determined by the amount of drive of the gate, as long as the above conditinos hold true. It increases quadratically with VGS.
- A Change in VDS, as long as it stays above VGS, does nothing to ID (Ideally. IRL there is channel length modulation, that will increase ID very slightly)



- Best way to think about it IM: VGS is like a tube, VDS is the pressure in that tube
- We need a certain tube size to even get any ID out, so VGS > VTH.

- When we have a VDS (pressure) < VGS (tube size), then as VDS (tube size) increases, we can increase either VDS or VGS to get more ID. As long as the original conditions stay true, either will increase ID using this formula: ID = 1/R_on * VDS

- When we have a VDS (Pressure) > VGS (tube size), we have the maximum amount of ID that can flow through that tube. Only way we can get more is if we increase our tube size. We are saturated (active) ID = k(VGS - Vth)^2


 



Depletion-mode MOSFETs:

- A depletion-mode N-MOSFET starts off **conducting at `VGS = 0`**.
- It has a negative threshold voltage (`VTH` is negative).
- You need a **negative bias** on `VG` to stop current flow.
- Maximum current flows when `VGS = 0 V`.



PFETs:

- PFETs usually have poorer performance than NFETs:
  - Higher `VTH`
  - Higher `RDS(on)`
  - Lower saturation current

---



## JFETs, enhancement and depletion

JFETs:

- JFETs act almost like the “reverse” of enhancement MOSFET in terms of default state.
- The gate is a diode junction to the channel, so **forward biasing it would cause conduction into the gate and can damage it**.


- At `VGS = 0 V`, with no bias at the gate, **maximum current flows** (`ID ≈ IDSS`).
- As you apply a more negative gate voltage compared to the source (`VGS` becomes more negative), less current flows.
- JFETs are essentially **on by default** and you pinch them off by making `VGS` negative.


*Cutoff*
- If `VGS` < `VTH`, IDS = 0 because no conduction channel can form. The MOSFET is in cutoff


Ohmic
- If VGS > VTH and VDS < VGS-VTH, then the MOSFET will act like a resistor. As VDS increases, ID increases
- In this region it has a small on-resistance `RDS(on)`, whose value depends on the device and on `VGS`.


  
Active
- If VGS > VTH and VDS >= VGS-VTH, then the MOSFET will act as a current source and current is steady.
- Amount of current is determined by the drive of the gate


IDSS is the maximum current the MOSFET will pull and will occur when you are in saturation and VGS = 0v



Depletion-mode MOSFET vs JFET:

- They both behave similarly:
  - They conduct at `VGS = 0`.
  - Making `VGS` more negative reduces current.
- The main difference: with a JFET you generally **do not go positive on the gate**  while a depletion-mode MOSFET has an insulated gate and can have `VGS > 0` safely (within its abs max ratings).
- JFETs are used most commonly for low noise applications

---

## Which terminal is source vs drain

MOSFETs structure is symmetric, so the “source” and “drain” swap roles depending on voltages.

-  the **source** is the terminal at the lower voltage (for an N-channel device).
-  Between the drain and the source, whichever has the lower voltage is  the source at that moment. So  `VD > VS` for an N-channel device when we call the top terminal the drain.


## Example: N-MOSFET switching a line to ground

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

- You want the switch to be in the ohmic region (VGS > VDS)  because that will give you the best switch action
- The MOSFET when in ohmic, has a Ron of say 0.1 ohms, very small. Why? Your tube is huge, your pressure is small. little resistance. Voltage at the source is = VD*(RL/Ron*RL)
- When your MOSFET is in Active moed (saturation) then your pressure is high, but your tube is small, high resistance. Maybe the tube only allows 1A. So Ron would be VD/1A which is way higher. 
---



## As Transconductance devices

- gm = ID/VGS
- MOSFETS act like pretty good transconductnace, particularly in saturation. When VDS is high (VDS > VGS) Then ID is determined by VGS. A change in VGS keeps ID constant
- In the Ohmic Region, it gets a little funky and ID is somewhat proportional to VDS but VGS will also effect it. Its more like a resistor
- In saturation, you get your amplifier model, in the ohmic you get your switch model.

- Gain = -gm*RD
## Device variation and precision

- `VGS` for a MOSFET can vary a lot between parts, sometimes by up to a few volts in `VGS(th)` and in the `ID` vs. `VGS` curves.
- Because of this, MOSFETs are **not great for targeting a precise `ID`** just by setting `VGS` to some value.
- The usual use is more like “turn it on hard” (for switching) or use it inside an IC where the manufacturer trims and controls things.

Comparison to BJTs:

- BJTs have some variation in `VBE`, but the spread needed for a given `IC` is often smaller and more predictable than MOSFET `VGS` spreads.
- For high-precision current drawing or mirrors, BJTs are often preferred.
- MOSFETs have too much spread for accurate discrete current setting purely from gate voltage.

---

## FET uses

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

## JFET Uses

- JFETs are used for linear circuits like current sources, followers, amplifiers, current sinks
- They are very low noise, so they will appear in low-noise front-ends





Current Sink application: using a JFET as a current sink under an emitter follower

- Say you have an emitter follower where you want to draw some fixed current `X` from the emitter.
- You could use a resistor to the negative rail, but that:
  - Requires more power dissipation.
  - Reduces your input impedance.



## Current sinks 

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
- A **BJT current mirror** for better matching and multiple outputs.



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

cascode current sink

Uses a second bjt/jfet in a current sink to keep drain-source voltage constant
- First JFET is a regular current sink
- Second JFET is one with a higher IDSS and passes Q1s drain current through the load while holding Q1s drain at a constant voltage which is Vgs of what makes Q2 pull the same current as Q1
- Q1 then wont see any variations of drain source voltage, output current wont change

General Cascodes

- Kind of like a shield, that prevents variations of the input from messing with the output. Helps with Miller effect and Early effect.

Miller Effect
- Speed killer. When your input-to-output varies wildly at very fast rates, the capacitances between terminal start to fight each other and voltage leaks into the input capacitor, causing distortion to your input. This limits the bandwidth you can operate at

- Early Effect
- As your input changes, the output wobbles just a little bit, killing your precision.
-JFET Common Source Circuits


Common Source circuits
- Very similar to BJT emitter follower circuits, just much less gain, much more input impedance.
- Remember that RS there as a self biasing mechanism. Stops JFET from pulling maximum IDSS by providing a voltage on the source, therefore VGS != 0.
- Bypass capacitors work in the same way. WIll increase gain, while making it so you're not stuck with IDSS current
- Having a negative supply is awesome, because you no longer have to assume how much current the FET will pull. Can use node voltage with RS to see what ID is, You dont have to know what VGS gives you an ID.
