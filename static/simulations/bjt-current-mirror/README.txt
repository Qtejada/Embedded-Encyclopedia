BJT CURRENT MIRROR - LTspice learning example

1. Extract this ZIP into one folder.
2. Open bjt-current-mirror.asc in LTspice.
3. Select Run. The matching .plt file selects the three current traces.
4. If no traces appear, use Plot Settings > Open Plot Settings File and select
   bjt-current-mirror.plt, or add Ic(Q2), Ic(Q1), and I(RREF) manually.
5. The three stepped resistor values are 2.2k, 4.3k, and 8.2k ohms.
   Use View > Step Legend to identify the stepped runs.

Q1 and Q2 are matched NPN teaching models declared inside the schematic.
They are not vendor models for a production transistor. No additional
model download is required. The schematic uses standard LTspice symbols.
The .cir file is an optional equivalent text netlist with no library includes.

VCC is 5 V. VTEST sweeps the output node from 0 to 5 V in 10 mV steps.
VTEST is a test fixture that imposes collector voltage. It is not an
extra source required by a working mirror. A practical load connects
between its supply and OUT while Q2 sinks current.

Expected output current with Rref = 4.3k:
  At OUT = 1 V: approximately 0.9941 mA.
  At OUT = 5 V: approximately 1.0337 mA.

Positive Ic(Q2) enters Q2's collector. At very low output voltage, its
base-collector junction conducts and collector current can reverse.
The reference resistor supplies Q1 collector current and both base currents.
Finite Early voltage makes output current increase as output voltage rises.

The CSV contains the actual sampled DC results used by the website.
Validation details are in validation.json. Device mismatch, leakage,
self-heating, and frequency behavior are not characterized by this example.

Original educational circuit for Hardware Encyclopedia.
Prepared and verified with LTspice 24.1.9 on Windows.
