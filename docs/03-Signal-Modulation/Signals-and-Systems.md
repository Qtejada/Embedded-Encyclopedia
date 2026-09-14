---
title: Continuous Signals and Systems
sidebar_position: 1
---

import LearningEquation from '@site/src/components/LearningEquation';
import ConvolutionExplorer from '@site/src/components/learning/ConvolutionExplorer';

# Continuous Signals and Systems

## 1. Purpose and system properties

A **signal** describes how a quantity changes with a variable such as time. A continuous-time signal has a value at every instant in the time range being considered.

A **system** maps an input signal to an output signal. A circuit can also store energy that affects its output.

Use separate tests for each system property.

| Property | Test | Example |
| --- | --- | --- |
| Linear | Scaling and addition of inputs produce the same scaling and addition of outputs. | A fixed ideal resistor obeys a linear voltage-current relation. |
| Time invariant | A delay of the input produces the same delay of the output. | A resistor with constant resistance has no explicit time dependence. |
| Causal | The output does not require future input values. | A physical real-time filter uses present and past inputs. |
| Memoryless | The present input alone determines the present output. | An ideal resistor has no stored state. |
| Stable | Every bounded input produces a bounded output. | A resistor-capacitor low-pass network with positive resistance and capacitance meets this condition. |

Test linearity with the initial stored state set to zero. Otherwise, something such as an already charged capacitor can add its own output, which does not scale when you scale the input.

An ideal integrator is linear, depends only on present and past inputs (causal), and remembers its input history. A constant nonzero input makes its output ramp without limit, so it fails the bounded-output stability test.

## 2. Impulse response and convolution

A **unit impulse** has unit area and zero duration in the ideal mathematical model. It is not a finite voltage pulse.

The **impulse response**, h(t), is the output of a system at initial rest when its input is a unit impulse.

For a **linear time-invariant (LTI)** system, you can think of the input as many impulses, each scaled and placed at a different time. Add the correspondingly scaled and shifted impulse responses to get the output.

<LearningEquation tex={String.raw`y_{zs}(t)=\int_{-\infty}^{\infty}x(\lambda)h(t-\lambda)\,d\lambda`} />

This integral is **convolution**. The subscript zs means zero-state: there is no stored energy at the start. Lambda is the variable used while adding up contributions inside the integral; t is the time at which you want the output.

For a causal system and an input that starts at zero, the limits reduce to zero and t.

### Graphical procedure

1. Reverse h(lambda) to obtain h(-lambda).
2. Shift the reversed function by t to obtain h(t-lambda).
3. Multiply it by x(lambda).
4. Integrate the product over their overlap.
5. Repeat for other values of t.

Each shift gives one output value after integration. Convolution is not simply multiplying the original signals at matching times: one response is reversed and shifted before the multiplication and integration.

### Worked example: two rectangular pulses

<ConvolutionExplorer />

Assume two unit-height pulses. Each pulse is nonzero from 0 to T, where T is positive.

Their convolution equals the overlap duration.

<LearningEquation tex={String.raw`y(t)=\begin{cases}0 & t<0\\t & 0\le t<T\\2T-t & T\le t\le2T\\0 & t>2T\end{cases}`} />

At t = 0, the overlap has zero duration. At t = T, the pulses overlap for T seconds. At t = 2T, overlap ends.

The result is triangular. Its peak equals T because the integral includes time. Signal units and impulse-response units determine the physical output units.

Compare this integral with the [discrete convolution sum](<./Filters/Digital-filters.md#convolution>) when samples replace continuous signals.

## 3. Initial conditions and total response

The **zero-input response** comes from the initial state with the external input set to zero. A charged capacitor can produce this response.

The **zero-state response** comes from the external input with all initial state variables set to zero.

For a linear system, the total response is their sum.

<LearningEquation tex={String.raw`y(t)=y_{zi}(t)+y_{zs}(t)`} />

Do not assume that convolution includes energy stored before the start time. Add the zero-input response when the initial state is nonzero.

### Worked example: a capacitor with an initial voltage

Assume an ideal series resistor-capacitor network. The output is the capacitor voltage. At t = 0, the source changes to a constant voltage V.

Let R = 10 kilohms, C = 100 nanofarads, V = 3 volts, and the initial capacitor voltage V0 = 1 volt.

The time constant is RC = 1 millisecond. For t greater than or equal to zero:

<LearningEquation tex={String.raw`v_C(t)=\underbrace{V_0e^{-t/(RC)}}_{\text{zero input}}+\underbrace{V(1-e^{-t/(RC)})}_{\text{zero state}}`} />

At one time constant, the zero-input part is about 0.368 volts. The zero-state part is about 1.896 volts.

The total is about 2.264 volts. At t = 0, the equation gives 1 volt. At long times, it approaches 3 volts.

These endpoint checks detect an incorrect sign or an omitted initial condition.

## 4. Differential equations and natural modes

A linear circuit with constant component values often gives a differential equation with constant coefficients.

Setting the input to zero gives the **homogeneous equation**. Its characteristic roots tell you the forms the circuit's own response can take, such as decaying exponentials or oscillations.

| Characteristic root | Response form |
| --- | --- |
| Distinct real root p | A term proportional to exp(pt). |
| Repeated root p of multiplicity two | A combination of exp(pt) and t exp(pt). |
| Complex pair a plus or minus jb | A damped or growing sinusoid with envelope exp(at). |

Initial conditions determine the constants. Negative real parts produce decaying modes. Positive real parts produce growing modes.

### Worked example: two natural modes

Assume y'' + 3y' + 2y = 0, y(0) = 0, and y'(0) = -5. Time is in seconds.

The characteristic polynomial factors as (s + 1)(s + 2). The roots are -1 and -2.

<LearningEquation tex={String.raw`y(t)=C_1e^{-t}+C_2e^{-2t}=5e^{-2t}-5e^{-t},\qquad t\ge0`} />

The initial value gives C1 + C2 = 0. The initial derivative gives -C1 - 2C2 = -5.

These equations give C1 = -5 and C2 = 5. Substitution verifies both initial conditions.

## 5. Laplace analysis

The **Laplace transform** replaces time derivatives with algebraic expressions. The complex variable s has real and imaginary parts.

For a problem with known starting conditions, use the unilateral Laplace transform. The convention here starts at 0 minus, just before t = 0, so it includes what happens at the starting instant.

<LearningEquation tex={String.raw`\mathcal{L}\{y'(t)\}=sY(s)-y(0^-),\qquad \mathcal{L}\{y''(t)\}=s^2Y(s)-sy(0^-)-y'(0^-)`} />

Keep the terms that describe the initial conditions. Replacing a derivative with just multiplication by s drops those terms and assumes the system started with no stored state.

### Transfer function

The **transfer function** is the output transform divided by the input transform under zero initial conditions.

For the resistor-capacitor example:

<LearningEquation tex={String.raw`RC\frac{dv_C}{dt}+v_C=v_{in},\qquad H(s)=\frac{1}{RCs+1}`} />

With a nonzero initial voltage, the complete output is:

<LearningEquation tex={String.raw`V_C(s)=\frac{V_{in}(s)}{RCs+1}+\frac{RCV_0}{RCs+1}`} />

The second term records stored energy. It does not change the zero-state transfer function.

### Partial fractions

Factor the denominator before inversion. For example:

<LearningEquation tex={String.raw`\frac{1}{(s+1)(s+2)}=\frac{1}{s+1}-\frac{1}{s+2}`} />

For a causal response, the inverse is exp(-t) minus exp(-2t), for t greater than or equal to zero.

A repeated pole needs more terms in the partial-fraction expansion, with higher powers in the denominator. For a pole of order two, the inverse transform includes a factor of time multiplying the exponential.

## 6. Convergence, causality, and stability

The **region of convergence (ROC)** is the set of s values for which the bilateral Laplace-transform integral approaches a finite result.

An algebraic transform without its ROC can represent different signals. For example, 1/(s + a) represents a right-sided or a left-sided exponential.

For a positive real a, exp(-at) times the unit step has ROC Re(s) greater than -a.

The left-sided signal -exp(-at) for negative t has the same algebraic transform. Its ROC is Re(s) less than -a.

For a causal system with a rational transform, the ROC lies to the right of the rightmost pole. A stable impulse response must also have a Fourier transform that converges.

For a causal system with a proper rational transfer function, a bounded input produces a bounded output only when all transfer-function poles have negative real parts. On the s-plane, that means they are strictly in the left half-plane.

A pole and zero that cancel exactly can hide a pattern of internal behavior, called a mode. A stable measured output does not necessarily mean every internal state is stable.

### Final-value check

When the theorem conditions hold, the final output equals the limit of sY(s) as s approaches zero.

For a rational Y(s), all poles of sY(s) must lie in the open left half-plane. Do not apply this test to sustained oscillations.

For the stable capacitor step response, the limit gives V. A numerical limit without the pole check can give a misleading answer.

## 7. Fourier analysis and transforms

A Fourier series builds a repeating signal from sinusoids at multiples of its fundamental frequency. These multiples are its harmonics. A Fourier transform also describes many signals that do not repeat.

Use one frequency convention consistently. Angular frequency omega has units of radians per second. Frequency f has units of hertz, with omega = 2 pi f.

For the angular-frequency convention:

<LearningEquation tex={String.raw`X(j\omega)=\int_{-\infty}^{\infty}x(t)e^{-j\omega t}\,dt,\qquad x(t)=\frac{1}{2\pi}\int_{-\infty}^{\infty}X(j\omega)e^{j\omega t}\,d\omega`} />

Convolution in time becomes multiplication in frequency. Delaying a signal changes the phase of its frequency components, but not their magnitudes.

For a real signal, positive and negative frequency components are complex conjugates: they have equal magnitudes and opposite phases. An ideal impulse has the same Fourier-transform value at every frequency.

Use the existing [digital frequency](<./Filters/Digital-filters.md#2-digital-frequency>) explanation when a sample rate converts physical frequency to radians per sample.

### Fourier series coefficients

For period T, the fundamental angular frequency is 2π/T. The complex Fourier series uses integer multiples of that frequency.

<LearningEquation tex={String.raw`x(t)=\sum_{k=-\infty}^{\infty}c_ke^{jk\omega_0t},\qquad c_k=\frac{1}{T}\int_{t_0}^{t_0+T}x(t)e^{-jk\omega_0t}\,dt`} />

The coefficient c0 is the average value. The integration interval can start anywhere if it covers one complete period.

An even real signal has cosine terms. An odd real signal has sine terms. A signal can contain both parts.

<LearningEquation tex={String.raw`x_e(t)=\frac{x(t)+x(-t)}{2},\qquad x_o(t)=\frac{x(t)-x(-t)}{2}`} />

At a sudden jump, the Fourier series approaches the midpoint between the values on either side, provided the signal meets the usual piecewise-smooth conditions. Adding more terms does not make the series choose one side of the jump.

### Signal energy and average power

Signal energy integrates squared magnitude over all time. Average power divides the accumulated squared magnitude by the observation duration, then takes its limit.

<LearningEquation tex={String.raw`E=\int_{-\infty}^{\infty}|x(t)|^2dt,\qquad P=\lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T}|x(t)|^2dt`} />

A nonzero finite-energy signal has zero average power under this definition. A nonzero periodic signal with finite average power has infinite total energy.

Some mathematical signals have neither finite total energy nor finite average power. Also, the signal-energy calculation is not automatically an electrical energy in joules: you need the circuit impedance to make that conversion.

For a finite-energy signal, Parseval's relation gives the same energy in either domain.

<LearningEquation tex={String.raw`E=\frac{1}{2\pi}\int_{-\infty}^{\infty}|X(j\omega)|^2d\omega`} />

For a periodic signal, the corresponding relation is P = Σ|ck|². Sum over all integer harmonics.

For x(t) = 2 cos(ω0t), the coefficients at k = 1 and k = −1 both equal one. The average squared magnitude is two.

For a voltage across a resistor R, the average electrical power is 2/R watts in this example. This assumes the amplitude is measured in volts.

## 8. Analysis procedure

1. Identify the input, output, and stored state.
2. State the initial conditions and component assumptions.
3. Test whether an LTI model is appropriate.
4. Choose convolution, a differential equation, or a transform.
5. Keep initial-condition terms during transformation.
6. Check units, initial values, final values, and pole locations.
7. Compare the model with the physical operating limits.

## References

The junior notes supply the lesson topics and the two-mode initial-condition example. The other numerical examples are original examples.

* [MIT OpenCourseWare: continuous signals and systems](https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/pages/signals-systems/) gives lectures on convolution, transforms, initial conditions, and convergence.
* [MIT OpenCourseWare: Fourier transform properties](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-9-fourier-transform-properties/) covers symmetry and Parseval's relation.
