# Inline subsection links

Added 490 inline links across 61 article pages. Reviewed all 62 article pages. Phil’s Lab remains untouched.

Each new link wraps existing words and goes to an exact subsection in another article. No article wording, equations, drawings, or interactive components were added or removed.

The first useful mention links to the relevant explanation. A destination appears at most once per article, with no more than two new links per paragraph or table cell. Existing navigation and reference links remain as they were.

Context determines the destination. Transistor differential pairs and routed differential pairs use different sections. Analog hold time, sensor hysteresis, and battery state of charge do not link to unrelated digital concepts.

The user authorized GitHub publication after local review. This update accompanies the technical coverage additions documented in `INTERVIEW_COVERAGE_REVIEW.md`.

The build now reserves the intrinsic width and height of existing JSX PNG images. This prevents late image loading above a linked subsection from moving the heading away from the scroll position. The image files and article source remain unchanged. The build transform is in `scripts/remark-image-dimensions.mjs` and is enabled in `docusaurus.config.js`.

## Page summaries

| Page | New links | Concepts linked |
| --- | ---: | --- |
| [Electrical Foundations](<docs/00-Foundations/00-Foundations.md>) | 8 | multimeter, crosstalk, Skin effect, MOSFETs, root-sum-square, JFET, operational amplifiers, probe loading |
| [Precision Design](<docs/00-Foundations/03-Precision-Design.md>) | 25 | ADC, JFET, photodiodes, slew rate, operational amplifier, source impedance, common-mode voltage, Common-mode rejection ratio, charge pump, 1/f noise, transimpedance amplifiers, Noise spectral density, shot noise, gain-bandwidth product, Emitter degeneration, negative feedback, input common-mode range, push-pull, Clock feedthrough, difference amplifier, instrumentation amplifier, sense resistor, current limiter, Dielectric absorption, sample-and-hold |
| [Fields and Materials](<docs/00-Foundations/04-Fields-and-Materials.md>) | 2 | photodiode, winding resistance |
| [Measurement and Debug](<docs/00-Foundations/05-Measurement-and-Debug.md>) | 3 | Logic thresholds, aliasing, common-mode rejection |
| [System Design](<docs/00-Foundations/06-System-Design.md>) | 2 | PWM, radiation |
| [Resistors](<docs/01-Discrete-Components/01-Passives/01-Resistors.md>) | 1 | current shunt |
| [Capacitors](<docs/01-Discrete-Components/01-Passives/02-Capacitors.md>) | 8 | dielectric loss, Parasitic Inductance, phase margin, microcontroller, PWM, digital-to-analog converter, LDO, sample-and-hold |
| [Inductors](<docs/01-Discrete-Components/01-Passives/03-Inductors.md>) | 6 | transformer, interwinding capacitance, MOSFET, test point, Skin effect, parasitic capacitance |
| [Transformers](<docs/01-Discrete-Components/02-Magnetics/01-Transformers.md>) | 1 | Winding resistance |
| [Common-Mode Chokes](<docs/01-Discrete-Components/02-Magnetics/02-Common-Mode-Chokes.md>) | 4 | insertion loss, leakage inductance, common-mode voltage, common-mode rejection |
| [Diodes](<docs/01-Discrete-Components/03-Semicondctors/01-Diodes.md>) | 8 | decoupling capacitors, return path, transformers, MOSFET, boost converters, inductive kickback, RS-485, Ethernet |
| [BJTs and Amplifiers](<docs/01-Discrete-Components/03-Semicondctors/02-BJTs.md>) | 10 | negative feedback, Bypass Capacitor, Voltage-Divider, KVL, CMRR, Differential Amplifier, source resistance, Push-Pull, EMI, MOSFETs |
| [FETs (MOSFETs and JFETs)](<docs/01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx>) | 14 | sample-and-hold, Charge injection, emitter follower, op-amp, Negative Feedback, current mirror, Gate charge, GPIO, inductive flyback, shoot-through, H-bridge, solenoid, snubber, source impedance |
| [Power Regulation](<docs/02-Power/Entry%20Protection/fuses.md>) | 35 | Emitter follower, Op-amp, bypass capacitors, sense resistor, Low-dropout regulator, Schottky diodes, SOA, Equivalent series resistance, Equivalent series inductance, quiescent current, transformer, inrush current, TVS diode, Snubber, winding resistance, buck converter, boost converter, electromagnetic interference, charge pump, Half-bridge, optocoupler, bulk capacitor, MOSFET, phototransistor, PWM, leakage inductance, oscilloscope, differential probe, multimeter, JFET, CC/CV, comparators, I2C, microcontroller, Analog-to-digital converter |
| [Ideal Diodes](<docs/02-Power/Entry%20Protection/ideal-diodes.md>) | 3 | MOSFET, body diode, safe operating area |
| [TVS Surge](<docs/02-Power/Entry%20Protection/tvs-surge.md>) | 4 | Parasitic inductance, source impedance, series fuse, current limiter |
| [Current Sense](<docs/02-Power/Measurment/Current-sense.md>) | 7 | common-mode voltage, transformer, MOSFET, winding resistance, PWM, ADC, comparator |
| [Power Good Sequencing](<docs/02-Power/Measurment/Power-good-Seq.md>) | 3 | supervisor, pull-up supply, output discharge |
| [Supervisors](<docs/02-Power/Measurment/Supervisors.md>) | 2 | Hysteresis, open-drain |
| [Gate Drivers](<docs/02-Power/Power%20Control/Gate-Drivers.md>) | 3 | MOSFET, half bridge, body-diode |
| [Load Switches](<docs/02-Power/Power%20Control/Load-Switches.md>) | 2 | current limiting, reverse blocking |
| [Motors and Solenoid Drives](<docs/02-Power/Power%20Control/Motor-Drives.md>) | 10 | winding resistance, gate drivers, PWM, body diodes, dead time, return path, N-channel MOSFET, charge pump, GPIO, optocoupler |
| [Buck Converter](<docs/02-Power/Regulation/01-Buck%20Converter.md>) | 8 | Equivalent series resistance, half bridge, Body diodes, MOSFET, Dead time, parasitic inductance, current limiting, gate charge |
| [Boost](<docs/02-Power/Regulation/02-Boost%20Converter.md>) | 1 | buck converter |
| [Buck-Boost](<docs/02-Power/Regulation/03-Buck-Boost%20Converter.md>) | 1 | boost converter |
| [LDOs](<docs/02-Power/Regulation/04-LDOs.md>) | 3 | junction temperature, thermal resistance, reverse current |
| [AC-to-DC Converters](<docs/02-Power/Regulation/05-AC-to-DC-Converters.md>) | 4 | bulk capacitors, LDO, transformer, inrush current |
| [Charge Pumps](<docs/02-Power/Regulation/06-Charge-Pumps.md>) | 1 | equivalent series resistance |
| [Battery Charging](<docs/02-Power/Regulation/Battery-Charging.md>) | 1 | balancing system |
| [Operational Amplifiers](<docs/03-Signal-Modulation/Amplifiers/01-op-amps.md>) | 32 | resistor divider, comparator, Schmitt trigger, photodiode, Sallen-Key, RC time constant, emitter follower, sense resistor, MOSFET, differential amplifier, common-mode rejection ratio, instrumentation amplifier, common-mode voltage, positive feedback, input offset voltage, input bias current, JFET, auto-zero, source resistance, return current, analog-to-digital converter, SAR ADC, sample-and-hold, digital-to-analog converter, fast Fourier transform, Thermal noise, Effective number of bits, aliasing, Nyquist criterion, anti-alias filter, Oversampling, bypass capacitor |
| [Differential Amplifiers](<docs/03-Signal-Modulation/Amplifiers/02-differential-amps.md>) | 11 | analog-to-digital converter, op-amp, Negative feedback, instrumentation amplifier, common-mode input range, comparators, JFET, current mirror, source resistance, slew-rate, thermal noise |
| [Instrumentation Amplifiers](<docs/03-Signal-Modulation/Amplifiers/03-instrumentation-amps.md>) | 17 | Current-shunt, difference amplifier, common-mode voltage, common-mode rejection ratio, source impedance, op-amps, Input offset voltage, Input bias current, thermal noise, 1/f noise, Photodiodes, JFET, ADC, Parasitic capacitance, DAC, Kelvin connections, common-mode input range |
| [Comparators](<docs/03-Signal-Modulation/Amplifiers/comparators.md>) | 24 | Pulse-width modulation, Analog-to-digital conversion, differential pair, op-amps, input offset voltage, resistor divider, digital-to-analog converter, input bias current, bypass capacitor, Resistor tolerance, source resistance, input common-mode range, differential amplifier, negative feedback, push-pull, Slew rate, logic levels, pull-up resistor, MOSFET, Solenoids, current limiting, RC time constant, flash ADC, auto-zero |
| [Digital-to-Analog & Analog-to-Digital Conversion](<docs/03-Signal-Modulation/Data-convertes/DACs.md>) | 27 | binary-coded decimal, SPI, TTL, MOSFET, RC time constant, op-amp, transimpedance amplifier, oversampling, Pulse-width modulation, Kelvin connection, sense resistor, I2C, microcontroller, Oscilloscope, anti-aliasing, comparators, sample-and-hold, differential pairs, auto-zero, phase margin, AC coupling, break-before-make, crosstalk, charge injection, phase-locked loop, voltage-controlled oscillator, flip-flop |
| [Sample-and-Hold Circuits](<docs/03-Signal-Modulation/Data-convertes/Sample-holding.md>) | 27 | analog-to-digital converter, source resistance, Dielectric absorption, slew-rate, root-sum-square, input bias current, input offset voltage, Input common-mode range, auto-zero, 1/f noise, MOSFET, transmission gate, parasitic capacitance, C0G, solder mask, digital-to-analog converter, SAR ADCs, fast Fourier transform, op-amp, RC time constant, anti-alias filter, Nyquist frequency, crosstalk, microcontroller, flash ADC, instrumentation amplifier, microphonics |
| [Active Filters](<docs/03-Signal-Modulation/Filters/Active-filters.md>) | 42 | operational amplifier, slew-rate, Source resistance, phase margin, self-resonant frequency, pulse-width modulation, inverting amplifier, photodiode, non-inverting amplifier, AC-coupled, input bias current, negative feedback, Input offset voltage, gain-bandwidth product, JFET, dominant-pole compensation, Auto-zero, clock feedthrough, analog-to-digital converter, SAR ADC, Equivalent series resistance, dielectric loss, low-dropout regulators, Equivalent series inductance, self-resonance, bulk capacitor, common-mode voltage, RC time constants, Dielectric absorption, sample-and-hold, X7R, aliasing, oversampling, decimation, Nyquist frequency, DAC, differential nonlinearity, MOSFET, bypass capacitor, group delay, thermal noise, voltage follower |
| [Digital Filters](<docs/03-Signal-Modulation/Filters/Digital-filters.md>) | 15 | analog-to-digital converter, digital-to-analog converter, anti-alias filter, Nyquist frequency, track-and-hold, delta-sigma ADC, thermal noise, Effective number of bits, differential nonlinearity, integral nonlinearity, Aperture jitter, phase-locked loop, voltage-controlled oscillator, phase margin, hysteresis |
| [Sensors and Measurement Chains](<docs/03-Signal-Modulation/Sensors.md>) | 1 | photoresistor |
| [Crystal Oscillators](<docs/03-Signal-Modulation/Timing/Crystal-oscillators.md>) | 11 | microcontroller, reflow, inverting amplifier, C0G, root-sum-square, Phase noise, Parasitic capacitance, test pads, oscilloscope, active probe, logic levels |
| [Phase-Locked Loops](<docs/03-Signal-Modulation/Timing/PLL.md>) | 11 | level translation, crystal oscillator, flip-flop, damping ratio, Phase margin, crosstalk, microphonics, equalization, op-amp, test pad, flicker noise |
| [RTCs](<docs/03-Signal-Modulation/Timing/RTCs.md>) | 5 | parts per million, binary-coded decimal, hexadecimal, primary cell, pull-ups |
| [Bridges](<docs/04-Digital-Interfaces/bridges.md>) | 3 | I²C, UART, interrupt |
| [Computer Architecture](<docs/04-Digital-Interfaces/Computer-Architecture.md>) | 4 | DMA, setup and hold, Hysteresis, current limiting |
| [Digital Logic & Interfacing](<docs/04-Digital-Interfaces/DigitalGeneral.md>) | 18 | crosstalk, Two’s complement, MOSFETs, probe capacitance, pull-up resistor, Transmission gate, Schmitt trigger, op-amp, comparator, Transmission-line, reflections, return path, Bypass capacitors, Series termination, Thevenin, voltage divider, FPGA, body diode |
| [Embedded Systems](<docs/04-Digital-Interfaces/Embedded-Systems.md>) | 7 | push-pull, analog-to-digital converter, supply decoupling, logic thresholds, I/O expander, Pulse-width modulation, atomic operations |
| [Ethernet](<docs/04-Digital-Interfaces/Ethernet.md>) | 2 | transformer, differential pairs |
| [Firmware and Registers](<docs/04-Digital-Interfaces/Firmware.md>) | 3 | hexadecimal, ISR, MCU |
| [IO-Expanders](<docs/04-Digital-Interfaces/io-expanders.md>) | 2 | I²C, interrupt |
| [Memory](<docs/04-Digital-Interfaces/Memory.md>) | 2 | Error correction, supply sequencing |
| [UART](<docs/04-Digital-Interfaces/Serial-Buses/01-UART.md>) | 2 | RS-232, oscilloscope |
| [SPI](<docs/04-Digital-Interfaces/Serial-Buses/02-SPI.md>) | 1 | setup time |
| [I2C](<docs/04-Digital-Interfaces/Serial-Buses/03-I2C.md>) | 2 | Open-drain, resistor tolerance |
| [CAN](<docs/04-Digital-Interfaces/Serial-Buses/CAN.md>) | 4 | differential bus wires, hexadecimal, termination, clock tolerance |
| [RS232 to RS485](<docs/04-Digital-Interfaces/Serial-Buses/rs232-rs485.md>) | 5 | logic levels, UART, parallel termination, reflections, characteristic impedance |
| [USB](<docs/04-Digital-Interfaces/USB.md>) | 1 | differential pair |
| [The PCB Designer's Field Guide](<docs/05-PCB-Layout/01-Overview.md>) | 14 | Electromagnetic Interference, microcontroller, return path, Decoupling Capacitors, parasitic capacitance, termination resistor, AC-coupling, DRC, reflections, I2C, open-drain, power-integrity, transmission-line, via-in-pad |
| [Return Paths](<docs/05-PCB-Layout/02-Return-Paths.md>) | 3 | field coupling, ground stitching via, decoupling path |
| [Trace Impedance](<docs/05-PCB-Layout/03-trace-impedance.md>) | 4 | Differential pair, source resistance, Skin effect, Thevenin |
| [Manufacturing and Test](<docs/05-PCB-Layout/04-Manufacturing-and-Test.md>) | 2 | BGA escape, fault isolation |
| [Semiconductor Fabrication and Packaging](<docs/05-PCB-Layout/05-Packaging.md>) | 1 | doping |
| [High Speed Digital](<docs/05-PCB-Layout/High-Speed.md>) | 7 | transmission-line, reflections, Crosstalk, return paths, ball grid array, equalization, mutual inductance |
| [Phil's Lab](<docs/05-PCB-Layout/Phils-lab.md>) | 0 | Left untouched |

## Validation

Run `npm run build`, `node scripts/verify-inline-links.mjs`, and `node scripts/verify-interview-additions.mjs`. With the local preview running, also run `node scripts/verify-interview-routes.mjs`.

The link check verifies exact source reconstruction, unchanged rendered article text and headings, and every new link’s rendered destination. Each fragment must identify an h2, h3, or h4 in another article. The full destination ledger is in `scripts/inline-links.json`.

The earlier preservation checks remove only the recorded link wrappers before comparing the original writing. This permits the requested link markup without weakening the checks on article content.

Validation passed: production build, 490 subsection destinations, all 62 article text and heading comparisons, both earlier content-preservation checks, 13 interactive-model tests, 62 served routes, and 30 local assets. All 44 local PNG placements reserve image dimensions. The source comparison also permits Git's CRLF/LF conversion across operating systems.

Browser checks passed in light and dark mode. Both comparator input-stage and negative-feedback links reached the intended headings. At 390 px phone width, the negative-feedback heading landed below the fixed header with no horizontal overflow.
