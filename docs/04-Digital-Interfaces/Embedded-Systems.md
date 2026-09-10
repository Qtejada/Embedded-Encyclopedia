---
title: Embedded Systems
sidebar_position: 20
---

import LearningEquation from '@site/src/components/LearningEquation';

# Embedded Systems

An **embedded system** performs a defined function inside a product. A thermostat, motor controller, and camera contain embedded systems.

## Select a processor

A **microcontroller (MCU)** usually contains a processor, memory, timers, and peripheral interfaces in one device. A **microprocessor (MPU)** often uses external memory and supports a larger operating system. These categories overlap.

Examples include STM32 and AVR microcontrollers, and application processors with Arm Cortex-A cores. A processor core name does not specify the complete device.

| Choice | Main benefit | Main cost |
| --- | --- | --- |
| MCU | Software can control many low-power tasks | Limited memory and processing capacity |
| Field-programmable gate array (FPGA) | Parallel logic and precise interface timing | Logic development, power, and tool complexity |
| Application-specific integrated circuit (ASIC) | A fixed function can use little area and power | Development cost and limited changes after manufacture |
| MPU | Large software systems and high processing capacity | External memory, power, and startup complexity |

Select the device from measured requirements. Check processing time, memory, interfaces, timer channels, analog performance, operating temperature, supply current, and available development tools.

Count peripheral instances as well as pins. Two signals can share one pin function and prevent simultaneous use. Check package availability and the complete pin assignment.

## Pins and external circuits

A **general-purpose input/output (GPIO)** pin provides a configurable digital input or output. Its pin multiplexer can also connect an internal peripheral.

Typical settings include input enable, output value, pull resistance, output type, edge interrupt, drive strength, and slew rate. Some pins lack some settings.

An input buffer senses the pad voltage. A [push-pull](<./DigitalGeneral.md#output-architectures>) output uses upper and lower transistors. An open-drain output uses a lower transistor and needs an external pullup.

import {ButtonLedCircuit} from '@site/src/components/learning/CircuitDiagrams';

<ButtonLedCircuit />

For a button, connect the switch between the input and ground. Connect a pullup between the input and its allowed logic supply. Filter contact bounce in hardware or software.

For a small light-emitting diode (LED), use a series resistor. Check both pin current and total port current. Use a transistor or current driver for larger loads.

For an analog sensor, connect its output through a suitable filter to the [analog-to-digital converter](<../03-Signal-Modulation/Data-convertes/DACs.md#3-sampling-and-resolution>) (ADC). Check input range and acquisition settling time.

For a digital sensor, connect the selected bus, [supply decoupling](<../01-Discrete-Components/01-Passives/02-Capacitors.md#bypass--decoupling>), and required address or interrupt pins. Match [logic thresholds](<./DigitalGeneral.md#logic-levels>) at both ends.

An [I/O expander](<./io-expanders.md#1-remote-digital-pins>) adds slow control pins. A multiplexer shares an input path. A shift register adds serially controlled outputs. Each choice adds latency or control work.

## Timers and event capture

A **timer** counts clock edges. A prescaler divides the clock before the counter. Compare logic detects a selected count.

In a simple up counter, the counter returns to zero after the reload value. The period includes the zero count.

<LearningEquation tex={"f_{update}=\\frac{f_{timer}}{(PSC+1)(ARR+1)}"} />

Here, PSC is the prescaler register and ARR is the reload register. This equation assumes the device uses these register conventions.

For an assumed 48 MHz timer clock, PSC = 47 and ARR = 999 give a 1 kHz update rate. Check the actual timer clock tree.

**Input capture** records a count at an input edge. **Output compare** changes an output at a selected count. [Pulse-width modulation](<../03-Signal-Modulation/Filters/Digital-filters.md#pulse-width-modulation-pwm>) (PWM) uses repeated compare events.

Use capture hardware for precise timestamps. Software response time varies with interrupt latency. An accurate reference clock and calibration control long-term time error.

See the [ST timer cookbook](https://www.st.com/resource/en/application_note/dm00236305-generalpurpose-timer-cookbook-for-stm32-microcontrollers-stmicroelectronics.pdf) for device examples and counting modes.

## Interrupts and data transfer

An **interrupt** requests processor attention. Sources include timer events, received data, GPIO edges, and peripheral faults.

The processor finishes an allowed instruction boundary, saves required state, and enters an **interrupt service routine (ISR)**. The return instruction restores the interrupted context.

Priority rules determine whether another interrupt can interrupt the ISR. A masked interrupt can remain pending. Some events merge into one pending flag.

1. Read the event status.
2. Save the required data or timestamp.
3. Clear the cause with the documented register operation.
4. Notify the main program or a task.
5. Return promptly.

Avoid blocking waits, long calculations, and unsafe shared data in an ISR. Use [atomic operations](<./Firmware.md#volatile-and-shared-data>) or a short critical section where required.

**Direct memory access (DMA)** transfers data between a peripheral and memory without a processor instruction for each item. It still uses bus bandwidth.

Check buffer ownership, transfer completion, and cache coherence. DMA can overwrite data before software reads it. A circular buffer needs an overrun policy.

See [Arm interrupt latency](https://developer.arm.com/community/arm-community-blogs/b/architectures-and-processors-Blog/posts/beginner-guide-on-interrupt-latency-and-interrupt-latency-of-the-arm-cortex-m-processors) for architecture-specific entry behavior.

## Startup and software organization

A **reset** puts the device into a documented initial state. Startup code establishes memory and the execution environment before the application runs.

Reset can follow power application, a watchdog event, a reset pin, or a software request. Some memory and backup registers can survive selected resets.

**Bare-metal software** runs without a general task scheduler or operating system. A main loop with interrupts can suit a small control system.

An **operating system (OS)** manages execution and resources. Linux supports large applications and process isolation. It usually needs more memory than a small MCU provides.

A **real-time operating system (RTOS)** provides scheduling and synchronization for tasks with timing requirements. FreeRTOS is one example.

Real time means a result meets its deadline. It does not mean every operation is fast. Check worst-case execution, blocking, priorities, and interrupt load.

An RTOS can simplify independent tasks. It also adds scheduling, stack, and synchronization costs. Priority inversion needs a suitable resource-sharing policy.

See the [FreeRTOS kernel guide](https://www.freertos.org/media/2018/161204_Mastering_the_FreeRTOS_Real_Time_Kernel-A_Hands-On_Tutorial_Guide.pdf) for task and ISR coordination.

## Startup checks

1. Measure each supply at the device pins.
2. Check reset voltage and release timing.
3. Check the clock and boot selection pins.
4. Confirm the image address and vector table.
5. Connect a hardware debugger and inspect the program counter.
6. Inspect reset-cause and fault registers.

A debugger can stop execution and inspect registers or memory. Serial Wire Debug (SWD) and Joint Test Action Group (JTAG) interfaces are common examples.

Stopping the processor can change peripheral timing. Use trace, buffered logs, or a spare GPIO for faults that disappear at a breakpoint.

Without hardware debug access, use a minimal startup image and staged output signals. Keep a recovery path that can replace a faulty application.


## Related topics

- [Firmware and Registers](./Firmware.md) explains data representation and software access.
- [Computer Architecture](./Computer-Architecture.md) explains processor and memory organization.
- [Sensors and Measurement Chains](../03-Signal-Modulation/Sensors.md) explains physical inputs.
- [Motors and Solenoid Drives](../02-Power/Power%20Control/Motor-Drives.md) explains controlled motion.
