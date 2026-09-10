---
title: Computer Architecture
sidebar_position: 21
---

import LearningEquation from '@site/src/components/LearningEquation';

# Computer Architecture

## Instructions and implementation

An **instruction set architecture (ISA)** defines the instructions and programmer-visible behavior. A **microarchitecture** implements that behavior with registers, execution units, and control logic.

Arm, x86, and RISC-V are ISA families. Many phones use Arm-based processors. The same ISA can support several processor implementations.

**RISC-V** is an open standard ISA. It does not require a particular pipeline, cache, or fabrication process. See the [RISC-V ISA manuals](https://docs.riscv.org/reference/isa/index.html).

Reduced instruction set computer (RISC) designs favor regular operations. Complex instruction set computer (CISC) designs can provide more complex instructions and addressing modes.

These labels alone do not determine speed or efficiency. Modern implementations use techniques such as instruction decoding, prediction, and parallel execution.

## Processor execution

A **central processing unit (CPU)** executes instructions. An **arithmetic logic unit (ALU)** performs arithmetic and logic operations.

The **program counter** identifies an instruction address. Normal execution advances it. A branch, call, return, or exception can select another address.

A teaching pipeline has five stages:

1. Fetch the instruction.
2. Decode the instruction and read registers.
3. Execute an operation or calculate an address.
4. Access data memory if required.
5. Write the result to a register.

**Pipelining** overlaps different instructions in different stages. It improves throughput after the pipeline fills. It does not remove an instruction's dependencies.

Data hazards can need forwarding or stalls. A branch can require a pipeline flush. Shared resources can cause structural hazards.

**Branch prediction** selects a likely next path before the branch result is known. A static predictor uses a fixed rule.

A one-bit predictor remembers the last result. A two-bit saturating counter resists a single unusual result. History-based predictors use patterns from earlier branches.

Wrong predictions waste work. Measure execution time with representative programs rather than clock frequency alone.

<LearningEquation tex={"t_{CPU}=\\frac{N_{instructions}\\,CPI}{f_{clock}}"} />

CPI is the average number of cycles per instruction. Memory stalls and branch behavior can change it.

For an assumed one million instructions, CPI = 1.5, and a 100 MHz clock, execution takes 15 ms. Cache misses can increase this time.

[DMA](<./Embedded-Systems.md#interrupts-and-data-transfer>), accelerators, multiple cores, and vector units can perform independent work. Communication and synchronization costs limit the gain.

## Graphics and parallel work

A **graphics processing unit (GPU)** runs many similar operations across large data sets. Its arithmetic capacity suits images, matrix operations, and some scientific calculations.

A simplified graphics path transforms vertices, assembles primitives, rasterizes fragments, shades them, and writes pixels. Actual pipelines include additional stages and memory operations.

GPU throughput depends on parallel work, memory bandwidth, and active execution lanes. Divergent branches and data transfers can reduce the benefit.

A CPU usually favors low latency for diverse control work. A GPU usually favors throughput across many operations. Compare complete workload time and energy.

See the [NVIDIA programming model](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html) for one GPU execution model.

## Integration and memory

A **system on chip (SoC)** combines several system functions on one die. These can include CPU cores, GPU logic, memory controllers, and interfaces.

A **system on module (SoM)** places an SoC and supporting parts on a small board. It can include memory, power circuits, and connectors.

Integration reduces board area and some interface losses. It also limits component replacement and concentrates heat. A module reduces board development work but adds cost and size.

An SoC can still need memory, storage, clocks, power conversion, connectors, and analog interfaces. Its largest power load depends on the active workload.

| Storage | Typical role | Main trade-off |
| --- | --- | --- |
| CPU register | Immediate instruction operands | Very small capacity |
| Cache | Copies of recently used memory blocks | Misses cause variable latency |
| Main random-access memory (RAM) | Active programs and data | Volatile storage and refresh or leakage costs |
| Nonvolatile storage | Persistent programs and files | Longer access time and write limits |

**Random access** means the address selects a location directly. It does not mean all accesses have equal timing.

A unified memory system stores instructions and data in one address space. A Harvard organization separates instruction and data paths or stores.

A **memory management unit (MMU)** translates virtual addresses and enforces access permissions. Translation caches reduce the translation cost.

Interrupts let an OS respond to devices and schedule work. User programs usually access those devices through drivers instead of direct register access.

## Power and operating limits

Dynamic switching power increases with activity, capacitance, frequency, and the square of supply voltage. Leakage also contributes and changes with temperature and process.

Lower voltage can reduce power, but it also reduces timing margin. A lower clock can restore margin. Validate the supported voltage and frequency pairs.

Separate power and clock domains let inactive blocks stop. Domain crossings need synchronization, isolation, or level conversion as applicable.

**Process, voltage, and temperature (PVT)** describe operating variation. Process corners model combinations such as fast or slow transistors. They are analysis conditions, not operating modes.

Check both [setup and hold](<./DigitalGeneral.md#storage-at-a-clock-edge>) timing across the required corners. A hot condition does not always produce the worst delay at every voltage.

Use the part's rated temperature range and the product requirements. Commercial, industrial, and automotive labels do not specify one universal temperature range.

Thermal control can reduce clock speed, voltage, or workload. [Hysteresis](<../03-Signal-Modulation/Amplifiers/comparators.md#6-schmitt-trigger-and-hysteresis>) prevents rapid state changes. A final protection threshold can stop operation.

**Power, performance, and area (PPA)** describe competing design goals. More parallel hardware can improve throughput but use more area and power.

## Memory faults

Radiation can change a stored bit without permanent damage. It can also cause permanent damage or destructive latch-up in susceptible devices.

Error-correcting code (ECC) memory can correct defined error patterns. Periodic scrubbing repairs correctable errors before another error accumulates.

Use fault detection, [current limiting](<../02-Power/Entry%20Protection/fuses.md#overcurrent-protection>), watchdogs, and recovery where required. Redundant copies need protection against shared power, clock, and environmental failures.

Device qualification and radiation testing must match the mission. Ordinary ECC does not protect every processor state or every multiple-bit event.


See [NASA memory radiation guidelines](https://nepp.nasa.gov/docs/etw/2012/Tuesday/T03_Ladbury_Updated_SSR_Radiation.pdf) for fault consequences and mitigation choices.
