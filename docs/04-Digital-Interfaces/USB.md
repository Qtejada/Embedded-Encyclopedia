# USB

Notes coming soon...

## 1. Connector, Data, and Power

**Universal Serial Bus (USB)** defines host-controlled communication and related electrical requirements. A connector shape does not identify every supported USB function.

Keep three choices separate:

* **Connector:** The physical connection, such as a Type-C receptacle.
* **Data interface:** The supported signaling generation and transfer functions.
* **Power interface:** The source, sink, and permitted power behavior.

A Type-C connector does not guarantee high-speed data or USB Power Delivery support.

## 2. Device Operation

A host detects an attached device and reads its descriptors. The host then configures supported functions.

**Endpoints** are logical data sources or destinations in the device. The device class and firmware define the data behavior.

An electrical connection can work while enumeration fails because of firmware, descriptors, clock accuracy, or power behavior.

## 3. Type-C Configuration

The **configuration channel (CC)** identifies attachment and orientation. A source and sink present different CC terminations.

For a sink receptacle, check both CC pins. Do not connect them together. Use the required terminations or a suitable controller.

Power above the default conditions needs the applicable detection or negotiation. Do not infer permitted current from connector appearance.

## 4. Board Layout

For USB 2.0, route **D+** and **D−** as a [differential pair](<../05-PCB-Layout/01-Overview.md#52-length-matching-skew-control>) over a continuous reference. Use the controller's approved impedance and termination guidance.

Place low-capacitance protection near the connector. Avoid long test-point branches and unnecessary layer transitions.

USB 2.0 data lines and SuperSpeed lanes have different coupling requirements. Do not copy series coupling capacitors between them without checking the interface documents.

## 5. Worked Example: Power Budget

**Assumptions:** A verified source permits 5 V at 0.5 A. The board needs 1.6 W. Its regulator has 80% efficiency.

1. Required input power is **2 W**.
2. Average input current is **0.4 A**.
3. The arithmetic leaves **0.1 A** for other input loads and margin.

Startup, cable drop, and suspend behavior need separate checks. This example does not establish USB current entitlement.

## 6. Verification

Test attachment in both connector orientations. Check enumeration, cable variation, reset, suspend, and startup current.

**References:** [TI, Type-C and Power Delivery primer](https://www.ti.com/lit/wp/slyy109b/slyy109b.pdf), [TI, interface layout](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf).
