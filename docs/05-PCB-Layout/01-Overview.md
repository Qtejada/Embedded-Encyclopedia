---
title: The PCB Designer's Field Guide
sidebar_label: PCB Field Guide
---

# The PCB Designer's Field Guide
*A Comprehensive Manual for Layout & High-Speed Design*
*Source: Phil's Lab Notes & Best Practices*

---

## Chapter 1: The Blueprint (Schematic Capture)

### 1.1 Organization & Navigation
* **Naming:** Name pages by page number and a specific description of what is on the page (e.g., "03_Power_Regulation"). Make it easy to find.
* **Connectivity:** On your ports, have what page it is supposed to go to.
* **Revisions:** Have rev name in both PCB and schematic project names.
* **Cover Page:** Create a cover page in schematic with an index and stuff.
    * Create a block diagram page for your schematic.
    * Have a revision block that notes what happened between revisions.
* **Context:** Add titles to chunks of the schematic.
* **Notes:** Place note boxes to describe certain things like layout, critical notes, informational, cautionary stuff.

### 1.2 Net Naming Rules
* **Power Rails:** Always use `+` sign in front of power net name. Helpful for PCB net grouping.
* **Voltage Levels:** Use the voltage level for all power net names, even if it's hard to fit.
    * *Example:* `+1V2_ETH_POWER`

### 1.3 Verification
* **Parameter Check:** Have parameters for if the schematic symbol and PCB symbol were checked to keep track of what has been verified.

---

## Chapter 2: The Foundation (Stackup & Layers)

### 2.1 The Stackup Strategy
* **Plane Definition:** A plane is just 1 net.
* **Start Point:** Start with 4 signal layers: top, bottom, 2 in the middle.
* **EMI Shielding:** Ground layers should reach the edge of the boards, power planes should be a bit deeper inside to reduce EMI.

### 2.2 Recommended Stackups
**12-Layer Stackup:**
1.  Signal
2.  Ground solid plane
3.  High speed signals and important buses
4.  Ground solid plane
5.  Power
6.  Power or mixed with signals
7.  Power or mixed with signals
8.  Power
9.  Ground solid plane
10. Signal with high speed or important buses
11. GND solid plane
12. Signal

**10-Layer Stackup:**
1.  Signal
2.  Ground solid plane
3.  Signal
4.  Optional signal
5.  Power solid plane
6.  Power or mixed with signals
7.  Power or mixed with signals
8.  Power solid plane
9.  Optional signal
10. Signal
11. Ground solid plane
12. Signal

**6-Layer Stackup:**
1.  Signal
2.  Ground solid plane
3.  Signals
4.  Power
5.  Ground solid plane
6.  Signal

**4-Layer Stackup:**
1.  Important Signals
2.  Solid ground plane
3.  Power
4.  Signal

### 2.3 High-Speed Physics
* **Dielectric Thickness:** Try to have dielectric width between ground and high-speed signals very small.
    * *Benefit:* Good for crosstalk reduction.
* **Crosstalk Physics:** Reducing conductor height reduces crosstalk. More layers means less crosstalk. Distance between tracks too.
    * *Note:* Crosstalk does not depend on frequency, depends on signal rise time. Faster rise time generates more noise.
    * *Reference Planes:* Look up the correlation between reference planes and crosstalk. Ground is the best reference plane. A closer reference plane "pulls" the field lines tighter to the ground.

:::info Deep Dive: HDI Stackups
You noted to "Read HDI Stackup Guide." **High Density Interconnect (HDI)** involves using **Microvias** (laser drilled, blind/buried).
* **Standard:** Through-hole vias go top to bottom.
* **HDI:** Vias can go Layer 1-2, or 2-3.
* **Why use it?** Essential for high-pin-count BGAs where there is no physical room to drill a hole all the way through the board without hitting other pins.
:::

---

## Chapter 3: Component Placement Strategy
*Placement: Start out with laying out your largest components.*

### 3.1 Mechanical & Critical Constraints
* **Mechanical First:** Place mechanical stuff first (mounting holes, connectors, etc.).
    * *Warning:* Pay attention to the cables that will be connecting. They can be big.
* **Mounting Holes:** Mounting holes go to board ground.
* **Outlines:** Make component outline a little bit bigger than recommended so you have no manufacturing errors. Make outlines very clear for every component (including connectors) so it's impossible to mess up during manufacturing.

### 3.2 Thermal & DFM Rules
* **Heat Management:** CPUs get hot unlike most MCUs. Place components that get hot on the top; heat rises. Plan for heat sinks if needed.
* **Height:** Keep in mind of component heights. Taller components should be up top.
* **CPU Space:** Give space for CPU and memories. You'll learn how much space as you get more experience.

### 3.3 Critical Component Rules
* **Power Supplies:** Read PCB layout guidelines especially for power supplies. When routing power supply, be careful of what you're routing under it in different layers. Your stack up gotta be clean to make sure that routing from other sources doesn't disturb the supply.
* **Decoupling Caps:** Place decoupling caps near power pins.
* **Passives:**
    * 0 ohms, beads, ferrites: Close to power pins/decoupling caps/planes.
    * Precise resistors/caps: Use short tracks.
    * Series termination resistors/caps: Place close to output pins.
* **Crystals/Oscillators:** Place close to pins. Keep crystal tracks as short as possible.
    * *Rule:* Do not route under crystals. Do not route under or between component pads as much as possible.
* **Connectors:** Use through-hole connectors when you can. Less volatile.

:::danger ESD Placement Rule
* **Location:** ESD protection should be close to the connector/source of where the static will occur.
* **Why:** The thing can blow before it reaches your ESD if you put it in the middle of the board.
:::

---

## Chapter 4: The Routing Workflow

### 4.1 Phase 1: Connecting all the pins
1.  Set up basic rules.
2.  Set up a basic stackup.
3.  Do fanout under CPU.
4.  Do preliminary memory layout.
5.  Do fanout under other BGAs.
6.  Do CPU fanout for big and wide buses; do fanout in the way of these and route them.
7.  Do CPU fanout of differential pairs; do fanout in the way of these, route them.
8.  Do rest of CPU fanout.
9.  Do fanout for all components.
10. Connect long buses.
11. Do local connections.
12. Connect rest of the signals.

*Note on Vias:* Always place your vias out on the board before doing the layout. All ground and power vias should be placed before doing tracks so you don't later have to redo connections because you didn't leave enough space.

### 4.2 Phase 2: Improving your layout
1.  Set the real stackup.
2.  Set the real differential pair rules, redraw all differential pairs.
3.  Do preliminary memory length matching.
4.  Do preliminary diff pair length matching.
5.  Do preliminary length matching of other signals.
6.  Improve & spread all the tracks.
7.  Clear all Electrical DRC.
8.  Create power planes & polygons, check high current tracks.
9.  Check all the nets one-by-one.
10. Add stitching VIAs.
11. Do final length matching (except memory).
12. Do memory final length matching.
13. Lock down important tracks.
14. Clear rest of DRCs.
15. Add Company name, Copyright, Year, Board name & Version.
16. Add manufacturing information.
17. Adjust track width to achieve 50 OHM impedance.

---

## Chapter 5: High-Speed Design Rules

### 5.1 Impedance Control
* **Rule:** Maintain single-ended and differential pair impedance.
* **How:** Within your design rules, you will get the suggested impedance. Within your software (Altium or KiCad), find the dimensions for track geometry to get that impedance.
* **Minimums:** Minimum mm is 0.2mm usually because impedance for high-speed signals needs 50/55ohm impedance (board dependent).

### 5.2 Length Matching (Skew Control)
* **Diff Pairs:** Differential pairs should have large gaps between them and other data signals.
* **Within Pair:** Diff pairs should be the exact same length, on every layer.
* **Technique:**
    * Making one big "bump" to the shorter track is usually best, rather than a bunch of little bumps.
    * Width of the bump should not exceed 3 times your track width.
    * Best way is to travel a bit behind the via then match it, no need for a bump.
    * **Geometry:** Bad matching would be using 90-degree angled bumps. Always route lines together. Distance between bumps should be separated (like hills, not a maze). Bumps should not be tight.
    * **Wave Spacing:** Don't just snake it. Keep waves separated. **5x track width is perfect**.
* **Global Rule:** Always length match buses and diff pairs. Check design guide for minimum/maximum track length and tolerance.
* **Memory:** Certain pins on DDR memory require length matching.

:::info Clarification: What are Uncoupled Lengths?
You asked: **"What are uncoupled lengths?"**

When you route a **Differential Pair** (e.g., USB D+/D-), the two wires are coupled together tightly. However, when they get near a pin or a via, they often have to split apart to enter the pad.
* **Uncoupled Length:** The distance the two distinct positive and negative traces run *without* being parallel/coupled.
* **The Risk:** During this length, they lose their defined differential impedance (e.g., 90&Omega;) and become two single-ended traces (e.g., 50&Omega; each). This causes reflections.
* **Goal:** Minimize uncoupled length (keep them zipped up tight until the very last millimeter).
:::

### 5.3 Crosstalk & Separation
* **Parallel Tracks:** Be aware of tracks running in parallel. Try not to have tracks be in parallel on different layers.
    * *Strategy:* Have 1 set of signals on 1 layer be horizontal, and the other be vertical so they cross.
* **Isolation:** Keep other diff pairs away from each other. Clocks should have a relatively big distance away. Asynchronous signals like interrupt and reset should be fairly isolated.
* **I2C:** I2C pairs should have some space between them to reduce crosstalk (they are not diff pairs).
* **IC Pads:** Gap between pads should never be shorter than the original packaging. Accommodate to the package's pin sizes and keep that distance the same.

### 5.4 Return Paths
* **Stitching Vias:** Use stitching vias for keeping the same reference planes when diff pairs are going across layers.
    * *Rule:* If signal changes reference plane (e.g., Layer 1 [GND ref] to Layer 4 [Power ref]), you need stitching vias to connect the 2 reference planes.
    * *Placement:* Must be very close to the signal vias. 1 stitching via per track that changes reference plane.
* **Plane Integrity:** **Do not cross planes.** Breaking your solid reference plane will mess up your current flow and cause issues. Keep reference planes/ground planes as complete as possible.

### 5.5 Routing Logistics
* **Groups:** Do routing in groups (e.g., all PCIe signals first). Keeps groups on the same layer.
* **Topology:** Route signal groups by same topology. All SD card tracks should go to the same layers.
* **Layer Switching:** When drawing tracks that switch layers, it's better to place the via later. Route out signals on 1 layer, then the other, then connect with a via where appropriate.
* **Crossing:** Best way to deal with lots of crossing is straight lines on both sides into 1 via directly onto each other.
* **Edge Rule:** Don't route near PCB edge or hole.
* **Angles:** Do not use 90-degree angles.

---

## Chapter 6: Via Technologies & BGA Fanout

### 6.1 BGA Fanout Strategy
* **Sequence:** Start from the center and move OUT from the package. Via + tracks should be moving to the edge.
* **Columns:** For BGA vias/fanout, when in the middle, make them into columns if you can. Lets you place components between them on the other side.
* **Edges:** If on the edge, make it so all pins can escape without using more vias.
* **Density:** 1 Via per pin. Preferable is 1 via per pin. If no other way, share the via.

### 6.2 Via Technology Guide

:::info Deep Dive: Via Types
You asked to learn the difference between these types:

1.  **Through-Hole Via:** Drilled all the way from Top to Bottom.
    * *Pro:* Cheap, easy.
    * *Con:* Takes up space on *every* layer, even if you only connect Layer 1 to 2.
2.  **Blind Via:** Connects an outer layer to an inner layer (e.g., Top to Layer 3) but stops there.
    * *Pro:* Saves space on bottom layers.
    * *Con:* Expensive.
3.  **Buried Via:** Connects inner layers only (e.g., Layer 3 to 4). Invisible from the outside.
    * *Pro:* Great for high density.
    * *Con:* Expensive.
4.  **Microvia:** A tiny laser-drilled via, usually connecting only one layer down (e.g., Layer 1 to 2).
    * *Aspect Ratio:* The depth cannot exceed the width (usually 0.8:1). This is why you often "staircase" them (Layer 1-2, then 2-3) rather than drilling deep.
:::

:::warning The Via Stub Problem
**Rule 9 Mentioned:** "Use the full extent of the via."

If a Through-Hole via connects Layer 1 to Layer 10, the signal travels the full length. Good.
**The Problem:** If you use a Through-Hole via to connect Layer 1 to Layer 3, the rest of the via (Layer 3 to 10) is a dead end called a **Stub**.
**Physics:** At high frequencies (GHz), this stub acts as a resonant antenna, reflecting signal energy back and destroying signal integrity.
**Solution:** Backdrilling (drilling out the unused copper) or using Blind vias.
:::

* **Power Vias:** Use bigger vias, use only through-hole vias when you can. Micro vias semi-allowed, but mostly through-hole.
    * *Sharing:* As much as you can, do not share power vias. Each component gets its own via, at least one.
* **Current:** Place multiple vias when working with high currents. Vias can only handle so much. Use calculator to find out how many are needed.

---

## Chapter 7: Memory & Advanced Topologies

### 7.1 Memory Routing
* **Start:** Starting microprocessor layout from the center might be best.
* **Hierarchy:** Breakout boards -> microcontroller boards -> microprocessor boards.
* **Guides:** When doing memory, follow the datasheet guide.
* **Topologies:** Flyby vs T-branch topologies. (Learn these).

### 7.2 Bit & Byte Swapping

:::tip Deep Dive: Bit & Byte Swapping
You noted: **"Learn bit and byte swapping for memory layout."**

When routing DDR memory, the routing can get extremely twisted. To make routing easier, JEDEC standards allow you to swap pins:
* **Bit Swapping:** You can swap Data Bit 0 (D0) with Data Bit 1 (D1) within the *same* byte lane. The memory controller doesn't care which bit is which, as long as it reads back the same way it wrote.
* **Byte Swapping:** You can swap the entire Byte Lane 0 (D0-D7 + DQS0) with Byte Lane 1 (D8-D15 + DQS1).
* **Constraint:** You generally **cannot** swap Address or Command lines. You generally **cannot** swap bits *between* different bytes (e.g. D0 cannot swap with D9).
:::

### 7.3 Analog Layout
* **Separation:** Analog stuff should stay separate and away from the digital parts.
* **Placement:** Place all analog stuff on one side in 1 place (ideally the corner). Keep things as quiet as possible.
* **Stackup:** If you need to use multiple layers for analog, keep it tight. Solid ground planes between signal layers. Keep layer usage close (Layers 1 and 3, not 1 and 12).

---

## Chapter 8: Action Items & Study Checklist
*These are items you flagged in your notes for further research.*

* [ ] **Length Matching:** Research how strict the tolerance needs to be for different protocols (e.g., DDR4 requires much tighter matching than SDRAM).
* [ ] **Bit & Byte Swapping:** Confirm which specific bits can be swapped on your specific memory controller datasheet.
* [ ] **PCIE Routing:** Look up "Differential Pair skew" and "AC coupling capacitor placement" for PCIe.
* [ ] **HDI Stackup:** Read a fabrication guide (like from Sierra Circuits or PCBWay) on blind/buried via cost implications.
* [ ] **Impedance Profiles:** Learn how to set up "Design Rules" in Altium/KiCad so the tool automatically calculates trace width for 50&Omega;/90&Omega;.
* [ ] **Microvias:** Review the "Deep Dive: Via Types" section above. Understand "Aspect Ratio" limitations (why you can't drill deep microvias).
* [ ] **Reference Plane vs. Crosstalk:** *Concept:* A closer reference plane "pulls" the field lines tighter to the ground, preventing them from spreading sideways to neighbor tracks. (See Section 4.3).
* [ ] **Uncoupled Lengths:** What are uncoupled lengths?
* [ ] **Via Types:** Micro-bias, through hole via, buried vias. Learn the difference.