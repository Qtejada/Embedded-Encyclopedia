---
title: Firmware and Registers
sidebar_position: 22
---

import RegisterExplorer from '@site/src/components/learning/RegisterExplorer';

# Firmware and Registers

**Firmware** is software that controls a device. Its correctness depends on both program behavior and the hardware interface.

## Types and representation

An integer stores a whole number within a fixed range. A floating-point value stores a number using a scale factor, allowing a much wider range but only a limited number of significant digits.

A Boolean represents true or false. A character stores a character code. In C, a string usually contains characters followed by a zero byte.

Use fixed-width integer types when an interface needs a specific width. Check signedness, overflow behavior, alignment, and byte order.

The **most significant bit (MSB)** has the greatest positional weight. The **least significant bit (LSB)** has the smallest weight.

Each [hexadecimal](<./DigitalGeneral.md#hexadecimal>) digit represents four bits. Each octal digit represents three bits. For example, decimal 45 equals hexadecimal 2D, octal 55, and binary 101101.

**Little-endian** storage places the least significant byte at the lowest address. **Big-endian** storage places the most significant byte there.

For the 16-bit value 0x1234, little-endian memory stores 0x34 before 0x12. Endianness does not define a serial link's bit order.

## Register fields

A **hardware register** lets software read a peripheral value or control what the peripheral does. A field is a group of bits within the register assigned to one particular setting or value.

To extract a field, shift its lowest bit to position zero. Then apply a mask of the required width.

<RegisterExplorer />

For an assumed 8-bit register value of 0xB6, bits 5 through 3 contain binary 110. The field value is decimal 6.

Check what reads and writes actually do before changing a register. For a write-one-to-clear flag, writing one clears the flag. Reading some registers also changes their state.

Read-modify-write can corrupt flags or conflict with an [ISR](<./Embedded-Systems.md#interrupts-and-data-transfer>). Use dedicated set and clear registers, atomic instructions, or a protected sequence where the device needs them.

## Volatile and shared data

In C, **volatile** tells the compiler that accesses have observable effects and must follow the implementation's access rules. This is commonly used for memory-mapped peripherals, where reading or writing an address interacts with hardware.

Volatile does not make a multi-step operation atomic, meaning indivisible to other threads or interrupts. It also does not synchronize threads or provide the ordering needed for ordinary memory accesses across a hardware boundary.

Use the compiler's atomic facilities and the processor's required barriers for those tasks. Follow the device header and memory model.

See [GCC volatile behavior](https://gcc.gnu.org/onlinedocs/gcc/Volatiles.html) for implementation details and limitations.

## Memory lifetime

The **stack** usually stores function frames and automatic variables. Nested calls, large local arrays, and interrupts consume stack space.

A **stack overflow** exceeds the allocated stack region. It can corrupt adjacent data or cause a protection fault.

The **heap** gives memory that software can allocate and release while running. Allocation can fail, free space can become split into unusable pieces (fragmentation), and bugs can arise if it is unclear who owns an allocation. Reserving memory statically can simplify an embedded system with known limits.

Measure maximum stack use under the worst interrupt nesting and call paths. Keep buffers within their bounds. Define who owns each shared buffer.

## Program analysis

**Assembly language** names machine operations and registers. C describes operations at a higher level. Python usually runs through an interpreter or runtime.

To analyze a program, track inputs, state changes, loop bounds, calls, and outputs. Include early exits and error paths.

An N-iteration loop that calls a routine once executes that call N times. Nested independent loops of N and M iterations make N times M calls.

Execution time also depends on generated instructions, memory access, and interrupts. Measure a representative build or use a justified worst-case timing model.

## Text operations

An **application programming interface (API)** defines how software uses a service. Document the argument types and units, who owns any passed data, when calls are valid, and what results and errors mean.

A nonblocking sensor API lets other work continue while a measurement is in progress. Use separate calls to start the measurement and retrieve its result, and make clear whether the returned reading is new, old, unavailable, or invalid.

The following algorithms assume a sequence of single-byte characters. Unicode text needs rules for code points and displayed characters.

| Operation | Procedure | Simple algorithm cost |
| --- | --- | --- |
| Reverse | Exchange the first and last characters, then move inward | Linear time, constant extra storage |
| Palindrome check | Compare pairs from both ends and stop at a mismatch | Linear time, constant extra storage |
| Find substring | Compare the pattern at each possible start position | At most proportional to text length times pattern length |
| Modify file text | Read records, transform selected content, and write a temporary result | Linear input traversal for a simple fixed rule |

Preserve encoding and line endings during file processing. Check writes before replacing the original file. Do not load an unbounded file into limited [MCU](<./Embedded-Systems.md#select-a-processor>) memory.

A **regular expression** describes a text pattern. For example, a digit class with a repetition rule matches a run of digits.

Regular-expression syntax depends on the library. Escape punctuation that should be matched literally, and test empty, invalid, and maximum-length inputs. Some engines repeatedly retry possible matches, called backtracking, which can take a very long time for certain patterns and inputs.

## Debug and test

1. Reproduce the fault with a recorded input.
2. Find the first incorrect state with logs, assertions, or a debugger.
3. Reduce the case while keeping the fault.
4. Correct the cause and repeat the failing case.
5. Check adjacent boundary and error cases.

Test hardware-independent calculations on a host computer. Use a target board for peripheral timing, interrupts, and electrical behavior.


## Pointer ownership and dynamic arrays

Pointer arithmetic uses the pointed-to type's size. Adding one to an integer pointer advances by one integer, not necessarily one byte.

An array can convert to a pointer in many expressions. That pointer does not retain the array length.

Store the element count separately. Check bounds before dereferencing, including after a resize.

For a positive requested size, a failed `realloc` leaves the original allocation intact. Use a temporary pointer so failure does not lose that allocation.

A successful resize can move the object. Replace the owning pointer and discard old pointers into the allocation.

Avoid zero-size resize requests. Check multiplication overflow before calculating the byte count for an array.

`calloc` initializes allocated bytes to zero. This does not guarantee every possible type has its semantic zero represented by all-zero bytes.

Call `free` exactly once for an owned allocation when its lifetime ends. Do not use an object after freeing it.

See the [allocation contract](https://pubs.opengroup.org/onlinepubs/009696899/functions/realloc.html) for resize behavior. Real-time allocation also needs a bounded execution-time policy.

### Arrays and linked structures

| Structure | Useful property | Important cost |
| --- | --- | --- |
| Contiguous array | Direct indexed access and good spatial locality | Growth can move the allocation |
| Singly linked list | Local insertion after a known node | Finding that node can require linear traversal |
| Doubly linked list | Traversal in both directions | More pointers and more updates per operation |
| Fixed ring buffer | Bounded storage for a producer and consumer | Full and empty states need explicit rules |

Constant-time insertion assumes you already know the node involved. It does not include time spent searching for that node or calling an allocator whose execution time has no fixed bound.

Pointer-heavy structures can increase [cache misses](<./Processor-Memory.md#1-locality-and-cache-lines>). Shared structures also require a [synchronization protocol](<./Operating-Systems.md#3-shared-updates-and-critical-sections>).

`getchar` returns an int so it can represent every unsigned character value and the distinct EOF result. Compare with EOF before converting to a character.

Study [RISC-V array access](<./RISC-V-Assembly.md#3-array-addresses-and-loops>) to connect pointer operations with machine instructions.
