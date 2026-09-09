# Ethernet

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. MAC, PHY, and Cable

An Ethernet interface has several functions. The **media access controller (MAC)** handles Ethernet frames. The **physical-layer device (PHY)** converts between digital interface signals and cable signals.

For conventional twisted-pair Ethernet, magnetics connect the PHY to the cable interface. Select the magnetics from the PHY and interface requirements.

Single-pair Ethernet and other physical layers can use different circuits. The following layout notes concern conventional transformer-coupled ports.

## 2. Two Sides of the PHY

The processor-to-PHY interface can use a parallel or serial connection. Examples include the **reduced media-independent interface (RMII)** and other device-supported interfaces.

The cable side has separate differential pairs and termination requirements. A rule for the processor side does not automatically apply to the cable side.

The management interface configures and reads the PHY. Verify its address, reset state, and configuration straps.

import InterfacePathDiagram from '@site/src/components/InterfacePathDiagram';

<InterfacePathDiagram mode="ethernet" />

## 3. Layout Priorities

1. Place the PHY, magnetics, and connector to keep cable-side routes short.
2. Follow the PHY's center-tap, bias, and termination circuit.
3. Preserve differential geometry and a suitable reference where required.
4. Keep the isolation barrier free of unintended copper connections.
5. Place decoupling near supply pins and keep clock routes away from cable pairs.

Check the connector shield and chassis connection as part of the complete enclosure design.

## 4. Worked Example: Payload Efficiency

**Assumptions:** A 100 Mbit/s link sends one untagged frame with a 1500-byte payload. Include 14 header bytes, 4 check bytes, and 12 gap byte times. The preamble and start delimiter occupy 8 more bytes.

<LearningEquation tex={"Efficiency=\\frac{1500}{1538}\\approx97.5\\%"} />

The ideal payload rate is approximately **97.5 Mbit/s**. Higher-layer headers, shorter frames, and software delays reduce application throughput.

This calculation concerns link occupancy. It does not set the required processor-interface clock.

## 5. Verification

Check PHY identity, negotiated speed, duplex, link status, and error counters. Test sustained traffic through the intended cable and connector.

**References:** [TI, Ethernet PHY layout checklist](https://www.ti.com/lit/an/snla387/snla387.pdf), [Intel, Ethernet MAC frame structure](https://cdrdv2-public.intel.com/705253/ug_ethernet-19-2-0-683402-705253.pdf).
