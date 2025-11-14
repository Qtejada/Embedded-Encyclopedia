# Diodes

[TOC]

## What they are
- Diodes are **non-linear** devices. They conduct once a forward threshold is reached (≈0.7 V for silicon; material dependent) and block the other direction.
- **PIV** (Peak Inverse Voltage): the **maximum reverse voltage rating** before reverse **breakdown**. 

## Rectification
- Diodes can be used for **half-wave** and **full-wave** rectifiers.
- **Filter capacitors** across the load reduce ripple after rectification.
- **Voltage ripple** is the left over variation left after—output isn’t perfectly DC.
- Large bulk caps can cause **high diode peak/charging currents**. For cleaner, more stable DC, a **linear regulator/LDO** (or a switching regulator for efficiency) after the rectifier is usually better than “just a big cap.”

## Schottky diodes
- **Schottky diodes**: very low forward drop and fast switching—good for high-frequency work. Typical trade-offs are **higher leakage** and **lower PIV** than silicon PN diodes.

## Clamping (simple protection)
- Diodes can act as **clamps**. Taking the output across a diode can limit a node to roughly the **forward voltage above** the reference rail (e.g., clamp to ground or clamp to VCC).

## ESD use (regular diodes)
- You can protect slow control lines with **steering diodes** to the rails: one diode to **GND**, one to **VCC**. A surge is shunted into the rails instead of into the IC.
- This assumes your rails + decoupling can absorb the hit. Keep the **traces short** and the return to ground tight. Not ideal for high-speed signals (adds capacitance and injects into the rails).

## TVS diodes (purpose-built surge/ESD protection)
- **TVS (Transient Voltage Suppressor) diodes** look like Zeners but are built to **turn on fast** and **absorb high-energy, short events** (ESD, EFT, surge).
- Available as **unidirectional** (for DC lines referenced to ground) and **bidirectional** (for AC/differential lines).
- For high-speed interfaces, use **low-capacitance TVS arrays** sized for the standard (USB, HDMI, Ethernet, etc.). Place them **at the connector** with a **short path to ground** (single via right at the pad), and keep stubs tiny.

# RC Snubbers & RCD Clamps

[TOC]

## What a snubber does
Switching edges plus stray inductance and capacitance form a resonant LC that rings and overshoots. An **RC snubber** damps that LC and reduces dV/dt so the switch and nearby circuits see less stress and EMI.

## Where to place an RC snubber
- **Across the switch (series RC across the device):** best for hard-switched nodes (MOSFET D–S, BJT C–E, triac/relay). It absorbs the fastest edge at the source.
- **Across the inductive load (series RC across the coil/winding):** damps the load’s own resonance so current/voltage settle faster and reflect less to the switch.

## Measurement-based sizing (bench method)
1) **Measure ringing frequency** ($f_r$) on the switch/load node after a step.  
   Approximate parasitics: $L \cdot C \approx \dfrac{1}{(2\pi f_r)^2}$.

2) **Pick the capacitor:** $C_{\mathrm{snub}} \approx 2\!-\!5 \times C_{\mathrm{parasitic}}$.  
   Larger $C_{\mathrm{snub}}$ → stronger damping but more loss.

3) **Pick the resistor:** $R_{\mathrm{snub}} \approx \sqrt{\dfrac{L}{C_{\mathrm{snub}}}}$ for ~critical damping.  
   Then **trim on the bench** while watching peak overshoot and the number of ringing cycles.

**Power check (across-switch type):**  
Average dissipation $\approx P \approx C_{\mathrm{snub}} \cdot V^{2} \cdot f_{\mathrm{sw}}$. Don’t oversize $C_{\mathrm{snub}}$ without reason.

## Practical rules of thumb
- Place the snubber **at** the node you’re damping; keep the loop **short** with a solid return.
- Use a **film** or suitable **ceramic** cap rated for the spike; pick a resistor with pulsed and average power margin.
- More **C** lowers peak but raises loss; **R** sets damping (too small → heat; too large → weak damping).

## Triacs/thyristors
- Use an **R–C** across the device to **limit dV/dt** below the datasheet spec and to tame commutation ringing.
- Keep leads short; device dV/dt and commutation specs drive the actual R and C.

---

## RCD clamps (flyback/transformer primary)
An **RCD clamp** limits the **peak** voltage on a switch node and bleeds excess energy into a resistor. Common on flyback/forward primaries.

**How it works (concept):**
- A **diode** routes energy into a **clamp capacitor** only when the switch node exceeds the clamp level.
- A **resistor** drains the capacitor between events, turning that energy into heat.
- You set the **clamp voltage** via the diode path and capacitor value, and set the **bleed rate** and average dissipation with the resistor.

**Sizing guidance:**
- Size for worst-case **leakage** and any **magnetizing** energy that doesn’t transfer.
- Ensure the resistor can handle the **average** power and the capacitor the **pulse** stress.
- Place the clamp close to the switch node with a **short, tight return**.




## Practical notes
- Place protection **as the first component** from the connector.
- **Short loop**: connector pin → protection device → ground via.
- Consider a **small series resistor or ferrite** to help the clamp (but check signal integrity on fast lines).

