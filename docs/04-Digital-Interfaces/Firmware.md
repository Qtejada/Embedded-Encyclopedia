---
title: Firmware and Registers
sidebar_position: 22
---

import RegisterExplorer from '@site/src/components/learning/RegisterExplorer';

# Firmware and Registers

**Firmware** is software that controls a device. Its correctness depends on both program behavior and the hardware interface.

## Types and representation

An integer stores a whole number within a defined range. A floating-point value represents a scaled number with finite precision.

A Boolean represents true or false. A character stores a character code. In C, a string usually contains characters followed by a zero byte.

Use fixed-width integer types when an interface requires a specific width. Check signedness, overflow behavior, alignment, and byte order.

The **most significant bit (MSB)** has the greatest positional weight. The **least significant bit (LSB)** has the smallest weight.

Each [hexadecimal](<./DigitalGeneral.md#hexadecimal>) digit represents four bits. Each octal digit represents three bits. For example, decimal 45 equals hexadecimal 2D, octal 55, and binary 101101.

**Little-endian** storage places the least significant byte at the lowest address. **Big-endian** storage places the most significant byte there.

For the 16-bit value 0x1234, little-endian memory stores 0x34 before 0x12. Endianness does not define a serial link's bit order.

## Register fields

A **hardware register** exposes a peripheral value or control function. A field occupies selected bits within that register.

To extract a field, shift its lowest bit to position zero. Then apply a mask of the required width.

<RegisterExplorer />

For an assumed 8-bit register value of 0xB6, bits 5 through 3 contain binary 110. The field value is decimal 6.

Read the register access rules before writing. A write-one-to-clear flag clears when software writes one. A read can also have a side effect.

Read-modify-write can corrupt flags or conflict with an [ISR](<./Embedded-Systems.md#interrupts-and-data-transfer>). Use dedicated set and clear registers, atomic instructions, or a protected sequence where the device requires them.

## Volatile and shared data

In C, **volatile** tells the compiler that an access has observable effects under the implementation's rules. Memory-mapped peripheral declarations commonly use it.

Volatile does not make a compound operation atomic. It does not provide thread synchronization or order ordinary memory accesses across a hardware boundary.

Use the compiler's atomic facilities and the processor's required barriers for those tasks. Follow the device header and memory model.

See [GCC volatile behavior](https://gcc.gnu.org/onlinedocs/gcc/Volatiles.html) for implementation details and limitations.

## Memory lifetime

The **stack** usually stores function frames and automatic variables. Nested calls, large local arrays, and interrupts consume stack space.

A **stack overflow** exceeds the allocated stack region. It can corrupt adjacent data or cause a protection fault.

The **heap** supports dynamic allocation. Allocation failures, fragmentation, and unclear ownership can cause faults. Static allocation can simplify bounded embedded systems.

Measure maximum stack use under the worst interrupt nesting and call paths. Keep buffers within their bounds. Define who owns each shared buffer.

## Program analysis

**Assembly language** names machine operations and registers. C describes operations at a higher level. Python usually runs through an interpreter or runtime.

To analyze a program, track inputs, state changes, loop bounds, calls, and outputs. Include early exits and error paths.

An N-iteration loop that calls a routine once executes that call N times. Nested independent loops of N and M iterations make N times M calls.

Execution time also depends on generated instructions, memory access, and interrupts. Measure a representative build or use a justified worst-case timing model.

## Text operations

An **application programming interface (API)** defines how software uses a service. Specify argument types, ownership, units, valid states, return values, and errors.

For a nonblocking sensor API, separate measurement start from result retrieval. State whether a returned value is new, stale, unavailable, or invalid.

The following algorithms assume a sequence of single-byte characters. Unicode text needs rules for code points and displayed characters.

| Operation | Procedure | Simple algorithm cost |
| --- | --- | --- |
| Reverse | Exchange the first and last characters, then move inward | Linear time, constant extra storage |
| Palindrome check | Compare pairs from both ends and stop at a mismatch | Linear time, constant extra storage |
| Find substring | Compare the pattern at each possible start position | At most proportional to text length times pattern length |
| Modify file text | Read records, transform selected content, and write a temporary result | Linear input traversal for a simple fixed rule |

Preserve encoding and line endings during file processing. Check writes before replacing the original file. Do not load an unbounded file into limited [MCU](<./Embedded-Systems.md#select-a-processor>) memory.

A **regular expression** describes a text pattern. For example, a digit class with a repetition rule matches a run of digits.

The expression language depends on the library. Escape literal punctuation and test empty input, invalid input, and maximum length. Some engines have expensive backtracking cases.

## Debug and test

1. Reproduce the fault with a recorded input.
2. Find the first incorrect state with logs, assertions, or a debugger.
3. Reduce the case while keeping the fault.
4. Correct the cause and repeat the failing case.
5. Check adjacent boundary and error cases.

Test hardware-independent calculations on a host computer. Use a target board for peripheral timing, interrupts, and electrical behavior.
