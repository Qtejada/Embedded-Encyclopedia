---
title: Sample-and-Hold Circuits
sidebar_label: Sample and Hold
---

import SampleHoldCycleExplorer from '@site/src/components/SampleHoldCycleExplorer';
import SarAdcInputModel from '@site/src/components/SarAdcInputModel';
import AdcDriverIsolation from '@site/src/components/AdcDriverIsolation';
import AutonullingAmplifierDiagram from '@site/src/components/AutonullingAmplifierDiagram';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Sample-and-Hold and Track-and-Hold Circuits

A **sample-and-hold circuit** acquires an analog voltage and then keeps a copy of that voltage constant for a specified time.
A **track-and-hold circuit** follows the input during its track interval and keeps the last acquired value during its hold interval.
Datasheets frequently use the two names for the same basic circuit.
The term **track-and-hold** makes the continuous tracking action clear.

Many analog-to-digital converter (**ADC**) cores require a stable sampled value during conversion.
An internal or external sample-and-hold function supplies this value.
The external input must meet the acquisition-interval requirements in the ADC datasheet.

Sample-and-hold circuits also store reference or baseline voltages.
For example, an autonulling amplifier stores an input baseline and subtracts it from later measurements.

## 1. Basic Circuit

A basic sample-and-hold circuit contains these parts:

1. An **input buffer** drives the sampling network without excessive loading of the signal source.
2. An **analog switch** connects or disconnects the input.
3. A **hold capacitor**, <i>C<sub>H</sub></i>, stores charge.
4. An **output buffer** isolates the hold capacitor from the load.
5. A **control signal** selects track or hold operation.

The capacitor relation is:

> **Q = C<sub>H</sub> &times; V<sub>H</sub>**

In this relation:

* <i>Q</i> is the stored charge.
* <i>C<sub>H</sub></i> is the hold capacitance.
* <i>V<sub>H</sub></i> is the held voltage.

During track operation, the switch is closed.
The capacitor voltage moves toward the input voltage.
During hold operation, the switch is open.
The capacitor keeps the stored charge and the output buffer reproduces the stored voltage.

An ideal circuit has zero switch resistance, infinite off resistance, zero leakage, zero switching charge, infinite bandwidth, and no timing uncertainty.
A real circuit has errors in each of these areas.

### Interactive Cycle Explorer

Use the controls to see how acquisition time, aperture delay, aperture jitter, and droop change one sample period.

<SampleHoldCycleExplorer />

The explorer is a first-order teaching model.
Its switch is shown open, which is the hold state.
The timing plot separates acquisition, settled tracking, the command-to-sample transition, and hold operation.

## 2. Track, Transition, and Hold Sequence

### Track Phase

The control signal closes the analog switch.
The source then charges or discharges the hold capacitor through the complete source resistance.

The complete resistance can include:

* Signal-source resistance.
* Input-buffer output resistance.
* Switch on-resistance, <i>R<sub>on</sub></i>.
* An intentional isolation resistor.
* PCB and package resistance.

The output follows the input only after the acquisition network settles.
The track interval must be long enough for the maximum input step and the required accuracy.

### Track-to-Hold Transition

The control signal opens the switch.
The circuit stops tracking at its effective **sampling instant**.

The switch does not change state with perfect timing.
Control-path delay, switch transition time, and device mismatch change the exact sampling instant.
Switch charge and control-clock coupling can also change the stored voltage at this transition.

### Hold Phase

The open switch isolates the hold capacitor from the input.
The output buffer reads the stored voltage.

Leakage current slowly changes the stored charge.
Dielectric absorption can make the capacitor move toward an earlier voltage.
Off-state switch capacitance can couple part of a changing input or clock signal into the held node.

### Return to Track

When the switch closes again, the stored voltage can differ from the new input voltage.
Charge flows until the hold capacitor reaches the new value.
This current can make a transient voltage glitch at the source or driver output.
The driver must settle the transient before the next sampling instant.

## 3. Timing Terms

### Acquisition Time

**Acquisition time**, <i>t<sub>acq</sub></i>, is the time from the start of track operation until the held node reaches the specified error band around the input.

Acquisition can include:

* Slew time for a large voltage step.
* Linear RC settling.
* Input-buffer and output-buffer settling.
* Recovery from charge transfer or kickback.

Do not use only small-signal bandwidth to estimate acquisition time.
A large step can put the driver into slew-rate limiting.
The circuit enters linear settling only after the large-signal transition is complete.

Datasheets can specify acquisition at the hold capacitor or at the buffered output.
Read the datasheet definition before you compare two devices.

### Aperture Time

**Aperture time** is the finite interval during which the switch changes from track to hold.
The held voltage is related to the input during this short transition.
Do not use aperture time as another name for aperture delay or aperture jitter.

### Aperture Delay

**Aperture delay** is the delay from the control-command edge to the effective sampling instant.
A constant aperture delay shifts all samples in time.
The system can frequently compensate a known constant delay.

### Aperture Jitter

**Aperture jitter** is the uncertainty in the sampling instant.
The actual sampling instant changes from one sample to the next.

A changing input converts this timing error into voltage error:

> **&Delta;V<sub>jitter</sub> &asymp; |dV<sub>in</sub>/dt| &times; &Delta;t**

A high-frequency signal has a high slew rate.
For this reason, high-frequency measurements are more sensitive to clock jitter than slow measurements.

For a sine wave with peak amplitude <i>V<sub>PK</sub></i>, frequency <i>f<sub>in</sub></i>, and RMS timing jitter <i>&sigma;<sub>t</sub></i>, the RMS voltage error is:

> **V<sub>error,RMS</sub> &asymp; (2&pi;f<sub>in</sub>V<sub>PK</sub> / &radic;2)&sigma;<sub>t</sub>**

The theoretical sine-wave SNR limit from jitter alone is:

> **SNR<sub>jitter</sub> &asymp; 20 log<sub>10</sub>[1 / (2&pi;f<sub>in</sub>&sigma;<sub>t</sub>)]**

Use the ADC or sample-and-hold datasheet aperture-jitter specification for the final SNR calculation.
Include clock-source jitter and clock-distribution jitter in the complete timing budget.
Combine statistically independent RMS jitter sources by their root-sum-square value.

### Hold Time

**Hold time** is the interval during which the circuit must keep the stored value.
A longer hold time increases the error from leakage, bias current, and dielectric absorption.

### Hold-Mode Settling Time

**Hold-mode settling time** is the time after the track-to-hold transition during which switching transients and pedestal error settle to the specified error band.
It is different from acquisition time, which applies when the circuit returns to track and reacquires the input.

### Aperture Skew

**Aperture skew** is the difference between the sampling instants of two channels.
Low skew is necessary when phase relation is important.
Examples include three-phase power monitoring and vibration analysis.

## 4. Acquisition and Settling

### First-Order RC Estimate

For a first estimate, use the total resistance and capacitance in the acquisition path:

> **&tau; = R<sub>total</sub>C<sub>total</sub>**

For a constant input voltage, the ideal held-node response is:

> **V<sub>H</sub>(t) = V<sub>in</sub> + [V<sub>H</sub>(0) - V<sub>in</sub>]e<sup>-t/&tau;</sup>**

For a voltage step, the remaining first-order settling error is:

> **|V<sub>error</sub>(t)| = |&Delta;V<sub>step</sub>|e<sup>-t/&tau;</sup>**

Solve for the required acquisition time:

> **t<sub>acq</sub> &ge; &tau; ln(|&Delta;V<sub>step</sub>|/V<sub>allow</sub>)**

For an ideal <i>N</i>-bit converter with full-scale span <i>V<sub>FS</sub></i>, one LSB is:

> **1 LSB = V<sub>FS</sub> / 2<sup>N</sup>**

If the permitted settling error is one-half LSB:

> **V<sub>allow</sub> = V<sub>FS</sub> / 2<sup>N+1</sup>**

For a full-scale input step, the minimum first-order settling interval is:

> **t<sub>acq</sub> &ge; (N + 1) ln(2) &times; R<sub>total</sub>C<sub>total</sub>**

This estimate does not include amplifier slew rate, ringing, nonlinear switch resistance, charge injection, dielectric absorption, or the ADC internal switching sequence.
Use simulation and measurement to verify the complete acquisition response.

### Worked Settling Example

Consider a 16-bit ADC with a &plusmn;10 V input range.
The complete span is 20 V.

One LSB is:

> **1 LSB = 20 V / 65,536 &asymp; 305 &micro;V**

One-half LSB is approximately 152.6 &micro;V.
Assume that a channel change makes a full 20 V step.

The required error ratio is:

> **20 V / 152.6 &micro;V &asymp; 131,072**

The required number of first-order time constants is:

> **ln(131,072) &asymp; 11.78**

If the measured or calculated acquisition time constant is 150 ns:

> **t<sub>acq</sub> &ge; 11.78 &times; 150 ns &asymp; 1.77 &micro;s**

Use margin for component tolerance, temperature, switch nonlinearity, amplifier recovery, and ADC input behavior.
The final acquisition time must meet the worst-case datasheet limits.

### Timing Stack-Up in a Multiplexed System

Do not use only the ADC sample-rate specification to calculate the channel time.
Use this conservative relation:

> **T<sub>total</sub> = T<sub>MuxSwitch</sub> + T<sub>AmpSettling</sub> + T<sub>ADC Acquisition</sub> + T<sub>Conversion</sub> + T<sub>Readout</sub>**

Acquisition, conversion, and readout can overlap only when the ADC timing permits this operation.

The existing DAQ notes give an 80 ns break-before-make dead time.
They also give a design that waits more than 2 &micro;s after the channel and gain change.
The 2 &micro;s delay can already include the 80 ns internal switch interval when the delay starts at the channel-select command.
It can also include part or all of ADC acquisition when the sampling switch is closed during this time.
Do not add these example intervals until the multiplexer and converter timing diagrams prove that the intervals occur in sequence.
Use the symbolic relation above and add only the independent, nonoverlapping intervals.
If the system switches too quickly, the next result can contain a **ghost** of the previous channel.

## 5. Hold Accuracy

### Droop from Leakage

**Droop** is the slow change in held voltage during the hold interval.
Leakage through the switch, capacitor, PCB, protection devices, and output-buffer input changes the capacitor charge.

The capacitor current relation is:

> **I = C<sub>H</sub> dV/dt**

The droop rate is:

> **|dV/dt| &asymp; |I<sub>leak,total</sub>| / C<sub>H</sub>**

For a constant total leakage current during a hold interval:

> **|&Delta;V<sub>droop</sub>| &asymp; |I<sub>leak,total</sub>|t<sub>hold</sub> / C<sub>H</sub>**

If capacitor leakage is represented only by a parallel resistance, <i>R<sub>leak</sub></i>, the ideal decay is exponential:

> **V<sub>H</sub>(t) = V<sub>H</sub>(0)e<sup>-t/(R<sub>leak</sub>C<sub>H</sub>)</sup>**

A larger hold capacitor decreases droop.
It also increases acquisition time and the charge that the driver must move.

### Leakage-Resistance Example

The precision-design notes give:

* A capacitor leakage resistance of 100 G&Omega;.
* A stored output of 10 V.
* A resulting drift of 3 mV/min.

The leakage current is:

> **I<sub>leak</sub> = 10 V / 100 G&Omega; = 100 pA**

The stated 3 mV/min result corresponds to an effective hold capacitance of approximately:

> **C<sub>H</sub> = I<sub>leak</sub>t / &Delta;V = (100 pA &times; 60 s) / 3 mV = 2 &micro;F**

The actual droop rate changes inversely with capacitance.
The autonulling example requires less than 1 &micro;V/min of null drift.
A drift of 3 mV/min is 3000 times larger than this limit.
The original design identifies hold-capacitor discharge as the principal source of null drift.

### Dielectric Absorption

**Dielectric absorption**, also called **soakage** or the **memory effect**, makes a capacitor move toward an earlier voltage after it is discharged.

The effect occurs in this sequence:

1. Charge the capacitor to one voltage.
2. Short the capacitor to 0 V for one second in this demonstration.
3. Open the circuit.
4. Trapped charge inside the dielectric is released slowly.
5. The capacitor voltage creeps away from 0 V.

In a sample-and-hold circuit, acquisition can move the hold capacitor from one stored value to a new value.
After the switch opens, trapped dielectric charge can make the capacitor move slightly toward the earlier value.
This voltage movement adds a memory-dependent error.

Dielectric absorption can prevent a precision sample-and-hold circuit or a long-period integrator from meeting its error limit.

### Sampling Noise

The hold capacitor has thermal sampling noise.
For an ideal sampled capacitor at absolute temperature <i>T</i>, the RMS voltage is:

> **V<sub>n,RMS</sub> = &radic;(kT/C<sub>H</sub>)**

In this relation, <i>k</i> is Boltzmann's constant.
A larger hold capacitor decreases this noise.
The larger capacitor also increases acquisition time and drive-current demand.

### Output-Buffer Error

The output buffer isolates the capacitor from the external load.
Its input bias current contributes to droop.
Its input offset voltage, offset drift, noise, and settling behavior add to the held-value error.

Select a buffer with:

* Low input bias current.
* Low input offset and drift.
* Sufficient bandwidth and settling speed.
* Input common-mode range that includes the complete held-voltage range.
* Output swing and current that support the load.
* Stable operation with the actual source and load capacitance.

## 6. Switching Errors

### Charge Injection and Pedestal Error

The analog-switch gate stores charge.
When the switch opens, part of this charge can enter the hold node.
The added charge makes a sudden output step.

This step is called **hold step**, **pedestal error**, or a charge-injection step.
For a first estimate:

> **&Delta;V<sub>step</sub> &asymp; Q<sub>inj</sub> / C<sub>H</sub>**

A larger hold capacitor decreases the voltage step for a given injected charge.
It also makes acquisition slower.

Charge injection can depend on input voltage, control-signal amplitude, switch type, temperature, and source impedance.
Signal-dependent injection produces distortion, not only a constant offset.

Use an analog-switch IC that specifies low charge injection.
Matched or complementary switching structures can cancel part of the injected charge.
Use the datasheet test circuit because the specified result depends on the connected impedances.

### Clock Feedthrough

Control-to-signal capacitance couples part of the clock edge into the hold node.
This effect is **clock feedthrough**.

Clock feedthrough can make a narrow output spike or a step in the held value.
Internal switching in auto-zero and chopper-stabilized amplifiers can cause a related feedthrough error.
A low-pass filter can decrease feedthrough when the required signal bandwidth permits the filter.

An auto-zero or chopper-stabilized amplifier uses internal switching to correct input-offset voltage, offset drift, and 1/f noise.
The precision notes identify approximately 6 V as a typical maximum supply for some of these amplifiers.
These devices are applicable to slow, accurate transducer measurements and normal-bandwidth circuits.
Include their clock feedthrough in the signal-chain error budget.

### Off-State Signal Feedthrough

An open MOSFET is not a perfect air gap.
Drain-source capacitance, <i>C<sub>ds</sub></i>, lets a high-frequency input cross the open switch.
The held output can then contain part of the changing input.

A T-switch or a single-pole, double-throw (**SPDT**) arrangement can ground the unused signal path.
This connection decreases off-state feedthrough.

A load resistor can also give an unused multiplexer or switch path a defined DC level.
Do not put this discharge resistor on the hold-capacitor node unless its leakage effect is part of the hold-error budget.
The existing switch notes give a typical starting range from 1 k&Omega; to 100 k&Omega;.
A 1 k&Omega; resistor can decrease feedthrough but can make a divider with <i>R<sub>on</sub></i> and cause signal loss.
A 1 M&Omega; resistor causes little signal loss but can be too weak to discharge capacitive leakage.
An active grounding switch is usually the better solution when the topology permits it.

### Switch On-Resistance and Distortion

A FET in the **ohmic region** operates as a low-resistance analog switch.
Its on-resistance changes with signal voltage because the effective gate-source voltage changes.
This nonlinear resistance can cause total harmonic distortion (**THD**).

Do not select a switch only because it has the lowest <i>R<sub>on</sub></i>.
For example, a 0.5 &Omega; switch can require large internal transistors.
The larger devices have more capacitance and can inject more charge.

For a high-impedance input, a switch resistance of 80 &Omega; can be acceptable.
Low leakage and low capacitance can be more important than minimum resistance.

### CMOS Transmission Gate

An N-channel MOSFET passes a low voltage well.
As its source voltage increases, <i>V<sub>GS</sub></i> decreases.
The device then passes a high voltage poorly and can turn off.

A P-channel MOSFET has the complementary behavior.
A **CMOS transmission gate** connects an N-channel and a P-channel device in parallel.
One device handles the low part of the range, and the other device handles the high part.
The pair permits rail-to-rail signal switching within its specified supply and signal limits.

### MOSFET Switch Building Block

<figure style={{textAlign: 'center', margin: '1.5rem 0'}}>
  <img
    src={useBaseUrl('/img/AoE1.png')}
    alt="MOSFET used as an analog signal switch"
    className="invert-on-dark"
    style={{width: '100%', maxWidth: '355px', height: 'auto', margin: '0 auto'}}
  />
  <figcaption style={{fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)'}}>
    A MOSFET used as an analog signal switch. A complete sample-and-hold circuit also requires a hold capacitor and an output buffer. The shown load resistor is not a hold capacitor. The &plusmn;15 V gate commands are an example, not universal logic levels. Image source: <i>The Art of Electronics</i>, Figure 3.4.
  </figcaption>
</figure>

## 7. Hold-Capacitor Selection

### Capacitance Trade-Off

An increase in <i>C<sub>H</sub></i>:

* Decreases droop for a specified leakage current.
* Decreases the voltage step from a specified injected charge.
* Decreases <i>kT/C</i> sampling noise.
* Increases acquisition time.
* Increases peak and average driver current.
* Can make amplifier stability more difficult.

A decrease in <i>C<sub>H</sub></i>:

* Makes acquisition faster.
* Increases droop.
* Increases the charge-injection voltage step.
* Increases <i>kT/C</i> sampling noise.
* Makes the circuit more sensitive to parasitic capacitance and buffer input current.

Select the capacitance from the complete acquisition and hold-error budgets.

### Dielectric Material

The term **film capacitor** is not a complete material specification.
Different film dielectrics have different absorption, leakage, temperature behavior, and availability.

The existing capacitor notes give these guidelines:

* **Polypropylene (PP):** Low loss and low dielectric absorption.
  It is suitable for precision timing and precision hold functions.
* **Polystyrene (PS):** Very stable and historically used for high precision.
  It is difficult to obtain and can melt during soldering.
* **Teflon:** A low-leakage material used in the precision autonulling example.
* **C0G/NP0 ceramic:** Low dielectric absorption and no high-K piezoelectric behavior.
  It is useful when the required capacitance is available.
* **Polyester (PET or Mylar):** Low cost but has higher dielectric absorption.
  Do not use it when memory error controls the accuracy.
* **Polycarbonate (PC):** Good temperature stability.
  It is mostly obsolete and difficult to obtain.
* **Electrolytic:** High leakage makes it unsuitable for a precision hold function.
* **High-K X7R, Z5U, and Y5V ceramic:** Dielectric absorption, voltage coefficient, and piezoelectric behavior can cause large errors.

Polypropylene and polystyrene can support precision timing.
Ceramic and film capacitors can have leakage in the picoampere range.
Suitable parts can support hold times of minutes or hours.
Verify the actual insulation resistance, dielectric absorption, and voltage coefficient.

### Microphonics

High-K multilayer ceramic capacitors are piezoelectric.
Mechanical vibration can generate a voltage at the hold node.
An applied AC voltage can also make the capacitor vibrate.

Use C0G/NP0 or a suitable film capacitor in a vibration-sensitive precision circuit.

### PCB Leakage

The capacitor datasheet is not the only leakage limit.
Flux residue, humidity, contamination, solder mask, protection devices, and the input buffer can make parallel leakage paths.

Keep the hold node short and clean.
Use guarding when the impedance and error limit require it.
Verify leakage across the complete temperature and humidity range.

## 8. Sample-and-Hold Function in a SAR ADC

A **successive-approximation-register ADC** frequently has an internal sample-and-hold capacitor, <i>C<sub>SH</sub></i>.
The capacitor can also be part of the internal capacitive digital-to-analog converter.
The ADC input is a switching load and does not always look like a high, constant input impedance.

Some SAR ADCs use:

* A **sample-and-hold switch**, <i>SW<sub>SH</sub></i>, to select track or hold operation.
* A **reset switch**, <i>SW<sub>RST</sub></i>, in architectures that reset the sampling capacitor between phases.
* A **reset voltage**, <i>V<sub>RST</sub></i>, that sets the capacitor starting voltage.

In the simplified model, <i>SW<sub>SH</sub></i> and <i>SW<sub>RST</sub></i> must not close at the same time.
Actual ADC switching sequences differ.
Not all SAR ADCs reset the sampling capacitor in this manner.
Use the ADC datasheet input model.

<SarAdcInputModel />

### Step-by-Step Input Glitch

1. **Hold or reset phase:** The model connects <i>C<sub>SH</sub></i> to <i>V<sub>RST</sub></i>.
2. **Voltage difference:** A difference exists between <i>V<sub>RST</sub></i> and <i>V<sub>ADCIN</sub></i>.
3. **Track phase:** <i>SW<sub>SH</sub></i> closes.
4. **Charge transfer:** Current flows to equalize the internal and external capacitances.
5. **Input glitch:** The ADC pin and driver output move temporarily.
6. **Acquisition:** The driver and RC network move the voltage toward its final value.
7. **Sampling:** The ADC stores the value at the next sampling edge.

If the front end does not settle:

* Conversion errors occur.
* Repeated errors can accumulate in the signal chain.
* Accuracy decreases.
* Harmonic distortion appears in a fast Fourier transform (**FFT**).

### Charge-Sharing Estimate

Assume that an external capacitor, <i>C<sub>ext</sub></i>, starts at the input voltage.
Assume that the internal sampling capacitor, <i>C<sub>SH</sub></i>, starts at a different voltage.
The ideal final voltage after charge sharing is:

> **V<sub>final</sub> = [C<sub>ext</sub>V<sub>ext,0</sub> + C<sub>SH</sub>V<sub>SH,0</sub>] / (C<sub>ext</sub> + C<sub>SH</sub>)**

The corresponding first-order external-node movement is:

> **&Delta;V<sub>node</sub> &asymp; [C<sub>SH</sub> / (C<sub>ext</sub> + C<sub>SH</sub>)] &times; &Delta;V<sub>initial</sub>**

The original ratio examples are:

* **C<sub>ext</sub> = 20C<sub>SH</sub>:** The movement is 1/21, or approximately 4.8%.
  The source notes round this result to approximately 5%.
* **C<sub>ext</sub> = 100C<sub>SH</sub>:** The movement is 1/101, or approximately 1%.

This result predicts the initial kick.
It does not guarantee the final acquisition error.
The external capacitor is a local charge reservoir and isolation capacitor.
It is not the ADC's internal hold capacitor.

The original design target keeps the kickback glitch below 100 mV.
This limit can keep the op-amp in its small-signal response region.
Small-signal settling can be faster than recovery from slew-rate limiting.
The 100 mV value is an example design target, not a universal limit.

Datasheet recommendations can include margin for switch resistance, nonlinear capacitance, source impedance, and worst-case operation.
Do not remove these requirements without analysis and measurement.

## 9. Driving the Sampling Capacitor

### Direct Capacitive-Load Problem

A large external capacitor can supply charge to <i>C<sub>SH</sub></i>.
However, a capacitor connected directly to an op-amp output can make the amplifier unstable.

Open-loop gain decreases as frequency increases.
Closed-loop output impedance then rises and can have an inductive characteristic.
This effective inductance and the load capacitance make a resonant network.
The circuit can ring or oscillate.

### RC Isolation

Put a series isolation resistor, <i>R<sub>iso</sub></i>, between the op-amp and the external capacitor.

The resistor:

* Damps the resonant network.
* Separates the op-amp output from the direct capacitive load.
* Lets the external capacitor supply much of the sampling transient.
* Lets the op-amp restore the capacitor voltage after the transient.

Take ordinary op-amp feedback before the isolation resistor when this is the specified topology.
If feedback is taken only after the resistor, the capacitor enters the feedback loop.
The amplifier can oscillate without a suitable compensation method, such as dual feedback.

<AdcDriverIsolation />

The figure shows the isolation and local-reservoir principle for one ADC input path.
It does not show the complete internal sample-and-hold circuit or a complete differential 2R + C interface.

### Capacitor and Resistor Trade-Off

The existing driver notes give these boundary examples:

* **100 pF external capacitor:** It can supply insufficient charge.
  The op-amp then supplies more transient current.
  Settling and ringing can become worse.
* **1 &micro;F external capacitor:** It improves transient charge storage.
  Its RC time constant can be too long.

A large capacitor can require a smaller isolation resistor to preserve bandwidth.
A small resistor gives less damping.
Higher peak current can also increase power dissipation.

### Op-Amp Bandwidth

A higher-bandwidth op-amp frequently has lower closed-loop output impedance at high frequency.
This behavior can decrease the effective inductive output characteristic.
The design can then use a smaller isolation resistor and a shorter RC time constant.

More amplifier bandwidth also passes more noise.
For example, a 100 MHz driver can pass noise far above a 100 kHz signal band.
Balance acquisition settling against integrated noise and power.

### High-Speed Differential ADC Interface

A high-speed ADC input can have wide analog bandwidth and dynamic input impedance.
Do not connect it directly to an arbitrary op-amp output.

A differential **2R + C** network can:

1. Limit the noise bandwidth and support the anti-alias filter.
2. Supply a local charge reservoir when the internal sample switch closes.
3. Isolate the driver outputs from the capacitor and switched ADC input.

An 80 Msps ADC has a Nyquist frequency of 40 MHz.
Its input circuit can still have 700 MHz of analog bandwidth.
Without an external filter, wideband noise can fold into the baseband and reduce SNR.

Do not put a real filter corner at <i>f<sub>s</sub></i>/2 without a transition-band analysis.
Use a guard band and meet the required stopband attenuation.
A sample-and-hold circuit does not replace the anti-alias filter.

Use a differential driver for a high-performance differential ADC unless the datasheet gives acceptable performance for a single-ended connection.
Single-ended drive can prevent cancellation of even-order distortion and can reduce the full-scale differential range by one-half.

## 10. Analog-Switch and Multiplexer Design

### Break-Before-Make Operation

Use a multiplexer with **break-before-make** operation.
The switch disconnects Channel 1 before it connects Channel 2.

This sequence prevents a temporary short circuit between two sensors.
For example, Channel 1 can be at +10 V while Channel 2 is at -10 V.
A make-before-break switch would connect the two sources for a short interval.
The connection could cause a large inrush current and crosstalk.

Break-before-make operation adds dead time.
The existing notes give 80 ns as one example.
Include this interval in the acquisition timing.

### Input Protection

A standard CMOS multiplexer can be damaged when an input exceeds its supply rails.
Treat a user-accessible sensor input as a possible overvoltage source.
Use a robust high-voltage multiplexer or external MOSFET clamps when the source can exceed the normal range.

Protection leakage and capacitance add to the sample-and-hold error.
Select protection parts that meet the hold-leakage and acquisition-time budgets.

### Source Impedance

High multiplexer resistance can be acceptable when the next stage has very high input impedance.
The DAQ example uses:

* An **MPC506** input multiplexer.
  A dielectrically isolated process permits 20 V inputs without latch-up in the stated application.
  Its on-resistance is 1.5 k&Omega;.
* **IH5043** mode-select switches.
  The design selects low charge injection instead of minimum resistance.
* A **PGA202** programmable-gain amplifier.
  Its 10 G&Omega; input impedance makes the multiplexer resistance negligible for DC loading.
  An external 10-bit DAC cancels the 5.5 mV amplifier offset.
* An **LTC1609** 16-bit SAR ADC with a maximum sample rate of 200 ksps.
  The design uses an external 1 ppm/&deg;C precision reference because the internal-reference drift is too high for the requirement.

At startup, the microcontroller measures the signal-chain offset and programs the nulling DAC.
During operation:

1. The microcontroller reads the required gain setting from a lookup table.
2. It selects the input channel and gain.
3. It waits more than 2 &micro;s for the signal chain to settle.
4. It starts the ADC conversion.

The high amplifier input impedance prevents DC loading.
It does not remove the need to calculate the RC acquisition time or charge injection.

## 11. Multiplexed and Simultaneous Sampling

### Multiplexed Sampling

A multiplexed DAQ uses one high-quality ADC for many sensor channels.
The multiplexer connects each channel to the shared signal chain in sequence.

The channels are not sampled at the same instant.
Each channel change also forces the sample-and-hold circuit to acquire a new voltage.
Large channel-to-channel voltage steps give the most difficult settling condition.

Use multiplexed sampling for slowly changing signals when channel-to-channel phase is not important.
Temperature and battery monitoring are common examples.

### Simultaneous Sampling

A simultaneous-sampling DAQ acquires all channels at one common sampling instant.
The channel timing difference is the specified aperture skew.
The integrated-system source example specifies less than 0.1 ns of skew.
The sampling instants are not absolutely identical.

Use simultaneous sampling when phase relation is important.
Applications include:

* Three-phase power monitoring.
* Vibration analysis.
* Motor-control loops.

### Simultaneous-Sampling Architectures

A discrete architecture uses one ADC for each channel.
The ADCs can connect in a daisy chain and share one serial interface.
The **AD7685** is an example of a discrete serial ADC used in this type of arrangement.

An integrated architecture contains multiple ADCs or track-and-hold channels in one package.
The **MAX11046** and **AD7608** each provide eight conversion channels in the examples from the existing notes.

Separate track-and-hold channels can sample together while their conversions or data transfers occur later.
Check aperture skew, channel matching, crosstalk, and interface timing.

## 12. High-Frequency Sampling

A flash ADC has a short aperture interval.
The input changes little during its fast conversion interval.
For this reason, some flash applications do not need a separate external sample-and-hold circuit.

Pipelined and other multistage ADCs store and transfer analog residues between stages.
Different samples can move through different stages at the same time.
These converters can have high throughput and a latency of several clock cycles.
Latency is not the same as sample rate.

For **undersampling**, the sample rate can be lower than the carrier frequency.
The internal track-and-hold circuit must still acquire the high-frequency carrier accurately.

The existing example uses the **ADC08200**.
It samples at 200 Msps and has approximately 500 MHz of analog input bandwidth.
This bandwidth lets its track-and-hold circuit respond to an input near 500 MHz.
Analog input bandwidth does not guarantee full resolution, specified distortion, or rated SNR at every frequency in that range.
The frequency plan must still prevent overlap between aliased bands.

## 13. Precision Autonulling Application

The precision-design notes include an autonulling DC laboratory amplifier.
The circuit stores an input value and subtracts it from later samples.
It then amplifies subsequent input changes with selectable gains of 1, 10, or 100.

U1 is an instrumentation amplifier with configurable gain.
U2 is a non-inverting stage with a fixed gain of 10.
The complete system can have a maximum gain of 1000 and an output range of &plusmn;10 V.
Devices U3, U4, and U5 make the nulling circuit.
The nulling path contains the sample-and-hold function and its hold capacitor.

<AutonullingAmplifierDiagram />

<div style={{fontSize: '0.9rem', color: 'var(--hw-text-secondary)', textAlign: 'center'}}>
  The nulling path stores the input baseline on a hold capacitor. The figure shows the signal and nulling paths described in the source notes. Source design: adapted from <i>The Art of Electronics</i>, Figure 5.3.
</div>

The design requirements include:

* Input drift less than 10 &micro;V.
* Null drift less than 1 &micro;V/min.
* Gain-setting resistors R1 through R4 with 0.1% tolerance.
* Noncritical bias and logic resistors R5 through R13 with 1% tolerance.
* A hold capacitor with the lowest practical leakage.

The tolerance of R5 through R13 does not control the precision performance because these parts perform bias and logic functions.
Polypropylene and Teflon are the low-leakage examples in the original notes.
The notes also use the informal term **poly-stuff** for these materials.

The hold capacitor stores the baseline.
Capacitor discharge causes most of the null drift.
Dielectric absorption can move the stored value toward an earlier state after the switch opens.
Both effects must be smaller than the referred-to-input error limit after the selected system gain.

## 14. Error Budget

Compare each sample-and-hold error with the permitted system error.
For an ADC interface, compare the error with one LSB or the selected fraction of one LSB.

Include:

* Acquisition settling error.
* Amplifier slew and recovery error.
* Fixed aperture delay relative to the required system timing.
* Aperture jitter.
* Channel-to-channel aperture skew.
* Hold droop.
* Switch leakage.
* Capacitor leakage.
* Buffer input-bias current.
* Dielectric absorption.
* <i>kT/C</i> sampling noise.
* Charge-injection pedestal.
* Clock feedthrough.
* Off-state signal feedthrough.
* Switch-resistance nonlinearity.
* Buffer offset, drift, noise, and distortion.
* Temperature drift.
* PCB leakage and contamination.
* Multiplexer dead time.
* ADC kickback and incomplete recovery.

A 16-bit code is approximately 15 ppm of full scale.
The existing DAQ example uses an amplifier gain drift of 40 ppm/&deg;C.
At or near full scale, a 1 &deg;C temperature change can cause more than one LSB of gain error.
High nominal resolution does not correct analog drift.

## 15. Design Procedure

Use this sequence for a new sample-and-hold design.

1. **Define the signal.**
   Specify input range, source impedance, highest frequency, largest channel-to-channel step, and required bandwidth.
2. **Define the accuracy.**
   Convert the ADC resolution or system tolerance into a permitted voltage error.
3. **Define the timing.**
   Specify acquisition time, hold time, sample rate, aperture jitter, and channel skew.
4. **Select the switch.**
   Check signal range, supply range, on-resistance, on-resistance flatness, leakage, charge injection, feedthrough, capacitance, and break-before-make behavior.
5. **Select the hold capacitor.**
   Check capacitance, leakage, dielectric absorption, voltage coefficient, temperature coefficient, microphonics, and package contamination.
6. **Select the buffers.**
   Check bias current, offset, drift, bandwidth, slew rate, settling, noise, output current, common-mode range, output swing, and capacitive-load stability.
7. **Calculate acquisition.**
   Include source resistance, switch resistance, isolation resistance, internal sampling capacitance, and all external capacitance.
8. **Calculate hold error.**
   Include all leakage currents, charge injection, clock feedthrough, dielectric absorption, and buffer error.
9. **Check system timing.**
   Add multiplexer switching, amplifier settling, ADC acquisition, conversion, and readout unless the datasheet permits overlap.
10. **Check high-frequency behavior.**
    Verify anti-alias filtering, driver stability, differential drive, clock jitter, and track-and-hold analog bandwidth.
11. **Lay out the hold node carefully.**
    Keep it short, clean, guarded when necessary, and away from clocks.
12. **Verify the design.**
    Simulate the transient response and measure acquisition, pedestal, droop, distortion, and temperature drift.

Do not replace datasheet limits with only a first-order calculation.
Use the calculations to select parts and tests.
Use worst-case simulation and measurement to confirm the final design.

## 16. Related Notes and Technical References

Related encyclopedia pages:

* [ADCs and DACs](./DACs.md)
* [Operational amplifiers](../Amplifiers/01-op-amps.md)
* [Capacitors](../../01-Discrete-Components/01-Passives/02-Capacitors.md)
* [MOSFET analog switches](../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx)
* [Precision design](../../00-Foundations/03-Precision-Design.md)

Primary technical references:

* [Analog Devices MT-090: Sample-and-Hold Amplifiers](https://www.analog.com/media/en/training-seminars/tutorials/MT-090.pdf)
* [Analog Devices MT-007: Aperture Time, Aperture Jitter, and Aperture Delay](https://www.analog.com/media/en/training-seminars/tutorials/mt-007.pdf)
* [Texas Instruments Precision Labs: SAR and Delta-Sigma Basic Operation](https://www.ti.com/video/6228191712001)
* [Analog Devices AN-1515: Sample-and-Hold Circuit Using the ADG1211 Switch](https://www.analog.com/en/resources/app-notes/an-1515.html)
