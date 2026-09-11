---
title: Five-Stage RISC-V Processor
sidebar_position: 22
---

import LearningEquation from '@site/src/components/LearningEquation';
import PipelineExplorer from '@site/src/components/learning/PipelineExplorer';
import ProcessorDatapath from '@site/src/components/learning/ProcessorDatapath';

# Five-Stage RISC-V Processor

## 1. Instruction set and processor implementation

An **instruction set architecture (ISA)** specifies the operations that software can request. A **microarchitecture** specifies the hardware that performs those operations.

RISC-V does not require a five-stage pipeline. A processor can use one stage, five stages, or another organization while it implements the same instructions.

This lesson uses a small **RV32I** teaching processor. RV32I has 32-bit integer registers. Its base instructions have a fixed length of 32 bits.

The register file contains **x0 through x31**. Register **x0** always reads as zero. A write to x0 does not change its value.

The **program counter (PC)** holds an instruction address. In this model, the normal next address is **PC + 4**.

Compressed instructions change the instruction-length rules. This lesson excludes them, floating-point operations, multiplication extensions, interrupts, and exceptions.

An **arithmetic logic unit (ALU)** performs arithmetic and logic operations. The stage abbreviations below are defined in the five-stage walkthrough.

### Teaching model assumptions

* Instructions enter and complete in program order.
* The processor can fetch one instruction per cycle.
* Instruction memory and data memory have separate access paths.
* Each memory access completes in one cycle.
* The register file makes a WB write visible to an ID read in the same cycle.
* ALU results become available at the end of EX.
* Load data becomes available at the end of MEM.
* Branch comparisons and target calculations occur in EX.
* The processor predicts the next sequential instruction.
* A store receives its data in EX and writes memory in MEM.

These assumptions determine the timing examples. A real processor can have different memory latency, branch timing, and bypass paths.

## 2. Read a RISC-V instruction

The names **rs1** and **rs2** identify source registers. The name **rd** identifies a destination register. An **immediate** is a constant encoded in the instruction.

| Instruction | Meaning |
| --- | --- |
| `add x5, x1, x2` | Add x1 and x2. Write the result to x5. |
| `sub x5, x1, x2` | Subtract x2 from x1. Write the result to x5. |
| `addi x5, x1, 8` | Add the immediate 8 to x1. Write the result to x5. |
| `lw x5, 8(x1)` | Load a 32-bit word from byte address x1 + 8 into x5. |
| `sw x5, 8(x1)` | Store the 32-bit value in x5 at byte address x1 + 8. |
| `beq x1, x2, target` | Transfer control to target if x1 equals x2. |

For a store, the first written register operand supplies data. It is **rs2**, not rd. A store has no destination register.

The immediate in a load or store is a **byte offset**. An array of 32-bit words normally has a four-byte distance between adjacent elements.

For an assumed base address of 100 and an offset of 8, the effective address is **108**. The offset does not select word number eight.

### Instruction fields

The decoder checks the opcode and function fields. It then selects the required register, ALU, memory, and control operations.

| Format | Typical operation | Fields used in this lesson |
| --- | --- | --- |
| R | Register arithmetic | rd, rs1, rs2, function fields |
| I | Immediate arithmetic or load | rd, rs1, signed immediate |
| S | Store | rs1, rs2, signed immediate |
| B | Conditional branch | rs1, rs2, signed branch offset |
| U | Upper immediate | rd and upper immediate bits |
| J | Jump with link | rd and signed jump offset |

An immediate generator assembles the instruction bits and extends the sign where required. Different formats place immediate bits in different positions.

For a branch, add the decoded signed offset to the address of the **branch instruction**. Do not use the address of a younger instruction.

See the [RISC-V instruction listings](https://docs.riscv.org/reference/isa/unpriv/rv-32-64g.html) for the exact field positions and operation encodings.

## 3. The five stages

### IF: instruction fetch

Use the PC to read instruction memory. Calculate PC + 4 for the sequential path.

At the clock edge, **IF/ID** stores the fetched instruction and its PC. The PC selects either the sequential address or a redirected address.

IF does not know that every fetched instruction will complete. A later branch decision can cancel it.

### ID: instruction decode and register read

Decode the instruction. Read the required source registers. Construct the immediate and generate control signals.

At the clock edge, **ID/EX** stores the operand values, register identifiers, immediate, instruction PC, and control signals.

Source register identifiers must travel with the instruction. The forwarding unit compares those identifiers with older destination identifiers.

### EX: execute or calculate an address

Select each ALU operand from the saved register value, a forwarded value, an immediate, or the instruction PC as required.

The ALU performs arithmetic or calculates an effective address. In this teaching model, EX also compares branch operands and calculates the branch target.

For a load, the EX result is an **address**. It is not the value that the load will write to rd.

At the clock edge, **EX/MEM** stores the result, store data, destination identifier, and remaining control signals.

### MEM: data memory access

A load reads data memory at the calculated address. A store writes its saved data to that address.

An arithmetic instruction does not access data memory. Its result still passes through the MEM stage in this fixed pipeline.

At the clock edge, **MEM/WB** stores the selected data, destination identifier, and write control.

### WB: register writeback

Select the value that must enter the register file. Arithmetic instructions use an ALU result. Loads use memory data.

A jump with link can write a return address. Branches and stores do not write an integer destination register.

Write the selected value only when the instruction is valid and register writing is enabled. Ignore writes to x0.

### Data and control must remain together

| Boundary register | Information that must survive the clock edge |
| --- | --- |
| IF/ID | Instruction bits, PC, and validity |
| ID/EX | Operand values, source identifiers, immediate, PC, rd, and controls |
| EX/MEM | ALU result, store data, rd, memory controls, writeback controls, and validity |
| MEM/WB | Result candidates, rd, writeback selection, write enable, and validity |

Never decode the instruction currently in ID to control an older instruction in MEM. Each instruction carries its own controls through the boundary registers.

A **valid bit** identifies a real instruction. A bubble has no architectural side effects. In particular, it must not write a register or memory.

## 4. Follow one load through the processor

<ProcessorDatapath />

Assume **x1 = 100** and memory word **[108] = 42**. The instruction is `lw x5, 8(x1)`.

1. **IF:** Read the instruction and preserve its PC.
2. **ID:** Read 100 from x1. Decode the signed immediate as 8.
3. **EX:** Calculate the effective address, 100 + 8 = 108.
4. **MEM:** Read 42 from address 108.
5. **WB:** Write 42 to x5.

The load passes through five stages. During most of those cycles, other instructions can occupy the other stages.

The value 108 must not reach a dependent arithmetic operation as the loaded value. Forwarding logic must distinguish an address from completed load data.

## 5. Overlap instructions in time

With no hazards, four instructions need eight cycles in this model.

| Instruction | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | IF | ID | EX | MEM | WB | | | |
| B | | IF | ID | EX | MEM | WB | | |
| C | | | IF | ID | EX | MEM | WB | |
| D | | | | IF | ID | EX | MEM | WB |

For **N** instructions and **k** stages, the ideal count is:

<LearningEquation tex={"C=N+k-1"} />

For five stages, this becomes **N + 4**. The first four extra cycles account for pipeline filling and completion after the last fetch.

### Throughput and latency

**Throughput** measures completed instructions per unit time. **Latency** measures the time for one instruction to complete.

The ideal steady rate is one completed instruction per cycle. Each instruction still occupies five stages. Pipelining does not make every instruction finish in one cycle.

The clock period must allow the slowest stage to finish. It must also include the overhead of the boundary registers.

<LearningEquation tex={"T_{pipe}\\geq\\max(t_{IF},t_{ID},t_{EX},t_{MEM},t_{WB})+t_{register}"} />

**Example assumptions:** Stage delays are 200, 100, 150, 250, and 100 ps. Register overhead is 20 ps.

The pipeline needs at least **270 ps** per cycle under this simplified budget. A single-cycle path through all five operations takes **800 ps**, before its own register overhead.

Four independent instructions take 8 × 270 = **2160 ps** in the pipeline. The simplified single-cycle comparison takes 4 × 800 = **3200 ps**.

Unequal stage delays, register overhead, and hazards prevent an automatic fivefold speed increase. Compare execution time, not only cycle count.

## 6. Structural hazards

A **structural hazard** occurs when two operations need the same hardware resource at the same time.

For example, IF can need an instruction read while MEM needs a data read. A single memory port cannot necessarily satisfy both requests.

This model avoids that conflict with separate access paths. Another design can stall fetch or use a memory system with sufficient ports.

The register file needs two source reads and one destination write for many register operations. Its port design and same-cycle behavior are explicit hardware choices.

## 7. Data hazards and forwarding

A **read-after-write dependency** occurs when a younger instruction needs a result from an older instruction.

```text
add x5, x1, x2
sub x6, x5, x3
```

The subtraction needs the new x5. Reading the old register value would produce an incorrect result.

The addition produces its result at the end of EX. During the next cycle, that result is in EX/MEM while the subtraction occupies EX.

A **forwarding path** connects the saved result to the younger ALU input. A multiplexer selects that value instead of the stale operand.

Forwarding moves information from an available result to a later use. It cannot supply a result before the producing operation has calculated it.

### Select the newest matching result

```text
addi x5, x0, 3
addi x5, x5, 2
addi x6, x5, 4
```

The third instruction must use **5**, not 3. An EX/MEM match has priority over an older MEM/WB match in this model.

For each source, check these conditions:

1. The older instruction is valid.
2. It writes a destination register.
3. Its destination is not x0.
4. Its destination matches the source register.
5. Its required result is available on that path.

Forward the final writeback value from MEM/WB. Do not always select the ALU output, because a load writes memory data instead.

### Store and branch operands also need correct values

A store has two dependencies: its address base and its data. An ALU bypass that fixes the address does not automatically fix the store data.

This model forwards both operands into EX. It then saves the corrected store value for MEM.

The branch comparator also uses forwarded operands. Otherwise, a branch can select the wrong path even when nearby arithmetic instructions appear correct.

## 8. The load-use hazard

```text
lw x5, 0(x1)
add x6, x5, x2
```

The load value becomes available at the end of MEM. The following addition would need it during EX in that same cycle.

The normal EX/MEM bypass cannot fix this case. It contains the load address, and the data has not completed its memory access.

Insert one bubble before the dependent instruction enters EX.

| Instruction | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Load | IF | ID | EX | MEM | WB | | |
| Add | | IF | ID | ID held | EX | MEM | WB |
| EX bubble | | | | Bubble | | | |

During the stall, hold the PC and IF/ID. Keep the dependent instruction in ID. Let the load continue, and invalidate the next ID/EX entry.

On the next cycle, forward the load value from MEM/WB to EX. Longer memory latency requires additional waiting.

### Detect actual source use

The detector must know which instruction fields identify real operands. An immediate field can contain bits that resemble a register identifier.

Check decoded source-use controls before comparing identifiers. Otherwise, the processor can insert unnecessary stalls.

In this model, a load followed by a store of that value also stalls once. A separate MEM-stage store-data bypass can change that result.

## 9. Branches, jumps, and flushes

IF normally fetches the next sequential instruction before an older branch reaches EX. Those younger instructions are speculative until the branch decision is known.

If the branch is taken in EX, the instructions in ID and IF belong to the wrong path. Cancel both and fetch from the target.

The older instructions in MEM and WB continue. Do not erase work that precedes the branch.

A **flush** removes instructions that must not complete. A **stall** delays an instruction that must still complete. These operations have different purposes.

### A canceled store must not write memory

```text
addi x1, x0, 1
beq  x1, x1, target
sw   x1, 0(x0)       # Wrong path
addi x2, x0, 99      # Wrong path
target:
addi x2, x0, 7
```

The branch is taken. The store must not change memory, and the value 99 must not reach x2.

Clear validity or all side-effect enables for canceled instructions. Merely hiding an instruction in a display does not make the processor correct.

In this model, a taken branch creates a two-cycle fetch penalty when two younger instructions are present. Later branch resolution can increase the penalty.

RISC-V does not define a branch delay slot. Software must not assume that the instruction after a taken branch will execute.

### Redirects and stalls in the same cycle

A redirect from an older instruction takes priority over a dependency stall for a younger instruction that the redirect cancels.

Otherwise, the hazard unit can hold the old fetch address and lose the branch target. Define control priority explicitly.

## 10. Interactive cycle walkthrough

Start with independent instructions. Then select the dependent ALU program and compare forwarding enabled with forwarding disabled.

For the load program, observe the repeated ID cycle. For the branch program, confirm that memory address 0 keeps its initial value.

<PipelineExplorer />

The timing table shows stage occupancy during a cycle. The register and memory table shows state after that cycle completes.

## 11. Control signals by instruction

| Operation | ALU input B | ALU operation | Memory read | Memory write | Register write | Writeback source |
| --- | --- | --- | --- | --- | --- | --- |
| ADD | rs2 | Add | No | No | Yes | ALU |
| ADDI | Immediate | Add | No | No | Yes | ALU |
| LW | Immediate | Address addition | Yes | No | Yes | Memory |
| SW | Immediate | Address addition | No | Yes | No | None |
| BEQ | Comparator uses rs2 | Compare and target calculation | No | No | No | None |

The branch row assumes a separate target adder and comparison path. A design that shares an ALU can use different control wiring.

**RegWrite**, **MemRead**, and **MemWrite** are common teaching signal names. They are implementation labels, not RISC-V instructions.

## 12. Common implementation errors

* Use the current fetch PC instead of the branch instruction's saved PC.
* Lose rd while an instruction crosses a boundary register.
* Forward a load address as if it were loaded data.
* Give an older producer priority over the newest matching producer.
* Detect a dependency on x0.
* Hold the entire pipeline when only IF and ID must wait.
* Let a canceled instruction retain MemWrite or RegWrite.
* Correct a store address but leave its data stale.
* Count fetched or canceled instructions as completed instructions.
* Compare processor speed from CPI alone.

These errors can survive a test with independent arithmetic. Use dependent instructions, loads, stores, and taken branches in validation.

## 13. Study and verification sequence

1. Trace one ADD, LW, SW, and BEQ through the stages.
2. Identify every value and control that crosses each boundary.
3. Draw the ideal timing table for four independent instructions.
4. Add a dependency and identify when its result becomes available.
5. Test two consecutive writes to the same register.
6. Insert a load-use dependency and show the held stages.
7. Place a store on a canceled branch path.
8. Compare final registers and memory with sequential execution.

For timing constraints on the boundary registers, see [setup and hold behavior](<./DigitalGeneral.md#storage-at-a-clock-edge>).

For the broader processor context, see [processor execution](<./Computer-Architecture.md#processor-execution>) and [memory organization](<./Computer-Architecture.md#integration-and-memory>).

## Technical references

The course notes motivate this walkthrough. The examples and interactive model are new teaching material with explicit assumptions.

* [RISC-V RV32I specification](https://docs.riscv.org/reference/isa/v20240411/unpriv/rv32.html): architectural behavior.
* [Brown University pipeline notes](https://cs.brown.edu/courses/csci1952y/2024/notes/pipelined_cpu.html): an example with a different branch-resolution stage.
* [RISC-V introduction](https://docs.riscv.org/reference/isa/v20240411/unpriv/intro.html): ISA organization and instruction-set scope.
