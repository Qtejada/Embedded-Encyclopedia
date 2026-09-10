---
title: Semiconductor Fabrication and Packaging
sidebar_position: 7
---

# Semiconductor Fabrication and Packaging

## Wafer, die, and package

A **wafer** is a semiconductor substrate that carries many repeated circuits during manufacture. A **die** is one separated circuit region.

A **package** protects a die and connects it to the board. It also carries heat and mechanical stress between the die and its environment.

| Package form | Benefit | Main constraint |
| --- | --- | --- |
| Dual inline or other through-hole package | Accessible leads and strong attachment | Board area and lead parasitics |
| Small-outline or gull-wing package | Inspectable surface joints | Limited connection density |
| Quad flat no-lead package | Compact size and short connections | Hidden underside joints and thermal pad process |
| Ball grid array (BGA) | Many connections under the package | Escape routing and hidden joint inspection |

Package selection affects assembly, electrical parasitics, heat flow, and repair. A small package can demand more board layers or a more capable assembly process.

## Fabrication steps

Fabrication repeatedly forms, patterns, and modifies thin layers. A simplified sequence includes deposition, lithography, etching, [doping](<../00-Foundations/04-Fields-and-Materials.md#energy-bands-and-doping>), and planarization.

**Photolithography** transfers a pattern into a light-sensitive resist. **Etching** removes selected material after pattern formation.

**Atomic layer deposition (ALD)** uses repeated self-limiting surface reactions to control film growth. It can coat three-dimensional structures with a thin layer.

Interconnect layers connect devices within the die. Wafer tests identify electrical defects. Dicing, attachment, interconnection, and final tests produce packaged parts.

See [ASML fabrication steps](https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps) for the repeated process sequence.

A process node name describes a technology generation. A name such as 3 nm does not mean every transistor dimension equals 3 nm.

Optical resolution depends on wavelength, numerical aperture, and process factors. Multiple patterning and computational corrections can produce features below a simple wavelength comparison.

See [ASML computational lithography](https://www.asml.com/en/products/computational-lithography) for pattern correction methods.

## Yield and integration

**Yield** is the fraction of manufactured units that meet the defined requirements. Defects, process variation, and test limits affect it.

A larger die offers more area for defects and produces fewer dies per wafer. Exposure-field limits, power delivery, and heat removal also constrain size.

**Chiplets** divide a system among smaller dies. They can combine different processes and improve reuse. Die-to-die links add packaging, power, latency, and test requirements.

Three-dimensional integration stacks active dies or connects multiple levels of active circuitry. It increases density but makes cooling and test access more difficult.

**Package on package (PoP)** stacks separate packages. A common arrangement places memory above a processor package. Short connections and reduced board area are useful benefits.

The upper package can obstruct a heat path. The thermal design must consider both packages and the actual board assembly.

See [Intel advanced packaging](https://www.intel.com/content/www/us/en/foundry/packaging.html) for integration approaches.

## Die connections and power

**Bond wires** connect die pads to package conductors. Their length and loop geometry add inductance. Their resistance and thermal limits constrain current.

Several wires or wider conductors can share a high-current connection. Current sharing and heat removal still require qualification.

**Flip-chip** assembly connects a die face directly through bumps. Shorter interconnects can reduce parasitics and distribute connections across the die area.

See [TI flip-chip packaging](https://www.ti.com/document-viewer/lit/html/SSZT078/GUID-58E62D19-D5C5-443C-8A27-321FE9515B58).

Package resistance produces a voltage drop under load. Package inductance produces voltage change when current changes. Local die ground can differ from board ground.

Use the package power network, board planes, and decoupling as one system. A board-level ground label does not remove interconnect impedance.
