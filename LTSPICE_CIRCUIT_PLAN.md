# LTspice learning circuit plan

The owner approved batch one and authorized completion of all remaining circuits without intermediate review. Use batches for simulation and validation.

Each example should teach a component principle or a reusable circuit block. Large transistor circuits are not the main objective.

## Complete and published

- Basic NPN BJT current mirror. The owner tested the schematic, simulation, downloads, and viewer successfully.

## Batch one: approved

1. Half-wave rectifier with reservoir capacitor choices.
2. Full-wave bridge rectifier with reservoir capacitor choices.
3. JFET self bias with source resistor choices and a supply sweep.
4. N-channel and P-channel load switches with load resistor choices.
5. Common-emitter amplifier with emitter bypass choices.

## Completed library coverage

| Group | Examples |
| --- | --- |
| Diodes | Zener regulator, diode limiter and clamp, precision rectifier |
| BJT fundamentals | Transistor switch, emitter follower, common-base amplifier, emitter degeneration with parameter variation |
| MOSFET fundamentals | Common-source amplifier, source follower, gate charging and switching loss |
| JFET fundamentals | Transfer and output curves, common-source amplifier, source follower, constant-current source, JFET input stage with feedback |
| Mirrors and current sources | PNP mirror, emitter-degenerated mirror, Wilson mirror, cascode mirror, MOSFET mirror, op-amp current source |
| Analog amplifier blocks | Differential pair, differential pair with a current-source tail, mirror active load, cascode amplifier, complementary emitter follower, class AB output stage |
| Op-amp building blocks | Inverting and noninverting amplifiers, buffer and loading, summing amplifier, difference amplifier, integrator, differentiator, transimpedance amplifier |
| Feedback and limits | Gain bandwidth, slew rate, output clipping, capacitive-load stability, compensation |
| Filters and timing | RC low-pass and high-pass filters, active low-pass filter, active high-pass filter, band-pass filter, comparator with hysteresis, transistor Schmitt trigger, short-pulse generator, pulse extension |
| Combined blocks | Small feedback amplifier with identified stages, JFET and BJT feedback stage, JFET input pair inside an op-amp feedback loop |

All groups are implemented. Related variants share a circuit where this gives a clearer comparison. See LTSPICE_LIBRARY_REVIEW.md for all 48 additions.

The rectifier request is interpreted as half-wave rectification. A transistor half bridge is a separate optional switching example.

## Delivery standard

- Preserve existing article text and append useful explanations.
- Use the site's simplified technical writing rules.
- Supply an editable ASC, a portable CIR, PLT settings, README, CSV data, and validation record.
- Include component parameters and use standard LTspice symbols. Op-amps use the installed UniversalOpamp2 library.
- Run the actual schematic in LTspice and verify generated connectivity.
- Compare against a refined simulation and independent circuit checks.
- Display saved results honestly. The website is not a browser-based LTspice engine.
- Check the build, existing links, article preservation, and desktop/mobile presentation.
- Document all changes in a short review file.
