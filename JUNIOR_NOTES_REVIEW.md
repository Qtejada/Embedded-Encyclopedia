# Junior notes integration

Status: reviewed locally and approved by the owner for GitHub publication on September 11, 2026. Prepared on branch `codex/junior-notes`.

## Start here

Open the [five-stage processor lesson](https://qtejada.github.io/Embedded-Encyclopedia/docs/Digital-Interfaces/RISC-V-Pipeline). Its interactive tools trace instructions and show forwarding, stalls, and canceled instructions.

A useful study order is assembly, pipeline operation, caches, then operating systems. For analog analysis, start with continuous signals before state-space models.

## Existing writing

All 62 original articles retain their complete original byte sequences as prefixes. Additions to existing articles appear after the previous writing. Phil's Lab is unchanged.

The original rendered text and heading sequences also remain intact. All 490 historical inline subsection links still pass their checks.

## New lessons

| File under docs | Short change summary |
| --- | --- |
| `04-Digital-Interfaces/RISC-V-Pipeline.md` | Five stages, boundary registers, control signals, forwarding, load-use stalls, branch cancellation, timing, and a study sequence. |
| `04-Digital-Interfaces/RISC-V-Assembly.md` | Register conventions, signed immediates, arrays, a sum loop, stack frames, nested calls, and one instruction encoding. |
| `04-Digital-Interfaces/Processor-Memory.md` | Cache lines, placement, address fields, conflict traces, replacement, write policies, average access time, and coherence. |
| `04-Digital-Interfaces/Operating-Systems.md` | Processes, threads, pipes, shared updates, locks, deadlock, paging, file metadata, and power-loss consistency. |
| `04-Digital-Interfaces/CMOS-Design.md` | Transistor networks, RC delay, wire delay, buffer sizing, switching power, pass gates, dynamic nodes, and clock skew. |
| `04-Digital-Interfaces/Sequential-Design.md` | VHDL processes, signals and variables, a 101 sequence detector, state encoding, and simulation versus synthesis. |
| `03-Signal-Modulation/Signals-and-Systems.md` | Continuous-time properties, convolution, initial conditions, natural modes, Laplace analysis, Fourier series, energy, and power. |
| `03-Signal-Modulation/State-Space.md` | State equations, an RLC model, matrix response, hidden unstable modes, rank tests, feedback, and local linearization. |

## Additions to existing articles

| Article | Short change summary |
| --- | --- |
| Diodes | Added an iterative operating-point example. Recalculated its values from the stated exponential model. |
| BJTs | Added loaded gain, source attenuation, and emitter-degeneration examples with explicit assumptions. |
| Computer Architecture | Added exact-subsection links to the pipeline, assembly, cache, and operating-system lessons. |
| Digital Logic | Added exact-subsection links to CMOS delay, register timing, and the VHDL detector. |
| Firmware | Added pointer ownership, dynamic resizing, allocation limits, data-structure trade-offs, and EOF handling. |
| Memory | Added the distinction between cache misses, virtual-address translation, and page faults. |

## Drawings and interactions

* `PipelineExplorer.js` and `pipelineModel.mjs`: four selectable programs, cycle controls, forwarding selection, register and memory state, and a timing table.
* `ProcessorDatapath.js`: selectable ADD, LW, SW, and BEQ paths through the processor. Adjusted return paths so arrows avoid explanatory labels.
* `ConvolutionExplorer.js`: a movable reversed pulse, shaded overlap, and the triangular convolution result.
* `LearningTools.module.css`: constrained selector sizing to prevent overflow on narrow screens.

The pipeline is an explicit teaching model. It has separate one-cycle memories, EX-stage branch resolution, and no exceptions or cache misses. It is not a complete RISC-V emulator.

The new drawings are original explanations. They are not recovered notebook images.

## Source review and limits

The source is the 581-page `Junior.pdf`. Every page received a visual topic overview. Selected pages received full-size checks, and readable operating-system notes received text checks.

This was selective integration, not a complete line-by-line transcription. The machine-readable record is `scripts/junior-source-audit.json`. It gives every page a review level and maps all nine course ranges to integration decisions.

| PDF pages | Course | Integration decision |
| --- | --- | --- |
| 1–114 | Circuit Design | Retained existing broad coverage. Added selected diode and transistor examples. |
| 115–128 | Operating Systems | Added the useful process, memory, concurrency, and storage concepts. |
| 129–220 | Computer Architecture | Prioritized five-stage RISC-V, assembly, calls, and caches. |
| 221–331 | Signals and Systems | Added continuous-time foundations. Linked existing discrete-time explanations. |
| 332–400 | Systems Programming | Added useful memory and concurrency material without reproducing repetitive syntax exercises. |
| 401–460 | VLSI | Added delay, power, and timing concepts. Did not reconstruct process-specific layouts from missing figures. |
| 461–530 | Digital Design | Added VHDL and sequence detection. Linked existing logic and state-machine tools. |
| 531–572 | System Analysis | Added state-space analysis and local linearization. Avoided duplicating the signals lesson. |
| 573–581 | Advanced Architecture | Integrated surviving ISA and pipeline concepts into the processor lessons. |

Destroyed images remain unavailable. Incomplete figures and handwritten program fragments were not treated as complete technical specifications.

The diode calculation on page 56 survives without its circuit image. The article explicitly states an assumed series circuit consistent with the equations. Its values were recalculated rather than copied from rounded handwriting.

New examples distinguish assumptions from device guarantees. Qualifications include activity-factor definitions, Elmore time constants versus threshold delay, hidden unstable modes, and the limits of page-fault and journaling claims.

Primary references are linked in the lessons. They include the RISC-V specification and ABI, university circuit and systems notes, and vendor synthesis documentation.

## Validation

* Production build passed.
* All 62 original article prefixes are byte-exact. Phil's Lab is unchanged.
* All 490 historical subsection links and original rendered text checks passed.
* All 44 existing local PNG placements still reserve image dimensions.
* All 70 article routes, 30 local assets, and 1518 local article links passed HTTP and rendered-anchor checks.
* All 22 model tests passed. Nine cover the new pipeline, including 60 generated programs checked in both forwarding modes against an independent sequential interpreter.
* Automated style checks passed for the 14 new or expanded articles. They check sentence and paragraph length, prose semicolons, and the prohibited word.
* The new prose received an editorial review for technical meaning and consistent terms. Automated checks are not an ASD-STE100 certification.
* Browser checks covered all eight new lessons at a 390-pixel viewport without document overflow or equation errors. Representative tools were visually checked on desktop and mobile, in light and dark themes.
* The pipeline controls produced the expected final register and memory values. Convolution controls gave zero outside overlap and one at the peak.
* The VHDL and assembly examples received manual code review. A VHDL simulator and a RISC-V target toolchain were not run. No synthesis or hardware timing validation is claimed.

The build still reports existing dependency-age and Docusaurus deprecation notices. It completes successfully.

## Supporting files

* `scripts/junior-originals.json`: original source hashes and prefix lengths.
* `scripts/junior-rendered-originals.json`: original rendered article text hashes and lengths.
* `scripts/junior-source-audit.json`: page-review levels and course integration decisions.
* `scripts/verify-junior-additions.mjs`: preservation and new-prose checks.
* `scripts/pipeline-model.test.mjs`: pipeline behavior tests.
* `scripts/verify-inline-links.mjs`: preserves historical checks while allowing appended Junior material.
* `scripts/interview-route-report.json`: refreshed route and rendering inventory, including the new lessons.

## Local review

Use `npm run serve` from the repository after `npm run build` to serve the current build. The preview uses the existing `/Embedded-Encyclopedia/` base path.

No source PDF, scratch rendering files, or destroyed-image placeholders were added to the site.
