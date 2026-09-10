---
title: System Design
sidebar_position: 6
---

# System Design

## Convert a function into requirements

A system design connects sensing, processing, power, communication, and actuation. Define the required behavior before selecting parts.

1. Identify inputs, outputs, and operating states.
2. Set numerical limits for accuracy, delay, capacity, and power.
3. Allocate a budget to each subsystem.
4. Define electrical and software interfaces.
5. Analyze faults and recovery.
6. Plan measurements that verify the requirements.

A phone or laptop combines processing, memory, storage, display, radios, user inputs, sensors, and power management. The enclosure also controls heat and mechanical protection.

## Example architectures

These examples describe functional paths. Actual component values and performance limits depend on the product requirements.

| Function | Signal and control path | Main design question |
| --- | --- | --- |
| Adjustable LED brightness | User command → controller → [PWM](<../03-Signal-Modulation/Filters/Digital-filters.md#pulse-width-modulation-pwm>) or current driver → LED | Can the driver regulate current across the required dimming range? |
| Ambient brightness control | Light sensor → filter → brightness map → LED driver | Does emitted light feed back into the sensor? |
| Security monitoring | Door and motion sensors → event logic → local alarm and communication | What occurs during a power or network failure? |
| Camera capture | Optics → image sensor → image processor → memory and output | Can storage and interfaces sustain the data rate? |
| Position tracking | Inertial and external position sensors → timestamp alignment → estimator | How does position error grow without an external reference? |
| Eye tracking glasses | Eye illumination and cameras → gaze estimation → calibration and output | How do fit, motion, optical exposure, and power affect operation? |

For ambient brightness control, filter the sensor and limit command changes. Hysteresis or a dead band can prevent visible oscillation.

For an assumed 640 × 480 image, 30 frames per second, and 8 bits per pixel, raw payload is 9.216 MB/s. Add protocol overhead and buffering.

A camera near the eye requires a suitable optical exposure assessment. An illumination current limit alone does not establish optical safety.

## Redundancy and constraints

**Redundancy** provides an additional resource or path when one fails. Two supplies can improve availability only if the load can transfer between them.

Two sensors can detect disagreement but cannot always identify the faulty sensor. Three independent channels can support majority voting under a single-fault assumption.

Shared power, software, connectors, and environment can defeat redundancy. Analyze common causes and test the transfer or voting behavior.

Consumer products often emphasize cost, size, battery life, and user experience. Automotive systems can add severe electrical, vibration, and temperature conditions.

Space systems can add [radiation](<../04-Digital-Interfaces/Computer-Architecture.md#memory-faults>) and restricted repair access. Medical devices can add patient-related hazards and demanding verification needs.

Set requirements for the particular product and use environment. A market label alone does not define its complete standards or qualification plan.
