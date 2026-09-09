# Content expansion review

Prepared for local review on 9 September 2026. Branch: `codex/content-expansion`. Base: `7a682fe146676a3d2e582abe87d263b6f10db29c`.

The update covers all 51 source documents. It expands 39 pages: 29 placeholders, the short AC-to-DC page, and nine developed pages. It adds 19 visual components and 50 rendered equations. Twelve pages remain unchanged.

The user approved this update for GitHub publication after local review on 9 September 2026. The existing live-site address and README link remain unchanged.

## Open the review

[Local homepage](http://127.0.0.1:3000/Embedded-Encyclopedia/). The page links below jump to the first addition. The local server must be running.

To restart the preview from this project directory:

```powershell
npm run build
npm run serve -- --host 127.0.0.1 --port 3000 --no-open
```

## Preservation and writing rules

- Every original document remains an exact byte-for-byte prefix of its current file. New sections and their imports are appended.
- The original wording, headings, study notes, figure references, and “Notes coming soon...” lines remain. This follows the instruction to preserve all previous writing.
- Phil’s Lab is unchanged in its entirety.
- New prose follows the requested Simplified Technical English style: short sentences, direct instructions, defined terms, and explicit assumptions. No new prose uses the prohibited word.
- A basic sentence-length check found no new prose sentence over 25 words. This is a style check, not certification against the complete ASD dictionary.
- Practical examples use stated assumptions. Device-specific values are distinguished from general equations.
- Original drawings explain the relevant concepts. They do not claim to reproduce missing numbered figures from a book.

## Page-by-page changes

| Page and first addition | Short summary |
| --- | --- |
| [Electrical Foundations](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Foundations/#noise-budget-experiment) · [source](<docs/00-Foundations/00-Foundations.md>) | Added an interactive independent-noise budget and a worked bandwidth example. |
| [Precision Design](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Foundations/Precision-Design#separate-error-limits-from-random-noise) · [source](<docs/00-Foundations/03-Precision-Design.md>) | Added a worked distinction between worst-case error limits and independent random noise. |
| [Resistors](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Discrete-Components/Passives/Resistors#1-resistance-and-power) · [source](<docs/01-Discrete-Components/01-Passives/01-Resistors.md>) | Added resistance, loading, tolerance, temperature, power checks, worked examples, and a loaded-divider explorer. |
| [Capacitors](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Discrete-Components/Passives/Capacitors#worked-example-effective-capacitance) · [source](<docs/01-Discrete-Components/01-Passives/02-Capacitors.md>) | Added an effective-capacitance example with tolerance and operating-condition limits. |
| [Inductors](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Discrete-Components/Passives/Inductors#data-sheet-qualification-saturation-is-a-curve) · [source](<docs/01-Discrete-Components/01-Passives/03-Inductors.md>) | Added a sourced qualification of saturation-current definitions and a current-slope example, without changing the original description. |
| [Transformers](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Discrete-Components/Magnetics/Transformers#1-magnetic-coupling) · [source](<docs/01-Discrete-Components/02-Magnetics/01-Transformers.md>) | Added turns ratio, reflected load, flux reset, parasitics, insulation scope, a worked example, and a transformer explorer. |
| [Common-Mode Chokes](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Discrete-Components/Magnetics/Common-Mode-Chokes#1-common-mode-and-differential-mode-current) · [source](<docs/01-Discrete-Components/02-Magnetics/02-Common-Mode-Chokes.md>) | Added current-mode definitions, magnetic operation, selection limits, a mode-separation example, and a switchable current-path drawing. |
| [Power Regulation](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Entry%20Protection/fuses#fuse-selection-supplement) · [source](<docs/02-Power/Entry Protection/fuses.md>) | Added actual fuse selection, clearing and pulse checks, an I²t example, and original power-architecture diagrams for the missing-figure topics. |
| [Ideal Diodes](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Entry%20Protection/ideal-diodes#1-low-loss-reverse-blocking) · [source](<docs/02-Power/Entry Protection/ideal-diodes.md>) | Added ideal-diode operation, loss comparison, body-diode limits, reverse blocking, and startup checks. |
| [TVS Surge](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Entry%20Protection/tvs-surge#1-transient-protection) · [source](<docs/02-Power/Entry Protection/tvs-surge.md>) | Added TVS voltage definitions, surge margin example, coordination checks, and a protection-current-path drawing. |
| [Current Sense](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Measurment/Current-sense#1-convert-current-to-voltage) · [source](<docs/02-Power/Measurment/Current-sense.md>) | Added shunt equations, high-side and low-side trade-offs, Kelvin layout, offset example, and a shunt-error explorer. |
| [Power Good Sequencing](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Measurment/Power-good-Seq#1-rail-dependencies) · [source](<docs/02-Power/Measurment/Power-good-Seq.md>) | Added rail dependencies, PG and delay distinctions, startup arithmetic, fault behavior, and a sequence timeline. |
| [Supervisors](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Measurment/Supervisors#1-reset-control) · [source](<docs/02-Power/Measurment/Supervisors.md>) | Added reset terminology, threshold tolerance, delay, brownout checks, and an interactive reset timeline. |
| [Gate Drivers](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Power%20Control/Gate-Drivers#1-gate-charge-and-switching) · [source](<docs/02-Power/Power Control/Gate-Drivers.md>) | Added gate-charge and transition calculations, bootstrap limits, dead time, and measurement guidance. |
| [Load Switches](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Power%20Control/Load-Switches#1-controlled-power-connection) · [source](<docs/02-Power/Power Control/Load-Switches.md>) | Added load-switch functions, inrush and loss equations, ramp example, discharge limits, and an inrush explorer. |
| [Buck Converter](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/Buck%20Converter#1-step-down-conversion) · [source](<docs/02-Power/Regulation/01-Buck Converter.md>) | Added buck operation, CCM equations, current ripple, a 12 V to 5 V example, layout checks, and a waveform explorer. |
| [Boost](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/Boost%20Converter#1-step-up-conversion) · [source](<docs/02-Power/Regulation/02-Boost Converter.md>) | Added boost operation, input and switch current, disconnect limits, a 5 V to 12 V example, and a waveform explorer. |
| [Buck-Boost](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/Buck-Boost%20Converter#1-select-the-output-polarity) · [source](<docs/02-Power/Regulation/03-Buck-Boost Converter.md>) | Added polarity distinctions, inverting equations and example, four-switch operation, and a waveform explorer. |
| [LDOs](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/LDOs#1-linear-regulation) · [source](<docs/02-Power/Regulation/04-LDOs.md>) | Added dropout, thermal and efficiency equations, capacitor and noise limits, a dissipation example, and an LDO explorer. |
| [AC-to-DC Converters](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/AC-to-DC-Converters#1-conversion-stages) · [source](<docs/02-Power/Regulation/05-AC-to-DC-Converters.md>) | Expanded the short AC-to-DC page with low-voltage bridge calculations, ripple and headroom example, ratings, and a ripple explorer. |
| [Battery Charging](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Power/Regulation/Battery-Charging#1-match-the-battery-chemistry) · [source](<docs/02-Power/Regulation/Battery-Charging.md>) | Added chemistry scope, charging states, C-rate and time example, power-path behavior, and an interactive charge-profile drawing. |
| [Operational Amplifiers](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Signal-Modulation/Amplifiers/op-amps#supplemental-circuit-views) · [source](<docs/03-Signal-Modulation/Amplifiers/01-op-amps.md>) | Appended instrumentation and hysteresis visual supplements for missing figure references, with links to detailed comparator guidance. |
| [Instrumentation Amplifiers](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Signal-Modulation/Amplifiers/instrumentation-amps#complete-three-amplifier-topology) · [source](<docs/03-Signal-Modulation/Amplifiers/03-instrumentation-amps.md>) | Added an original complete three-op-amp schematic, gain equation, and a first-stage saturation check. |
| [RTCs](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Signal-Modulation/Timing/RTCs#1-timekeeping) · [source](<docs/03-Signal-Modulation/Timing/RTCs.md>) | Added RTC drift equations, BCD and coherent-read checks, backup and validity handling, and a drift explorer. |
| [Bridges](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/bridges#1-translate-transactions) · [source](<docs/04-Digital-Interfaces/bridges.md>) | Added protocol/voltage translation distinctions, FIFO service calculations, transaction limits, and a bridge-path drawing. |
| [Digital Logic & Interfacing](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/DigitalGeneral#sequential-logic-study-supplement) · [source](<docs/04-Digital-Interfaces/DigitalGeneral.md>) | Expanded the sequential-logic study note with a JK table, interactive Moore/Mealy example, metastability, and implementation checks. |
| [Ethernet](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Ethernet#1-mac-phy-and-cable) · [source](<docs/04-Digital-Interfaces/Ethernet.md>) | Added Ethernet MAC/PHY architecture, layout and management checks, payload-efficiency example, and a labeled interface-path drawing. |
| [IO-Expanders](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/io-expanders#1-remote-digital-pins) · [source](<docs/04-Digital-Interfaces/io-expanders.md>) | Added I/O expander registers, startup sequence, bus-latency example, interrupt behavior, and output limits. |
| [Memory](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Memory#1-select-the-storage-function) · [source](<docs/04-Digital-Interfaces/Memory.md>) | Added memory-type comparison, page-write example, endurance arithmetic, power-loss handling, and controller constraints. |
| [UART](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Serial-Buses/UART#1-asynchronous-serial-data) · [source](<docs/04-Digital-Interfaces/Serial-Buses/01-UART.md>) | Added UART framing, clock mismatch, buffer timing, error checks, and a selectable-byte waveform. |
| [SPI](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Serial-Buses/SPI#1-clocked-serial-communication) · [source](<docs/04-Digital-Interfaces/Serial-Buses/02-SPI.md>) | Added SPI modes, setup and hold timing, shared-bus checks, a timing-budget example, and a mode explorer. |
| [I2C](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Serial-Buses/I2C#1-shared-clock-and-data) · [source](<docs/04-Digital-Interfaces/Serial-Buses/03-I2C.md>) | Added I²C framing, addressing, pull-up bounds, clock stretching, a resistor example, and a rise-time explorer. |
| [CAN](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Serial-Buses/CAN#1-controller-and-transceiver) · [source](<docs/04-Digital-Interfaces/Serial-Buses/CAN.md>) | Added CAN layers, arbitration, termination and timing checks, a two-message example, and bit-by-bit arbitration controls. |
| [RS232 to RS485](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/Serial-Buses/rs232-rs485#1-electrical-interfaces) · [source](<docs/04-Digital-Interfaces/Serial-Buses/rs232-rs485.md>) | Added RS-232/RS-485 distinctions, direction timing, common-mode range, termination arithmetic, and fail-safe checks. |
| [USB](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/Digital-Interfaces/USB#1-connector-data-and-power) · [source](<docs/04-Digital-Interfaces/USB.md>) | Added USB connector/data/power distinctions, Type-C configuration, layout and enumeration checks, and a power-budget example. |
| [The PCB Designer's Field Guide](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/PCB-Layout/Overview#bga-planning-supplement) · [source](<docs/05-PCB-Layout/01-Overview.md>) | Added an AMD UG1099 supplement covering pads, routing channels, escape geometry, fabrication, aspect ratio, power delivery, breakout references, and all nine study items. Added a BGA gap explorer. |
| [Return Paths](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/PCB-Layout/Return-Paths#1-a-signal-needs-a-return) · [source](<docs/05-PCB-Layout/02-Return-Paths.md>) | Added return-current principles, plane and via transitions, shared-inductance example, and a switchable return-path drawing. |
| [Trace Impedance](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/PCB-Layout/trace-impedance#1-characteristic-impedance) · [source](<docs/05-PCB-Layout/03-trace-impedance.md>) | Added impedance and geometry concepts, reflections, first-arrival example, fabrication workflow, and a reflection explorer. |
| [High Speed Digital](http://127.0.0.1:3000/Embedded-Encyclopedia/docs/PCB-Layout/High-Speed#1-edge-time-sets-the-problem) · [source](<docs/05-PCB-Layout/High-Speed.md>) | Added edge-time and skew analysis, routing sequence, BGA channel limits, and two timing examples. |

## Pages reviewed and left unchanged

| Page | Reason |
| --- | --- |
| [Diodes](<docs/01-Discrete-Components/03-Semicondctors/01-Diodes.md>) | Existing coverage includes diode curves, rectification, clamping, ESD steering, and interactive diagrams. |
| [BJTs and Amplifiers](<docs/01-Discrete-Components/03-Semicondctors/02-BJTs.md>) | Existing coverage includes amplifier operation, calculations, and active-region and feedback drawings. |
| [FETs (MOSFETs and JFETs)](<docs/01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx>) | Existing detailed device and design coverage includes a MOSFET calculator. |
| [Differential Amplifiers](<docs/03-Signal-Modulation/Amplifiers/02-differential-amps.md>) | Existing detailed coverage includes a differential-signal explorer. |
| [Comparators](<docs/03-Signal-Modulation/Amplifiers/comparators.md>) | Existing detailed coverage includes a hysteresis explorer. The op-amp supplement reuses this component. |
| [Digital-to-Analog & Analog-to-Digital Conversion](<docs/03-Signal-Modulation/Data-convertes/DACs.md>) | Existing broad coverage includes resolution, SAR input, and ADC driver tools. |
| [Sample-and-Hold Circuits](<docs/03-Signal-Modulation/Data-convertes/Sample-holding.md>) | Existing detailed coverage includes sample/hold timing, SAR input, driver, and autonulling visuals. |
| [Active Filters](<docs/03-Signal-Modulation/Filters/Active-filters.md>) | Existing detailed coverage includes response, RC filter, and gain-bandwidth tools. |
| [Digital Filters](<docs/03-Signal-Modulation/Filters/Digital-filters.md>) | Existing detailed coverage includes an interactive digital-filter explorer. |
| [Crystal Oscillators](<docs/03-Signal-Modulation/Timing/Crystal-oscillators.md>) | Existing detailed coverage includes an oscillator explorer. |
| [Phase-Locked Loops](<docs/03-Signal-Modulation/Timing/PLL.md>) | Existing detailed coverage includes a PLL explorer. |
| [Phil's Lab](<docs/05-PCB-Layout/Phils-lab.md>) | Left empty and unchanged, as requested. No worksheet or attributed notes were added. |

The audit checked coverage, sparse content, research notes, and opportunities for useful visuals. It was not a full independent fact check of every existing statement.

## AMD UG1099 additions

The PCB overview supplement uses [AMD UG1099](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Introduction) for BGA pad geometry, routing channels, escape layers, fabrication choices, aspect ratio, power delivery, and breakout references. Related additions appear on the return-path, trace-impedance, and high-speed pages.

Source links sit beside the relevant new material. The overview links directly to the applicable guide sections. Other additions cite primary documentation from component manufacturers.

The BGA fit calculator is an original straight-channel model. Package recommendations, layer estimates, and plane-current examples are not presented as universal fabrication rules. Confirm the selected package and fabricator limits.

The supplement answers the nine existing PCB study items. The digital logic supplement answers the sequential-logic study note. The inductor supplement qualifies the original saturation description without changing it.

## New visual component files

| File | Short summary |
| --- | --- |
| [BgaEscapeExplorer.js](src/components/BgaEscapeExplorer.js) | Adjust pad, trace, and clearance dimensions. Report nominal fit and negative margin. |
| [CanArbitrationExplorer.js](src/components/CanArbitrationExplorer.js) | Step through standard identifier arbitration. Handle either winner and equal identifiers. |
| [ChargeProfileDiagram.js](src/components/ChargeProfileDiagram.js) | Select precharge, constant current, constant voltage, and termination. |
| [I2cPullupExplorer.js](src/components/I2cPullupExplorer.js) | Compare pull-up resistance with rise-time and sink-current limits. |
| [InAmpTopologyDiagram.js](src/components/InAmpTopologyDiagram.js) | Show an original complete three-amplifier circuit with all gain resistors and reference connection. |
| [InterfacePathDiagram.js](src/components/InterfacePathDiagram.js) | Show Ethernet and protocol-bridge functional paths. |
| [NoiseBudgetExplorer.js](src/components/NoiseBudgetExplorer.js) | Combine independent noise densities and integrate a stated bandwidth. |
| [PassiveDesignExplorer.js](src/components/PassiveDesignExplorer.js) | Explore a loaded divider, transformer ratio, and common-mode choke current directions. |
| [PowerArchitectureDiagram.js](src/components/PowerArchitectureDiagram.js) | Select linear, switching, bridge-rectifier, and flyback functional paths. |
| [PowerBudgetExplorer.js](src/components/PowerBudgetExplorer.js) | Calculate capacitor inrush, LDO dissipation, and rectifier ripple with stated limits. |
| [ProtectionPathDiagram.js](src/components/ProtectionPathDiagram.js) | Show the fuse, TVS, protected circuit, and entry return path. |
| [RailSequenceExplorer.js](src/components/RailSequenceExplorer.js) | Adjust reset or power-good delay. Show an unmet supply condition. |
| [ReturnPathExplorer.js](src/components/ReturnPathExplorer.js) | Compare a continuous reference plane with a slot and return-current detour. |
| [RtcDriftExplorer.js](src/components/RtcDriftExplorer.js) | Calculate positive and negative time error from a constant frequency error. |
| [SequentialLogicExplorer.js](src/components/SequentialLogicExplorer.js) | Change a request and apply clock edges to compare defined Moore and Mealy outputs. |
| [SerialTimingExplorer.js](src/components/SerialTimingExplorer.js) | Select UART data and rate, or SPI clock polarity and sampling phase. |
| [ShuntExplorer.js](src/components/ShuntExplorer.js) | Compare Kelvin sensing with shared copper and input offset. |
| [SwitchingConverterExplorer.js](src/components/SwitchingConverterExplorer.js) | Show buck, boost, and inverting CCM current waveforms. Hide estimates outside CCM. |
| [TraceReflectionExplorer.js](src/components/TraceReflectionExplorer.js) | Compare resistive, open, and short loads at the first wave arrival. |

## Other project file changes

| File | Short summary |
| --- | --- |
| [LearningEquation.js](src/components/LearningEquation.js) | Render only the new equations with local KaTeX and accessible MathML. The existing Markdown parser is unchanged. |
| [LearningTools.js](src/components/learning/LearningTools.js) | Shared labeled controls, live results, accessible SVG descriptions, and diagram primitives. |
| [LearningTools.module.css](src/components/learning/LearningTools.module.css) | Scoped Field Guide styling, light/dark colors, responsive controls, focus indicators, and scrollable detailed drawings. |
| [calculations.mjs](src/components/learning/calculations.mjs) | Pure calculation functions with explicit SI-unit inputs. |
| [package.json](package.json) and [package-lock.json](package-lock.json) | Pin KaTeX 0.18.7 and its dependency tree for equation rendering. |
| [content-originals.json](scripts/content-originals.json) | Record the base commit, original byte lengths, and SHA-256 hashes for all 51 documents. |
| [verify-content-additions.mjs](scripts/verify-content-additions.mjs) | Check original prefixes, the prohibited word, equation validity, and the unchanged Phil’s Lab file. |
| [learning-models.test.mjs](scripts/learning-models.test.mjs) | Ten numerical tests covering examples, units, model boundaries, bit order, and arbitration. |
| [CONTENT_EXPANSION_REVIEW.md](CONTENT_EXPANSION_REVIEW.md) | This review guide and complete project change summary. |

Draft-generation scripts, a full original snapshot, route reports, and the build log are in the parent workspace. They are review support files outside the repository and are not site assets.

## Validation

- Production build: passed.
- Original-content check: all 51 document prefixes preserved byte for byte; 39 additions; 50 valid equations; Phil’s Lab unchanged.
- Calculation tests: 10 passed, zero failed.
- All 51 article routes returned HTTP 200 with article headings, unique article IDs, no equation error markup, and no invalid numeric output.
- All 30 unique local image, script, and stylesheet URLs found on those pages returned HTTP 200.
- All 40 local preview links in this guide were checked, including the 39 links to addition headings.
- Browser checks covered the new controls, including invalid CCM, LDO headroom, large ripple, I²C limits, CAN ties and either winner, UART bit order, SPI phase, zero noise, negative drift, and supply faults.
- Representative desktop and 390-pixel mobile layouts were checked in the browser. Light and dark themes were inspected. Detailed diagrams scroll inside their panels.
- No browser errors were reported during the interactive checks.

Run the repeatable source and calculation checks from this project directory:

```powershell
node scripts/verify-content-additions.mjs
node --test scripts/learning-models.test.mjs
```

The preservation manifest records the exact local source bytes before this update. A future checkout that converts line endings needs a corresponding line-ending-aware comparison with the recorded base commit.
