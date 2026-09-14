# Memory



## 1. Select the Storage Function

Memory choice depends on retention, access time, capacity, and write behavior.

| Type | Retains data without power | Main design concern |
| --- | --- | --- |
| Static random-access memory (SRAM) | No | Interface timing and standby current |
| Dynamic random-access memory (DRAM) | No | Refresh, controller support, and signal timing |
| Electrically erasable programmable read-only memory (EEPROM) | Yes | Write time, endurance, and page boundaries |
| NOR flash | Yes | Erase blocks, programming rules, and read interface |
| NAND flash | Yes | [Error correction](<./Computer-Architecture.md#memory-faults>), bad-block management, and page operations |

[Micron, memory introduction](https://www.micron.com/content/dam/micron/educatorhub/intro-to-memory/micron-intro-to-memory-presentation.pdf) compares memory technologies.

## 2. Read, Program, and Erase

A nonvolatile memory can still be writing internally after the bus transfer has finished. Check its busy indication before starting an operation that depends on the new data being stored.

Flash generally needs an erase before bits can return to their erased state. EEPROM has its own page and write-cycle rules.

Do not assume a write continues into the next page. Some memories wrap back to the beginning of the current page instead, which can overwrite data you meant to keep.

## 3. Worked Example: Split a Page Write

**Assumptions:** A memory has 64-byte write pages. Write 20 bytes starting at byte address 60.

1. The first page ends at address **63**.
2. Write the first **4 bytes** at addresses 60 through 63.
3. Wait for that write cycle to finish.
4. Write the remaining **16 bytes** starting at address 64.

The [Microchip 24LC256](https://ww1.microchip.com/downloads/en/devicedoc/21203r.pdf) is one device with a 64-byte page buffer. Check the exact part revision before applying its timings.

## 4. Endurance and Power Loss

Repeated writes consume endurance. Avoid writing an unchanged value repeatedly. Distribute often updated records when the storage design permits it.

**Illustrative calculation:** An assumed one-million-cycle location written once per second reaches one million writes in about **11.6 days**.

This arithmetic is not a lifetime guarantee. Temperature, retention requirements, and the manufacturer's endurance conditions also apply.

For important records, store a sequence number and a check value for the data. Finish and verify the replacement before marking it as the committed version, so an interrupted write still leaves the previous valid record available.

## 5. Board and Firmware Checks

Check [supply sequencing](<../02-Power/Measurment/Power-good-Seq.md#1-rail-dependencies>), pin voltage, write protection, address width, and interface timing. Test startup after power removal during each write phase.

For DRAM, follow the controller's required wiring layout and timing rules. Making the traces equal in total length is not enough by itself.


## Processor access and address translation

Storage technology and processor access policy describe different parts of a memory system. Compare [cache placement](<./Processor-Memory.md#2-placement-and-associativity>) with [virtual address translation](<./Operating-Systems.md#5-virtual-pages-and-physical-frames>).

A cache miss does not necessarily cause a page fault. A page fault does not necessarily require a disk read.
