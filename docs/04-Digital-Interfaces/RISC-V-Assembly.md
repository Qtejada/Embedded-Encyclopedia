---
title: RISC-V Assembly and Function Calls
sidebar_position: 23
---

# RISC-V Assembly and Function Calls

## 1. Registers and operations

This lesson uses the 32-bit base integer instruction set, RV32I. It assumes byte-addressed memory and naturally aligned word accesses.

The [pipeline lesson](<./RISC-V-Pipeline.md#2-read-a-risc-v-instruction>) defines instruction operands. Register aliases give conventional names to the same physical register indices.

| Alias | Register | Typical use |
| --- | --- | --- |
| zero | x0 | Constant zero |
| ra | x1 | Return address |
| sp | x2 | Stack pointer |
| t0–t2 | x5–x7 | Temporary values |
| a0–a7 | x10–x17 | Arguments, with a0 and a1 also used for results |
| s0–s11 | x8–x9 and x18–x27 | Values preserved by the called function |

These uses come from the **application binary interface (ABI)**. The instruction hardware does not automatically preserve a saved register.

Integer addition keeps the low 32 result bits. It does not trap on signed overflow in RV32I.

For example, adding one to 0xFFFFFFFF produces zero. A C compiler can apply different rules when signed C arithmetic overflows.

## 2. Signed values and immediate fields

A 12-bit signed immediate ranges from −2048 through 2047. Sign extension copies its sign bit into the additional upper bits.

`addi t0, zero, -1` produces 0xFFFFFFFF. `andi` also uses a sign-extended immediate, so an arbitrary 32-bit mask may need several instructions.

Logical right shift inserts zeros. Arithmetic right shift copies the sign bit.

For 0xFFFFFFF8, an arithmetic right shift by one produces 0xFFFFFFFC. These bit patterns represent −8 and −4 in two's complement.

Arithmetic shift is not a general substitute for signed division. For example, shifting −3 right gives −2, while division rounded toward zero gives −1.

## 3. Array addresses and loops

A 32-bit element occupies four bytes. Element i has address base + 4i.

`lw` reads a word. `sw` writes a word. Byte loads can either sign-extend or zero-extend their result.

### Worked example: sum an array

Assume a0 points to an aligned array and a1 contains its nonnegative element count. The array must contain that many accessible words.

```asm
sum_words:
    addi t0, zero, 0
    beq  a1, zero, done
loop:
    lw   t1, 0(a0)
    add  t0, t0, t1
    addi a0, a0, 4
    addi a1, a1, -1
    bne  a1, zero, loop
done:
    addi a0, t0, 0
    jalr zero, 0(ra)
```

The function returns the sum modulo 2³² in a0. It returns zero for an empty array without reading memory.

For the words 3, 5, and 7, t0 changes to 3, then 8, then 15. The pointer advances by 12 bytes.

The load followed by add creates a [load-use dependency](<./RISC-V-Pipeline.md#8-the-load-use-hazard>). A simple five-stage implementation may insert a stall.

Moving an independent instruction between them can hide that delay on some implementations. Preserve program behavior and inspect the actual processor's timing rules.

## 4. Calls and stack frames

`jal ra, target` saves the return address in ra and transfers control. A second call overwrites ra unless software saves the previous return address.

A **leaf function** makes no further calls. A **nonleaf function** calls another function.

The standard integer ABI requires 16-byte stack alignment. The stack grows toward lower addresses, and a function restores sp before returning.

### Worked example: preserve a value across a call

Assume helper accepts one 32-bit argument in a0 and returns one result in a0. This wrapper returns helper(x) + x, modulo 2³².

```asm
wrapper:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    addi s0, a0, 0
    jal  ra, helper
    add  a0, a0, s0
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    jalr zero, 0(ra)
```

The wrapper saves its caller's s0 before using it. The helper must preserve s0 under the same ABI.

Temporary registers and argument registers can change across a call. Save a live value before calling if the ABI does not preserve its register.

This direct `jal` example assumes helper is within instruction range. Assemblers and linkers support other call sequences for more distant targets.

## 5. Instruction encoding

An assembler converts names and operands into bit fields. A disassembler performs the reverse interpretation.

For `add x5, x6, x7`, the register fields are rd = 5, rs1 = 6, and rs2 = 7. The RV32I encoding is 0x007302B3.

In little-endian instruction memory, its bytes appear as B3, 02, 73, and 00 at increasing addresses.

Branch immediates use distributed bit fields and encode multiples of two bytes. Base RV32I instruction addresses still require four-byte alignment without a compressed extension.

Labels and assembler tools handle these fields. Check decoded instructions when debugging generated machine code.

## 6. Connect software to processor behavior

1. Identify every source register and destination register.
2. Calculate each memory address in bytes.
3. Track the next instruction address after each branch.
4. Identify values that remain live across calls.
5. Map dependent instructions onto the five pipeline stages.
6. Add [cache misses](<./Processor-Memory.md#7-average-access-time>) only when the processor model includes them.

The browser pipeline tool supports a fixed instruction subset. It does not assemble or execute these complete function examples.

## References

* [RISC-V RV32I specification](https://docs.riscv.org/reference/isa/v20240411/unpriv/rv32.html)
* [RISC-V ABI: register and procedure conventions](https://riscv-non-isa.github.io/riscv-elf-psabi-doc/)
