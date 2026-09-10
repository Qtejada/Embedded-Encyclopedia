---
title: Motors and Solenoid Drives
sidebar_position: 10
---

import LearningEquation from '@site/src/components/LearningEquation';
import MotorExplorer from '@site/src/components/learning/MotorExplorer';

# Motors and Solenoid Drives

## Electrical and mechanical behavior

A **motor** converts electrical energy into motion. A generator converts mechanical energy into electrical energy. Many machines can operate in either direction of energy flow.

A **solenoid** uses a coil to move an armature. Its force depends on current, magnetic geometry, and armature position.

Coil turns combine magnetic fields. More turns can produce greater magnetomotive force for the same current. Wire resistance, inductance, and available space constrain the design.

The **stator** remains fixed. The **rotor** rotates. A linear motor produces translation instead of rotation.

For a simple permanent-magnet direct-current (DC) motor:

<LearningEquation tex={"V=Ri+L\\frac{di}{dt}+k_e\\omega,\\qquad \\tau=k_t i"} />

Here, R is [winding resistance](<../../01-Discrete-Components/01-Passives/03-Inductors.md#winding-losses-and-a-practical-model>), L is inductance, omega is angular speed, and tau is electromagnetic torque. Mechanical losses reduce available shaft torque.

**Back electromotive force (back EMF)** opposes applied voltage as the motor rotates. It increases with speed in this model.

At startup, current cannot jump instantly through the inductance. It can still rise rapidly because back EMF is initially small.

For an assumed 12 V supply and 1 ohm winding, the steady stall current is 12 A. It is not the instantaneous startup current.

Rotation reduces current through back EMF. At no load, current still supplies friction and other losses. A current-limited driver can reduce stall current.

A fixed-position solenoid approaches V/R under continuous DC drive. Its inductance and force change with armature position. Motor speed equations do not directly describe it.

## Torque and speed

<MotorExplorer />

The explorer assumes constant resistance and motor constants. It neglects friction, saturation, driver loss, and temperature changes.

At a fixed supply, increasing load torque increases current and reduces speed. Increasing voltage can increase available speed within the motor's ratings.

The stall point is a limit, not a continuous operating recommendation. See [Maxon motor data](https://support.maxongroup.com/hc/en-us/articles/360013761160-Motor-data-and-simulation) for model limits and temperature effects.

## Motor types

| Type | Operation | Typical trade-off |
| --- | --- | --- |
| Brushed DC | Brushes and a commutator switch winding current | Simple drive, contact wear and electrical noise |
| Brushless DC (BLDC) | Electronics commutate stator phases | Efficient operation with a more complex driver |
| Stepper | Sequential phase currents select magnetic positions | Useful holding torque, possible missed steps |
| Servo system | Feedback controls position, speed, or torque | Accurate control needs sensing and stable loops |
| Linear motor | Magnetic force moves a carriage along a path | Direct motion with mechanical guidance requirements |

Brushes commonly use carbon-based or metal-containing materials. Springs maintain commutator contact. Friction and arcing cause wear.

An **arc** is current through ionized gas across a gap. Commutation can create arcs, noise, and surface damage. Suppression and maintenance depend on the motor design.

Replace serviceable brushes according to the manufacturer's limits. Replace the motor when the commutator, bearings, or sealed construction prevent a reliable repair.

A BLDC driver uses rotor position to select phase currents. Hall sensors, an encoder, or estimated back EMF can provide position information.

Back EMF is weak near zero speed. Sensorless startup needs another method until reliable estimation becomes possible.

More magnetic pole pairs produce more electrical cycles per mechanical revolution. Pole count alone does not establish torque or efficiency.

An **electronic speed controller (ESC)** combines phase switching with commutation and control. It can include current sensing, fault protection, and communication.

An ESC commonly uses three half bridges, [gate drivers](<./Gate-Drivers.md#1-gate-charge-and-switching>), a controller, and a DC bus capacitor. Its command interface depends on the product.

Select an ESC from bus voltage, continuous and peak phase current, commutation method, braking needs, cooling, and command protocol. Battery current and phase current can differ.

A stepper driver regulates winding current and sequences phases. Microstepping varies phase currents to reduce step size and torque ripple.

Holding current produces holding torque and heat. Open-loop step counts do not prove that the shaft reached its target. An encoder can detect missed motion.

A servo can use several motor types. Feedback and control make it a servo system. Gear backlash, sensor resolution, stiffness, and loop tuning limit accuracy.

A hobby servo often contains its own driver and position loop. Its pulse command format is device-specific and differs from direct winding [PWM](<../../03-Signal-Modulation/Filters/Digital-filters.md#pulse-width-modulation-pwm>).

Phone vibration can use an **eccentric rotating mass (ERM)** motor or a **linear resonant actuator (LRA)**. An LRA uses alternating excitation near resonance.

See [TI motor types](https://www.ti.com/video/6067548423001) and the [DRV2605L haptic driver](https://www.ti.com/product/DRV2605L) for implementation examples.

## Drive paths and braking

import {HBridgeCircuit} from '@site/src/components/learning/CircuitDiagrams';

<HBridgeCircuit />

This switch topology omits [body diodes](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#body-diode>) and gate drive. A real bridge must provide current recirculation and [dead time](<./Gate-Drivers.md#4-high-side-drive-and-dead-time>).

A low-side switch can drive a coil in one direction. Connect the coil to its supply and the switch between the coil and ground.

Provide a defined path for inductive current when the switch opens. A diode gives a low clamp voltage and relatively slow current decay.

A higher controlled clamp voltage can shorten release time. It also increases switch stress and electromagnetic emissions. Check repetitive energy and maximum voltage.

A **half bridge** has an upper and lower switch with a shared output. An **H bridge** uses two half bridges across the motor.

| H-bridge state | Enabled switches | Result |
| --- | --- | --- |
| Forward | Left upper and right lower | Positive motor voltage |
| Reverse | Right upper and left lower | Negative motor voltage |
| Dynamic brake | Both lower switches, or a supported equivalent | Winding current circulates and motion energy becomes heat |
| Coast command | All switches off | Existing current still follows diode or clamp paths before it decays |

Never enable the upper and lower switches in one leg together. **Dead time** prevents overlap. Body-diode conduction during dead time still causes loss.

**Regenerative braking** returns energy to the bus. The supply must absorb it, store it, or divert it into a controlled braking resistor.

**Plug braking** applies opposing drive and can create large current. Braking speed depends on current limits, inertia, bus handling, and mechanical load.

A half bridge can support braking with a suitable [return path](<../../05-PCB-Layout/02-Return-Paths.md#1-a-signal-needs-a-return>). An H bridge provides more control of voltage polarity. Neither guarantees a shorter safe stop.

## Gate drive and isolation

A high-side [N-channel MOSFET](<../../01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx#2-mosfet-operation-and-terminal-roles>) needs gate voltage above its moving source. Use a suitable bootstrap, [charge pump](<../Regulation/06-Charge-Pumps.md#two-phase-voltage-doubler>), or isolated driver supply.

A high-side P-channel MOSFET turns off when its gate approaches its source. A low-voltage [GPIO](<../../04-Digital-Interfaces/Embedded-Systems.md#pins-and-external-circuits>) must not directly control a much higher source voltage.

Use a level-shifting transistor, a gate-to-source pullup, and a gate clamp where required. Check maximum gate voltage during every startup and fault state.

A gate pulldown gives a low-side MOSFET a defined off state during reset. A series gate resistor damps parasitic oscillation and controls switching speed.

**Galvanic isolation** removes a direct conductive signal path. An [optocoupler](<../../04-Digital-Interfaces/DigitalGeneral.md#iv-couplers>) transfers a signal through light. The motor side still needs suitable drive power.

One simple isolated control path uses a GPIO, an LED resistor, an optocoupler, and a motor-side gate driver. Define the off state if either side loses power.

Check propagation delay, common-mode transient immunity, insulation rating, and channel matching. An optocoupler's current transfer ratio varies with operating conditions and age.

Relays suit slow switching and can provide contact isolation. MOSFETs suit frequent low-voltage switching. Insulated-gate bipolar transistors (IGBTs) suit some higher-voltage power stages.

A solid-state relay can have leakage and limited turnoff behavior. Select the actual device for DC or AC operation. No switch type removes inductive energy requirements.

## Sensing and protection

Measure winding or phase current with a shunt or magnetic sensor. Sample at a valid point in the switching cycle and account for blanking intervals.

Use encoders or Hall sensors for speed and position. Encoder counts over a known interval give average speed. Edge spacing gives period information.

Back EMF can estimate motor speed when the voltage model is valid. A solenoid instead needs a position-dependent inductance and force model.

Measure solenoid position with a switch, Hall sensor, or displacement sensor. Differentiate filtered position samples to estimate velocity.

Measure winding temperature with an embedded sensor or a calibrated resistance estimate. Case temperature can lag the winding temperature.

Infrared sensing avoids contact but depends on emissivity and the visible surface. It does not directly measure a hidden winding.

Limit current, temperature, speed, and travel. Detect stalls, disconnected sensors, and bus overvoltage. Define a fault state that suits the mechanical hazard.

Winding wire can tolerate its rated current because heat leaves through the motor structure. Continuous operation, pulses, and stall conditions have different thermal limits.

Brush wear, bearing wear, insulation damage, and demagnetization can change performance. Vibration, repeated starts, and thermal cycles contribute to aging.

For a solenoid, a short high-current pull-in phase can improve motion. A lower holding current reduces heat after seating.

A stronger turnoff clamp can speed release. Check coil energy, switch limits, and mechanical impact before increasing cycle rate.

See the [TI DRV110 peak and hold controller](https://www.ti.com/lit/gpn/drv110) for a practical solenoid control example.
