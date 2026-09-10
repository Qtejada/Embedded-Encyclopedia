# IO-Expanders

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Remote Digital Pins

An **input/output (I/O) expander** adds digital pins through a serial bus. It is useful for switches, status signals, and moderate-speed control.

The host reads or writes device registers. Bus access adds delay, so an expander is not equivalent to a direct processor pin.

## 2. Register Functions

Common register functions include:

* **Input:** Read the pin states.
* **Output:** Store the values for output pins.
* **Direction:** Select input or output operation.
* **Polarity:** Change the interpretation of selected input bits.

The exact register map and reset values depend on the device. Read those values before defining the startup sequence.

The [TI PCA9534 data sheet](https://www.ti.com/lit/ds/symlink/pca9534.pdf) provides one register-based implementation.

## 3. Startup Without an Output Pulse

If the device permits it, write the intended output value before enabling the output driver. This sequence can avoid an unintended pulse.

External resistors must hold critical signals in their required state before the expander starts. Firmware cannot control an unpowered expander.

## 4. Worked Example: Transaction Delay

**Assumptions:** An [I²C](<./Serial-Buses/03-I2C.md#1-shared-clock-and-data>) write sends an address byte, a register byte, and one data byte. The bus clock is 100 kHz.

Each byte requires eight data clocks and one acknowledgment clock.

<LearningEquation tex={"t\\approx\\frac{3\\times9}{100000}=270\\ \\mu s"} />

The wire transfer alone takes approximately **270 µs**. START, STOP, software delay, and bus contention add time.

An application that needs a 10 µs output response cannot meet that requirement with this transaction.

## 5. Interrupt and Output Limits

An [interrupt](<./Embedded-Systems.md#interrupts-and-data-transfer>) output can report input changes. Check whether a register read clears the interrupt and whether brief pulses are captured.

An expander is not automatically a hardware debounce circuit. Check pin current, total package current, and output voltage at the intended load.

## 6. Verification

Test power-up pin states, interrupted communication, simultaneous input changes, and host reset. Confirm the response when the expander remains powered while the host is off.
