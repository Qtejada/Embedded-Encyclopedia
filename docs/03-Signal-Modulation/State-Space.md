---
title: State-Space Models
sidebar_position: 2
---

import LearningEquation from '@site/src/components/LearningEquation';

# State-Space Models

## 1. State, input, and output

A **state** describes the stored information needed to predict a system's future behavior from its future input. A state vector collects the state variables.

In circuits, independent capacitor voltages and inductor currents are useful state choices. Circuit constraints can make some storage variables dependent.

The **input** is an external excitation. The **output** is the quantity of interest. An output need not include every state variable.

A state-space model gives first-order differential equations for the states. It can retain internal behavior that a simplified [transfer function](<./Signals-and-Systems.md#transfer-function>) hides.

## 2. Linear model and matrix dimensions

For a continuous-time linear time-invariant system:

<LearningEquation tex={String.raw`\dot{\mathbf{x}}=A\mathbf{x}+B\mathbf{u},\qquad \mathbf{y}=C\mathbf{x}+D\mathbf{u}`} />

| Symbol | Meaning | Dimensions for n states, m inputs, and p outputs |
| --- | --- | --- |
| A | State evolution | n by n |
| B | Input effects on state derivatives | n by m |
| C | State contributions to outputs | p by n |
| D | Direct input contributions to outputs | p by m |

The dot means differentiation with respect to time. A nonzero D gives a direct input-to-output path without a state integration.

Matrix coefficients can have different physical units. Check each row against the units of its state derivative.

### Convert a differential equation

Consider y'' + 3y' + 2y = u. Choose x1 = y and x2 = y'.

The first equation is x1' = x2. The second is x2' = -2x1 - 3x2 + u.

<LearningEquation tex={String.raw`A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix},\quad B=\begin{bmatrix}0\\1\end{bmatrix},\quad C=\begin{bmatrix}1&0\end{bmatrix},\quad D=0`} />

This choice stores the output and its first derivative. Other invertible state-coordinate choices can describe the same input-output behavior.

## 3. Circuit example

Assume an ideal voltage source drives a series resistor, inductor, and capacitor. Measure the voltage across the capacitor.

Choose x1 as the inductor current and x2 as the capacitor voltage. Current flows into the capacitor's positive terminal.

Kirchhoff's voltage law gives L x1' = u - R x1 - x2. The capacitor relation gives C x2' = x1.

<LearningEquation tex={String.raw`A=\begin{bmatrix}-R/L&-1/L\\1/C&0\end{bmatrix},\quad B=\begin{bmatrix}1/L\\0\end{bmatrix},\quad C_{out}=\begin{bmatrix}0&1\end{bmatrix},\quad D=0`} />

The symbol Cout identifies the output matrix here. The scalar C remains the capacitance.

Let R = 10 ohms, L = 10 millihenries, and C = 100 microfarads. The characteristic equation is s squared + 1000s + 1000000 = 0.

The eigenvalues are approximately -500 plus or minus j866 per second. Their negative real parts give a decaying oscillation.

The natural frequency is 1000 radians per second. The damping ratio is 0.5. These quantities match the [second-order filter form](<./Filters/Active-filters.md#general-second-order-form>).

## 4. State transition and forced response

The matrix exponential gives the zero-input state response. With the start time set to zero:

<LearningEquation tex={String.raw`\mathbf{x}(t)=e^{At}\mathbf{x}(0)+\int_0^t e^{A(t-\lambda)}B\mathbf{u}(\lambda)\,d\lambda`} />

The first term carries the initial state. The integral carries the input history.

This is the state-vector form of the [zero-input and zero-state split](<./Signals-and-Systems.md#3-initial-conditions-and-total-response>).

For a diagonal A, each diagonal entry gives an independent exponential. Coupled systems generally require a matrix exponential, not an element-by-element exponential.

## 5. Transfer function and hidden modes

With zero initial state, a state-space model gives:

<LearningEquation tex={String.raw`G(s)=C(sI-A)^{-1}B+D`} />

I is the identity matrix. For multiple inputs and outputs, G is a matrix of transfer functions.

Eigenvalues of A describe internal modes. Transfer-function poles can omit modes that the input cannot excite or the output cannot detect.

### Worked example: a stable output with an unstable internal mode

Consider the following model:

<LearningEquation tex={String.raw`A=\begin{bmatrix}0&1\\1&0\end{bmatrix},\quad B=\begin{bmatrix}0\\1\end{bmatrix},\quad C=\begin{bmatrix}-1&1\end{bmatrix},\quad D=0`} />

A has eigenvalues +1 and -1. The internal mode associated with +1 grows exponentially.

However, the transfer function simplifies:

<LearningEquation tex={String.raw`G(s)=\frac{s-1}{s^2-1}=\frac{1}{s+1}`} />

The output hides the unstable mode. For the initial state [1, 1], both states grow as exp(t), but their measured difference is zero.

The zero-state input-output response is stable. The complete state is not internally stable.

Do not use an exact cancellation to justify a physical design's stability. Component errors can expose a mode that an ideal model hides.

## 6. Controllability and observability

**Controllability** asks whether the input can move the state between arbitrary states in finite time. The ideal mathematical test does not impose actuator limits.

For an n-state linear time-invariant system, form the controllability matrix:

<LearningEquation tex={String.raw`\mathcal{C}=\begin{bmatrix}B&AB&A^2B&\cdots&A^{n-1}B\end{bmatrix}`} />

The system is controllable when this matrix has rank n.

**Observability** asks whether known inputs and measured outputs over an interval identify the initial state.

<LearningEquation tex={String.raw`\mathcal{O}=\begin{bmatrix}C\\CA\\CA^2\\\vdots\\CA^{n-1}\end{bmatrix}`} />

The system is observable when this matrix has rank n. Poor numerical conditioning can still make state estimation sensitive to noise.

For the hidden-mode example, the controllability matrix has rank two. The observability matrix has rank one, so one state direction is invisible.

State feedback uses measured or estimated states to change system dynamics. With u = -Kx, the closed-loop state matrix is A - BK.

Uncontrollable unstable modes prevent stabilization by this input. An observer also needs enough output information to estimate the relevant modes.

## 7. Equilibrium and local linearization

A nonlinear model has the form x' = f(x,u) and y = h(x,u). An **equilibrium** satisfies f(x0,u0) = 0 for constant x0 and u0.

An equilibrium need not be stable. Stability is a separate test after the equilibrium is found.

Define deviations from the operating point. Delta x = x - x0 and delta u = u - u0.

The first-order approximation uses **Jacobian matrices**, which contain partial derivatives evaluated at the operating point.

<LearningEquation tex={String.raw`A=\left.\frac{\partial f}{\partial x}\right|_{x_0,u_0},\quad B=\left.\frac{\partial f}{\partial u}\right|_{x_0,u_0},\quad C=\left.\frac{\partial h}{\partial x}\right|_{x_0,u_0},\quad D=\left.\frac{\partial h}{\partial u}\right|_{x_0,u_0}`} />

<LearningEquation tex={String.raw`\Delta\dot{x}\approx A\Delta x+B\Delta u,\qquad \Delta y\approx C\Delta x+D\Delta u`} />

The approximation applies near the operating point. Large input changes, saturation, and switching can invalidate it.

### Worked example: a nonlinear capacitor load

Assume a capacitor obeys C v' = i - g v squared near a positive voltage. This is an illustrative nonlinear load model.

Let C = 1 millifarad, g = 1 milliampere per volt squared, and v0 = 2 volts.

The equilibrium input is i0 = g v0 squared = 4 milliamperes.

The linearized equation is delta v' = -4 delta v + 1000 delta i, with current in amperes and time in seconds.

Its local time constant is 0.25 seconds. A small additional current of 0.1 milliampere gives an approximate steady voltage increase of 0.025 volts.

The exact equilibrium voltage is the square root of i/g. Compare the exact result with the linear estimate before using a large perturbation.

## 8. Stability tests and sampled models

A continuous-time linear state model is asymptotically stable when every eigenvalue of A has a negative real part.

Imaginary-axis eigenvalues need more care. Defective Jordan blocks can produce growing terms even when their eigenvalues have zero real parts.

For a discrete-time model x[k+1] = Ad x[k] + Bd u[k], asymptotic stability requires every eigenvalue of Ad inside the unit circle.

Under a zero-order-held input and sample period T:

<LearningEquation tex={String.raw`A_d=e^{AT},\qquad B_d=\int_0^T e^{A\lambda}B\,d\lambda`} />

The integral form also works when A is singular. Do not use a formula that requires an inverse of A without checking invertibility.

Sampling and computation add timing constraints to a controller. Include actual delays when the model will control hardware.

## References

The junior notes provide state modeling, linearization, controllability, and hidden-mode topics. The circuit and nonlinear-load values are original teaching examples.

* [MIT: controllability and observability](https://ocw.mit.edu/courses/16-30-feedback-control-systems-fall-2010/c2c336c787d150d55873a98dfbd75e0f_MIT16_30F10_rec07.pdf).
* [Caltech: linear systems and local linearization](https://murray.cds.caltech.edu/CDS_101/110_-_Linear_Systems).
