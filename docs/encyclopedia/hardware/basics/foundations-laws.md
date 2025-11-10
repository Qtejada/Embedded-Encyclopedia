# Foundations & Laws

[TOC]

## Voltage (V)
- Definition: Difference in potential. The force that moves charges
- Sign & direction: A positive Vab means point a is at higher potential than b.

## Current (I)
- Definition: Rate of flow of charge: I = dQ/dt.
- Conventional direction: Current flows from a higher potential to a lower potential, Can be seen in the other direction (Electron flow) Stick with one and keep it pushing.

## Conductance (G)
- Inverse of resistance: G = 1/R. Measured in Siemens.

## Phase:
- A time delay. 90 degrees out of phase means while one cycle is rising, the other is falling

## KCL — Kirchhoff's Current Law
- The sum of currents at a node is zero because of charge conservation

## KVL — Kirchhoff's Voltage Law
- The sum of voltage drops around any closed loop is zero in DC circuits

## Frequency Response
-  How something reacts with a change in frequency

## Transfer Functions (H(s))
- Definition: the ratio of outputs to inputs in the frequency domain
-  H(s) = Output(s) / Input(s).
- Used to describe relationships like gain, phase, poles/zeros, frequency response via H(jω).

## Thevenin & Norton Equivalents
- Thevenin form : Any network of voltage sources and resistances can be simplified to RTH and VTH and act as the same circuit
- VtTH Is found by removing the load you want to measure in that network, and finding the open circuit voltage at that point
- RTH is found by removing all voltage sources (as long as they’re independent) and finding the circuit resistance.
- Norton form — ideal current source in parallel with resistance.
- In: short-circuit current at the port (terminals shorted together).
- Rn = Rth (same resistance as Thevenin).
- Max power transfer: For purely resistive DC, choose Rload = Rth. For AC, match complex conjugate: Zload = Zth*.
- Relationship between Source voltage and source resistance: You want your source resistance to be low because less power is dissipated from nothing happening and more current can be drawn from the system.
- If there was a large internal resistance, then there would be a large voltage drop across is, leading to less voltage being able to be used by the load. Lower resistance also means more source current,
- You want your load resistance to be way higher than your source resistance because you don't want to draw a crazy amount of current by accident and lose voltage to the source resistance. 

## AC quantities — RMS and power
- RMS definition: Vrms is the square root of the time average of v(t)^2 over one period. Same for Irms. Used for average power.
- Sine Wave: Vrms = Vpeak / sqrt(2) = 0.707 Vpeak. With peak-to-peak, Vrms = Vpp / (2 sqrt(2)).
- Average power in AC: Pavg = Vrms * Irms * cos(phi). For a purely resistive load, cos(phi) = 1 so P = Vrms^2 / R = Irms^2 * R.
- Apparent power: S = Vrms * Irms . 
- Power factor:  PF = cos(phi) = P / S.

## Decibels (dB) 
- Used to give you a way of comparing 2 signals, especially if the magnitudes are very different
- Power ratio: dB = 10 * log10(P2 / P1).
- Amplitude ratio: dB = 20 * log10(A2 / A1). 
- Exmps: +3 dB ≈ 2x power       +6 dB ≈ 2x amplitude
-    −3 dB ≈ 1/2 power     +20 dB ≈ 10x amplitude.

## Signals
- The reason Sinusoids are used is because they are what comes out of the wall AND they are the answer to linear circuits. A linear circuit with a sinusoidal input will have a sinusoidal output. Not true for other types of signals
- V = Asin(2pi*f*t)

## Noise
- Random electrical fluctuation from several mechanisms. 
- Main types: thermal (Johnson), shot, and 1/f (flicker). We describe them with spectral density (V/sqrt(Hz) or A/sqrt(Hz)).

## Parasitics

- All conductors have an inductance, including Caps, resistors, PCB traces, inductors, etc.
- Change in current induces a voltage on that conductor (and nearby ones) that opposes that current (Inductive Reactance, form of impedance)
- A parasitic inductance on a capacitor will reduce the reactance of an inductor and vice versa: $Z - j(-1/wC + wLparasitic)$
- This kind of issue will blow up as you get to higher frequencies. Inductors act like caps, caps act like inductors
- ESR also varies by frequency caused by the skin effect.
- Parasitic inductance is caused by conductors in close proximity accidentally acting as 2 plates (PCB tracks) causing issues with signal integrity oscillations and self resonance
