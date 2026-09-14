---
title: Manufacturing and Test
sidebar_position: 6
---

# Manufacturing and Test

## Board construction

A **printed circuit board (PCB)** supports components and connects them through patterned conductors. It gives repeatable geometry for power, signals, and mechanical assembly.

A solderless breadboard is easy to change, but its contacts, stray capacitance, and inductance can be unpredictable. A soldered prototype board makes the contacts more reliable, though its wiring still lacks the controlled geometry of a designed PCB.

Point-to-point wires suit simple prototypes or special connections. An integrated circuit forms devices within semiconductor material. A PCB connects packaged devices at a larger scale.

Copper normally forms the conductive layers. It combines good conductivity with useful cost and manufacturing properties. Gold commonly protects contact surfaces rather than replacing all copper.

**FR-4** is a flame-retardant glass-reinforced epoxy material grade. It does not specify one exact dielectric constant or loss value.

Special laminates can reduce radio-frequency loss or improve thermal behavior. Select actual material data at the operating frequency and temperature.

**Solder mask** covers selected copper areas and helps prevent solder bridges. Green is common, but other colors are available.

The **legend**, often called silkscreen, identifies parts and connections. Keep markings clear of solderable surfaces and inspection areas.

A rigid board holds a fixed shape. A flex circuit commonly uses a flexible polymer such as polyimide. Rigid-flex construction combines both.

A flexible PCB can replace connectors and fit parts that move. Its design must account for bend radius, strain in the copper, stiffeners, and how often it bends.

## Fabrication sequence

A typical multilayer process uses these major steps. The exact order depends on the via and stackup technology.

1. Image and etch inner copper layers.
2. Inspect the inner patterns.
3. Laminate cores, bonding material, and outer copper.
4. Drill holes and prepare their walls.
5. Deposit and plate conductive hole walls.
6. Pattern outer copper and apply mask, finish, and legend.
7. Route the outline and perform electrical inspection.

**Panelization** groups boards for efficient processing. Tooling rails and breakaway features support handling and assembly.

**Mouse bites** are perforated breakaway tabs. They leave a rough edge after separation. Keep stressed components away from the break area.

**Fiducials** are optical reference marks. Assembly equipment uses them to align the panel or a fine-pitch component.

See the [Eurocircuits fabrication sequence](https://www.eurocircuits.com/technical-guidelines/pcb-manufacturing-technology/making-a-pcb-pcb-manufacture-step-by-step/).

## Via treatment and defects

A **plugged via** has material that closes an opening to a specified extent. A **filled via** has fill material through the intended hole volume.

A filled and capped via can form part of a solderable pad if the fabrication process is designed for it. Filling the hole alone does not guarantee a flat surface that can be soldered.

Specify the required treatment rather than relying on the word plugged. See [IPC-4761 via protection structures](https://www.eurocircuits.com/content/uploads/2024/05/IPC-4761.pdf).

Thermal cycling can crack a plated barrel or a via interface. Poor plating, voids, and registration errors can cause opens or intermittent connections.

Use via aspect ratios and layer structures that the fabricator has qualified. Closely spaced antipads, the clearances around vias, can cut into a plane's current paths. Inspect the remaining copper, not just the number of vias.

## Assembly

Surface-mount parts attach to pads. Through-hole leads pass through plated holes. Through-hole parts can offer strong mechanical attachment but consume routing space.

For surface mounting, a stencil deposits solder paste. A pick-and-place machine positions components. A reflow profile melts the solder and forms joints.

An efficient assembly program groups component pickup and placement to reduce machine travel while maintaining accuracy. Panel layout and component orientation can help with this.

For double-sided assembly, the process normally places and reflows one side before the other. Component mass and retention determine whether additional support is necessary.

Wave soldering moves the board across molten solder. Selective soldering targets defined joints. Mixed assembly can combine reflow with selective, wave, or manual soldering.

**Tombstoning** lifts one end of a small component. Unequal wetting forces can cause it. Balanced pads, paste, and heating reduce the risk.

See [Eurocircuits assembly technology](https://www.eurocircuits.com/technical-guidelines/assembly-manufacturing-technology/) and [tombstoning causes](https://www.eurocircuits.com/technical-guidelines/pcb-assembly-guidelines/tombstoning/).

## Inspection and test coverage

| Method | Main coverage | Main limitation |
| --- | --- | --- |
| Bare-board electrical test | Opens and shorts against the netlist | Does not test assembled function |
| Automated optical inspection (AOI) | Visible placement, polarity, and joint features | Hidden joints and electrical behavior remain uncertain |
| X-ray inspection | Hidden solder geometry and selected voids | Does not prove electrical operation |
| In-circuit test (ICT) | Accessible nets and component measurements | Parallel paths and limited access can reduce coverage |
| Flying probe | Flexible electrical access without a dedicated full fixture | Sequential probing limits throughput |
| Bed-of-nails fixture | Fast access to many prepared test pads | Fixture cost, wear, and pad access |
| Functional test | Powered behavior under defined conditions | Only the exercised functions and conditions |

An assembly line can include paste inspection, AOI, programming, ICT, functional test, and final inspection. Select stations from failure risk and production volume.

See [Eurocircuits bare-board testing](https://www.eurocircuits.com/bare-board-testing/) and [final inspection limits](https://www.eurocircuits.com/technical-guidelines/assembly-manufacturing-technology/the-final-inspection/).

## Design for access

**Design for manufacture (DFM)** aligns a design with the supplier's process. **Design for test (DFT)** gives access and control for planned measurements.

Prioritize power rails, ground references, reset, programming, clocks, and critical interfaces. Expose enable or isolation controls that help distinguish faults.

Test points can be bare pads, loops, headers, or connectors. Match pad size, spacing, access side, and support to the probe fixture.

A long test stub can damage a high-speed signal. Prefer a short controlled access structure or an approved probe pad. Sensitive analog nodes also need low loading.

Place a ground connection near each fast signal measurement. A large probe loop adds inductance and captures interference.

For prototypes, provide removable links, spare footprints, and recovery access where useful. Remove unnecessary stubs only after the final test plan is secure.

**Design rule checks (DRC)** compare layout geometry with configured rules. They do not prove schematic correctness, thermal performance, or complete test coverage.

## Rework

**Rework** corrects or changes an assembled board. Examples include replacing a component, repairing a connection, or adding a controlled wire modification.

Provide tool clearance and heat access around parts likely to need replacement. Thermal reliefs reduce heat flow into large planes and can simplify soldering.

Excessive heat or repeated cycles can lift pads, damage laminate, or harm nearby parts. Use a documented process and inspect the result.

Record each modification against the board revision. Repeat the relevant electrical and functional tests after rework.


## Related topics

- [PCB Layout](./01-Overview.md) covers stackup, placement, vias, and [BGA escape](<./01-Overview.md#61-bga-fanout-strategy>).
- [Semiconductor Fabrication and Packaging](./05-Packaging.md) covers die and package connections.
- [Measurement and Debug](../00-Foundations/05-Measurement-and-Debug.md) covers electrical [fault isolation](<../00-Foundations/05-Measurement-and-Debug.md#fault-isolation-and-validation>).
