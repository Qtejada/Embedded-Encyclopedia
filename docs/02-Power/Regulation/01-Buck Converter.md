# Buck Converter



import LearningEquation from '@site/src/components/LearningEquation';


## 1. Step-Down Conversion

A **buck converter** steps a positive input voltage down to a lower positive output voltage. Its switch feeds pulses into an inductor and output capacitor, which turn the pulses into a smoother output.

During the main switch on-time, the inductor current increases. During the off-time, current continues through a diode or synchronous switch.

In **continuous conduction mode (CCM)**, current keeps flowing through the inductor for the whole switching cycle; it never reaches zero. The equations below assume ideal components and a repeating, steady CCM waveform.

## 2. Duty Cycle and Ripple

**Duty cycle D** is the switch on-time divided by the switching period. **fs** is switching frequency. **L** is inductance.

<LearningEquation tex={"D=\\frac{V_{out}}{V_{in}}\\qquad\n\\Delta I_L=\\frac{(V_{in}-V_{out})D}{L f_s}"} />

The inductor's average current equals the output current in this model.

<LearningEquation tex={"I_{peak}=I_{out}+\\frac{\\Delta I_L}{2}\\qquad\nI_{valley}=I_{out}-\\frac{\\Delta I_L}{2}"} />

If the calculated valley is zero or negative, a diode converter does not satisfy the CCM assumption.

import SwitchingConverterExplorer from '@site/src/components/SwitchingConverterExplorer';

<SwitchingConverterExplorer topology="buck" />

## 3. Worked Example: 12 V to 5 V

**Assumptions:** Input is 12 V. Output is 5 V at 1 A. Inductance is 22 µH. Frequency is 500 kHz.

1. Duty cycle is **41.7%**.
2. Inductor ripple is about **0.265 A peak to peak**.
3. Peak current is about **1.133 A**.
4. Valley current is about **0.867 A**.

The lowest current is still positive, so the inductor current never reaches zero in this example. That agrees with the CCM assumption. Choose a current rating with extra margin for component variation, startup, and sudden load changes.

## 4. Output Ripple and Component Limits

For triangular ripple and an ideal output capacitor **C**:

<LearningEquation tex={"\\Delta V_C\\approx\\frac{\\Delta I_L}{8 f_s C}"} />

[Equivalent series resistance](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#equivalent-series-resistance>) adds a ripple component. The regulator's stability requirements also constrain the capacitor and inductor values.

Check minimum on-time at high input voltage. Check maximum duty cycle at low input voltage. Use the minimum current-limit specification when checking load capacity.

## 5. Layout and Verification

Keep the input-capacitor switching loop compact. Keep the feedback trace away from the switch node.

Test input extremes, light load, full load, startup, and load steps. Check both output ripple and component temperature.

**Reference:** [TI, buck power-stage calculations](https://www.ti.com/lit/an/slva477b/slva477b.pdf). The explorer uses ideal equations, without the report's loss adjustment.


## Switching states and complete waveforms

import {BuckCircuit} from '@site/src/components/learning/CircuitDiagrams';

<BuckCircuit />

The switches represent a synchronous [half bridge](<../Power%20Control/Motor-Drives.md#drive-paths-and-braking>). [Body diodes](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#body-diode>) and control connections are omitted from this topology drawing.

import BuckWaveforms from '@site/src/components/learning/BuckWaveforms';

<BuckWaveforms />

The diagram shows an ideal synchronous buck whose inductor current never reaches zero. It treats the load current as constant within each cycle and assumes the output ripple is small compared with the output voltage.

With the upper switch on, the switch node approaches the input voltage. Inductor voltage is positive when input voltage exceeds output voltage.

With the lower switch on, the switch node approaches ground. Inductor voltage is negative, but positive inductor current still flows toward the load.

The load takes the current it needs from the inductor. Any extra inductor current charges the capacitor. When the inductor supplies less than the load needs, the capacitor supplies the difference and discharges.

Capacitor voltage depends on how much charge has accumulated, found by integrating its current over time. That is why a triangular capacitor current produces curved voltage segments rather than a straight voltage ramp.

In an asynchronous buck, a diode carries the inductor current during the switch's off-time. Current flows from ground through the diode toward the switch node, placing that node slightly below ground by the diode's forward drop.

During the on state, that diode blocks about the input voltage. During the off state, it carries about the inductor current.

A synchronous buck uses a lower [MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>) for most of that conduction instead. During the usual off interval with positive inductor current, current flows through its channel from source to drain.

[Dead time](<../Power%20Control/Gate-Drivers.md#4-high-side-drive-and-dead-time>) still permits body-diode conduction. Reverse recovery, output capacitance, and [parasitic inductance](<../../00-Foundations/00-Foundations.md#5-parasitic-effects>) can produce current spikes and ringing.

Measure each gate voltage relative to that MOSFET's source. The upper MOSFET's source moves with the switch node, so measuring its gate relative to ground also includes that large moving voltage.

The input switch draws pulses of current. A nearby input capacitor supplies much of the rapidly changing part, while the upstream source supplies the average current and whatever ripple the capacitor does not absorb.

For small inductor ripple and an about constant source current:

<LearningEquation tex={"I_{Cin,rms}\\approx I_{out}\\sqrt{D(1-D)}"} />

The input capacitor needs suitable ripple-current, voltage, and effective-capacitance ratings. Long connections can make a large capacitor ineffective against fast switching current.

See [TI capacitor selection](https://www.ti.com/document-viewer/lit/html/SSZTAL7) for the distinct input and output requirements.

## Operating modes and practical duty limits

Ideal zero duty supplies no input energy. Ideal full duty connects the input through the upper switch and inductor. Real losses prevent exact equality with input voltage.

At high switching frequencies, the minimum on-time limits how small the duty cycle can be. The minimum off-time, or the time needed to recharge a bootstrap supply, limits the maximum duty cycle. Some controllers have a separate mode for full-duty operation.

**Pulse-frequency modulation (PFM)** changes pulse timing with load. Pulse skipping or burst operation can reduce light-load switching loss.

These modes can increase low-frequency ripple or audible noise. Forced continuous operation keeps switching regular but can allow negative inductor current and greater light-load loss.

Diode emulation turns off the lower switch before inductor current reverses. In discontinuous conduction, current reaches zero and stays there for part of the cycle, so the ideal continuous-mode duty-cycle equation no longer fully describes the converter.

See [TI light-load mode operation](https://www.ti.com/document-viewer/lit/html/SLVAFC3) for a device-specific example.

## Load line and multiple outputs

A **DC load line** intentionally reduces regulated voltage as load current increases. It can allocate voltage margin between load application and load removal.

<LearningEquation tex={"V_{target}=V_0-R_{LL}I_{out}"} />

Use a load line only if the load allows its supply voltage to vary this way. It accepts some steady voltage change with current to better control the voltage excursions when load is added or removed.

A **single-input multiple-output (SIMO)** converter supplies several rails from one input. A single-inductor implementation allocates energy among outputs through controlled switches.

Sharing the inductor can reduce the number of magnetic components. However, a load change on one output can disturb another output, and the circuit must handle changes on several outputs at once. Other multi-output designs use a separate inductor for each output.

A **multiphase buck** interleaves several inductor phases into one output. Current sharing distributes conduction loss and heat.

Staggering the phases can reduce total ripple and help the output handle load changes. It also makes control and layout more complex. Turning off unneeded phases, called phase shedding, can improve efficiency at light load.

The ripple cancellation depends on duty and phase count. More phases do not automatically increase efficiency at every load.

See [TI multiphase operation](https://www.ti.com/document-viewer/lit/html/SSZTC61).

## Loop response and component trade-offs

The output LC network is a second-order energy-storage system. A load increase initially draws extra capacitor current and reduces output voltage.

The controller must increase inductor current to restore balance. Record peak deviation, settling time, and ringing during a specified load step.

In a stable loop, small disturbances shrink over time. In a marginal loop, they persist. In an unstable loop, they grow until a limit such as saturation changes the behavior.

A **feedforward capacitor** across the upper feedback resistor adds a zero and a higher-frequency pole to the feedback network. It changes loop gain and phase.

Use the controller's recommended range or a validated loop model. Increasing output capacitance or changing its resistance can also change stability.

Feedback divider resistance trades static loss against leakage error and noise sensitivity. Route the sense connection from the intended regulation point with a quiet reference.

Inductor current sensing supports cycle control and [current limiting](<../Entry%20Protection/fuses.md#overcurrent-protection>). Load-side sensing measures delivered current more directly. The correct location depends on the control function.

Larger inductance reduces ripple but slows current slew. More capacitance supports a transient but increases startup energy. Both must fit the controller's compensation limits.

Higher switching frequency can reduce required energy-storage values. It also increases gate-drive and switching losses. Very low frequency demands larger storage for the same ripple.

Select MOSFETs from voltage stress, resistance, [gate charge](<../Power%20Control/Gate-Drivers.md#1-gate-charge-and-switching>), switching behavior, and thermal limits. Identical upper and lower devices are not always the lowest-loss choice.

## Design and fault checks

1. Define input range, output tolerance, load steps, and thermal conditions.
2. Select a controller with suitable current limits, timing limits, and operating modes.
3. Calculate inductance, current peaks, and effective input and output capacitance.
4. Check losses, loop response, and component ratings across temperature.
5. Verify startup, shutdown, short-circuit behavior, and recovery.
6. Measure efficiency, ripple, and load response across the operating range.

An output short, open feedback path, saturated inductor, or failed switch can prevent regulation. Check enable, bias supply, feedback, current limit, and switching activity.

Do not bypass a protection function to force regulation. Identify the condition that activates it.

Capacitor aging, solder fatigue, and thermal stress can change ripple or resistance. Component tolerance and temperature also change limits before any aging happens.
