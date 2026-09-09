# Bridges

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Translate Transactions

A **protocol bridge** transfers data between different interfaces. For example, an I²C-to-UART bridge accepts register transactions and sends serial frames.

A bridge differs from a **level translator**, which changes electrical voltage levels while preserving the signal protocol.

A bridge also differs from a transceiver, which implements an electrical physical layer.

## 2. Buffering and Service Time

A bridge commonly uses a **first-in, first-out (FIFO)** buffer. The host must remove received data before that buffer overflows.

For free buffer capacity **Nfree** and incoming payload rate **r**:

<LearningEquation tex={"t_{available}=\\frac{N_{free}}{r}"} />

This estimate assumes continuous input and no host reads during the interval.

import InterfacePathDiagram from '@site/src/components/InterfacePathDiagram';

<InterfacePathDiagram mode="bridge" />

## 3. Worked Example: UART Bridge

**Assumptions:** The receive FIFO has 64 free bytes. The UART receives 115200 bits/s with eight data bits, no parity, and one stop bit.

1. Each payload byte uses **10 line bits**.
2. The payload rate is **11520 bytes/s**.
3. An empty 64-byte FIFO fills in approximately **5.56 ms**.
4. If only 16 bytes remain free, the service interval is approximately **1.39 ms**.

Allow margin for interrupt latency and bus contention. Check the host bus transaction time before selecting an interrupt threshold.

## 4. Transaction Semantics

Check byte order, packet boundaries, repeated START support, chip-select behavior, and maximum transaction size.

A bridge can transfer bytes correctly but still violate a target's timing. Some target functions need an uninterrupted transaction that the bridge does not support.

Flow control can stop additional traffic, but it has a response delay. Reserve buffer space for data already in transit.

## 5. Verification

Test maximum bidirectional traffic, buffer overflow, host stalls, clock mismatch, and reset during a transfer. Confirm how the bridge reports each error.

**Reference:** [NXP, SC16IS740/750/760 bridge data sheet](https://www.nxp.com/docs/en/data-sheet/SC16IS740_750_760.pdf). Its 64-byte buffers provide a concrete example, not a universal bridge size.
