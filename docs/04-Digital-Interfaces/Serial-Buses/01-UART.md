# UART

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Asynchronous Serial Data

A **universal asynchronous receiver/transmitter (UART)** sends data without a separate clock wire. The transmitter and receiver use a configured bit rate.

A basic logic-level connection has a transmit signal, a receive signal, and a common reference. Connect each transmitter to the opposite receiver.

UART framing does not define the cable voltage levels. Use a suitable transceiver for RS-232 or RS-485.

## 2. Frame Format

A common format is **8N1**: eight data bits, no parity, and one stop bit. One start bit precedes the data.

For a conventional non-inverted UART, the line is high when idle. The start bit is low. Data normally starts with the least significant bit.

import SerialTimingExplorer from '@site/src/components/SerialTimingExplorer';

<SerialTimingExplorer mode="uart" />

## 3. Worked Example: Transfer Time

**Assumptions:** Use 115200 bits/s and 8N1. Send 100 bytes without gaps.

<LearningEquation tex={"t_{bit}=\\frac{1}{115200}\\approx8.681\\ \\mu s"} />

1. Each frame has **10 bits**.
2. One frame takes approximately **86.81 µs**.
3. The 100-byte transfer takes approximately **8.681 ms**.
4. Maximum payload rate is **11520 bytes/s**, before protocol overhead.

A 16-byte receive buffer fills in approximately **1.389 ms** at this continuous rate. Software must service it sooner or use flow control.

## 4. Clock Error and Data Integrity

The receiver estimates sample positions after the start edge. Transmitter and receiver clock errors accumulate across a frame.

Check the device's permitted clock mismatch. Do not assume one universal percentage for all UART implementations.

Parity detects some bit errors. It does not replace a packet checksum or a cyclic redundancy check when the application needs stronger error detection.

## 5. Verification

Check bit rate, data length, parity, stop bits, polarity, and logic voltage at both ends. Check overflow, framing errors, and missing bytes under maximum traffic.

Use the oscilloscope to verify voltage and timing. Use a protocol decoder to verify the intended byte values.

**Reference:** [Analog Devices, UART operation](https://www.analog.com/en/resources/analog-dialogue/articles/uart-a-hardware-communication-protocol.html).
