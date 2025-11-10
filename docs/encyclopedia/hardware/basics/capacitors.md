
# Capacitors

[TOC]

## Core relations
- Charge: $Q = C \cdot V$
- Current–voltage relationship: $i(t) = C \cdot \dfrac{dv}{dt}$
- Voltage: VF = VCurrent(1-etime/RC) for RC circuits
- Energy stored: $E = \tfrac{1}{2} \cdot C \cdot V^{2}$
- Roughly a frequency dependent resistor in many cases

## Physics
Charge builds up on the plates, E-field is created. Cap will charge to source voltage. Once fully charged, or no difference in potential from source, current stops flowing.

## How they look vs. frequency
- Impedance: $Z = \dfrac{1}{j \omega C}$
- Magnitude of impedance: $\lvert Z_C \rvert = \dfrac{1}{2\pi f C}$; current leads voltage by 90°.
- Acts like an open circuit in DC after charging. Acts like a wire in AC
- parasitic ESL makes it look inductive; it stops being a good short.

## Uses
- AC coupling (blocking cap): series capacitor between stages to pass AC while shifting/isolating DC bias.
- Bypass/decoupling: Block AC ripple/noise to ground at IC supply pins.
  - Place small ceramics at the pin; add nearby bulk; minimize loop area
- Bulk capacitors are used in cases where current draw suddenly exceeds supply, can be provided by the capacitor like an energy box.

## Power and loss
Energy is stored in its electric field, so ideally no power loss. In a real world application there is some power from the ESR and dielectric loss

## Dielectric types
- Ceramic  
  - C0G/ NPO: The all-rounder. Good for almost everything. Not good in terms of sizes. Hard to find small sizes for it. Not noisy. Pick for filters, oscillators, temperature stability. 
  - (X7R, X5R, Y5V): Good for decoupling. High capacitance in a small form factor. Good for mass usage like this. Do not use for high precision stuff
- Film  
  - Film is best for high voltage, high current, high frequency, high stability like in audio, inductive flyback protection, audio circuitry. Very low ESR
  - PP (low loss, linear), PET (general-purpose), PPS/PEN (stable SMD options): come in more ranges.
- Electrolytic: Come in higher capacitances, good for energy storage and filtering

## RC time constants
- Time constant: $\tau = R \cdot C$. Time it takes to charge or discharge a RC circuit
- Charge (step from $0 \to V_S$): $v_C(t) = V_S \cdot (1 - e^{-t/\tau})$.
  - Cap charges to 63% at $1\tau$, 86% at $2\tau$, 95% at $3\tau$, 99.3% at $5\tau$
- Discharge (from $V_0$): $v_C(t) = V_0 \cdot e^{-t/\tau}$.

## Differentiators & integrators

Differentiator (RC high-pass)

 Vin o───|| C───o─── Vout
                  |
                 [R]
                  |
                 GND

- At high frequencies, Reactance is low, Capacitor acts more like a wire, and at low frequencies, the capacitor is acting more like an open, blocking DC.
- As the frequency of the input increases, the output looks more and more like the input. Basically like a high pass filter
- The voltage of the resistor is dependent on the current released by the capacitor. The current released by the capacitor is determined by $I_C = C \cdot \frac{dV}{dt}$, so $V_{out} =  R \cdot C \cdot \frac{dV_{in}}{dt}$, which means the output voltage is the derivative of the input.
- Example use case would be a rising edge detector. Given the input of a long ass square wave, the output would be a short pulse. Basically tells you when a rising edge has occurred and omitting the input signal in general

Integrator (RC low-pass)

 Vin o───[R]───o─── Vout
                 |
                || C
                 |
                GND

  
- Integrator acts similarly. Acts as a low pass filter for a sinewave
- Acts as an integrator for other waves
- $I_C = C \cdot \dfrac{dV}{dt} \rightarrow V_{OUT} = \int I_C \, dt \times \dfrac{1}{C}$. $I_C = I_R = \dfrac{V_{IN}}{R} \rightarrow \dfrac{1}{RC}$ times the integral of $V_{IN}$ is your output.

## Practical details
- ESR (causes ripple loss and heat; shapes impedance minimum) and ESL (sets SRF).
- Keep high-ripple paths short; verify ripple current rating and temperature rise.
- SRF is self resonant frequency. Frequency at which inductor and capacitor reactance are the same, causing inductors and caps to act more like resistors/maximum impedance

