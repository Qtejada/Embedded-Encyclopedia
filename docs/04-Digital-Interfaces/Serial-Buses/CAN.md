# CAN

Notes coming soon...

## 1. Controller and Transceiver

**Controller Area Network (CAN)** separates message control from the electrical bus interface.

* The **CAN controller** handles frames, arbitration, acknowledgment, and error reporting.
* The **CAN transceiver** connects the controller to the [differential bus wires](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#common-mode-voltage>).

The following physical-layout notes describe a conventional high-speed CAN bus. Other CAN physical layers have different requirements.

## 2. Arbitration

A **dominant bit** overrides a **recessive bit**. A transmitter monitors the bus while it sends the arbitration field.

If it sends recessive and observes dominant, it stops competing. The winning transmitter continues without restarting that frame.

For standard data frames with different 11-bit identifiers, the lower identifier has higher priority.

import CanArbitrationExplorer from '@site/src/components/CanArbitrationExplorer';

<CanArbitrationExplorer />

## 3. Worked Example: Two Messages

**Assumptions:** Two standard data frames start together. Their identifiers are [hexadecimal](<../DigitalGeneral.md#hexadecimal>) **0x120** and **0x128**.

1. Compare the identifiers from the most significant bit.
2. The first difference has a zero in 0x120 and a one in 0x128.
3. The zero is dominant, so **0x120 wins**.
4. The other controller retries after the bus becomes available.

This example excludes extended identifiers, remote frames, and bit stuffing. Equal identifiers need a separate system-level check.

## 4. Bus Layout and Timing

Use a trunk with short node branches. For a conventional 120 Ω cable, install matching [termination](<../../05-PCB-Layout/03-trace-impedance.md#distributed-loss-and-termination>) at both physical ends.

Do not add one termination at every node. Two 120 Ω terminators appear as approximately **60 Ω** across an unpowered bus.

The bit timing must accommodate cable delay, transceiver delay, and [clock tolerance](<../../03-Signal-Modulation/Timing/Crystal-oscillators.md#9-frequency-accuracy-and-time-error>). Cable length and bit rate cannot be selected independently.

## 5. Error Handling and Verification

Check controller error counters, acknowledgment, and bus-off recovery. Successful arbitration does not prove that the application processed the payload.

CAN with **flexible data rate (CAN FD)** can use different arbitration and data-phase rates. Confirm support in the controller, transceiver, and network.

Test the full cable, termination, node count, and expected traffic load.

**Reference:** [TI, introduction to CAN](https://www.ti.com/lit/an/sloa101b/sloa101b.pdf).
