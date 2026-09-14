---
title: The PCB Designer's Field Guide
sidebar_label: PCB Field Guide
---

import PcbStackupExplorer from '@site/src/components/PcbStackupExplorer'

# The PCB Designer's Field Guide

*A Comprehensive Manual for Layout and High-Speed Design*

*Source: Phil's Lab Notes and Best Practices*

This guide follows a practical workflow for **printed circuit board (PCB)** design. For each board, check the rules against the actual component datasheets, interface requirements, and fabrication documents.

---

## Chapter 1: The Blueprint (Schematic Capture)

### 1.1 Organization and Navigation

* **Naming:** Give each page a page number and a specific description of its contents. For example, use `03_Power_Regulation`. This convention makes the page easy to find.
* **Connectivity:** On each port, identify the page to which the port connects.
* **Revisions:** Put the revision name in both the PCB project name and the schematic project name.
* **Cover Page:** Create a schematic cover page that contains an index and other project-level information.
    * Create a block-diagram page for the schematic.
    * Add a revision block that records the changes between revisions.
* **Context:** Add a title to each functional section of the schematic.
* **Notes:** Use note boxes for layout instructions, critical information, general information, and cautions. Make the type of each note clear.

### 1.2 Net Naming Rules

* **Power Rails:** Put a `+` sign at the start of each positive power-net name. This convention helps with PCB net grouping.
* **Voltage Levels:** Include the voltage level in each power-net name, even when the complete name is long.
    * **Example:** `+1V2_ETH_POWER`

### 1.3 Verification

* **Parameter Check:** Add parameters that show whether you checked the schematic symbol and the PCB footprint. Use these parameters to record verification.

---

## Chapter 2: The Foundation (Stackup and Layers)

### 2.1 The Stackup Strategy

* **Plane Definition:** A plane is a copper region that connects to one net.
* **Signal-Layer Planning:** When a design needs four signal layers, use the top layer, the bottom layer, and two internal signal layers.
* **Four-Layer Board:** For a physical four-layer board, put signal routing on the top and bottom layers. Use the two inner layers for the reference and power functions that the design needs.
* **Fabrication Approval:** Agree on the stackup with the PCB fabricator before you route controlled-impedance signals. Specify the material, copper thickness, dielectric thickness, layer symmetry, and manufacturing tolerances.
* **[Electromagnetic Interference](<./High-Speed.md#eye-diagrams-and-interference>):** A ground layer can extend near the board edge when the electromagnetic interference (EMI), creepage, clearance, and fabrication requirements permit it. Pull a power plane back from the board edge when this action reduces edge radiation and does not violate another requirement.

### 2.2 Recommended Stackups

These stackups are starting examples, not layouts that work for every board. Agree on the final materials and layer dimensions with the fabricator, then use those actual dimensions in the impedance calculations.

**12-Layer Stackup:**

1. Signal
2. Ground solid plane
3. High-speed signals and important buses
4. Ground solid plane
5. Power
6. Power or mixed with signals
7. Power or mixed with signals
8. Power
9. Ground solid plane
10. Signal with high-speed or important buses
11. Ground solid plane
12. Signal

**10-Layer Stackup:**

This example uses ten copper layers and keeps the signal, ground, power, and mixed-routing functions:

1. Signal
2. Ground solid plane
3. Signal
4. Power solid plane
5. Power or mixed with signals
6. Power or mixed with signals
7. Power solid plane
8. Signal
9. Ground solid plane
10. Signal

As an alternative 12-layer variant, add one signal layer between Layers 3 and 4 and another between Layers 7 and 8. Renumber the layers and obtain fabricator approval before use.

**6-Layer Stackup:**

1. Signal
2. Ground solid plane
3. Signals
4. Power
5. Ground solid plane
6. Signal

**4-Layer Stackup:**

1. Important signals
2. Solid ground plane
3. Power
4. Signal

<PcbStackupExplorer />

### 2.3 High-Speed Physics

* **Dielectric Thickness:** Where the fabricator can manufacture it reliably, use a small dielectric thickness between a high-speed signal layer and its reference plane.
    * **Benefit:** A close reference plane confines more of the electromagnetic field. This arrangement can reduce crosstalk.
* **Crosstalk Physics:** A smaller distance from a conductor to its reference plane can reduce crosstalk. More layers can make closer reference planes and greater signal separation possible, but the layer count alone does not reduce crosstalk. Increase the distance between unrelated tracks when necessary.
    * **Transition Speed:** Crosstalk depends strongly on signal rise and fall time, not only on clock frequency. Faster edges can generate more coupled noise.
    * **Reference Planes:** A continuous ground plane is usually the preferred reference. A close reference plane pulls the field lines toward that plane and away from adjacent tracks.

:::info Deep Dive: HDI Stackups
Use an **HDI stackup guide** from the selected fabricator when the design needs blind vias, buried vias, or microvias.

**High-density interconnect (HDI)** construction uses features such as laser-drilled **microvias** and blind or buried vias.

* **Standard plated through-hole via:** The via goes from the top layer to the bottom layer.
* **HDI via:** A via can connect Layer 1 to Layer 2, or Layer 2 to Layer 3, when the approved fabrication process permits that construction.
* **Reason to use HDI:** HDI can be necessary for a high-pin-count **ball-grid array (BGA)**. A conventional drilled hole can consume routing space on every layer and can prevent signal escape between nearby BGA pads.
:::

---

## Chapter 3: Component Placement Strategy

Start placement with the largest components, but apply the mechanical and electrical constraints before you finalize their positions.

### 3.1 Mechanical and Critical Constraints

* **Mechanical First:** Place mounting holes, connectors, and other mechanically constrained items first.
    * **Warning:** Include the size and bend radius of the connected cables. A cable can require much more space than its connector.
* **Mounting Holes:** Connect a mounting hole to board ground or chassis only when the mechanical, safety, shielding, and EMI plan needs that connection. Do not make this connection by default.
* **Outlines and Land Patterns:** Use the component-manufacturer recommendation, a land-pattern guideline, or an relevant standard from IPC, the electronics-industry standards organization. Keep copper pads within the approved land pattern. When the assembly process needs more clearance, make the documented assembly outline and courtyard slightly larger than the component body. Do not enlarge the copper pads for this purpose. Use assembler-approved tolerances. Make the assembly outline, courtyard, polarity marks, and connector body outline clear.

### 3.2 Thermal and Design-for-Manufacturing (DFM) Rules

* **Heat Management:** A central processing unit (CPU) usually dissipates more heat than a typical [microcontroller](<../04-Digital-Interfaces/Embedded-Systems.md#select-a-processor>) unit (MCU). Identify the thermal path through the package, copper, vias, heat sink, enclosure, and airflow. On a vertical board that uses bottom-to-top natural convection, an upper location can help cool a hot component because heated air rises. Use this placement only when the installed orientation and airflow support it. Use enclosure-orientation and airflow analysis for other installations. Plan a heat sink when the thermal analysis needs one.
* **Height:** Record all component heights. Put tall components where the enclosure, airflow, assembly process, and cable access permit them. For a vertical assembly with bottom-to-top natural convection, the upper enclosure region can be suitable when all other constraints permit this position.
* **CPU Space:** Keep sufficient placement and routing space around the CPU and memories. Use previous designs for the first area estimate. Verify the required area with package-escape studies and routing-density estimates.

### 3.3 Critical Component Rules

* **Power Supplies:** Read the device-specific PCB layout guidelines, especially for power supplies. Identify the high-current switching loops and keep them small. When you route on other layers below a supply, make sure that the routes do not disturb the supply or interrupt its [return path](<./02-Return-Paths.md#1-a-signal-needs-a-return>). Use a clean, fabricator-approved stackup.
* **[Decoupling Capacitors](<../01-Discrete-Components/01-Passives/02-Capacitors.md#bypass--decoupling>):** Put decoupling capacitors close to the relevant power pins. Use short, wide connections and a low-inductance current loop between the power pin, capacitor, and reference plane.
* **Passives:**
    * **0 Ω resistors, beads, and ferrites:** Put these parts close to the relevant power pins, decoupling capacitors, or planes, as the circuit needs.
    * **Precision resistors and capacitors:** Use short tracks where track resistance, leakage, noise pickup, or [parasitic capacitance](<../00-Foundations/00-Foundations.md#5-parasitic-effects>) can cause an error.
    * **Series-termination resistors and alternating-current (AC) coupling capacitors:** Put a series-[termination resistor](<./03-trace-impedance.md#distributed-loss-and-termination>) close to its output driver. Put an [AC-coupling](<../01-Discrete-Components/01-Passives/02-Capacitors.md#ac-coupling-blocking>) capacitor at the location specified by the interface standard or device guide.
* **Crystals and Oscillators:** Put crystals and oscillators close to their device pins. Keep the crystal tracks as short as the device guide needs.
    * **Routing Rule:** Do not route below a crystal when the device guide specifies a keepout. Avoid routes below or between crystal-component pads when this routing increases coupling or parasitic capacitance.
* **Connectors:** Use a through-hole connector when the mechanical load and assembly process make it the more robust choice. Use a surface-mount connector when its mechanical retention, signal-integrity performance, density, and manufacturing process satisfy the design.

:::danger ESD Placement Rule
* **Location:** Put the relevant electrostatic-discharge (ESD) protection device close to the connector or board-entry point. Route the transient path to the protection device before the protected signal branches to other circuits.
* **Reason:** A long unprotected route increases parasitic inductance and exposes more components before the surge reaches the protection device. A protected component can fail before a remotely placed protection device clamps the event.
* **Implementation:** Follow the transient-voltage-suppressor (TVS) manufacturer guidance for the path to ground or chassis. Keep that discharge path short and low inductance.
:::

---

## Chapter 4: The Routing Workflow

This workflow separates making connections from improving the routes. Before routing critical signals, however, settle the manufacturing stackup and each interface's impedance, spacing, and timing-mismatch rules. A **50 Ω impedance target** needs the right trace geometry from the start, not a correction at the end.

### 4.1 Phase 1: Connect All Pins

1. Set up the basic design rules.
2. Set up a basic stackup. Before critical routing, replace it with the approved stackup.
3. Make the fanout below the CPU.
4. Make the preliminary memory layout.
5. Make the fanout below the other BGAs.
6. Make the CPU fanout for large and wide buses. Orient each breakout toward its bus destination or routing channel, and then route the bus.
7. Make the CPU fanout for differential pairs. Orient each breakout toward its differential-pair destination or routing channel, and then route the pair.
8. Make the remaining CPU fanout.
9. Make the fanout for all other components.
10. Connect the long buses.
11. Make the local connections.
12. Connect the remaining signals.

**Via Planning:** Put the planned ground and power vias in position before track routing, and reserve space for other known vias. Early via planning can prevent rework. Do not finalize every signal via before routing. Add and adjust vias as required by the return-path, current, inductance, thermal, and fabrication constraints.

### 4.2 Phase 2: Improve the Layout

1. Set the final, fabricator-approved stackup. For critical controlled-impedance routing, complete this step before the relevant routes in Phase 1.
2. Set the final differential-pair rules. Redraw all differential pairs that do not meet those rules.
3. Do the preliminary memory length matching.
4. Do the preliminary differential-pair length matching.
5. Do the preliminary length matching for all other signals that have a specified length or skew requirement.
6. Reduce routing congestion and increase track spacing where the design rules or crosstalk limits require it. Keep the required controlled geometry.
7. Clear all relevant electrical **Design Rule Check ([DRC](<./04-Manufacturing-and-Test.md#design-for-access>))** violations.
8. Create power planes and polygons. Check the high-current tracks.
9. Check each net for connectivity, clearance, return-path continuity, and compliance with the relevant design rules.
10. Add the required same-net ground stitching vias. See Section 5.4.
11. Do the final length matching for non-memory signals that have a specified length or skew requirement.
12. Do the final memory length matching.
13. Lock the important tracks.
14. Clear the remaining relevant DRC violations.
15. Add the company name, copyright, year, board name, and version.
16. Add the manufacturing information.
17. Verify each controlled-impedance trace geometry against the required impedance. For a **50 Ω** target, adjust the width and spacing with the approved stackup model. The **50 Ω** value is an example. Use it only when the interface needs it.

---

## Chapter 5: High-Speed Design Rules

### 5.1 Impedance Control

* **Rule:** Maintain the single-ended or differential impedance that each interface needs. Common examples include **50 Ω or 55 Ω single-ended** and **85 Ω, 90 Ω, or 100 Ω differential**. No one value applies to all high-speed signals.
* **Method:** Get the impedance requirement from the interface specification and device guide. Use the final fabricator-approved stackup. Enter the trace geometry in the Altium or KiCad design rules, or use the fabricator field solver. Confirm the manufactured impedance tolerance with the fabricator.
* **Minimums:** A **0.2 mm** trace is a common fabrication example, and some high-speed signals use **50 Ω or 55 Ω**. These values are board-dependent examples, not universal limits. Use the fabricator capability and impedance calculation for the actual minimum.

### 5.2 Length Matching (Skew Control)

* **Differential-Pair Separation:** Keep a differential pair far enough from unrelated data signals. Keep the spacing within the pair at the value used for its impedance calculation.
* **Within a Pair:** Keep the pair geometry symmetrical in each routed segment. Match the positive and negative paths by electrical delay to meet the interface skew limit. Equal length on each layer is a useful objective when both paths use the same layer and via structure. Use the total electrical delay for final verification because layer velocity and via structure can make equal geometric lengths electrically unequal.
* **Technique:** A **bump** is a length-tuning segment that adds distance to the shorter route.
    * One broad length-tuning segment on the shorter track is usually preferable to many small segments when the geometry and impedance remain acceptable.
    * **Three-Times-Width Value:** The **three-times-track-width** value is not a design rule because its measurement points are not defined. Use this value only when the interface, design-tool, or fabricator guidance defines the measurement and validates the geometry.
    * Put the length-tuning segment on a straight section near the via and near the measured mismatch. This method can remove the need for a separate tuning segment farther along the route.
    * **Geometry:** Do not use a 90-degree meander geometry for matching controlled routes. Route the pair together. Use broad, separated length-tuning segments. Do not use a dense serpentine pattern.
    * **Wave Spacing:** Do not add a tightly packed serpentine route. The **five-times-track-width** value is not a design rule because it does not specify an edge-to-edge or center-to-center measurement. Use this value only when the interface, design-tool, or fabricator guidance defines the measurement and validates the spacing, crosstalk, and timing.
* **Global Rule:** Length-match buses and differential pairs that have a specified relationship and skew limit. Do not length-match unrelated signals. Check the device or interface design guide for the minimum route length, maximum route length, and allowed mismatch.
* **Memory:** Some double-data-rate (DDR) memory pins require length or delay matching. Apply the controller and memory-device routing groups and tolerances.

:::info Uncoupled Lengths
This section defines **uncoupled lengths** and explains their effect on differential signals.

Keep the two traces of a **differential pair**, such as Universal Serial Bus (USB) D+ and D−, close together so their fields remain coupled. They may need to separate briefly near pins or vias to reach their pads.

* **Uncoupled length:** The distance for which the positive and negative conductors do not maintain the intended coupled geometry.
* **Risk:** Separating the pair changes its impedance and can cause [reflections](<./03-trace-impedance.md#3-reflections>). Imbalance can also turn some of the differential signal into a shared, common-mode signal. A **90 Ω differential pair**, for example, may transition to two segments designed for **50 Ω single-ended impedance**, but the numbers do not follow automatically. Check the actual stackup and geometry.
* **Goal:** Minimize the uncoupled length. Keep the pair together until the final connection, within the pad, escape, and fabrication constraints. Maintain the coupled geometry until the last millimeter where practical.
:::

### 5.3 Crosstalk and Separation

* **Parallel Tracks:** Identify tracks that run parallel. Where the stackup and return paths permit it, route one signal layer mainly horizontally and the adjacent signal layer mainly vertically. This arrangement reduces long broadside-parallel sections. Do not use orthogonal routing as a substitute for adequate spacing and reference planes.
* **Isolation:** Keep unrelated differential pairs far enough apart. Give clocks more separation when their fast edges can couple into other signals. Isolate sensitive asynchronous signals, such as interrupt and reset signals, as the noise-margin analysis needs.
* **Inter-Integrated Circuit Bus:** The Inter-Integrated Circuit ([I2C](<../04-Digital-Interfaces/Serial-Buses/03-I2C.md#1-shared-clock-and-data>)) clock (`SCL`) and data (`SDA`) are separate single-ended, [open-drain](<../04-Digital-Interfaces/DigitalGeneral.md#output-architectures>) signals, not a differential pair. Leave enough space between them and nearby signals to limit interference.
* **Integrated-Circuit Pads:** Use the package-manufacturer land pattern or an IPC land-pattern guideline or relevant standard. Do not reduce the pad-to-pad clearance below that approved pattern. Match the footprint to the package lead and pin geometry.

### 5.4 Return Paths

* **Reference-Transition Vias:** Give every high-speed signal a short, continuous return path when it changes layers.
    * **Same-Net Reference:** When a signal changes between two layers that both use ground as the reference, put a ground stitching via close to the signal-transition via. A starting point is **one nearby stitching via for each track** that changes its reference layer. Verify the required number and location from the return-current geometry.
    * **Different Reference Nets:** A signal can change from a ground-referenced layer, such as Layer 1, to a power-referenced layer, such as Layer 4. Never connect the two reference planes directly with a stitching via. If a route must make this reference change, use a low-inductance reference-plane capacitor where the return current transfers, when the power-distribution design permits it. A safer option is to change the route or stackup so that the signal keeps the same reference net. Follow the interface and [power-integrity](<./High-Speed.md#power-integrity-as-an-impedance-budget>) guidance.
    * **Placement:** Minimize the distance between the return-path feature and the signal-transition via. Apply the maximum distance in the interface or device guide.
* **Plane Integrity:** Do not route a high-speed signal across a split, void, or edge in its reference plane. A broken reference path forces the return current to take a longer route and can cause EMI, crosstalk, and impedance problems. Keep reference and ground planes as continuous as the complete design permits.

### 5.5 Routing Logistics

* **Groups:** Route related signals in groups. For example, route all **Peripheral Component Interconnect Express (PCIe)** signals as a group. Keep the group on the same layer where the interface constraints permit it.
* **Topology:** Route each signal group with the topology that its interface needs. Keep related Secure Digital (SD) card tracks on the same layers when that arrangement gives consistent references and delay.
* **Layer Switching:** When tracks must change layers, you can route the signals on each layer first and then put the transition via at an appropriate connection point. Verify the via location and return path before you finalize the route.
* **Crossing:** For crowded routes, one option is to use straight runs on two selected layers or board surfaces, joining each connection with an aligned via. Check that the via pattern, clearances around vias (antipads), coupling, return paths, and fabrication rules allow this approach.
* **Edge Rule:** Keep routes away from the PCB edge and holes by the distance required for signal integrity, mechanical processing, creepage, clearance, and fabrication.
* **Angles:** Avoid 90-degree corners on controlled-impedance routes as a consistent layout convention. A single 90-degree corner is not automatically a design failure. Use 45-degree corners or arcs when they help maintain geometry and manufacturing quality.

---

## Chapter 6: Via Technologies and BGA Fanout

### 6.1 BGA Fanout Strategy

* **Sequence:** A center-out escape is one BGA fanout strategy. Start at the center and move toward the package edge when this sequence makes the congestion easier to control.
* **Columns:** In the middle of the BGA, align vias in columns where the pad pitch and fabrication rules permit it. Columns can leave channels for components or routes on the other side.
* **Edges:** At the package edge, make an escape that lets all relevant pins leave the package without unnecessary vias.
* **Density:** Use **one via per pin** as a fanout strategy when space permits. This is not a universal rule. If space needs a shared via, share it only between connections on the same net and only after you verify current, inductance, return path, assembly, and fabrication limits. Never share one via between different nets.

### 6.2 Via Technology Guide

:::info Deep Dive: Via Types
The four principal via types differ in span, fabrication method, cost, and routing density:

1. **Plated through-hole via:** A mechanically drilled, plated via that goes from the top layer to the bottom layer.
    * **Advantage:** It is usually the least expensive and simplest via type.
    * **Disadvantage:** Its barrel and clearance features consume space on every layer, even when the signal connects only Layer 1 to Layer 2.
2. **Blind via:** A via that connects an outer layer to an inner layer, such as the top layer to Layer 3, and stops at that layer.
    * **Advantage:** It preserves routing space on layers below its final layer.
    * **Disadvantage:** It is more expensive than a conventional plated through-hole via.
3. **Buried via:** A via that connects inner layers only, such as Layer 3 to Layer 4. It is not visible from the board exterior.
    * **Advantage:** It is useful for high routing density.
    * **Disadvantage:** It is more expensive and needs additional fabrication operations.
4. **Microvia:** A small laser-drilled via that usually connects adjacent layers, such as Layer 1 to Layer 2.
    * **Aspect Ratio:** Use **0.8:1** depth-to-diameter only as a planning example. Obtain the approved process-specific limit from the fabricator. When one deep microvia is not allowed, use approved staggered or stacked transitions from Layer 1 to Layer 2 and then from Layer 2 to Layer 3. Get written fabrication approval for the geometry and structure. Stacked microvias can have reliability limits.
:::

:::warning The Via Stub Problem
**Via-Span Rule:** Use the full extent of the via where practical.

If a plated through-hole via connects Layer 1 to Layer 10 and the signal uses the complete span, it has no unused barrel below the destination layer.

**Problem:** If a plated through-hole via connects a signal from Layer 1 to Layer 3, the unused barrel from Layer 3 to Layer 10 is an open [transmission-line](<./03-trace-impedance.md#1-characteristic-impedance>) **stub**.

**Physics:** At a bandwidth for which the stub electrical length is significant, the stub can resonate and reflect signal energy. The risk depends on edge rate, stub length, dielectric properties, and interface loss budget. It is not set only by a frequency label such as gigahertz (GHz).

**Solutions:** Use backdrilling to remove the unused plated barrel, or use an approved blind-via or microvia construction.
:::

* **Power Vias:** Select a power-via structure from the current, inductance, temperature rise, copper plating, reliability, and fabrication requirements. Use larger plated through-hole vias where possible. Use microvias only when the approved fabrication process supports them. The approved process is the final authority.
    * **Sharing:** Where space permits, give each component or power pin at least one suitable power via. Avoid sharing when a shared via adds excessive impedance or temperature rise. A shared via can connect only the same net.
* **Current:** Use multiple vias for high-current connections when one via does not satisfy the electrical and thermal requirements. A via has finite current capacity. Use a calculator or field analysis with the actual finished-hole diameter, plating thickness, board thickness, allowed temperature rise, and airflow to find the required quantity.

---

## Chapter 7: Memory and Advanced Topologies

### 7.1 Memory Routing

* **Start:** Starting a microprocessor layout from the center can be an effective first fanout strategy. Verify that the memory, power, and package-escape constraints support this sequence.
* **Hierarchy:** Start with breakout-board layouts. Continue with microcontroller-board layouts. Move to microprocessor-board layouts after you can complete the first two types.
* **Guides:** For memory layout, follow the processor or controller guide, the memory-device data sheet, and the relevant interface specification.
* **Topologies:** Compare **fly-by** and **T-branch** topologies. Use only the topology that the controller and memory-device guidance supports.

### 7.2 Bit and Byte Swapping

:::tip Bit and Byte Swapping
Bit and byte swapping can reduce memory-routing congestion when the controller and memory documents permit it.

DDR routing can get crowded. Some controllers and memories allow particular pins to be swapped to make routing easier, but the allowed swaps depend on the devices. A Joint Electron Device Engineering Council (JEDEC) standard does not give blanket permission to swap any pins on any controller.

* **Bit Swapping:** When the controller and memory documents permit it, you can swap Data Bit 0 (`D0`) with Data Bit 1 (`D1`) in the same byte lane. The controller must use a allowed mapping so that data written on a physical bit returns on the corresponding physical bit.
* **Byte Swapping:** When the documents permit it, you can swap complete byte lanes. For example, Byte Lane 0 can contain `D0–D7`, its data-strobe signals (`DQS0`), and the relevant data-mask signal. Byte Lane 1 can contain `D8–D15`, `DQS1`, and its relevant mask signal. Keep all required lane members together.
* **Constraint:** In general, do not swap address or command lines. In general, do not swap bits between different byte lanes. For example, do not swap `D0` with `D9`. The controller, package, board, and memory documents are the final authority.
:::

### 7.3 Analog Layout

* **Functional Partition:** Keep sensitive analog circuits away from noisy digital switching circuits when this separation reduces coupling. Physical separation is one tool, not a requirement to split ground by default.
* **Placement:** Group related analog components in a compact, quiet area. A board side or corner can be a useful starting location. Select the position from the signal path, return current, connector, reference, thermal, and shielding requirements.
* **Stackup:** If an analog circuit uses multiple layers, keep its signal and return paths close. Use continuous, low-impedance ground references between relevant signal layers. Prefer nearby layer use, such as Layers 1 and 3, instead of widely separated layers such as Layers 1 and 12.

---

## Chapter 8: Action Items and Study Checklist

Use this nine-item checklist for further study.

* [ ] **Length Matching:** Find the required tolerance for each protocol. For example, DDR4 can require tighter matching than older single-data-rate synchronous dynamic random-access memory (SDR SDRAM) implementations. Use the relevant controller and device documents.
* [ ] **Bit and Byte Swapping:** Confirm which specific bits and byte lanes the memory-controller and memory-device data sheets permit you to swap.
* [ ] **PCIe Routing:** Study **differential-pair skew** and **AC-coupling-capacitor placement** for PCIe.
* [ ] **HDI Stackup:** Read a fabricator guide, such as a Sierra Circuits or PCBWay guide, about the cost and process effects of blind and buried vias.
* [ ] **Impedance Profiles:** Learn how to set the Altium or KiCad design rules so that the tool uses the approved stackup to calculate the trace geometry for targets such as **50 Ω** and **90 Ω**.
* [ ] **Microvias:** Review **Deep Dive: Via Types**. Confirm the fabricator aspect-ratio and structure limits, and understand why a microvia cannot be arbitrarily deep.
* [ ] **Reference Plane vs. Crosstalk:** Apply the concept from Section 2.3. A close reference plane pulls more field lines toward the plane and reduces their spread toward adjacent tracks.
* [ ] **Uncoupled Lengths:** Verify the allowed uncoupled length for each differential interface and apply the definition in Section 5.2.
* [ ] **Via Types:** Compare microvias, plated through-hole vias, blind vias, and buried vias. Select a type from the electrical, reliability, density, and fabrication requirements.

---

## Technical References

These primary references provide additional constraints for the design rules in this guide:

* [Texas Instruments, *High-Speed Layout Guidelines*](https://www.ti.com/lit/an/scaa082a/scaa082a.pdf)
* [Texas Instruments, *High-Speed Interface Layout Guidelines*](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf)
* [IPC-7352, *Generic Guideline for Land Pattern Design* — scope](https://www.ipc.org/TOC/IPC-7352-TOC.pdf)
* [Texas Instruments, *ESD Protection Layout Guide*](https://www.ti.com/lit/an/slva680a/slva680a.pdf)
* [Texas Instruments, *MLTLDO2EVM-037 Evaluation Module* — mounting-hole connection example](https://www.ti.com/lit/pdf/SBVU065)
* [IPC, *IPC Issues Electronics Industry Warning on Printed Board Microvia Reliability for High Performance Products*](https://www.ipc.org/news-release/ipc-issues-electronics-industry-warning-printed-board-microvia-reliability-high)
* [Texas Instruments, *Best Practices for Board Layout of Motor Drivers* — via-current guidance](https://www.ti.com/lit/an/slva959b/slva959b.pdf)
* [NXP Semiconductors, *Hardware and Layout Design Considerations for DDR4 SDRAM Memory Interfaces*](https://www.nxp.com/webapp/Download?colCode=AN5097)
* [Texas Instruments, *Digital Isolator Design Guide*](https://www.ti.com/lit/pdf/SLLA284)
* [Analog Devices, *Should the digital and analog GND planes on my board be separated?*](https://www.analog.com/en/resources/faqs/faq_dds_digital_and_analog_gnd_planes.html)


import LearningEquation from '@site/src/components/LearningEquation';


## BGA Planning Supplement

The following notes extend the study checklist with guidance from **AMD UG1099, revision 2.1**. They concern the device families covered by that guide.

### Package Pitch and Landing Pads

**Pitch** is the center-to-center distance between adjacent balls. A smaller pitch leaves less space for routes and vias.

AMD recommends **non-solder-mask-defined (NSMD)** landing pads for the covered devices. In an NSMD pad, the copper edge defines the solder land.

In a solder-mask-defined pad, the mask overlaps the copper. Use the package-specific footprint and assembly requirements before selecting either structure.

Source: [AMD, BGA overview and landing pads](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/General-BGA-and-PCB-Layout-Overview).

### Count Routing Channels

For a full square array with **n** ball positions along each side, AMD's simple channel count is:

<LearningEquation tex={"N_{channels}=4(n-1)"} />

For an early estimate, the guide assumes about 60% of the balls are signal connections in the packages it covers. Use the actual number of signals your design needs once you know it.

**Original planning example:** An 18-by-18 array has **68 channels**. Assume that 194 signals need escape routing.

If each channel carries one route, dividing the signal count by the routing capacity gives **2.85 layer-equivalents**. Round up to **3 signal layers** as an initial estimate.

This count does not guarantee that you can route the board. Fixed pin positions, blocked channels, reference-plane needs, and power routing may force you to add layers.

Source: [AMD, layer-count estimation](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Layer-Count-Estimation-and-Optimization).

### Check the Space Between Pads

The following geometry is an original straight-channel check. It does not replace the package breakout drawings.

For pad pitch **p**, pad diameter **d**, trace width **w**, clearance **s**, and **m** traces:

<LearningEquation tex={"g=p-d\\qquad m w+(m+1)s\\le g"} />

The inequality checks whether all the traces, plus the required spaces between them and the pads, fit inside the available gap **g**.

import BgaEscapeExplorer from '@site/src/components/BgaEscapeExplorer';

<BgaEscapeExplorer />

**Example:** With 0.8 mm pitch and 0.4 mm pads, the gap is **0.4 mm**.

Two 0.08 mm traces and three 0.08 mm clearances need **0.4 mm**. They fit exactly at those nominal dimensions, leaving no spare room if the process needs more clearance.

AMD's dimensional tables contain package and process assumptions. Check units against the original drawing before transferring a table value.

The guide identifies [via-in-pad](<./04-Manufacturing-and-Test.md#via-treatment-and-defects>) as an option when conventional fine-pitch via escape becomes impractical.

Source: [AMD, pad, via, and trace dimensions](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Recommended-BGA-Ball-Pad-Via-and-Trace-Dimensions-for-1.0-mm-0.92-mm-0.8-mm-and-0.5-mm-Devices).

### Select Via Construction Early

Blind vias stop at an internal layer. Buried vias connect internal layers. These structures can release routing space but require different fabrication steps.

A **via-in-pad** structure places the via within the landing pad. Agree on filling, plating, and final surface requirements with the fabricator and assembler.

A via's layer span and its position in a pad are different things. Putting a via in a pad does not automatically make it a microvia.

Source: [AMD, fabrication technologies](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Fabrication-Technologies).

### Board Thickness and Aspect Ratio

Before comparing aspect ratios, check which diameter is being used. The drilled hole is larger than the finished opening after plating.

<LearningEquation tex={"Aspect\\ ratio=\\frac{drilled\\ depth}{drill\\ diameter}"} />

**Original example:** A 1.6 mm through-hole depth and 0.2 mm drill diameter give **8:1**.

This arithmetic does not prove process approval. Obtain the allowed ratio for the actual via structure.

Source: [AMD, board thickness and aspect ratio](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Maximum-Board-Thickness-and-Aspect-Ratio).

### Power Delivery Through the Via Field

Clearances around vias can leave narrow strips of copper in a power plane. Those strips can restrict how much current reaches power balls near the center of the package.

AMD gives a preliminary estimate of **0.05 A per mil of channel width for 0.5 oz copper**. This is a guide-specific planning estimate.

**Original arithmetic example:** A 6 mil channel gives **0.3 A** with that estimate. Ten identical channels give **3 A** only if current distributes evenly.

Check voltage drop, temperature, plane geometry, and current distribution separately. Do not use this estimate as a universal copper-current rating.

Source: [AMD, FPGA power delivery](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Power-Delivery-to-the-FPGA).

### Answers to the Study Checklist

1. **Length matching:** Convert the interface time budget to length with the approved layer delay. Include package delay where the controller guide needs it.
2. **Bit and byte swapping:** Create a permitted-swap table from the exact controller and memory documents. Keep each required strobe and mask with its lane.
3. **PCIe routing:** Record lane skew, loss, termination, and coupling requirements for the selected generation and device. Component placement must preserve pair symmetry.
4. **HDI stackup:** Compare approved via spans, lamination cycles, reliability requirements, and fabrication quotations before selecting high-density interconnect construction.
5. **Impedance profiles:** Enter the approved stackup into the design tool. Calculate width and pair spacing, then assign those dimensions to the relevant routing rules.
6. **Microvias:** Check depth, diameter, stacking, filling, and qualification with the fabricator. A through-hole aspect-ratio limit does not apply automatically to a microvia.
7. **Reference plane and crosstalk:** Keep a nearby continuous reference. Evaluate adjacent-route spacing and coupled length together.
8. **Uncoupled lengths:** Account for each separation near pads, vias, and components. Check the total against the interface's specific requirement.
9. **Via types:** Compare electrical discontinuity, unused stub, routing area, process cost, and reliability before selecting the structure.

These answers provide a method. Exact device pin swaps and interface tolerances remain specific to the selected hardware.

**Implementation references:** [KiCad calculator tools](https://docs.kicad.org/9.0/en/pcb_calculator/pcb_calculator.html), [TI interface routing guidance](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf).

### Use the Breakout Examples

Compare the intended pin map with AMD's [1.0 mm, 0.92 mm, and 0.8 mm examples](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Sample-Breakouts-for-1.0-mm-0.92-and-0.8mm-Pitch-Devices).

The [0.5 mm example](https://docs.amd.com/r/en-US/ug1099-bga-device-design-rules/Sample-Breakout-for-0.5-mm-Pitch-Devices) uses a specific UBVA530 package. Treat it as an example, not a substitute footprint.

Check signal escape and power access on every used layer before fixing the final layer count.
