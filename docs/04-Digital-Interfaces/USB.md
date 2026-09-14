# USB


## 1. Connector, Data, and Power

**Universal Serial Bus (USB)** defines host-controlled communication and related electrical requirements. A connector shape does not identify every supported USB function.

Keep three choices separate:

* **Connector:** The physical connection, such as a Type-C receptacle.
* **Data interface:** The supported signaling generation and transfer functions.
* **Power interface:** The source, sink, and allowed power behavior.

A Type-C connector does not guarantee high-speed data or USB Power Delivery support.

## 2. Device Operation

When a device is attached, the host reads its descriptors, which tell the host what the device is and what it supports. The host then configures the functions it will use.

**Endpoints** are logical data sources or destinations in the device. The device class and firmware define the data behavior.

This identification and setup process is called enumeration. The wires can be connected correctly and enumeration can still fail because of firmware, incorrect descriptors, clock accuracy, or power behavior.

## 3. Type-C Configuration

The **configuration channel (CC)** lets USB-C devices detect a connection and which way the plug is inserted. A power source and a power sink use different electrical connections on CC so their roles can be identified.

For a sink receptacle, check both CC pins. Do not connect them together. Use the required terminations or a suitable controller.

Before drawing more than the default power, the device must detect what the source offers or negotiate the required power. The connector's shape does not tell you how much current is available.

## 4. Board Layout

For USB 2.0, route **D+** and **D−** as a [differential pair](<../05-PCB-Layout/01-Overview.md#52-length-matching-skew-control>) over a continuous reference. Use the controller's approved impedance and termination guidance.

Place low-capacitance protection near the connector. Avoid long test-point branches and unnecessary layer transitions.

USB 2.0 data lines and SuperSpeed lanes do not use the same coupling circuits. Check the interface documents before copying series capacitors from one type of link to the other.

## 5. Worked Example: Power Budget

**Assumptions:** A verified source permits 5 V at 0.5 A. The board needs 1.6 W. Its regulator has 80% efficiency.

1. Required input power is **2 W**.
2. Average input current is **0.4 A**.
3. The arithmetic leaves **0.1 A** for other input loads and margin.

Startup, cable drop, and suspend behavior need separate checks. This example does not prove USB current entitlement.

## 6. Verification

Test attachment in both connector orientations. Check enumeration, cable variation, reset, suspend, and startup current.

**References:** [TI, Type-C and Power Delivery primer](https://www.ti.com/lit/wp/slyy109b/slyy109b.pdf), [TI, interface layout](https://www.ti.com/lit/an/spraar7j/spraar7j.pdf).
