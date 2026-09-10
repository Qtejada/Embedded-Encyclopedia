# Interview Coverage Review

This update was reviewed locally on branch `codex/interview-coverage`. The user subsequently authorized GitHub publication together with the subsection links documented in `INLINE_LINKS_REVIEW.md`.

It adds **11 focused pages**, expands **19 existing pages**, and adds **15 diagram or interactive placements**. Seven placements have controls. All six existing site sections receive relevant additions.

The source is [Monty Choy's hardware interview list](https://montychoy.com/blog/the_ultimate_list_of_hardware_engineering_internship_interview_questions). The audit counts **1,085 entries**, including nested follow-ups.

The encyclopedia contains original technical explanations rather than the source questions or an interview Q&A section. Primary technical references appear with the new material.

## Preservation and writing

- All **51 original documents** retain their original writing. The preservation check removes only the later update's recorded inline-link wrappers before comparing the original byte prefixes. This includes existing spelling, wording, examples, notes, and placeholders.
- **Phil's Lab is unchanged.**
- New descriptions follow the project's Simplified Technical English rules. Automated checks cover the 25-word sentence limit, six-sentence paragraph limit, prose semicolons, and the prohibited word. This is not a formal dictionary certification.
- Assumed examples and simplified models identify their conditions. The new diagrams do not use copied third-party artwork.
- Existing UI, homepage wording, and hosting configuration remain unchanged. New pages appear through the existing automatic sidebar.

## Source dispositions

| Disposition | Entries | Meaning |
| --- | ---: | --- |
| Covered | 332 | The original encyclopedia already explains the concept. |
| Derivable | 58 | The cited material provides the reasoning or general method. Some prompts omit the circuit, program, or numerical conditions. |
| Added | 626 | New prose, an example, a qualification, or a visual improves coverage. Multiple follow-ups can point to one addition. |
| Personal or behavioral | 64 | Excluded, including experience questions outside the source's Non-Technical section. |
| Context only | 4 | Introduces a group of follow-ups. |
| Incomplete | 1 | Entry 569 stops before identifying the other endpoint of a sense-resistor connection. |

[The complete coverage ledger](scripts/interview-coverage.json) records every ID, source line, category, disposition, and destination file. It does not reproduce the questions.

The generic design prompts receive methods and bounded examples where useful. No unique circuit, firmware program, or product specification was invented for an absent problem statement.

Several source premises need qualification. The additions explain curved capacitor-voltage segments, conditional buck/boost efficiency, MOSFET body connections, I²C rise-time terminology, and process-node naming.

## New pages

| Page | Short change summary |
| --- | --- |
| [Embedded Systems](<docs/04-Digital-Interfaces/Embedded-Systems.md>) | Added MCU selection, GPIO circuits, timers, interrupts, DMA, startup, debugging, and operating-system trade-offs. |
| [Computer Architecture](<docs/04-Digital-Interfaces/Computer-Architecture.md>) | Added ISA and processor execution, pipelines, GPU operation, SoC and memory organization, PVT, power control, and memory-fault handling. |
| [Firmware and Registers](<docs/04-Digital-Interfaces/Firmware.md>) | Added data representation, register fields, volatile limits, memory lifetime, code analysis, text algorithms, API design, and software debugging. |
| [Fields and Materials](<docs/00-Foundations/04-Fields-and-Materials.md>) | Added charge transport, bands, doping, mobility, junction physics, photoelectric conversion, dielectric losses, and breakdown. |
| [Measurement and Debug](<docs/00-Foundations/05-Measurement-and-Debug.md>) | Added instrument selection, probe loading, scope timing, VNA measurements, bring-up, validation, and unattended test practices. |
| [System Design](<docs/00-Foundations/06-System-Design.md>) | Added requirements allocation, concrete system paths, bandwidth budgeting, and redundancy trade-offs. |
| [Motors and Solenoid Drives](<docs/02-Power/Power Control/Motor-Drives.md>) | Added motor and solenoid models, drive states, motor types, ESCs, braking, isolation, sensing, and fault limits. |
| [Sensors and Measurement Chains](<docs/03-Signal-Modulation/Sensors.md>) | Added inertial, optical, camera, and LiDAR sensing, fusion limits, calibration, and measurement uncertainty. |
| [Manufacturing and Test](<docs/05-PCB-Layout/04-Manufacturing-and-Test.md>) | Added PCB materials, fabrication and assembly, via treatment, inspection coverage, test access, and rework. |
| [Semiconductor Fabrication and Packaging](<docs/05-PCB-Layout/05-Packaging.md>) | Added semiconductor process steps, package trade-offs, node terminology, yield, chiplets, PoP, bond wires, and flip-chip connections. |
| [Charge Pumps](<docs/02-Power/Regulation/06-Charge-Pumps.md>) | Added charge-pump switching phases, sizing, output resistance, and efficiency with an original circuit drawing. |

## Existing pages with additions

| Page | Short change summary |
| --- | --- |
| [Buck Converter](<docs/02-Power/Regulation/01-Buck Converter.md>) | Added full buck waveforms, input capacitor current, duty limits, PFM, load line, SIMO, multiphase operation, loop trade-offs, and validation. |
| [Boost](<docs/02-Power/Regulation/02-Boost Converter.md>) | Added a boost circuit-state drawing and qualified the efficiency comparison. |
| [LDOs](<docs/02-Power/Regulation/04-LDOs.md>) | Added the limits of the variable-resistance model and an efficiency relation that includes quiescent current. |
| [Current Sense](<docs/02-Power/Measurment/Current-sense.md>) | Added magnetic and lossless sensing comparisons, CSA selection, an ADC sizing example, and hardware fault detection. |
| [Battery Charging](<docs/02-Power/Regulation/Battery-Charging.md>) | Added chemistry selection, capacity and energy, fuel gauging, aging, storage, and physical fault mechanisms. |
| [Resistors](<docs/01-Discrete-Components/01-Passives/01-Resistors.md>) | Added resistor parasitic drawing, physical resistance, preferred values, package examples, and failure modes. |
| [Capacitors](<docs/01-Discrete-Components/01-Passives/02-Capacitors.md>) | Added a capacitor equivalent-circuit drawing and mechanical and aging failure mechanisms. |
| [Inductors](<docs/01-Discrete-Components/01-Passives/03-Inductors.md>) | Added an inductor equivalent-circuit drawing, ACR and core loss, failure modes, and RL filter connections. |
| [FETs (MOSFETs and JFETs)](<docs/01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx>) | Added MOSFET W/L effects and body-connection qualifications. Added an output-characteristic family. |
| [Digital Logic & Interfacing](<docs/04-Digital-Interfaces/DigitalGeneral.md>) | Added CMOS gate construction, truth tables, Karnaugh reduction, latch and mux distinctions, RTL reuse, dividers, arbiters, and single-FET translation. |
| [I2C](<docs/04-Digital-Interfaces/Serial-Buses/03-I2C.md>) | Added I²C address limits, arbitration, final-byte NACK, speed modes, recovery, and rise-time terminology. |
| [SPI](<docs/04-Digital-Interfaces/Serial-Buses/02-SPI.md>) | Added SPI daisy-chain wiring, transfer length, and device compatibility limits. |
| [UART](<docs/04-Digital-Interfaces/Serial-Buses/01-UART.md>) | Added UART oversampling, clock mismatch, common rates, and endpoint topology. |
| [Trace Impedance](<docs/05-PCB-Layout/03-trace-impedance.md>) | Added the lossy RLGC model, termination comparisons, stackup-error implications, and preemphasis. |
| [High Speed Digital](<docs/05-PCB-Layout/High-Speed.md>) | Added an interactive eye diagram, mask and error-rate limits, EMI and desense, and a PI impedance budget. |
| [Digital Filters](<docs/03-Signal-Modulation/Filters/Digital-filters.md>) | Added Fourier series versus transform and qualified square-wave harmonic and edge-bandwidth rules. |
| [Phase-Locked Loops](<docs/03-Signal-Modulation/Timing/PLL.md>) | Added receiver clock high/low pulse-width checks beyond average PLL frequency. |
| [BJTs and Amplifiers](<docs/01-Discrete-Components/03-Semicondctors/02-BJTs.md>) | Added an original BJT output-characteristic family and model limits. |
| [Electrical Foundations](<docs/00-Foundations/00-Foundations.md>) | Added links from Electrical Foundations to the three new foundation topics. |

## Drawings and interactives

| Addition | Location |
| --- | --- |
| Register field extraction | Firmware and Registers |
| Motor torque, current, and speed explorer | Motors and Solenoid Drives |
| Buck waveform explorer | Buck Converter |
| Boost switching-state explorer | Boost |
| Charge-pump switching-state explorer | Charge Pumps |
| CMOS network and truth-table explorer | Digital Logic |
| Illustrative eye diagram | High Speed Digital |
| Three passive equivalent-circuit drawings | Resistors, Capacitors, Inductors |
| Two transistor output-characteristic families | BJTs, MOSFETs |
| Buck circuit, H bridge, and button/LED circuits | Buck Converter, Motors, Embedded Systems |

Diagrams use the existing Field Guide colors, keyboard-accessible controls, SVG descriptions, and scrollable drawing regions on narrow screens. Eye masks are illustrative and do not assert compliance or bit error rate.

## Validation

- Production build passes.
- All **62 article routes** load with one article title, unique article IDs, and valid equation markup.
- **30 local assets** and **1,399 internal article links** pass HTTP and anchor checks.
- **13 numerical tests** pass, including the new register boundaries, motor power balance, buck volt-second balance, and capacitor integration checks.
- **614 added prose blocks** pass automated length and prohibited-word checks.
- Browser checks cover register field boundaries, buck duty, motor stall, charge-pump phases, CMOS outputs, and eye controls. Light and dark desktop layouts and a 390-pixel mobile viewport were inspected.

Reproduce the checks from the repository directory:

```powershell
node scripts/verify-interview-additions.mjs
node --test scripts/learning-models.test.mjs scripts/interview-models.test.mjs
npm run build
npm run serve -- --host 127.0.0.1 --port 3000 --no-open
```

With that server running, use another terminal:

```powershell
node scripts/verify-interview-routes.mjs
```

The preservation verifier also accepts a line-ending-only conversion after a future checkout. It separately reports the number of exact byte matches.

## Local review links

- [Embedded Systems](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Embedded-Systems)
- [Motors and Solenoid Drives](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Power%20Control/Motor-Drives)
- [Buck switching additions](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/Buck%20Converter#switching-states-and-complete-waveforms)
- [Firmware and Registers](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Firmware)
- [Manufacturing and Test](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/PCB-Layout/Manufacturing-and-Test)

These links use the local preview server. GitHub and the public site remain at the previous published version.
