---
title: Continuous Signals and Systems
sidebar_position: 1
---

import LearningEquation from '@site/src/components/LearningEquation';
import ConvolutionExplorer from '@site/src/components/learning/ConvolutionExplorer';

# Continuous Signals and Systems

## 1. Purpose and system properties

A **signal** represents a quantity that changes with an independent variable. A continuous-time signal has a value at each time in its domain.

A **system** maps an input signal to an output signal. A circuit can also store energy that affects its output.

Use separate tests for each system property.

| Property | Test | Example |
| --- | --- | --- |
| Linear | Scaling and addition of inputs produce the same scaling and addition of outputs. | A fixed ideal resistor obeys a linear voltage-current relation. |
| Time invariant | A delay of the input produces the same delay of the output. | A resistor with constant resistance has no explicit time dependence. |
| Causal | The output does not require future input values. | A physical real-time filter uses present and past inputs. |
| Memoryless | The present input alone determines the present output. | An ideal resistor has no stored state. |
| Stable | Every bounded input produces a bounded output. | A resistor-capacitor low-pass network with positive resistance and capacitance meets this condition. |

The linearity test uses zero initial conditions. A fixed nonzero initial condition can add an output that does not scale with the input.

An integrator is linear and causal. It has memory. A constant nonzero input produces an unbounded ramp, so the ideal integrator fails the bounded-output test.

## 2. Impulse response and convolution

A **unit impulse** has unit area and zero duration in the ideal mathematical model. It is not a finite voltage pulse.

The **impulse response**, h(t), is the output of a system at initial rest when its input is a unit impulse.

For a **linear time-invariant (LTI)** system, scaled and shifted impulses form the input. Their scaled and shifted responses form the output.

<LearningEquation tex={String.raw`y_{zs}(t)=\int_{-\infty}^{\infty}x(\lambda)h(t-\lambda)\,d\lambda`} />

This integral is **convolution**. The subscript zs identifies the zero-state response. The variable lambda is an integration variable, not the output time.

For a causal system and an input that starts at zero, the limits reduce to zero and t.

### Graphical procedure

1. Reverse h(lambda) to obtain h(-lambda).
2. Shift the reversed function by t to obtain h(t-lambda).
3. Multiply it by x(lambda).
4. Integrate the product over their overlap.
5. Repeat for other values of t.

The integration gives one output value for each shift. It does not multiply two signals at the same time coordinate without reversal.

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

At one time constant, the zero-input part is approximately 0.368 volts. The zero-state part is approximately 1.896 volts.

The total is approximately 2.264 volts. At t = 0, the equation gives 1 volt. At long times, it approaches 3 volts.

These endpoint checks detect an incorrect sign or an omitted initial condition.

## 4. Differential equations and natural modes

A linear circuit with constant component values often gives a differential equation with constant coefficients.

Set the input to zero to obtain the **homogeneous equation**. Its characteristic roots determine the natural response forms.

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

Use the unilateral transform for initial-value problems. The convention here includes behavior at the start time from 0 minus.

<LearningEquation tex={String.raw`\mathcal{L}\{y'(t)\}=sY(s)-y(0^-),\qquad \mathcal{L}\{y''(t)\}=s^2Y(s)-sy(0^-)-y'(0^-)`} />

The initial-condition terms matter. Replacing each derivative with s alone silently assumes initial rest.

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

Repeated poles require additional terms with higher denominator powers. A pole of order two produces a time factor in the inverse.

## 6. Convergence, causality, and stability

The **region of convergence (ROC)** specifies which values of s make the bilateral transform integral converge.

An algebraic transform without its ROC can represent different signals. For example, 1/(s + a) represents a right-sided or a left-sided exponential.

For a positive real a, exp(-at) times the unit step has ROC Re(s) greater than -a.

The left-sided signal -exp(-at) for negative t has the same algebraic transform. Its ROC is Re(s) less than -a.

A causal rational system has its ROC to the right of its rightmost pole. A stable impulse response must have a convergent Fourier transform.

For a causal proper rational transfer function, bounded-input bounded-output stability requires all transfer-function poles in the open left half-plane.

An exact pole-zero cancellation can hide an internal mode. Input-output stability alone does not prove that every internal state is stable.

### Final-value check

When the theorem conditions hold, the final output equals the limit of sY(s) as s approaches zero.

For a rational Y(s), all poles of sY(s) must lie in the open left half-plane. Do not apply this test to sustained oscillations.

For the stable capacitor step response, the limit gives V. A numerical limit without the pole check can give a misleading answer.

## 7. Fourier analysis and transforms

A Fourier series represents a periodic signal with harmonics of its fundamental frequency. A Fourier transform also represents many nonperiodic signals.

Use one frequency convention consistently. Angular frequency omega has units of radians per second. Frequency f has units of hertz, with omega = 2 pi f.

For the angular-frequency convention:

<LearningEquation tex={String.raw`X(j\omega)=\int_{-\infty}^{\infty}x(t)e^{-j\omega t}\,dt,\qquad x(t)=\frac{1}{2\pi}\int_{-\infty}^{\infty}X(j\omega)e^{j\omega t}\,d\omega`} />

Time convolution becomes frequency multiplication. A time delay changes spectral phase and preserves spectral magnitude.

For a real signal, positive and negative frequency components have conjugate symmetry. An ideal impulse has a constant Fourier transform.

Use the existing [digital frequency](<./Filters/Digital-filters.md#2-digital-frequency>) explanation when a sample rate converts physical frequency to radians per sample.

### Fourier series coefficients

For period T, the fundamental angular frequency is 2π/T. The complex Fourier series uses integer multiples of that frequency.

<LearningEquation tex={String.raw`x(t)=\sum_{k=-\infty}^{\infty}c_ke^{jk\omega_0t},\qquad c_k=\frac{1}{T}\int_{t_0}^{t_0+T}x(t)e^{-jk\omega_0t}\,dt`} />

The coefficient c0 is the average value. The integration interval can start anywhere if it covers one complete period.

An even real signal has cosine terms. An odd real signal has sine terms. A signal can contain both parts.

<LearningEquation tex={String.raw`x_e(t)=\frac{x(t)+x(-t)}{2},\qquad x_o(t)=\frac{x(t)-x(-t)}{2}`} />

At a jump, a convergent Fourier series takes the midpoint of the two one-sided limits under the usual piecewise-smooth conditions.

### Signal energy and average power

Signal energy integrates squared magnitude over all time. Average power divides the accumulated squared magnitude by the observation duration, then takes its limit.

<LearningEquation tex={String.raw`E=\int_{-\infty}^{\infty}|x(t)|^2dt,\qquad P=\lim_{T\to\infty}\frac{1}{2T}\int_{-T}^{T}|x(t)|^2dt`} />

A nonzero finite-energy signal has zero average power under this definition. A nonzero periodic signal with finite average power has infinite total energy.

Some signals have neither finite energy nor finite average power. Signal energy also needs impedance information before it represents electrical energy in joules.

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

* [MIT OpenCourseWare: continuous signals and systems](https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/pages/signals-systems/) provides lectures on convolution, transforms, initial conditions, and convergence.
* [MIT OpenCourseWare: Fourier transform properties](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-9-fourier-transform-properties/) covers symmetry and Parseval's relation.
