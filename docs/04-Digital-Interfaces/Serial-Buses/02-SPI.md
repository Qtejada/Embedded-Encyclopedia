# SPI


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Clocked Serial Communication

**Serial Peripheral Interface (SPI)** uses a controller-generated clock. A chip-select signal identifies the target device.

Separate data lines can carry information in both directions. Device pin names vary. Identify the transmitting and receiving ends from each data sheet.

SPI does not define one universal command set, word length, or maximum speed.

## 2. Clock Modes

**Clock polarity (CPOL)** defines the idle clock level. **Clock phase (CPHA)** selects the sampling edge relative to the first clock transition.

| Mode | CPOL | CPHA | Idle clock | Sample edge |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | Low | Rising |
| 1 | 0 | 1 | Low | Falling |
| 2 | 1 | 0 | High | Falling |
| 3 | 1 | 1 | High | Rising |

For CPHA = 0, the first data bit must be valid before the first sampling edge.

import SerialTimingExplorer from '@site/src/components/SerialTimingExplorer';

<SerialTimingExplorer mode="spi" />

## 3. Timing Budget

Data must be stable for the required **[setup time](<../DigitalGeneral.md#storage-at-a-clock-edge>)** before the sampling edge and **hold time** after it. Account for the target's output delay, travel time along the routes, and the controller's input requirements.

**Worked example assumptions:** The clock is 10 MHz with equal high and low times. One half-period is 50 ns.

Assume the target output delay is 20 ns. Total route delay is 5 ns. The controller needs 10 ns setup time.

<LearningEquation tex={"Margin=50-20-5-10=15\\ ns"} />

The simplified setup margin is **15 ns**. Check hold time separately. Also include clock distortion and specified delay tolerances.

## 4. Shared Bus Rules

1. Give each ordinary target a separate chip-select signal.
2. Confirm that unselected targets release the shared return-data line.
3. Check chip-select setup, hold, and inactive times.
4. Set each target's required mode before its transaction.
5. Check whether command, address, and data must remain in one selected interval.

## 5. Verification

Start below the target's maximum clock frequency. Read a known register and compare the waveform with its timing diagram.

Check both directions. A correct write does not prove that return-data timing is valid.

**Reference:** [Analog Devices, SPI interface and clock modes](https://www.analog.com/en/resources/analog-dialogue/articles/introduction-to-spi-interface.html).


## Daisy-chain connections

In a supported daisy chain, controller data output connects to the first device input. Each device output connects to the next device input.

The last device sends data back to the controller. All devices share the clock and a compatible select signal, shifting data through the chain one stage at a time.

For three assumed 16-bit stages, a complete chain transfer shifts 48 bits. Standard single-data-rate operation needs 48 clock cycles.

The first transmitted word reaches the farthest stage after the complete shift. Check when each device latches data and drives its output.

Ordinary SPI devices do not necessarily support this arrangement. Separate chip selects permit independent transactions but consume more control pins.
