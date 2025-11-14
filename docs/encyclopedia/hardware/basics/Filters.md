# Passive filter

[TOC]

## First-order filters — RC and RL

### RC low-pass:
- Transfer Function: $H(j\omega) = \dfrac{1}{1 + j\omega R C}$,  
- $f_c = \dfrac{1}{2\pi R C}$, −3 dB at $f_c$,
- `Vout = 1/sqrt(1+(2 * pi * f * R * C)^2))`

### RC high-pass:
-  Transfer Function: $H(j\omega) = \dfrac{j\omega R C}{1 + j\omega R C}$,  
- $f_c = \dfrac{1}{2\pi R C}$ −3 dB at $f_c$,  
- `Vout = $(2\pi f R C)/\sqrt{1 + (2\pi f R C)^2}$  
- Breakpoint frequency: Where the filtering starts to happen: omega >> 1/RC  
- DC = 0Hz

### RL low-pass:
- Transfer Function: $H(j\omega) = \dfrac{R}{R + j\omega L}$,  
- $f_c = \dfrac{R}{2\pi L}$, −3 dB at $f_c$

### RL high-pass:
- Transfer Function: $H(j\omega) = \dfrac{j\omega L}{R + j\omega L}$,  
- $f_c  = \dfrac{R}{2\pi L}$.

## Notes
- Use a capacitor over an inductor because they’re cheaper, smaller.  
- RC filters have a high impedance, RL filters are better with high currents  
- The worst case output impedance of an RC circuit is just R.

---

