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

## Practical notes
- Place protection **as the first component** from the connector.
- **Short loop**: connector pin → protection device → ground via.
- Consider a **small series resistor or ferrite** to help the clamp (but check signal integrity on fast lines).

