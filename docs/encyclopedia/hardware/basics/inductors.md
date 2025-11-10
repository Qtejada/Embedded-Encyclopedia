# Inductors

[TOC]

## Ideal model & basics
- Voltage–current: $v(t) = L \cdot \dfrac{di}{dt}$
- Energy stored: $E = \tfrac{1}{2} \cdot L \cdot I^{2}$
- Impedance: $Z_L(j\omega) = j\omega L$ (current lags voltage by 90°).
- DC: behaves like a short (limited by DCR).
- High-fewquency: impedance grows with f (until SRF from self-C).

## Energy storage & flyback behavior
Current in an inductor cannot change instantaneously. If the drive is removed, the inductor will generate whatever voltage is needed (within parasitics) to keep current flowing → use a flyback path (diode/Clamp) to avoid large overvoltage.

## Core types & gapping (what to use where)
- Ferrite: Typically a ferrite drum core is going to have higher permeability (fewer turns to get the desired inductance), higher self-resonant frequency, and lower core losses at combos of high current ripple at high switching frequencies, but it exhibits a very steep roll-off of inductance as it reaches its saturation current
- Powdered iron / sendust / MPP: Powder cores have a much softer/slower decrease of inductance at saturation, will have higher core losses, lower permeability, and in the case of Coilcraft's offerings you get lower DC losses
- So for a switching power supply, if you're running in discontinuous current operation with a high current ripple, a ferrite drum might be better. and if you have a low current ripple with continuous-current operation (there's a large DC component to the inductor current wave form) it might be better to use a powder core

## Non-idealities to watch
- Self-capacitance/SRF: above SRF, behavior departs from ideal; avoid operating near SRF.

## Applications: switch-mode power (buck overview)
